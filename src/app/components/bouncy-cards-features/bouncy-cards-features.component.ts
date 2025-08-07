import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bouncy-cards-features',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-4 text-slate-800">
      <div class="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:px-8">
        <h2 class="max-w-lg text-4xl font-bold md:text-5xl">
          Why Dogs & Owners
          <span class="text-orange-500"> Love It</span>
        </h2>
        <button 
          (click)="scrollToProduct()"
          class="whitespace-nowrap rounded-lg bg-orange-600 px-6 py-3 font-medium text-white shadow-xl transition-all duration-300 hover:bg-orange-700 flex items-center gap-2 hover:scale-105 active:scale-95">
          Shop Now
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </button>
      </div>

      <!-- First Row -->
      <div class="mb-4 grid grid-cols-12 gap-4">
        <!-- Card 1 - Safety First -->
        <div class="col-span-12 md:col-span-4">
          <div class="group relative overflow-hidden rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl transform-gpu">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold">Safety First</h3>
            </div>
            <div class="bg-orange-500 rounded-lg p-6 text-white min-h-[120px] flex items-center">
              <p class="text-sm leading-relaxed">Advanced safety harness system with crash-tested materials for ultimate protection during travel</p>
            </div>
          </div>
        </div>

        <!-- Card 2 - Ultimate Comfort -->
        <div class="col-span-12 md:col-span-8">
          <div class="group relative overflow-hidden rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition-all duration-500 hover:scale-105 hover:-rotate-1 hover:shadow-2xl transform-gpu">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold">Ultimate Comfort</h3>
            </div>
            <div class="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-6 text-white min-h-[120px] flex items-center">
              <p class="text-sm leading-relaxed">Memory foam padding with breathable fabric ensures maximum comfort for long journeys</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Row -->
      <div class="grid grid-cols-12 gap-4">
        <!-- Card 3 - 5-Min Setup -->
        <div class="col-span-12 md:col-span-8">
          <div class="group relative overflow-hidden rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl transform-gpu">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold">5-Min Setup</h3>
            </div>
            <div class="bg-green-500 rounded-lg p-6 text-white min-h-[120px] flex items-center">
              <p class="text-sm leading-relaxed">Tool-free installation with universal fit for 95% of vehicle models and seat configurations</p>
            </div>
          </div>
        </div>

        <!-- Card 4 - Customer Love -->
        <div class="col-span-12 md:col-span-4">
          <div class="group relative overflow-hidden rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition-all duration-500 hover:scale-105 hover:-rotate-1 hover:shadow-2xl transform-gpu">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold">Customer Love</h3>
            </div>
            <div class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white min-h-[120px] flex items-center">
              <p class="text-sm leading-relaxed">4.9/5 rating from 2,847+ happy customers with 30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Enhanced bouncy animations */
    .group {
      transform-style: preserve-3d;
      perspective: 1000px;
    }
    
    .group:hover {
      transform: scale(1.05) rotate(1deg);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .group:hover .bg-gray-50 {
      background-color: rgb(243 244 246);
    }
    
    /* Smooth transitions */
    .transition-all {
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    /* Button hover effects */
    button:hover {
      transform: scale(1.05);
    }
    
    button:active {
      transform: scale(0.95);
    }
    
    /* Enhanced shadow effects */
    .hover\\:shadow-2xl:hover {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    /* GPU acceleration */
    .transform-gpu {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }
      
      .col-span-12.md\\:col-span-4,
      .col-span-12.md\\:col-span-8 {
        grid-column: span 12;
      }
      
      .group:hover {
        transform: scale(1.02) rotate(0.5deg);
      }
    }
  `]
})
export class BouncyCardsFeaturesComponent {
  
  scrollToProduct(): void {
    const element = document.getElementById('product-showcase');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
} 