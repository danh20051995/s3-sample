# NODE-S3-SA

## Pre-requisites

- [Docker](https://docs.docker.com/engine/install)
- [Node.js](https://nodejs.org/en/download)
- Create a `.env` file from the `.env.example` file (`cp .env.example .env`)

## Setup minio

Check the [docker-compose.yml](docker-compose.yml) file and change configuration as you wish

```bash
docker-compose up -d
```

Open [http://localhost:9001](http://localhost:9001), login with the credentials you set in the docker-compose file (default is `minioadmin/minioadmin`)

Navigate to [http://localhost:9001/access-keys](http://localhost:9001/access-keys), create a new access key then copy values to [.env](.env) file

## Node Installation

```bash
npm install
```

## Bootstrap

```bash
npm run serve
```

Then open link provided in the console to start

## Scripts

- Backend s3 scripts are in [/src/routes/index.js](/src/routes/index.js)
- Frontend scripts are in [/public/api.js](/public/api.js)
