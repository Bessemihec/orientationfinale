from rest_framework import serializers
from ..models.orientation import Orientation

class OrientationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orientation
        fields = '__all__'
        