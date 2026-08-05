from django.urls import path
from .views import (
    create_payment_intent,
    stripe_webhook,
    payment_status,
    confirm_payment,
)

urlpatterns = [
    path(
        "payments/create-intent/", create_payment_intent, name="create-payment-intent"
    ),
    path("payments/webhook/", stripe_webhook, name="stripe-webhook"),
    path("payments/status/<int:booking_id>/", payment_status, name="payment-status"),
    path("payments/confirm/<int:booking_id>/", confirm_payment, name="confirm-payment"),
]
