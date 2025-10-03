from rest_framework import generics, status, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Service, ServiceCategory, ServiceOrder, ServiceReview
from .serializers import ServiceSerializer, ServiceCategorySerializer, ServiceOrderSerializer, ServiceReviewSerializer

class ServiceCategoryListView(generics.ListCreateAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'price', 'rating', 'total_orders']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Service.objects.filter(status='active')
        
        # Filtrer par freelancer si spécifié
        freelancer_id = self.request.query_params.get('freelancer_id')
        if freelancer_id:
            queryset = queryset.filter(freelancer_id=freelancer_id)
        
        return queryset
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Vérifier que seuls les freelancers peuvent créer des services
        if self.request.user.user_type != 'freelancer':
            raise serializers.ValidationError("Seuls les freelancers peuvent créer des services")
        
        serializer.save(freelancer=self.request.user)

class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'freelancer':
            return Service.objects.filter(freelancer=user)
        elif user.user_type == 'admin':
            return Service.objects.all()
        else:
            return Service.objects.filter(status='active')

class MyServicesView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(freelancer=self.request.user)

class ServiceOrderListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'client':
            return ServiceOrder.objects.filter(client=user)
        elif user.user_type == 'freelancer':
            return ServiceOrder.objects.filter(service__freelancer=user)
        return ServiceOrder.objects.none()

class ServiceOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceOrder.objects.all()
    serializer_class = ServiceOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
def order_service(request, service_id):
    """Commander un service"""
    if request.user.user_type != 'client':
        return Response({
            'success': False,
            'error': 'Seuls les clients peuvent commander des services'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        service = Service.objects.get(id=service_id, status='active')
    except Service.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Service non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ServiceOrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(service=service, client=request.user)
        return Response({
            'success': True,
            'message': 'Commande créée avec succès',
            'order': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'error': 'Données invalides',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

class ServiceReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        service_id = self.kwargs.get('service_id')
        if service_id:
            return ServiceReview.objects.filter(service_id=service_id)
        return ServiceReview.objects.filter(client=self.request.user)
    
    def perform_create(self, serializer):
        service_id = self.kwargs.get('service_id')
        service = Service.objects.get(id=service_id)
        
        # Vérifier que le client a commandé ce service
        if not ServiceOrder.objects.filter(
            service=service, 
            client=self.request.user, 
            status='completed'
        ).exists():
            raise serializers.ValidationError("Vous devez avoir terminé une commande pour laisser un avis")
        
        serializer.save(service=service, client=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_services(request):
    services = Service.objects.filter(status='active').order_by('-rating', '-total_orders')[:8]
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)
