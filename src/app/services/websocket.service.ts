import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: string;
  previousStatus: string;
  timestamp: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface PaymentStatusUpdate {
  paymentIntentId: string;
  orderId?: string;
  status: string;
  timestamp: string;
}

export interface InventoryUpdate {
  productId: string;
  newStock: number;
  reserved: number;
  available: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds
  private heartbeatInterval: any;
  private isConnected = false;

  // Subjects for different types of updates
  private connectionStatus$ = new BehaviorSubject<boolean>(false);
  private orderUpdates$ = new Subject<OrderStatusUpdate>();
  private paymentUpdates$ = new Subject<PaymentStatusUpdate>();
  private inventoryUpdates$ = new Subject<InventoryUpdate>();
  private generalMessages$ = new Subject<WebSocketMessage>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Temporarily disable WebSocket connection
    console.log('WebSocket service initialized but connection disabled');
    
    // TODO: Re-enable when backend supports WebSocket
    /*
    if (isPlatformBrowser(this.platformId) && environment.enableRealTimeUpdates) {
      this.connect();
    }
    */
  }

  /**
   * Get connection status observable
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  /**
   * Get order status updates
   */
  getOrderUpdates(): Observable<OrderStatusUpdate> {
    return this.orderUpdates$.asObservable();
  }

  /**
   * Get payment status updates
   */
  getPaymentUpdates(): Observable<PaymentStatusUpdate> {
    return this.paymentUpdates$.asObservable();
  }

  /**
   * Get inventory updates
   */
  getInventoryUpdates(): Observable<InventoryUpdate> {
    return this.inventoryUpdates$.asObservable();
  }

  /**
   * Get general messages
   */
  getGeneralMessages(): Observable<WebSocketMessage> {
    return this.generalMessages$.asObservable();
  }

  /**
   * Connect to WebSocket server
   */
  private connect(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      this.socket = new WebSocket(environment.websocketUrl);

      this.socket.onopen = (event) => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.connectionStatus$.next(true);
        this.startHeartbeat();
        this.authenticate();
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.connectionStatus$.next(false);
        this.stopHeartbeat();
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.connectionStatus$.next(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handleReconnect();
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      // Route message to appropriate subject
      switch (message.type) {
        case 'order_status_update':
          this.orderUpdates$.next(message.data as OrderStatusUpdate);
          break;
        case 'payment_status_update':
          this.paymentUpdates$.next(message.data as PaymentStatusUpdate);
          break;
        case 'inventory_update':
          this.inventoryUpdates$.next(message.data as InventoryUpdate);
          break;
        case 'pong':
          // Heartbeat response - connection is alive
          break;
        default:
          this.generalMessages$.next(message);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Send message to server
   */
  private sendMessage(message: WebSocketMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  /**
   * Authenticate with server
   */
  private authenticate(): void {
    const token = localStorage.getItem('authToken');
    const guestId = localStorage.getItem('guestId') || this.generateGuestId();

    this.sendMessage({
      type: 'authenticate',
      data: {
        token: token,
        guestId: guestId,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate guest ID for anonymous users
   */
  private generateGuestId(): string {
    const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestId', guestId);
    return guestId;
  }

  /**
   * Subscribe to order updates
   */
  subscribeToOrder(orderId: string): void {
    this.sendMessage({
      type: 'subscribe_order',
      data: { orderId },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Subscribe to payment updates
   */
  subscribeToPayment(paymentIntentId: string): void {
    this.sendMessage({
      type: 'subscribe_payment',
      data: { paymentIntentId },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Subscribe to product inventory updates
   */
  subscribeToProduct(productId: string): void {
    this.sendMessage({
      type: 'subscribe_product',
      data: { productId },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unsubscribe from order updates
   */
  unsubscribeFromOrder(orderId: string): void {
    this.sendMessage({
      type: 'unsubscribe_order',
      data: { orderId },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unsubscribe from payment updates
   */
  unsubscribeFromPayment(paymentIntentId: string): void {
    this.sendMessage({
      type: 'unsubscribe_payment',
      data: { paymentIntentId },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.sendMessage({
          type: 'ping',
          data: {},
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval * this.reconnectAttempts); // Exponential backoff
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Manually reconnect
   */
  reconnect(): void {
    this.reconnectAttempts = 0;
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.connectionStatus$.next(false);
  }

  /**
   * Check if connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection state
   */
  getConnectionState(): string {
    if (!this.socket) return 'DISCONNECTED';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'CONNECTED';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'DISCONNECTED';
      default: return 'UNKNOWN';
    }
  }

  /**
   * Clean up on service destroy
   */
  ngOnDestroy(): void {
    this.disconnect();
    this.connectionStatus$.complete();
    this.orderUpdates$.complete();
    this.paymentUpdates$.complete();
    this.inventoryUpdates$.complete();
    this.generalMessages$.complete();
  }
} 