import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

export interface InstallationStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoId: string;
  thumbnail: string;
}

@Component({
  selector: 'app-installation-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Floating paw prints -->
        <div class="absolute top-20 left-10 w-12 h-12 opacity-8 animate-bounce">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-orange-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="absolute bottom-20 left-1/4 w-16 h-16 opacity-8 animate-pulse" style="animation-delay: 1s;">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-yellow-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <!-- Animated blurred circles -->
        <div class="absolute top-1/4 left-1/3 w-48 h-48 bg-orange-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/3 w-32 h-32 bg-amber-400/15 rounded-full blur-xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <!-- Header Section -->
        <div class="text-center mb-16">
          <!-- Header Badge -->
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-orange-200/50">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>Step-by-Step Installation</span>
          </div>

          <!-- Main Title -->
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
            Installation Guide
          </h2>

          <!-- Subtitle -->
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow our comprehensive video guide to install your dog backseat extender in just 5 simple steps. 
            Each video is designed to make installation quick and hassle-free.
          </p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-200/30 shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">5 Steps</h3>
            <p class="text-gray-600">Complete installation process</p>
          </div>
          
          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-200/30 shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">9 Minutes</h3>
            <p class="text-gray-600">Total installation time</p>
          </div>
          
          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-200/30 shadow-lg">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">100% Safe</h3>
            <p class="text-gray-600">Tested and verified</p>
          </div>
        </div>

        <!-- Interactive Video Tabs -->
        <div class="relative w-full">
          <!-- Video Caption -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-lg text-orange-700 px-6 py-3 rounded-full text-lg font-medium shadow-lg border border-orange-200/50">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Click any step to watch the video</span>
            </div>
          </div>

          <!-- Interactive Grid Layout -->
          <div 
            class="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 h-96 md:h-[700px] w-full"
            [style.grid-template-columns]="getGridTemplateColumns()"
            style="transition: grid-template-columns 0.3s ease-out">
            
            <div 
              *ngFor="let step of installationSteps; let index = index"
              class="relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl"
              (mouseenter)="setHoveredTab(index)"
              (mouseleave)="setHoveredTab(null)"
              (click)="handleTabClick(step)"
              [style.transform]="hoveredTab === index ? 'scale(1.02)' : 'scale(1)'"
              style="transition: transform 0.2s ease-out">
              
              <!-- Background Image -->
              <div class="absolute inset-0">
                <img
                  [src]="step.thumbnail"
                  [alt]="step.title"
                  class="w-full h-full object-cover transition-all duration-200"
                  [style.filter]="hoveredTab === index ? 'brightness(0.4)' : 'brightness(0.6)'"
                  (error)="onImageError($event, step)"
                  (load)="onImageLoad($event, step)">
              </div>

              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

              <!-- Overlay Content -->
              <div class="absolute inset-0 flex flex-col justify-between p-6">
                <!-- Top Section - Step Number & Play Button -->
                <div class="flex justify-between items-start">
                  <div class="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {{ step.id }}
                  </div>
                  <div 
                    *ngIf="hoveredTab === index"
                    class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center shadow-2xl"
                    style="animation: fadeIn 0.3s ease-out">
                    <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                <!-- Bottom Section - Text Content -->
                <div class="text-white">
                  <h3 
                    class="font-bold mb-3 transition-all duration-400"
                    [style.font-size]="hoveredTab === index ? '1.75rem' : '1.25rem'"
                    [style.opacity]="hoveredTab === index ? 1 : 0.95"
                    [style.line-height]="hoveredTab === index ? '1.3' : '1.4'">
                    {{ step.title }}
                  </h3>
                  
                  <div 
                    *ngIf="hoveredTab === index"
                    class="space-y-4"
                    style="animation: slideUp 0.2s ease-out">
                    <p class="text-orange-200 text-base leading-relaxed">
                      {{ step.description }}
                    </p>
                    <div class="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                      <svg class="w-5 h-5 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span class="text-orange-300 text-base font-medium">
                        {{ step.duration }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subtle border glow on hover -->
              <div 
                *ngIf="hoveredTab === index"
                class="absolute inset-0 rounded-2xl ring-2 ring-orange-400/50 pointer-events-none">
              </div>
            </div>
          </div>
        </div>

        <!-- Installation Tips -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/30 shadow-lg">
            <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold">1</span>
              </div>
              Before Installation
            </h3>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-start gap-3">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Ensure your vehicle is parked on a level surface</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Remove any items from your backseat area</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Have all components ready before starting</span>
              </li>
            </ul>
          </div>
          
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/30 shadow-lg">
            <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold">2</span>
              </div>
              After Installation
            </h3>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-start gap-3">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Test the stability by gently pushing on the extender</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Ensure your pet is comfortable with the setup</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Make any necessary adjustments for optimal fit</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- YouTube Modal -->
    <div 
      *ngIf="isModalOpen" 
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      (click)="closeModal($event)">
      <div class="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <button 
          class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          (click)="closeModal($event)">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        <iframe 
          *ngIf="selectedVideo"
          [src]="getYouTubeEmbedUrl(selectedVideo)"
          class="w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </div>
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
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Gradient text */
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }
    
         /* Responsive adjustments */
     @media (max-width: 768px) {
       .grid {
         grid-template-columns: 1fr !important;
       }
     }
  `]
})
export class InstallationGuideComponent implements OnInit, OnDestroy {
  hoveredTab: number | null = null;
  selectedVideo: string | null = null;
  isModalOpen = false;
  isLoaded = false; // New property to track component load

  // Installation steps data
  installationSteps: InstallationStep[] = [
    {
      id: 1,
      title: "Unpack & Inspect",
      description: "Remove all components from the box and ensure everything is included. Check for any damage.",
      duration: "1 min",
      videoId: "k3E3nMEw92M",
      thumbnail: "/assets/temp-repo/img/installation-guide/1st-video-img.webp"
    },
    {
      id: 2,
      title: "Position the Extender",
      description: "Place the backseat extender between your front and back seats to create a flat surface.",
      duration: "2 min",
      videoId: "FQTFOMdbGDg",
      thumbnail: "/assets/temp-repo/img/installation-guide/2nd-video-img.webp"
    },
    {
      id: 3,
      title: "Secure the Straps",
      description: "Attach the adjustable straps to your vehicle's seat anchors for maximum stability.",
      duration: "3 min",
      videoId: "2xiSicMH2Fk",
      thumbnail: "/assets/temp-repo/img/installation-guide/3rd video img.webp"
    },
    {
      id: 4,
      title: "Install Door Covers",
      description: "Attach the protective door covers to prevent scratches and protect your vehicle's interior.",
      duration: "2 min",
      videoId: "ubY0TlU4foY",
      thumbnail: "/assets/temp-repo/img/installation-guide/4th video img.webp"
    },
    {
      id: 5,
      title: "Test & Adjust",
      description: "Test the installation with your pet and make final adjustments for optimal comfort and safety.",
      duration: "1 min",
      videoId: "_Blz9wKkOeE",
      thumbnail: "/assets/temp-repo/img/installation-guide/5th video img.webp"
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoaded = true;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  setHoveredTab(index: number | null) {
    this.hoveredTab = index;
  }

  handleTabClick(step: InstallationStep) {
    this.selectedVideo = step.videoId;
    this.isModalOpen = true;
  }

  closeModal(event: Event) {
    event.stopPropagation();
    this.isModalOpen = false;
    this.selectedVideo = null;
  }

  getGridTemplateColumns(): string {
    if (this.hoveredTab !== null) {
      const columns = this.installationSteps.map((_, index) => 
        index === this.hoveredTab ? '3fr' : '0.8fr'
      );
      return columns.join(' ');
    }
    return 'repeat(5, 1fr)';
  }

  getYouTubeEmbedUrl(videoId: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onImageError(event: Event, step: InstallationStep) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  onImageLoad(event: Event, step: InstallationStep) {
    // Image loaded successfully
  }
} 
 
 