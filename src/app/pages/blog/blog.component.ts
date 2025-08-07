import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Tips, stories, and insights about pet travel safety and comfort.
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
                <span class="ml-4 text-sm font-medium text-gray-500">Blog</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Blog Posts -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Blog Post 1 -->
          <article class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/assets/images/blog/post-1.jpg" alt="Dog in car" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <span>March 15, 2024</span>
                <span class="mx-2">•</span>
                <span>5 min read</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                Essential Safety Tips for Traveling with Your Dog
              </h3>
              <p class="text-gray-600 mb-4">
                Learn the most important safety measures to keep your furry friend secure during car rides.
              </p>
              <a href="#" class="text-orange-600 hover:text-orange-700 font-medium">
                Read More →
              </a>
            </div>
          </article>

          <!-- Blog Post 2 -->
          <article class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/assets/images/blog/post-2.jpg" alt="Car interior" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <span>March 10, 2024</span>
                <span class="mx-2">•</span>
                <span>3 min read</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                How to Choose the Right Backseat Extender
              </h3>
              <p class="text-gray-600 mb-4">
                A comprehensive guide to selecting the perfect backseat extender for your vehicle and dog.
              </p>
              <a href="#" class="text-orange-600 hover:text-orange-700 font-medium">
                Read More →
              </a>
            </div>
          </article>

          <!-- Blog Post 3 -->
          <article class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/assets/images/blog/post-3.jpg" alt="Happy dog" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <span>March 5, 2024</span>
                <span class="mx-2">•</span>
                <span>4 min read</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                Road Trip Planning with Your Pet
              </h3>
              <p class="text-gray-600 mb-4">
                Everything you need to know about planning the perfect road trip with your four-legged companion.
              </p>
              <a href="#" class="text-orange-600 hover:text-orange-700 font-medium">
                Read More →
              </a>
            </div>
          </article>

          <!-- Blog Post 4 -->
          <article class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/assets/images/blog/post-4.jpg" alt="Car safety" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <span>February 28, 2024</span>
                <span class="mx-2">•</span>
                <span>6 min read</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                Understanding Pet Travel Laws
              </h3>
              <p class="text-gray-600 mb-4">
                Stay compliant with local and state regulations when traveling with your pets.
              </p>
              <a href="#" class="text-orange-600 hover:text-orange-700 font-medium">
                Read More →
              </a>
            </div>
          </article>

          <!-- Blog Post 5 -->
          <article class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/assets/images/blog/post-5.jpg" alt="Dog comfort" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <span>February 20, 2024</span>
                <span class="mx-2">•</span>
                <span>4 min read</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                Keeping Your Dog Comfortable on Long Journeys
              </h3>
              <p class="text-gray-600 mb-4">
                Tips and tricks to ensure your dog stays happy and comfortable during extended car rides.
              </p>
              <a href="#" class="text-orange-600 hover:text-orange-700 font-medium">
                Read More →
              </a>
            </div>
          </article>

          <!-- Blog Post 6 -->
          <article class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/assets/images/blog/post-6.jpg" alt="Car accessories" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <span>February 15, 2024</span>
                <span class="mx-2">•</span>
                <span>5 min read</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                Must-Have Car Accessories for Pet Owners
              </h3>
              <p class="text-gray-600 mb-4">
                Discover the essential accessories that every pet owner should have in their vehicle.
              </p>
              <a href="#" class="text-orange-600 hover:text-orange-700 font-medium">
                Read More →
              </a>
            </div>
          </article>
        </div>

        <!-- Load More Button -->
        <div class="text-center mt-12">
          <button class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class BlogComponent {} 