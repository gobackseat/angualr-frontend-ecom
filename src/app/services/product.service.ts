import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, shareReplay, retry, timeout, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Enhanced Product Interface matching backend schema
export interface Product {
  _id: string;
  id: string; // Virtual field for compatibility
  name: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  basePrice: number;
  originalPrice: number;
  compareAtPrice: number;
  costPrice: number;
  totalStock: number;
  lowStockThreshold: number;
  sku: string;
  barcode: string;
  mainImage: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  subcategory: string;
  brand: string;
  tags: string[];
  weight: number;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  specifications: { [key: string]: string };
  features: string[];
  careInstructions: string[];
  compatibility: string[];
  warranty: string;
  shipping: string;
  averageRating: number;
  totalReviews: number;
  viewCount: number;
  purchaseCount: number;
  wishlistCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  requiresShipping: boolean;
  shippingClass: string;
  cacheVersion: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  
  // Color Variants
  colorVariants: ColorVariant[];
  
  // Size Variants
  sizeVariants: SizeVariant[];
  
  // Reviews
  reviews: Review[];
  
  // Virtual fields for frontend compatibility
  price: number; // Alias for basePrice
  images: string[]; // Alias for mainImage
  inStock: boolean; // Virtual field
  stockQuantity: number; // Alias for totalStock
  ratings: { average: number; count: number }; // Alias for averageRating and totalReviews
  salePercentage: number; // Virtual field
  colors: string[]; // Virtual field from colorVariants
  sizes: string[]; // Virtual field from sizeVariants
}

export interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
  heroImages: string[];
  isActive: boolean;
  stockQuantity: number;
  price: number;
  originalPrice: number;
}

export interface SizeVariant {
  name: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  weightCapacity: number;
  isActive: boolean;
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  color?: string;
  size?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  tags?: string[];
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'basePrice' | 'averageRating' | 'viewCount' | 'purchaseCount' | 'createdAt' | 'totalReviews';
  direction: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  product: Product;
  relatedProducts: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = environment.apiUrl;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  
  // State management with BehaviorSubjects
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private currentProductSubject = new BehaviorSubject<Product | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private filtersSubject = new BehaviorSubject<ProductFilters>({});
  private sortSubject = new BehaviorSubject<ProductSort>({ field: 'createdAt', direction: 'desc' });

  // Public observables
  public products$ = this.productsSubject.asObservable();
  public currentProduct$ = this.currentProductSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public filters$ = this.filtersSubject.asObservable();
  public sort$ = this.sortSubject.asObservable();

  // Advanced caching for 100k users
  private productCache = new Map<string, { data: Product; timestamp: number }>();
  private productsCache = new Map<string, { data: ProductsResponse; timestamp: number }>();
  private categoriesCache: string[] | null = null;
  private brandsCache: string[] | null = null;
  private featuredProductsCache: Product[] | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Clear cache periodically in browser
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => this.clearExpiredCache(), this.CACHE_TTL);
    }
  }

  // ==================== PUBLIC API METHODS ====================

  getProducts(
    page: number = 1,
    limit: number = 12,
    filters: ProductFilters = {},
    sort: ProductSort = { field: 'createdAt', direction: 'desc' }
  ): Observable<ProductsResponse> {
    const cacheKey = this.generateCacheKey('products', { page, limit, filters, sort });
    const cached = this.getCachedProducts(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    this.setLoading(true);
    this.clearError();

    const params = this.buildQueryParams(page, limit, filters, sort);

    return this.http.get<ProductsResponse>(`${this.API_URL}/products/all`, { params })
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => this.transformProductsResponse(response)),
        tap(response => {
          this.productsSubject.next(response.products);
          this.cacheProducts(cacheKey, response);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return throwError(() => error);
        }),
        shareReplay(1)
      );
  }

  getProduct(id: string): Observable<Product> {
    const cached = this.getCachedProduct(id);
    if (cached) {
      this.currentProductSubject.next(cached);
      return of(cached);
    }

    this.setLoading(true);
    this.clearError();

    return this.http.get<{ data: Product }>(`${this.API_URL}/products/id/${id}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => this.transformProduct(response.data || response)),
        tap(product => {
          this.currentProductSubject.next(product);
          this.cacheProduct(id, product);
          this.incrementViewCount(id).subscribe(); // Async view count increment
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return throwError(() => error);
        }),
        shareReplay(1)
      );
  }

  getProductBySlug(slug: string): Observable<Product> {
    const cached = this.getCachedProduct(slug);
    if (cached) {
      this.currentProductSubject.next(cached);
      return of(cached);
    }

    this.setLoading(true);
    this.clearError();

    return this.http.get<{ data: Product }>(`${this.API_URL}/products/slug/${slug}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => this.transformProduct(response.data || response)),
        tap(product => {
          this.currentProductSubject.next(product);
          this.cacheProduct(slug, product);
          this.incrementViewCount(product._id).subscribe();
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(this.handleError(error));
          this.setLoading(false);
          return throwError(() => error);
        }),
        shareReplay(1)
      );
  }

  getFeaturedProducts(limit: number = 6): Observable<Product[]> {
    if (this.featuredProductsCache) {
      return of(this.featuredProductsCache);
    }

    return this.http.get<{ data: { products: Product[] } }>(`${this.API_URL}/products/featured?limit=${limit}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => {
          const products = (response.data?.products || []).map(p => this.transformProduct(p));
          this.featuredProductsCache = products;
          return products;
        }),
        catchError(error => {
          console.error('Error fetching featured products:', error);
          return of([]);
        }),
        shareReplay(1)
      );
  }

  getProductColorVariants(productId: string): Observable<ColorVariant[]> {
    return this.http.get<{ data: ColorVariant[] }>(`${this.API_URL}/products/${productId}/colors`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => response.data || response || []),
        catchError(error => {
          console.error('Error fetching color variants:', error);
          return of([]);
        })
      );
  }

  searchProducts(query: string, limit: number = 12): Observable<Product[]> {
    if (!query.trim()) return of([]);

    const params = new HttpParams()
      .set('q', query.trim())
      .set('limit', limit.toString());

    return this.http.get<{ data: { products: Product[] } }>(`${this.API_URL}/products/search`, { params })
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => (response.data?.products || []).map(p => this.transformProduct(p))),
        catchError(error => {
          console.error('Error searching products:', error);
          return of([]);
        })
      );
  }

  getProductsByCategory(category: string, limit: number = 12): Observable<Product[]> {
    const params = new HttpParams()
      .set('limit', limit.toString());

    return this.http.get<{ data: { products: Product[] } }>(`${this.API_URL}/products/category/${category}`, { params })
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => (response.data?.products || []).map(p => this.transformProduct(p))),
        catchError(error => {
          console.error('Error fetching products by category:', error);
          return of([]);
        })
      );
  }

  getCategories(): Observable<string[]> {
    if (this.categoriesCache) {
      return of(this.categoriesCache);
    }

    return this.http.get<{ data: string[] }>(`${this.API_URL}/products/categories`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => {
          const categories = response.data || response || [];
          this.categoriesCache = categories;
          return categories;
        }),
        catchError(error => {
          console.error('Error fetching categories:', error);
          return of([]);
        })
      );
  }

  getBrands(): Observable<string[]> {
    if (this.brandsCache) {
      return of(this.brandsCache);
    }

    return this.http.get<{ data: string[] }>(`${this.API_URL}/products/brands`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => {
          const brands = response.data || response || [];
          this.brandsCache = brands;
          return brands;
        }),
        catchError(error => {
          console.error('Error fetching brands:', error);
          return of([]);
        })
      );
  }

  // ==================== UTILITY METHODS ====================

  get currentProducts(): Product[] {
    return this.productsSubject.value;
  }

  get currentProduct(): Product | null {
    return this.currentProductSubject.value;
  }

  get currentFilters(): ProductFilters {
    return this.filtersSubject.value;
  }

  get currentSort(): ProductSort {
    return this.sortSubject.value;
  }

  updateFilters(filters: ProductFilters): void {
    this.filtersSubject.next(filters);
  }

  updateSort(sort: ProductSort): void {
    this.sortSubject.next(sort);
  }

  clearCache(): void {
    this.productCache.clear();
    this.productsCache.clear();
    this.categoriesCache = null;
    this.brandsCache = null;
    this.featuredProductsCache = null;
  }

  // ==================== PRIVATE METHODS ====================

  private transformProduct(backendProduct: any): Product {
    if (!backendProduct) return null as any;

    const product: Product = {
      ...backendProduct,
      id: backendProduct._id || backendProduct.id,
      price: backendProduct.basePrice || backendProduct.price,
      images: [backendProduct.mainImage || backendProduct.images?.[0] || ''],
      inStock: (backendProduct.totalStock || backendProduct.stockQuantity || 0) > 0,
      stockQuantity: backendProduct.totalStock || backendProduct.stockQuantity || 0,
      ratings: {
        average: backendProduct.averageRating || 0,
        count: backendProduct.totalReviews || 0
      },
      colors: backendProduct.colorVariants?.map((cv: ColorVariant) => cv.name) || [],
      sizes: backendProduct.sizeVariants?.map((sv: SizeVariant) => sv.name) || [],
      salePercentage: this.calculateDiscountPercentage(
        backendProduct.originalPrice || backendProduct.basePrice,
        backendProduct.basePrice || backendProduct.price
      )
    };

    return product;
  }

  private transformProductsResponse(response: any): ProductsResponse {
    const products = (response.data?.products || response.products || []).map((p: any) => this.transformProduct(p));
    
    return {
      products,
      total: response.data?.total || response.total || products.length,
      page: response.data?.page || response.page || 1,
      limit: response.data?.limit || response.limit || 12,
      totalPages: response.data?.totalPages || response.totalPages || 1,
      pagination: response.data?.pagination || response.pagination || {
        page: response.data?.page || response.page || 1,
        limit: response.data?.limit || response.limit || 12,
        total: response.data?.total || response.total || products.length,
        totalPages: response.data?.totalPages || response.totalPages || 1
      }
    };
  }

  private buildQueryParams(page: number, limit: number, filters: ProductFilters, sort: ProductSort): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', `${sort.field}:${sort.direction}`);

    if (filters.category) params = params.set('category', filters.category);
    if (filters.subcategory) params = params.set('subcategory', filters.subcategory);
    if (filters.brand) params = params.set('brand', filters.brand);
    if (filters.color) params = params.set('color', filters.color);
    if (filters.size) params = params.set('size', filters.size);
    if (filters.rating) params = params.set('rating', filters.rating.toString());
    if (filters.inStock !== undefined) params = params.set('inStock', filters.inStock.toString());
    if (filters.isFeatured !== undefined) params = params.set('isFeatured', filters.isFeatured.toString());
    if (filters.isOnSale !== undefined) params = params.set('isOnSale', filters.isOnSale.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) params = params.set('minPrice', filters.priceRange.min.toString());
      if (filters.priceRange.max !== undefined) params = params.set('maxPrice', filters.priceRange.max.toString());
    }
    if (filters.tags?.length) params = params.set('tags', filters.tags.join(','));

    return params;
  }

  private generateCacheKey(type: string, params: any): string {
    return `${type}:${JSON.stringify(params)}`;
  }

  private getCachedProduct(key: string): Product | null {
    const cached = this.productCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private getCachedProducts(key: string): ProductsResponse | null {
    const cached = this.productsCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private cacheProduct(key: string, product: Product): void {
    this.productCache.set(key, { data: product, timestamp: Date.now() });
  }

  private cacheProducts(key: string, response: ProductsResponse): void {
    this.productsCache.set(key, { data: response, timestamp: Date.now() });
  }

  private clearExpiredCache(): void {
    const now = Date.now();
    
    // Clear expired product cache
    for (const [key, value] of this.productCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.productCache.delete(key);
      }
    }
    
    // Clear expired products cache
    for (const [key, value] of this.productsCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.productsCache.delete(key);
      }
    }
  }

  incrementViewCount(productId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/products/${productId}/view`, {}).pipe(
      catchError(error => {
        console.error('Error incrementing view count:', error);
        return of(void 0);
      })
    );
  }

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
    if (error.status === 404) {
      return 'Product not found';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else if (error.status === 0) {
      return 'Network error. Please check your connection.';
    } else {
      return error.error?.message || error.message || 'An unexpected error occurred';
    }
  }

  // ==================== UTILITY METHODS ====================

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  }

  calculateDiscountPercentage(originalPrice: number, currentPrice: number): number {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  isOnSale(product: Product): boolean {
    return Boolean(product.isOnSale) || Boolean(product.originalPrice && product.originalPrice > product.basePrice);
  }

  getRatingStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  getMainColorVariant(product: Product): ColorVariant | null {
    return product.colorVariants?.find(cv => cv.isActive) || product.colorVariants?.[0] || null;
  }

  getColorVariantByName(product: Product, colorName: string): ColorVariant | null {
    return product.colorVariants?.find(cv => cv.name.toLowerCase() === colorName.toLowerCase()) || null;
  }

  getSizeVariantByName(product: Product, sizeName: string): SizeVariant | null {
    return product.sizeVariants?.find(sv => sv.name.toLowerCase() === sizeName.toLowerCase()) || null;
  }
} 