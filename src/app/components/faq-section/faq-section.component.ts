import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p class="text-lg text-gray-600">
            Everything you need to know about our dog backseat extenders
          </p>
        </div>
        
        <div class="space-y-4">
          <div *ngFor="let faq of faqs" class="border border-gray-200 rounded-lg">
            <button 
              (click)="toggleFaq(faq.id)"
              class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
              <span class="font-medium text-gray-900">{{ faq.question }}</span>
              <svg 
                [class]="faq.isOpen ? 'rotate-180' : ''"
                class="w-5 h-5 text-gray-500 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div *ngIf="faq.isOpen" class="px-6 pb-4">
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class FaqSectionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  faqs = [
    {
      id: 1,
      question: "What vehicles are compatible with your backseat extender?",
      answer: "Our backseat extender is designed to fit 95% of vehicles including sedans, SUVs, trucks, and hatchbacks. It features adjustable straps and universal mounting system for maximum compatibility.",
      isOpen: false
    },
    {
      id: 2,
      question: "How long does installation take?",
      answer: "Installation typically takes 3-5 minutes and requires no tools. Simply unfold the extender, position it on your backseat, and secure the straps around your headrests.",
      isOpen: false
    },
    {
      id: 3,
      question: "Is the material waterproof and easy to clean?",
      answer: "Yes! Our backseat extender features waterproof, stain-resistant fabric that can be easily wiped clean or machine washed. The material is durable and designed to withstand daily use.",
      isOpen: false
    },
    {
      id: 4,
      question: "What's included in the package?",
      answer: "Each package includes the backseat extender, adjustable safety straps, installation instructions, and a storage bag for easy transport when not in use.",
      isOpen: false
    },
    {
      id: 5,
      question: "Do you offer a warranty?",
      answer: "Yes, we offer a 30-day money-back guarantee and a 1-year warranty against manufacturing defects. We stand behind the quality of our products.",
      isOpen: false
    }
  ];

  constructor() {}

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFaq(id: number) {
    const faq = this.faqs.find(f => f.id === id);
    if (faq) {
      faq.isOpen = !faq.isOpen;
    }
  }
} 