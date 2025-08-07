import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, interval, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { CartService } from './cart.service';
import { ProductValidationService } from './product-validation.service';

export interface CartHealthMetrics {
  totalItems: number;
  validItems: number;
  invalidItems: number;
  corruptedItems: number;
  lastValidation: Date;
  healthScore: number; // 0-100
  issues: string[];
  recommendations: string[];
}

export interface CartHealthReport {
  timestamp: Date;
  metrics: CartHealthMetrics;
  actionTaken: string | null;
  performance: {
    validationTime: number;
    cleanupTime: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartHealthService {
  private readonly HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly CART_KEY = 'E_COMMERCE_CART';
  private readonly HEALTH_LOG_KEY = 'CART_HEALTH_LOG';
  
  private healthSubject = new BehaviorSubject<CartHealthMetrics>({
    totalItems: 0,
    validItems: 0,
    invalidItems: 0,
    corruptedItems: 0,
    lastValidation: new Date(),
    healthScore: 100,
    issues: [],
    recommendations: []
  });

  public health$ = this.healthSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService,
    private productValidationService: ProductValidationService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.startHealthMonitoring();
    }
  }

  /**
   * Start automatic cart health monitoring
   */
  private startHealthMonitoring(): void {
    // Initial health check
    this.performHealthCheck();

    // Set up periodic health checks
    interval(this.HEALTH_CHECK_INTERVAL).subscribe(() => {
      this.performHealthCheck();
    });
  }

  /**
   * Perform comprehensive cart health check
   */
  performHealthCheck(): Observable<CartHealthReport> {
    const startTime = Date.now();
    
    return new Observable(observer => {
      try {
        const cart = this.cartService.currentCart;
        const metrics = this.calculateHealthMetrics(cart);
        
        // Validate cart items
        const productIds = cart.items.map(item => item.productId);
        
        if (productIds.length === 0) {
          // Empty cart - healthy state
          this.updateHealthMetrics(metrics);
          observer.next({
            timestamp: new Date(),
            metrics,
            actionTaken: null,
            performance: {
              validationTime: Date.now() - startTime,
              cleanupTime: 0
            }
          });
          observer.complete();
          return;
        }

        this.productValidationService.validateProducts(productIds)
          .subscribe({
            next: (validationResult) => {
              const validationTime = Date.now() - startTime;
              
              // Update metrics with validation results
              metrics.validItems = validationResult.validProducts.length;
              metrics.invalidItems = validationResult.invalidProducts.length;
              metrics.lastValidation = new Date();
              
              // Calculate health score
              metrics.healthScore = this.calculateHealthScore(metrics);
              
              // Identify issues and recommendations
              this.identifyIssuesAndRecommendations(metrics, validationResult);
              
              // Take action if needed
              const actionTaken = this.takeCorrectiveAction(metrics, validationResult);
              
              // Update health metrics
              this.updateHealthMetrics(metrics);
              
              // Log health report
              const report: CartHealthReport = {
                timestamp: new Date(),
                metrics,
                actionTaken,
                performance: {
                  validationTime,
                  cleanupTime: Date.now() - startTime - validationTime
                }
              };
              
              this.logHealthReport(report);
              observer.next(report);
              observer.complete();
            },
            error: (error) => {
              console.error('Cart health check failed:', error);
              metrics.healthScore = 0;
              metrics.issues.push('Health check failed');
              metrics.recommendations.push('Manual intervention required');
              
              this.updateHealthMetrics(metrics);
              observer.error(error);
            }
          });
      } catch (error) {
        console.error('Cart health check error:', error);
        observer.error(error);
      }
    });
  }

  /**
   * Calculate health metrics from cart data
   */
  private calculateHealthMetrics(cart: any): CartHealthMetrics {
    const totalItems = cart.items?.length || 0;
    const corruptedItems = this.countCorruptedItems(cart.items || []);
    
    return {
      totalItems,
      validItems: 0, // Will be updated after validation
      invalidItems: 0, // Will be updated after validation
      corruptedItems,
      lastValidation: new Date(),
      healthScore: 100,
      issues: [],
      recommendations: []
    };
  }

  /**
   * Count corrupted items in cart
   */
  private countCorruptedItems(items: any[]): number {
    return items.filter(item => {
      return !item || 
             !item.productId || 
             !item.name || 
             typeof item.quantity !== 'number' ||
             item.quantity <= 0 ||
             typeof item.price !== 'number' ||
             item.price < 0;
    }).length;
  }

  /**
   * Calculate health score (0-100)
   */
  private calculateHealthScore(metrics: CartHealthMetrics): number {
    if (metrics.totalItems === 0) return 100;
    
    const validRatio = metrics.validItems / metrics.totalItems;
    const corruptedRatio = metrics.corruptedItems / metrics.totalItems;
    
    let score = validRatio * 100;
    score -= corruptedRatio * 50; // Corrupted items heavily penalize score
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Identify issues and provide recommendations
   */
  private identifyIssuesAndRecommendations(metrics: CartHealthMetrics, validationResult: any): void {
    metrics.issues = [];
    metrics.recommendations = [];

    if (metrics.invalidItems > 0) {
      metrics.issues.push(`${metrics.invalidItems} invalid items detected`);
      metrics.recommendations.push('Remove invalid items from cart');
    }

    if (metrics.corruptedItems > 0) {
      metrics.issues.push(`${metrics.corruptedItems} corrupted items detected`);
      metrics.recommendations.push('Clean corrupted cart data');
    }

    if (metrics.healthScore < 50) {
      metrics.issues.push('Cart health score is critically low');
      metrics.recommendations.push('Perform cart cleanup');
    }

    if (metrics.totalItems > 20) {
      metrics.issues.push('Cart contains many items');
      metrics.recommendations.push('Consider splitting large orders');
    }
  }

  /**
   * Take corrective action based on health metrics
   */
  private takeCorrectiveAction(metrics: CartHealthMetrics, validationResult: any): string | null {
    if (metrics.invalidItems > 0) {
      // Remove invalid items
      this.removeInvalidItems(validationResult.invalidProducts);
      return `Removed ${metrics.invalidItems} invalid items`;
    }

    if (metrics.corruptedItems > 0) {
      // Clean corrupted cart
      this.cartService.forceClearCart();
      return `Cleaned corrupted cart data`;
    }

    if (metrics.healthScore < 30) {
      // Emergency cart reset
      this.cartService.forceClearCart();
      return 'Emergency cart reset due to critical health issues';
    }

    return null;
  }

  /**
   * Remove invalid items from cart
   */
  private removeInvalidItems(invalidProductIds: string[]): void {
    const cart = this.cartService.currentCart;
    const validItems = cart.items.filter(item => 
      !invalidProductIds.includes(item.productId)
    );

    if (validItems.length !== cart.items.length) {
      // Update cart with only valid items
      const updatedCart = { ...cart, items: validItems };
      this.cartService['cartSubject'].next(updatedCart);
      this.cartService['saveCartToStorage'](updatedCart);
    }
  }

  /**
   * Update health metrics
   */
  private updateHealthMetrics(metrics: CartHealthMetrics): void {
    this.healthSubject.next(metrics);
  }

  /**
   * Log health report for monitoring
   */
  private logHealthReport(report: CartHealthReport): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const logs = this.getHealthLogs();
      logs.push(report);
      
      // Keep only last 100 reports
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem(this.HEALTH_LOG_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log health report:', error);
    }
  }

  /**
   * Get health logs
   */
  getHealthLogs(): CartHealthReport[] {
    if (!isPlatformBrowser(this.platformId)) return [];

    try {
      const logs = localStorage.getItem(this.HEALTH_LOG_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to get health logs:', error);
      return [];
    }
  }

  /**
   * Get current health metrics
   */
  getCurrentHealth(): CartHealthMetrics {
    return this.healthSubject.value;
  }

  /**
   * Force health check
   */
  forceHealthCheck(): Observable<CartHealthReport> {
    return this.performHealthCheck();
  }

  /**
   * Clear health logs
   */
  clearHealthLogs(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.HEALTH_LOG_KEY);
    }
  }
} 