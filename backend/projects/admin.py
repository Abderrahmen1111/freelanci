from django.contrib import admin
from .models import Project, ProjectApplication, ProjectMilestone, Category, Proposal

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'freelancer', 'category', 'status', 'budget_min', 'created_at')
    list_filter = ('status', 'category', 'budget_type', 'created_at')
    search_fields = ('title', 'client__username', 'freelancer__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ProjectApplication)
class ProjectApplicationAdmin(admin.ModelAdmin):
    list_display = ('project', 'freelancer', 'proposed_budget', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('project__title', 'freelancer__username')

@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ('project', 'title', 'amount', 'due_date')  # Retirer 'is_completed'
    list_filter = ('due_date',)  # Retirer 'is_completed'
    search_fields = ('project__title', 'title')

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('project', 'freelancer', 'proposed_budget', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('project__title', 'freelancer__username')
