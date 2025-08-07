import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ImageConfig {
  src: string;
  alt: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  preload?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageCache = new Map<string, boolean>();
  private preloadedImages = new Set<string>();

  constructor() {
    this.preloadCriticalImages();
  }

  /**
   * Get optimized image configuration for production
   */
  getOptimizedImage(config: ImageConfig): ImageConfig {
    return {
      src: this.getImagePath(config.src),
      alt: config.alt,
      fallback: config.fallback ? this.getImagePath(config.fallback) : undefined,
      loading: config.loading || 'lazy',
      sizes: config.sizes || '100vw',
      preload: config.preload || false
    };
  }

  /**
   * Get correct image path based on environment
   */
  private getImagePath(path: string): string {
    // Remove leading slash if present
    if (path.startsWith('/')) {
      path = path.substring(1);
    }

    // Ensure path starts with assets
    if (!path.startsWith('assets/')) {
      path = `assets/${path}`;
    }

    return path;
  }

  /**
   * Preload critical images for better performance
   */
  private preloadCriticalImages(): void {
    const criticalImages = [
      'assets/images/hero/black-backseat-extender-hero-slider-1.webp',
      'assets/images/hero/black-backseat-extender-hero-slider-2.webp',
      'assets/images/products/black-backseat-extender-product-img.webp',
      'assets/img/logo.png'
    ];

    criticalImages.forEach(src => {
      this.preloadImage(src);
    });
  }

  /**
   * Preload a single image
   */
  preloadImage(src: string): void {
    if (this.preloadedImages.has(src)) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      this.preloadedImages.add(src);
      this.imageCache.set(src, true);
    };
    img.onerror = () => {
      this.imageCache.set(src, false);
    };
    img.src = this.getImagePath(src);
  }

  /**
   * Check if image is loaded
   */
  isImageLoaded(src: string): boolean {
    return this.imageCache.get(src) || false;
  }

  /**
   * Get image with fallback handling
   */
  getImageWithFallback(primarySrc: string, fallbackSrc: string): string {
    const primary = this.getImagePath(primarySrc);
    const fallback = this.getImagePath(fallbackSrc);

    if (this.isImageLoaded(primary)) {
      return primary;
    }

    return fallback;
  }

  /**
   * Get optimized product images
   */
  getProductImages(): { [key: string]: string } {
    return {
      black: 'assets/images/products/black-backseat-extender-product-img.webp',
      brown: 'assets/images/products/brown-backseat-extender-product-img.webp',
      blue: 'assets/images/products/blue-backseat-extender-product-img.webp',
      grey: 'assets/images/products/grey-backseat-extender-product-img.webp'
    };
  }

  /**
   * Get hero images
   */
  getHeroImages(): string[] {
    return [
      'assets/images/hero/black-backseat-extender-hero-slider-1.webp',
      'assets/images/hero/black-backseat-extender-hero-slider-2.webp',
      'assets/images/hero/black-backseat-extender-hero-slider-no-3.webp',
      'assets/images/hero/black-backseat-extender-hero-slider-no-4.webp',
      'assets/images/hero/black-backseat-extender-hero-slider-no-5.webp'
    ];
  }

  /**
   * Get logo path
   */
  getLogoPath(): string {
    return 'assets/img/logo.png';
  }

  /**
   * Get footer logo path
   */
  getFooterLogoPath(): string {
    return 'assets/img/footer-logo.png';
  }

  /**
   * Handle image error with fallback
   */
  handleImageError(event: any, fallbackSrc?: string): void {
    if (fallbackSrc) {
      event.target.src = this.getImagePath(fallbackSrc);
    } else {
      // Use a default placeholder
      event.target.src = 'assets/img/logo.png';
    }
  }

  /**
   * Get responsive image sizes for different breakpoints
   */
  getResponsiveSizes(): string {
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }

  /**
   * Clear image cache (useful for testing)
   */
  clearCache(): void {
    this.imageCache.clear();
    this.preloadedImages.clear();
  }
} 