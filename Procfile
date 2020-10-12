web: daphne -e ssl:80:privateKey=key.pem:certKey=cert.pem feel.asgi:application --port $PORT --bind 0.0.0.0 -v2 --proxy-headers
worker: python3 manage.py runworker channel_layer -v2