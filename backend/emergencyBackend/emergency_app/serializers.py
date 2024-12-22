from rest_framework import serializers
from emergency_app.models import NaturalDisasterModel


class NaturalDisasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaturalDisasterModel
        fields = '__all__'