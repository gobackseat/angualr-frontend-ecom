import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface WishlistItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  image?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadWishlistFromStorage();
  }

  private loadWishlistFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        this.wishlistSubject.next(wishlist);
      } catch (error) {
        console.warn('Failed to load wishlist from localStorage:', error);
      }
    }
  }

  private saveWishlistToStorage(wishlist: WishlistItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      } catch (error) {
        console.warn('Failed to save wishlist to localStorage:', error);
      }
    }
  }

  getWishlist(): Observable<WishlistItem[]> {
    return this.wishlist$;
  }

  addToWishlist(item: WishlistItem): void {
    const currentWishlist = this.wishlistSubject.value;
    const existingItem = currentWishlist.find(
      wishlistItem => wishlistItem._id === item._id || wishlistItem.id === item.id
    );

    if (!existingItem) {
      const updatedWishlist = [...currentWishlist, item];
      this.wishlistSubject.next(updatedWishlist);
      this.saveWishlistToStorage(updatedWishlist);
    }
  }

  removeFromWishlist(itemId: string): void {
    const currentWishlist = this.wishlistSubject.value;
    const updatedWishlist = currentWishlist.filter(
      item => item._id !== itemId && item.id !== itemId
    );
    this.wishlistSubject.next(updatedWishlist);
    this.saveWishlistToStorage(updatedWishlist);
  }

  isInWishlist(itemId: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        return wishlist.some((item: WishlistItem) => item._id === itemId || item.id === itemId);
      } catch (error) {
        console.warn('Failed to check wishlist from localStorage:', error);
        return false;
      }
    }
    return false;
  }

  clearWishlist(): void {
    this.wishlistSubject.next([]);
    this.saveWishlistToStorage([]);
  }
} 