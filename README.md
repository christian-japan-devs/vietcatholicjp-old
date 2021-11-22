# vietcatholicjp


# Project Setup

## clone the repository to your local machine
```
git clone
```

## Create a Python virtual environment and install dependencies
```
python -m venv venv
source venv/bin/activate
```
##  create a .env.dev file in the project root to store environment variables for development, production, testing
```
mkdir .env.dev
mkdir .env.prod
```
## Build the new image and spin up the two containers:
```
docker-compose up -d --build
```

## To remove the volumes along with the containers
```
docker-compose down -v
```
## Run the migrations
```
docker-compose exec vietcatholic-backend python manage.py migrate --noinput
```

## Ensure the default Django tables were created:
```
docker-compose exec vietcatholic-db psql --username=vietcatochan --dbname=vietcatholicdb
```
### commands
#### List of databases
```
\l
```
#### Change to database
```
\c dbname
```
#### List of relations
```
\dt
```
#### exit db
```
\q
docker volume inspect vietcatholicjp_postgres_data
```