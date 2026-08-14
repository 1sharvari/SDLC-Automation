export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
  inStock: boolean;
  isFeatured: boolean;
}

export interface GetProductsQuery {
  search?: string;
  category?: string;
  featuredOnly?: boolean;
}
