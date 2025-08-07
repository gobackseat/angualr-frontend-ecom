import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Customer Support</h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help with any questions or concerns you may have.
            </p>
          </div>
        </div>
      </div>

      <!-- Breadcrumb -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <a routerLink="/" class="text-orange-600 hover:text-orange-700">
                Home
              </a>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">Support</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-md p-8">
          <div class="prose prose-lg max-w-none">
            <h2>Contact Information</h2>
            <p>
              Our customer support team is available to help you with any questions or concerns.
            </p>

            <h2>Email Support</h2>
            <p>
              For general inquiries: 
              <a href="mailto:support&#64;dogbackseat.com" class="text-orange-600 hover:text-orange-700">
                support&#64;dogbackseat.com
              </a>
            </p>

            <h2>Phone Support</h2>
            <p>
              Call us at: <a href="tel:1-800-DOG-SAFE" class="text-orange-600 hover:text-orange-700">
                1-800-DOG-SAFE
              </a>
            </p>

            <h2>Business Hours</h2>
            <p>
              Monday - Friday: 9:00 AM - 6:00 PM EST<br>
              Saturday: 10:00 AM - 4:00 PM EST<br>
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class SupportComponent {} 