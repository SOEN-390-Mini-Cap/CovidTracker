# CovidTracker

## Running

### Local development

#### Server

### Production

#### Server

To build the server for production we will build the docker image with the production target

```
# Windows


# Linux
sudo docker build --target production -t covid-tracker-server .
```

We can then create a container from the production image 

```
# Windows


# Linux
sudo docker run -p 8080:80 covid-tracker-server
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
