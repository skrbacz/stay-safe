from django.db import models

from .district import District
from .natural_disaster import NaturalDisaster


#Ready for future development
class NaturalDisasterInDistrict(models.Model):
    id = models.AutoField(primary_key=True)
    natural_disaster = models.ForeignKey(NaturalDisaster, on_delete=models.CASCADE)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return ("disaster name:", self.natural_disaster.name, "district name:", self.district.name,
                "date:", self.date)
