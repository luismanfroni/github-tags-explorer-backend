# Github Tags Explorer - backend

## Description

Create and filter Github repositories by tags.

This repo is the backend part of the project, to run the frontend you will need https://github.com/luismanfroni/github-tags-explorer-frontend.

## Configuration

### Frontend

This application to fully work needs the [frontend part](https://github.com/luismanfroni/github-tags-explorer-frontend), otherwise it can't retrieve users OAuth token.

When authenticated, the backend will redirect user to frontend `/auth` page, the base frontend url is configured at `FRONTEND_URL` in the `.env` file.

### Github API

This application needs access to Github API via OAuth, you need to [create a new OAuth app](https://github.com/settings/applications/new) and configure the secret (`GITHUB_SECRET`) and client(`GITHUB_CLIENT`) on `.env` file.

When creating you should use your server hostname in `Authorization callback URL`, since Github validates the callback URLs.

### Database

If you have a postgres server installed, you should change the database configuration on `.env` file according to your server.

If you don't want to install postgres, i created a Docker script to create a database instance on `scripts/initDb.js` that will run on command `yarn init:db`, it should stop, delete the configured docker instance, create a new one based on `postgres:lastest` image, create database and run migrations.
It does need the project to be builded first with `yarn build` since it uses typeorm to make migrations.

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

