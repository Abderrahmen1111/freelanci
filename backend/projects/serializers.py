from rest_framework import serializers
from .models import Project, ProjectApplication, ProjectMilestone, Category, Proposal
from accounts.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.get_full_name', read_only=True)
    client = UserSerializer(read_only=True)
    freelancer = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    proposals_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('client', 'created_at', 'updated_at')

    def get_proposals_count(self, obj):
        return obj.proposals.count()

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)

class ProjectApplicationSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.CharField(source='freelancer.get_full_name', read_only=True)
    freelancer = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectApplication
        fields = '__all__'
        read_only_fields = ('freelancer', 'created_at')

class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = '__all__'
        read_only_fields = ('created_at', 'completed_at')

class ProposalSerializer(serializers.ModelSerializer):
    freelancer = UserSerializer(read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = Proposal
        fields = '__all__'
        read_only_fields = ('freelancer', 'created_at', 'updated_at')

class ProjectCreateSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    proposals_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('client', 'created_at', 'updated_at')

    def get_proposals_count(self, obj):
        return obj.proposals.count()

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)

class ProjectApplicationCreateSerializer(serializers.ModelSerializer):
    freelancer = UserSerializer(read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = ProjectApplication
        fields = '__all__'
        read_only_fields = ('freelancer', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['freelancer'] = self.context['request'].user
        return super().create(validated_data)
