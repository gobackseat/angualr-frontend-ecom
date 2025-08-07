import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Returns & Refunds
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              We want you to be completely satisfied with your purchase. Learn about our return and refund policy.
            </p>
          </div>

          <!-- Content -->
          <div class="prose prose-lg max-w-none">
            <h2 class="text-3xl font-bold text-gray-900">1. Return Policy</h2>
            <p class="text-gray-700 leading-relaxed">
              We accept returns within 30 days of purchase for items in their original condition. 
              Items must be unused and in the original packaging.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">2. Refund Process</h2>
            <p class="text-gray-700 leading-relaxed">
              Once we receive your return, we will inspect it and notify you of the refund status. 
              If approved, your refund will be processed within 5-7 business days.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">3. Return Shipping</h2>
            <p class="text-gray-700 leading-relaxed">
              Customers are responsible for return shipping costs unless the item was defective or damaged upon arrival.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">4. Contact Us</h2>
            <p class="text-gray-700 leading-relaxed">
              If you have any questions about returns or refunds, please contact us at 
              <a href="mailto:returns&#64;dogbackseat.com" class="text-orange-600 hover:text-orange-700">
                returns&#64;dogbackseat.com
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
            Questions About Returns?
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            We're here to help make your return process as smooth as possible. Contact us if you have any questions about our return and refund policy.
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
export class ReturnsComponent implements OnInit, OnDestroy {
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