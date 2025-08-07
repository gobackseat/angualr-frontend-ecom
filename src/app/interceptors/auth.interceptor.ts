import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// Functional interceptor for authentication
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Add auth token to request if available
  const token = authService.currentToken;
  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 errors for auth-related endpoints, not for cart/wishlist
      if (error.status === 401) {
        // For auth endpoints, redirect to login
        if (request.url.includes('/auth/') && !request.url.includes('/auth/logout')) {
          authService.logout().subscribe(() => {
            router.navigate(['/login']);
          });
        }
        // For other endpoints, just return the error without logging out
        // This allows guest operations to work properly
      }
      return throwError(() => error);
    })
  );
};

// Helper functions
function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
} 
 
 