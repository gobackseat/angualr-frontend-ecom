import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface TimelineItem {
  id: number;
  title: string;
  value: string;
  description: string;
  category: string;
  icon: string;
  relatedIds: number[];
  status: 'feature' | 'spec' | 'included';
  energy: number;
}

@Component({
  selector: 'app-radial-orbital-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-8 h-8 bg-orange-400/20 rounded-full animate-pulse"></div>
        <div class="absolute top-20 right-20 w-12 h-12 bg-amber-400/20 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-orange-200/50">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Product Features</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
            Interactive Product Map
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore all the features and specifications of our premium dog backseat extender
          </p>
        </div>

        <!-- Interactive Timeline -->
        <div 
          #timelineContainer
          class="relative w-full h-96 md:h-[700px] flex flex-col items-center justify-center bg-transparent overflow-hidden"
          (click)="handleContainerClick($event)">
          
          <!-- Central Hub -->
          <div class="absolute w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 animate-pulse flex items-center justify-center z-20 shadow-2xl">
            <div class="absolute w-24 h-24 rounded-full border-2 border-orange-300/30 animate-ping opacity-70"></div>
            <div class="absolute w-28 h-28 rounded-full border border-orange-200/20 animate-ping opacity-50" style="animation-delay: 0.5s;"></div>
            <div class="absolute w-32 h-32 rounded-full border border-orange-100/10 animate-ping opacity-30" style="animation-delay: 1s;"></div>
            <div class="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
          </div>

          <!-- Orbital Rings -->
          <div class="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-orange-200/20"></div>
          <div class="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-orange-100/10"></div>

          <!-- Timeline Nodes -->
          <div 
            *ngFor="let item of timelineData; let index = index"
            [style.transform]="getNodeTransform(index)"
            [style.z-index]="getNodeZIndex(item.id)"
            [style.opacity]="getNodeOpacity(index)"
            class="absolute transition-all duration-700 cursor-pointer"
            (click)="toggleItem(item.id, $event)"
            (mouseenter)="setHoveredNode(item.id)"
            (mouseleave)="setHoveredNode(null)">
            
            <!-- Glow Effect -->
            <div 
              class="absolute rounded-full -inset-2 transition-all duration-500"
              [class.animate-pulse]="isPulsing(item.id) || isHovered(item.id)"
              [style.background]="'radial-gradient(circle, rgba(249,115,22,' + (isExpanded(item.id) ? '0.4' : '0.2') + ') 0%, rgba(249,115,22,0) 70%)'"
              [style.width]="(item.energy * 0.6 + 50) * (isHovered(item.id) ? 1.2 : 1) + 'px'"
              [style.height]="(item.energy * 0.6 + 50) * (isHovered(item.id) ? 1.2 : 1) + 'px'"
              [style.left]="'-' + ((item.energy * 0.6 + 50) * (isHovered(item.id) ? 1.2 : 1) - 50) / 2 + 'px'"
              [style.top]="'-' + ((item.energy * 0.6 + 50) * (isHovered(item.id) ? 1.2 : 1) - 50) / 2 + 'px'">
            </div>

            <!-- Node Circle -->
            <div 
              class="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center relative overflow-hidden border-3 transition-all duration-300 transform backdrop-blur-sm"
              [class]="getNodeClasses(item.id)">
              
              <!-- Category Indicator Ring -->
              <div class="absolute inset-0 rounded-full opacity-10" [class]="'bg-gradient-to-br ' + getCategoryColor(item.category)"></div>
              
              <!-- Icon -->
              <div class="relative z-10">
                <svg *ngIf="item.icon === 'scale'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <svg *ngIf="item.icon === 'shield'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <svg *ngIf="item.icon === 'safety'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg *ngIf="item.icon === 'zap'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <svg *ngIf="item.icon === 'package'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                <svg *ngIf="item.icon === 'heart'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <svg *ngIf="item.icon === 'clips'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <svg *ngIf="item.icon === 'clock'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <svg *ngIf="item.icon === 'ruler'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h1.75L17.81 6.94l-1.75-1.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </div>

              <!-- Energy Level Indicator -->
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-b-full opacity-60" [style.width]="item.energy + '%'"></div>
            </div>

            <!-- Node Label -->
            <div 
              class="absolute top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold tracking-wider px-2 py-1 rounded-lg transition-all duration-300 backdrop-blur-sm"
              [class]="getLabelClasses(item.id)">
              {{ item.title }}
            </div>
          </div>
        </div>

        <!-- Expanded Cards -->
        <div 
          *ngFor="let item of getExpandedItems()"
          class="fixed w-80 bg-white/98 backdrop-blur-xl border border-orange-200/50 shadow-2xl shadow-orange-500/20 overflow-hidden rounded-2xl z-[9999]"
          [style.left]="getCardPosition(item.id).left + 'px'"
          [style.top]="getCardPosition(item.id).top + 'px'">
          
          <!-- Card Header -->
          <div class="bg-gradient-to-r p-4" [class]="getCategoryColor(item.category)">
            <div class="flex justify-between items-center mb-2">
              <div class="px-3 py-1 text-sm font-bold rounded" [class]="getStatusStyles(item.status)">
                {{ item.status === 'feature' ? 'FEATURE' : item.status === 'spec' ? 'SPECIFICATION' : 'INCLUDED' }}
              </div>
              <span class="text-white/90 font-mono text-lg font-bold bg-black/20 px-2 py-1 rounded">
                {{ item.value }}
              </span>
            </div>
            <h3 class="text-xl font-bold text-white mb-1">{{ item.title }}</h3>
            <div class="text-white/80 text-sm font-medium">{{ item.category }}</div>
          </div>

          <!-- Card Content -->
          <div class="p-6 text-gray-700">
            <p class="text-base leading-relaxed mb-6">{{ item.description }}</p>
            
            <!-- Quality Level -->
            <div class="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/30">
              <div class="flex justify-between items-center text-sm mb-2">
                <span class="flex items-center font-semibold text-orange-700">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Quality Level
                </span>
                <span class="font-bold text-orange-600 text-lg">{{ item.energy }}%</span>
              </div>
              <div class="w-full h-2 bg-orange-200/30 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000" [style.width]="item.energy + '%'"></div>
              </div>
            </div>

            <!-- Related Features -->
            <div *ngIf="item.relatedIds.length > 0" class="pt-4 border-t border-orange-200/30">
              <div class="flex items-center mb-3">
                <svg class="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
                <h4 class="text-sm uppercase tracking-wider font-bold text-orange-700">
                  Related Features
                </h4>
              </div>
              <div class="flex flex-wrap gap-2">
                <button 
                  *ngFor="let relatedId of item.relatedIds"
                  class="flex items-center h-8 px-3 py-1 text-xs font-medium rounded-lg border-orange-300/40 bg-orange-50/50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 transition-all hover:scale-105"
                  (click)="toggleItem(relatedId, $event)">
                  {{ getItemById(relatedId)?.title }}
                  <svg class="w-3 h-3 ml-2 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Animated background elements */
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-ping {
      animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
    
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    /* Gradient text */
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .w-14.h-14 {
        width: 3rem;
        height: 3rem;
      }
      
      .w-12.h-12 {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  `]
})
export class RadialOrbitalTimelineComponent implements OnInit, OnDestroy {
  @ViewChild('timelineContainer', { static: true }) timelineContainer!: ElementRef;

  expandedItems: Record<number, boolean> = {};
  rotationAngle = 0;
  autoRotate = true;
  pulseEffect: Record<number, boolean> = {};
  activeNodeId: number | null = null;
  hoveredNodeId: number | null = null;
  private rotationTimer: any;
  isLoaded = false;

  // Timeline data
  timelineData: TimelineItem[] = [
    {
      id: 1,
      title: "Weight",
      value: "2.5 lbs",
      description: "Lightweight design for easy handling and installation. Made from premium materials that are both durable and portable.",
      category: "Physical",
      icon: "scale",
      relatedIds: [2, 5],
      status: "spec",
      energy: 85
    },
    {
      id: 2,
      title: "Material",
      value: "Premium Leather",
      description: "High-quality waterproof leather that resists stains and odors. Easy to clean and maintains its appearance over time.",
      category: "Quality",
      icon: "shield",
      relatedIds: [1, 5],
      status: "feature",
      energy: 95
    },
    {
      id: 3,
      title: "Safety Rating",
      value: "5-Star",
      description: "Crash-tested and certified for maximum safety. Meets all industry standards for pet travel safety.",
      category: "Safety",
      icon: "safety",
      relatedIds: [8, 9],
      status: "feature",
      energy: 100
    },
    {
      id: 4,
      title: "Installation",
      value: "5 Minutes",
      description: "Tool-free installation that takes just 5 minutes. Universal fit for 95% of vehicle models.",
      category: "Convenience",
      icon: "zap",
      relatedIds: [9, 10],
      status: "feature",
      energy: 90
    },
    {
      id: 5,
      title: "Durability",
      value: "10+ Years",
      description: "Built to last with reinforced stitching and tear-resistant materials. Backed by our lifetime warranty.",
      category: "Quality",
      icon: "shield",
      relatedIds: [1, 2],
      status: "feature",
      energy: 95
    },
    {
      id: 6,
      title: "Backseat Extender",
      value: "Included",
      description: "Main backseat extender that creates a stable surface across your rear seat, preventing your dog from slipping.",
      category: "Included",
      icon: "package",
      relatedIds: [7, 8],
      status: "included",
      energy: 100
    },
    {
      id: 7,
      title: "Door Covers",
      value: "Included",
      description: "Protective door covers that prevent scratches and keep your car interior clean during travel.",
      category: "Included",
      icon: "heart",
      relatedIds: [6, 8],
      status: "included",
      energy: 85
    },
    {
      id: 8,
      title: "Safety Belts",
      value: "Included",
      description: "Adjustable safety belts that secure your dog safely during travel and prevent movement.",
      category: "Safety",
      icon: "shield",
      relatedIds: [3, 6],
      status: "included",
      energy: 100
    },
    {
      id: 9,
      title: "Installation Clips",
      value: "Included",
      description: "Universal installation clips that work with most vehicle seat configurations and headrest designs.",
      category: "Convenience",
      icon: "clips",
      relatedIds: [4, 10],
      status: "included",
      energy: 90
    },
    {
      id: 10,
      title: "Installation Guide",
      value: "Digital",
      description: "Step-by-step video guide and written instructions for easy installation and setup.",
      category: "Convenience",
      icon: "clock",
      relatedIds: [4, 9],
      status: "included",
      energy: 85
    },
    {
      id: 11,
      title: "Storage Bag",
      value: "Included",
      description: "Convenient storage bag for easy transport and organization when not in use.",
      category: "Included",
      icon: "package",
      relatedIds: [6, 7],
      status: "included",
      energy: 80
    },
    {
      id: 12,
      title: "Dimensions",
      value: "22\" x 54\"",
      description: "Perfect size to fit most vehicle backseats while providing maximum coverage and protection.",
      category: "Physical",
      icon: "ruler",
      relatedIds: [1, 6],
      status: "spec",
      energy: 90
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoaded = true;
      this.cdr.detectChanges();
      this.startAutoRotation();
      this.onResize();
    }
  }

  ngOnDestroy() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
  }

  @HostListener('window:resize')
  onResize() {
    // Handle responsive adjustments
  }

  startAutoRotation() {
    if (isPlatformBrowser(this.platformId)) {
      this.rotationTimer = setInterval(() => {
        if (this.autoRotate) {
          this.rotationAngle = (this.rotationAngle + 0.2) % 360;
        }
      }, 50);
    }
  }

  getNodeTransform(index: number): string {
    if (!isPlatformBrowser(this.platformId)) {
      return 'translate(0px, 0px)';
    }
    
    const angle = ((index / this.timelineData.length) * 360 + this.rotationAngle) % 360;
    const radius = Math.min(window.innerWidth * 0.25, 220);
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    return `translate(${x}px, ${y}px)`;
  }

  getNodeZIndex(itemId: number): number {
    return this.isExpanded(itemId) ? 300 : 100;
  }

  getNodeOpacity(index: number): number {
    const angle = ((index / this.timelineData.length) * 360 + this.rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    return Math.max(0.6, Math.min(1, 0.6 + 0.4 * ((1 + Math.sin(radian)) / 2)));
  }

  getNodeClasses(itemId: number): string {
    if (this.isExpanded(itemId)) {
      return 'bg-gradient-to-br from-orange-600 to-amber-600 text-white scale-125 border-orange-400 shadow-2xl shadow-orange-500/40';
    } else if (this.isRelatedToActive(itemId)) {
      return 'bg-gradient-to-br from-orange-500/80 to-amber-500/80 text-white scale-110 border-orange-400 animate-pulse shadow-xl shadow-orange-400/30';
    } else if (this.isHovered(itemId)) {
      return 'bg-gradient-to-br from-white to-orange-50 text-orange-600 scale-110 border-orange-400 shadow-xl shadow-orange-300/40';
    } else {
      return 'bg-white text-orange-600 border-orange-300/50 shadow-lg shadow-orange-200/30';
    }
  }

  getLabelClasses(itemId: number): string {
    if (this.isExpanded(itemId)) {
      return 'text-orange-800 bg-white/90 scale-110 shadow-lg';
    } else if (this.isHovered(itemId)) {
      return 'text-orange-700 bg-white/80 scale-105 shadow-md';
    } else {
      return 'text-orange-600/80 bg-white/60';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case "Physical": return "from-blue-500 to-cyan-500";
      case "Quality": return "from-orange-500 to-amber-500";
      case "Safety": return "from-red-500 to-pink-500";
      case "Convenience": return "from-green-500 to-emerald-500";
      case "Included": return "from-purple-500 to-violet-500";
      default: return "from-gray-500 to-gray-600";
    }
  }

  getStatusStyles(status: TimelineItem['status']): string {
    switch (status) {
      case "feature": return "text-white bg-gradient-to-br from-orange-600 to-amber-600 border-orange-500 shadow-lg shadow-orange-500/30";
      case "spec": return "text-orange-600 bg-white border-orange-600 shadow-lg shadow-orange-300/30";
      case "included": return "text-white bg-gradient-to-br from-green-600 to-emerald-600 border-green-500 shadow-lg shadow-green-500/30";
      default: return "text-white bg-orange-600/40 border-orange-500/50";
    }
  }

  toggleItem(id: number, event: Event) {
    event.stopPropagation();
    
    this.expandedItems = { ...this.expandedItems };
    Object.keys(this.expandedItems).forEach(key => {
      if (parseInt(key) !== id) {
        this.expandedItems[parseInt(key)] = false;
      }
    });

    this.expandedItems[id] = !this.expandedItems[id];

    if (!this.expandedItems[id]) {
      this.activeNodeId = id;
      this.autoRotate = false;
      this.pulseEffect = {};
      const relatedItems = this.getRelatedItems(id);
      relatedItems.forEach(relId => {
        this.pulseEffect[relId] = true;
      });
    } else {
      this.activeNodeId = null;
      this.autoRotate = true;
      this.pulseEffect = {};
    }
  }

  handleContainerClick(event: Event) {
    if (event.target === this.timelineContainer.nativeElement) {
      this.expandedItems = {};
      this.activeNodeId = null;
      this.pulseEffect = {};
      this.autoRotate = true;
    }
  }

  setHoveredNode(id: number | null) {
    this.hoveredNodeId = id;
  }

  isExpanded(id: number): boolean {
    return this.expandedItems[id] || false;
  }

  isHovered(id: number): boolean {
    return this.hoveredNodeId === id;
  }

  isPulsing(id: number): boolean {
    return this.pulseEffect[id] || false;
  }

  isRelatedToActive(id: number): boolean {
    if (!this.activeNodeId) return false;
    const relatedItems = this.getRelatedItems(this.activeNodeId);
    return relatedItems.includes(id);
  }

  getRelatedItems(itemId: number): number[] {
    const currentItem = this.timelineData.find(item => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  }

  getExpandedItems(): TimelineItem[] {
    return this.timelineData.filter(item => this.isExpanded(item.id));
  }

  getItemById(id: number): TimelineItem | undefined {
    return this.timelineData.find(item => item.id === id);
  }

  getCardPosition(itemId: number): { left: number; top: number } {
    const containerRect = this.timelineContainer.nativeElement.getBoundingClientRect();
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const cardWidth = 320;
    const cardHeight = 400;
    
    let left = containerRect.left + containerRect.width / 2;
    let top = containerRect.top + containerRect.height / 2 + 100;
    
    if (left + cardWidth > containerWidth - 40) {
      left = containerWidth - cardWidth - 40;
    }
    if (left < 40) {
      left = 40;
    }
    if (top + cardHeight > containerHeight - 40) {
      top = containerRect.top + containerRect.height / 2 - cardHeight - 20;
    }
    if (top < 40) {
      top = 40;
    }
    
    return { left, top };
  }
} 
 
 