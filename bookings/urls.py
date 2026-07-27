from django.urls import path
from .views import BookingListCreateView, BookingCancelView, search_available_rooms, admin_dashboard_stats

urlpatterns = [
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/cancel/', BookingCancelView.as_view(), name='booking-cancel'),
    path('rooms/search/', search_available_rooms, name='room-search'),
    path('admin/stats/', admin_dashboard_stats, name='admin-dashboard-stats'),
]