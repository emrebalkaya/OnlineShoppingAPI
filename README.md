# Ekinoks API

This is an online shopping API. 

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
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

## Run Tests

1. Setup database setting inside `data-source.ts` file
2. Run `npm test` command

## Tech Stack

- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
