import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart, CartResponse } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/cart';

  public readonly cart = signal<Cart>({
    items: [],
    totalQuantity: 0,
    totalPrice: 0
  });

  public loadCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.baseUrl).pipe(
      tap((res) => {
        if (res.success) {
          this.cart.set(res.data);
        }
      })
    );
  }

  public addToCart(productId: string, quantity = 1): Observable<CartResponse> {
    return this.http
      .post<CartResponse>(`${this.baseUrl}/items`, { productId, quantity })
      .pipe(
        tap((res) => {
          if (res.success) {
            this.cart.set(res.data);
          }
        })
      );
  }
}
