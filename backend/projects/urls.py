from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('', views.ProjectListCreateView.as_view(), name='project-list'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('my-projects/', views.MyProjectsView.as_view(), name='my-projects'),
    path('<int:project_id>/proposals/', views.ProposalListCreateView.as_view(), name='proposal-list'),
    path('proposals/<int:pk>/', views.ProposalDetailView.as_view(), name='proposal-detail'),
    path('proposals/<int:proposal_id>/accept/', views.accept_proposal, name='accept-proposal'),
]
