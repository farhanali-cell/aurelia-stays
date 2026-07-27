from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer


class ReviewCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all().order_by('-id')

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(guest=self.request.user)


class HotelReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        hotel_id = self.kwargs['hotel_id']
        return Review.objects.filter(booking__room__hotel_id=hotel_id)