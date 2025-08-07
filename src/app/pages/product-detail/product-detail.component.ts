import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, switchMap, catchError, of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="text-center py-20">
          <div class="text-red-600 text-lg mb-4">{{ error }}</div>
          <button 
            (click)="reloadProduct()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>

        <!-- Product Content -->
        <div *ngIf="product && !isLoading" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Breadcrumb -->
          <nav class="px-6 py-4 border-b border-gray-200">
            <ol class="flex items-center space-x-2 text-sm text-gray-500">
              <li><a routerLink="/" class="hover:text-blue-600">Home</a></li>
              <li>/</li>
              <li><a routerLink="/products" class="hover:text-blue-600">Products</a></li>
              <li>/</li>
              <li class="text-gray-900">{{ product.name }}</li>
            </ol>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <!-- Product Images -->
            <div class="space-y-4">
              <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  [src]="selectedImage || product.images[0]" 
                  [alt]="product.name"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Thumbnail Images -->
              <div class="grid grid-cols-4 gap-2">
                <button 
                  *ngFor="let image of product.images; let i = index"
                  (click)="selectedImage = image"
                  [class]="selectedImage === image ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300'"
                  class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <img [src]="image" [alt]="product.name" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
              <!-- Product Header -->
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
                <div class="flex items-center space-x-4 mb-4">
                  <div class="flex items-center">
                    <div class="flex items-center">
                      <svg 
                        *ngFor="let star of getRatingStars(product.ratings.average)"
                        [class]="star ? 'text-yellow-400' : 'text-gray-300'"
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">
                      {{ product.ratings.average }} ({{ product.ratings.count }} reviews)
                    </span>
                  </div>
                  <span class="text-sm text-gray-500">|</span>
                  <span class="text-sm text-gray-500">SKU: {{ product.sku }}</span>
                </div>
              </div>

              <!-- Price -->
              <div class="flex items-center space-x-4">
                <span class="text-3xl font-bold text-gray-900">
                  {{ formatPrice(product.price) }}
                </span>
                <span *ngIf="product.originalPrice && product.originalPrice > product.price" 
                      class="text-xl text-gray-500 line-through">
                  {{ formatPrice(product.originalPrice) }}
                </span>
                <span *ngIf="product.originalPrice && product.originalPrice > product.price"
                      class="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  {{ calculateDiscountPercentage(product.originalPrice, product.price) }}% OFF
                </span>
              </div>

              <!-- Stock Status -->
              <div class="flex items-center space-x-2">
                <div [class]="product.inStock ? 'text-green-600' : 'text-red-600'" class="flex items-center">
                  <div [class]="product.inStock ? 'bg-green-100' : 'bg-red-100'" class="w-2 h-2 rounded-full mr-2"></div>
                  <span class="text-sm font-medium">
                    {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </div>
                <span *ngIf="product.inStock" class="text-sm text-gray-500">
                  ({{ product.stockQuantity }} available)
                </span>
              </div>

              <!-- Description -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
              </div>

              <!-- Add to Cart Form -->
              <form [formGroup]="addToCartForm" (ngSubmit)="addToCart()" class="space-y-4">
                <!-- Color Selection -->
                <div *ngIf="product.colors && product.colors.length > 0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div class="flex space-x-2">
                    <button
                      *ngFor="let color of product.colors"
                      type="button"
                      (click)="selectedColor = color"
                      [class]="selectedColor === color ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300'"
                      class="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50"
                    >
                      {{ color }}
                    </button>
                  </div>
                </div>

                <!-- Size Selection -->
                <div *ngIf="product.sizes && product.sizes.length > 0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <div class="flex space-x-2">
                    <button
                      *ngFor="let size of product.sizes"
                      type="button"
                      (click)="selectedSize = size"
                      [class]="selectedSize === size ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300'"
                      class="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50"
                    >
                      {{ size }}
                    </button>
                  </div>
                </div>

                <!-- Quantity -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div class="flex items-center space-x-3">
                    <button
                      type="button"
                      (click)="decreaseQuantity()"
                      [disabled]="quantity <= 1"
                      class="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      formControlName="quantity"
                      min="1"
                      max="99"
                      class="w-16 text-center border border-gray-300 rounded-md py-1"
                    />
                    <button
                      type="button"
                      (click)="increaseQuantity()"
                      [disabled]="quantity >= 99"
                      class="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-4">
                  <button
                    type="submit"
                    [disabled]="!product.inStock || isAddingToCart"
                    class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span *ngIf="!isAddingToCart">Add to Cart</span>
                    <span *ngIf="isAddingToCart">Adding...</span>
                  </button>
                  
                  <button
                    type="button"
                    (click)="toggleWishlist()"
                    [class]="isInWishlist ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'"
                    class="px-4 py-3 text-white rounded-lg font-medium"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path *ngIf="!isInWishlist" fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                      <path *ngIf="isInWishlist" fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </form>

              <!-- Trust Indicators -->
              <div class="border-t border-gray-200 pt-6">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Free Shipping
                  </div>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    2-Year Warranty
                  </div>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    30-Day Returns
                  </div>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    Fast Installation
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Details Tabs -->
          <div class="border-t border-gray-200">
            <div class="px-6 py-4">
              <nav class="flex space-x-8">
                <button
                  (click)="activeTab = 'specifications'"
                  [class]="activeTab === 'specifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                  class="border-b-2 py-2 px-1 text-sm font-medium"
                >
                  Specifications
                </button>
                <button
                  (click)="activeTab = 'reviews'"
                  [class]="activeTab === 'reviews' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                  class="border-b-2 py-2 px-1 text-sm font-medium"
                >
                  Reviews ({{ product.reviews.length || 0 }})
                </button>
              </nav>

              <!-- Specifications Tab -->
              <div *ngIf="activeTab === 'specifications'" class="mt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h4>
                    <dl class="space-y-3">
                      <div *ngFor="let spec of getSpecifications()" class="flex justify-between">
                        <dt class="text-gray-600">{{ spec.key }}</dt>
                        <dd class="text-gray-900 font-medium">{{ spec.value }}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Features</h4>
                    <ul class="space-y-2">
                      <li *ngFor="let feature of product.features" class="flex items-start">
                        <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-gray-700">{{ feature }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Reviews Tab -->
              <div *ngIf="activeTab === 'reviews'" class="mt-6">
                <div class="space-y-6">
                  <div *ngFor="let review of product.reviews" class="border-b border-gray-200 pb-6">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <div class="flex items-center">
                          <svg 
                            *ngFor="let star of getRatingStars(review.rating)"
                            [class]="star ? 'text-yellow-400' : 'text-gray-300'"
                            class="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </div>
                        <span class="ml-2 text-sm text-gray-600">{{ review.userName }}</span>
                      </div>
                      <span class="text-sm text-gray-500">{{ review.createdAt | date }}</span>
                    </div>
                    <h5 class="font-medium text-gray-900 mb-1">{{ review.title }}</h5>
                    <p class="text-gray-700">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isLoading = false;
  error: string | null = null;
  selectedImage: string | null = null;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  quantity = 1;
  isAddingToCart = false;
  isInWishlist = false;
  activeTab: 'specifications' | 'reviews' = 'specifications';
  
  addToCartForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.addToCartForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(99)]]
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const productId = params['id'];
        if (!productId) {
          this.router.navigate(['/products']);
          return of(null);
        }
        return this.loadProduct(productId);
      }),
      catchError(error => {
        this.error = 'Failed to load product';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(productId: string): Observable<Product | null> {
    this.isLoading = true;
    this.error = null;

    return this.productService.getProduct(productId).pipe(
      tap(product => {
        this.product = product;
        if (product && product.images.length > 0) {
          this.selectedImage = product.images[0];
        }
        this.isLoading = false;
        this.checkWishlistStatus();
        this.incrementViewCount(productId);
      }),
      catchError(error => {
        this.error = 'Failed to load product';
        this.isLoading = false;
        return of(null);
      })
    );
  }

  addToCart(): void {
    if (!this.product || !this.addToCartForm.valid) return;

    this.isAddingToCart = true;
    const formValue = this.addToCartForm.value;

    const request = {
      productId: this.product.id,
      quantity: formValue.quantity,
      color: this.selectedColor || undefined,
      size: this.selectedSize || undefined
    };

    this.cartService.addToCart(request).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.isAddingToCart = false;
        // Show success message or navigate to cart
      },
      error: (error: any) => {
        this.isAddingToCart = false;
        console.error('Failed to add to cart:', error);
      }
    });
  }

  toggleWishlist(): void {
    if (!this.product) return;

    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.isInWishlist = false;
      });
    } else {
      const request = {
        productId: this.product.id,
        color: this.selectedColor || undefined,
        size: this.selectedSize || undefined
      };
      
      this.wishlistService.addToWishlist(request).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.isInWishlist = true;
      });
    }
  }

  checkWishlistStatus(): void {
    if (!this.product) return;
    this.isInWishlist = this.wishlistService.isInWishlist(this.product.id);
  }

  incrementViewCount(productId: string): void {
    this.productService.incrementViewCount(productId).pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  increaseQuantity(): void {
    if (this.quantity < 99) {
      this.quantity++;
      this.addToCartForm.patchValue({ quantity: this.quantity });
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.addToCartForm.patchValue({ quantity: this.quantity });
    }
  }

  getRatingStars(rating: number): boolean[] {
    return this.productService.getRatingStars(rating);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  calculateDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return this.productService.calculateDiscountPercentage(originalPrice, currentPrice);
  }

  getSpecifications(): { key: string; value: string }[] {
    if (!this.product?.specifications) return [];
    return Object.entries(this.product.specifications).map(([key, value]) => ({
      key,
      value: value as string
    }));
  }

  reloadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.router.navigate(['/products']);
    }
  }
} 