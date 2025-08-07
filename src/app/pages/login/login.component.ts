import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Welcome back! Sign in to continue
          </p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <!-- Email Field -->
          <div>
            <input
              type="email"
              formControlName="email"
              placeholder="Email"
              class="w-full px-4 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none text-lg"
              [class]="isFieldInvalid('email') ? 'border-red-500' : ''">
            <div *ngIf="isFieldInvalid('email')" class="text-red-600 text-sm mt-1">
              Please enter a valid email address
            </div>
          </div>
          
          <!-- Password Field -->
          <div class="relative">
            <input
              [type]="showPassword ? 'text' : 'password'"
              formControlName="password"
              placeholder="Password"
              class="w-full px-4 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none text-lg pr-12"
              autocomplete="current-password"
              [class]="isFieldInvalid('password') ? 'border-red-500' : ''">
            <button
              type="button"
              (click)="togglePasswordVisibility()"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
            <div *ngIf="isFieldInvalid('password')" class="text-red-600 text-sm mt-1">
              Password is required
            </div>
          </div>
          
          <!-- Remember Me Checkbox -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                formControlName="rememberMe"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
              <label for="rememberMe" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a routerLink="/forgot-password" class="font-medium text-orange-600 hover:text-orange-500">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <!-- Error Message -->
          <div *ngIf="errorMessage" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {{ errorMessage }}
          </div>
          
          <!-- Success Message -->
          <div *ngIf="successMessage" class="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
            {{ successMessage }}
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold text-lg transition-colors duration-200 shadow-md disabled:opacity-60">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
        
        <!-- Register Link -->
        <div class="mt-6 text-sm text-orange-700">
          Don't have an account? 
          <button
            (click)="goToRegister()"
            class="text-orange-600 hover:text-orange-800 underline">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cdr.detectChanges();
      
      // Check for success message from query params
      this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
        if (params['message']) {
          this.successMessage = params['message'];
        }
      });

      // Subscribe to auth service observables
      this.authService.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
        this.isLoading = loading;
        this.cdr.detectChanges();
      });

      this.authService.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
        this.errorMessage = error || '';
        this.cdr.detectChanges();
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.successMessage = '';

      const loginData: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
        rememberMe: this.loginForm.get('rememberMe')?.value
      };

      this.authService.login(loginData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            // Redirect to profile page
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.message || 'Login failed. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
} 