import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService, AddToCartRequest } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { AuthService } from '../services/auth.service';

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  customizations?: {
    [key: string]: any;
  };
}

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-2">
      <!-- Quantity Selector -->
      <div class="flex items-center border border-gray-300 rounded-md">
        <button 
          (click)="decreaseQuantity()"
          [disabled]="quantity <= 1 || isUpdating"
          class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
          </svg>
        </button>
        <span class="px-3 py-2 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
          {{ quantity }}
        </span>
        <button 
          (click)="increaseQuantity()"
          [disabled]="isUpdating"
          class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </button>
      </div>

      <!-- Add to Cart Button -->
      <button 
        (click)="addToCart()"
        [disabled]="isUpdating || !product"
        class="flex-1 bg-orange-600 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <div class="flex items-center justify-center space-x-2">
          <svg *ngIf="!isUpdating" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
          </svg>
          <svg *ngIf="isUpdating" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>{{ isUpdating ? 'Adding...' : 'Add to Cart' }}</span>
        </div>
      </button>

      <!-- Wishlist Button -->
      <button 
        (click)="toggleWishlist()"
        [disabled]="isUpdating || !product"
        [class]="isInWishlist ? 'text-red-500' : 'text-gray-400'"
        class="p-3 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
        [title]="isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div *ngIf="successMessage" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-md animate-fade-in">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-green-800 font-medium">{{ successMessage }}</p>
      </div>
    </div>

    <div *ngIf="errorMessage" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md animate-fade-in">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-sm text-red-800 font-medium">{{ errorMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AddToCartButtonComponent implements OnInit, OnDestroy {
  @Input() product: Product | null = null;
  @Input() initialQuantity: number = 1;
  @Output() addedToCart = new EventEmitter<void>();
  @Output() addedToWishlist = new EventEmitter<void>();
  @Output() removedFromWishlist = new EventEmitter<void>();

  quantity = 1;
  isUpdating = false;
  isInWishlist = false;
  successMessage = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.quantity = this.initialQuantity;
      this.checkWishlistStatus();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;

    this.isUpdating = true;
    this.clearMessages();

    const request: AddToCartRequest = {
      productId: this.product.id,
      quantity: this.quantity,
      color: this.product.color,
      size: this.product.size,
      customizations: this.product.customizations
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        this.successMessage = 'Added to cart successfully!';
        this.addedToCart.emit();
        this.isUpdating = false;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to add to cart';
        this.isUpdating = false;
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  toggleWishlist() {
    if (!this.product) return;

    this.isUpdating = true;
    this.clearMessages();

    if (this.isInWishlist) {
      // Remove from wishlist
      this.wishlistService.removeFromWishlist(
        this.product.id, 
        this.product.color, 
        this.product.size
      ).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.successMessage = 'Removed from wishlist';
          this.removedFromWishlist.emit();
          this.isUpdating = false;
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to remove from wishlist';
          this.isUpdating = false;
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist({
        productId: this.product.id,
        color: this.product.color,
        size: this.product.size,
        customizations: this.product.customizations
      }).subscribe({
        next: () => {
          this.isInWishlist = true;
          this.successMessage = 'Added to wishlist!';
          this.addedToWishlist.emit();
          this.isUpdating = false;
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to add to wishlist';
          this.isUpdating = false;
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  private checkWishlistStatus() {
    if (this.product) {
      this.isInWishlist = this.wishlistService.isInWishlist(
        this.product.id,
        this.product.color,
        this.product.size
      );
    }
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
} 
 