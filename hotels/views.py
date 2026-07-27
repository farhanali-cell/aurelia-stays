from rest_framework import generics, permissions
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
        serializer.save(staff=self.request.user)


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
        hotel = Hotel.objects.get(id=self.kwargs['hotel_id'])
        serializer.save(hotel=hotel)