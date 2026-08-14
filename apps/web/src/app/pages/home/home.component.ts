import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly products = signal<Product[]>([]);
  public readonly categories = signal<string[]>([]);
  public readonly selectedCategory = signal<string>('All');
  public readonly isLoading = signal<boolean>(false);
  public readonly cart = this.cartService.cart;

  public readonly searchControl = new FormControl('');

  public ngOnInit(): void {
    this.loadCategories();
    this.fetchProducts();
    this.cartService.loadCart().subscribe();

    this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(() => {
        this.fetchProducts();
      });
  }

  public selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.fetchProducts();
  }

  public fetchProducts(): void {
    this.isLoading.set(true);
    const search = this.searchControl.value || '';
    const category = this.selectedCategory();

    this.productService.getProducts(search, category).subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
      }
    });
  }

  public addToCart(product: Product): void {
    this.cartService.addToCart(product.id, 1).subscribe();
  }

  public navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
