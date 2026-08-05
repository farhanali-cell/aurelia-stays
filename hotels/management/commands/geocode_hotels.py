from django.core.management.base import BaseCommand
from django.utils import timezone
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
from hotels.models import Hotel


class Command(BaseCommand):
    help = "Geocode hotels that don't have saved latitude/longitude yet."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Re-geocode all hotels, even ones that already have coordinates.",
        )

    def handle(self, *args, **options):
        force = options["force"]

        geolocator = Nominatim(
            user_agent="aureliastays_app (contact: farhan314567@gmail.com)",
            timeout=10,
        )

        geocode = RateLimiter(
            geolocator.geocode,
            min_delay_seconds=1,
            max_retries=2,
            error_wait_seconds=2,
        )

        queryset = Hotel.objects.all()
        if not force:
            queryset = queryset.filter(latitude__isnull=True)

        total = queryset.count()
        self.stdout.write(f"Found {total} hotel(s) to geocode...")

        success_count = 0
        fail_count = 0

        for hotel in queryset:
            query = f"{hotel.address}, {hotel.city}"
            try:
                location = geocode(query)
            except Exception as e:
                self.stderr.write(f"[ERROR] {hotel.name}: {e}")
                fail_count += 1
                continue

            if location:
                hotel.latitude = location.latitude
                hotel.longitude = location.longitude
                hotel.geocoded_at = timezone.now()
                hotel.save(update_fields=["latitude", "longitude", "geocoded_at"])
                self.stdout.write(
                    self.style.SUCCESS(
                        f"[OK] {hotel.name} -> ({location.latitude}, {location.longitude})"
                    )
                )
                success_count += 1
            else:
                self.stderr.write(
                    self.style.WARNING(f"[NOT FOUND] {hotel.name} ({query})")
                )
                fail_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone. {success_count} geocoded, {fail_count} failed/skipped."
            )
        )
