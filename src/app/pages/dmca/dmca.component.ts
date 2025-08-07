import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dmca',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            DMCA Policy
          </h1>
          <p class="text-lg text-gray-700 leading-relaxed mb-4">
            Effective Date: July 29, 2025
          </p>
          <p class="text-lg text-gray-700 leading-relaxed">
            GoBackSeatExtender respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (DMCA), the text of which may be found on the U.S. Copyright Office website at http://www.copyright.gov/legislation/dmca.pdf, we will respond expeditiously to claims of copyright infringement committed using the GoBackSeatExtender service and/or website, if such claims are reported to our Designated Copyright Agent identified below.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto space-y-12">
          
          <!-- Notification of Copyright Infringement -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Notification of Copyright Infringement (DMCA Takedown Notice)</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                If you are a copyright owner, or are authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the Site by completing the following DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent.
              </p>
              <p>
                Upon receipt of the Notice as described below, we will take whatever action, in our sole discretion, we deem appropriate, including removal of the challenged content from the Site.
              </p>
            </div>
          </div>

          <!-- Requirements for a Valid DMCA Takedown Notice -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Requirements for a Valid DMCA Takedown Notice</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                To be effective, the Notification must be a written communication that includes substantially the following:
              </p>
              <div class="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
                <ul class="list-decimal list-inside space-y-3 ml-4">
                  <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                  <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site. This could include, for example, a photograph of a dog product, a unique product description, or a user-submitted video featuring a pet.</li>
                  <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material. Providing URLs is the best way to help us locate content quickly.</li>
                  <li>Information reasonably sufficient to permit us to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</li>
                  <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                  <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Designated Copyright Agent -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Designated Copyright Agent</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our Designated Copyright Agent to receive Notifications of Claimed Infringement can be contacted as follows:
              </p>
              <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span class="text-gray-700"><strong>Name of Agent:</strong> gobackseatextender.us</span>
                </div>
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span class="text-gray-700"><strong>Email:</strong> gobackseat&#64;gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Counter-Notification -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Counter-Notification</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a Counter-Notification containing the following information to the Designated Copyright Agent:
              </p>
              <div class="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-400">
                <ul class="list-decimal list-inside space-y-3 ml-4">
                  <li>Your physical or electronic signature.</li>
                  <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled.</li>
                  <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content.</li>
                  <li>Your name, address, telephone number, and email address, and a statement that you consent to the jurisdiction of the federal court in New York, New York, and a statement that you will accept service of process from the person who provided notification of the alleged infringement.</li>
                </ul>
              </div>
              <p class="mt-4">
                Upon receipt of a valid Counter-Notification, we will send a copy of the Counter-Notification to the original complaining party informing that person that we may replace the removed content or cease disabling it in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, member, or user, the removed content may be replaced, or access to it restored, in 10 to 14 business days or more after receipt of the Counter-Notification, at our sole discretion.
              </p>
            </div>
          </div>

          <!-- Repeat Infringer Policy -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Repeat Infringer Policy</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                In accordance with the DMCA and other applicable law, we have adopted a policy of terminating, in appropriate circumstances and at our sole discretion, users who are deemed to be repeat infringers. We may also at our sole discretion limit access to the Site and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
              </p>
            </div>
          </div>

          <!-- Modifications to this Policy -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Modifications to this Policy</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We reserve the right to modify the provisions of this DMCA Policy at any time. Any changes will be effective immediately upon posting on the Site. Your continued use of the Site after any such changes constitutes your acceptance of the new DMCA Policy.
              </p>
            </div>
          </div>

          <!-- Contact Us -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Contact Us</h2>
            <p class="text-gray-700 leading-relaxed">
              If you have any questions about this DMCA Policy, please contact us at:
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
                <span class="text-gray-700"><strong>Address:</strong> New York City, 432 Park Ave, 10th Floor.</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span class="text-gray-700"><strong>Website:</strong> gobackseatextender.us</span>
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
            Questions About Copyright?
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            We're committed to protecting intellectual property rights. If you have questions about our DMCA policy or need to report copyright infringement, we're here to help.
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
    ul, ol {
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
export class DmcaComponent implements OnInit, OnDestroy {
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
  selector: 'app-dmca',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            DMCA Policy
          </h1>
          <p class="text-lg text-gray-700 leading-relaxed mb-4">
            Effective Date: July 29, 2025
          </p>
          <p class="text-lg text-gray-700 leading-relaxed">
            GoBackSeatExtender respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (DMCA), the text of which may be found on the U.S. Copyright Office website at http://www.copyright.gov/legislation/dmca.pdf, we will respond expeditiously to claims of copyright infringement committed using the GoBackSeatExtender service and/or website, if such claims are reported to our Designated Copyright Agent identified below.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto space-y-12">
          
          <!-- Notification of Copyright Infringement -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Notification of Copyright Infringement (DMCA Takedown Notice)</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                If you are a copyright owner, or are authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the Site by completing the following DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent.
              </p>
              <p>
                Upon receipt of the Notice as described below, we will take whatever action, in our sole discretion, we deem appropriate, including removal of the challenged content from the Site.
              </p>
            </div>
          </div>

          <!-- Requirements for a Valid DMCA Takedown Notice -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Requirements for a Valid DMCA Takedown Notice</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                To be effective, the Notification must be a written communication that includes substantially the following:
              </p>
              <div class="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
                <ul class="list-decimal list-inside space-y-3 ml-4">
                  <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                  <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site. This could include, for example, a photograph of a dog product, a unique product description, or a user-submitted video featuring a pet.</li>
                  <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material. Providing URLs is the best way to help us locate content quickly.</li>
                  <li>Information reasonably sufficient to permit us to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</li>
                  <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                  <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Designated Copyright Agent -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Designated Copyright Agent</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our Designated Copyright Agent to receive Notifications of Claimed Infringement can be contacted as follows:
              </p>
              <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span class="text-gray-700"><strong>Name of Agent:</strong> gobackseatextender.us</span>
                </div>
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span class="text-gray-700"><strong>Email:</strong> gobackseat&#64;gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Counter-Notification -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Counter-Notification</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a Counter-Notification containing the following information to the Designated Copyright Agent:
              </p>
              <div class="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-400">
                <ul class="list-decimal list-inside space-y-3 ml-4">
                  <li>Your physical or electronic signature.</li>
                  <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled.</li>
                  <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content.</li>
                  <li>Your name, address, telephone number, and email address, and a statement that you consent to the jurisdiction of the federal court in New York, New York, and a statement that you will accept service of process from the person who provided notification of the alleged infringement.</li>
                </ul>
              </div>
              <p class="mt-4">
                Upon receipt of a valid Counter-Notification, we will send a copy of the Counter-Notification to the original complaining party informing that person that we may replace the removed content or cease disabling it in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, member, or user, the removed content may be replaced, or access to it restored, in 10 to 14 business days or more after receipt of the Counter-Notification, at our sole discretion.
              </p>
            </div>
          </div>

          <!-- Repeat Infringer Policy -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Repeat Infringer Policy</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                In accordance with the DMCA and other applicable law, we have adopted a policy of terminating, in appropriate circumstances and at our sole discretion, users who are deemed to be repeat infringers. We may also at our sole discretion limit access to the Site and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
              </p>
            </div>
          </div>

          <!-- Modifications to this Policy -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Modifications to this Policy</h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We reserve the right to modify the provisions of this DMCA Policy at any time. Any changes will be effective immediately upon posting on the Site. Your continued use of the Site after any such changes constitutes your acceptance of the new DMCA Policy.
              </p>
            </div>
          </div>

          <!-- Contact Us -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">Contact Us</h2>
            <p class="text-gray-700 leading-relaxed">
              If you have any questions about this DMCA Policy, please contact us at:
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
                <span class="text-gray-700"><strong>Address:</strong> New York City, 432 Park Ave, 10th Floor.</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span class="text-gray-700"><strong>Website:</strong> gobackseatextender.us</span>
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
            Questions About Copyright?
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            We're committed to protecting intellectual property rights. If you have questions about our DMCA policy or need to report copyright infringement, we're here to help.
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
    ul, ol {
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
export class DmcaComponent implements OnInit, OnDestroy {
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
 