from django.db.models import Count, Sum
from rest_framework import viewsets, generics
from rest_framework.response import Response
from tracker.models import Activity, Student, Team
from tracker.serializers import ActivitySerializer, StudentSerializer, TeamSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('name')
    serializer_class = StudentSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.select_related('student', 'student__team').all().order_by('-created_at')
    serializer_class = ActivitySerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('name')
    serializer_class = TeamSerializer

    def get_queryset(self):
        return Team.objects.annotate(
            student_count=Count('students'),
            total_minutes=Sum('students__activities__minutes'),
            total_calories=Sum('students__activities__calories'),
        )


class LeaderboardView(generics.GenericAPIView):
    def get(self, request):
        student_leaderboard = list(
            Student.objects.annotate(
                total_minutes=Sum('activities__minutes'),
                total_calories=Sum('activities__calories'),
            )
            .order_by('-total_minutes', '-total_calories')[:10]
            .values('id', 'name', 'team__name', 'total_minutes', 'total_calories')
        )
        team_leaderboard = list(
            Team.objects.annotate(
                total_minutes=Sum('students__activities__minutes'),
                total_calories=Sum('students__activities__calories'),
            )
            .order_by('-total_minutes', '-total_calories')[:10]
            .values('id', 'name', 'color', 'total_minutes', 'total_calories')
        )
        return Response({'students': student_leaderboard, 'teams': team_leaderboard})


class SummaryView(generics.GenericAPIView):
    def get(self, request):
        teams = Team.objects.annotate(student_count=Count('students')).values('id', 'name', 'color', 'student_count')
        activity_counts = Activity.objects.values('category').annotate(count=Count('id'))
        return Response({'teams': list(teams), 'activity_counts': list(activity_counts)})
