from django.db import models


class DisasterHistory(models.Model):
    id = models.AutoField(primary_key=True)
    disaster_id = models.ForeignKey("NaturalDisaster", on_delete=models.CASCADE)
    user_id = models.ForeignKey("User", on_delete=models.CASCADE)
    todo_list = models.CharField(max_length=1000)
    note = models.CharField(max_length=1000)
    date = models.DateTimeField(auto_now=True)