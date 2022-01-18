# CovidTracker

## Server

### Initial setup

Make a copy of `.env.example`, rename it to `.env`, and fill out any missing secret values (ask someone on the team if you don't know what the value should be)

By default, the server will be exposed on `localhost:8080` if you have a port conflict with that change the docker-compose entry port for the server service from "8080:80" to "<new-port>:80"

### Running the API

Create the docker container for the server and database with
```
# Windows


# Linux
sudo docker-compose up -d server
```
This will start
- API on `localhost:8080`
- PostgreSQL database on `localhost:5432`

### Running tests

#### Locally

1. Install server dependencies inside `/server` folder
```
npm i
```
2. Run tests
```
npm run test
```

#### Docker

1. Start docker container with docker-compose
```
# Windows


# Linux
sudo docker-compose up -d server
```
2. Exec into the docker container with
```
# Windows


# Linux
sudo docker-compose exec server sh
```
3. Run tests
```
npm run test
```

### Linting and formatting

1. Install server dependencies inside `/server` folder
```
npm i
```
2. Run lint and formatter
```
npm run lint:fix
```

### Building for production

To build the server for production we will build the docker image with the production target

```
# Windows


# Linux
sudo docker build --target production -t covid-tracker-server-prod .
```

We can then create a container from the production image

```
# Windows


# Linux
sudo docker run -p 8080:80 covid-tracker-server-prod
```

## Maintainers
| Name                | StudentId | GitHub Username  | email                          |
|---------------------|-----------|------------------|--------------------------------|
| Jason Gerard        | 40079266  | jason-gerard     | jasongerard321@gmail.com       |
| Andre Ibrahim       | 40132881  | Andreibr1        | andre.khaled.ibrahim@gmail.com |
| Khagik Astor        | 40099665  | Kastor14         | astor1414@gmail.com            |
| Dan Raiu            | 40108722  | danezu1          | dan.raiu@yahoo.com             |
| Rafi Stepanians     | 40108731  | Rafistan         | rafistep98@gmail.com           |
| Ejazali Rezayi      | 40101892  | ejazali-rezayi   | rezayi.ejazali@gmail.com       |
| Domenic Seccareccia | 40063021  | domsec           | dom_seccareccia@hotmail.com    |
| Daren Kafafian      | 40100511  | DarenKaf         | darenkaf@hotmail.com           |
| Lucas Blanchard     | 40060670  | lucasblanchard14 | lucas.blanchard14@gmail.com    |
