from django.urls import path
from .views import WishlistListView, WishlistToggleView, WishlistRemoveView

urlpatterns = [
    path("", WishlistListView.as_view(), name="wishlist-list"),
    path(
        "toggle/<int:hotel_id>/", WishlistToggleView.as_view(), name="wishlist-toggle"
    ),
    path("<int:pk>/", WishlistRemoveView.as_view(), name="wishlist-remove"),
]
