from django.db import models


class NaturalDisaster(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=1000)
    todo_list = models.CharField(max_length=1000)

    def __str__(self):
        return self.name
