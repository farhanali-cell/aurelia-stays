from rest_framework import serializers
from django.utils import timezone
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source="room.hotel.name", read_only=True)
    hotel_city = serializers.CharField(source="room.hotel.city", read_only=True)
    room_type = serializers.CharField(
        source="room.get_room_type_display", read_only=True
    )
    price_per_night = serializers.DecimalField(
        source="room.price_per_night", max_digits=10, decimal_places=2, read_only=True
    )
    room_image = serializers.SerializerMethodField()
    nights = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "guest",
            "room",
            "check_in_date",
            "check_out_date",
            "status",
            "total_price",
            "created_at",
            "hotel_name",
            "hotel_city",
            "room_type",
            "price_per_night",
            "room_image",
            "nights",
        ]
        read_only_fields = ["guest", "status", "total_price"]

    def get_room_image(self, obj):
        request = self.context.get("request")
        if obj.room.image and hasattr(obj.room.image, "url"):
            return (
                request.build_absolute_uri(obj.room.image.url)
                if request
                else obj.room.image.url
            )
        return None

    def get_nights(self, obj):
        return (obj.check_out_date - obj.check_in_date).days

    def validate(self, data):
        room = data.get("room", getattr(self.instance, "room", None))
        check_in = data.get(
            "check_in_date", getattr(self.instance, "check_in_date", None)
        )
        check_out = data.get(
            "check_out_date", getattr(self.instance, "check_out_date", None)
        )

        if check_in >= check_out:
            raise serializers.ValidationError(
                "Check-out date must be after check-in date."
            )

        if check_in < timezone.now().date():
            raise serializers.ValidationError("Check-in date cannot be in the past.")

        overlapping = Booking.objects.filter(
            room=room,
            status__in=["pending", "confirmed"],
            check_in_date__lt=check_out,
            check_out_date__gt=check_in,
        )
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)

        if overlapping.exists():
            raise serializers.ValidationError(
                "This room is already booked for the selected dates."
            )

        return data
