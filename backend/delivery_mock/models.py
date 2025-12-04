from django.db import models

class MockLocation(models.Model):
    agent_id = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    is_active = models.BooleanField(default=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.agent_id} - {self.latitude}, {self.longitude}"
