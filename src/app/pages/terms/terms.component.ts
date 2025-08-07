import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms & Conditions
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services.
            </p>
          </div>

          <!-- Content -->
          <div class="prose prose-lg max-w-none">
            <h2 class="text-3xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p class="text-gray-700 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">2. Use License</h2>
            <p class="text-gray-700 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on Dogs Backseat Extender's website for personal, non-commercial transitory viewing only.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">3. Disclaimer</h2>
            <p class="text-gray-700 leading-relaxed">
              The materials on Dogs Backseat Extender's website are provided on an 'as is' basis. Dogs Backseat Extender makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">4. Limitations</h2>
            <p class="text-gray-700 leading-relaxed">
              In no event shall Dogs Backseat Extender or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Dogs Backseat Extender's website, even if Dogs Backseat Extender or a Dogs Backseat Extender authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">5. Accuracy of Materials</h2>
            <p class="text-gray-700 leading-relaxed">
              The materials appearing on Dogs Backseat Extender's website could include technical, typographical, or photographic errors. Dogs Backseat Extender does not warrant that any of the materials on its website are accurate, complete or current.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">6. Links</h2>
            <p class="text-gray-700 leading-relaxed">
              Dogs Backseat Extender has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Dogs Backseat Extender of the site.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">7. Modifications</h2>
            <p class="text-gray-700 leading-relaxed">
              Dogs Backseat Extender may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">8. Governing Law</h2>
            <p class="text-gray-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">9. Privacy Policy</h2>
            <p class="text-gray-700 leading-relaxed">
              Your privacy is important to us. It is Dogs Backseat Extender's policy to respect your privacy regarding any information we may collect while operating our website.
            </p>

            <h2 class="text-3xl font-bold text-gray-900">10. Contact Us</h2>
            <p class="text-gray-700 leading-relaxed">
              If you have any questions about these Terms & Conditions, feel free to reach out:
            </p>
            <div class="bg-gray-50 rounded-lg p-6 space-y-4">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span class="text-gray-700"><strong>Email:</strong> gobackseat&#64;gmail.com</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="text-gray-700"><strong>Address:</strong> 432 Park Ave, 10th Floor, New York City, NY</span>
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
            Questions About Our Terms?
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            We're committed to transparency and clear communication. If you have any questions about our terms and conditions, we're here to help.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/contact" class="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Contact Us
            </a>
            <a routerLink="/" class="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors duration-300">
              Back to Home
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
export class TermsComponent implements OnInit, OnDestroy {
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