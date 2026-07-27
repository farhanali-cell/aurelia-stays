from rest_framework import serializers
from .models import Hotel, Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ['hotel']

class HotelSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)

    class Meta:
        model = Hotel
        fields = ['id', 'name', 'address', 'city', 'description', 'staff', 'rooms', 'created_at']
        read_only_fields = ['staff']