from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=120)
    color = models.CharField(max_length=7, default='#333333')

    def __str__(self):
        return self.name

    @property
    def total_minutes(self):
        return self.activities.aggregate(total=models.Sum('minutes'))['total'] or 0

    @property
    def total_calories(self):
        return self.activities.aggregate(total=models.Sum('calories'))['total'] or 0


class Student(models.Model):
    name = models.CharField(max_length=120)
    grade = models.PositiveIntegerField()
    team = models.ForeignKey(Team, related_name='students', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    @property
    def total_minutes(self):
        return self.activities.aggregate(total=models.Sum('minutes'))['total'] or 0

    @property
    def total_calories(self):
        return self.activities.aggregate(total=models.Sum('calories'))['total'] or 0


class Activity(models.Model):
    CATEGORY_CHOICES = [
        ('Cardio', 'Cardio'),
        ('Strength', 'Strength'),
        ('Flexibility', 'Flexibility'),
        ('Balance', 'Balance'),
    ]
    student = models.ForeignKey(Student, related_name='activities', on_delete=models.CASCADE)
    name = models.CharField(max_length=140)
    category = models.CharField(max_length=24, choices=CATEGORY_CHOICES)
    minutes = models.PositiveIntegerField()
    calories = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} ({self.student.name})'
