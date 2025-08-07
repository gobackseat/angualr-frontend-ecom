import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- 50K+ Happy Customers -->
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-orange-600 mb-2">50K+</div>
            <div class="text-gray-700 text-sm md:text-base">Happy Customers</div>
          </div>
          
          <!-- 4.9/5 Average Rating -->
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-orange-600 mb-2">4.9/5</div>
            <div class="text-gray-700 text-sm md:text-base">Average Rating</div>
          </div>
          
          <!-- 30-Day Money Back -->
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-orange-600 mb-2">30-Day</div>
            <div class="text-gray-700 text-sm md:text-base">Money Back</div>
          </div>
          
          <!-- Free Shipping -->
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-orange-600 mb-2">Free</div>
            <div class="text-gray-700 text-sm md:text-base">Shipping</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Lightweight styles for betterment */
    .text-orange-600 {
      color: #ea580c;
    }
    
    .text-gray-700 {
      color: #374151;
    }
    
    .bg-gray-50 {
      background-color: #f9fafb;
    }
    
    /* Smooth hover effects */
    div[class*="text-center"] {
      transition: transform 0.2s ease-in-out;
    }
    
    div[class*="text-center"]:hover {
      transform: translateY(-2px);
    }
  `]
})
export class StatsBannerComponent {} 