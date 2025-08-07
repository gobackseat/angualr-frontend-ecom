import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, EmailVerificationRequest } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-orange-600 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p class="mt-2 text-sm text-gray-600">
            We've sent a verification code to your email address
          </p>
        </div>

        <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form [formGroup]="verificationForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Display -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div class="relative">
                <input
                  type="email"
                  [value]="email"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Verification Code -->
            <div>
              <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div class="relative">
                <input
                  id="code"
                  type="text"
                  formControlName="code"
                  placeholder="Enter 6-digit code"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  [class.border-red-500]="verificationForm.get('code')?.invalid && verificationForm.get('code')?.touched"
                >
                <div *ngIf="verificationForm.get('code')?.invalid && verificationForm.get('code')?.touched" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div *ngIf="verificationForm.get('code')?.invalid && verificationForm.get('code')?.touched" class="mt-1 text-sm text-red-600">
                Please enter a valid 6-digit verification code
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">{{ successMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                [disabled]="verificationForm.invalid || isSubmitting"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg *ngIf="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Verifying...' : 'Verify Email' }}
              </button>
            </div>

            <!-- Resend Code -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Didn't receive the code?
                <button
                  type="button"
                  (click)="resendCode()"
                  [disabled]="isResending"
                  class="font-medium text-orange-600 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isResending ? 'Sending...' : 'Resend Code' }}
                </button>
              </p>
            </div>
          </form>
        </div>

        <!-- Back to Login -->
        <div class="text-center">
          <button
            type="button"
            (click)="goToLogin()"
            class="text-sm font-medium text-orange-600 hover:text-orange-500"
          >
            ← Back to Login
          </button>
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
export class VerifyEmailComponent implements OnInit, OnDestroy {
  verificationForm: FormGroup;
  email: string = '';
  isSubmitting = false;
  isResending = false;
  errorMessage = '';
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit() {
    // Get email from route params or query params
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.email = params['email'] || '';
    });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });

    // If no email provided, redirect to login
    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.verificationForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    const request: EmailVerificationRequest = {
      email: this.email,
      code: this.verificationForm.get('code')?.value
    };

    this.authService.verifyEmail(request).subscribe({
      next: () => {
        this.successMessage = 'Email verified successfully! Redirecting to login...';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Failed to verify email. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  resendCode() {
    this.isResending = true;
    this.clearMessages();

    this.authService.resendVerification(this.email).subscribe({
      next: () => {
        this.successMessage = 'Verification code sent successfully!';
        this.isResending = false;
        setTimeout(() => {
          this.clearMessages();
        }, 5000);
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Failed to resend code. Please try again.';
        this.isResending = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
} 