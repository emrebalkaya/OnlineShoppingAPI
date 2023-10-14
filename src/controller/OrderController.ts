import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { validate } from "class-validator"
import { plainToClass } from "class-transformer"
import { Product } from "../entity/Product"
import { Order } from "../entity/Order"
import { Customer } from "../entity/Customer"
import { In } from "typeorm"
import { OrderRequest } from "../dto/OrderRequest"

export class OrderController {

    private orderRepository = AppDataSource.getRepository(Order);
    private customerRepository = AppDataSource.getRepository(Customer);
    private productRepository = AppDataSource.getRepository(Product);

    async getAll(request: Request, response: Response, next: NextFunction) {
        const orders = await this.orderRepository.find({
            relations: ["customer"],
        });

        return orders.map( order => ({
            id: order.id,
            customerId: order.customer.id,
            totalAmount: order.totalAmount
        }));
    }

    async getByCustomer(request: Request, response: Response, next: NextFunction) {
        const customerId =  parseInt(request.params.id);
        const ordersByCustomer = await this.orderRepository.find({
            where: {
                customer: { id: customerId },
            },
            relations: ["customer"]
        });

        if (!ordersByCustomer || ordersByCustomer.length === 0) {
            response.status(404).json({ message: "Orders not found or customer id is incorrect." });
            return;
        }
    
        return ordersByCustomer.map( order => ({
            id: order.id,
            customerId: order.customer.id,
            totalAmount: order.totalAmount
        }));
    }

    async getOrderDetails(request: Request, response: Response, next: NextFunction) {
        const orders = await this.orderRepository.find({
            relations: ["customer","products"],
        });

        return orders.map( order => ({
            id: order.id,
            customerId: order.customer.id,
            totalAmount: order.totalAmount,
            products: order.products
        }));
    }

    async getOrderDetailsByCustomer(request: Request, response: Response, next: NextFunction) {
        const orderId = parseInt(request.params.id);
        const ordersByCustomer = await this.orderRepository.find({
            where: { id: orderId },
            relations: ["customer", "products"]
        });

        if (!ordersByCustomer) {
            response.status(404).json({ message: "Orders not found or order id is incorrect." });
            return;
        }
    
        return ordersByCustomer.map( order => ({
            id: order.id,
            customerId: order.customer.id,
            totalAmount: order.totalAmount,
            products: order.products
        }));
    }
    

    async add(request: Request, response: Response, next: NextFunction) {
        const orderRequest = plainToClass(OrderRequest, request.body);
        const errors = await validate(orderRequest);

        if (errors.length > 0) {
            response.status(400).json({ errors });
            return;
        }

        const { customerId, productIds, totalAmount } = orderRequest;
        const customer = await this.customerRepository.findOneBy({ id: customerId });

        if (!customer) {
            response.status(404).json({ message: "Customer not found" });
            return;
        }

        const products = await this.productRepository.find({ where: { id: In(productIds) } });

        if (products.length !== productIds.length) {
            response.status(404).json({ message: "One or more products not found" });
            return;
        }

        const order = new Order();
        order.customer = customer;
        order.products = products;
        order.totalAmount = totalAmount;
        const savedProduct = await this.orderRepository.save(order);

        response.status(201).json(savedProduct);   
    }
}