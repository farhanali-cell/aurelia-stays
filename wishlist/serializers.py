from rest_framework import serializers
from .models import Wishlist
from hotels.serializers import HotelSerializer


class WishlistSerializer(serializers.ModelSerializer):
    # Full hotel details nested in, so the frontend doesn't need a second
    # fetch to render the wishlist page (image, price, city, etc.)
    hotel_detail = HotelSerializer(source="hotel", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "hotel", "hotel_detail", "added_at"]
        read_only_fields = ["added_at"]
