import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-16 bg-orange-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Dog's Car Experience?
        </h2>
        <p class="text-xl text-orange-100 mb-8">
          Join thousands of happy customers and give your furry friend the journey they deserve.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            routerLink="/product-detail"
            class="bg-white text-orange-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200 font-semibold">
            Shop Now
          </button>
          <button 
            routerLink="/contact"
            class="border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-orange-600 transition-colors duration-200 font-semibold">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class CtaSectionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 