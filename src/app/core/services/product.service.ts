import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, retry, timeout, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Product {
  _id: string;
  id: string;
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
  colorVariants: ColorVariant[];
  sizeVariants: SizeVariant[];
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
  lastViewedAt: string;
  // Virtual fields for compatibility
  price: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  ratings: { average: number; count: number };
  colors: string[];
  sizes: string[];
  salePercentage: number;
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
  content: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  status: string;
  message: string;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  isOnSale?: boolean;
  tags?: string[];
  colors?: string[];
  sizes?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = environment.apiUrl;
  private readonly REQUEST_TIMEOUT = 15000; // 15 seconds for production
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Production-ready caching
  private productCache = new Map<string, { data: Product; timestamp: number }>();
  private productsCache = new Map<string, { data: Product[]; timestamp: number }>();

  constructor(private http: HttpClient) {}

  /**
   * Get all products with advanced filtering and pagination
   */
  getProducts(
    page: number = 1,
    limit: number = 12,
    filters: ProductFilters = {},
    sort: string = 'createdAt:desc'
  ): Observable<ProductsResponse> {
    const cacheKey = `products_${page}_${limit}_${JSON.stringify(filters)}_${sort}`;
    const cached = this.productsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return of({ status: 'success', message: 'Products retrieved from cache', data: { products: cached.data, pagination: { page, limit, total: cached.data.length, pages: Math.ceil(cached.data.length / limit) } } });
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort);

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params = params.append(key, v.toString()));
        } else {
          params = params.set(key, value.toString());
        }
      }
    });

    return this.http.get<ProductsResponse>(`${this.API_URL}/products/all`, { params })
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => {
          // Cache the results
          this.productsCache.set(cacheKey, { data: response.data.products, timestamp: Date.now() });
          return response;
        }),
        catchError(error => {
          console.error('Error fetching products:', error);
          return throwError(() => new Error('Failed to load products. Please try again.'));
        }),
        shareReplay(1)
      );
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Observable<Product> {
    const cacheKey = `product_${id}`;
    const cached = this.productCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return of(cached.data);
    }

    return this.http.get<{ status: string; message: string; data: Product }>(`${this.API_URL}/products/id/${id}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => {
          const product = response.data;
          // Add virtual fields for compatibility
          product.price = product.basePrice;
          product.images = product.colorVariants?.[0]?.images || [product.mainImage];
          product.inStock = product.totalStock > 0;
          product.stockQuantity = product.totalStock;
          product.ratings = { average: product.averageRating, count: product.totalReviews };
          product.colors = product.colorVariants?.map(cv => cv.name) || [];
          product.sizes = product.sizeVariants?.map(sv => sv.name) || [];
          product.salePercentage = product.originalPrice > product.basePrice 
            ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
            : 0;
          
          // Cache the product
          this.productCache.set(cacheKey, { data: product, timestamp: Date.now() });
          return product;
        }),
        catchError(error => {
          console.error('Error fetching product:', error);
          return throwError(() => new Error('Failed to load product details. Please try again.'));
        }),
        shareReplay(1)
      );
  }

  /**
   * Get product by slug
   */
  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<{ status: string; message: string; data: Product }>(`${this.API_URL}/products/slug/${slug}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => {
          const product = response.data;
          // Add virtual fields for compatibility
          product.price = product.basePrice;
          product.images = product.colorVariants?.[0]?.images || [product.mainImage];
          product.inStock = product.totalStock > 0;
          product.stockQuantity = product.totalStock;
          product.ratings = { average: product.averageRating, count: product.totalReviews };
          product.colors = product.colorVariants?.map(cv => cv.name) || [];
          product.sizes = product.sizeVariants?.map(sv => sv.name) || [];
          product.salePercentage = product.originalPrice > product.basePrice 
            ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
            : 0;
          return product;
        }),
        catchError(error => {
          console.error('Error fetching product by slug:', error);
          return throwError(() => new Error('Failed to load product details. Please try again.'));
        }),
        shareReplay(1)
      );
  }

  /**
   * Get color variants for a product
   */
  getProductColorVariants(productId: string): Observable<ColorVariant[]> {
    return this.http.get<{ status: string; message: string; data: ColorVariant[] }>(`${this.API_URL}/products/${productId}/colors`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching color variants:', error);
          return throwError(() => new Error('Failed to load color options. Please try again.'));
        })
      );
  }

  /**
   * Search products
   */
  searchProducts(query: string, page: number = 1, limit: number = 12): Observable<ProductsResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ProductsResponse>(`${this.API_URL}/products/search`, { params })
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        catchError(error => {
          console.error('Error searching products:', error);
          return throwError(() => new Error('Search failed. Please try again.'));
        })
      );
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit: number = 6): Observable<Product[]> {
    const cacheKey = `featured_${limit}`;
    const cached = this.productsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return of(cached.data);
    }

    return this.http.get<{ status: string; message: string; data: { products: Product[] } }>(`${this.API_URL}/products/featured?limit=${limit}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => {
          const products = response.data.products.map(product => ({
            ...product,
            price: product.basePrice,
            images: product.colorVariants?.[0]?.images || [product.mainImage],
            inStock: product.totalStock > 0,
            stockQuantity: product.totalStock,
            ratings: { average: product.averageRating, count: product.totalReviews },
            colors: product.colorVariants?.map(cv => cv.name) || [],
            sizes: product.sizeVariants?.map(sv => sv.name) || [],
            salePercentage: product.originalPrice > product.basePrice 
              ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
              : 0
          }));
          
          // Cache the results
          this.productsCache.set(cacheKey, { data: products, timestamp: Date.now() });
          return products;
        }),
        catchError(error => {
          console.error('Error fetching featured products:', error);
          return throwError(() => new Error('Failed to load featured products. Please try again.'));
        }),
        shareReplay(1)
      );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string, page: number = 1, limit: number = 12): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.API_URL}/products/category/${category}?page=${page}&limit=${limit}`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        catchError(error => {
          console.error('Error fetching products by category:', error);
          return throwError(() => new Error('Failed to load products. Please try again.'));
        })
      );
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<{ status: string; message: string; data: string[] }>(`${this.API_URL}/products/categories`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching categories:', error);
          return throwError(() => new Error('Failed to load categories. Please try again.'));
        })
      );
  }

  /**
   * Get all brands
   */
  getBrands(): Observable<string[]> {
    return this.http.get<{ status: string; message: string; data: string[] }>(`${this.API_URL}/products/brands`)
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        retry(2),
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching brands:', error);
          return throwError(() => new Error('Failed to load brands. Please try again.'));
        })
      );
  }

  /**
   * Increment product view count
   */
  incrementViewCount(productId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/products/${productId}/view`, {})
      .pipe(
        timeout(5000),
        catchError(error => {
          console.error('Error incrementing view count:', error);
          // Don't throw error for view count updates
          return of(void 0);
        })
      );
  }

  /**
   * Clear cache (useful for admin operations)
   */
  clearCache(): void {
    this.productCache.clear();
    this.productsCache.clear();
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    
    // Clear expired product cache
    for (const [key, value] of this.productCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.productCache.delete(key);
      }
    }
    
    // Clear expired products cache
    for (const [key, value] of this.productsCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.productsCache.delete(key);
      }
    }
  }
} 
 