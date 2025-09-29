from rest_framework import serializers
from .models import Service, ServiceCategory, ServiceOrder, ServiceReview
from accounts.serializers import UserSerializer

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    freelancer = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('freelancer', 'rating', 'total_orders', 'created_at', 'updated_at')

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def create(self, validated_data):
        validated_data['freelancer'] = self.context['request'].user
        return super().create(validated_data)

class ServiceOrderSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)
    freelancer_name = serializers.CharField(source='service.freelancer.username', read_only=True)

    class Meta:
        model = ServiceOrder
        fields = '__all__'
        read_only_fields = ('client', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)

class ServiceReviewSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)

    class Meta:
        model = ServiceReview
        fields = '__all__'
        read_only_fields = ('client', 'created_at')

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)
