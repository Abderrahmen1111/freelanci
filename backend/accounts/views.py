from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import User, Subscription
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, SubscriptionSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """Authentifie un utilisateur via email ou username et retourne des tokens JWT."""
    identifier = (request.data.get('email') or request.data.get('username') or '').strip()
    password = request.data.get('password')

    if not identifier or not password:
        return Response({'error': 'Email/username et mot de passe requis'}, status=status.HTTP_400_BAD_REQUEST)

    # Rechercher par email OU par username (insensible à la casse)
    user_obj = User.objects.filter(Q(email__iexact=identifier) | Q(username__iexact=identifier)).first()
    if not user_obj:
        return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=user_obj.username, password=password)
    if user is None:
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'userType': user.user_type,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    })

@api_view(['GET'])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
def subscription(request):
    try:
        subscription = request.user.subscription
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)
    except Subscription.DoesNotExist:
        return Response({'detail': 'Aucun abonnement trouvé'}, status=status.HTTP_404_NOT_FOUND)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
