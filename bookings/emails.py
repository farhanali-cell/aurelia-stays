"""
bookings/emails.py

Small helper functions to send booking-related email notifications.
Kept separate from views.py so the view logic stays clean and these
can be reused (e.g. later from signals, celery tasks, admin actions).
"""

from django.core.mail import send_mail
from django.conf import settings


def send_booking_confirmation_email(booking):
    """
    Sends a confirmation email to the guest right after a booking is created.
    `booking` is a Booking instance with .guest, .room, .check_in_date,
    .check_out_date, .total_price already populated.
    """
    guest_email = getattr(booking.guest, "email", None)
    if not guest_email:
        return  # no email on file, nothing to send

    hotel_name = booking.room.hotel.name
    room_type = booking.room.get_room_type_display()

    subject = f"Booking Confirmed — {hotel_name}"
    message = (
        f"Hi {booking.guest.first_name or booking.guest.username},\n\n"
        f"Your booking has been received and is currently '{booking.status}'.\n\n"
        f"Booking Details:\n"
        f"  Hotel: {hotel_name}\n"
        f"  Room Type: {room_type}\n"
        f"  Check-in: {booking.check_in_date}\n"
        f"  Check-out: {booking.check_out_date}\n"
        f"  Total Price: PKR {booking.total_price}\n\n"
        f"Booking Reference: #{booking.id}\n\n"
        f"Thank you for choosing AureliaStays!\n"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[guest_email],
        fail_silently=True,
    )


def send_booking_cancellation_email(booking):
    """
    Sends a cancellation email to the guest after a booking is cancelled.
    """
    guest_email = getattr(booking.guest, "email", None)
    if not guest_email:
        return

    hotel_name = booking.room.hotel.name

    subject = f"Booking Cancelled — {hotel_name}"
    message = (
        f"Hi {booking.guest.first_name or booking.guest.username},\n\n"
        f"Your booking (Reference #{booking.id}) at {hotel_name} "
        f"for {booking.check_in_date} to {booking.check_out_date} "
        f"has been cancelled.\n\n"
        f"If this wasn't you, please contact support immediately.\n\n"
        f"— AureliaStays Team\n"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[guest_email],
        fail_silently=True,
    )
