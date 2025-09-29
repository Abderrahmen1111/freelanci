from django.db import models
from django.conf import settings

class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Service Categories"

class Service(models.Model):
    STATUS_CHOICES = (
        ('active', 'Actif'),
        ('paused', 'En pause'),
        ('inactive', 'Inactif'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='services')
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_time = models.IntegerField(help_text="Délai de livraison en jours")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    tags = models.JSONField(default=list, blank=True)
    images = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_orders = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class ServiceOrder(models.Model):
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('in_progress', 'En cours'),
        ('delivered', 'Livré'),
        ('completed', 'Terminé'),
        ('cancelled', 'Annulé'),
    )
    
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='orders')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='service_orders')
    requirements = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Commande #{self.id} - {self.service.title}"

class ServiceReview(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='reviews')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order = models.OneToOneField(ServiceOrder, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Avis {self.rating}/5 pour {self.service.title}"

    class Meta:
        unique_together = ['service', 'client', 'order']
