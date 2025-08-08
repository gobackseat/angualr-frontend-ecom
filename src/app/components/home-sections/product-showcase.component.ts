import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageUrlPipe } from '../../shared/pipes/image-url.pipe';

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  template: `
    <section id="products" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Premium Dog Backseat Extenders
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of dog backseat extenders designed for safety, comfort, and style.
          </p>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            *ngFor="let product of featuredProducts"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            
            <!-- Product Image -->
            <div class="relative h-64 overflow-hidden">
              <img 
                [src]="product.image | imageUrl" 
                [alt]="product.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
              <div class="absolute top-4 left-4">
                <span *ngIf="product.badge" class="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {{ product.badge }}
                </span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
              
              <!-- Rating -->
              <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                  <svg *ngFor="let star of getStars(product.rating)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-gray-600 text-sm ml-2">({{ product.reviewCount }} reviews)</span>
              </div>

              <!-- Price -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-gray-900">${{ product.price }}</span>
                  <span *ngIf="product.originalPrice" class="text-lg text-gray-500 line-through">${{ product.originalPrice }}</span>
                </div>
                <span *ngIf="product.discount" class="text-green-600 font-semibold">{{ product.discount }}% OFF</span>
              </div>

              <!-- Actions -->
              <div class="flex space-x-2">
                <button 
                  (click)="addToCart(product)"
                  class="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-200 font-medium">
                  Add to Cart
                </button>
                <button 
                  (click)="toggleWishlist(product)"
                  class="p-2 border border-gray-300 rounded-md hover:border-orange-500 hover:text-orange-600 transition-colors duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <button 
            routerLink="/products"
            class="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 font-semibold">
            View All Products
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class ProductShowcaseComponent {
  featuredProducts = [
    {
      id: '1',
      name: 'Premium Black Backseat Extender',
      description: 'Crash-tested safety harness with memory foam comfort and universal fit',
      price: 129.99,
      originalPrice: 159.99,
      discount: 19,
      rating: 4.8,
      reviewCount: 1247,
      image: 'assets/images/products/black-backseat-extender-product-img.webp',
      badge: 'Best Seller'
    },
    {
      id: '2',
      name: 'Comfort Plus Brown Extender',
      description: 'Universal fit with enhanced safety features and premium materials',
      price: 149.99,
      originalPrice: 179.99,
      discount: 17,
      rating: 4.9,
      reviewCount: 892,
      image: 'assets/images/products/brown-backseat-extender-product-img.webp',
      badge: 'New'
    },
    {
      id: '3',
      name: 'Sport Blue Extender',
      description: 'Lightweight design with premium materials and easy installation',
      price: 119.99,
      originalPrice: 139.99,
      discount: 14,
      rating: 4.7,
      reviewCount: 567,
      image: 'assets/images/products/blue-backseat-extender-product-img.webp',
      badge: 'Popular'
    }
  ];

  constructor(private router: Router) {}

  getStars(rating: number): number[] {
    return Array.from({ length: Math.floor(rating) }, (_, i) => i);
  }

  addToCart(product: any) {
    console.log('Adding to cart:', product);
    // TODO: Implement cart functionality
  }

  toggleWishlist(product: any) {
    console.log('Toggling wishlist:', product);
    // TODO: Implement wishlist functionality
  }
} 