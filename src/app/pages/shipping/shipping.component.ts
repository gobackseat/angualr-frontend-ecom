import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Shipping Information
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn about our shipping options, delivery times, and tracking information.
            </p>
          </div>

          <!-- Content -->
          <div class="prose prose-lg max-w-none">
            <h2 class="text-3xl font-bold text-gray-900">1. Shipping Options</h2>
            <p class="text-gray-700 leading-relaxed">
              We offer several shipping options to meet your needs:
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>Standard Shipping: 5-7 business days</li>
              <li>Express Shipping: 2-3 business days</li>
              <li>Overnight Shipping: Next business day</li>
            </ul>

            <h2 class="text-3xl font-bold text-gray-900">2. Delivery Times</h2>
            <p class="text-gray-700 leading-relaxed">
              Delivery times may vary based on your location and the shipping option selected. 
              Orders placed before 2 PM EST will be processed the same day.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">3. Tracking</h2>
            <p class="text-gray-700 leading-relaxed">
              Once your order ships, you will receive a tracking number via email. 
              You can track your package through our website or the carrier's website.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">4. International Shipping</h2>
            <p class="text-gray-700 leading-relaxed">
              We currently ship to the United States and Canada. 
              International shipping options may be available for select locations.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">5. Contact Us</h2>
            <p class="text-gray-700 leading-relaxed">
              If you have any questions about shipping, please contact us at 
              <a href="mailto:shipping&#64;dogbackseat.com" class="text-orange-600 hover:text-orange-700">
                shipping&#64;dogbackseat.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div class="container mx-auto px-4">
        <div class="text-center space-y-6">
          <h2 class="text-3xl font-bold text-gray-900">
            Questions About Shipping?
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            We're here to help with any shipping-related questions. Contact us for assistance.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/contact" class="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Contact Us
            </a>
            <a routerLink="/" class="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors duration-300">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Custom styles for better readability */
    .container {
      max-width: 1200px;
    }
    
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Enhanced typography */
    h2 {
      scroll-margin-top: 100px;
    }
    
    /* List styling improvements */
    ul, ol {
      line-height: 1.8;
    }
    
    /* Responsive text sizing */
    @media (max-width: 768px) {
      .text-5xl {
        font-size: 2.5rem;
      }
    }
    
    /* Enhanced button hover effects */
    button:hover, a:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class ShippingComponent implements OnInit, OnDestroy {
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
} 