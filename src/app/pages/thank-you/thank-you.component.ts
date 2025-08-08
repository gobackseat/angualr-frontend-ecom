import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  items: Array<{
    product: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  createdAt: string;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
}

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Success Header -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
          <p class="text-lg text-gray-600">Your order has been successfully placed and confirmed.</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading your order details...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div class="flex items-center space-x-2 mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="text-lg font-semibold text-red-800">Unable to Load Order Details</h3>
          </div>
          <p class="text-red-700 mb-4">{{ error }}</p>
          <button (click)="retryLoadOrder()" 
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>

        <!-- Order Details -->
        <div *ngIf="orderDetails && !loading" class="space-y-8">
          
          <!-- Order Summary -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-600">Order Number</p>
                <p class="font-semibold text-gray-900">{{ orderDetails.orderNumber }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Order Date</p>
                <p class="font-semibold text-gray-900">{{ orderDetails.createdAt | date:'medium' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Status</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ orderDetails.status | titlecase }}
                </span>
              </div>
              <div *ngIf="orderDetails.trackingNumber">
                <p class="text-sm text-gray-600">Tracking Number</p>
                <p class="font-semibold text-gray-900">{{ orderDetails.trackingNumber }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div class="space-y-4">
              <div *ngFor="let item of orderDetails.items" class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img [src]="item.image" [alt]="item.name" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{{ item.price | currency:'USD':'symbol':'1.2-2' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Shipping Address</h4>
                <div class="text-gray-600">
                  <p>{{ orderDetails.shippingAddress.firstName }} {{ orderDetails.shippingAddress.lastName }}</p>
                  <p>{{ orderDetails.shippingAddress.address }}</p>
                  <p>{{ orderDetails.shippingAddress.city }}, {{ orderDetails.shippingAddress.state }} {{ orderDetails.shippingAddress.postalCode }}</p>
                  <p>{{ orderDetails.shippingAddress.country }}</p>
                  <p class="mt-2">Phone: {{ orderDetails.shippingAddress.phone }}</p>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Contact Information</h4>
                <div class="text-gray-600">
                  <p>{{ orderDetails.customerInfo.firstName }} {{ orderDetails.customerInfo.lastName }}</p>
                  <p>{{ orderDetails.customerInfo.email }}</p>
                  <p>{{ orderDetails.customerInfo.phone }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Total -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Total</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-semibold">{{ orderDetails.itemsPrice | currency:'USD':'symbol':'1.2-2' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-semibold">{{ orderDetails.taxPrice | currency:'USD':'symbol':'1.2-2' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-semibold">{{ orderDetails.shippingPrice | currency:'USD':'symbol':'1.2-2' }}</span>
              </div>
              <div class="border-t pt-2">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{{ orderDetails.totalPrice | currency:'USD':'symbol':'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">What's Next?</h3>
            <div class="space-y-3 text-blue-800">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                <div>
                  <p class="font-medium">Confirmation Email</p>
                  <p class="text-sm">You'll receive a confirmation email with your order details shortly.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                <div>
                  <p class="font-medium">Order Processing</p>
                  <p class="text-sm">We'll process your order and prepare it for shipping within 1-2 business days.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                <div>
                  <p class="font-medium">Shipping Updates</p>
                  <p class="text-sm">You'll receive tracking information once your order ships.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button (click)="goToHome()" 
                    class="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Continue Shopping
            </button>
            <button (click)="goToOrders()" 
                    class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              View My Orders
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Add any additional styles here */
  `]
})
export class ThankYouComponent implements OnInit {
  orderDetails: OrderDetails | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadOrderDetails();
  }

  loadOrderDetails() {
    this.loading = true;
    this.error = null;

    // Get order ID from route params or localStorage
    const orderId = this.route.snapshot.queryParams['orderId'] || 
                   (isPlatformBrowser(this.platformId) ? localStorage.getItem('lastOrderId') : null);

    if (!orderId) {
      this.error = 'No order information found. Please check your email for order details.';
      this.loading = false;
      return;
    }

    // Get customer email from localStorage (stored during checkout)
    const customerEmail = (this.route.snapshot.queryParams['email']) || (isPlatformBrowser(this.platformId) ? 
                         localStorage.getItem('lastOrderEmail') : null);

    if (!customerEmail) {
      // Try authenticated order first, then fall back to guest order
      this.orderService.getOrder(orderId).subscribe({
        next: (order: any) => {
          this.orderDetails = this.transformOrderData(order);
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Failed to load authenticated order details:', error);
          this.error = 'Unable to load order details. Please check your email for confirmation.';
          this.loading = false;
        }
      });
    } else {
      // Use guest order service
      this.orderService.getGuestOrder(orderId, customerEmail).subscribe({
        next: (response: any) => {
          console.log('Guest order response:', response);
          
          // Extract order from response
          const order = response.data?.order || response.order || response;
          
          if (!order) {
            this.error = 'Order not found. Please check your email for order details.';
            this.loading = false;
            return;
          }

          this.orderDetails = this.transformOrderData(order);
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Failed to load guest order details:', error);
          this.error = 'Unable to load order details. Please check your email for confirmation.';
          this.loading = false;
        }
      });
    }
  }

  retryLoadOrder() {
    this.loadOrderDetails();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToOrders() {
      this.router.navigate(['/orders']);
  }

  /**
   * Normalize image URL to handle backend relative paths
   */
  private resolveImage(src: string): string {
    if (!src) return 'assets/images/placeholder-product.webp';
    if (src.startsWith('http')) return src;
    if (src.startsWith('/')) {
      const host = environment.apiUrl.replace(/\/api$/, '');
      return `${host}${src}`;
    }
    return src;
  }

  /**
   * Transform backend order data to frontend format
   */
  private transformOrderData(order: any): OrderDetails {
    return {
      id: order.id || order._id || '',
      orderNumber: order.orderNumber || order.id || order._id || '',
      status: order.status || (order.isPaid ? 'confirmed' : 'processing'),
      totalPrice: Number(order.total || order.totalPrice || 0),
      itemsPrice: Number(order.subtotal || order.itemsPrice || 0),
      taxPrice: Number(order.tax || order.taxPrice || 0),
      shippingPrice: Number(order.shipping || order.shippingPrice || 0),
      items: (order.items || order.orderItems || []).map((item: any) => ({
        product: item.productId || item.product || '',
        name: item.name || item.productName || 'Product',
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
        image: this.resolveImage(item.image || item.productImage)
      })),
      customerInfo: {
        firstName: order.customerInfo?.firstName || order.shippingAddress?.firstName || '',
        lastName: order.customerInfo?.lastName || order.shippingAddress?.lastName || '',
        email: order.customerInfo?.email || order.email || '',
        phone: order.customerInfo?.phone || order.shippingAddress?.phone || ''
      },
      shippingAddress: {
        firstName: order.shippingAddress?.firstName || '',
        lastName: order.shippingAddress?.lastName || '',
        address: order.shippingAddress?.address || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        postalCode: order.shippingAddress?.postalCode || order.shippingAddress?.zipCode || '',
        country: order.shippingAddress?.country || '',
        phone: order.shippingAddress?.phone || ''
      },
      createdAt: order.createdAt || new Date().toISOString(),
      estimatedDeliveryDate: order.estimatedDelivery || order.estimatedDeliveryDate,
      trackingNumber: order.trackingNumber
    };
  }
} 