from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Hotel, Room
from .serializers import HotelSerializer, RoomSerializer


class HotelListCreateView(generics.ListCreateAPIView):
    serializer_class = HotelSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Hotel.objects.all()

        city = self.request.query_params.get("city")
        star_rating = self.request.query_params.getlist("star_rating")
        amenities = self.request.query_params.getlist("amenities")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        if city:
            queryset = queryset.filter(city__iexact=city)

        if star_rating:
            queryset = queryset.filter(star_rating__in=star_rating)

        if amenities:
            for amenity in amenities:
                queryset = queryset.filter(rooms__amenities__icontains=amenity)
            queryset = queryset.distinct()

        if min_price:
            queryset = queryset.filter(rooms__price_per_night__gte=min_price)
        if max_price:
            queryset = queryset.filter(rooms__price_per_night__lte=max_price)
        if min_price or max_price:
            queryset = queryset.distinct()

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ["admin", "staff"]:
            raise PermissionDenied("Only admin or staff users can create hotels.")
        serializer.save(staff=user)


class RoomListCreateView(generics.ListCreateAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        hotel_id = self.kwargs["hotel_id"]
        return Room.objects.filter(hotel_id=hotel_id)

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ["admin", "staff"]:
            raise PermissionDenied("Only admin or staff users can add rooms.")
        hotel = Hotel.objects.get(id=self.kwargs["hotel_id"])
        if hotel.staff != user and user.role != "admin":
            raise PermissionDenied("You can only add rooms to your own hotel.")
        serializer.save(hotel=hotel)
