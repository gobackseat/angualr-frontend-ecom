import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-affiliate',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Affiliate & NGO Partnership
          </h1>
          <p class="text-lg text-gray-700 leading-relaxed mb-4">
            Effective Date: July 29, 2025
          </p>
          <p class="text-lg text-gray-700 leading-relaxed">
            At GoBackSeatExtender.us, we believe that every dog deserves a safe and loving journey whether it's on the road or in life. Beyond creating travel comfort for dogs and their humans, we're proud to stand with non-profit organizations that rescue, rehabilitate, and care for dogs in need.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto space-y-12">
          
          <!-- Our Mission With a Purpose -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Our Mission With a Purpose</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our brand isn't just about convenience, it's about compassion.
              </p>
              <p>
                We've partnered with local animal shelters and NGOs to make sure that no product goes to waste and no dog is left behind. Through this initiative:
              </p>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li>Used or exchanged backseat extenders (still in usable condition) are donated to affiliated NGOs.</li>
                <li>These extenders help dogs during transport to vet clinics, foster homes, or adoption events, providing them with a safe and comfortable ride.</li>
                <li>A portion of each purchase may go toward pet welfare efforts, including rescue drives and rehabilitation resources.</li>
              </ul>
            </div>
          </div>

          <!-- How You Contribute -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">How You Contribute</h2>
            <p class="text-lg text-gray-700 leading-relaxed">
              Every time you shop with us, you're not just buying a product, you're backing a cause. Here's how your purchase matters:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <!-- Returns or Exchanges -->
              <div class="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-400">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Returns or Exchanges?</h3>
                <p class="text-gray-700">
                  If your returned item is in usable condition, we don't throw it away. Instead, we donate it to our partner NGO to help support dogs in need.
                </p>
              </div>

              <!-- Want to Donate Directly -->
              <div class="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-400">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Want to Donate Directly?</h3>
                <p class="text-gray-700">
                  Have a gently used backseat extender you're not using anymore? Contact us and we'll help redirect it to one of our verified partner shelter, they will use it to help the dogs.
                </p>
              </div>

              <!-- Every Order Counts -->
              <div class="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Every Order Counts</h3>
                <p class="text-gray-700">
                  With each order, we donate 10% of our sales to the NGO. You're supporting our efforts to give animals better care and comfort, not just in your car, but in their lives.
                </p>
              </div>
            </div>
          </div>

          <!-- Meet Our Partner NGOs -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Meet Our Partner NGOs</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We're currently collaborating with dog welfare organizations that align with our mission and helping dogs state wide to travel safely. For privacy and legal reasons, the names of our current partner NGOs are kept confidential. We appreciate your understanding and support.
              </p>
              <p>
                While we work on growing our partner list, you can rest assured your donations and returns are going to certified, animal-loving hands.
              </p>
              <div class="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
                <p class="text-blue-800 font-semibold">
                  If you represent an NGO or animal shelter and are interested in partnering with us, please reach out at: gobackseat&#64;gmail.com
                </p>
              </div>
            </div>
          </div>

          <!-- Small Steps, Big Impact -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Small Steps, Big Impact</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Whether it's one used extender or one new order, every small contribution adds up. At GoBackSeatExtender.us, we're building a community of dog lovers who not only care about their own furry companions but are also willing to help others in need.
              </p>
              <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-8 text-center">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                  Thank you for being part of something bigger than just a purchase.
                </h3>
                <p class="text-lg text-gray-700">
                  Together, we can make every car ride and life more comfortable for dogs everywhere.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div class="container mx-auto px-4">
        <div class="text-center space-y-6">
          <h2 class="text-3xl font-bold text-gray-900">
            Join Our Mission
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            Every purchase makes a difference. Help us support dogs in need while keeping your furry friend safe and comfortable.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/product" class="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Shop Now
            </a>
            <a routerLink="/contact" class="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors duration-300">
              Contact Us
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
    ul {
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
export class AffiliateComponent implements OnInit, OnDestroy {
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
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-affiliate',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Affiliate & NGO Partnership
          </h1>
          <p class="text-lg text-gray-700 leading-relaxed mb-4">
            Effective Date: July 29, 2025
          </p>
          <p class="text-lg text-gray-700 leading-relaxed">
            At GoBackSeatExtender.us, we believe that every dog deserves a safe and loving journey whether it's on the road or in life. Beyond creating travel comfort for dogs and their humans, we're proud to stand with non-profit organizations that rescue, rehabilitate, and care for dogs in need.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto space-y-12">
          
          <!-- Our Mission With a Purpose -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Our Mission With a Purpose</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our brand isn't just about convenience, it's about compassion.
              </p>
              <p>
                We've partnered with local animal shelters and NGOs to make sure that no product goes to waste and no dog is left behind. Through this initiative:
              </p>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li>Used or exchanged backseat extenders (still in usable condition) are donated to affiliated NGOs.</li>
                <li>These extenders help dogs during transport to vet clinics, foster homes, or adoption events, providing them with a safe and comfortable ride.</li>
                <li>A portion of each purchase may go toward pet welfare efforts, including rescue drives and rehabilitation resources.</li>
              </ul>
            </div>
          </div>

          <!-- How You Contribute -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">How You Contribute</h2>
            <p class="text-lg text-gray-700 leading-relaxed">
              Every time you shop with us, you're not just buying a product, you're backing a cause. Here's how your purchase matters:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <!-- Returns or Exchanges -->
              <div class="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-400">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Returns or Exchanges?</h3>
                <p class="text-gray-700">
                  If your returned item is in usable condition, we don't throw it away. Instead, we donate it to our partner NGO to help support dogs in need.
                </p>
              </div>

              <!-- Want to Donate Directly -->
              <div class="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-400">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Want to Donate Directly?</h3>
                <p class="text-gray-700">
                  Have a gently used backseat extender you're not using anymore? Contact us and we'll help redirect it to one of our verified partner shelter, they will use it to help the dogs.
                </p>
              </div>

              <!-- Every Order Counts -->
              <div class="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Every Order Counts</h3>
                <p class="text-gray-700">
                  With each order, we donate 10% of our sales to the NGO. You're supporting our efforts to give animals better care and comfort, not just in your car, but in their lives.
                </p>
              </div>
            </div>
          </div>

          <!-- Meet Our Partner NGOs -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Meet Our Partner NGOs</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We're currently collaborating with dog welfare organizations that align with our mission and helping dogs state wide to travel safely. For privacy and legal reasons, the names of our current partner NGOs are kept confidential. We appreciate your understanding and support.
              </p>
              <p>
                While we work on growing our partner list, you can rest assured your donations and returns are going to certified, animal-loving hands.
              </p>
              <div class="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
                <p class="text-blue-800 font-semibold">
                  If you represent an NGO or animal shelter and are interested in partnering with us, please reach out at: gobackseat&#64;gmail.com
                </p>
              </div>
            </div>
          </div>

          <!-- Small Steps, Big Impact -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Small Steps, Big Impact</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Whether it's one used extender or one new order, every small contribution adds up. At GoBackSeatExtender.us, we're building a community of dog lovers who not only care about their own furry companions but are also willing to help others in need.
              </p>
              <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-8 text-center">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                  Thank you for being part of something bigger than just a purchase.
                </h3>
                <p class="text-lg text-gray-700">
                  Together, we can make every car ride and life more comfortable for dogs everywhere.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div class="container mx-auto px-4">
        <div class="text-center space-y-6">
          <h2 class="text-3xl font-bold text-gray-900">
            Join Our Mission
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            Every purchase makes a difference. Help us support dogs in need while keeping your furry friend safe and comfortable.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/product" class="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Shop Now
            </a>
            <a routerLink="/contact" class="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors duration-300">
              Contact Us
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
    ul {
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
export class AffiliateComponent implements OnInit, OnDestroy {
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
 