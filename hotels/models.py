from django.db import models
from django.conf import settings

class Hotel(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    staff = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='hotel'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    ROOM_TYPE_CHOICES = (
        ('single', 'Single'),
        ('double', 'Double'),
        ('suite', 'Suite'),
    )
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    room_type = models.CharField(max_length=10, choices=ROOM_TYPE_CHOICES)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.PositiveIntegerField(default=1)
    amenities = models.TextField(blank=True, help_text="Comma-separated list e.g. WiFi, AC, TV")
    image = models.ImageField(upload_to='room_images/', blank=True, null=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.room_type} - {self.hotel.name}"