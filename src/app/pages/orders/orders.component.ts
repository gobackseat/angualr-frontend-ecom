import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService, Order, OrdersResponse } from '../../services/order.service';
import { Subject, takeUntil } from 'rxjs';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div *ngFor="let order of orders" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <div>
              <span class="text-gray-600">Order #{{ order.orderNumber }}</span>
              <span class="ml-4 text-gray-500">{{ order.createdAt | date }}</span>
            </div>
            <div class="text-xl font-bold text-orange-600">{{ order.total | number:'1.2-2' }}</div>
          </div>
          <div *ngFor="let item of order.items" class="flex justify-between items-center mb-2">
            <div>
              <span>{{ item.name }}</span>
              <span class="text-xs text-gray-500">Qty: {{ item.quantity }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ (item.price * item.quantity) | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class OrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders() {
    this.loading = true;
    this.error = null;

    // Check authentication
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    // Use real order service to fetch orders
    this.orderService.getUserOrders().subscribe({
      next: (response: OrdersResponse) => {
        this.orders = response.orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
      }
    });
  }

  getOrderNumber(orderId: string): string {
    return orderId.slice(-8).toUpperCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    return status || 'Processing';
  }

  viewOrderDetails(orderId: string) {
    this.router.navigate(['/orders', orderId]);
  }

  trackOrder(trackingNumber: string) {
    // Open tracking in new tab
    window.open(`https://www.ups.com/track?tracknum=${trackingNumber}`, '_blank');
  }

  reorder(order: Order) {
    // Add items to cart and navigate to checkout
    // This would integrate with cart service
    this.router.navigate(['/checkout']);
  }

  goToProduct() {
    this.router.navigate(['/product']);
  }
} 