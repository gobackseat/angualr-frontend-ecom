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

    const trimmed = src.trim();

    // Absolute URLs (http/https) → return as-is
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Frontend assets with leading slash
    if (/^\/assets\//.test(trimmed)) {
      return trimmed; // keep as absolute to current origin
    }

    // Local Angular assets → return as-is
    if (
      trimmed.startsWith('assets/') ||
      trimmed.startsWith('./assets/') ||
      trimmed.startsWith('../assets/')
    ) {
      return trimmed.replace(/^\.\/+/, '');
    }

    // Backend relative URLs (e.g., /uploads/..., /images/...) → prefix with API host
    if (trimmed.startsWith('/')) {
      const apiHost = environment.apiUrl.replace(/\/?api\/?$/, '');
      return `${apiHost}${trimmed}`;
    }

    // Other relative paths → try to treat as assets path
    if (!trimmed.includes('://')) {
      return `assets/${trimmed.replace(/^\.\/+/, '')}`;
    }

    return fallback;
  }
} 