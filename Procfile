release: python manage.py migrate
web: gunicorn hotel_booking.wsgi --bind 0.0.0.0:$PORT --log-file -