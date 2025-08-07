import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isAdmin: boolean;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: {
    url: string;
    filename: string;
  };
  addresses?: any[];
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  wishlist?: any[];
  preferences?: {
    newsletter: boolean;
    marketing: boolean;
    sms: boolean;
    language: string;
    currency: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    marketingEmails?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data?: {
    user: User;
    rememberMe?: boolean;
  };
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  acceptTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
  code: string;
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  password?: string; // For verification
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'E_COMMERCE_TOKEN';
  private readonly USER_KEY = 'userInfo';
  private readonly REMEMBER_ME_KEY = 'rememberMe';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuth();
  }

  // Initialize authentication state from storage
  private initializeAuth(): void {
    // Only run on browser platform
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userInfo = localStorage.getItem(this.USER_KEY);
      const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY);

      if (token && userInfo) {
        const user = JSON.parse(userInfo);
        this.setAuthState(user, token, rememberMe === 'true');
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.clearAuthState();
    }
  }

  // Set authentication state
  private setAuthState(user: User, token: string, rememberMe: boolean = false): void {
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
    this.isAuthenticatedSubject.next(true);

    // Store in localStorage only on browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.REMEMBER_ME_KEY, String(rememberMe));

      // Set cookie
      this.setCookie('token', token, rememberMe ? 30 : 1);
    }
  }

  // Clear authentication state
  private clearAuthState(): void {
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Clear storage only on browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REMEMBER_ME_KEY);

      // Clear cookie
      this.removeCookie('token');
    }
  }

  // Set cookie
  private setCookie(name: string, value: string, days: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure=${location.protocol === 'https:'};samesite=strict`;
  }

  // Remove cookie
  private removeCookie(name: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Get current user
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current token
  get currentToken(): string | null {
    return this.tokenSubject.value;
  }

  // Check if user is authenticated
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Check if user is admin
  get isAdmin(): boolean {
    return this.currentUser?.isAdmin || false;
  }

  // Check if email is verified
  get isEmailVerified(): boolean {
    return this.currentUser?.isEmailVerified || false;
  }

  // Get auth headers
  getAuthHeaders(): HttpHeaders {
    const token = this.currentToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Test backend connectivity
  testBackendConnection(): Observable<any> {
    return this.http.get(`${this.API_URL.replace('/api', '')}/health`);
  }

  // Register new user
  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/signup`, userData).pipe(
      tap(response => {
        if (response.status === 'success' && response.data?.user && response.token) {
          this.setAuthState(response.data.user, response.token, false);
          this.setLoading(false);
        }
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Login user
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/signin`, credentials).pipe(
      tap(response => {
        if (response.status === 'success' && response.data?.user && response.token) {
          this.setAuthState(
            response.data.user, 
            response.token, 
            response.data.rememberMe || false
          );
          this.setLoading(false);
        }
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Logout user
  logout(): Observable<any> {
    // Clear local state immediately to prevent infinite loops
    this.clearAuthState();
    
    // Try to call logout endpoint, but don't fail if it doesn't work
    return this.http.post(`${this.API_URL}/auth/logout`, {}, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        // Success - already cleared state above
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        // Even if logout fails, we already cleared local state
        // Don't redirect again to prevent loops
        console.log('Logout endpoint failed, but local state cleared');
        return of({ success: true });
      })
    );
  }

  // Logout from all devices
  logoutAll(): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/logout-all`, {}, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        this.clearAuthState();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.clearAuthState();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  // Get user profile
  getProfile(): Observable<User> {
    return this.http.get<{ status: string; data: { user: User } }>(`${this.API_URL}/auth/me`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data.user),
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }),
      catchError(error => {
        if (error.status === 401) {
          this.clearAuthState();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Update profile
  updateProfile(profileData: ProfileUpdateRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.put<AuthResponse>(`${this.API_URL}/auth/update-profile`, profileData, { headers: this.getAuthHeaders() }).pipe(
      tap(response => {
        if (response.status === 'success' && response.data?.user) {
          this.currentUserSubject.next(response.data.user);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
          this.setLoading(false);
        }
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Change password
  changePassword(passwordData: ChangePasswordRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/change-password`, passwordData, { headers: this.getAuthHeaders() }).pipe(
      tap(response => {
        if (response.status === 'success') {
          // Password change requires re-login
          this.clearAuthState();
          this.router.navigate(['/login'], { queryParams: { message: 'Password changed successfully. Please login again.' } });
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Forgot password
  forgotPassword(email: string): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/forgot-password`, { email }).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Reset password
  resetPassword(resetData: PasswordResetConfirmRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/reset-password`, resetData).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Verify email
  verifyEmail(verificationData: EmailVerificationRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/verify-email`, verificationData).pipe(
      tap(response => {
        if (response.status === 'success') {
          // Update user verification status
          const currentUser = this.currentUser;
          if (currentUser) {
            currentUser.isEmailVerified = true;
            this.currentUserSubject.next(currentUser);
            localStorage.setItem(this.USER_KEY, JSON.stringify(currentUser));
          }
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        this.setError(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Resend verification email
  resendVerification(email: string): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/resend-verification`, { email }).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Refresh token (if needed)
  refreshToken(): Observable<any> {
    // This would typically call a refresh endpoint
    // For now, we'll just return the current token
    return of({ token: this.currentToken });
  }

  // Check if token is valid
  isTokenValid(): boolean {
    const token = this.currentToken;
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Auto-refresh token if needed
  autoRefreshToken(): Observable<boolean> {
    if (!this.isTokenValid()) {
      this.clearAuthState();
      this.router.navigate(['/login']);
      return of(false);
    }
    return of(true);
  }

  // Set loading state
  private setLoading(loading: boolean): void {
    this.isLoadingSubject.next(loading);
  }

  // Set error
  private setError(error: string): void {
    this.errorSubject.next(error);
  }

  // Clear error
  private clearError(): void {
    this.errorSubject.next(null);
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): string {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        // Map backend error messages to user-friendly messages
        const backendMessage = error.error.message;
        const userFriendlyMessages: { [key: string]: string } = {
          'You must accept the terms and conditions to register': 'Please accept the terms and conditions to continue.',
          'An account with this email already exists': 'An account with this email already exists. Please try signing in instead.',
          'Please enter a valid email address': 'Please enter a valid email address.',
          'Password must be at least 8 characters with uppercase, lowercase, number, and special character': 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
          'Too many signup attempts. Please try again later.': 'Too many signup attempts. Please wait a few minutes and try again.',
          'Please fill in all required fields': 'Please fill in all required fields.',
          'Invalid email or password': 'Invalid email or password. Please check your credentials and try again.',
          'Email not verified': 'Please verify your email address before signing in.',
          'Account locked': 'Your account has been locked due to multiple failed login attempts. Please contact support.',
          'Password reset token expired': 'Password reset link has expired. Please request a new one.',
          'Email verification code expired': 'Email verification code has expired. Please request a new one.',
          'Invalid verification code': 'Invalid verification code. Please check your email and try again.'
        };
        
        errorMessage = userFriendlyMessages[backendMessage] || backendMessage;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Your session has expired. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    }

    return errorMessage;
  }

  // Update user data (for when user data changes from other services)
  updateUserData(userData: Partial<User>): void {
    const currentUser = this.currentUser;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
  }

  // Check if user exists (for registration)
  checkUserExists(email: string): Observable<boolean> {
    // This would typically call an endpoint to check if user exists
    // For now, we'll return false to allow registration
    return of(false);
  }

  // Validate password strength
  validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (password.length > 128) {
      return { valid: false, message: 'Password is too long (maximum 128 characters)' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!hasLowerCase) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!hasNumber) {
      return { valid: false, message: 'Password must contain at least one number' };
    }

    return { valid: true };
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 
 
 