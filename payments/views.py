import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from bookings.models import Booking
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_payment_intent(request):
    booking_id = request.data.get("booking_id")

    try:
        booking = Booking.objects.get(id=booking_id, guest=request.user)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found."}, status=404)

    if hasattr(booking, "payment") and booking.payment.status == "succeeded":
        return Response({"error": "This booking is already paid."}, status=400)

    amount_in_cents = int(booking.total_price * 100)

    intent = stripe.PaymentIntent.create(
        amount=amount_in_cents,
        currency="usd",
        metadata={"booking_id": booking.id},
    )

    payment, created = Payment.objects.get_or_create(
        booking=booking,
        defaults={
            "stripe_payment_id": intent.id,
            "amount": booking.total_price,
            "status": "pending",
        },
    )
    if not created:
        payment.stripe_payment_id = intent.id
        payment.save()

    return Response({"client_secret": intent.client_secret})


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    print("DEBUG SECRET:", endpoint_secret)

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        print("WEBHOOK ERROR:", str(e))
        return HttpResponse(status=400)

    if event["type"] == "payment_intent.succeeded":
       intent = event["data"]["object"]
       print("DEBUG: looking for payment_intent id:", intent["id"])
       try:
           payment = Payment.objects.get(stripe_payment_id=intent["id"])
           payment.status = "succeeded"
           payment.save()
   
           booking = payment.booking
           booking.status = "confirmed"
           booking.save()
           print("DEBUG: booking confirmed:", booking.id)
       except Payment.DoesNotExist:
            print("DEBUG: NO MATCHING PAYMENT FOUND for", intent["id"])

    elif event["type"] == "payment_intent.payment_failed":
        intent = event["data"]["object"]
        try:
            payment = Payment.objects.get(stripe_payment_id=intent["id"])
            payment.status = "failed"
            payment.save()
        except Payment.DoesNotExist:
            pass

    return HttpResponse(status=200)
