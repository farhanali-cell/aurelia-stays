from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.utils.dateparse import parse_date
from django.db.models import Sum, Count
from django.http import FileResponse

from .models import Booking
from .serializers import BookingSerializer
from .emails import send_booking_confirmation_email, send_booking_cancellation_email
from .invoices import generate_invoice_pdf


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(guest=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "guest":
            raise PermissionDenied("Only guests can create bookings.")

        room = serializer.validated_data["room"]
        check_in = serializer.validated_data["check_in_date"]
        check_out = serializer.validated_data["check_out_date"]

        nights = (check_out - check_in).days
        total = room.price_per_night * nights

        booking = serializer.save(guest=user, total_price=total)

        # NEW: send confirmation email (fails silently, won't break the request)
        send_booking_confirmation_email(booking)


class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return Booking.objects.all()

        return Booking.objects.filter(guest=user)


class BookingCancelView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()

    def get_queryset(self):
        return Booking.objects.filter(guest=self.request.user)

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()

        if booking.status in ["cancelled", "completed"]:
            return Response({"error": "This booking cannot be cancelled."}, status=400)

        booking.status = "cancelled"
        booking.save()

        # NEW: send cancellation email (fails silently, won't break the request)
        send_booking_cancellation_email(booking)

        return Response({"status": "cancelled"})


class BookingInvoiceView(APIView):
    """
    GET /api/bookings/<id>/invoice/
    Returns a PDF invoice for the given booking.
    Guests can only download their own booking's invoice; admins can
    download any booking's invoice.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        user = request.user

        if user.role == "admin":
            booking = Booking.objects.filter(pk=pk).first()
        else:
            booking = Booking.objects.filter(pk=pk, guest=user).first()

        if not booking:
            raise NotFound("Booking not found.")

        pdf_buffer = generate_invoice_pdf(booking)

        response = FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename=f"invoice_booking_{booking.id}.pdf",
            content_type="application/pdf",
        )
        return response


class BookingUpdateView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(guest=self.request.user)

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()

        if booking.status != "pending":
            return Response(
                {"error": "Only pending bookings can be edited."}, status=400
            )

        serializer = self.get_serializer(
            booking, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        check_in = serializer.validated_data.get("check_in_date", booking.check_in_date)
        check_out = serializer.validated_data.get(
            "check_out_date", booking.check_out_date
        )
        room = serializer.validated_data.get("room", booking.room)
        nights = (check_out - check_in).days
        total = room.price_per_night * nights

        serializer.save(total_price=total)
        return Response(serializer.data)


@api_view(["GET"])
def search_available_rooms(request):
    from hotels.models import Room
    from hotels.serializers import RoomSerializer

    city = request.query_params.get("city")
    check_in_raw = request.query_params.get("check_in")
    check_out_raw = request.query_params.get("check_out")
    guests = request.query_params.get("guests")

    check_in = parse_date(check_in_raw) if check_in_raw else None
    check_out = parse_date(check_out_raw) if check_out_raw else None

    rooms = Room.objects.filter(is_available=True)

    if city:
        rooms = rooms.filter(hotel__city__iexact=city)

    if guests:
        rooms = rooms.filter(capacity__gte=guests)

    if check_in and check_out:
        clashing_bookings = Booking.objects.filter(
            status__in=["pending", "confirmed"],
            check_in_date__lt=check_out,
            check_out_date__gt=check_in,
        )

        clashing_room_ids = clashing_bookings.values_list("room_id", flat=True)

        rooms = rooms.exclude(id__in=clashing_room_ids)

    serializer = RoomSerializer(rooms, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def admin_dashboard_stats(request):
    from hotels.models import Hotel, Room

    if request.user.role != "admin":
        raise PermissionDenied("Only admins can access dashboard statistics.")

    total_hotels = Hotel.objects.count()
    total_rooms = Room.objects.count()
    total_bookings = Booking.objects.count()

    bookings_by_status = Booking.objects.values("status").annotate(count=Count("id"))

    total_revenue = (
        Booking.objects.filter(status="confirmed").aggregate(
            revenue=Sum("total_price")
        )["revenue"]
        or 0
    )

    data = {
        "total_hotels": total_hotels,
        "total_rooms": total_rooms,
        "total_bookings": total_bookings,
        "bookings_by_status": list(bookings_by_status),
        "total_revenue": total_revenue,
    }

    return Response(data)
