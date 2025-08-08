import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, Observable, of, throwError } from 'rxjs';
import { switchMap, takeUntil, catchError, map } from 'rxjs/operators';

// Services
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { StripeService, PaymentResult } from '../../services/stripe.service';
import { ProductValidationService } from '../../services/product-validation.service';
import { PaymentConfirmationService, OrderVerificationData } from '../../services/payment-confirmation.service';
import { CheckoutErrorHandlerService } from '../../services/checkout-error-handler.service';
import { AuthService } from '../../services/auth.service';
import { CheckoutService } from '../../services/checkout.service';
import { WebSocketService } from '../../services/websocket.service';

// Interfaces
interface Cart {
  items: any[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

interface OrderStatusUpdate {
  orderId: string;
  status: string;
  timestamp: string;
}

interface PaymentStatusUpdate {
  orderId: string;
  status: string;
  timestamp: string;
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styles: [`
    /* Add any additional styles here */
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('cardElement') cardElement!: ElementRef;
  
  private destroy$ = new Subject<void>();
  
  checkoutForm: FormGroup;
  currentStep = 1;
  maxSteps = 3;
  cart: Cart = { 
    items: [], 
    totalItems: 0, 
    subtotal: 0, 
    tax: 0, 
    shipping: 0, 
    total: 0, 
    currency: 'USD' 
  };
  
  // State management
  loading = true;
  processing = false;
  error: string | null = null;
  success: string | null = null;
  isAuthenticated = false;
  
  // Stripe payment properties
  paymentIntentId: string | null = null;
  clientSecret: string | null = null;
  paymentMethod: any = null;
  showPaymentForm = false;
  stripeElementsReady = false;

  // WebSocket and real-time updates
  orderStatusUpdates: OrderStatusUpdate[] = [];
  paymentStatusUpdates: PaymentStatusUpdate[] = [];
  websocketConnected = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private checkoutService: CheckoutService,
    private productValidationService: ProductValidationService,
    private stripeService: StripeService,
    private paymentConfirmationService: PaymentConfirmationService,
    private checkoutErrorHandler: CheckoutErrorHandlerService,
    private websocketService: WebSocketService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['United States', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadCart();
    this.checkAuthStatus();
    this.loadUserDataIfAuthenticated();
    this.setupWebSocketListeners();
  }

  ngAfterViewInit() {
    // Remove Stripe initialization from here - it will be initialized when user reaches step 3
    // The card-element container is only available when currentStep === 3
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stripeService.destroyCardElement();
  }

  /**
   * Navigate to next step
   */
  nextStep(): void {
    if (this.currentStep < this.maxSteps && this.canProceedToNextStep()) {
      this.currentStep++;
      
      // Clear any previous errors when moving to next step
      this.error = null;
      this.success = null;
      
      // Initialize Stripe elements when reaching payment step
      if (this.currentStep === 3) {
        this.initializeStripeElements();
      }
    }
  }

  /**
   * Navigate to previous step
   */
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.error = null;
    }
  }

  /**
   * Check if user can proceed to next step
   */
  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.cart.items.length > 0;
      case 2:
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
        return requiredFields.every(field => {
          const control = this.checkoutForm.get(field);
          return control && control.valid;
        });
      case 3:
        return this.checkoutForm.valid && this.clientSecret !== null;
      default:
        return false;
    }
  }

  /**
   * Initialize Stripe Elements
   */
  private initializeStripeElements(): void {
    // Check if we're in the browser and the card element container exists
    if (isPlatformBrowser(this.platformId)) {
      console.log('Starting Stripe initialization...');
      
      // Use a retry mechanism to wait for the DOM element
      this.waitForCardElementAndInitialize();
    }
  }

  /**
   * Wait for card element to be available and then initialize Stripe
   */
  private waitForCardElementAndInitialize(retryCount = 0, maxRetries = 10): void {
    const cardContainer = document.getElementById('card-element');
    
    if (cardContainer) {
      console.log('Card container found, initializing Stripe elements...');
      this.stripeService.createCardElement('card-element').subscribe({
        next: () => {
          console.log('Stripe card element initialized successfully');
          this.stripeElementsReady = true;
          this.cdr.detectChanges(); // Trigger change detection
        },
        error: (error) => {
          console.error('Failed to initialize Stripe elements:', error);
          this.error = 'Payment system initialization failed. Please refresh the page.';
          this.stripeElementsReady = false;
          this.cdr.detectChanges(); // Trigger change detection
        }
      });
    } else if (retryCount < maxRetries) {
      console.log(`Card container not found, retrying... (${retryCount + 1}/${maxRetries})`);
      // Retry after a short delay
      setTimeout(() => {
        this.waitForCardElementAndInitialize(retryCount + 1, maxRetries);
      }, 100);
    } else {
      console.warn('Card element container not found after maximum retries');
      this.stripeElementsReady = false;
      this.error = 'Payment form failed to load. Please refresh the page.';
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  /**
   * Setup WebSocket listeners for real-time updates
   */
  private setupWebSocketListeners(): void {
    // Temporarily disable WebSocket for now
    this.websocketConnected = false;
    console.log('WebSocket disabled for now');
    
    // TODO: Re-enable WebSocket when backend supports it
    /*
    // Connection status
    this.websocketService.getConnectionStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(connected => {
        this.websocketConnected = connected;
        console.log('WebSocket connection status:', connected);
      });

    // Order status updates
    this.websocketService.getOrderUpdates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        this.orderStatusUpdates.push(update);
        console.log('Order status update:', update);
        
        // Show notification to user
        this.success = `Order status updated: ${update.status}`;
        setTimeout(() => this.success = null, 5000);
      });

    // Payment status updates
    this.websocketService.getPaymentUpdates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        this.paymentStatusUpdates.push(update);
        console.log('Payment status update:', update);
        
        if (update.status === 'succeeded') {
          this.success = 'Payment successful! Processing your order...';
        } else if (update.status === 'failed') {
          this.error = 'Payment failed. Please try again.';
        }
      });
    */
  }

  checkAuthStatus() {
    this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  loadUserDataIfAuthenticated() {
    if (this.isAuthenticated) {
      this.authService.getProfile().pipe(takeUntil(this.destroy$)).subscribe({
        next: (user) => {
          // Pre-fill form with user data
          this.checkoutForm.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address?.street || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            zipCode: user.address?.zipCode || '',
            country: user.address?.country || 'United States'
          });
        },
        error: (error) => {
          console.error('Failed to load user data:', error);
        }
      });
    }
  }

  loadCart() {
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
        
        // Debug: Log cart items
        console.log('Cart loaded:', cart.items);
        
        // Debug cart state
        this.cartService.debugCartState();
        
        // Show error if cart is empty instead of redirecting
        if (cart.items.length === 0) {
          this.error = 'Your cart is empty. Please add items before proceeding to checkout.';
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'Failed to load cart';
        this.loading = false;
        console.error('Cart loading error:', error);
      }
    });
  }

  // Temporary method to clear cart for testing
  clearCartForTesting() {
    console.log('Clearing cart for testing...');
    this.cartService.forceClearCart();
    this.router.navigate(['/']);
  }



  processOrder() {
    if (this.checkoutForm.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.processing = true;
    this.error = null;

    // Simulate order processing
    setTimeout(() => {
      this.processing = false;
      this.success = 'Order placed successfully!';
      
      // Clear cart and redirect to thank you page
      setTimeout(() => {
        this.cartService.clearCart();
        this.router.navigate(['/thank-you']);
      }, 2000);
    }, 2000);
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.error = 'Please fill in all required fields';
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    // Defensive check for cart items
    if (!this.cart.items || this.cart.items.length === 0) {
      this.error = 'Your cart is empty. Please add items before checkout.';
      return;
    }

    this.processing = true;
    this.error = null;

    // Production-grade cart validation before checkout
    const productIds = this.cart.items.map(item => item.productId);
    console.log('Validating cart items before checkout:', productIds);

    this.productValidationService.validateProducts(productIds)
      .pipe(
        switchMap(validationResult => {
          if (validationResult.invalidProducts.length > 0) {
            console.error('Invalid products found in cart:', validationResult.invalidProducts);
            this.error = `Some items in your cart are no longer available. Please refresh your cart.`;
            this.processing = false;
            
            // Auto-clean invalid items from cart
            this.cleanInvalidCartItems(validationResult.invalidProducts);
            return of(null);
          }

          // Check for warnings in individual results
          const warnings = validationResult.results
            .filter(result => result.warnings.length > 0)
            .flatMap(result => result.warnings);
          
          if (warnings.length > 0) {
            console.warn('Product validation warnings:', warnings);
          }

          // SECURE FLOW: Create payment intent first (no order created yet)
          return this.createPaymentIntent();
        }),
        switchMap(paymentIntent => {
          if (!paymentIntent) return of(null);
          
          // Store payment intent details for order creation
          this.paymentIntentId = paymentIntent.paymentIntentId;
          this.clientSecret = paymentIntent.clientSecret;
          
          // Debug logging
          console.log('Payment intent received:', paymentIntent);
          console.log('Client secret extracted:', paymentIntent.clientSecret);
          console.log('Client secret type:', typeof paymentIntent.clientSecret);
          console.log('Client secret length:', paymentIntent.clientSecret?.length);
          
          // SECURE FLOW: Process payment with Stripe (payment confirmation)
          return this.processStripePayment(paymentIntent.clientSecret);
        }),
        switchMap(paymentResult => {
          if (!paymentResult) return of(null);
          
          // SECURE FLOW: Only create order after payment is confirmed by Stripe
          return this.createOrderAfterPayment(paymentResult);
        }),
        switchMap(orderResult => {
          if (!orderResult) return of(null);
          
          // SECURE FLOW: Verify order was created successfully with payment confirmation
          // Handle both direct order object and nested data structure
          const orderId = orderResult.order?.id || orderResult.data?.order?.id;
          return this.verifyOrderCreation(orderId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result) => {
          if (result) {
            // SECURE FLOW: All steps completed successfully
            console.log('Secure checkout completed successfully:', result);
            this.processing = false;
            
            // Store order ID and email for thank you page
            const orderId = result.order?.id || result.data?.order?.id;
            const email = this.checkoutForm?.value?.email;
            if (orderId) {
              localStorage.setItem('lastOrderId', orderId);
            }
            if (email) {
              localStorage.setItem('lastOrderEmail', email);
            }
            
            // Clear cart after successful order
            this.cartService.clearCart();
            
            // Navigate to thank you page (include email for guest orders)
            this.router.navigate(['/thank-you'], {
              queryParams: { orderId: orderId, email: email || undefined }
            });
          }
        },
        error: (error) => {
          this.processing = false;
          
          // Use the error handler service for better error handling
          this.checkoutErrorHandler.logError(error, 'checkout-submit');
          
          const userMessage = this.checkoutErrorHandler.getUserFriendlyMessage(error);
          const suggestedAction = this.checkoutErrorHandler.getSuggestedAction(error);
          
          this.error = `${userMessage} ${suggestedAction}`;
          
          console.error('Secure checkout error:', {
            originalError: error,
            userMessage,
            suggestedAction,
            errorType: this.checkoutErrorHandler.getErrorType(error),
            retryable: this.checkoutErrorHandler.isRetryable(error)
          });
        }
      });
  }

  /**
   * Create payment intent for the order
   */
  private createPaymentIntent(): Observable<any> { // Changed to any as PaymentIntentRequest is removed
    const formData = this.checkoutForm.value;
    
    const request: any = { // Changed to any as PaymentIntentRequest is removed
      orderItems: this.cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      })),
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone
      }
    };

    return this.stripeService.createGuestPaymentIntent(request);
  }

  /**
   * Process payment with Stripe
   */
  private processStripePayment(clientSecret: string): Observable<PaymentResult> {
    console.log('Processing Stripe payment...');
    console.log('Client secret received:', clientSecret);
    console.log('Client secret type:', typeof clientSecret);
    console.log('Client secret length:', clientSecret?.length);
    console.log('Stripe elements ready:', this.stripeElementsReady);
    
    if (!this.stripeElementsReady) {
      return throwError(() => new Error('Payment form failed to load. Please refresh the page and try again.'));
    }
    
    if (!clientSecret || typeof clientSecret !== 'string') {
      return throwError(() => new Error('Invalid client secret provided'));
    }
    
    return this.stripeService.processPaymentWithCard(clientSecret);
  }

  /**
   * Create order after successful payment
   */
  private createOrderAfterPayment(paymentResult: PaymentResult): Observable<any> {
    const formData = this.checkoutForm.value;
    
    const orderData = {
      orderItems: this.cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      })),
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone
      },
      paymentIntentId: paymentResult.paymentIntentId
    };

    return this.orderService.createGuestOrder(orderData);
  }

  /**
   * Verify order creation and payment confirmation
   */
  private verifyOrderCreation(orderId: string): Observable<any> {
    if (!orderId) {
      return throwError(() => new Error('Order ID not provided for verification'));
    }

    // Get customer email from form data for guest order verification
    const formData = this.checkoutForm.value;
    const customerEmail = formData.email;

    if (!customerEmail) {
      return throwError(() => new Error('Customer email required for guest order verification'));
    }

    // Use the new PaymentConfirmationService for robust verification
    const verificationData: OrderVerificationData = {
      orderId: orderId,
      customerEmail: customerEmail,
      paymentIntentId: this.paymentIntentId || undefined
    };

    return this.paymentConfirmationService.verifyOrderWithPayment(verificationData).pipe(
      map((result) => {
        console.log('PaymentConfirmationService: Verification result', result);
        
        if (!result.success) {
          throw new Error(result.error || 'Order verification failed');
        }

        return {
          order: { id: result.orderId, status: result.orderStatus },
          verified: true,
          paymentStatus: result.paymentStatus
        };
      }),
      catchError(error => {
        console.error('Order verification failed:', error);
        return throwError(() => new Error('Order verification failed: ' + error.message));
      })
    );
  }

  /**
   * Process authenticated user checkout
   */
  private processAuthenticatedCheckout(orderItems: any[], shippingAddress: any): Observable<any> {
    const orderData = {
      items: orderItems,
      shippingAddress,
      billingAddress: shippingAddress,
      paymentMethod: { 
        type: 'stripe' as const
      }
    };

    return this.orderService.createOrder(orderData);
  }

  /**
   * Process guest checkout
   */
  private processGuestCheckout(orderItems: any[], shippingAddress: any, formData: any): Observable<any> {
    const guestOrderData = {
      orderItems,
      shippingAddress,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      }
    };

    return this.orderService.createGuestOrder(guestOrderData);
  }

  /**
   * Clean invalid items from cart
   */
  private cleanInvalidCartItems(invalidProductIds: string[]): void {
    console.log('Cleaning invalid items from cart:', invalidProductIds);
    
    // Remove invalid items from cart
    const validItems = this.cart.items.filter(item => 
      !invalidProductIds.includes(item.productId)
    );

    if (validItems.length !== this.cart.items.length) {
      // Update cart with only valid items
      this.cart.items = validItems;
      this.cartService.forceClearCart(); // Force refresh cart
      
      // Show user feedback
      setTimeout(() => {
        this.error = 'Some items were removed from your cart as they are no longer available.';
      }, 1000);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
} 