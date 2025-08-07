import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
  customizations?: {
    [key: string]: any;
  };
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay';
  token?: string;
  paymentMethodId?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    color?: string;
    size?: string;
    customizations?: {
      [key: string]: any;
    };
  }[];
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
  couponCode?: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = environment.apiUrl;
  
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public orders$ = this.ordersSubject.asObservable();
  public currentOrder$ = this.currentOrderSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Create new order
  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    this.setLoading(true);
    this.clearError();

    const headers = this.authService.getAuthHeaders();

    // Convert frontend format to backend format
    const { zipCode: shippingZip, ...shippingRest } = orderData.shippingAddress;
    const backendShippingAddress = {
      ...shippingRest,
      postalCode: shippingZip
    };

    let backendBillingAddress;
    if (orderData.billingAddress) {
      const { zipCode: billingZip, ...billingRest } = orderData.billingAddress;
      backendBillingAddress = {
        ...billingRest,
        postalCode: billingZip
      };
    }

    const backendOrderData = {
      ...orderData,
      shippingAddress: backendShippingAddress,
      billingAddress: backendBillingAddress
    };

    return this.http.post<Order>(`${this.API_URL}/orders`, backendOrderData, { headers })
      .pipe(
        tap(order => {
          this.currentOrderSubject.next(order);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of(null as any);
        })
      );
  }

  // Create guest order (no authentication required)
  createGuestOrder(orderData: any): Observable<any> {
    this.setLoading(true);
    this.clearError();

    // Transform frontend format to backend format
    const backendOrderData = {
      ...orderData,
      shippingAddress: {
        ...orderData.shippingAddress,
        postalCode: orderData.shippingAddress.zipCode
      }
    };

    // Remove zipCode from the address since backend expects postalCode
    const { zipCode, ...shippingAddressWithoutZip } = backendOrderData.shippingAddress;
    backendOrderData.shippingAddress = shippingAddressWithoutZip;

    return this.http.post<any>(`${this.API_URL}/orders/guest`, backendOrderData)
      .pipe(
        tap(response => {
          if (response.success && response.data?.order) {
            this.currentOrderSubject.next(response.data.order);
          }
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return throwError(() => error);
        })
      );
  }

  // Get guest order by ID and email
  getGuestOrder(orderId: string, email: string): Observable<any> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<any>(`${this.API_URL}/orders/guest/${orderId}?email=${encodeURIComponent(email)}`)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return throwError(() => error);
        })
      );
  }

  // Get user orders
  getUserOrders(
    page: number = 1,
    limit: number = 10,
    filters: OrderFilters = {}
  ): Observable<OrdersResponse> {
    this.setLoading(true);
    this.clearError();

    const headers = this.authService.getAuthHeaders();
    let params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (filters.status) {
      params.set('status', filters.status);
    }
    if (filters.dateRange) {
      params.set('startDate', filters.dateRange.start);
      params.set('endDate', filters.dateRange.end);
    }
    if (filters.search) {
      params.set('search', filters.search);
    }

    return this.http.get<OrdersResponse>(`${this.API_URL}/orders/my-orders?${params.toString()}`, { headers })
      .pipe(
        tap(response => {
          this.ordersSubject.next(response.orders);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of({
            orders: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          });
        })
      );
  }

  // Get single order
  getOrder(orderId: string): Observable<Order> {
    this.setLoading(true);
    this.clearError();

    const headers = this.authService.getAuthHeaders();

    return this.http.get<Order>(`${this.API_URL}/orders/${orderId}`, { headers })
      .pipe(
        tap(order => {
          this.currentOrderSubject.next(order);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of(null as any);
        })
      );
  }

  // Update order (admin only)
  updateOrder(orderId: string, updateData: UpdateOrderRequest): Observable<Order> {
    this.setLoading(true);
    this.clearError();

    const headers = this.authService.getAuthHeaders();

    return this.http.put<Order>(`${this.API_URL}/orders/${orderId}`, updateData, { headers })
      .pipe(
        tap(order => {
          this.currentOrderSubject.next(order);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of(null as any);
        })
      );
  }

  // Cancel order
  cancelOrder(orderId: string, reason?: string): Observable<Order> {
    this.setLoading(true);
    this.clearError();

    const headers = this.authService.getAuthHeaders();
    const body = reason ? { reason } : {};

    return this.http.post<Order>(`${this.API_URL}/orders/${orderId}/cancel`, body, { headers })
      .pipe(
        tap(order => {
          this.currentOrderSubject.next(order);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of(null as any);
        })
      );
  }

  // Request refund
  requestRefund(orderId: string, reason: string, items?: string[]): Observable<Order> {
    this.setLoading(true);
    this.clearError();

    const headers = this.authService.getAuthHeaders();
    const body = { reason, items };

    return this.http.post<Order>(`${this.API_URL}/orders/${orderId}/refund`, body, { headers })
      .pipe(
        tap(order => {
          this.currentOrderSubject.next(order);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of(null as any);
        })
      );
  }

  // Track order
  trackOrder(orderId: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();

    return this.http.get<any>(`${this.API_URL}/orders/${orderId}/track`, { headers })
      .pipe(
        catchError(error => {
          this.setError(this.handleError(error));
          return of(null);
        })
      );
  }

  // Get order by order number
  getOrderByNumber(orderNumber: string): Observable<Order> {
    this.setLoading(true);
    this.clearError();

    const headers = this.authService.getAuthHeaders();

    return this.http.get<Order>(`${this.API_URL}/orders/number/${orderNumber}`, { headers })
      .pipe(
        tap(order => {
          this.currentOrderSubject.next(order);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return of(null as any);
        })
      );
  }

  // Get order statistics
  getOrderStats(): Observable<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    const headers = this.authService.getAuthHeaders();

    return this.http.get<any>(`${this.API_URL}/orders/stats`, { headers })
      .pipe(
        catchError(error => {
          this.setError(this.handleError(error));
          return of({
            total: 0,
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
          });
        })
      );
  }

  // Get current orders
  get currentOrders(): Order[] {
    return this.ordersSubject.value;
  }

  // Get current order
  get currentOrder(): Order | null {
    return this.currentOrderSubject.value;
  }

  // Format order status
  formatOrderStatus(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    return statusMap[status] || status;
  }

  // Format payment status
  formatPaymentStatus(status: PaymentStatus): string {
    const statusMap: Record<PaymentStatus, string> = {
      pending: 'Pending',
      paid: 'Paid',
      failed: 'Failed',
      refunded: 'Refunded',
      partially_refunded: 'Partially Refunded'
    };
    return statusMap[status] || status;
  }

  // Get order status color
  getOrderStatusColor(status: OrderStatus): string {
    const colorMap: Record<OrderStatus, string> = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'success',
      delivered: 'success',
      cancelled: 'danger',
      refunded: 'secondary'
    };
    return colorMap[status] || 'secondary';
  }

  // Get payment status color
  getPaymentStatusColor(status: PaymentStatus): string {
    const colorMap: Record<PaymentStatus, string> = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger',
      refunded: 'secondary',
      partially_refunded: 'info'
    };
    return colorMap[status] || 'secondary';
  }

  // Calculate order total
  calculateOrderTotal(order: Order): number {
    return order.subtotal + order.tax + order.shipping - order.discount;
  }

  // Format price
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
      return 'An error occurred while processing your order';
    }
  }
} 