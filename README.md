# API TEMPLATE

API Template using

- Next.js 14.x
- TypeScript
- Prisma 4.x
- MySQL 5.7

with

- CORS
- Bearer Auth

and

- API Docs by openapi.yaml

## USAGE

create .env from sample

```
$ yarn install
$ docker-compose -f docker-compose.db.yml -up d
$ npx prisma generate
$ npx prisma migrate dev
$ yarn dev
```

```
$ docker-compose build
$ docker-compose up -d
```

## API DOCS

edit /docs/openapi.yaml, then

```
$ cd scripts
$ ./build_openapi.yaml
```

access localhost:3000/docs

if you don't want Basic Auth, remove middleware.ts
