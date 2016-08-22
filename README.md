# `paddock`
Up and Running development environment built with `parse-server` and `docker`.

## TL;DR
Install [`Docker`](#install) and run [`docker-compose`](#start), wait for some magic to happen (requires internet) and check [0.0.0.0:8080](http://0.0.0.0:8080/).

**Full disclosure**: *the cake is a lie*, with the default configuration you're going to need two [API keys](#configuration).

**Spoiler Alert**: the demo is at [paddock.tech](http://paddock.tech/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Start](#start)
  - [Use the `paddock` UI](#use-the-paddock-ui)
  - [Use the `parse-server` API](#use-the-parse-server-api)
  - [Access to MongoDB](#access-to-mongodb)
  - [Configuration](#configuration)
    - [Mailgun (email verification)](#mailgun-email-verification)
    - [Twitter (social login)](#twitter-social-login)
  - [Features](#features)
    - [Email verification](#email-verification)
    - [Oauth login (Twitter)](#oauth-login-twitter)
    - [ACL](#acl)
    - [Cloud code](#cloud-code)
- [Deploy](#deploy)
  - [Docker Cloud](#docker-cloud)
  - [HYPER_](#hyper_)
  - [now](#now)
  - [Demo](#demo)
- [FAQ](#faq)
- [Miscellaneous](#miscellaneous)
  - [Other useful `docker-compose` commands](#other-useful-docker-compose-commands)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Install

To get started with `paddock` you're only going to need `Docker` installed:

- Install ['Docker for Mac', 'Docker for Windows' or 'Docker for Linux'](https://docs.docker.com/)

- Run `Docker`

# Start

In order to start the `parse-server` with `Docker` open your terminal and run `docker-compose`:

```
# Create and start containers (get easy access to the logs)
docker-compose up

# or create and start containers in Detached mode (`-d` runs containers in the background)
docker-compose up -d
```

This command is going to download two images: `alpine-node` and `alpine-mongo`, and it's going to start three `Docker` containers (Front-end, Back-end and Database).

`Node.js` containers will start with the `$NODE_ENV` environment variables set in `.env` and `server/.env`.

`npm install` in `Node.js` containers will be automatically executed from the `prestart` scripts. Wait for the installs to finish and you'll be ready to go.

## Use the `paddock` UI

Open [http://0.0.0.0:8080/](http://0.0.0.0:8080/)

## Use the `parse-server` API

Excerpt from [parse-server](https://github.com/ParsePlatform/parse-server#saving-your-first-object)

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

## Access to MongoDB

Need a GUI? Check [Robomongo](https://robomongo.org/)

## Configuration

`paddock` comes bundled with some of the main features from `parse-server`.
By default we enabled email verification and oauth login (with Twitter, so far) in `server/config/parse.js`.
Both these features need API keys (if you want to keep them).

### Mailgun (email verification)

Getting started with Mailgun is free and takes 57 seconds.
http://www.mailgun.com/

(Walkthrough TBD)

### Twitter (social login)

Sign in with your Twitter Account to create and maintain Twitter Apps.
https://apps.twitter.com/

(Walkthrough TBD)

## Features

### Email verification
(TBD)

### Oauth login (Twitter)
(TBD)

### ACL
(TBD)

### Cloud code
(TBD)

# Deploy

Current deploy strategy is based onto a `Dockerfile`: `Dockerfile.deploy`.

## Docker Cloud

`paddock` itself is built and deployed with Docker Cloud, based onto the `Dockerfile.deploy` configuration.

## HYPER_
(TBD)
https://www.hyper.sh/

## now
(TBD)
https://now.sh

## Demo
You can check the demo at [paddock.tech](http://paddock.tech/)

# FAQ

* Is this production ready?

> [No](https://memegenerator.net/instance/31056298)

# Miscellaneous

## Other useful `docker-compose` commands

```
# List containers
docker-compose ps
```

```
# View output from containers
docker-compose logs
```

```
# Stop and remove containers, networks, images, and volumes
docker-compose down
```

```
# Build or rebuild services
docker-compose build
```
