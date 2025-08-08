import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService, AddToCartRequest } from '../../services/cart.service';
import { ImageUrlPipe } from '../../shared/pipes/image-url.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageUrlPipe],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium dog backseat extenders designed for safety, comfort, and style.
          </p>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let product of products" class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <!-- Product Image -->
            <div class="aspect-w-1 aspect-h-1 w-full">
              <img 
                [src]="product.images[0] | imageUrl" 
                [alt]="product.name"
                class="w-full h-64 object-cover">
            </div>
            
            <!-- Product Info -->
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
              
              <!-- Rating -->
              <div class="flex items-center mb-4">
                <div class="flex items-center">
                  <span class="text-yellow-400">★</span>
                  <span class="ml-1 text-sm text-gray-600">{{ product.rating }}</span>
                </div>
                <span class="ml-2 text-sm text-gray-500">({{ product.reviewCount }} reviews)</span>
              </div>
              
              <!-- Price -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-orange-600">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</span>
                  <span *ngIf="product.originalPrice" class="ml-2 text-lg text-gray-500 line-through">{{ product.originalPrice | currency:'USD':'symbol':'1.2-2' }}</span>
                </div>
                <span *ngIf="!product.inStock" class="text-red-600 text-sm font-medium">Out of Stock</span>
              </div>
              
              <!-- Actions -->
              <div class="flex space-x-2">
                <button 
                  (click)="addToCart(product)"
                  [disabled]="!product.inStock"
                  class="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                  Add to Cart
                </button>
                                 <button 
                   [routerLink]="['/products', product.id]"
                   class="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-200">
                   View
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(response => {
      this.products = (response as any)?.products || (response as any) || [];
    });
  }

  addToCart(product: Product) {
    const request: AddToCartRequest = {
      productId: product.id,
      quantity: 1,
      color: product.colors?.[0] || 'default',
      size: product.sizes?.[0] || 'standard'
    };
    
    this.cartService.addToCart(request).subscribe({
      next: () => {
        console.log('Product added to cart successfully');
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      }
    });
  }
} 