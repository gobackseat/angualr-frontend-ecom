import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-our-story',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <!-- Hero Section -->
      <section class="relative py-20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20"></div>
        <div class="container mx-auto px-4 relative z-10">
          <div class="text-center mb-16">
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
              Our Story
            </h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From a simple idea to helping thousands of pet parents keep their furry friends safe and comfortable on the road.
            </p>
          </div>
        </div>
      </section>

      <!-- Timeline Section -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="space-y-16">
              <!-- 2020 - The Beginning -->
              <div class="flex flex-col md:flex-row items-center gap-8">
                <div class="md:w-1/2">
                  <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <div class="text-3xl font-bold text-orange-600 mb-4">2020</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">The Beginning</h3>
                    <p class="text-gray-600 leading-relaxed">
                      It all started with a road trip gone wrong. Our founder, Sarah, was driving with her Golden Retriever, Max, 
                      when he kept sliding around the backseat, making the journey stressful for both of them. That's when the idea 
                      for a better car solution was born.
                    </p>
                  </div>
                </div>
                <div class="md:w-1/2">
                  <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop" 
                       alt="Dog in car" 
                       class="rounded-2xl shadow-lg">
                </div>
              </div>

              <!-- 2021 - Research & Development -->
              <div class="flex flex-col md:flex-row-reverse items-center gap-8">
                <div class="md:w-1/2">
                  <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <div class="text-3xl font-bold text-orange-600 mb-4">2021</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Research & Development</h3>
                    <p class="text-gray-600 leading-relaxed">
                      We spent months researching different materials, testing various designs, and working with veterinarians 
                      to ensure our product would be both safe and comfortable for pets of all sizes.
                    </p>
                  </div>
                </div>
                <div class="md:w-1/2">
                  <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=400&fit=crop" 
                       alt="Product development" 
                       class="rounded-2xl shadow-lg">
                </div>
              </div>

              <!-- 2022 - First Launch -->
              <div class="flex flex-col md:flex-row items-center gap-8">
                <div class="md:w-1/2">
                  <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <div class="text-3xl font-bold text-orange-600 mb-4">2022</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">First Launch</h3>
                    <p class="text-gray-600 leading-relaxed">
                      After countless prototypes and feedback from pet parents, we launched our first product. The response was 
                      overwhelming - thousands of happy customers and their pets were finally enjoying safe, comfortable car rides.
                    </p>
                  </div>
                </div>
                <div class="md:w-1/2">
                  <img src="https://images.unsplash.com/photo-1601758228041-3bca202f2e4c?w=600&h=400&fit=crop" 
                       alt="Product launch" 
                       class="rounded-2xl shadow-lg">
                </div>
              </div>

              <!-- 2023 - Growth & Innovation -->
              <div class="flex flex-col md:flex-row-reverse items-center gap-8">
                <div class="md:w-1/2">
                  <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <div class="text-3xl font-bold text-orange-600 mb-4">2023</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Growth & Innovation</h3>
                    <p class="text-gray-600 leading-relaxed">
                      We expanded our product line, introduced new features, and reached over 50,000 happy customers. 
                      Our commitment to quality and safety remained our top priority.
                    </p>
                  </div>
                </div>
                <div class="md:w-1/2">
                  <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" 
                       alt="Team growth" 
                       class="rounded-2xl shadow-lg">
                </div>
              </div>

              <!-- 2024 - Today -->
              <div class="flex flex-col md:flex-row items-center gap-8">
                <div class="md:w-1/2">
                  <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <div class="text-3xl font-bold text-orange-600 mb-4">2024</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Today</h3>
                    <p class="text-gray-600 leading-relaxed">
                      We continue to innovate and improve our products based on customer feedback. Our mission remains the same: 
                      to make car rides safer and more comfortable for pets and their families.
                    </p>
                  </div>
                </div>
                <div class="md:w-1/2">
                  <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop" 
                       alt="Happy family" 
                       class="rounded-2xl shadow-lg">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values Section -->
      <section class="py-20 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
              <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Pet Safety First</h3>
              <p class="text-gray-600">
                Every product we create is designed with pet safety as the top priority. We work closely with veterinarians 
                and safety experts to ensure our products meet the highest standards.
              </p>
            </div>

            <div class="text-center p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
              <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Quality Guaranteed</h3>
              <p class="text-gray-600">
                We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our high standards 
                for durability, comfort, and safety.
              </p>
            </div>

            <div class="text-center p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
              <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Customer Focused</h3>
              <p class="text-gray-600">
                We listen to our customers and continuously improve our products based on their feedback. Your satisfaction 
                and your pet's comfort are our driving forces.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate people behind our mission to keep pets safe and comfortable
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face" 
                   alt="Sarah Johnson" 
                   class="w-32 h-32 rounded-full mx-auto mb-6 object-cover">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
              <p class="text-orange-600 font-medium mb-4">Founder & CEO</p>
              <p class="text-gray-600">
                A pet parent and entrepreneur who turned a frustrating car ride into a mission to help millions of pets.
              </p>
            </div>

            <div class="text-center">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" 
                   alt="Mike Chen" 
                   class="w-32 h-32 rounded-full mx-auto mb-6 object-cover">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Mike Chen</h3>
              <p class="text-orange-600 font-medium mb-4">Head of Product</p>
              <p class="text-gray-600">
                An engineer with a passion for creating products that make a real difference in people's lives.
              </p>
            </div>

            <div class="text-center">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" 
                   alt="Emily Rodriguez" 
                   class="w-32 h-32 rounded-full mx-auto mb-6 object-cover">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Emily Rodriguez</h3>
              <p class="text-orange-600 font-medium mb-4">Customer Success</p>
              <p class="text-gray-600">
                Dedicated to ensuring every customer and their pet has the best experience with our products.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p class="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Help us continue making car rides safer and more comfortable for pets everywhere.
          </p>
          <button 
            routerLink="/product"
            class="bg-white text-orange-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-orange-50 transition-colors">
            Shop Our Products
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }
  `]
})
export class OurStoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 