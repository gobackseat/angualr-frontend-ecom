import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService, Cart, CartItem } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p class="mt-2 text-gray-600">
            {{ cart.totalItems }} item{{ cart.totalItems !== 1 ? 's' : '' }} in your cart
          </p>
        </div>

        <!-- Success/Error Messages -->
        <div *ngIf="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Empty Cart -->
        <div *ngIf="cart.items.length === 0" class="text-center py-12">
          <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p class="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <a routerLink="/product" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            Continue Shopping
          </a>
        </div>

        <!-- Cart Items -->
        <div *ngIf="cart.items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items List -->
          <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Cart Items</h2>
              </div>
              <div class="divide-y divide-gray-200">
                <div *ngFor="let item of cart.items" class="px-6 py-4">
                  <div class="flex items-center">
                    <!-- Product Image -->
                    <div class="flex-shrink-0 w-20 h-20">
                      <img [src]="item.image || 'assets/images/products/dog-backseat-extender.jpg'" 
                           [alt]="item.name"
                           class="w-full h-full object-cover rounded-md">
                    </div>
                    
                    <!-- Product Details -->
                    <div class="ml-4 flex-1">
                      <div class="flex justify-between">
                        <div>
                          <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                          <div class="mt-1 text-sm text-gray-500">
                            <span *ngIf="item.color">Color: {{ item.color }}</span>
                            <span *ngIf="item.size" class="ml-2">Size: {{ item.size }}</span>
                          </div>
                          <p class="mt-1 text-sm font-medium text-gray-900">
                            {{ formatPrice(item.price) }}
                          </p>
                        </div>
                        
                        <!-- Quantity Controls -->
                        <div class="flex items-center space-x-2">
                          <button 
                            (click)="updateQuantity(item.id, item.quantity - 1)"
                            [disabled]="item.quantity <= 1 || isUpdating"
                            class="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                            </svg>
                          </button>
                          
                          <span class="text-sm font-medium text-gray-900 w-8 text-center">
                            {{ item.quantity }}
                          </span>
                          
                          <button 
                            (click)="updateQuantity(item.id, item.quantity + 1)"
                            [disabled]="isUpdating"
                            class="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Actions -->
                      <div class="mt-4 flex items-center space-x-4">
                        <button 
                          (click)="moveToWishlist(item)"
                          [disabled]="isUpdating"
                          class="text-sm text-orange-600 hover:text-orange-500 disabled:opacity-50"
                        >
                          Move to Wishlist
                        </button>
                        <button 
                          (click)="removeItem(item.id)"
                          [disabled]="isUpdating"
                          class="text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              
              <div class="px-6 py-4 space-y-4">
                <!-- Subtotal -->
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-medium">{{ formatPrice(cart.subtotal) }}</span>
                </div>
                
                <!-- Tax -->
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax</span>
                  <span class="font-medium">{{ formatPrice(cart.tax) }}</span>
                </div>
                
                <!-- Shipping -->
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Shipping</span>
                  <span class="font-medium">
                    {{ cart.shipping === 0 ? 'Free' : formatPrice(cart.shipping) }}
                  </span>
                </div>
                
                <!-- Total -->
                <div class="flex justify-between text-lg font-bold border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span>{{ formatPrice(cart.total) }}</span>
                </div>
                
                <!-- Promo Code -->
                <div class="mt-4">
                  <form [formGroup]="promoForm" (ngSubmit)="applyPromoCode()" class="flex">
                    <input 
                      type="text" 
                      formControlName="promoCode"
                      placeholder="Promo code"
                      class="flex-1 rounded-l-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    >
                    <button 
                      type="submit"
                      [disabled]="promoForm.invalid || isUpdating"
                      class="px-4 py-2 bg-orange-600 text-white rounded-r-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                </div>
                
                <!-- Checkout Button -->
                <button 
                  (click)="proceedToCheckout()"
                  [disabled]="isUpdating"
                  class="w-full bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
                
                <!-- Sign in suggestion for better experience (optional) -->
                <div *ngIf="!isAuthenticated" class="text-center text-sm text-gray-600 mt-2">
                  <p class="mb-1">Sign in for faster checkout & order tracking</p>
                  <button
                    (click)="signInForBetterExperience()"
                    class="text-orange-600 hover:text-orange-700 underline"
                  >
                    Sign in now
                  </button>
                </div>
                
                <!-- Continue Shopping -->
                <a 
                  routerLink="/product"
                  class="block w-full text-center text-orange-600 hover:text-orange-500 font-medium"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: 'USD'
  };
  
  promoForm: FormGroup;
  isLoading = false;
  isUpdating = false;
  isAuthenticated = false;
  errorMessage = '';
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router
  ) {
    this.promoForm = this.fb.group({
      promoCode: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cdr.detectChanges();
      
      // Subscribe to cart
      this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe(cart => {
        this.cart = cart;
        this.cdr.detectChanges();
      });

      // Subscribe to loading state
      this.cartService.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
        this.isLoading = loading;
        this.cdr.detectChanges();
      });

      // Subscribe to error state
      this.cartService.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
        this.errorMessage = error || '';
        this.cdr.detectChanges();
      });

      // Subscribe to authentication state
      this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        this.cdr.detectChanges();
      });

      // Load cart
      this.loadCart();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart() {
    this.cartService.getCart().subscribe();
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.isUpdating = true;
    this.clearMessages();

    this.cartService.updateItemQuantity(itemId, quantity).subscribe({
      next: () => {
        this.successMessage = 'Cart updated successfully';
        this.isUpdating = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to update cart';
        this.isUpdating = false;
      }
    });
  }

  removeItem(itemId: string) {
    this.isUpdating = true;
    this.clearMessages();

    this.cartService.removeItem(itemId).subscribe({
      next: () => {
        this.successMessage = 'Item removed from cart';
        this.isUpdating = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to remove item';
        this.isUpdating = false;
      }
    });
  }

  moveToWishlist(item: CartItem) {
    this.isUpdating = true;
    this.clearMessages();

    // Add to wishlist
    this.wishlistService.addToWishlist({
      productId: item.productId,
      color: item.color,
      size: item.size,
      customizations: item.customizations
    }).subscribe({
      next: () => {
        // Remove from cart
        this.cartService.removeItem(item.id).subscribe({
          next: () => {
            this.successMessage = 'Item moved to wishlist';
            this.isUpdating = false;
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to move item';
            this.isUpdating = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to add to wishlist';
        this.isUpdating = false;
      }
    });
  }

  applyPromoCode() {
    if (this.promoForm.valid) {
      const promoCode = this.promoForm.get('promoCode')?.value;
      // Implement promo code logic here
      this.successMessage = 'Promo code applied successfully';
      this.promoForm.reset();
    }
  }

  proceedToCheckout() {
    // Always allow checkout - the checkout page will handle guest vs authenticated flows
    this.router.navigate(['/checkout']);
  }

  signInForBetterExperience() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
} 