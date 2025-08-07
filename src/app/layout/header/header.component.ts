import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartSidebarService } from '../../services/cart-sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header 
      [class]="headerClasses"
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <!-- Top bar with contact info -->
      <div class="bg-orange-600 text-white py-2 px-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>+1 (555) 123-4567</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>support&#64;dogbackseat.com</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Mon-Fri 9AM-6PM</span>
            </div>
            <div class="flex items-center space-x-4">
              <a href="#" class="hover:text-orange-200 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="hover:text-orange-200 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="hover:text-orange-200 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Main header -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="relative">
                <img 
                  src="assets/img/logo.png" 
                  alt="Dog Backseat Extender" 
                  class="h-8 w-auto"
                  (error)="onImageError($event)"
                />
                <!-- Fallback text if image fails to load -->
                <div #logoFallback class="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm" style="display: none;">
                  DB
                </div>
              </div>
              <span class="text-xl font-bold text-gray-900">DogBackseat</span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a
              routerLink="/"
              routerLinkActive="!text-orange-600 !bg-orange-50"
              [routerLinkActiveOptions]="{exact: true}"
              class="px-2 py-1.5 rounded-lg font-medium transition-all duration-300 relative group text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              Home
            </a>
            <a
              routerLink="/"
              fragment="product"
              class="px-2 py-1.5 rounded-lg font-medium transition-all duration-300 relative group text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              Products
            </a>
            <a
              routerLink="/our-story"
              routerLinkActive="!text-orange-600 !bg-orange-50"
              class="px-2 py-1.5 rounded-lg font-medium transition-all duration-300 relative group text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              About
            </a>
            <a
              routerLink="/contact"
              routerLinkActive="!text-orange-600 !bg-orange-50"
              class="px-2 py-1.5 rounded-lg font-medium transition-all duration-300 relative group text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              Contact
            </a>
            <a
              routerLink="/blogs"
              routerLinkActive="!text-orange-600 !bg-orange-50"
              class="px-2 py-1.5 rounded-lg font-medium transition-all duration-300 relative group text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              Blog
            </a>
          </nav>

          <!-- Search, Cart, User -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <button
                (click)="toggleSearch()"
                class="p-2 rounded-lg transition-all duration-300 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
              
              <div *ngIf="isSearchOpen" class="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <form (ngSubmit)="handleSearch()" class="flex items-center space-x-2">
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    name="searchQuery"
                    placeholder="Search products..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            <!-- Wishlist -->
            <a
              routerLink="/wishlist"
              class="relative p-2 rounded-lg transition-all duration-300 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span *ngIf="wishlistItemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ wishlistItemCount }}
              </span>
            </a>

            <!-- Cart -->
            <button
              (click)="openCart()"
              class="relative p-2 rounded-lg transition-all duration-300 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span *ngIf="cartItemCount > 0" class="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartItemCount }}
              </span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <div *ngIf="authService.isAuthenticated; else loginButton">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span class="hidden sm:block">{{ authService.currentUser?.firstName || 'User' }}</span>
                  <svg class="w-4 h-4 transition-transform duration-200" [class.rotate-180]="showUserMenu" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- User Dropdown -->
                <div *ngIf="showUserMenu" class="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <a
                    routerLink="/profile"
                    (click)="closeUserMenu()"
                    class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Profile</span>
                  </a>
                  <a
                    routerLink="/orders"
                    (click)="closeUserMenu()"
                    class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    <span>Orders</span>
                  </a>
                  <a
                    routerLink="/wishlist"
                    (click)="closeUserMenu()"
                    class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span>Wishlist</span>
                  </a>
                  <a
                    routerLink="/profile"
                    (click)="closeUserMenu()"
                    class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Settings</span>
                  </a>
                  <button
                    (click)="logout()"
                    class="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              <ng-template #loginButton>
                <a
                  routerLink="/login"
                  class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 bg-orange-600 text-white hover:bg-orange-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Sign In</span>
                </a>
              </ng-template>
            </div>

            <!-- Mobile menu button -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              <svg *ngIf="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <svg *ngIf="isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div *ngIf="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-4 py-2 space-y-1">
          <a
            routerLink="/"
            routerLinkActive="!text-orange-600 !bg-orange-50"
            [routerLinkActiveOptions]="{exact: true}"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            (click)="closeMobileMenu()"
          >
            Home
          </a>
          <a
            routerLink="/"
            fragment="product"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            (click)="closeMobileMenu()"
          >
            Products
          </a>
          <a
            routerLink="/our-story"
            routerLinkActive="!text-orange-600 !bg-orange-50"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            (click)="closeMobileMenu()"
          >
            About
          </a>
          <a
            routerLink="/contact"
            routerLinkActive="!text-orange-600 !bg-orange-50"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            (click)="closeMobileMenu()"
          >
            Contact
          </a>
          <a
            routerLink="/blogs"
            routerLinkActive="!text-orange-600 !bg-orange-50"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            (click)="closeMobileMenu()"
          >
            Blog
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    /* Ensure smooth transitions */
    .user-menu .absolute {
      opacity: 0;
      transform: scale(0.95);
      pointer-events: none;
    }
    
    .user-menu .absolute.opacity-100 {
      opacity: 1;
      transform: scale(1);
      pointer-events: all;
    }
    
    /* Force transparency when not scrolled */
    header.bg-transparent {
      background: transparent !important;
      background-color: transparent !important;
    }
    
    header.bg-transparent nav {
      background: transparent !important;
      background-color: transparent !important;
    }
    
    /* Ensure no default backgrounds */
    header nav {
      background: transparent;
    }
    
    /* Remove any potential white space */
    header.bg-transparent * {
      background: transparent;
    }
    
    /* Remove any potential spacing issues */
    header.bg-transparent {
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* Ensure nav has no background or spacing issues */
    header.bg-transparent nav {
      background: transparent !important;
      background-color: transparent !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('logoFallback') logoFallback!: ElementRef;
  isScrolled = false;
  isAuthenticated = false;
  currentUser: any = null;
  showUserMenu = false;
  showMobileMenu = false;
  isSearchOpen = false;
  searchQuery = '';
  isMobileMenuOpen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    public authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private cartSidebarService: CartSidebarService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initial header style update
      this.updateHeaderStyle();
      
      // Subscribe to authentication state
      this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      });
      
      // Subscribe to current user
      this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateHeaderStyle();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.showUserMenu = false;
    }
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // Close mobile menu on window resize
    if (isPlatformBrowser(this.platformId) && window.innerWidth >= 768) {
      this.showMobileMenu = false;
    }
  }

  private updateHeaderStyle() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
        // Match ReactJS threshold of 10px
        this.isScrolled = scrollPosition > 10;
      } catch (error) {
        console.warn('Failed to get scroll position:', error);
        this.isScrolled = false;
      }
    }
  }

  get headerClasses(): string {
    return this.isScrolled 
      ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
      : 'bg-white/90 backdrop-blur-sm';
  }

  get navClasses(): string {
    return 'bg-transparent'; // Nav always transparent
  }

  get logoTextClass(): string {
    return this.isScrolled 
      ? 'text-gray-900' 
      : 'text-white drop-shadow-lg';
  }

  get navLinkClass(): string {
    return this.isScrolled 
      ? 'text-gray-700 hover:text-orange-600' 
      : 'text-white hover:text-orange-300 drop-shadow-md';
  }

  get iconClass(): string {
    return this.isScrolled 
      ? 'text-gray-700 hover:text-orange-600' 
      : 'text-white hover:text-orange-300 drop-shadow-md';
  }

  get mobileNavClass(): string {
    return this.isScrolled 
      ? 'text-gray-700 hover:text-orange-600 hover:bg-gray-50' 
      : 'text-white hover:text-orange-300 hover:bg-white/10';
  }

  get mobileBorderClass(): string {
    return this.isScrolled 
      ? 'border-gray-200' 
      : 'border-white/20';
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    // Close mobile menu if open
    if (this.showUserMenu) {
      this.showMobileMenu = false;
    }
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  handleSearch(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
    this.isSearchOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.showUserMenu = false;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  openCart() {
    this.cartSidebarService.openSidebar();
  }

  get cartItemCount(): number {
    return this.cartService.itemCount;
  }

  get wishlistItemCount(): number {
    return this.wishlistService.itemCount;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    if (this.logoFallback) {
      (this.logoFallback.nativeElement as HTMLElement).style.display = 'flex';
    }
  }
}