from django.db import models


class District(models.Model):
    district_code = models.TextField(primary_key=True, default="1602")
    name = models.CharField(max_length=250)

    def __str__(self):
        return self.name

