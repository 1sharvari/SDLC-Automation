import { Product, GetProductsQuery } from './products.types.js';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear wireless headphones with active noise cancellation.',
    price: 199.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    rating: 4.8,
    inStock: true,
    isFeatured: true
  },
  {
    id: 'prod-2',
    name: 'Ergonomic Mechanical Keyboard',
    description: 'Tactile mechanical keyboard with RGB backlighting and wrist rest.',
    price: 129.5,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    rating: 4.7,
    inStock: true,
    isFeatured: true
  },
  {
    id: 'prod-3',
    name: 'Minimalist Stainless Steel Watch',
    description: 'Elegant water-resistant quartz watch with genuine leather strap.',
    price: 89.0,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80',
    rating: 4.5,
    inStock: true,
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: 'Organic Cotton Crewneck T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt with modern regular fit.',
    price: 28.0,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    rating: 4.3,
    inStock: true,
    isFeatured: false
  },
  {
    id: 'prod-5',
    name: 'Pour-Over Ceramic Coffee Maker',
    description: 'Artisan ceramic dripper with reusable stainless steel filter.',
    price: 45.0,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
    rating: 4.9,
    inStock: true,
    isFeatured: true
  },
  {
    id: 'prod-6',
    name: 'Aromatherapy Essential Oil Diffuser',
    description: 'Ultrasonic whisper-quiet cool mist diffuser with 7 ambient LED lights.',
    price: 34.99,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
    rating: 4.6,
    inStock: true,
    isFeatured: false
  }
];

export class ProductsService {
  private products: Product[] = [...INITIAL_PRODUCTS];

  public getProducts(query: GetProductsQuery = {}): Product[] {
    let result = [...this.products];

    if (query.category && query.category.trim() !== '' && query.category.toLowerCase() !== 'all') {
      const cat = query.category.toLowerCase();
      result = result.filter((p) => p.category.toLowerCase() === cat);
    }

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    if (query.featuredOnly) {
      result = result.filter((p) => p.isFeatured);
    }

    return result;
  }

  public getCategories(): string[] {
    const categories = new Set<string>();
    for (const product of this.products) {
      categories.add(product.category);
    }
    return ['All', ...Array.from(categories)];
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}

export const productsService = new ProductsService();
