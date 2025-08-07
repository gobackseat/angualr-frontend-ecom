import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ProductValidationResult {
  isValid: boolean;
  productId: string;
  errors: string[];
  warnings: string[];
  product?: any;
}

export interface BulkValidationResult {
  validProducts: string[];
  invalidProducts: string[];
  results: ProductValidationResult[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductValidationService {
  private readonly API_URL = environment.apiUrl;
  private readonly VALIDATION_CACHE = new Map<string, { result: ProductValidationResult; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds

  constructor(private http: HttpClient) {}

  /**
   * Validate a single product ID against the backend
   * Production-ready with caching and error handling
   */
  validateProduct(productId: string): Observable<ProductValidationResult> {
    if (!productId || typeof productId !== 'string') {
      return of({
        isValid: false,
        productId,
        errors: ['Invalid product ID format'],
        warnings: []
      });
    }

    // Check cache first
    const cached = this.VALIDATION_CACHE.get(productId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return of(cached.result);
    }

    return this.http.get<any>(`${this.API_URL}/products/id/${productId}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => {
          const result: ProductValidationResult = {
            isValid: true,
            productId,
            errors: [],
            warnings: [],
            product: response.data || response
          };

          // Additional validation checks
          const warnings = this.validateProductData(result.product);
          result.warnings = warnings;

          // Cache the result
          this.VALIDATION_CACHE.set(productId, {
            result,
            timestamp: Date.now()
          });

          return result;
        }),
        catchError(error => {
          const result: ProductValidationResult = {
            isValid: false,
            productId,
            errors: [this.getErrorMessage(error)],
            warnings: []
          };

          // Cache negative results for a shorter time
          this.VALIDATION_CACHE.set(productId, {
            result,
            timestamp: Date.now()
          });

          return of(result);
        })
      );
  }

  /**
   * Validate multiple product IDs in bulk
   * Optimized for performance with parallel requests
   */
  validateProducts(productIds: string[]): Observable<BulkValidationResult> {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return of({
        validProducts: [],
        invalidProducts: [],
        results: []
      });
    }

    // Remove duplicates and invalid IDs
    const uniqueIds = [...new Set(productIds)].filter(id => 
      id && typeof id === 'string' && id.trim().length > 0
    );

    if (uniqueIds.length === 0) {
      return of({
        validProducts: [],
        invalidProducts: [],
        results: []
      });
    }

    // Create parallel validation requests
    const validationRequests = uniqueIds.map(id => this.validateProduct(id));

    return new Observable(observer => {
      const results: ProductValidationResult[] = [];
      let completed = 0;

      validationRequests.forEach(request => {
        request.subscribe({
          next: (result) => {
            results.push(result);
            completed++;

            if (completed === validationRequests.length) {
              const validProducts = results
                .filter(r => r.isValid)
                .map(r => r.productId);
              
              const invalidProducts = results
                .filter(r => !r.isValid)
                .map(r => r.productId);

              observer.next({
                validProducts,
                invalidProducts,
                results
              });
              observer.complete();
            }
          },
          error: (error) => {
            completed++;
            results.push({
              isValid: false,
              productId: 'unknown',
              errors: [this.getErrorMessage(error)],
              warnings: []
            });

            if (completed === validationRequests.length) {
              const validProducts = results
                .filter(r => r.isValid)
                .map(r => r.productId);
              
              const invalidProducts = results
                .filter(r => !r.isValid)
                .map(r => r.productId);

              observer.next({
                validProducts,
                invalidProducts,
                results
              });
              observer.complete();
            }
          }
        });
      });
    });
  }

  /**
   * Validate product data structure and content
   */
  private validateProductData(product: any): string[] {
    const warnings: string[] = [];

    if (!product) {
      warnings.push('Product data is null or undefined');
      return warnings;
    }

    // Check required fields with flexible field names
    const idField = product._id || product.id;
    const nameField = product.name;
    const priceField = product.basePrice || product.price;
    const stockField = product.totalStock || product.stockQuantity;

    if (!idField) {
      warnings.push('Missing required field: id');
    }
    if (!nameField) {
      warnings.push('Missing required field: name');
    }
    if (!priceField) {
      warnings.push('Missing required field: price');
    }
    if (!stockField) {
      warnings.push('Missing required field: stock');
    }

    // Validate price
    if (priceField && (typeof priceField !== 'number' || priceField < 0)) {
      warnings.push('Invalid price');
    }

    // Validate stock
    if (stockField && (typeof stockField !== 'number' || stockField < 0)) {
      warnings.push('Invalid stock quantity');
    }

    // Validate images
    if (product.mainImage && typeof product.mainImage !== 'string') {
      warnings.push('Invalid main image format');
    }

    // Validate variants
    if (product.colorVariants && !Array.isArray(product.colorVariants)) {
      warnings.push('Invalid color variants format');
    }

    if (product.sizeVariants && !Array.isArray(product.sizeVariants)) {
      warnings.push('Invalid size variants format');
    }

    return warnings;
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.VALIDATION_CACHE.clear();
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.VALIDATION_CACHE.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.VALIDATION_CACHE.delete(key);
      }
    }
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'Product not found';
    } else if (error.status === 400) {
      return 'Invalid product ID';
    } else if (error.status === 500) {
      return 'Server error occurred';
    } else if (error.name === 'TimeoutError') {
      return 'Request timeout';
    } else {
      return 'Validation failed';
    }
  }

  /**
   * Check if a product ID format is valid (without making HTTP request)
   */
  isValidProductIdFormat(productId: string): boolean {
    return Boolean(productId && 
           typeof productId === 'string' && 
           productId.trim().length > 0 &&
           /^[a-fA-F0-9]{24}$/.test(productId)); // MongoDB ObjectId format
  }
} 