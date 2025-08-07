import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil, interval, fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="absolute inset-0 overflow-hidden">
      <div class="relative w-full h-full">
        <!-- Fallback gradient background - always visible immediately -->
        <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        
        <!-- Image slides with ultra-smooth crossfade animations -->
        <div 
          *ngFor="let image of images; let i = index" 
          [class]="getSlideClasses(i)"
          class="absolute inset-0 transition-all duration-1500 ease-in-out">
          <img 
            [src]="image.webp" 
            [alt]="image.alt || 'Dog Backseat Extender'"
            class="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            (error)="onImageError($event, i)"
            (load)="onImageLoad($event, i)"
            [style.display]="loadedImages.has(i) ? 'block' : 'none'">
        </div>
        
        <!-- Overlay for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30"></div>
        
        <!-- Navigation dots - only show if multiple images -->
        <div *ngIf="images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button 
            *ngFor="let image of images; let i = index"
            (click)="goToSlide(i)"
            [class]="i === currentIndex ? 'bg-white scale-110' : 'bg-white/50'"
            class="w-3 h-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-110">
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Ultra-smooth animation styles */
    .slide-active {
      opacity: 1;
      transform: scale(1);
      z-index: 10;
    }
    
    .slide-inactive {
      opacity: 0;
      transform: scale(1.02);
      z-index: 5;
    }
    
    .slide-transitioning {
      opacity: 0.3;
      transform: scale(1.01);
      z-index: 8;
    }
  `]
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  @Input() images: any[] = [];
  @Input() autoPlay: boolean = true;
  @Input() interval: number = 5000; // 5 seconds for smooth flow

  private destroy$ = new Subject<void>();
  currentIndex = 0;
  loadedImages: Set<number> = new Set();
  failedImages: Set<number> = new Set();
  private autoPlaySubscription: any;
  isTransitioning = false;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Start with immediate visual feedback
    if (this.images.length > 0) {
      // Preload first image immediately for smooth start
      this.preloadImage(0);
    }
    
    // Start autoplay with optimized timing
    if (this.autoPlay && this.images.length > 1) {
      this.startAutoPlayDelayed();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.autoPlaySubscription) {
      this.autoPlaySubscription.unsubscribe();
    }
  }

  getSlideClasses(index: number): string {
    if (index === this.currentIndex) {
      return 'slide-active';
    } else if (this.isTransitioning && index === this.getPreviousIndex()) {
      return 'slide-transitioning';
    } else {
      return 'slide-inactive';
    }
  }

  private getPreviousIndex(): number {
    return this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
  }

  private preloadImage(index: number) {
    if (index >= this.images.length || !isPlatformBrowser(this.platformId)) return;
    
    try {
      const img = new (window as any).Image();
      img.onload = () => {
        this.loadedImages.add(index);
        this.cdr.detectChanges();
      };
      img.onerror = () => {
        this.failedImages.add(index);
        this.cdr.detectChanges();
      };
      img.src = this.images[index].webp;
    } catch (error) {
      console.warn('Failed to preload image:', error);
      this.failedImages.add(index);
    }
  }

  private startAutoPlayDelayed() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Wait for initial content to load before starting autoplay
    fromEvent(document, 'DOMContentLoaded').pipe(
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Start autoplay after a short delay
      setTimeout(() => {
        this.startAutoPlay();
      }, 2000);
    });
  }

  private startAutoPlay() {
    this.autoPlaySubscription = interval(this.interval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nextSlide();
      });
  }

  nextSlide() {
    if (this.images.length <= 1 || this.isTransitioning) return;
    
    this.isTransitioning = true;
    const previousIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    
    // Trigger change detection for smooth animation
    this.cdr.detectChanges();
    
    // Preload next image in background
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    if (!this.loadedImages.has(nextIndex) && !this.failedImages.has(nextIndex)) {
      if (isPlatformBrowser(this.platformId) && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          this.preloadImage(nextIndex);
        });
      } else if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.preloadImage(nextIndex);
        }, 50);
      }
    }
    
    // Reset transition state after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  previousSlide() {
    if (this.images.length <= 1 || this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.currentIndex = this.currentIndex === 0 
      ? this.images.length - 1 
      : this.currentIndex - 1;
    
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.isTransitioning = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.images.length && !this.isTransitioning) {
      this.isTransitioning = true;
      this.currentIndex = index;
      
      this.cdr.detectChanges();
      
      // Preload adjacent images in background
      const nextIndex = (index + 1) % this.images.length;
      const prevIndex = index === 0 ? this.images.length - 1 : index - 1;
      
      if (!this.loadedImages.has(nextIndex) && !this.failedImages.has(nextIndex)) {
        if (isPlatformBrowser(this.platformId) && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            this.preloadImage(nextIndex);
          });
        } else if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.preloadImage(nextIndex);
          }, 50);
        }
      }
      if (!this.loadedImages.has(prevIndex) && !this.failedImages.has(prevIndex)) {
        if (isPlatformBrowser(this.platformId) && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            this.preloadImage(prevIndex);
          });
        } else if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.preloadImage(prevIndex);
          }, 50);
        }
      }
      
      setTimeout(() => {
        this.isTransitioning = false;
        this.cdr.detectChanges();
      }, 1500);
    }
  }

  onImageLoad(event: any, index: number) {
    this.loadedImages.add(index);
    this.cdr.detectChanges();
  }

  onImageError(event: any, index: number) {
    this.failedImages.add(index);
    this.cdr.detectChanges();
    
    // If all images fail, we already have the fallback gradient
    if (this.failedImages.size === this.images.length) {
      console.log('All images failed to load, using fallback background');
    }
  }
} 