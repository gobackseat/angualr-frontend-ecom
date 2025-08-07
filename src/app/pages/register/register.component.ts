import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Join us and get the best deals for your pet
          </p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                formControlName="firstName"
                placeholder="First Name"
                class="w-full px-4 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none text-lg"
                [class]="isFieldInvalid('firstName') ? 'border-red-500' : ''">
              <div *ngIf="isFieldInvalid('firstName')" class="text-red-600 text-sm mt-1">
                First name is required
              </div>
            </div>
            <div>
              <input
                type="text"
                formControlName="lastName"
                placeholder="Last Name"
                class="w-full px-4 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none text-lg"
                [class]="isFieldInvalid('lastName') ? 'border-red-500' : ''">
              <div *ngIf="isFieldInvalid('lastName')" class="text-red-600 text-sm mt-1">
                Last name is required
              </div>
            </div>
          </div>
          
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
              autocomplete="new-password"
              [class]="isFieldInvalid('password') ? 'border-red-500' : ''">
            <button
              type="button"
              (click)="togglePasswordVisibility()"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
            <div *ngIf="isFieldInvalid('password')" class="text-red-600 text-sm mt-1">
              {{ getPasswordError() }}
            </div>
          </div>
          
          <!-- Password Strength Indicator -->
          <div *ngIf="registerForm.get('password')?.value" class="mt-2">
            <div class="flex space-x-1">
              <div class="flex-1 h-2 rounded-full"
                   [class]="getPasswordStrength() >= 1 ? 'bg-red-500' : 'bg-gray-200'"></div>
              <div class="flex-1 h-2 rounded-full"
                   [class]="getPasswordStrength() >= 2 ? 'bg-yellow-500' : 'bg-gray-200'"></div>
              <div class="flex-1 h-2 rounded-full"
                   [class]="getPasswordStrength() >= 3 ? 'bg-green-500' : 'bg-gray-200'"></div>
              <div class="flex-1 h-2 rounded-full"
                   [class]="getPasswordStrength() >= 4 ? 'bg-green-600' : 'bg-gray-200'"></div>
            </div>
            <p class="text-xs mt-1" [class]="getPasswordStrengthColor()">
              {{ getPasswordStrengthText() }}
            </p>
          </div>
          
          <!-- Confirm Password Field -->
          <div class="relative">
            <input
              [type]="showConfirmPassword ? 'text' : 'password'"
              formControlName="confirmPassword"
              placeholder="Confirm Password"
              class="w-full px-4 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none text-lg pr-12"
              autocomplete="new-password"
              [class]="isFieldInvalid('confirmPassword') ? 'border-red-500' : ''">
            <button
              type="button"
              (click)="toggleConfirmPasswordVisibility()"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
            <div *ngIf="isFieldInvalid('confirmPassword')" class="text-red-600 text-sm mt-1">
              Passwords do not match
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start space-x-3">
            <input
              type="checkbox"
              formControlName="acceptTerms"
              id="acceptTerms"
              class="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
            <label for="acceptTerms" class="text-sm text-gray-700">
              I agree to the 
              <a href="/terms" target="_blank" class="text-orange-600 hover:text-orange-800 underline">Terms of Service</a> 
              and 
              <a href="/privacy" target="_blank" class="text-orange-600 hover:text-orange-800 underline">Privacy Policy</a>
            </label>
          </div>
          <div *ngIf="isFieldInvalid('acceptTerms')" class="text-red-600 text-sm mt-1">
            You must accept the terms and conditions to register
          </div>
          
          <!-- Error Message -->
          <div *ngIf="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {{ error }}
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="registerForm.invalid || loading"
            class="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold text-lg transition-colors duration-200 shadow-md disabled:opacity-60">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        
        <!-- Login Link -->
        <div class="mt-6 text-sm text-orange-700">
          Already have an account? 
          <button
            (click)="goToLogin()"
            class="text-orange-600 hover:text-orange-800 underline">
            Sign In
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator.bind(this) });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formData = this.registerForm.value;

    this.authService.register(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          // Redirect to homepage with welcome message
          this.router.navigate(['/'], { 
            queryParams: { 
              message: 'Welcome! Your account has been created successfully.' 
            } 
          });
        },
        error: (error) => {
          this.loading = false;
          // Improved error message handling
          if (error.error && error.error.message) {
            this.error = this.getUserFriendlyMessage(error.error.message);
          } else if (error.message) {
            this.error = this.getUserFriendlyMessage(error.message);
          } else {
            this.error = 'Registration failed. Please try again.';
          }
        }
      });
  }

  getUserFriendlyMessage(message: string): string {
    const errorMessages: { [key: string]: string } = {
      'You must accept the terms and conditions to register': 'Please accept the terms and conditions to continue.',
      'An account with this email already exists': 'An account with this email already exists. Please try signing in instead.',
      'Please enter a valid email address': 'Please enter a valid email address.',
      'Password must be at least 8 characters with uppercase, lowercase, number, and special character': 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      'Too many signup attempts. Please try again later.': 'Too many signup attempts. Please wait a few minutes and try again.',
      'Please fill in all required fields': 'Please fill in all required fields.'
    };
    
    return errorMessages[message] || message;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return { passwordRequirements: true };
    }

    return null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  getPasswordError(): string {
    const password = this.registerForm.get('password');
    if (!password || !password.errors) return '';
    
    if (password.errors['required']) return 'Password is required';
    if (password.errors['passwordRequirements']) return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    
    return '';
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return Math.min(strength, 4);
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return 'text-red-600';
      case 1: return 'text-red-500';
      case 2: return 'text-yellow-600';
      case 3: return 'text-green-600';
      case 4: return 'text-green-700';
      default: return 'text-gray-600';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 