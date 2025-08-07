import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  addedAt: string;
  inStock: boolean;
  customizations?: {
    [key: string]: any;
  };
}

export interface Wishlist {
  id?: string;
  userId?: string;
  items: WishlistItem[];
  totalItems: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToWishlistRequest {
  productId: string;
  color?: string;
  size?: string;
  customizations?: {
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly API_URL = environment.apiUrl;
  private readonly WISHLIST_KEY = 'E_COMMERCE_WISHLIST';
  
  private wishlistSubject = new BehaviorSubject<Wishlist>({
    items: [],
    totalItems: 0
  });
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public wishlist$ = this.wishlistSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeWishlist();
  }

  private initializeWishlist(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const savedWishlist = localStorage.getItem(this.WISHLIST_KEY);
      if (savedWishlist) {
        const wishlist = JSON.parse(savedWishlist);
        this.wishlistSubject.next(wishlist);
      }
    } catch (error) {
      console.error('Error initializing wishlist:', error);
    }
  }

  private saveWishlistToStorage(wishlist: Wishlist): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to storage:', error);
    }
  }

  // Get current wishlist
  get currentWishlist(): Wishlist {
    return this.wishlistSubject.value;
  }

  // Get wishlist item count
  get itemCount(): number {
    return this.currentWishlist.totalItems;
  }

  // Add item to wishlist
  addToWishlist(request: AddToWishlistRequest): Observable<Wishlist> {
    this.setLoading(true);
    this.clearError();

    if (this.authService.isAuthenticated) {
      // User is authenticated - use API
      return this.http.post<{ success: boolean; message: string }>(`${this.API_URL}/wishlist`, request).pipe(
        tap(response => {
          if (response.success) {
            // Refresh wishlist from server
            this.getWishlist().subscribe();
          }
          this.setLoading(false);
        }),
        map(() => this.currentWishlist),
        catchError(error => {
          this.setLoading(false);
          // If 401 error, fall back to local storage
          if (error.status === 401) {
            console.log('User not authenticated, using local storage for wishlist');
            return this.addToWishlistLocal(request);
          }
          this.setError('Failed to add item to wishlist');
          return of(this.currentWishlist);
        })
      );
    } else {
      // User is not authenticated - use local storage
      return this.addToWishlistLocal(request);
    }
  }

  // Add item to wishlist using local storage
  private addToWishlistLocal(request: AddToWishlistRequest): Observable<Wishlist> {
    const wishlist = this.currentWishlist;
      
    // Check if item already exists
    const existingItem = wishlist.items.find(item => 
      item.productId === request.productId && 
      item.color === request.color && 
      item.size === request.size
    );

    if (existingItem) {
      this.setLoading(false);
      return of(wishlist);
    }

    // Create new wishlist item
    const newItem: WishlistItem = {
      id: Date.now().toString(),
      productId: request.productId,
      name: 'Dog Backseat Extender',
      price: 299.99,
      color: request.color,
      size: request.size,
      addedAt: new Date().toISOString(),
      inStock: true,
      customizations: request.customizations
    };

    wishlist.items.push(newItem);
    wishlist.totalItems = wishlist.items.length;

    this.wishlistSubject.next(wishlist);
    this.saveWishlistToStorage(wishlist);
    this.setLoading(false);

    return of(wishlist);
  }

  // Remove item from wishlist
  removeFromWishlist(productId: string, color?: string, size?: string): Observable<Wishlist> {
    this.setLoading(true);
    this.clearError();

    if (this.authService.isAuthenticated) {
      // User is authenticated - use API
      return this.http.post<{ success: boolean; message: string }>(`${this.API_URL}/wishlist/remove`, {
        productId,
        color,
        customizations: { size }
      }).pipe(
        tap(response => {
          if (response.success) {
            // Refresh wishlist from server
            this.getWishlist().subscribe();
          }
          this.setLoading(false);
        }),
        map(() => this.currentWishlist),
        catchError(error => {
          this.setLoading(false);
          this.setError('Failed to remove item from wishlist');
          return of(this.currentWishlist);
        })
      );
    } else {
      // User is not authenticated - use local storage
      const wishlist = this.currentWishlist;
      wishlist.items = wishlist.items.filter(item => 
        !(item.productId === productId && 
          item.color === color && 
          item.size === size)
      );
      wishlist.totalItems = wishlist.items.length;

      this.wishlistSubject.next(wishlist);
      this.saveWishlistToStorage(wishlist);
      this.setLoading(false);

      return of(wishlist);
    }
  }

  // Clear wishlist
  clearWishlist(): Observable<Wishlist> {
    this.setLoading(true);
    this.clearError();

    if (this.authService.isAuthenticated) {
      // User is authenticated - use API
      return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/wishlist`).pipe(
        tap(response => {
          if (response.success) {
            const emptyWishlist: Wishlist = {
              items: [],
              totalItems: 0
            };
            this.wishlistSubject.next(emptyWishlist);
            this.saveWishlistToStorage(emptyWishlist);
          }
          this.setLoading(false);
        }),
        map(() => this.currentWishlist),
        catchError(error => {
          this.setLoading(false);
          this.setError('Failed to clear wishlist');
          return of(this.currentWishlist);
        })
      );
    } else {
      // User is not authenticated - use local storage
      const emptyWishlist: Wishlist = {
        items: [],
        totalItems: 0
      };
      this.wishlistSubject.next(emptyWishlist);
      this.saveWishlistToStorage(emptyWishlist);
      this.setLoading(false);
      return of(emptyWishlist);
    }
  }

  // Get wishlist from server
  getWishlist(): Observable<Wishlist> {
    if (this.authService.isAuthenticated) {
      return this.http.get<{ success: boolean; wishlist: any[] }>(`${this.API_URL}/wishlist`).pipe(
        tap(response => {
          if (response.success) {
            const wishlist = this.convertBackendWishlistToFrontend(response.wishlist);
            this.wishlistSubject.next(wishlist);
            this.saveWishlistToStorage(wishlist);
          }
        }),
        map(response => this.convertBackendWishlistToFrontend(response.wishlist)),
        catchError(error => {
          console.error('Error fetching wishlist:', error);
          return of(this.currentWishlist);
        })
      );
    } else {
      return of(this.currentWishlist);
    }
  }

  private convertBackendWishlistToFrontend(backendWishlist: any[]): Wishlist {
    const items: WishlistItem[] = backendWishlist.map((item: any) => ({
      id: item._id || item.id,
      productId: item.productId,
      name: 'Dog Backseat Extender', // Default name, should come from product API
      price: 299.99, // Default price, should come from product API
      color: item.color,
      size: item.customizations?.size,
      addedAt: item.addedAt || item.createdAt,
      inStock: true, // Default, should come from product API
      customizations: item.customizations
    }));

    return {
      items,
      totalItems: items.length
    };
  }

  // Sync local wishlist with server (when user logs in)
  syncWishlistWithServer(): Observable<Wishlist> {
    if (!this.authService.isAuthenticated) {
      return of(this.currentWishlist);
    }

    const localWishlist = this.currentWishlist;
    if (localWishlist.items.length === 0) {
      return this.getWishlist();
    }

    // Merge local wishlist with server wishlist
    return this.http.post<{ status: string; data: Wishlist }>(`${this.API_URL}/users/wishlist/sync`, localWishlist).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.wishlistSubject.next(response.data);
          this.saveWishlistToStorage(response.data);
        }
      }),
      map(response => response.data),
      catchError(error => {
        console.error('Failed to sync wishlist:', error);
        return of(this.currentWishlist);
      })
    );
  }

  // Check if item is in wishlist
  isInWishlist(productId: string, color?: string, size?: string): boolean {
    return this.currentWishlist.items.some(item => 
      item.productId === productId && 
      item.color === color && 
      item.size === size
    );
  }

  // Move item from wishlist to cart
  moveToCart(productId: string, color?: string, size?: string): Observable<boolean> {
    const item = this.currentWishlist.items.find(item => 
      item.productId === productId && 
      item.color === color && 
      item.size === size
    );

    if (!item) {
      this.setError('Item not found in wishlist');
      return of(false);
    }

    // This would integrate with cart service
    // For now, just remove from wishlist
    return this.removeFromWishlist(productId, color, size).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  // Get wishlist item by ID
  getWishlistItem(productId: string, color?: string, size?: string): WishlistItem | null {
    return this.currentWishlist.items.find(item => 
      item.productId === productId && 
      item.color === color && 
      item.size === size
    ) || null;
  }

  // Update item stock status
  updateItemStock(productId: string, inStock: boolean): void {
    const wishlist = this.currentWishlist;
    const item = wishlist.items.find(item => item.productId === productId);
    
    if (item) {
      item.inStock = inStock;
      this.wishlistSubject.next(wishlist);
      this.saveWishlistToStorage(wishlist);
    }
  }

  // Format price
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
} 