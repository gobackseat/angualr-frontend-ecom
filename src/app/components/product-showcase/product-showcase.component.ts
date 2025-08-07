import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil, Observable, of } from 'rxjs';
import { CartService, AddToCartRequest } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService, Product, ColorVariant, SizeVariant } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden w-full min-h-screen">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Floating paw prints -->
        <div class="absolute top-20 left-10 w-16 h-16 opacity-10 animate-bounce">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-orange-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="absolute top-40 right-20 w-12 h-12 opacity-15 animate-pulse">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-amber-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="absolute bottom-20 left-1/4 w-20 h-20 opacity-10 animate-bounce" style="animation-delay: 1s;">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-yellow-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <!-- Animated blurred circles -->
        <div class="absolute top-1/4 left-1/3 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/3 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="w-full px-6 mx-auto max-w-none">
        <div class="grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 relative z-10 w-full">
          <!-- Product Images -->
          <div class="space-y-6 min-w-0 flex-1">
            <!-- Mobile-optimized Image Slider -->
            <div class="relative overflow-hidden rounded-2xl shadow-2xl group w-full">
              <img 
                [src]="currentProductImage" 
                [alt]="'Dog Backseat Extender in ' + selectedColor + ' - View ' + (currentImageIndex + 1)"
                class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              <!-- Navigation Arrows - Hidden on mobile for better UX -->
              <div *ngIf="!isMobile" class="absolute inset-0 pointer-events-none">
                <button
                  (click)="prevImage()"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 pointer-events-auto"
                >
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button
                  (click)="nextImage()"
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 pointer-events-auto"
                >
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              <!-- Mobile Touch Indicators -->
              <div *ngIf="isMobile" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                <div 
                  *ngFor="let image of currentColorImages; let i = index"
                  class="w-2 h-2 rounded-full transition-all duration-200"
                  [class]="i === currentImageIndex ? 'bg-white' : 'bg-white/50'"
                ></div>
              </div>
            </div>

            <!-- Thumbnail Navigation - Optimized for mobile -->
            <div class="grid grid-cols-6 gap-2">
              <button
                *ngFor="let image of currentColorImages; let i = index"
                (click)="goToImage(i)"
                class="relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95"
                [class]="i === currentImageIndex ? 'border-orange-500 shadow-lg' : 'border-gray-200 hover:border-orange-300'"
              >
                <img 
                  [src]="image" 
                  [alt]="'Thumbnail ' + (i + 1)"
                  class="w-full h-16 object-cover"
                  loading="lazy"
                />
              </button>
            </div>
          </div>

          <!-- Product Details -->
          <div class="space-y-8 min-w-0 flex-1">
            <!-- Product Header -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {{ product?.category || 'Pet Car Accessories' }}
                </span>
                <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Free Shipping
                </span>
                <span *ngIf="product?.isOnSale" class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {{ product?.salePercentage }}% OFF
                </span>
              </div>

              <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {{ product?.name || 'Premium Dog Backseat Extender' }}
              </h1>

              <p class="text-lg text-gray-600 leading-relaxed">
                {{ product?.shortDescription || 'Transform your car\'s backseat into a comfortable and safe platform for your furry friend.' }}
              </p>

              <!-- Rating -->
              <div class="flex items-center gap-3">
                <div class="flex items-center">
                  <div *ngFor="let star of getRatingStars(product?.averageRating || 4.9)" class="flex">
                    <svg *ngIf="star" class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <svg *ngIf="!star" class="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
                <span class="text-lg font-semibold text-gray-900">{{ product?.averageRating || 4.9 }}</span>
                <span class="text-gray-600">({{ product?.totalReviews || 2847 }} reviews)</span>
              </div>
            </div>

            <!-- Price Section -->
            <div class="space-y-2">
              <div class="flex items-baseline gap-3">
                <span class="text-4xl font-bold text-gray-900">
                  {{ formatPrice(getCurrentPrice()) }}
                </span>
                <span *ngIf="showOriginalPrice" class="text-xl text-gray-500 line-through">
                  {{ formatPrice(originalPrice) }}
                </span>
                <span *ngIf="showSalePercentage" class="text-lg font-semibold text-red-600">
                  Save {{ salePercentage }}%
                </span>
              </div>
              <p class="text-sm text-gray-600">
                Free shipping on orders over $50 • 30-day returns • Lifetime warranty
              </p>
            </div>

            <!-- Color Selection -->
            <div class="space-y-4" *ngIf="product?.colorVariants?.length">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Choose Color</h3>
                <div class="flex flex-wrap gap-3">
                  <button
                    *ngFor="let colorVariant of product?.colorVariants || []"
                    (click)="selectColor(colorVariant)"
                    class="relative group"
                    [disabled]="!colorVariant.isActive"
                  >
                    <div class="w-16 h-16 rounded-full border-4 transition-all duration-200 flex items-center justify-center"
                         [class]="selectedColorVariant?.name === colorVariant.name ? 'border-orange-500 shadow-lg' : 'border-gray-200 hover:border-orange-300'"
                         [style.background-color]="colorVariant.hex">
                      <span class="text-xs font-medium text-white drop-shadow-lg">{{ colorVariant.name }}</span>
                    </div>
                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {{ colorVariant.name }} - {{ formatPrice(colorVariant.price) }}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Size Selection -->
            <div class="space-y-4" *ngIf="product?.sizeVariants?.length">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Choose Size</h3>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    *ngFor="let sizeVariant of product?.sizeVariants || []"
                    (click)="selectSize(sizeVariant)"
                    class="p-4 border-2 rounded-lg transition-all duration-200 text-left"
                    [class]="selectedSizeVariant?.name === sizeVariant.name ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'"
                    [disabled]="!sizeVariant.isActive"
                  >
                    <div class="font-semibold text-gray-900">{{ sizeVariant.name }}</div>
                    <div class="text-sm text-gray-600">{{ sizeVariant.dimensions.length }} x {{ sizeVariant.dimensions.width }}</div>
                    <div class="text-xs text-gray-500">Up to {{ sizeVariant.weightCapacity }} lbs</div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Quantity Selection -->
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div class="flex items-center gap-4">
                  <div class="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      (click)="decreaseQuantity()"
                      class="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                      [disabled]="quantity <= 1"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span class="w-16 h-12 flex items-center justify-center text-lg font-semibold text-gray-900 border-x border-gray-200">
                      {{ quantity }}
                    </span>
                    <button
                      (click)="increaseQuantity()"
                      class="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                      [disabled]="quantity >= getMaxQuantity()"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                  <span class="text-sm text-gray-600">
                    {{ getCurrentStock() }} in stock
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
              <!-- Add to Cart Button -->
              <button
                (click)="addToCart()"
                [disabled]="isAddingToCart || !product || !selectedColorVariant"
                class="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div *ngIf="!isAddingToCart" class="flex items-center gap-2">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                  </svg>
                  Add to Cart - Free Shipping
                </div>
                <div *ngIf="isAddingToCart" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding to Cart...
                </div>
              </button>

              <!-- Buy Now Button -->
              <button
                (click)="buyNow()"
                [disabled]="isAddingToCart || !product || !selectedColorVariant"
                class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div class="flex items-center gap-2">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Buy Now - Secure Checkout
                </div>
              </button>

              <!-- Wishlist Button -->
              <button
                (click)="toggleWishlist()"
                [disabled]="isUpdatingWishlist || !product"
                class="w-full border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div class="flex items-center justify-center gap-2">
                  <svg *ngIf="!isInWishlist" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <svg *ngIf="isInWishlist" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5 text-red-500">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
                </div>
              </button>
            </div>

            <!-- Success/Error Messages -->
            <div *ngIf="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center gap-2 text-green-800">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                {{ successMessage }}
              </div>
            </div>

            <div *ngIf="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center gap-2 text-red-800">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                {{ errorMessage }}
              </div>
            </div>

            <!-- Product Features -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Key Features</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div *ngFor="let feature of product?.features?.slice(0, 6) || features" class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Trust Indicators -->
            <div class="border-t border-gray-200 pt-6">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <svg class="w-8 h-8 text-green-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                  </svg>
                  <div class="text-sm font-medium text-gray-900">Secure Payment</div>
                </div>
                <div>
                  <svg class="w-8 h-8 text-blue-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                  </svg>
                  <div class="text-sm font-medium text-gray-900">Free Shipping</div>
                </div>
                <div>
                  <svg class="w-8 h-8 text-purple-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div class="text-sm font-medium text-gray-900">30-Day Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ProductShowcaseComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Product data
  product: Product | null = null;
  products: Product[] = [];

  // UI state
  isMobile = false;
  currentImageIndex = 0;
  selectedColorVariant: ColorVariant | null = null;
  selectedSizeVariant: SizeVariant | null = null;
  quantity = 1;
  deliveryNotes = '';

  // Loading states
  isAddingToCart = false;
  isUpdatingWishlist = false;
  isInWishlist = false;

  // Messages
  successMessage = '';
  errorMessage = '';

  // Fallback data
  features = [
    'Crash-tested safety harness system',
    'Memory foam padding for ultimate comfort',
    'Universal fit for 95% of vehicles',
    'Tool-free installation',
    'Machine washable cover',
    'Lifetime warranty'
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkMobile();
    this.loadProduct();
    this.checkWishlistStatus();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prevImage();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    }
  }

  private checkMobile() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  private loadProduct() {
    // Load featured products and get the first one
    this.productService.getFeaturedProducts(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          console.log('Products loaded:', products);
          if (products.length > 0) {
            this.product = products[0];
            this.selectedColorVariant = this.productService.getMainColorVariant(this.product);
            this.selectedSizeVariant = this.product.sizeVariants?.[0] || null;
            console.log('Selected product:', this.product);
            console.log('Selected color variant:', this.selectedColorVariant);
          } else {
            console.error('No products found');
            this.errorMessage = 'Product not available';
          }
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.errorMessage = 'Failed to load product';
        }
      });
  }

  get currentColorImages(): string[] {
    return this.selectedColorVariant?.images || this.product?.images || [];
  }

  get currentProductImage(): string {
    return this.currentColorImages[this.currentImageIndex] || '';
  }

  get selectedColor(): string {
    return this.selectedColorVariant?.name || 'Black';
  }

  get originalPrice(): number {
    return this.product?.originalPrice || 0;
  }

  get salePercentage(): number {
    return this.product?.salePercentage || 0;
  }

  get showOriginalPrice(): boolean {
    return this.originalPrice > 0 && this.originalPrice > this.getCurrentPrice();
  }

  get showSalePercentage(): boolean {
    return this.salePercentage > 0;
  }

  selectColor(colorVariant: ColorVariant) {
    if (!colorVariant.isActive) return;
    
    this.selectedColorVariant = colorVariant;
    this.currentImageIndex = 0;
    this.quantity = 1;
  }

  selectSize(sizeVariant: SizeVariant) {
    if (!sizeVariant.isActive) return;
    this.selectedSizeVariant = sizeVariant;
  }

  nextImage() {
    if (this.currentColorImages.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.currentColorImages.length;
    }
  }

  prevImage() {
    if (this.currentColorImages.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.currentColorImages.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number) {
    if (index >= 0 && index < this.currentColorImages.length) {
      this.currentImageIndex = index;
    }
  }

  increaseQuantity() {
    const maxQuantity = this.getMaxQuantity();
    if (this.quantity < maxQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getCurrentPrice(): number {
    return this.selectedColorVariant?.price || this.product?.basePrice || 0;
  }

  getCurrentStock(): number {
    return this.selectedColorVariant?.stockQuantity || this.product?.totalStock || 0;
  }

  getMaxQuantity(): number {
    return Math.min(this.getCurrentStock(), 10); // Max 10 items per order
  }

  addToCart(): void {
    if (!this.product || !this.selectedColorVariant) {
      this.errorMessage = 'Please select a color variant';
      return;
    }

    this.isAddingToCart = true;
    this.clearMessages();

    const request: AddToCartRequest = {
      productId: this.product._id,
      quantity: this.quantity,
      colorVariant: this.selectedColorVariant,
      selectedColor: this.selectedColorVariant.name,
      selectedSize: this.selectedSizeVariant?.name
    };

    this.cartService.addToCart(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          console.log('Added to cart:', cart);
          this.successMessage = `Added ${this.quantity} ${this.selectedColorVariant?.name || 'backseat extender'} to cart!`;
          this.clearMessageAfterDelay();
          this.isAddingToCart = false;
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.errorMessage = 'Failed to add item to cart. Please try again.';
          this.clearMessageAfterDelay();
          this.isAddingToCart = false;
        }
      });
  }

  toggleWishlist(): void {
    if (!this.product) {
      this.errorMessage = 'No product loaded';
      return;
    }

    this.isUpdatingWishlist = true;
    this.clearMessages();

    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isInWishlist = false;
            this.successMessage = 'Removed from wishlist';
            this.clearMessageAfterDelay();
            this.isUpdatingWishlist = false;
          },
          error: (error) => {
            console.error('Error removing from wishlist:', error);
            this.errorMessage = 'Failed to remove from wishlist';
            this.clearMessageAfterDelay();
            this.isUpdatingWishlist = false;
          }
        });
    } else {
      this.wishlistService.addToWishlist({
        productId: this.product._id,
        color: this.selectedColorVariant?.name,
        size: this.selectedSizeVariant?.name
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isInWishlist = true;
            this.successMessage = 'Added to wishlist';
            this.clearMessageAfterDelay();
            this.isUpdatingWishlist = false;
          },
          error: (error) => {
            console.error('Error adding to wishlist:', error);
            this.errorMessage = 'Failed to add to wishlist';
            this.clearMessageAfterDelay();
            this.isUpdatingWishlist = false;
          }
        });
    }
  }

  private checkWishlistStatus(): void {
    if (!this.product) return;
    
    this.isInWishlist = this.wishlistService.isInWishlist(
      this.product._id,
      this.selectedColorVariant?.name,
      this.selectedSizeVariant?.name
    );
  }

  buyNow(): void {
    if (!this.product || !this.selectedColorVariant) {
      this.errorMessage = 'Please select a color variant';
      return;
    }

    // First add to cart, then navigate to checkout
    this.addToCart();
    
    // Navigate to checkout after a short delay
    setTimeout(() => {
      this.router.navigate(['/checkout']);
    }, 1000);
  }

  handleShare(): void {
    if (navigator.share && this.product) {
      navigator.share({
        title: this.product.name,
        text: this.product.shortDescription,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        this.successMessage = 'Link copied to clipboard!';
        this.clearMessageAfterDelay();
      }
    }
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  getRatingStars(rating: number): boolean[] {
    return this.productService.getRatingStars(rating);
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.clearMessages();
    }, 5000);
  }
} 