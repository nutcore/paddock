# Get started with `parse-server` with `Docker`

- Install [Docker Toolbox](https://www.docker.com/toolbox)

- Run `Docker Quickstart Terminal`

```
## Build or rebuild services
docker-compose build
```

```
## Create and start containers in Detached mode: Run containers in the background
docker-compose up -d
```

```
## List containers
docker-compose ps
```

```
## View output from containers
docker-compose logs
```

```
## Get the IP address of a machine
docker-machine ip
```

# From [parse-server](https://github.com/ParsePlatform/parse-server#saving-your-first-object)
>
## Saving your first object (POST)
>
```bash
curl -X POST \
  -H "X-Parse-Application-Id: APPLICATION_ID" \
  -H "Content-Type: application/json" \
  -d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' \
  http://192.168.99.100:1337/parse/classes/GameScore
```
>
## Retrieving your collection (GET)
>
```bash
$ curl -X GET \
  -H "X-Parse-Application-Id: APPLICATION_ID" \
  http://192.168.99.100:1337/parse/classes/GameScore
```

# Need a MongoDB GUI?

[Robomongo](https://robomongo.org/)

# Paddock
Node containers will start with $NODE_ENV set in `.env`.

`npm install` will be executed from the `prestart` script.

## FAQ

* Is this production ready?

> [No](https://memegenerator.net/instance/31056298)
