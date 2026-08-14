import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductsResponse, CategoriesResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/products';

  public getProducts(search?: string, category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (category && category !== 'All') {
      params = params.set('category', category);
    }
    return this.http
      .get<ProductsResponse>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  public getCategories(): Observable<string[]> {
    return this.http
      .get<CategoriesResponse>(`${this.baseUrl}/categories`)
      .pipe(map((res) => res.data));
  }
}
