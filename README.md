# vietcatholicjp - Project Overview

# Project Setup

## Clone the repository to your local machine
```
git clone
```

## Backend setting
### Create a Python virtual environment and install dependencies
```
python -m venv venv
source venv/bin/activate
```
###  Create a .env. file inside the backend directory to store environment variables for development, production
```
mkdir .env.dev
mkdir .env.prod
mkdir .env.prod.db
```

### Build the new image and spin up the two containers:
```
docker-compose up -d --build
```

### Run the migrations
```
docker-compose exec vietcatholic-backend python manage.py migrate --noinput
```

### Ensure the default Django tables were created, use psql for checking:
```
docker-compose exec vietcatholic-db psql --username=vietcatochan --dbname=vietcatholicdb
```

### To remove the volumes along with the containers
```
docker-compose down -v
```

## Frontend setting
### Run Yarn install
```
```


## WORKING WITH GIT

Before creating a new branch, pull the changes from upstream. Your master needs to be up to date.
```
$ git pull
```
Create the branch on your local machine and switch in this branch :
```
git checkout -b [name_of_your_new_branch]
```
Push the branch on github :
```
git push origin [name_of_your_new_branch]
```
