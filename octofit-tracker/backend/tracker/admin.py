from django.contrib import admin
from tracker.models import Team, Student, Activity

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'color')
    search_fields = ('name',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'grade', 'team')
    list_filter = ('grade', 'team')
    search_fields = ('name',)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('name', 'student', 'category', 'minutes', 'calories', 'created_at')
    list_filter = ('category',)
    search_fields = ('name', 'student__name')
