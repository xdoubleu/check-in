TODO

## How to run?

1. `docker-compose up -d --build` for running the db, api and web-client
2. Go to `http://localhost:3000` for the web-client and  `http://localhost:8000` for the api

Below commands work only on api

## Building
3. Build: `turbo build`

## Linting
1. Linting: `turbo lint` and `turbo lint:fix`

## Edit schema?
1. `turbo db:generate`
2. `npx prisma migrate dev` ((ONLY FOR PROTOTYPING) `turbo db:push`)

## Seeding database
1. `turbo db:seed`

## Other
1. `npm run cli createadmin` create admin
