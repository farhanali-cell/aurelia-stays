from rest_framework import serializers
from .models import Hotel, Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = [
            "id",
            "hotel",
            "room_type",
            "price_per_night",
            "capacity",
            "amenities",
            "image",
            "is_available",
        ]
        read_only_fields = ["hotel"]


class HotelSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)
    min_price = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "address",
            "city",
            "description",
            "staff",
            "latitude",
            "longitude",
            "star_rating",
            "rooms",
            "min_price",
            "created_at",
        ]
        read_only_fields = ["staff"]

    def get_min_price(self, obj):
        prices = obj.rooms.filter(is_available=True).values_list(
            "price_per_night", flat=True
        )
        return min(prices) if prices else None
