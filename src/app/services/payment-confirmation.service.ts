import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer, of } from 'rxjs';
import { switchMap, retryWhen, take, delay, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface PaymentConfirmationResult {
  success: boolean;
  orderId: string;
  paymentStatus: 'confirmed' | 'pending' | 'failed';
  orderStatus: string;
  paymentIntentId?: string;
  error?: string;
  retryCount?: number;
}

export interface OrderVerificationData {
  orderId: string;
  customerEmail: string;
  paymentIntentId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentConfirmationService {
  private readonly API_URL = environment.apiUrl;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 seconds

  constructor(private http: HttpClient) {}

  /**
   * Verify order creation with payment confirmation
   * Includes retry logic and proper error handling
   */
  verifyOrderWithPayment(data: OrderVerificationData): Observable<PaymentConfirmationResult> {
    console.log('PaymentConfirmationService: Starting order verification', data);

    return this.verifyOrderOnce(data).pipe(
      retryWhen(errors => 
        errors.pipe(
          switchMap((error, index) => {
            console.log(`PaymentConfirmationService: Retry attempt ${index + 1}/${this.MAX_RETRIES}`, error);
            
            if (index >= this.MAX_RETRIES - 1) {
              return throwError(() => new Error(`Payment confirmation failed after ${this.MAX_RETRIES} attempts: ${error.message}`));
            }
            
            return timer(this.RETRY_DELAY * (index + 1));
          })
        )
      ),
      catchError(error => {
        console.error('PaymentConfirmationService: Final verification failed', error);
        return of({
          success: false,
          orderId: data.orderId,
          paymentStatus: 'failed' as const,
          orderStatus: 'unknown',
          error: error.message || 'Payment confirmation failed'
        });
      })
    );
  }

  /**
   * Single verification attempt with comprehensive payment status checking
   */
  private verifyOrderOnce(data: OrderVerificationData): Observable<PaymentConfirmationResult> {
    return this.http.get<any>(`${this.API_URL}/orders/guest/${data.orderId}?email=${encodeURIComponent(data.customerEmail)}`).pipe(
      map(response => {
        console.log('PaymentConfirmationService: Backend response', response);
        
        // Extract order from various possible response structures
        const order = this.extractOrderFromResponse(response);
        
        if (!order) {
          throw new Error('Order not found in response');
        }

        console.log('PaymentConfirmationService: Extracted order', order);

        // Comprehensive payment confirmation check
        const paymentConfirmed = this.isPaymentConfirmed(order);
        
        if (!paymentConfirmed) {
          console.log('PaymentConfirmationService: Payment not confirmed', {
            orderId: order.id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentResult: order.paymentResult,
            paymentMethod: order.paymentMethod,
            isPaid: order.isPaid
          });
          
          throw new Error('Order created but payment not confirmed');
        }

        return {
          success: true,
          orderId: order.id,
          paymentStatus: 'confirmed' as const,
          orderStatus: order.status || 'confirmed',
          paymentIntentId: order.paymentIntentId || data.paymentIntentId
        };
      }),
      catchError(error => {
        console.error('PaymentConfirmationService: Verification error', error);
        throw error;
      })
    );
  }

  /**
   * Extract order from various backend response structures
   */
  private extractOrderFromResponse(response: any): any {
    // Try different response structures
    if (response.data?.order) {
      return response.data.order;
    }
    if (response.order) {
      return response.order;
    }
    if (response.id && response.status) {
      return response; // Direct order object
    }
    if (response.success && response.data) {
      return response.data;
    }
    
    console.warn('PaymentConfirmationService: Unknown response structure', response);
    return null;
  }

  /**
   * Comprehensive payment confirmation check
   * Checks multiple indicators of successful payment
   */
  private isPaymentConfirmed(order: any): boolean {
    console.log('PaymentConfirmationService: Checking payment confirmation', {
      orderId: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentResult: order.paymentResult,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      paymentIntentId: order.paymentIntentId
    });

    // Check multiple payment confirmation indicators
    const paymentIndicators = [
      // Direct payment status
      order.paymentStatus === 'paid',
      order.paymentStatus === 'confirmed',
      
      // Order status indicating payment
      order.status === 'confirmed',
      order.status === 'processing',
      order.status === 'paid',
      
      // Payment result object
      order.paymentResult?.id,
      order.paymentResult?.status === 'succeeded',
      
      // Payment method presence
      order.paymentMethod?.id,
      order.paymentMethod?.type,
      
      // Payment intent
      order.paymentIntentId,
      
      // Boolean flags
      order.isPaid === true,
      order.paymentConfirmed === true,
      
      // Stripe-specific indicators
      order.stripePaymentIntentId,
      order.stripePaymentStatus === 'succeeded'
    ];

    const hasPaymentConfirmation = paymentIndicators.some(indicator => !!indicator);
    
    console.log('PaymentConfirmationService: Payment confirmation result', {
      hasPaymentConfirmation,
      indicators: paymentIndicators
    });

    return hasPaymentConfirmation;
  }

  /**
   * Enhanced payment retry with exponential backoff
   */
  retryPaymentConfirmation(data: OrderVerificationData, maxRetries: number = 5): Observable<PaymentConfirmationResult> {
    return this.verifyOrderWithPayment(data).pipe(
      retryWhen(errors => 
        errors.pipe(
          switchMap((error, index) => {
            const retryCount = index + 1;
            const delayTime = Math.min(1000 * Math.pow(2, index), 10000); // Exponential backoff, max 10s
            
            console.log(`PaymentConfirmationService: Retry ${retryCount}/${maxRetries} in ${delayTime}ms`);
            
            if (retryCount >= maxRetries) {
              return throwError(() => new Error(`Payment confirmation failed after ${maxRetries} retries`));
            }
            
            return timer(delayTime);
          })
        )
      )
    );
  }

  /**
   * Check if order exists and get basic info without payment verification
   */
  checkOrderExists(orderId: string, email: string): Observable<{ exists: boolean; order?: any }> {
    return this.http.get<any>(`${this.API_URL}/orders/guest/${orderId}?email=${encodeURIComponent(email)}`).pipe(
      map(response => {
        const order = this.extractOrderFromResponse(response);
        return {
          exists: !!order,
          order: order || null
        };
      }),
      catchError(error => {
        console.error('PaymentConfirmationService: Order existence check failed', error);
        return of({ exists: false });
      })
    );
  }

  /**
   * Get detailed payment status for debugging
   */
  getPaymentStatus(orderId: string, email: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/orders/guest/${orderId}?email=${encodeURIComponent(email)}`).pipe(
      map(response => {
        const order = this.extractOrderFromResponse(response);
        if (!order) {
          throw new Error('Order not found');
        }

        return {
          orderId: order.id,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentResult: order.paymentResult,
          paymentMethod: order.paymentMethod,
          isPaid: order.isPaid,
          paymentIntentId: order.paymentIntentId,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        };
      }),
      catchError(error => {
        console.error('PaymentConfirmationService: Failed to get payment status', error);
        throw error;
      })
    );
  }
} 