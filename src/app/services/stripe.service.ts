import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';

// Official Stripe types
declare global {
  interface Window {
    Stripe: any;
  }
}

export interface PaymentIntentRequest {
  orderItems: any[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  shippingAddress?: any;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  customerId?: string;
}

export interface PaymentResult {
  paymentIntentId: string;
  status: string;
  amount: number;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private readonly API_URL: string;
  private stripe: any;
  private elements: any;
  private cardElement: any;

  constructor(
    private http: HttpClient,
    private envService: EnvironmentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.API_URL = this.envService.apiUrl;
    this.initializeStripe();
  }

  /**
   * Initialize Stripe using official ES module approach
   */
  private async initializeStripe(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      // Load Stripe.js from CDN (official approach)
      await this.loadStripeScript();
      
      const publishableKey = this.envService.stripePublishableKey;
      if (!publishableKey) {
        throw new Error('Stripe publishable key not found');
      }

      // Initialize Stripe with official configuration
      this.stripe = (window as any).Stripe(publishableKey, {
        apiVersion: '2023-10-16'
      });

      console.log('Stripe initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  /**
   * Load Stripe.js script (official approach)
   */
  private loadStripeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Stripe) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Stripe.js'));
      
      document.head.appendChild(script);
    });
  }

  /**
   * Create payment intent for guest checkout
   */
  createGuestPaymentIntent(request: PaymentIntentRequest): Observable<PaymentIntentResponse> {
    return this.http.post<any>(`${this.API_URL}/stripe/guest/payment-intent`, request)
      .pipe(
        map(response => {
          console.log('StripeService: Backend response:', response);
          
          // Extract data from the backend response structure
          if (response.success && response.data) {
            return {
              clientSecret: response.data.clientSecret,
              paymentIntentId: response.data.paymentIntentId,
              amount: response.data.amount,
              currency: response.data.currency,
              customerId: response.data.customerId
            };
          } else {
            throw new Error('Invalid response format from backend');
          }
        }),
        catchError(error => {
          console.error('Failed to create payment intent:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Create payment intent for authenticated users
   */
  createAuthenticatedPaymentIntent(orderId: string): Observable<PaymentIntentResponse> {
    return this.http.post<any>(`${this.API_URL}/stripe/authenticated/payment-intent/${orderId}`, {})
      .pipe(
        map(response => {
          console.log('StripeService: Backend response (authenticated):', response);
          
          // Extract data from the backend response structure
          if (response.success && response.data) {
            return {
              clientSecret: response.data.clientSecret,
              paymentIntentId: response.data.paymentIntentId,
              amount: response.data.amount,
              currency: response.data.currency,
              customerId: response.data.customerId
            };
          } else {
            throw new Error('Invalid response format from backend');
          }
        }),
        catchError(error => {
          console.error('Failed to create authenticated payment intent:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Create Stripe Elements card element (official approach)
   */
  createCardElement(containerId: string): Observable<void> {
    return new Observable(observer => {
      if (!isPlatformBrowser(this.platformId)) {
        observer.error(new Error('Stripe Elements can only be used in browser environment'));
        return;
      }

      if (!this.stripe) {
        observer.error(new Error('Stripe not initialized'));
        return;
      }

      const container = document.getElementById(containerId);
      if (!container) {
        observer.error(new Error(`Container with id '${containerId}' not found`));
        return;
      }

      try {
        // Create elements instance
        this.elements = this.stripe.elements();

        // Create card element with official styling
        this.cardElement = this.elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        });

        // Mount the card element
        this.cardElement.mount(`#${containerId}`);
        
        // Set up error handling
        this.cardElement.on('change', (event: any) => {
          const displayError = document.getElementById('card-errors');
          if (displayError) {
            if (event.error) {
              displayError.textContent = event.error.message;
              displayError.style.display = 'block';
            } else {
              displayError.textContent = '';
              displayError.style.display = 'none';
            }
          }
        });

        console.log('Stripe card element created successfully');
        observer.next();
        observer.complete();

      } catch (error) {
        console.error('Error creating card element:', error);
        observer.error(error);
      }
    });
  }

  /**
   * Process payment with card element (official approach)
   */
  processPaymentWithCard(clientSecret: string): Observable<PaymentResult> {
    console.log('StripeService: Processing payment with card...');
    console.log('StripeService: Client secret received:', clientSecret);
    console.log('StripeService: Client secret type:', typeof clientSecret);
    console.log('StripeService: Client secret length:', clientSecret?.length);
    console.log('StripeService: Card element exists:', !!this.cardElement);
    console.log('StripeService: Stripe instance exists:', !!this.stripe);
    
    if (!this.cardElement) {
      return throwError(() => new Error('Card element not initialized'));
    }

    if (!clientSecret || typeof clientSecret !== 'string') {
      return throwError(() => new Error('Invalid client secret provided to Stripe'));
    }

    return from(this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.cardElement,
      }
    })).pipe(
      map((result: any) => {
        console.log('StripeService: Payment confirmation result:', result);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        return {
          paymentIntentId: result.paymentIntent.id,
          status: result.paymentIntent.status,
          amount: result.paymentIntent.amount,
          currency: result.paymentIntent.currency
        };
      }),
      catchError(error => {
        console.error('StripeService: Payment processing error:', error);
        return throwError(() => new Error(error.message || 'Payment processing failed'));
      })
    );
  }

  /**
   * Check if card element is ready
   */
  isCardElementReady(): boolean {
    return !!(this.cardElement && typeof this.cardElement.mount === 'function');
  }

  /**
   * Clear card element
   */
  clearCardElement(): void {
    if (this.cardElement) {
      this.cardElement.clear();
    }
  }

  /**
   * Destroy card element
   */
  destroyCardElement(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Check if Stripe is available
   */
  isStripeAvailable(): boolean {
    return !!(this.stripe && this.cardElement);
  }

  /**
   * Get Stripe instance
   */
  getStripe(): any {
    return this.stripe;
  }
} 