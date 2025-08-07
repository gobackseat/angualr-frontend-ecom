import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'app-testimonials-column',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p class="text-lg text-gray-600">Real stories from happy pet parents</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Column 1 -->
          <div class="space-y-6">
            <div *ngFor="let testimonial of firstColumn" class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center mb-4">
                <img [src]="testimonial.image" [alt]="testimonial.name" class="w-12 h-12 rounded-full object-cover">
                <div class="ml-3">
                  <h4 class="font-medium text-gray-900">{{ testimonial.name }}</h4>
                  <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
                </div>
              </div>
              <p class="text-gray-700 mb-3">{{ testimonial.text }}</p>
              <div class="flex items-center justify-between">
                <div class="flex text-yellow-400">
                  <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-500">{{ testimonial.location }}</span>
              </div>
            </div>
          </div>

          <!-- Column 2 -->
          <div class="space-y-6">
            <div *ngFor="let testimonial of secondColumn" class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center mb-4">
                <img [src]="testimonial.image" [alt]="testimonial.name" class="w-12 h-12 rounded-full object-cover">
                <div class="ml-3">
                  <h4 class="font-medium text-gray-900">{{ testimonial.name }}</h4>
                  <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
                </div>
              </div>
              <p class="text-gray-700 mb-3">{{ testimonial.text }}</p>
              <div class="flex items-center justify-between">
                <div class="flex text-yellow-400">
                  <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-500">{{ testimonial.location }}</span>
              </div>
            </div>
          </div>

          <!-- Column 3 -->
          <div class="space-y-6">
            <div *ngFor="let testimonial of thirdColumn" class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center mb-4">
                <img [src]="testimonial.image" [alt]="testimonial.name" class="w-12 h-12 rounded-full object-cover">
                <div class="ml-3">
                  <h4 class="font-medium text-gray-900">{{ testimonial.name }}</h4>
                  <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
                </div>
              </div>
              <p class="text-gray-700 mb-3">{{ testimonial.text }}</p>
              <div class="flex items-center justify-between">
                <div class="flex text-yellow-400">
                  <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-500">{{ testimonial.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TestimonialsColumnComponent implements OnInit, OnDestroy {
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

  ngOnDestroy() {
    // Cleanup if needed
  }

  private distributeTestimonials() {
    this.firstColumn = this.testimonials.filter((_, index) => index % 3 === 0);
    this.secondColumn = this.testimonials.filter((_, index) => index % 3 === 1);
    this.thirdColumn = this.testimonials.filter((_, index) => index % 3 === 2);
  }
} 