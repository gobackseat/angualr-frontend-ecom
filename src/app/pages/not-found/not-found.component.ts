import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <!-- 404 Icon -->
        <div class="mb-8">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-4">
            <svg class="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"/>
            </svg>
          </div>
          <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
          <p class="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <a routerLink="/" class="block w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
            Go Home
          </a>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <a routerLink="/products" class="text-orange-600 hover:text-orange-700 font-medium">
              Browse Products
            </a>
            <a routerLink="/about" class="text-orange-600 hover:text-orange-700 font-medium">
              About Us
            </a>
            <a routerLink="/contact" class="text-orange-600 hover:text-orange-700 font-medium">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class NotFoundComponent {} 