from django.db import models
from django.conf import settings
from bookings.models import Booking


class Review(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    guest = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for booking {self.booking_id} - {self.rating}/5"