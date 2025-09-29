from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Subscription, UserProfile, Review

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'user_type', 'is_verified', 'created_at')
    list_filter = ('user_type', 'is_verified', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('user_type', 'phone', 'bio', 'profile_image', 'location', 
                      'skills', 'hourly_rate', 'is_verified')
        }),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'rating', 'total_reviews', 'completed_projects']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_type', 'status', 'current_period_end', 'created_at')
    list_filter = ('plan_type', 'status')
    search_fields = ('user__username', 'user__email')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'reviewed', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('reviewer__email', 'reviewed__email')
