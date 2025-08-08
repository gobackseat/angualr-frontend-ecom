import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService, Cart, CartItem } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { AuthService } from '../services/auth.service';
import { CartSidebarService } from '../services/cart-sidebar.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Overlay -->
    <div 
      *ngIf="isOpen"
      (click)="closeSidebar()"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    ></div>

    <!-- Sidebar -->
    <div 
      *ngIf="isOpen"
      class="fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-50 overflow-hidden"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
          </svg>
          <h2 class="text-xl font-bold text-gray-900">Shopping Cart</h2>
          <span class="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
            {{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }}
          </span>
        </div>
        <button 
          (click)="closeSidebar()"
          class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State -->
        <div *ngIf="isUpdating" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Updating cart...</p>
        </div>

        <div *ngIf="cart.items.length === 0 && !isUpdating" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p class="text-gray-600 mb-6">Add some products to get started!</p>
          <button 
            (click)="closeSidebar()"
            class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div *ngIf="cart.items.length > 0 && !isUpdating" class="space-y-4">
          <div 
            *ngFor="let item of cart.items"
            class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <img 
              [src]="item.image || 'assets/images/products/dog-backseat-extender.jpg'" 
              [alt]="item.name"
              class="w-16 h-16 object-cover rounded-lg"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ formatPrice(item.price) }}</p>
              <div class="flex items-center space-x-2 mt-2">
                <button 
                  (click)="updateQuantity(item.id, item.quantity - 1)"
                  [disabled]="isUpdating"
                  class="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                <button 
                  (click)="updateQuantity(item.id, item.quantity + 1)"
                  [disabled]="isUpdating"
                  class="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <p class="text-sm font-medium text-gray-900">{{ formatPrice(item.price * item.quantity) }}</p>
              <div class="flex space-x-1">
                <button 
                  (click)="moveToWishlist(item)"
                  [disabled]="isUpdating"
                  class="p-1 rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 transition-colors"
                  title="Move to wishlist"
                >
                  <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
                <button 
                  (click)="removeItem(item.id)"
                  [disabled]="isUpdating"
                  class="p-1 rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 transition-colors"
                  title="Remove item"
                >
                  <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div *ngIf="cart.items.length > 0" class="border-t border-gray-200 p-6 space-y-4">
        <!-- Order Summary -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Subtotal</span>
            <span class="font-medium">{{ formatPrice(cart.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Shipping</span>
            <span class="font-medium">{{ cart.shipping === 0 ? 'Free' : formatPrice(cart.shipping) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Tax</span>
            <span class="font-medium">{{ formatPrice(cart.tax) }}</span>
          </div>
          <div class="border-t border-gray-200 pt-2">
            <div class="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{{ formatPrice(cart.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div class="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span>Secure</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span>Fast Shipping</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            <span>4.9★</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <!-- Main Checkout Button -->
          <button
            (click)="proceedToCheckout()"
            [disabled]="isUpdating"
            class="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <span>Proceed to Checkout</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          
          <!-- Sign in suggestion for better experience (optional) -->
          <div *ngIf="!isAuthenticated" class="text-center">
            <p class="text-xs text-gray-500 mb-2">Sign in for faster checkout & order tracking</p>
            <button
              (click)="signInForBetterExperience()"
              class="text-xs text-orange-600 hover:text-orange-700 underline"
            >
              Sign in now
            </button>
          </div>
          
          <button
            (click)="clearCart()"
            [disabled]="isUpdating"
            class="w-full px-6 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Clear Cart
          </button>
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
export class CartSidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: 'USD'
  };
  isUpdating = false;
  isAuthenticated = false;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router,
    private cartSidebarService: CartSidebarService
  ) {}

  ngOnInit() {
    // Subscribe to cart sidebar service
    this.cartSidebarService.isOpen$.pipe(takeUntil(this.destroy$)).subscribe(isOpen => {
      this.isOpen = isOpen;
      this.cdr.detectChanges();
    });

    // Subscribe to cart updates
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe(cart => {
      this.cart = cart;
      this.cdr.detectChanges();
    });

    // Subscribe to authentication state
    this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown.escape')
  handleKeyDown() {
    if (this.isOpen) {
      this.closeSidebar();
    }
  }

  openSidebar() {
    this.isOpen = true;
  }

  closeSidebar() {
    this.cartSidebarService.closeSidebar();
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.cartService.updateItemQuantity(itemId, quantity).subscribe();
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId).subscribe();
  }

  moveToWishlist(item: CartItem) {
    // Add to wishlist
    this.wishlistService.addToWishlist({
      productId: item.productId,
      color: item.color,
      size: item.size,
      customizations: item.customizations
    }).subscribe({
      next: () => {
        // Remove from cart
        this.cartService.removeItem(item.id).subscribe();
      }
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe();
  }

  proceedToCheckout() {
    // Always allow checkout - the checkout page will handle guest vs authenticated flows
    this.router.navigate(['/checkout']);
    this.closeSidebar();
  }

  signInForBetterExperience() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    this.closeSidebar();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
} 