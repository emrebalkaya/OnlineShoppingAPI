import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';
import { Customer } from '../src/entity/Customer';
import { Repository } from 'typeorm';

let customerRepository: Repository<Customer>;

beforeAll(async () => {
  await AppDataSource.initialize();
  customerRepository = AppDataSource.getRepository(Customer);
});

afterAll(async () => {
  await customerRepository.delete({});
  AppDataSource.destroy();
});

describe('CustomerController', () => {
  describe('GET /customers', () => {
    it('should return a list of customers', async () => {
      await customerRepository.save([
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
        {
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice.smith@example.com',
          password: 'password456',
        },
      ]);

      const response = await request(app).get('/customers');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);

      response.body.forEach((customer) => {
        expect(customer).toHaveProperty('id');
        expect(customer).toHaveProperty('firstName');
        expect(customer).toHaveProperty('lastName');
        expect(customer).toHaveProperty('email');
        expect(customer).toHaveProperty('password');
      });
    });
  });

  describe('POST /login', () => {
    it('should successfully log in a user', async () => {
      const testCustomer = await customerRepository.save({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe2@example.com',
        password: 'password123',
      });

      const loginData = {
        email: 'john.doe2@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Successfully logged in.');
    });

    it('should return an error for invalid login credentials', async () => {
      const invalidLoginData = {
        email: 'nonexistent@example.com',
        password: 'incorrectpassword',
      };

      const response = await request(app)
        .post('/login')
        .send(invalidLoginData);

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found or password is incorrect.');
    });
  });

  describe('POST /register', () => {
    it('should successfully register a new customer', async () => {
      const newCustomerData = {
        firstName: 'New',
        lastName: 'Customer',
        email: 'new@example.com',
        password: 'newpassword',
      };

      const response = await request(app)
        .post('/register')
        .send(newCustomerData);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe(newCustomerData.firstName);
      expect(response.body.lastName).toBe(newCustomerData.lastName);
      expect(response.body.email).toBe(newCustomerData.email);
    });

    it('should return validation errors for an invalid registration request', async () => {
      const invalidCustomerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalidemail',
        password: 'short',
      };

      const response = await request(app)
        .post('/register')
        .send(invalidCustomerData);

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
