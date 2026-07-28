from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Hotel, Room
from .serializers import HotelSerializer, RoomSerializer


class HotelListCreateView(generics.ListCreateAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role not in ['admin', 'staff']:
            raise PermissionDenied(
                "Only admin or staff users can create hotels."
            )

        serializer.save(staff=user)


class RoomListCreateView(generics.ListCreateAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        hotel_id = self.kwargs['hotel_id']
        return Room.objects.filter(hotel_id=hotel_id)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role not in ['admin', 'staff']:
            raise PermissionDenied(
                "Only admin or staff users can add rooms."
            )

        hotel = Hotel.objects.get(id=self.kwargs['hotel_id'])
        serializer.save(hotel=hotel)