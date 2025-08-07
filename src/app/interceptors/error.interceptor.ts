import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

// Functional interceptor for error handling
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error && typeof error.error === 'object' && 'message' in error.error) {
        // Client-side error (check for message property instead of ErrorEvent)
        errorMessage = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad request';
            break;
          case 401:
            errorMessage = 'Unauthorized access';
            break;
          case 403:
            errorMessage = 'Access forbidden';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict occurred';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation failed';
            break;
          case 429:
            errorMessage = 'Too many requests. Please try again later.';
            break;
          case 500:
            errorMessage = 'Internal server error';
            break;
          case 502:
            errorMessage = 'Bad gateway';
            break;
          case 503:
            errorMessage = 'Service unavailable';
            break;
          case 504:
            errorMessage = 'Gateway timeout';
            break;
          default:
            errorMessage = error.error?.message || 'An unexpected error occurred';
        }
      }

      // Log error for debugging
      console.error('HTTP Error:', {
        url: request.url,
        method: request.method,
        status: error.status,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });

      return throwError(() => error);
    })
  );
}; 