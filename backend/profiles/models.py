from django.db import models

class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('anyone', 'Anyone'),
        ('male', 'Male'),
        ('female', 'Female'),
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=20, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    interests = models.CharField(max_length=500, blank=True, default='')
    address = models.CharField(max_length=200)
    avatar_url = models.URLField(blank=True, default='')
    preferred_gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='anyone')
    is_online = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
