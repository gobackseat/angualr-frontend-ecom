import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, interval, takeUntil, fromEvent } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="relative h-screen overflow-hidden">
      <!-- Background Image Slider -->
      <div class="absolute inset-0">
        <div 
          *ngFor="let image of heroImages; let i = index"
          [class]="getSlideClasses(i)"
          class="absolute inset-0 transition-all duration-1500 ease-in-out">
          <img 
            [src]="image" 
            [alt]="'Hero Background ' + (i + 1)"
            class="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            (error)="onImageError($event, i)"
            (load)="onImageLoad($event, i)">
        </div>
        
        <!-- Orange overlay for better text readability -->
        <div class="absolute inset-0" style="background-color: rgba(234, 88, 12, 0.2);"></div>
        
        <!-- Fallback gradient background -->
        <div class="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"></div>
      </div>
      
      <!-- Content Overlay -->
      <div class="relative z-10 flex items-center justify-center h-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="max-w-4xl mx-auto">
            <!-- Trust Badge -->
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              #1 Rated Pet Travel Solution
            </div>
            
            <!-- Main Heading -->
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Give Your Dog a
              <span class="text-orange-300">Safer Ride</span>
            </h1>
            
            <!-- Subtitle -->
            <p class="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Premium leather backseat extender that keeps your car clean and your dog comfortable on every journey
            </p>
            
            <!-- Price Section -->
            <div class="flex items-center justify-center space-x-6 mb-8">
              <div class="text-center">
                <div class="text-3xl sm:text-4xl font-bold text-white">$89.99</div>
                <div class="text-lg text-white/80 line-through">$124.99</div>
              </div>
              <div class="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">
                Save 28%
              </div>
            </div>
            
            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                (click)="scrollToProduct()"
                class="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-lg transition-colors duration-200 flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
                Shop Now
              </button>
              <button 
                (click)="scrollToProduct()"
                class="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-lg backdrop-blur-sm transition-colors duration-200 border border-white/30">
                Learn More
              </button>
            </div>
            
            <!-- Trust Indicators -->
            <div class="flex items-center justify-center space-x-8 mt-12">
              <div class="flex items-center text-white/90">
                <div class="flex text-yellow-400 mr-2">
                  <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-sm">4.9 (2,847 reviews)</span>
              </div>
              <div class="flex items-center text-white/90">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm">30-Day Money Back</span>
              </div>
              <div class="flex items-center text-white/90">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm">Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    /* Professional slider transitions */
    .slide-active {
      opacity: 1;
      transform: scale(1);
      z-index: 10;
    }
    
    .slide-inactive {
      opacity: 0;
      transform: scale(1.05);
      z-index: 1;
    }
    
    .slide-transitioning {
      opacity: 0.8;
      transform: scale(1.02);
      z-index: 5;
    }
    
    /* Ensure images fill the hero section completely */
    .object-cover {
      object-fit: cover;
      object-position: center;
    }
    
    /* Smooth animations with hardware acceleration */
    .transition-all {
      transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: opacity, transform;
    }
    
    /* Bounce animation for scroll indicator */
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        transform: translate3d(0, -8px, 0);
      }
      70% {
        transform: translate3d(0, -4px, 0);
      }
      90% {
        transform: translate3d(0, -2px, 0);
      }
    }
    
    .animate-bounce {
      animation: bounce 2s infinite;
    }
  `]
})
export class HomeHeroSectionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentSlideIndex = 0;
  isTransitioning = false;
  loadedImages = new Set<number>();
  failedImages = new Set<number>();
  autoPlayInterval: any;
  
  // Updated to use correct image paths that work in production
  heroImages = [
    'assets/images/hero/black-backseat-extender-hero-slider-1.webp',
    'assets/images/hero/black-backseat-extender-hero-slider-2.webp',
    'assets/images/hero/black-backseat-extender-hero-slider-no-3.webp',
    'assets/images/hero/black-backseat-extender-hero-slider-no-4.webp',
    'assets/images/hero/black-backseat-extender-hero-slider-no-5.webp'
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.preloadHeroImages();
    this.startAutoPlayDelayed();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  private preloadImage(src: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const img = new (window as any).Image();
        img.onload = () => {
          // Image preloaded successfully
        };
        img.onerror = () => {
          // Failed to preload image
        };
        img.src = src;
      } catch (error) {
        // Failed to preload image
      }
    }
  }

  private preloadHeroImages(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.heroImages.forEach(src => this.preloadImage(src));
      } catch (error) {
        // Failed to preload hero images
      }
    }
  }

  startAutoPlayDelayed(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Start autoplay after initial load
      setTimeout(() => {
        this.startAutoPlay();
      }, 2000); // 2 second delay for initial load
    }
  }

  startAutoPlay(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Clear any existing interval
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
      }
      
      // Start new interval with 5-second timing
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // 5-second intervals as requested
    }
  }

  nextSlide(): void {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroImages.length;
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Reset transition state after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1500); // Match transition duration
  }

  getSlideClasses(index: number): string {
    if (index === this.currentSlideIndex) {
      return 'slide-active';
    } else if (index === (this.currentSlideIndex - 1 + this.heroImages.length) % this.heroImages.length) {
      return 'slide-transitioning';
    } else {
      return 'slide-inactive';
    }
  }

  onImageLoad(event: Event, index: number): void {
    this.loadedImages.add(index);
  }

  onImageError(event: Event, index: number): void {
    this.failedImages.add(index);
  }

  scrollToProduct(): void {
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
} 