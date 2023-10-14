import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Customer } from "../entity/Customer"
import { validate } from "class-validator"
import { LoginRequest } from "../dto/LoginRequest"
import { plainToClass } from "class-transformer"
import { RegisterRequest } from "../dto/RegisterRequest"

export class CustomerController {

    private customerRepository = AppDataSource.getRepository(Customer)

    async getAll(request: Request, response: Response, next: NextFunction) {
        return this.customerRepository.find()
    }

    async login(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body;
        const loginRequest = plainToClass(LoginRequest, { email, password });
        const errors = await validate(loginRequest);

        if (errors.length > 0) {
            response.status(400).json(errors);
            return
        }

        const customer = await this.customerRepository.findOne({
            where: { email, password }
        });

        if (!customer) {
            response.status(404).send("User not found or password is incorrect.");
            return;
        }
        response.send("Successfully logged in.");
    }

    async register(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, email, password  } = request.body;
        const registerRequest = plainToClass(RegisterRequest, { firstName, lastName, email, password });
        const errors = await validate(registerRequest);

        if (errors.length > 0) {
            response.status(400).json(errors);
            return
        }

        const customer = Object.assign(new Customer(), {
            firstName,
            lastName,
            email,
            password
        })

        return this.customerRepository.save(customer)
    }
}