import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  rating: number;
  location: string;
  verified: boolean;
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Floating paw prints -->
        <div class="absolute top-20 left-10 w-16 h-16 opacity-10 animate-bounce">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-orange-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="absolute top-40 right-20 w-12 h-12 opacity-15 animate-pulse">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-amber-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="absolute bottom-20 left-1/4 w-20 h-20 opacity-10 animate-bounce" style="animation-delay: 1s;">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-yellow-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <!-- Animated blurred circles -->
        <div class="absolute top-1/4 left-1/3 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/3 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <!-- Header Badge -->
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-orange-200/50">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>What Our Customers Say</span>
          </div>

          <!-- Main Title -->
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
            Loved by Pet Parents
          </h2>

          <!-- Subtitle -->
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Join thousands of happy pet owners who trust our product for their furry friends' 
            safety and comfort.
          </p>

          <!-- Rating Summary -->
          <div class="flex items-center justify-center gap-3 mb-12">
            <div class="flex items-center gap-1">
              <svg *ngFor="let star of [1,2,3,4,5]" class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span class="text-2xl font-bold text-gray-800">4.9</span>
            <span class="text-gray-600">(2,847 reviews)</span>
          </div>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-200/30 shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">50,000+</h3>
            <p class="text-gray-600">Happy Customers</p>
          </div>

          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-200/30 shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">98%</h3>
            <p class="text-gray-600">Satisfaction Rate</p>
          </div>

          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-200/30 shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">500K+</h3>
            <p class="text-gray-600">Safe Miles Traveled</p>
          </div>
        </div>

        <!-- Animated Testimonials Columns -->
        <div class="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <div class="flex flex-col gap-4" style="animation-duration: 15s">
            <div class="testimonials-scroll">
              <div class="testimonials-content">
                <div 
                  *ngFor="let testimonial of firstColumn" 
                  class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[200px] flex flex-col justify-between">
                  
                  <!-- Quote Icon -->
                  <div class="flex justify-between items-start mb-4">
                    <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    
                    <!-- Stars -->
                    <div class="flex gap-1">
                      <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Testimonial Text -->
                  <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    "{{ testimonial.text }}"
                  </p>
                  
                  <!-- Customer Info -->
                  <div class="flex items-center gap-3">
                    <img 
                      [src]="testimonial.image" 
                      [alt]="testimonial.name"
                      class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-800 text-sm">{{ testimonial.name }}</h4>
                        <svg *ngIf="testimonial.verified" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">{{ testimonial.role }}, {{ testimonial.location }}</p>
                      <p *ngIf="testimonial.verified" class="text-xs text-green-600 font-medium">Verified Purchase</p>
                    </div>
                  </div>
                </div>

                <!-- Duplicate testimonials for seamless loop -->
                <div 
                  *ngFor="let testimonial of firstColumn" 
                  class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[200px] flex flex-col justify-between">
                  
                  <!-- Quote Icon -->
                  <div class="flex justify-between items-start mb-4">
                    <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    
                    <!-- Stars -->
                    <div class="flex gap-1">
                      <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Testimonial Text -->
                  <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    "{{ testimonial.text }}"
                  </p>
                  
                  <!-- Customer Info -->
                  <div class="flex items-center gap-3">
                    <img 
                      [src]="testimonial.image" 
                      [alt]="testimonial.name"
                      class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-800 text-sm">{{ testimonial.name }}</h4>
                        <svg *ngIf="testimonial.verified" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">{{ testimonial.role }}, {{ testimonial.location }}</p>
                      <p *ngIf="testimonial.verified" class="text-xs text-green-600 font-medium">Verified Purchase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4 hidden md:block" style="animation-duration: 19s">
            <div class="testimonials-scroll">
              <div class="testimonials-content">
                <div 
                  *ngFor="let testimonial of secondColumn" 
                  class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[200px] flex flex-col justify-between">
                  
                  <!-- Quote Icon -->
                  <div class="flex justify-between items-start mb-4">
                    <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    
                    <!-- Stars -->
                    <div class="flex gap-1">
                      <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Testimonial Text -->
                  <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    "{{ testimonial.text }}"
                  </p>
                  
                  <!-- Customer Info -->
                  <div class="flex items-center gap-3">
                    <img 
                      [src]="testimonial.image" 
                      [alt]="testimonial.name"
                      class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-800 text-sm">{{ testimonial.name }}</h4>
                        <svg *ngIf="testimonial.verified" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">{{ testimonial.role }}, {{ testimonial.location }}</p>
                      <p *ngIf="testimonial.verified" class="text-xs text-green-600 font-medium">Verified Purchase</p>
                    </div>
                  </div>
                </div>

                <!-- Duplicate testimonials for seamless loop -->
                <div 
                  *ngFor="let testimonial of secondColumn" 
                  class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[200px] flex flex-col justify-between">
                  
                  <!-- Quote Icon -->
                  <div class="flex justify-between items-start mb-4">
                    <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    
                    <!-- Stars -->
                    <div class="flex gap-1">
                      <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Testimonial Text -->
                  <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    "{{ testimonial.text }}"
                  </p>
                  
                  <!-- Customer Info -->
                  <div class="flex items-center gap-3">
                    <img 
                      [src]="testimonial.image" 
                      [alt]="testimonial.name"
                      class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-800 text-sm">{{ testimonial.name }}</h4>
                        <svg *ngIf="testimonial.verified" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">{{ testimonial.role }}, {{ testimonial.location }}</p>
                      <p *ngIf="testimonial.verified" class="text-xs text-green-600 font-medium">Verified Purchase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4 hidden lg:block" style="animation-duration: 17s">
            <div class="testimonials-scroll">
              <div class="testimonials-content">
                <div 
                  *ngFor="let testimonial of thirdColumn" 
                  class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[200px] flex flex-col justify-between">
                  
                  <!-- Quote Icon -->
                  <div class="flex justify-between items-start mb-4">
                    <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    
                    <!-- Stars -->
                    <div class="flex gap-1">
                      <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Testimonial Text -->
                  <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    "{{ testimonial.text }}"
                  </p>
                  
                  <!-- Customer Info -->
                  <div class="flex items-center gap-3">
                    <img 
                      [src]="testimonial.image" 
                      [alt]="testimonial.name"
                      class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-800 text-sm">{{ testimonial.name }}</h4>
                        <svg *ngIf="testimonial.verified" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">{{ testimonial.role }}, {{ testimonial.location }}</p>
                      <p *ngIf="testimonial.verified" class="text-xs text-green-600 font-medium">Verified Purchase</p>
                    </div>
                  </div>
                </div>

                <!-- Duplicate testimonials for seamless loop -->
                <div 
                  *ngFor="let testimonial of thirdColumn" 
                  class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[200px] flex flex-col justify-between">
                  
                  <!-- Quote Icon -->
                  <div class="flex justify-between items-start mb-4">
                    <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    
                    <!-- Stars -->
                    <div class="flex gap-1">
                      <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Testimonial Text -->
                  <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    "{{ testimonial.text }}"
                  </p>
                  
                  <!-- Customer Info -->
                  <div class="flex items-center gap-3">
                    <img 
                      [src]="testimonial.image" 
                      [alt]="testimonial.name"
                      class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-800 text-sm">{{ testimonial.name }}</h4>
                        <svg *ngIf="testimonial.verified" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">{{ testimonial.role }}, {{ testimonial.location }}</p>
                      <p *ngIf="testimonial.verified" class="text-xs text-green-600 font-medium">Verified Purchase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <p class="text-lg text-gray-600 mb-6">
            Ready to give your dog the comfort and safety they deserve?
          </p>
          <button 
            (click)="scrollToProduct()"
            class="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Shop Now - Free Shipping
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Animated background elements */
    .animate-bounce {
      animation: bounce 2s infinite;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        transform: translate3d(0, -8px, 0);
      }
      70% {
        transform: translate3d(0, -4px, 0);
      }
      90% {
        transform: translate3d(0, -2px, 0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
    
    /* Gradient text */
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }
    
    /* Backdrop blur */
    .backdrop-blur-sm {
      backdrop-filter: blur(4px);
    }

    .testimonials-scroll {
      overflow: hidden;
    }
    
    .testimonials-content {
      animation: scroll-up var(--duration, 15s) linear infinite;
    }
    
    @keyframes scroll-up {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-50%);
      }
    }
    
    /* Pause animation on hover */
    .testimonials-scroll:hover .testimonials-content {
      animation-play-state: paused;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .testimonials-content {
        animation-duration: 12s;
      }
    }
  `]
})
export class TestimonialsSectionComponent implements OnInit {
  
  // Testimonials data
  testimonials: Testimonial[] = [];

  firstColumn: Testimonial[] = [];
  secondColumn: Testimonial[] = [];
  thirdColumn: Testimonial[] = [];

  ngOnInit() {
    this.loadTestimonials();
    this.distributeTestimonials();
  }

  private loadTestimonials() {
    // In production, this should load from a CMS or API
    // For now, we'll load from a service or keep empty
    // TODO: Implement testimonials service for production
    this.testimonials = [];
  }

  scrollToProduct(): void {
    const element = document.getElementById('product-showcase');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private distributeTestimonials() {
    this.firstColumn = this.testimonials.filter((_, index) => index % 3 === 0);
    this.secondColumn = this.testimonials.filter((_, index) => index % 3 === 1);
    this.thirdColumn = this.testimonials.filter((_, index) => index % 3 === 2);
  }
} 