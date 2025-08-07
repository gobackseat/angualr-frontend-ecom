import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { CartService, Cart } from './cart.service';
import { OrderService, CreateOrderRequest, Order } from './order.service';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  isAvailable: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
}

export interface CheckoutData {
  cart: Cart;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: ShippingMethod;
  paymentMethod: {
    type: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay';
    token?: string;
    paymentMethodId?: string;
  };
  couponCode?: string;
  notes?: string;
}

export interface CheckoutSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  order?: Order;
  error?: string;
  paymentIntent?: PaymentIntent;
}

export interface GuestCheckoutData {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  shippingAddress: any;
  billingAddress?: any;
  orderItems: any[];
  paymentMethod: string;
  customerNotes?: string;
}

export interface GuestOrderResponse {
  success: boolean;
  data: any;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly API_URL = environment.apiUrl;
  
  private checkoutDataSubject = new BehaviorSubject<CheckoutData | null>(null);
  private summarySubject = new BehaviorSubject<CheckoutSummary | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private shippingMethodsSubject = new BehaviorSubject<ShippingMethod[]>([]);
  private couponSubject = new BehaviorSubject<Coupon | null>(null);

  public checkoutData$ = this.checkoutDataSubject.asObservable();
  public summary$ = this.summarySubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public shippingMethods$ = this.shippingMethodsSubject.asObservable();
  public coupon$ = this.couponSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Initialize checkout
  initializeCheckout(): Observable<CheckoutData> {
    this.setLoading(true);
    this.clearError();

    return this.cartService.cart$.pipe(
      map(cart => {
        const checkoutData: CheckoutData = {
          cart,
          shippingAddress: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
            phone: ''
          },
          billingAddress: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States'
          },
          shippingMethod: {
            id: 'standard',
            name: 'Standard Shipping',
            description: '5-7 business days',
            price: 0,
            estimatedDays: 7,
            isAvailable: true
          },
          paymentMethod: {
            type: 'stripe'
          }
        };

        this.checkoutDataSubject.next(checkoutData);
        this.calculateSummary(checkoutData);
        this.setLoading(false);
        return checkoutData;
      }),
      catchError(error => {
        this.setError(this.handleError(error));
        this.setLoading(false);
        return of(null as any);
      })
    );
  }

  // Get available shipping methods
  getShippingMethods(address: any): Observable<ShippingMethod[]> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<ShippingMethod[]>(`${this.API_URL}/checkout/shipping-methods`, address)
      .pipe(
        tap(methods => {
          this.shippingMethodsSubject.next(methods);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of([]);
        })
      );
  }

  // Calculate shipping cost
  calculateShipping(address: any, methodId: string): Observable<number> {
    return this.http.post<{ cost: number }>(`${this.API_URL}/checkout/calculate-shipping`, {
      address,
      methodId
    }).pipe(
      map(response => response.cost),
      catchError(error => {
        this.setError(this.handleError(error));
        return of(0);
      })
    );
  }

  // Calculate tax
  calculateTax(address: any, subtotal: number): Observable<number> {
    return this.http.post<{ tax: number }>(`${this.API_URL}/checkout/calculate-tax`, {
      address,
      subtotal
    }).pipe(
      map(response => response.tax),
      catchError(error => {
        this.setError(this.handleError(error));
        return of(0);
      })
    );
  }

  // Validate coupon
  validateCoupon(code: string): Observable<Coupon> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<Coupon>(`${this.API_URL}/checkout/validate-coupon`, { code })
      .pipe(
        tap(coupon => {
          this.couponSubject.next(coupon);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of(null as any);
        })
      );
  }

  // Create payment intent
  createPaymentIntent(amount: number, currency: string = 'usd'): Observable<PaymentIntent> {
    this.setLoading(true);
    this.clearError();

    const headers = this.authService.getAuthHeaders();

    return this.http.post<PaymentIntent>(`${this.API_URL}/checkout/create-payment-intent`, {
      amount,
      currency
    }, { headers })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of(null as any);
        })
      );
  }

  // Process payment and create order
  processPayment(checkoutData: CheckoutData): Observable<PaymentResult> {
    this.setLoading(true);
    this.clearError();

    const orderData: CreateOrderRequest = {
      items: checkoutData.cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        customizations: item.customizations
      })),
      shippingAddress: checkoutData.shippingAddress,
      billingAddress: checkoutData.billingAddress,
      paymentMethod: checkoutData.paymentMethod,
      notes: checkoutData.notes,
      couponCode: checkoutData.couponCode
    };

    return this.orderService.createOrder(orderData)
      .pipe(
        tap(order => {
          if (order) {
            // Clear cart after successful order
            this.cartService.clearCart().subscribe();
            this.setLoading(false);
          }
        }),
        map(order => ({
          success: !!order,
          order: order || undefined,
          error: order ? undefined : 'Failed to create order'
        })),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of({
            success: false,
            error: this.handleError(error)
          });
        })
      );
  }

  // Guest checkout methods
  createGuestOrder(checkoutData: GuestCheckoutData): Observable<GuestOrderResponse> {
    return this.http.post<GuestOrderResponse>(`${this.API_URL}/orders/guest`, checkoutData).pipe(
      tap(response => {
        console.log('Guest order created:', response);
        // Clear cart after successful guest order
        this.cartService.clearCart().subscribe();
      }),
      catchError(error => {
        console.error('Guest order creation failed:', error);
        return throwError(() => error);
      })
    );
  }

  getGuestOrder(orderId: string, email: string): Observable<any> {
    return this.http.get(`${this.API_URL}/orders/guest/${orderId}?email=${encodeURIComponent(email)}`).pipe(
      catchError(error => {
        console.error('Failed to get guest order:', error);
        return throwError(() => error);
      })
    );
  }

  linkGuestOrderToUser(orderId: string, email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/orders/guest/${orderId}/link`, { email }).pipe(
      tap(response => {
        console.log('Guest order linked to user:', response);
      }),
      catchError(error => {
        console.error('Failed to link guest order:', error);
        return throwError(() => error);
      })
    );
  }

  // Update checkout data
  updateCheckoutData(updates: Partial<CheckoutData>): void {
    const currentData = this.checkoutDataSubject.value;
    if (currentData) {
      const updatedData = { ...currentData, ...updates };
      this.checkoutDataSubject.next(updatedData);
      this.calculateSummary(updatedData);
    }
  }

  // Update shipping address
  updateShippingAddress(address: any): void {
    this.updateCheckoutData({ shippingAddress: address });
  }

  // Update billing address
  updateBillingAddress(address: any): void {
    this.updateCheckoutData({ billingAddress: address });
  }

  // Update shipping method
  updateShippingMethod(method: ShippingMethod): void {
    this.updateCheckoutData({ shippingMethod: method });
  }

  // Update payment method
  updatePaymentMethod(method: any): void {
    this.updateCheckoutData({ paymentMethod: method });
  }

  // Apply coupon
  applyCoupon(code: string): Observable<boolean> {
    return this.validateCoupon(code).pipe(
      map(coupon => {
        if (coupon) {
          this.updateCheckoutData({ couponCode: code });
          return true;
        }
        return false;
      })
    );
  }

  // Remove coupon
  removeCoupon(): void {
    this.couponSubject.next(null);
    this.updateCheckoutData({ couponCode: undefined });
  }

  // Calculate summary
  private calculateSummary(checkoutData: CheckoutData): void {
    const subtotal = checkoutData.cart.subtotal;
    const shipping = checkoutData.shippingMethod.price;
    const tax = this.calculateTaxAmount(subtotal, shipping);
    
    let discount = 0;
    if (this.couponSubject.value) {
      const coupon = this.couponSubject.value;
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.value;
      }
    }

    const total = subtotal + tax + shipping - discount;

    const summary: CheckoutSummary = {
      subtotal,
      tax,
      shipping,
      discount,
      total,
      currency: 'USD'
    };

    this.summarySubject.next(summary);
  }

  // Calculate tax amount (simplified)
  private calculateTaxAmount(subtotal: number, shipping: number): number {
    // Simplified tax calculation - in production, this would use a tax service
    return (subtotal + shipping) * 0.08; // 8% tax rate
  }

  // Format price
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  // Get current checkout data
  get currentCheckoutData(): CheckoutData | null {
    return this.checkoutDataSubject.value;
  }

  // Get current summary
  get currentSummary(): CheckoutSummary | null {
    return this.summarySubject.value;
  }

  // Get current coupon
  get currentCoupon(): Coupon | null {
    return this.couponSubject.value;
  }

  // Get current shipping methods
  get currentShippingMethods(): ShippingMethod[] {
    return this.shippingMethodsSubject.value;
  }

  // Validate checkout data
  validateCheckoutData(checkoutData: CheckoutData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate shipping address
    if (!checkoutData.shippingAddress.firstName) errors.push('Shipping first name is required');
    if (!checkoutData.shippingAddress.lastName) errors.push('Shipping last name is required');
    if (!checkoutData.shippingAddress.address) errors.push('Shipping address is required');
    if (!checkoutData.shippingAddress.city) errors.push('Shipping city is required');
    if (!checkoutData.shippingAddress.state) errors.push('Shipping state is required');
    if (!checkoutData.shippingAddress.zipCode) errors.push('Shipping zip code is required');

    // Validate billing address
    if (!checkoutData.billingAddress.firstName) errors.push('Billing first name is required');
    if (!checkoutData.billingAddress.lastName) errors.push('Billing last name is required');
    if (!checkoutData.billingAddress.address) errors.push('Billing address is required');
    if (!checkoutData.billingAddress.city) errors.push('Billing city is required');
    if (!checkoutData.billingAddress.state) errors.push('Billing state is required');
    if (!checkoutData.billingAddress.zipCode) errors.push('Billing zip code is required');

    // Validate cart
    if (checkoutData.cart.items.length === 0) {
      errors.push('Cart is empty');
    }

    // Validate payment method
    if (!checkoutData.paymentMethod.type) {
      errors.push('Payment method is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Private methods
  private setLoading(loading: boolean): void {
    this.isLoadingSubject.next(loading);
  }

  private setError(error: string): void {
    this.errorSubject.next(error);
  }

  private clearError(): void {
    this.errorSubject.next(null);
  }

  private handleError(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'An error occurred during checkout';
    }
  }
} 