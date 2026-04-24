from django.apps import AppConfig
from django.db.models.signals import post_migrate


def seed_data(sender, **kwargs):
    if sender.name != 'tracker':
        return

    from tracker.models import Team, Student, Activity
    if Team.objects.exists():
        return
    teams = [
        Team.objects.create(name='Blue Falcons', color='#1f77b4'),
        Team.objects.create(name='Red Raptors', color='#d62728'),
    ]
    students = [
        Student.objects.create(name='Ava Harper', grade=9, team=teams[0]),
        Student.objects.create(name='Mia Chen', grade=10, team=teams[0]),
        Student.objects.create(name='Jamal Rivera', grade=11, team=teams[1]),
        Student.objects.create(name='Noah Bennett', grade=12, team=teams[1]),
    ]
    Activity.objects.create(student=students[0], name='Morning Run', category='Cardio', minutes=25, calories=180)
    Activity.objects.create(student=students[1], name='Core Circuit', category='Strength', minutes=20, calories=140)
    Activity.objects.create(student=students[2], name='Team Relay', category='Cardio', minutes=30, calories=220)
    Activity.objects.create(student=students[3], name='Flex Session', category='Flexibility', minutes=18, calories=110)


class TrackerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tracker'

    def ready(self):
        post_migrate.connect(seed_data, sender=self)
