import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(src?: string, fallback: string = 'assets/images/placeholder-product.webp'): string {
    if (!src || typeof src !== 'string') {
      return fallback;
    }

    let trimmed = src.trim();

    // Remap backend temp-repo paths to real assets
    // /assets/temp-repo/img/product-imgs/foo.webp -> assets/images/product-imgs/foo.webp
    if (trimmed.startsWith('/assets/temp-repo/img/product-imgs/')) {
      trimmed = 'assets/images/product-imgs/' + trimmed.split('/assets/temp-repo/img/product-imgs/')[1];
    }
    // /assets/temp-repo/img/home-hero-section-imgs/foo.webp -> assets/images/hero/foo.webp
    else if (trimmed.startsWith('/assets/temp-repo/img/home-hero-section-imgs/')) {
      trimmed = 'assets/images/hero/' + trimmed.split('/assets/temp-repo/img/home-hero-section-imgs/')[1];
    }

    // Absolute URLs (http/https)
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Frontend assets (with or without leading slash)
    if (/^\/assets\//.test(trimmed)) {
      // remove leading slash for Angular asset resolution consistency
      return trimmed.replace(/^\//, '');
    }

    if (
      trimmed.startsWith('assets/') ||
      trimmed.startsWith('./assets/') ||
      trimmed.startsWith('../assets/')
    ) {
      return trimmed.replace(/^\.\/+/, '');
    }

    // Backend relative URLs (e.g., /uploads/..., /images/...)
    if (trimmed.startsWith('/')) {
      const apiHost = environment.apiUrl.replace(/\/?api\/?$/, '');
      return `${apiHost}${trimmed}`;
    }

    // Other relative paths → treat as assets
    if (!trimmed.includes('://')) {
      return `assets/${trimmed.replace(/^\.\/+/, '')}`;
    }

    return fallback;
  }
} 