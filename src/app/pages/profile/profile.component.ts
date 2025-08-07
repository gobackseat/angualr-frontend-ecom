import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { OrderService } from '../../services/order.service';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    newsletter: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrderSummary {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  favoriteCategory?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
          <p class="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>

        <!-- Success/Error Messages -->
        <div *ngIf="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-12">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-orange-500 hover:bg-orange-400 transition ease-in-out duration-150 cursor-not-allowed">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>

        <!-- Profile Content -->
        <div *ngIf="!isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Profile Information -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Personal Information -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Personal Information</h2>
                <p class="mt-1 text-sm text-gray-500">Update your personal details and contact information.</p>
              </div>
              <div class="px-6 py-4">
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                      <input 
                        type="text" 
                        id="firstName"
                        formControlName="firstName"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      >
                      <div *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched" class="mt-1 text-sm text-red-600">
                        First name is required
                      </div>
                    </div>
                    
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                      <input 
                        type="text" 
                        id="lastName"
                        formControlName="lastName"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      >
                      <div *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched" class="mt-1 text-sm text-red-600">
                        Last name is required
                      </div>
                    </div>
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      formControlName="email"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                    <div *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" class="mt-1 text-sm text-red-600">
                      Please enter a valid email address
                    </div>
                  </div>

                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone"
                      formControlName="phone"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input 
                        type="date" 
                        id="dateOfBirth"
                        formControlName="dateOfBirth"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      >
                    </div>
                    
                    <div>
                      <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                      <select 
                        id="gender"
                        formControlName="gender"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div class="pt-4">
                    <button 
                      type="submit"
                      [disabled]="profileForm.invalid || isUpdating"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {{ isUpdating ? 'Updating...' : 'Update Profile' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Address Information -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Shipping Address</h2>
                <p class="mt-1 text-sm text-gray-500">Your default shipping address for orders.</p>
              </div>
              <div class="px-6 py-4">
                <form [formGroup]="addressForm" (ngSubmit)="updateAddress()" class="space-y-6">
                  <div>
                    <label for="street" class="block text-sm font-medium text-gray-700">Street Address</label>
                    <input 
                      type="text" 
                      id="street"
                      formControlName="street"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                      <input 
                        type="text" 
                        id="city"
                        formControlName="city"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      >
                    </div>
                    
                    <div>
                      <label for="state" class="block text-sm font-medium text-gray-700">State</label>
                      <input 
                        type="text" 
                        id="state"
                        formControlName="state"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      >
                    </div>
                    
                    <div>
                      <label for="zipCode" class="block text-sm font-medium text-gray-700">ZIP Code</label>
                      <input 
                        type="text" 
                        id="zipCode"
                        formControlName="zipCode"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      >
                    </div>
                  </div>

                  <div>
                    <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                    <input 
                      type="text" 
                      id="country"
                      formControlName="country"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                  </div>

                  <div class="pt-4">
                    <button 
                      type="submit"
                      [disabled]="addressForm.invalid || isUpdating"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {{ isUpdating ? 'Updating...' : 'Update Address' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Password Change -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Change Password</h2>
                <p class="mt-1 text-sm text-gray-500">Update your password to keep your account secure.</p>
              </div>
              <div class="px-6 py-4">
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-6">
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
                    <input 
                      type="password" 
                      id="currentPassword"
                      formControlName="currentPassword"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                  </div>

                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                    <input 
                      type="password" 
                      id="newPassword"
                      formControlName="newPassword"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                    <div *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched" class="mt-1 text-sm text-red-600">
                      Password must be at least 8 characters long
                    </div>
                  </div>

                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input 
                      type="password" 
                      id="confirmPassword"
                      formControlName="confirmPassword"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                    <div *ngIf="passwordForm.errors?.['passwordMismatch'] && passwordForm.get('confirmPassword')?.touched" class="mt-1 text-sm text-red-600">
                      Passwords do not match
                    </div>
                  </div>

                  <div class="pt-4">
                    <button 
                      type="submit"
                      [disabled]="passwordForm.invalid || isUpdating"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {{ isUpdating ? 'Updating...' : 'Change Password' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Account Summary -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Account Summary</h2>
              </div>
              <div class="px-6 py-4 space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ userProfile?.firstName }} {{ userProfile?.lastName }}</p>
                    <p class="text-sm text-gray-500">{{ userProfile?.email }}</p>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <p class="text-xs text-gray-500">Member since {{ formatDate(userProfile?.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Quick Stats</h2>
              </div>
              <div class="px-6 py-4 space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Total Orders</span>
                  <span class="text-sm font-medium text-gray-900">{{ orderSummary.totalOrders }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Total Spent</span>
                  <span class="text-sm font-medium text-gray-900">{{ formatPrice(orderSummary.totalSpent) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Cart Items</span>
                  <span class="text-sm font-medium text-gray-900">{{ cartCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Wishlist Items</span>
                  <span class="text-sm font-medium text-gray-900">{{ wishlistCount }}</span>
                </div>
              </div>
            </div>

            <!-- Preferences -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Preferences</h2>
              </div>
              <div class="px-6 py-4 space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p class="text-xs text-gray-500">Order updates and tracking</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="preferences.emailNotifications" (change)="updatePreferences()" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">SMS Notifications</p>
                    <p class="text-xs text-gray-500">Delivery updates</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="preferences.smsNotifications" (change)="updatePreferences()" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Marketing Emails</p>
                    <p class="text-xs text-gray-500">Promotions and offers</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="preferences.marketingEmails" (change)="updatePreferences()" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div class="px-6 py-4 space-y-3">
                <a routerLink="/orders" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-900">View Orders</span>
                </a>
                
                <a routerLink="/wishlist" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-900">My Wishlist</span>
                </a>
                
                <button (click)="logout()" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left">
                  <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span class="text-sm font-medium text-red-600">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  orderSummary: OrderSummary = {
    totalOrders: 0,
    totalSpent: 0
  };
  preferences = {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    newsletter: true
  };
  
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  passwordForm!: FormGroup;
  
  isLoading = false;
  isUpdating = false;
  errorMessage = '';
  successMessage = '';
  cartCount = 0;
  wishlistCount = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProfile();
      this.loadStats();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dateOfBirth: [''],
      gender: ['']
    });

    this.addressForm = this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  loadProfile() {
    this.isLoading = true;
    this.clearMessages();

    // Get current user data from auth service
    const currentUser = this.authService.currentUser;
    
    if (currentUser) {
      // Fetch detailed profile from backend
      this.authService.getProfile().pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (userData) => {
          this.userProfile = {
            _id: userData.id || currentUser.id,
            firstName: userData.firstName || currentUser.firstName,
            lastName: userData.lastName || currentUser.lastName,
            email: userData.email || currentUser.email,
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || undefined,
            address: userData.address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            preferences: {
              emailNotifications: userData.preferences?.emailNotifications ?? true,
              smsNotifications: userData.preferences?.smsNotifications ?? false,
              marketingEmails: userData.preferences?.marketingEmails ?? true,
              newsletter: userData.preferences?.newsletter ?? true
            },
            createdAt: userData.createdAt || '',
            updatedAt: userData.updatedAt || ''
          };

          this.populateForms();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load profile:', error);
          // Fallback to current user data
          this.userProfile = {
            _id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            phone: '',
            dateOfBirth: '',
            gender: undefined,
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            preferences: {
              emailNotifications: true,
              smsNotifications: false,
              marketingEmails: true,
              newsletter: true
            },
            createdAt: '',
            updatedAt: ''
          };

          this.populateForms();
          this.isLoading = false;
        }
      });
    } else {
      // No user logged in, redirect to login
      this.router.navigate(['/login']);
    }
  }

  loadStats() {
    // Subscribe to cart count
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe(cart => {
      this.cartCount = cart.totalItems;
      this.cdr.detectChanges();
    });

    // Subscribe to wishlist count
    this.wishlistService.wishlist$.pipe(takeUntil(this.destroy$)).subscribe(wishlist => {
      this.wishlistCount = wishlist.totalItems;
      this.cdr.detectChanges();
    });

    // Load real order summary
    this.orderService.getUserOrders(1, 100).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.orders && response.orders.length > 0) {
          const orders = response.orders;
          const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
          const lastOrder = orders.length > 0 ? orders[0] : null;
          
          this.orderSummary = {
            totalOrders: orders.length,
            totalSpent: totalSpent,
            lastOrderDate: lastOrder?.createdAt,
            favoriteCategory: 'Dog Accessories' // Could be calculated from order items
          };
        } else {
          // Fallback to default values if no orders
          this.orderSummary = {
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: undefined,
            favoriteCategory: undefined
          };
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load order summary:', error);
        // Fallback to default values on error
        this.orderSummary = {
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: undefined,
          favoriteCategory: undefined
        };
        this.cdr.detectChanges();
      }
    });
  }

  private populateForms() {
    if (this.userProfile) {
      this.profileForm.patchValue({
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName,
        email: this.userProfile.email,
        phone: this.userProfile.phone || '',
        dateOfBirth: this.userProfile.dateOfBirth || '',
        gender: this.userProfile.gender || ''
      });

      if (this.userProfile.address) {
        this.addressForm.patchValue({
          street: this.userProfile.address.street,
          city: this.userProfile.address.city,
          state: this.userProfile.address.state,
          zipCode: this.userProfile.address.zipCode,
          country: this.userProfile.address.country
        });
      }

      if (this.userProfile.preferences) {
        this.preferences = { ...this.userProfile.preferences };
      }
    }
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      this.clearMessages();

      const profileData = this.profileForm.value;
      
      this.authService.updateProfile(profileData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          if (response.status === 'success' && response.data?.user) {
            const user = response.data.user;
            this.userProfile = {
              _id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone || '',
              dateOfBirth: user.dateOfBirth || '',
              gender: user.gender,
              address: user.address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
              },
              preferences: {
                emailNotifications: user.preferences?.emailNotifications ?? true,
                smsNotifications: user.preferences?.smsNotifications ?? false,
                marketingEmails: user.preferences?.marketingEmails ?? true,
                newsletter: user.preferences?.newsletter ?? true
              },
              createdAt: user.createdAt || '',
              updatedAt: user.updatedAt || new Date().toISOString()
            };
            this.successMessage = 'Profile updated successfully';
          }
          this.isUpdating = false;
        },
        error: (error) => {
          console.error('Failed to update profile:', error);
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
          this.isUpdating = false;
        }
      });
    }
  }

  updateAddress() {
    if (this.addressForm.valid) {
      this.isUpdating = true;
      this.clearMessages();

      const addressData = this.addressForm.value;
      
      // Simulate API call
      setTimeout(() => {
        this.userProfile = {
          ...this.userProfile!,
          address: addressData,
          updatedAt: new Date().toISOString()
        };
        
        this.successMessage = 'Address updated successfully';
        this.isUpdating = false;
      }, 1000);
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.isUpdating = true;
      this.clearMessages();

      const passwordData = this.passwordForm.value;
      
      this.authService.changePassword(passwordData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.passwordForm.reset();
            this.successMessage = 'Password changed successfully';
          }
          this.isUpdating = false;
        },
        error: (error) => {
          console.error('Failed to change password:', error);
          this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
          this.isUpdating = false;
        }
      });
    }
  }

  updatePreferences() {
    // Simulate API call
    setTimeout(() => {
      this.successMessage = 'Preferences updated successfully';
    }, 500);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
} 