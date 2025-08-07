import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <!-- Background Pattern -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-16 h-16 opacity-10 animate-float">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-orange-600">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="absolute bottom-20 right-20 w-20 h-20 opacity-10 animate-float" style="animation-delay: 1s;">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-amber-600">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          <!-- Text Content -->
          <div class="space-y-8">
            <div class="space-y-6">
              <h1 class="text-5xl md:text-7xl font-bold leading-tight animate-fade-in-up">
                Why <span class="text-orange-400">Choose Us?</span>
              </h1>
              <p class="text-lg md:text-xl text-gray-700 leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s;">
                At gobackseat.us, we understand that your dog is more than just a pet; they're a cherished member of your family.
              </p>
            </div>
            <div class="flex items-center space-x-4 animate-fade-in-up" style="animation-delay: 0.4s;">
              <button 
                (click)="scrollToContent()"
                class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 hover:bg-orange-700">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z"/>
                </svg>
              </button>
              <span class="text-gray-700 text-sm font-medium">Discover what makes us different</span>
            </div>
          </div>
          
          <!-- Hero Image -->
          <div class="flex justify-center">
            <img 
              src="assets/img/hero/hero-1.jpg" 
              alt="Happy family with dogs"
              class="w-full max-w-lg h-auto rounded-2xl shadow-2xl animate-fade-in-up"
              style="animation-delay: 0.6s;"
              loading="lazy">
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section id="content-start" class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto space-y-16">
          
          <!-- Introduction -->
          <div class="space-y-6">
            <p class="text-lg text-gray-700 leading-relaxed">
              That's why we've dedicated ourselves to creating the safest, most comfortable, and most reliable backseat extenders for dogs on the market. Our commitment goes beyond just providing a product; it's about ensuring peace of mind for you and tail-wagging happiness for your furry companion on every journey.
            </p>
            <p class="text-lg text-gray-700 leading-relaxed">
              When you choose us, you're not just buying a backseat extender; you're investing in a promise of quality, care, and a shared mission to make the world a better place for dogs.
            </p>
          </div>

          <!-- Lifetime Warranty Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
                Lifetime Warranty & 30-Day Money-Back Guarantee
              </h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We stand by the exceptional quality and durability of our backseat extenders. We are so confident in our craftsmanship and the materials we use that every single one of our products comes with a Lifetime Warranty.
                </p>
                <p>
                  This isn't just a marketing slogan; it's a testament to our belief that our extenders are built to last, providing your dog with a safe and comfortable space for years to come.
                </p>
                <p>
                  Should any manufacturing defect arise, we promise to repair or replace your extender, no questions asked. Your satisfaction, and your dog's comfort, are our top priorities.
                </p>
              </div>
            </div>
            <div class="flex justify-center">
              <img 
                src="assets/img/product/product-1.jpg" 
                alt="Quality guarantee"
                class="w-full max-w-md h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                loading="lazy">
            </div>
          </div>

          <!-- Flexible Exchange Policy -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1 flex justify-center">
              <img 
                src="assets/img/product/product-2.jpg" 
                alt="Flexible exchange policy"
                class="w-full max-w-md h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                loading="lazy">
            </div>
            <div class="order-1 lg:order-2 space-y-6">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
                Flexible Exchange Policy
              </h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We understand that finding the perfect fit for your paw friend can sometimes be a process of trial and error. That's why we offer a flexible 15-day exchange policy for our backseat extenders.
                </p>
                <p>
                  If, within 15 days of receiving your product, you or your dog find that it's not the right fit, whether due to comfort, color, or size, we're happy to facilitate an exchange.
                </p>
                <p>
                  Our goal is to ensure both you and your dog are completely satisfied with your purchase. We want your dog to love their new riding space.
                </p>
              </div>
            </div>
          </div>

          <!-- Supporting Street Dogs -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
                Supporting Street Dogs
              </h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Our commitment extends beyond our customers to the wider dog community. We believe in giving back, and that's why we offer a unique program that allows you to contribute to a truly holy cause.
                </p>
                <p>
                  If, for any reason, you decide that our backseat extender isn't for you, we can help you donate it to an NGO that helps rescue street dogs.
                </p>
                <p>
                  By choosing us, you're not just purchasing a product; you're becoming a part of a network dedicated to improving the lives of dogs in need.
                </p>
              </div>
            </div>
            <div class="flex justify-center">
              <img 
                src="assets/img/product/product-3.jpg" 
                alt="Supporting street dogs"
                class="w-full max-w-md h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                loading="lazy">
            </div>
          </div>

          <!-- Emergency Lifeline -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1 flex justify-center">
              <img 
                src="assets/img/product/product-4.jpg" 
                alt="Emergency lifeline"
                class="w-full max-w-md h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                loading="lazy">
            </div>
            <div class="order-1 lg:order-2 space-y-6">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
                An Emergency Lifeline
              </h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We understand that unforeseen circumstances can arise, and when your dog faces an accident or medical problem, getting them to the vet quickly and safely is paramount.
                </p>
                <p>
                  This is where our backseat extender truly helps as an emergency lifeline. It transforms your car's back seat into a stable, flat surface, allowing you to safely transport an injured or unwell dog without exacerbating their condition.
                </p>
                <p>
                  In such urgent situations, every second counts, and our backseat extender helps you provide immediate and safe transport, potentially saving your dog's life.
                </p>
              </div>
            </div>
          </div>

          <!-- Foldable Design -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
                Foldable Design
              </h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Our backseat extender is designed with real-world versatility in mind. Its foldable design means it can be easily adjusted or partially folded to accommodate another person in the backseat, even while your dog is still comfortably situated.
                </p>
                <p>
                  This is particularly useful for managing your dog during the ride, providing comfort, or simply having a companion join you on your travels without compromising your dog's space.
                </p>
                <p>
                  This thoughtful feature ensures that our product seamlessly integrates into your life, offering both dedicated space for your dog and flexibility for your human passengers.
                </p>
              </div>
            </div>
            <div class="flex justify-center">
              <img 
                src="assets/img/product/product-5.jpg" 
                alt="Foldable design"
                class="w-full max-w-md h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                loading="lazy">
            </div>
          </div>

          <!-- Custom Made Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1 flex justify-center">
              <img 
                src="assets/img/product/product-6.jpg" 
                alt="Custom made for your car and dog"
                class="w-full max-w-md h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                loading="lazy">
            </div>
            <div class="order-1 lg:order-2 space-y-6">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
                Custom Made for Your Car and Dog
              </h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  One of our core philosophies is that every dog and every car is unique. That's why we don't believe in a one-size-fits-all approach.
                </p>
                <p>
                  The extenders we deliver are custom-made specifically for your car's make and model, and tailored to your dog's breed, size, and habits. This attention to detail ensures a perfect, snug fit that maximizes safety and comfort.
                </p>
                <p>
                  This personalized approach guarantees optimal performance and unparalleled peace of mind, making every journey a joy for both you and your dog.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div class="container mx-auto px-4">
        <div class="text-center space-y-8">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900">
            Ready to Experience the Difference?
          </h2>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto">
            Join thousands of happy pet parents who trust us with their furry family members' safety and comfort.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Shop Now
            </button>
            <button class="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Custom animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out;
    }
    
    .animate-slide-in-left {
      animation: slideInLeft 0.8s ease-out;
    }
    
    .animate-slide-in-right {
      animation: slideInRight 0.8s ease-out;
    }
    
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Image hover effects */
    .group:hover img {
      transform: scale(1.05);
    }
    
    /* Responsive text sizing */
    @media (max-width: 768px) {
      .text-7xl {
        font-size: 3rem;
      }
    }
    
    /* Enhanced button hover effects */
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    /* Gradient text effect */
    .gradient-text {
      background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Floating animation for background elements */
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
  `]
})
export class WhyChooseUsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToContent() {
    const contentElement = document.getElementById('content-start');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
} 
 
 