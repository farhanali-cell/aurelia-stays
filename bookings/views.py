from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils.dateparse import parse_date
from django.db.models import Sum, Count
from .models import Booking
from .serializers import BookingSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(guest=self.request.user)

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in_date']
        check_out = serializer.validated_data['check_out_date']
        nights = (check_out - check_in).days
        total = room.price_per_night * nights
        serializer.save(guest=self.request.user, total_price=total)


class BookingCancelView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()

    def get_queryset(self):
        return Booking.objects.filter(guest=self.request.user)

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        booking.status = 'cancelled'
        booking.save()
        return Response({'status': 'cancelled'})


@api_view(['GET'])
def search_available_rooms(request):
    from hotels.models import Room
    from hotels.serializers import RoomSerializer

    city = request.query_params.get('city')
    check_in_raw = request.query_params.get('check_in')
    check_out_raw = request.query_params.get('check_out')
    guests = request.query_params.get('guests')

    check_in = parse_date(check_in_raw) if check_in_raw else None
    check_out = parse_date(check_out_raw) if check_out_raw else None

    rooms = Room.objects.filter(is_available=True)

    if city:
        rooms = rooms.filter(hotel__city__iexact=city)

    if guests:
        rooms = rooms.filter(capacity__gte=guests)

    if check_in and check_out:
        clashing_bookings = Booking.objects.filter(
            status__in=['pending', 'confirmed'],
            check_in_date__lt=check_out,
            check_out_date__gt=check_in
        )
        clashing_room_ids = clashing_bookings.values_list('room_id', flat=True)
        rooms = rooms.exclude(id__in=clashing_room_ids)

    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def admin_dashboard_stats(request):
    from hotels.models import Hotel, Room

    total_hotels = Hotel.objects.count()
    total_rooms = Room.objects.count()
    total_bookings = Booking.objects.count()

    bookings_by_status = Booking.objects.values('status').annotate(count=Count('id'))

    total_revenue = Booking.objects.filter(
        status='confirmed'
    ).aggregate(revenue=Sum('total_price'))['revenue'] or 0

    data = {
        'total_hotels': total_hotels,
        'total_rooms': total_rooms,
        'total_bookings': total_bookings,
        'bookings_by_status': list(bookings_by_status),
        'total_revenue': total_revenue,
    }
    return Response(data)