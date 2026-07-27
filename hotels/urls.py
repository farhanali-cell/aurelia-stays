from django.urls import path
from .views import HotelListCreateView, RoomListCreateView

urlpatterns = [
    path('', HotelListCreateView.as_view(), name='hotel-list-create'),
    path('<int:hotel_id>/rooms/', RoomListCreateView.as_view(), name='room-list-create'),
]