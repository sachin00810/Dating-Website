from django.db import models

class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    address = models.CharField(max_length=200)
    preferred_gender = models.CharField(max_length=20, default='anyone')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
