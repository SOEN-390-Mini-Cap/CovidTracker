```shell
sudo docker build -t covid-tracker-server .
sudo docker tag covid-tracker-server 231117073705.dkr.ecr.us-east-2.amazonaws.com/covid-tracker-server
sudo docker push 231117073705.dkr.ecr.us-east-2.amazonaws.com/covid-tracker-server
```

```shell
sudo docker build -t covid-tracker-db .
sudo docker tag covid-tracker-db 231117073705.dkr.ecr.us-east-2.amazonaws.com/covid-tracker-db
sudo docker push 231117073705.dkr.ecr.us-east-2.amazonaws.com/covid-tracker-db
```
