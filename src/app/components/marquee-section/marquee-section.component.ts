import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marquee-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-4 bg-white overflow-hidden flex items-center justify-center">
      <div class="w-full space-y-2">
        <!-- First Marquee - Green Band -->
        <div class="bg-green-500 text-white py-4 overflow-hidden">
          <div class="marquee-container">
            <div class="marquee-content">
              ✨ PREMIUM QUALITY • 🚗 EASY INSTALLATION • 🐕 PET SAFE • 🛡️ 2-YEAR WARRANTY • 🚚 FREE SHIPPING • ⭐ 4.9/5 RATING
              ✨ PREMIUM QUALITY • 🚗 EASY INSTALLATION • 🐕 PET SAFE • 🛡️ 2-YEAR WARRANTY • 🚚 FREE SHIPPING • ⭐ 4.9/5 RATING
            </div>
          </div>
        </div>
        
        <!-- Second Marquee - Purple Band -->
        <div class="bg-purple-500 text-white py-4 overflow-hidden">
          <div class="marquee-container reverse">
            <div class="marquee-content">
              🎯 PERFECT FIT • 🔒 SECURE DESIGN • 🧽 EASY CLEAN • 💪 DURABLE MATERIAL • 🎨 MULTIPLE COLORS • 📱 24/7 SUPPORT
              🎯 PERFECT FIT • 🔒 SECURE DESIGN • 🧽 EASY CLEAN • 💪 DURABLE MATERIAL • 🎨 MULTIPLE COLORS • 📱 24/7 SUPPORT
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .marquee-container {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
    }
    
    .marquee-content {
      display: inline-block;
      animation: marquee 30s linear infinite;
      font-weight: 600;
      font-size: 0.875rem;
      letter-spacing: 0.025em;
    }
    
    .marquee-container.reverse .marquee-content {
      animation: marquee-reverse 30s linear infinite;
    }
    
    @keyframes marquee {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
    
    @keyframes marquee-reverse {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .marquee-content {
        font-size: 0.75rem;
      }
    }
    
    @media (max-width: 480px) {
      .marquee-content {
        font-size: 0.7rem;
      }
    }
  `]
})
export class MarqueeSectionComponent implements OnInit, OnDestroy {
  
  constructor() {}

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
} 