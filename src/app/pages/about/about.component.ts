import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">About Dog Backseat Extender</h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              We're passionate about keeping your furry friends safe and comfortable during car rides.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Story Section -->
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div class="space-y-4 text-gray-600">
              <p>
                Founded in 2020, Dog Backseat Extender was born from a simple observation: 
                too many dogs were traveling unsafely in cars. We saw the need for a solution 
                that would keep our four-legged family members secure and comfortable during 
                every journey.
              </p>
              <p>
                Our founder, a veterinarian with over 15 years of experience, understood the 
                risks of unrestrained pets in vehicles. After witnessing several preventable 
                accidents, they set out to create a product that would make car travel safer 
                for dogs of all sizes.
              </p>
              <p>
                Today, we're proud to offer premium backseat extenders that combine safety, 
                comfort, and style. Every product is crash-tested and designed with your 
                pet's well-being in mind.
              </p>
            </div>
          </div>

          <!-- Image -->
          <div class="relative">
            <img src="assets/images/hero/black-backseat-extender-hero-slider-1.webp" alt="About Us Hero" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        <!-- Mission & Values -->
        <div class="mt-16">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Mission & Values</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p class="text-gray-600">
                Every product is crash-tested and meets or exceeds safety standards to ensure your pet's protection.
              </p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Quality Craftsmanship</h3>
              <p class="text-gray-600">
                We use premium materials and rigorous quality control to ensure every product lasts.
              </p>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Customer Care</h3>
              <p class="text-gray-600">
                Our dedicated support team is here to help with any questions or concerns you may have.
              </p>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="mt-16 bg-orange-600 rounded-lg p-8 text-center">
          <h2 class="text-3xl font-bold text-white mb-4">Ready to Keep Your Dog Safe?</h2>
          <p class="text-orange-100 mb-6 max-w-2xl mx-auto">
            Join thousands of pet parents who trust our products to keep their furry friends safe and comfortable.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/product" class="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Shop Now
            </a>
            <a routerLink="/contact" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200">
              Contact Us
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
export class AboutComponent {} 