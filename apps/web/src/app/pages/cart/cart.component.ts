import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page" data-testid="cart-page">
      <header class="cart-header">
        <a routerLink="/home" data-testid="back-to-home-link" class="back-link">
          &larr; Back to Shopping
        </a>
        <h1 data-testid="cart-title">Shopping Cart</h1>
      </header>

      <div class="cart-content" data-testid="cart-items-container">
        @if (cart().items.length === 0) {
          <p data-testid="cart-empty-message" class="empty-msg">Your cart is currently empty.</p>
        } @else {
          <ul class="cart-list">
            @for (item of cart().items; track item.product.id) {
              <li class="cart-item" [attr.data-testid]="'cart-item-' + item.product.id">
                <div class="item-info">
                  <span class="item-name" data-testid="cart-item-name">{{ item.product.name }}</span>
                  <span class="item-qty" data-testid="cart-item-quantity">Qty: {{ item.quantity }}</span>
                </div>
                <div class="item-price" data-testid="cart-item-price">
                  ${{ (item.product.price * item.quantity).toFixed(2) }}
                </div>
              </li>
            }
          </ul>
          <div class="cart-summary" data-testid="cart-summary">
            <h3>Total: ${{ cart().totalPrice.toFixed(2) }}</h3>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }
    .cart-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    .back-link {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }
    .cart-list {
      list-style: none;
      padding: 0;
      margin: 0 0 24px 0;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    .item-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .item-name {
      font-weight: 600;
      color: #1e293b;
    }
    .item-qty {
      font-size: 0.875rem;
      color: #64748b;
    }
    .item-price {
      font-weight: 700;
      color: #0f172a;
    }
    .empty-msg {
      color: #64748b;
      font-size: 1.1rem;
      padding: 40px 0;
      text-align: center;
    }
    .cart-summary {
      text-align: right;
      font-size: 1.25rem;
      padding: 16px 0;
    }
  `]
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  public readonly cart = this.cartService.cart;

  public ngOnInit(): void {
    this.cartService.loadCart().subscribe();
  }
}
