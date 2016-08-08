# Get started with `parse-server` with `Docker`

- Install ['Docker for Mac', 'Docker for Windows' or 'Docker for Linux'](https://docs.docker.com/)

- Run `Docker`

# Start `paddock` with `docker-compose`

```
# Build or rebuild services
docker-compose build
```

```
# Create and start containers in Detached mode (-d): Run containers in the background
docker-compose up -d
```

## Other useful `docker-compose` commands

```
# List containers
docker-compose ps
```

```
# View output from containers
docker-compose logs
```

# Use the `paddock` interface

## Open [http://localhost:8080](http://localhost:8080)

# Use the `parse-server` API

## From [parse-server](https://github.com/ParsePlatform/parse-server#saving-your-first-object)

> ## Saving your first object (POST)
>
```bash
curl -X POST \
  -H "X-Parse-Application-Id: APPLICATION_ID" \
  -H "Content-Type: application/json" \
  -d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' \
  http://localhost:1337/parse/classes/GameScore
```
> ## Retrieving your collection (GET)
>
```bash
$ curl -X GET \
  -H "X-Parse-Application-Id: APPLICATION_ID" \
  http://localhost:1337/parse/classes/GameScore
```

# Need a MongoDB GUI?

[Robomongo](https://robomongo.org/)

# paddock: what's going on?
Node containers will start with `$NODE_ENV` environment variable set in `.env`.

`npm install` in Docker containers will be executed from the `prestart` script.

## FAQ

* Is this production ready?

> [No](https://memegenerator.net/instance/31056298)
