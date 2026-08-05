from django.contrib import admin
from .models import Hotel, Room

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ["name", "city", "star_rating", "staff"]
    list_filter = ["city", "star_rating"]


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ["hotel", "room_type", "price_per_night", "is_available"]
    list_filter = ["room_type", "is_available"]
