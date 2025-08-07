import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WishlistService, Wishlist, WishlistItem } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p class="mt-2 text-gray-600">
            {{ wishlist.totalItems }} item{{ wishlist.totalItems !== 1 ? 's' : '' }} in your wishlist
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

        <!-- Empty Wishlist -->
        <div *ngIf="wishlist.items.length === 0" class="text-center py-12">
          <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p class="text-gray-600 mb-6">Start adding items to your wishlist to save them for later.</p>
          <a routerLink="/product" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            Start Shopping
          </a>
        </div>

        <!-- Wishlist Items -->
        <div *ngIf="wishlist.items.length > 0" class="space-y-6">
          <!-- Actions Bar -->
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <button 
                (click)="selectAll()"
                class="text-sm text-orange-600 hover:text-orange-500"
              >
                Select All
              </button>
              <button 
                (click)="clearSelection()"
                class="text-sm text-gray-600 hover:text-gray-500"
              >
                Clear Selection
              </button>
            </div>
            
            <div class="flex items-center space-x-4">
              <button 
                (click)="moveSelectedToCart()"
                [disabled]="selectedItems.length === 0 || isUpdating"
                class="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                Move to Cart ({{ selectedItems.length }})
              </button>
              <button 
                (click)="removeSelected()"
                [disabled]="selectedItems.length === 0 || isUpdating"
                class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Remove Selected
              </button>
            </div>
          </div>

          <!-- Items Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div *ngFor="let item of wishlist.items" class="bg-white rounded-lg shadow-md overflow-hidden">
              <!-- Item Selection -->
              <div class="p-4 border-b border-gray-200">
                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    [checked]="isSelected(item)"
                    (change)="toggleSelection(item)"
                    class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">Select</span>
                </label>
              </div>

              <!-- Item Image -->
              <div class="aspect-w-1 aspect-h-1 w-full">
                <img 
                  [src]="item.image || '/assets/images/products/dog-backseat-extender.jpg'" 
                  [alt]="item.name"
                  class="w-full h-48 object-cover"
                >
              </div>

              <!-- Item Details -->
              <div class="p-4">
                <h3 class="text-sm font-medium text-gray-900 mb-2">{{ item.name }}</h3>
                
                <div class="text-sm text-gray-500 mb-2">
                  <span *ngIf="item.color">Color: {{ item.color }}</span>
                  <span *ngIf="item.size" class="ml-2">Size: {{ item.size }}</span>
                </div>
                
                <div class="flex items-center justify-between mb-4">
                  <span class="text-lg font-bold text-gray-900">
                    {{ formatPrice(item.price) }}
                  </span>
                  <span 
                    [class]="item.inStock ? 'text-green-600' : 'text-red-600'"
                    class="text-sm font-medium"
                  >
                    {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </div>

                <!-- Stock Status -->
                <div *ngIf="!item.inStock" class="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p class="text-sm text-yellow-800">
                    This item is currently out of stock. We'll notify you when it's available.
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2">
                  <button 
                    (click)="addToCart(item)"
                    [disabled]="!item.inStock || isUpdating"
                    class="flex-1 bg-orange-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  
                  <button 
                    (click)="removeFromWishlist(item)"
                    [disabled]="isUpdating"
                    class="p-2 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>

                <!-- Added Date -->
                <div class="mt-3 text-xs text-gray-500">
                  Added {{ formatDate(item.addedAt) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div *ngIf="hasMoreItems" class="text-center py-8">
            <button 
              (click)="loadMore()"
              [disabled]="isLoading"
              class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {{ isLoading ? 'Loading...' : 'Load More' }}
            </button>
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
export class WishlistComponent implements OnInit, OnDestroy {
  wishlist: Wishlist = {
    items: [],
    totalItems: 0
  };
  
  selectedItems: WishlistItem[] = [];
  isLoading = false;
  isUpdating = false;
  errorMessage = '';
  successMessage = '';
  hasMoreItems = false;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cdr.detectChanges();
      
      // Subscribe to wishlist
      this.wishlistService.wishlist$.pipe(takeUntil(this.destroy$)).subscribe(wishlist => {
        this.wishlist = wishlist;
        this.cdr.detectChanges();
      });

      // Subscribe to loading state
      this.wishlistService.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
        this.isLoading = loading;
        this.cdr.detectChanges();
      });

      // Subscribe to error state
      this.wishlistService.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
        this.errorMessage = error || '';
        this.cdr.detectChanges();
      });

      // Load wishlist
      this.loadWishlist();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe();
  }

  selectAll() {
    this.selectedItems = [...this.wishlist.items];
  }

  clearSelection() {
    this.selectedItems = [];
  }

  toggleSelection(item: WishlistItem) {
    const index = this.selectedItems.findIndex(selected => 
      selected.id === item.id
    );
    
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
  }

  isSelected(item: WishlistItem): boolean {
    return this.selectedItems.some(selected => selected.id === item.id);
  }

  addToCart(item: WishlistItem) {
    this.isUpdating = true;
    this.clearMessages();

    this.cartService.addToCart({
      productId: item.productId,
      quantity: 1,
      color: item.color,
      size: item.size,
      customizations: item.customizations
    }).subscribe({
      next: () => {
        // Remove from wishlist
        this.wishlistService.removeFromWishlist(item.productId, item.color, item.size).subscribe({
          next: () => {
            this.successMessage = 'Item added to cart and removed from wishlist';
            this.isUpdating = false;
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to remove from wishlist';
            this.isUpdating = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to add to cart';
        this.isUpdating = false;
      }
    });
  }

  removeFromWishlist(item: WishlistItem) {
    this.isUpdating = true;
    this.clearMessages();

    this.wishlistService.removeFromWishlist(item.productId, item.color, item.size).subscribe({
      next: () => {
        this.successMessage = 'Item removed from wishlist';
        this.isUpdating = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to remove item';
        this.isUpdating = false;
      }
    });
  }

  moveSelectedToCart() {
    if (this.selectedItems.length === 0) return;

    this.isUpdating = true;
    this.clearMessages();

    const promises = this.selectedItems.map(item => 
      this.cartService.addToCart({
        productId: item.productId,
        quantity: 1,
        color: item.color,
        size: item.size,
        customizations: item.customizations
      }).toPromise()
    );

    Promise.all(promises).then(() => {
      // Remove all selected items from wishlist
      const removePromises = this.selectedItems.map(item =>
        this.wishlistService.removeFromWishlist(item.productId, item.color, item.size).toPromise()
      );

      Promise.all(removePromises).then(() => {
        this.successMessage = `${this.selectedItems.length} item(s) moved to cart`;
        this.selectedItems = [];
        this.isUpdating = false;
      }).catch(error => {
        this.errorMessage = 'Failed to remove some items from wishlist';
        this.isUpdating = false;
      });
    }).catch(error => {
      this.errorMessage = 'Failed to add some items to cart';
      this.isUpdating = false;
    });
  }

  removeSelected() {
    if (this.selectedItems.length === 0) return;

    this.isUpdating = true;
    this.clearMessages();

    const promises = this.selectedItems.map(item =>
      this.wishlistService.removeFromWishlist(item.productId, item.color, item.size).toPromise()
    );

    Promise.all(promises).then(() => {
      this.successMessage = `${this.selectedItems.length} item(s) removed from wishlist`;
      this.selectedItems = [];
      this.isUpdating = false;
    }).catch(error => {
      this.errorMessage = 'Failed to remove some items';
      this.isUpdating = false;
    });
  }

  loadMore() {
    // Implement pagination logic here
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  formatPrice(price: number): string {
    return this.wishlistService.formatPrice(price);
  }

  formatDate(dateString: string): string {
    return this.wishlistService.formatDate(dateString);
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}