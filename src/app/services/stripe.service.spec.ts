import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StripeService, PaymentIntentRequest, PaymentIntentResponse } from './stripe.service';
import { environment } from '../../environments/environment';

describe('StripeService', () => {
  let service: StripeService;
  let httpMock: HttpTestingController;

  // Mock Stripe
  const mockStripe = {
    elements: jasmine.createSpy('elements').and.returnValue({
      create: jasmine.createSpy('create').and.returnValue({
        mount: jasmine.createSpy('mount'),
        destroy: jasmine.createSpy('destroy'),
        clear: jasmine.createSpy('clear'),
        error: null
      })
    }),
    createPaymentMethod: jasmine.createSpy('createPaymentMethod').and.returnValue(
      Promise.resolve({
        paymentMethod: { id: 'pm_test_123' },
        error: null
      })
    ),
    confirmPayment: jasmine.createSpy('confirmPayment').and.returnValue(
      Promise.resolve({
        paymentIntent: {
          id: 'pi_test_123',
          status: 'succeeded',
          amount: 12999,
          currency: 'usd'
        },
        error: null
      })
    )
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StripeService]
    });

    service = TestBed.inject(StripeService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock window.Stripe
    (window as any).Stripe = jasmine.createSpy('Stripe').and.returnValue(mockStripe);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createGuestPaymentIntent', () => {
    it('should create payment intent for guest user', () => {
      const mockRequest: PaymentIntentRequest = {
        orderItems: [
          { productId: 'prod_123', quantity: 1, price: 129.99 }
        ],
        customerInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        }
      };

      const mockResponse: PaymentIntentResponse = {
        clientSecret: 'pi_test_123_secret_abc',
        paymentIntentId: 'pi_test_123',
        amount: 129.99,
        currency: 'usd',
        customerId: 'cus_test_123'
      };

      service.createGuestPaymentIntent(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/guest/payment-intent`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      
      req.flush({ success: true, data: mockResponse });
    });

    it('should handle payment intent creation error', () => {
      const mockRequest: PaymentIntentRequest = {
        orderItems: [],
        customerInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      };

      service.createGuestPaymentIntent(mockRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Payment intent creation failed');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/guest/payment-intent`);
      req.flush({ success: false, error: { message: 'Invalid request' } }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('processPayment', () => {
    it('should process payment successfully', (done) => {
      const clientSecret = 'pi_test_123_secret_abc';
      const paymentMethod = { id: 'pm_test_123' };

      service.processPayment(clientSecret, paymentMethod).subscribe(result => {
        expect(result).toEqual({
          paymentIntentId: 'pi_test_123',
          status: 'succeeded',
          amount: 129.99,
          currency: 'usd'
        });
        done();
      });

      // Verify Stripe methods were called
      expect(mockStripe.confirmPayment).toHaveBeenCalledWith({
        clientSecret: clientSecret,
        payment_method: paymentMethod,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`
        }
      });
    });

    it('should handle payment processing error', (done) => {
      const clientSecret = 'pi_test_123_secret_abc';
      
      // Mock Stripe error
      mockStripe.confirmPayment.and.returnValue(
        Promise.resolve({
          error: { message: 'Your card was declined.' }
        })
      );

      service.processPayment(clientSecret).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Your card was declined.');
          done();
        }
      });
    });
  });

  describe('createCardElement', () => {
    it('should create and mount card element', (done) => {
      // Create a mock DOM element
      const mockElement = document.createElement('div');
      mockElement.id = 'test-card-element';
      document.body.appendChild(mockElement);

      service.createCardElement('test-card-element').subscribe({
        next: () => {
          expect(mockStripe.elements).toHaveBeenCalled();
          expect(mockStripe.elements().create).toHaveBeenCalledWith('card', jasmine.any(Object));
          document.body.removeChild(mockElement);
          done();
        },
        error: (error) => {
          document.body.removeChild(mockElement);
          fail(error);
        }
      });
    });

    it('should handle missing container element', (done) => {
      service.createCardElement('non-existent-element').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Container non-existent-element not found');
          done();
        }
      });
    });
  });

  describe('formatAmount', () => {
    it('should format amount correctly in USD', () => {
      const formatted = service.formatAmount(129.99, 'usd');
      expect(formatted).toBe('$129.99');
    });

    it('should format amount correctly with default currency', () => {
      const formatted = service.formatAmount(129.99);
      expect(formatted).toBe('$129.99');
    });
  });

  describe('isStripeAvailable', () => {
    it('should return true when Stripe is available', () => {
      expect(service.isStripeAvailable()).toBe(true);
    });

    it('should return false when Stripe is not available', () => {
      // Temporarily remove Stripe
      const originalStripe = (service as any).stripe;
      (service as any).stripe = null;
      
      expect(service.isStripeAvailable()).toBe(false);
      
      // Restore Stripe
      (service as any).stripe = originalStripe;
    });
  });

  describe('card element management', () => {
    beforeEach(() => {
      // Initialize card element
      const mockElement = document.createElement('div');
      mockElement.id = 'test-card-element';
      document.body.appendChild(mockElement);
    });

    it('should clear card element', () => {
      service.clearCardElement();
      // This test mainly ensures no errors are thrown
      expect(true).toBe(true);
    });

    it('should destroy card element', () => {
      service.destroyCardElement();
      // This test mainly ensures no errors are thrown
      expect(true).toBe(true);
    });
  });
}); 