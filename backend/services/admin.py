from django.contrib import admin
from .models import Service, ServiceCategory, ServiceOrder, ServiceReview

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'freelancer', 'category', 'price', 'status', 'rating', 'total_orders')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('title', 'freelancer__username')
    readonly_fields = ('rating', 'total_orders', 'created_at', 'updated_at')

@admin.register(ServiceOrder)
class ServiceOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'service', 'client', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('service__title', 'client__username')

@admin.register(ServiceReview)
class ServiceReviewAdmin(admin.ModelAdmin):
    list_display = ('service', 'client', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('service__title', 'client__username')
