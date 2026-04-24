from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tracker.views import ActivityViewSet, StudentViewSet, TeamViewSet, LeaderboardView, SummaryView
router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'teams', TeamViewSet, basename='team')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('api/summary/', SummaryView.as_view(), name='summary'),
]
