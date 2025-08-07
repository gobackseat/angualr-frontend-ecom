import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface CartItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity?: number;
  count?: number;
  image?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          const cart = JSON.parse(cartData);
          this.cartSubject.next(cart);
        }
      } catch (error) {
        console.warn('Failed to load cart from localStorage:', error);
      }
    }
  }

  private saveCartToStorage(cart: Cart): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
      }
    }
  }

  private calculateCart(cart: Cart): Cart {
    const total = cart.items.reduce((sum, item) => {
      const quantity = item.count || item.quantity || 1;
      return sum + (item.price * quantity);
    }, 0);
    
    const itemCount = cart.items.reduce((sum, item) => {
      return sum + (item.count || item.quantity || 1);
    }, 0);

    return {
      ...cart,
      total,
      itemCount
    };
  }

  getCart(): Observable<Cart> {
    return this.cart$;
  }

  addToCart(item: CartItem): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(
      cartItem => cartItem._id === item._id || cartItem.id === item.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const existingItem = currentCart.items[existingItemIndex];
      const newQuantity = (existingItem.count || existingItem.quantity || 1) + (item.count || item.quantity || 1);
      currentCart.items[existingItemIndex] = {
        ...existingItem,
        count: newQuantity,
        quantity: newQuantity
      };
    } else {
      // Add new item
      const newItem: CartItem = {
        ...item,
        count: item.count || item.quantity || 1,
        quantity: item.count || item.quantity || 1
      };
      currentCart.items.push(newItem);
    }

    const updatedCart = this.calculateCart(currentCart);
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.items.findIndex(
      item => item._id === itemId || item.id === itemId
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        currentCart.items.splice(itemIndex, 1);
      } else {
        currentCart.items[itemIndex] = {
          ...currentCart.items[itemIndex],
          quantity,
          count: quantity
        };
      }

      const updatedCart = this.calculateCart(currentCart);
      this.cartSubject.next(updatedCart);
      this.saveCartToStorage(updatedCart);
    }
  }

  removeItem(itemId: string): void {
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.filter(
      item => item._id !== itemId && item.id !== itemId
    );

    const updatedCart = this.calculateCart({
      ...currentCart,
      items: updatedItems
    });

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      total: 0,
      itemCount: 0
    };
    this.cartSubject.next(emptyCart);
    this.saveCartToStorage(emptyCart);
  }

  getCartItemCount(): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        observer.next(cart.itemCount);
      });
    });
  }
} 