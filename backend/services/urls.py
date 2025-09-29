from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.ServiceCategoryListView.as_view(), name='service-category-list'),
    path('', views.ServiceListCreateView.as_view(), name='service-list'),
    path('<int:pk>/', views.ServiceDetailView.as_view(), name='service-detail'),
    path('my-services/', views.MyServicesView.as_view(), name='my-services'),
    path('featured/', views.featured_services, name='featured-services'),
    path('orders/', views.ServiceOrderListCreateView.as_view(), name='service-order-list'),
    path('orders/<int:pk>/', views.ServiceOrderDetailView.as_view(), name='service-order-detail'),
    path('<int:service_id>/reviews/', views.ServiceReviewListCreateView.as_view(), name='service-review-list'),
]
