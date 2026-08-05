from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailView,
    BookingUpdateView,
    BookingCancelView,
    BookingInvoiceView,
    search_available_rooms,
    admin_dashboard_stats,
)

urlpatterns = [
    path("", BookingListCreateView.as_view(), name="booking-list-create"),
    path("<int:pk>/", BookingDetailView.as_view(), name="booking-detail"),
    path("<int:pk>/edit/", BookingUpdateView.as_view(), name="booking-edit"),
    path("<int:pk>/cancel/", BookingCancelView.as_view(), name="booking-cancel"),
    path("<int:pk>/invoice/", BookingInvoiceView.as_view(), name="booking-invoice"),
    path("rooms/search/", search_available_rooms, name="room-search"),
    path("admin/stats/", admin_dashboard_stats, name="admin-dashboard-stats"),
]
