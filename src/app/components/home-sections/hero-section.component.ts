import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section 
      class="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"
      [class.scrolled]="isScrolled">
      
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"></div>
      
      <!-- Hero Content -->
      <div class="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 sm:pt-24 lg:pt-28 pb-12">
        
        <!-- Main Hero Content -->
        <div class="w-full max-w-4xl mx-auto">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-300 text-sm font-medium mb-6 animate-fade-in">
            <svg class="w-4 h-4 fill-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>#1 Rated Pet Travel Solution</span>
            <svg class="w-4 h-4 fill-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>

          <!-- Main Headline -->
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight animate-slide-up">
            <span class="block">Transform Your Car</span>
            <span class="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-600 mb-2">Into a</span>
            <span class="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
              Dog Paradise
            </span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Premium dog backseat extender with crash-tested safety harness, memory foam comfort, 
            and universal fit for 95% of vehicles. Give your furry friend the journey they deserve.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-bounce-in">
            <button 
              class="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-xl hover:shadow-2xl px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
              (click)="scrollToProducts()">
              Shop Now
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
            
            <button 
              class="w-full sm:w-auto border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center"
              (click)="openVideoModal()">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Watch Demo
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-12 animate-fade-in">
            <div *ngFor="let stat of stats" class="text-center">
              <div class="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{{ stat.number }}</div>
              <div class="text-sm text-gray-600">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="w-full max-w-6xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div 
              *ngFor="let feature of features; let i = index"
              class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-orange-200/30 shadow-lg hover:shadow-xl transition-all duration-200 animate-fade-in"
              [style.animation-delay]="(i * 0.1) + 's'">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-200">
                <ng-container [ngSwitch]="feature.icon">
                  <svg *ngSwitchCase="'shield'" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <svg *ngSwitchCase="'heart'" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <svg *ngSwitchCase="'truck'" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM21 17v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3m16 0v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3m16 0v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3"></path>
                  </svg>
                </ng-container>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600 text-xs sm:text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 animate-fade-in">
          <div *ngFor="let trust of trustIndicators" class="flex items-center">
            <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ trust }}
          </div>
        </div>
      </div>

      <!-- Background Image Slider -->
      <div class="absolute inset-0 z-0">
        <div class="relative h-full w-full">
          <img 
            *ngFor="let image of backgroundImages; let i = index"
            [src]="image.src"
            [alt]="image.alt"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            [class.opacity-100]="currentImageIndex === i"
            [class.opacity-0]="currentImageIndex !== i"
            loading="lazy">
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }

    .animate-slide-up {
      animation: slideUp 0.3s ease-out;
    }

    .animate-bounce-in {
      animation: bounceIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes slideUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes bounceIn {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }

    .scrolled {
      background-attachment: fixed;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .animate-fade-in,
      .animate-slide-up,
      .animate-bounce-in {
        animation: none;
      }
    }
  `]
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  isScrolled = false;
  currentImageIndex = 0;
  private imageInterval: any;

  stats = [
    { number: '50K+', label: 'Happy Dogs' },
    { number: '4.9★', label: 'Customer Rating' },
    { number: '24/7', label: 'Support' },
    { number: '30-Day', label: 'Returns' }
  ];

  features = [
    {
      icon: 'shield',
      title: 'Safety First',
      description: 'Advanced safety harness system with crash-tested materials for ultimate protection during travel'
    },
    {
      icon: 'heart',
      title: 'Ultimate Comfort',
      description: 'Memory foam padding with breathable fabric ensures maximum comfort for long journeys'
    },
    {
      icon: 'truck',
      title: '5-Min Setup',
      description: 'Tool-free installation with universal fit for 95% of vehicle models and seat configurations'
    }
  ];

  trustIndicators = [
    'Free Shipping',
    '30-Day Returns',
    'Secure Payment',
    '24/7 Support'
  ];

  backgroundImages = [
    {
      src: 'assets/images/hero/black-backseat-extender-hero-slider-1.webp',
      alt: 'Dog backseat extender in black'
    },
    {
      src: 'assets/images/hero/black-backseat-extender-hero-slider-2.webp',
      alt: 'Dog backseat extender installation'
    },
    {
      src: 'assets/images/hero/black-backseat-extender-hero-slider-no-3.webp',
      alt: 'Dog backseat extender features'
    },
    {
      src: 'assets/images/hero/black-backseat-extender-hero-slider-no-4.webp',
      alt: 'Dog backseat extender comfort'
    },
    {
      src: 'assets/images/hero/black-backseat-extender-hero-slider-no-5.webp',
      alt: 'Dog backseat extender safety'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.startImageSlider();
    this.handleScroll();
  }

  ngOnDestroy() {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
  }

  @HostListener('window:scroll')
  handleScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  startImageSlider() {
    this.imageInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
    }, 5000);
  }

  scrollToProducts() {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openVideoModal() {
    // TODO: Implement video modal
    console.log('Opening video modal');
  }
} 