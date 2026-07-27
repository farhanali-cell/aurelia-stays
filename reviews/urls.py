from django.urls import path
from .views import ReviewCreateView, HotelReviewListView

urlpatterns = [
    path('reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('hotels/<int:hotel_id>/reviews/', HotelReviewListView.as_view(), name='hotel-reviews'),
]