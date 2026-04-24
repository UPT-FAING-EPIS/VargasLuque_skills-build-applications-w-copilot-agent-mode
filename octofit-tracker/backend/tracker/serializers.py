from rest_framework import serializers
from tracker.models import Team, Student, Activity


class ActivitySerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    team_name = serializers.CharField(source='student.team.name', read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'student', 'student_name', 'team_name', 'name', 'category', 'minutes', 'calories', 'created_at']
        read_only_fields = ['created_at']


class StudentSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    total_minutes = serializers.IntegerField(read_only=True)
    total_calories = serializers.IntegerField(read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'name', 'grade', 'team', 'team_name', 'total_minutes', 'total_calories']


class TeamSerializer(serializers.ModelSerializer):
    student_count = serializers.IntegerField(read_only=True)
    total_minutes = serializers.IntegerField(read_only=True)
    total_calories = serializers.IntegerField(read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'color', 'student_count', 'total_minutes', 'total_calories']
