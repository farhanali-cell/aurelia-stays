from django.db import models
from django.conf import settings
from hotels.models import Hotel


class Wishlist(models.Model):
    guest = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wishlist_items",
    )
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name="wishlisted_by",
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevents the same guest from wishlisting the same hotel twice
        unique_together = ("guest", "hotel")
        ordering = ["-added_at"]

    def __str__(self):
        return f"{self.guest} → {self.hotel.name}"
