from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Subscription

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    # Accept camelCase aliases and extra fields from frontend
    userType = serializers.CharField(write_only=True, required=False)
    company = serializers.CharField(write_only=True, required=False, allow_blank=True)
    experience = serializers.CharField(write_only=True, required=False, allow_blank=True)
    acceptTerms = serializers.BooleanField(write_only=True, required=False)
    skills = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            'username', 'email', 'password', 'password_confirm',
            'user_type', 'userType', 'first_name', 'last_name',
            'phone', 'location', 'skills', 'company', 'experience', 'acceptTerms'
        )
        extra_kwargs = {
            'user_type': {'required': False},
            'phone': {'required': False, 'allow_blank': True},
            'location': {'required': False, 'allow_blank': True},
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")

        # Map alias userType -> user_type if provided
        if 'userType' in attrs and not attrs.get('user_type'):
            attrs['user_type'] = attrs['userType']

        # Default to client if still missing
        if not attrs.get('user_type'):
            attrs['user_type'] = 'client'

        return attrs

    def create(self, validated_data):
        # Remove write-only/non-model fields
        validated_data.pop('password_confirm', None)
        validated_data.pop('userType', None)
        validated_data.pop('company', None)
        validated_data.pop('experience', None)
        validated_data.pop('acceptTerms', None)

        # Normalize skills: accept comma-separated string -> list
        skills_value = validated_data.get('skills')
        if isinstance(skills_value, str):
            skills_list = [s.strip() for s in skills_value.split(',') if s.strip()]
            validated_data['skills'] = skills_list

        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Identifiants invalides.')
            if not user.is_active:
                raise serializers.ValidationError('Compte désactivé.')
            attrs['user'] = user
        return attrs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'user_type', 
                 'phone', 'bio', 'profile_image', 'location', 'skills', 'hourly_rate', 
                 'is_verified', 'created_at')
        read_only_fields = ('id', 'created_at', 'is_verified')

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ('user', 'stripe_subscription_id', 'created_at', 'updated_at')
