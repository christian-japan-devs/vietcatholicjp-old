## entrypoint.sh file
To verify that Postgres is healthy before applying the migrations 
and running the Django development server

Update the file permissions locally:
```
chmod +x backend/entrypoint.sh
```

Incase, you may want to comment out the database flush and migrate commands in the entrypoint.sh script 
so they don't run on every container start or re-start

Instead, you can run them manually, after the containers spin up, like so:
```
$ docker-compose exec vietcatholic-backend python manage.py flush --no-input
$ docker-compose exec vietcatholic-backend python manage.py migrate
```

# For production
```

docker-compose -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.prod.yml exec vietcatholic-backend python manage.py migrate --noinput
docker-compose -f docker-compose.prod.yml exec vietcatholic-db psql --username=username --dbname=dbname
```


# Static Files
Update settings.py:
```
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
```
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
## Development
Now, any request to http://localhost:8000/static/* will be served from the "staticfiles" directory.

To test, first re-build the images and spin up the new containers per usual. Ensure static files are still being served correctly at http://localhost:8000/admin.

## Production
For production, add a volume to the web and nginx services in docker-compose.prod.yml so that each container will share a directory named "staticfiles":
```
docker-compose -f docker-compose.prod.yml exec vietcatholic-backend python manage.py collectstatic --no-input --clear
```
Navigate to http://localhost:1337/admin and ensure the static assets load correctly.

To verify in the logs -- via docker-compose -f docker-compose.prod.yml logs -f -- that requests to the static files are served up successfully via Nginx:

# Media Files
