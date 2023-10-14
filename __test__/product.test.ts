import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/data-source';
import { Product } from '../src/entity/Product';
import { Repository } from 'typeorm';

let productRepository: Repository<Product>;

beforeAll(async () => {
  await AppDataSource.initialize();
  productRepository = AppDataSource.getRepository(Product);
});

afterAll(async () => {
  await productRepository.delete({});
  AppDataSource.destroy();
});

describe('ProductController', () => {
  
  afterEach(async () => {
    await productRepository.delete({});
  });

  describe('GET /products', () => {
    it('should return a list of products', async () => {
      await productRepository.save([
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

      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      const productsInDatabase = await productRepository.find();
      expect(response.body.length).toBe(productsInDatabase.length);

 
      response.body.forEach((product, index) => {
        const productInDatabase = productsInDatabase[index];

        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name', productInDatabase.name);
        expect(product).toHaveProperty('stock', productInDatabase.stock);
        expect(product).toHaveProperty('price', productInDatabase.price);
        expect(product).toHaveProperty('description', productInDatabase.description);
      });
    });
  });

  describe('POST /products', () => {
    it('should add a new product', async () => {
      const newProductData = {
        name: 'New Product',
        stock: 20,
        price: 39.99,
        description: 'New Description',
      };

      const response = await request(app)
        .post('/products')
        .send(newProductData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('New Product');
      expect(response.body.stock).toBe(20);
      expect(response.body.price).toBe(39.99);
      expect(response.body.description).toBe('New Description');
    });

    it('should return an error when adding a product with the same name', async () => {
      const duplicateProductData = {
        name: 'Product 1',
        stock: 15,
        price: 24.99,
        description: 'Duplicate Description',
      };

      await productRepository.save(duplicateProductData);
      const response = await request(app)
        .post('/products')
        .send(duplicateProductData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Product with the same name already exists.');
    });
  });

  describe('PUT /products/:id', () => {
    it('should update an existing product', async () => {
      const updatedProductData = {
        name: 'Updated Product',
        stock: 25,
        price: 49.99,
        description: 'Updated Description',
      };

      await productRepository.save(updatedProductData);
      const savedProduct = await productRepository.findOne({ where: { name: updatedProductData.name } });

      const response = await request(app)
        .put(`/products/${savedProduct.id}`)
        .send(updatedProductData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Product');
      expect(response.body.stock).toBe(25);
      expect(response.body.price).toBe(49.99);
      expect(response.body.description).toBe('Updated Description');
    });

    it('should return an error when updating a non-existent product', async () => {
      const invalidProductData = {
        name: 'Invalid Product',
        stock: 10,
        price: 29.99,
        description: 'Invalid Description',
      };

      const response = await request(app)
        .put('/products/999')
        .send(invalidProductData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete an existing product', async () => {
      const newProductData = {
        name: 'New Product',
        stock: 20,
        price: 39.99,
        description: 'New Description',
      };

      await productRepository.save(newProductData);
      const savedProduct = await productRepository.findOne({ where: { name: newProductData.name } });
      const response = await request(app).delete(`/products/${savedProduct.id}`);
      const deletedProduct = await productRepository.findOne({ where: { id: savedProduct.id } });

      expect(response.status).toBe(204);
      expect(deletedProduct).toBeNull();
    });

    it('should return an error when deleting a non-existent product', async () => {
      const response = await request(app).delete('/products/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });
});
