import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartCount = 0;
  wishlistCount = 0;

  addToCart() {
    this.cartCount++;
  }

  addToWishlist() {
    this.wishlistCount++;
  }
} 
 
 