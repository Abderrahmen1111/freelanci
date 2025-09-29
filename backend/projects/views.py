from rest_framework import generics, status, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Project, ProjectApplication, ProjectMilestone, Category, Proposal
from .serializers import (
    ProjectSerializer, ProjectCreateSerializer,
    ProjectApplicationSerializer, ProjectApplicationCreateSerializer,
    ProjectMilestoneSerializer, CategorySerializer, ProposalSerializer
)

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjectListCreateView(generics.ListCreateAPIView):
    """Liste et création de projets"""
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'budget_type', 'status']
    search_fields = ['title', 'description', 'skills_required']
    ordering_fields = ['created_at', 'budget_min', 'deadline']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(status='published')
        if user.is_authenticated:
            if hasattr(user, 'user_type'):
                if user.user_type == 'client':
                    queryset = queryset.filter(
                        models.Q(client=user) | models.Q(status='published')
                    )
                elif user.user_type == 'freelancer':
                    queryset = queryset.filter(
                        models.Q(freelancer=user) | models.Q(status='published')
                    )
        return queryset

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        if self.request.user.user_type != 'client':
            raise serializers.ValidationError("Seuls les clients peuvent créer des projets")
        serializer.save(client=self.request.user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détail, modification et suppression d'un projet"""
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'admin':
            return Project.objects.all()
        return Project.objects.filter(client=self.request.user)

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        
        # Vérifier les permissions
        if user.user_type == 'client' and obj.client != user:
            self.permission_denied(self.request)
        elif user.user_type == 'freelancer' and obj.freelancer != user and obj.status != 'open':
            self.permission_denied(self.request)
        
        return obj
    
    def perform_update(self, serializer):
        project = self.get_object()
        user = self.request.user
        
        # Seul le client ou le freelancer assigné peut modifier
        if user != project.client and user != project.freelancer and not user.is_staff:
            raise permissions.PermissionDenied()
        
        serializer.save()
    
    def perform_destroy(self, instance):
        if self.request.user != instance.client and not self.request.user.is_staff:
            raise permissions.PermissionDenied()
        instance.delete()

class MyProjectsView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'client':
            return Project.objects.filter(client=user)
        elif user.user_type == 'freelancer':
            return Project.objects.filter(freelancer=user)
        return Project.objects.none()

class ProposalListCreateView(generics.ListCreateAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        if project_id:
            return Proposal.objects.filter(project_id=project_id)
        return Proposal.objects.filter(freelancer=self.request.user)

class ProposalDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def apply_to_project(request, project_id):
    """Postuler à un projet"""
    if request.user.user_type != 'freelancer':
        return Response({
            'success': False,
            'error': 'Seuls les freelancers peuvent postuler'
        }, status=status.HTTP_403_FORBIDDEN)

    try:
        project = Project.objects.get(id=project_id, status='published')
    except Project.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Projet non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

    if ProjectApplication.objects.filter(project=project, freelancer=request.user).exists():
        return Response({
            'success': False,
            'error': 'Vous avez déjà postulé à ce projet'
        }, status=status.HTTP_400_BAD_REQUEST)

    serializer = ProjectApplicationCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(project=project, freelancer=request.user)
        return Response({
            'success': True,
            'message': 'Candidature envoyée avec succès',
            'application': serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response({
        'success': False,
        'error': 'Données invalides',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def accept_proposal(request, proposal_id):
    try:
        proposal = Proposal.objects.get(id=proposal_id)
        project = proposal.project
        
        # Vérifier que l'utilisateur est le client du projet
        if project.client != request.user:
            return Response({'error': 'Permission refusée'}, status=status.HTTP_403_FORBIDDEN)
        
        # Accepter la proposition
        proposal.status = 'accepted'
        proposal.save()
        
        # Assigner le freelancer au projet
        project.freelancer = proposal.freelancer
        project.status = 'in_progress'
        project.save()
        
        # Rejeter les autres propositions
        Proposal.objects.filter(project=project).exclude(id=proposal_id).update(status='rejected')
        
        return Response({'message': 'Proposition acceptée avec succès'})
    except Proposal.DoesNotExist:
        return Response({'error': 'Proposition non trouvée'}, status=status.HTTP_404_NOT_FOUND)
