# CovidTracker

## Getting Started

### Prerequisites

Before you continue, ensure you have installed the following requirements:
- [Docker](https://www.docker.com/)
- [pgAdmin](https://www.pgadmin.org/)
- [npm](https://www.npmjs.com/)

### Setup

1. Clone the repository
    ```sh
    $ git clone https://github.com/SOEN-390-Mini-Cap/CovidTracker.git
    ```
2. Copy `.env.sample`, rename to `.env` and edit the following lines
    ```
    TBD
    ```
3. Install all dependencies
    ```sh
    $ cd server
    $ npm i
    ```
4. Create the docker container
    ```sh
    $ docker-compose up -d server
    ```
5. Connect to the database on `localhost:5432` in pgAdmin

You can now access the server at http://localhost:8080

**Note:** 

By default, the server and database will be exposed on `localhost:8080` and `localhost:5432`, respectively. If you have a port conflict with either one, change their respective docker-compose entry ports as follows:
- Server from `8080:80` to `<new-port>:80`
- Database from `5432:5432` to `<new-port>:5432`.

### Running the Tests

#### Locally

Run all tests with the following command in the `server` directory
```
$ npm run test:unit
```

#### Docker

1. Start the docker container
    ```sh
    $ docker-compose start server db
    ```
2. Exec into the docker container
    ```sh
    $ docker-compose exec server sh
    ```
3. Run all tests with the following command
    ```sh
    $ npm run test:unit
    ```

### Linting and Formatting

Run linter and formatter with the following command in the `server` directory
```sh
$ npm run lint:fix
```

## Building for Production

1. Build the docker image with the production target
    ```
    $ docker build --target production -t covid-tracker-server-prod .
    ```
2. Create a container from the production image
    ```
    $ docker run -p 8080:80 covid-tracker-server-prod
    ```

## Team
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
