from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, NotFound

from .models import Wishlist
from .serializers import WishlistSerializer
from hotels.models import Hotel


class WishlistListView(generics.ListAPIView):
    """
    GET /api/wishlist/
    Returns the logged-in guest's full wishlist (with nested hotel details).
    """

    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(guest=self.request.user)


class WishlistToggleView(APIView):
    """
    POST /api/wishlist/toggle/<hotel_id>/
    If the hotel is already wishlisted by this guest, removes it.
    If not, adds it. Returns {"wishlisted": true/false} so the frontend
    can flip the heart icon state directly from the response.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, hotel_id):
        user = request.user

        if user.role != "guest":
            raise PermissionDenied("Only guests can use the wishlist.")

        hotel = Hotel.objects.filter(pk=hotel_id).first()
        if not hotel:
            raise NotFound("Hotel not found.")

        existing = Wishlist.objects.filter(guest=user, hotel=hotel).first()

        if existing:
            existing.delete()
            return Response({"wishlisted": False})

        Wishlist.objects.create(guest=user, hotel=hotel)
        return Response({"wishlisted": True})


class WishlistRemoveView(generics.DestroyAPIView):
    """
    DELETE /api/wishlist/<pk>/
    Removes a wishlist entry by its own id (used from the Wishlist page,
    where you already have the wishlist item's id, not the hotel's id).
    """

    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(guest=self.request.user)
