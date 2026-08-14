import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productServiceMock: any;
  let cartServiceMock: any;

  const mockProducts = [
    {
      id: 'prod-1',
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Premium over-ear wireless headphones.',
      price: 199.99,
      category: 'Electronics',
      imageUrl: 'https://example.com/headphones.jpg',
      rating: 4.8,
      inStock: true,
      isFeatured: true
    }
  ];

  beforeEach(async () => {
    productServiceMock = {
      getProducts: vi.fn().mockReturnValue(of(mockProducts)),
      getCategories: vi.fn().mockReturnValue(of(['All', 'Electronics', 'Fashion']))
    };

    cartServiceMock = {
      cart: signalMock({
        items: [],
        totalQuantity: 0,
        totalPrice: 0
      }),
      loadCart: vi.fn().mockReturnValue(of({ success: true, data: { items: [], totalQuantity: 0, totalPrice: 0 } })),
      addToCart: vi.fn().mockReturnValue(of({ success: true, data: { items: [], totalQuantity: 1, totalPrice: 199.99 } }))
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceMock },
        { provide: CartService, useValue: cartServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function signalMock<T>(initialValue: T) {
    const s = () => initialValue;
    return s as any;
  }

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories and products on init', () => {
    expect(productServiceMock.getCategories).toHaveBeenCalled();
    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(1);
    expect(component.categories()).toEqual(['All', 'Electronics', 'Fashion']);
  });

  it('should filter products when category is selected', () => {
    component.selectCategory('Electronics');
    expect(component.selectedCategory()).toBe('Electronics');
    expect(productServiceMock.getProducts).toHaveBeenCalledWith('', 'Electronics');
  });

  it('should call addToCart when add to cart button is clicked', () => {
    component.addToCart(mockProducts[0]);
    expect(cartServiceMock.addToCart).toHaveBeenCalledWith('prod-1', 1);
  });
});
