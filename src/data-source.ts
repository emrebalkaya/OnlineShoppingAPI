import "reflect-metadata"
import { DataSource } from "typeorm"
import { Customer } from "./entity/Customer"
import { Order } from "./entity/Order"
import { Product } from "./entity/Product"

export const isTestEnvironment = process.env.NODE_ENV === "test";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: isTestEnvironment ? "postgres-test" : "postgres",
    port: 5432,
    username: isTestEnvironment ? "ekinokstest" : "ekinoks",
    password: isTestEnvironment ? "test123" : "ekinoks123",
    database: isTestEnvironment ? "EkinoksTest": "Ekinoks",
    synchronize: true,
    logging: false,
    entities: [Customer, Order, Product],
    migrations: [],
    subscribers: [],
})
