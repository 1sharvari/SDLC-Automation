import { describe, it, expect, beforeEach } from 'vitest';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
  });

  it('should return all products when no filters are applied', () => {
    const products = service.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  it('should filter products by category', () => {
    const products = service.getProducts({ category: 'Electronics' });
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.category === 'Electronics')).toBe(true);
  });

  it('should search products by name or description', () => {
    const products = service.getProducts({ search: 'Headphones' });
    expect(products.length).toBe(1);
    expect(products[0].name).toContain('Headphones');
  });

  it('should return categories list starting with All', () => {
    const categories = service.getCategories();
    expect(categories[0]).toBe('All');
    expect(categories).toContain('Electronics');
    expect(categories).toContain('Fashion');
    expect(categories).toContain('Home & Kitchen');
  });

  it('should find product by ID', () => {
    const product = service.getProductById('prod-1');
    expect(product).toBeDefined();
    expect(product?.name).toBe('Wireless Noise-Canceling Headphones');
  });
});
