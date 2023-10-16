# Ekinoks API

This API is designed to support an online shopping platorm, providing a range of key functionalities to facilitate customer interaction and product management.

## Key Functionalities

- Customer Register and Login
- Add & Update & Delete Product
- Make Order
- List Customers & Products & Orders & Order Details

## Project Structure

```
├── README.md
├── __test__
│   ├── customer.test.ts
│   ├── order.test.ts
│   └── product.test.ts
├── app.log
├── docker-compose.yml
├── package-lock.json
├── package.json
├── src
│   ├── app.ts
│   ├── controller
│   │   ├── CustomerController.ts
│   │   ├── OrderController.ts
│   │   └── ProductController.ts
│   ├── data-source.ts
│   ├── dto
│   │   ├── AddProductRequest.ts
│   │   ├── LoginRequest.ts
│   │   ├── OrderRequest.ts
│   │   └── RegisterRequest.ts
│   ├── entity
│   │   ├── Customer.ts
│   │   ├── Order.ts
│   │   └── Product.ts
│   ├── index.ts
│   ├── logger.ts
│   ├── migration
│   └── routes.ts
└── tsconfig.json
```

## Run Project

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` and `docker-compose.yml` files
3. Run `npm start` command

## Run Project with Docker

1. Make sure you have Docker and Docker Compose installed on your system.
2. Run the following command to start the API in a Docker container: `docker-compose up`

## Run Tests

1. Setup database setting inside `data-source.ts` and `docker-compose.yml` files
2. Run `npm test` command

## Request Logging

The Ekinoks API logs incoming requests for auditing and debugging purposes. Each log entry includes the following information:

1. level: The log level(e.g.,"info").
2. message: A message describing the request, including the source IP address, endpoint, and timestamp.

The request log entries are stored in the `app.log` file within the project directory.


## Tech Stack

- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
