import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';
import { Order } from '../src/entity/Order';
import { Customer } from '../src/entity/Customer';
import { Product } from '../src/entity/Product';
import { Repository } from 'typeorm';

let orderRepository: Repository<Order>;
let customerRepository: Repository<Customer>;
let productRepository: Repository<Product>;
let customers;
let products;

beforeAll(async () => {
  await AppDataSource.initialize();
  orderRepository = AppDataSource.getRepository(Order);
  customerRepository = AppDataSource.getRepository(Customer);
  productRepository = AppDataSource.getRepository(Product);

  products = await productRepository.save([
    {
      name: 'Product 1',
      stock: 10,
      price: 19.99,
      description: 'Description 1',
    },
    {
      name: 'Product 2',
      stock: 5,
      price: 29.99,
      description: 'Description 2',
    },
  ]);

  customers = await customerRepository.save([
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe2@example.com',
      password: 'password123',
    },
    {
      firstName: 'Alice',
      lastName: 'Doe',
      email: 'alice.doe2@example.com',
      password: 'password123',
    },
  ]);
});

afterAll(async () => {
  await orderRepository.delete({});
  await customerRepository.delete({});
  await productRepository.delete({});
  AppDataSource.destroy();
});

describe('OrderController', () => {

  afterEach(async () => {
    await orderRepository.delete({});
  });

  describe('GET /order', () => {
    it('should return a list of all orders', async () => {
      await orderRepository.save([
        {
          customer: customers[0],
          products: products,
          totalAmount: 5000
        },
        {
          customer: customers[1],
          products: products[0],
          totalAmount: 2000
        },
      ]);

      const response = await request(app).get('/order');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const firstOrder = response.body[0];
      const secondOrder = response.body[1];

      expect(firstOrder.customerId).toEqual(customers[0].id);
      expect(firstOrder.totalAmount).toBe(5000);

      expect(secondOrder.customerId).toEqual(customers[1].id);
      expect(secondOrder.totalAmount).toBe(2000);
    });
  });

  describe('GET /order/:customerId', () => {
    it('should return orders for a specific customer', async () => {
      await orderRepository.save([
        {
          customer: customers[0],
          products: products,
          totalAmount: 5000
        },
        {
          customer: customers[0],
          products: products[0],
          totalAmount: 2000
        },
        {
          customer: customers[0],
          products: products[1],
          totalAmount: 3000
        },
        {
          customer: customers[1],
          products: products,
          totalAmount: 5000
        }
      ]);

      const response = await request(app).get(`/order/${customers[0].id}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);

      response.body.forEach((order) => {
        expect(order.customerId).toEqual(customers[0].id);
      });

      const firstOrder = response.body[0];
      const secondOrder = response.body[1];
      const thirdOrder = response.body[2];

      expect(firstOrder.totalAmount).toBe(5000);
      expect(secondOrder.totalAmount).toBe(2000);
      expect(thirdOrder.totalAmount).toBe(3000);
    });

    it('should return 404 for a non-existent customer', async () => {
      const response = await request(app).get('/order/-1');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Orders not found or customer id is incorrect.');
    });
  });

  describe('POST /order', () => {
    it('should add a new order', async () => {
      const newOrder = {
        customerId: customers[0].id,
        productIds: [products[0].id, products[1].id],
        totalAmount: 4000
      };

      const response = await request(app)
        .post('/order')
        .send(newOrder);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');

      const createdOrder = await orderRepository.findOne({
        where: { id: response.body.id },
        relations: ['customer','products'],
      });
      
      expect(createdOrder).not.toBeNull(); 
      expect(createdOrder.customer.id).toBe(customers[0].id);
      expect(createdOrder.products.map(product => product.id)).toEqual(newOrder.productIds);
      expect(createdOrder.totalAmount).toBe(newOrder.totalAmount);
    });

    it('should return an error when adding an order with invalid data', async () => {
      const invalidOrder = {
        customerId: '100',
        products: 10,
        totalAmount: -20
      }
      const response = await request(app)
        .post('/order')
        .send(invalidOrder);

      expect(response.status).toBe(400);
    });

    it('should return an error for a non-existent customer', async () => {
      const invalidOrder = {
        customerId: -1,
        productIds: [products[0].id],
        totalAmount: 1000
      }
      const response = await request(app)
        .post('/order')
        .send(invalidOrder);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Customer not found');
    });

    it('should return an error for non-existent products', async () => {
      const invalidOrder = {
        customerId: customers[0].id,
        productIds: [-1],
        totalAmount: 1500
      }

      const response = await request(app)
        .post('/order')
        .send(invalidOrder);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'One or more products not found');
    });
  });
});
