import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { HomeHeroSectionComponent } from '../../components/home-hero-section/home-hero-section.component';
import { StatsBannerComponent } from '../../components/stats-banner/stats-banner.component';
import { ProductShowcaseComponent } from '../../components/product-showcase/product-showcase.component';
import { MarqueeSectionComponent } from '../../components/marquee-section/marquee-section.component';
import { BouncyCardsFeaturesComponent } from '../../components/bouncy-cards-features/bouncy-cards-features.component';
import { RadialOrbitalTimelineComponent } from '../../components/radial-orbital-timeline/radial-orbital-timeline.component';
import { InstallationGuideComponent } from '../../components/installation-guide/installation-guide.component';
import { FeaturesSectionComponent } from '../../components/features-section/features-section.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HomeHeroSectionComponent,
    StatsBannerComponent,
    ProductShowcaseComponent,
    MarqueeSectionComponent,
    BouncyCardsFeaturesComponent,
    RadialOrbitalTimelineComponent,
    InstallationGuideComponent,
    FeaturesSectionComponent,
    TestimonialsSectionComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Section -->
    <app-home-hero-section></app-home-hero-section>
    
    <!-- Stats Banner Section -->
    <app-stats-banner></app-stats-banner>
    
    <!-- Enhanced Product Showcase Section -->
    <section 
      id="product"
      class="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100"
      aria-labelledby="product-section-title"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <header class="text-center mb-8 sm:mb-12 lg:mb-16">
          <div class="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            Featured Product
          </div>
          <h2 
            id="product-section-title" 
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            Premium Pet Comfort Solution
          </h2>
          <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the ultimate comfort for your furry friend with our top-rated car accessory
          </p>
        </header>
        
        <!-- Enhanced Product Showcase -->
        <div class="relative">
          <!-- Background decoration -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl transform rotate-1"></div>
          <div class="absolute inset-0 bg-gradient-to-l from-green-600/5 to-blue-600/5 rounded-3xl transform -rotate-1"></div>
          
          <!-- Main product container -->
          <div class="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="p-6 sm:p-8 lg:p-12">
              <app-product-showcase 
                class="block w-full"
              ></app-product-showcase>
            </div>
            
            <!-- Trust indicators -->
            <div class="border-t border-gray-100 bg-gray-50/50 px-6 sm:px-8 lg:px-12 py-4 sm:py-6">
              <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-medium">Free Shipping</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-medium">2-Year Warranty</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="font-medium">30-Day Returns</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <span class="font-medium">Fast Installation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Call to Action -->
        <div class="text-center mt-8 sm:mt-12">
          <div class="inline-flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              type="button"
              (click)="navigateToProduct()"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
              aria-label="Shop now for premium dog backseat extender"
            >
              Shop Now - {{ getFeaturedProductPrice() }}
            </button>
            <button 
              type="button"
              (click)="navigateToProduct()"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
              aria-label="View more details about the product"
            >
              View Details
            </button>
          </div>
          <p class="mt-4 text-sm text-gray-500">
            <span class="inline-flex items-center gap-1">
              <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {{ getFeaturedProductRating() }} from {{ getTotalCustomers() }}+ happy customers
            </span>
          </p>
        </div>
      </div>
    </section>
    
    <!-- Marquee Section -->
    <app-marquee-section></app-marquee-section>
    
    <!-- Bouncy Cards Features Section -->
    <app-bouncy-cards-features></app-bouncy-cards-features>
    
    <!-- Interactive Product Map Section -->
    <app-radial-orbital-timeline></app-radial-orbital-timeline>
    
    <!-- Installation Guide Section -->
    <app-installation-guide></app-installation-guide>
    
    <!-- Features Section -->
    <app-features-section></app-features-section>
    
    <!-- Testimonials Section -->
    <app-testimonials-section></app-testimonials-section>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.products = response.products || [];
          this.cdr.markForCheck();
        },
        (error) => {
          console.error('Error fetching products:', error);
          this.cdr.markForCheck();
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToProduct(): void {
    const featuredProduct = this.products.find(p => p.isFeatured);
    if (featuredProduct) {
      this.router.navigate(['/product-detail', featuredProduct.id]);
    } else if (this.products.length > 0) {
      // If no featured product, navigate to the first product
      this.router.navigate(['/product-detail', this.products[0].id]);
    } else {
      // Fallback to a generic product page or show message
      console.log('No products available');
    }
  }

  getFeaturedProductPrice(): string {
    const featuredProduct = this.products.find(p => p.isFeatured);
    return featuredProduct ? `$${featuredProduct.price.toFixed(2)}` : '$0.00';
  }

  getFeaturedProductRating(): string {
    const featuredProduct = this.products.find(p => p.isFeatured);
    return featuredProduct ? `${featuredProduct.ratings?.average?.toFixed(1) || '0.0'}/5 stars` : '0.0/5 stars';
  }

  getTotalCustomers(): number {
    const featuredProduct = this.products.find(p => p.isFeatured);
    return featuredProduct ? (featuredProduct.ratings?.count || 0) : 0;
  }
}