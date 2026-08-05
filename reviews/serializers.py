from rest_framework import serializers
from .models import Review
from bookings.models import Booking


class ReviewSerializer(serializers.ModelSerializer):
    guest = serializers.PrimaryKeyRelatedField(read_only=True)
    guest_username = serializers.CharField(source="guest.username", read_only=True)
    hotel_name = serializers.CharField(source="booking.room.hotel.name", read_only=True)
    room_type = serializers.CharField(
        source="booking.room.get_room_type_display", read_only=True
    )

    class Meta:
        model = Review
        fields = [
            "id",
            "booking",
            "guest",
            "guest_username",
            "hotel_name",
            "room_type",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["guest"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_booking(self, booking):
        request = self.context["request"]

        if booking.guest != request.user:
            raise serializers.ValidationError("You can only review your own bookings.")

        if booking.status not in ["confirmed", "completed"]:
            raise serializers.ValidationError(
                "You can only review confirmed or completed bookings."
            )

        if Review.objects.filter(booking=booking).exists():
            raise serializers.ValidationError("This booking has already been reviewed.")

        return booking
