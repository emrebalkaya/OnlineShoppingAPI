import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { validate } from "class-validator"
import { plainToClass } from "class-transformer"
import { Product } from "../entity/Product"
import { AddProductRequest } from "../dto/AddProductRequest"

export class ProductController {

    private productRepository = AppDataSource.getRepository(Product)

    async getAll(request: Request, response: Response, next: NextFunction) {
        return this.productRepository.find()
    }

    async add(request: Request, response: Response, next: NextFunction) {
        const productRequest = plainToClass(AddProductRequest, request.body);

        const errors = await validate(productRequest);

        if (errors.length > 0) {
            response.status(400).json(errors);
            return
        }

        const { name, stock, price, description } = request.body;

        const existingProduct = await this.productRepository.findOne({ where: { name } });

        if (existingProduct) {
            response.status(400).json({ error: 'Product with the same name already exists.' });
            return
        }
        
        const newProduct = new Product();
        newProduct.name = name;
        newProduct.stock = stock;
        newProduct.price = price;
        newProduct.description = description;

        const savedProduct = await this.productRepository.save(newProduct);

        response.status(201).json(savedProduct); // Respond with the created product
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const productData = request.body;

        const productRequest = plainToClass(AddProductRequest, productData);
        const errors = await validate(productRequest);

        if (errors.length > 0) {
            response.status(400).json(errors);
            return
        }

        const product = await this.productRepository.findOneBy({ id });

        if (!product) {
            response.status(404).json({ error: 'Product not found' });
            return;
        }

        Object.assign(product, productData);

        const updatedProduct = await this.productRepository.save(product);

        response.status(200).json(updatedProduct);
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const product = await this.productRepository.findOneBy({ id });

        if (!product) {
            response.status(404).json({ error: 'Product not found' });
            return;
        }

        try {
            await this.productRepository.remove(product);
            response.status(204).end(); 
        } catch (error) {
            response.status(500).json({ error: 'Failed to delete the product' });
        }
    }

}