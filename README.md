# Github Tags Explorer - backend

## Description

Create and filter Github repositories by tags.

This repo is the backend part of the project, to run the frontend you will need https://github.com/luismanfroni/github-tags-explorer-frontend.

## Configuration

### Database

If you have a postgres server installed, you should change the database configuration on `.env` file according to your server.

If you don't want to install postgres, i created a Docker script to create a database instance on `scripts/initDb.js` that will run on command `yarn init:db`, it should stop, delete the configured docker instance, create a new one based on `postgres:lastest` image, create database and run migrations.

## Installation

### Requisites
- Postgres for the database (you can install via docker with the [script said in configuration](#configuration)).
- NodeJS is a requisite on running the application.
- I used yarn as package manager, but you can use NPM if you want to.

### Installing dependencies with Yarn
```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

