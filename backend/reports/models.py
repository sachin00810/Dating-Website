from django.db import models
from profiles.models import UserProfile

class Report(models.Model):
    reporter = models.ForeignKey(UserProfile, related_name='reports_made', on_delete=models.CASCADE)
    reported_user = models.ForeignKey(UserProfile, related_name='reports_received', on_delete=models.CASCADE, null=True, blank=True)
    reason = models.CharField(max_length=200)
    details = models.TextField(blank=True, default='')
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.reporter.name} against {self.reported_user.name if self.reported_user else 'Unknown'}"
