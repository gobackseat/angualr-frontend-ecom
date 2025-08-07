import { Injectable } from '@angular/core';

export interface CheckoutError {
  type: 'payment' | 'order' | 'validation' | 'network' | 'stripe' | 'unknown';
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutErrorHandlerService {

  /**
   * Parse and categorize checkout errors
   */
  parseError(error: any): CheckoutError {
    console.error('CheckoutErrorHandler: Parsing error', error);

    const errorMessage = error?.message || error?.error || 'Unknown error occurred';
    const errorCode = error?.code || 'UNKNOWN';

    // Payment-related errors
    if (errorMessage.includes('payment') || errorMessage.includes('stripe') || errorCode.includes('PAYMENT')) {
      return this.handlePaymentError(errorMessage, errorCode);
    }

    // Order-related errors
    if (errorMessage.includes('order') || errorMessage.includes('Order created but payment not confirmed')) {
      return this.handleOrderError(errorMessage, errorCode);
    }

    // Validation errors
    if (errorMessage.includes('validation') || errorMessage.includes('invalid') || errorCode.includes('VALIDATION')) {
      return this.handleValidationError(errorMessage, errorCode);
    }

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorCode.includes('NETWORK')) {
      return this.handleNetworkError(errorMessage, errorCode);
    }

    // Stripe-specific errors
    if (errorMessage.includes('stripe') || errorCode.includes('STRIPE')) {
      return this.handleStripeError(errorMessage, errorCode);
    }

    // Default unknown error
    return this.handleUnknownError(errorMessage, errorCode);
  }

  /**
   * Handle payment-related errors
   */
  private handlePaymentError(message: string, code: string): CheckoutError {
    const baseError: CheckoutError = {
      type: 'payment',
      code: code,
      message: message,
      userMessage: 'There was an issue processing your payment.',
      retryable: true,
      action: 'Please try again with a different payment method.'
    };

    // Specific payment error cases
    if (message.includes('insufficient funds')) {
      return {
        ...baseError,
        code: 'INSUFFICIENT_FUNDS',
        userMessage: 'Your payment method has insufficient funds.',
        action: 'Please use a different payment method or contact your bank.'
      };
    }

    if (message.includes('card declined')) {
      return {
        ...baseError,
        code: 'CARD_DECLINED',
        userMessage: 'Your card was declined.',
        action: 'Please check your card details or use a different payment method.'
      };
    }

    if (message.includes('expired')) {
      return {
        ...baseError,
        code: 'CARD_EXPIRED',
        userMessage: 'Your card has expired.',
        action: 'Please use a different payment method.'
      };
    }

    return baseError;
  }

  /**
   * Handle order-related errors
   */
  private handleOrderError(message: string, code: string): CheckoutError {
    const baseError: CheckoutError = {
      type: 'order',
      code: code,
      message: message,
      userMessage: 'There was an issue creating your order.',
      retryable: true,
      action: 'Please try again or contact support if the problem persists.'
    };

    // Specific order error cases
    if (message.includes('Order created but payment not confirmed')) {
      return {
        ...baseError,
        code: 'PAYMENT_NOT_CONFIRMED',
        userMessage: 'Your order was created but payment confirmation is pending.',
        action: 'Please wait a moment and try again, or contact support if the issue persists.',
        retryable: true
      };
    }

    if (message.includes('order not found')) {
      return {
        ...baseError,
        code: 'ORDER_NOT_FOUND',
        userMessage: 'Your order could not be found.',
        action: 'Please try again or contact support.',
        retryable: true
      };
    }

    if (message.includes('cancelled')) {
      return {
        ...baseError,
        code: 'ORDER_CANCELLED',
        userMessage: 'Your order was cancelled.',
        action: 'Please start a new checkout process.',
        retryable: false
      };
    }

    return baseError;
  }

  /**
   * Handle validation errors
   */
  private handleValidationError(message: string, code: string): CheckoutError {
    return {
      type: 'validation',
      code: code,
      message: message,
      userMessage: 'Please check your information and try again.',
      retryable: true,
      action: 'Please review and correct the highlighted fields.'
    };
  }

  /**
   * Handle network errors
   */
  private handleNetworkError(message: string, code: string): CheckoutError {
    return {
      type: 'network',
      code: code,
      message: message,
      userMessage: 'Network connection issue. Please check your internet connection.',
      retryable: true,
      action: 'Please try again when your connection is stable.'
    };
  }

  /**
   * Handle Stripe-specific errors
   */
  private handleStripeError(message: string, code: string): CheckoutError {
    const baseError: CheckoutError = {
      type: 'stripe',
      code: code,
      message: message,
      userMessage: 'Payment processing error.',
      retryable: true,
      action: 'Please try again or use a different payment method.'
    };

    // Common Stripe error codes
    switch (code) {
      case 'card_declined':
        return {
          ...baseError,
          code: 'CARD_DECLINED',
          userMessage: 'Your card was declined.',
          action: 'Please check your card details or use a different payment method.'
        };
      
      case 'expired_card':
        return {
          ...baseError,
          code: 'EXPIRED_CARD',
          userMessage: 'Your card has expired.',
          action: 'Please use a different payment method.'
        };
      
      case 'incorrect_cvc':
        return {
          ...baseError,
          code: 'INCORRECT_CVC',
          userMessage: 'Incorrect CVC code.',
          action: 'Please check your card\'s security code and try again.'
        };
      
      case 'processing_error':
        return {
          ...baseError,
          code: 'PROCESSING_ERROR',
          userMessage: 'Payment processing error.',
          action: 'Please try again or contact support.'
        };
      
      default:
        return baseError;
    }
  }

  /**
   * Handle unknown errors
   */
  private handleUnknownError(message: string, code: string): CheckoutError {
    return {
      type: 'unknown',
      code: code,
      message: message,
      userMessage: 'An unexpected error occurred.',
      retryable: true,
      action: 'Please try again or contact support if the problem persists.'
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: any): string {
    const parsedError = this.parseError(error);
    return parsedError.userMessage;
  }

  /**
   * Get suggested action for the error
   */
  getSuggestedAction(error: any): string {
    const parsedError = this.parseError(error);
    return parsedError.action || 'Please try again.';
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: any): boolean {
    const parsedError = this.parseError(error);
    return parsedError.retryable;
  }

  /**
   * Get error type for logging/analytics
   */
  getErrorType(error: any): string {
    const parsedError = this.parseError(error);
    return parsedError.type;
  }

  /**
   * Log error for debugging
   */
  logError(error: any, context?: string): void {
    const parsedError = this.parseError(error);
    console.error('CheckoutErrorHandler: Error logged', {
      context,
      error: parsedError,
      originalError: error
    });
  }
} 