from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('me/', views.me, name='me'),
    path('subscription/', views.subscription, name='subscription'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('profile/', views.UserDetailView.as_view(), name='user-detail'),
]
