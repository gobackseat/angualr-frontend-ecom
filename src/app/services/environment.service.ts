import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface EnvironmentConfig {
  apiUrl: string;
  stripePublishableKey: string;
  websocketUrl: string;
  enableRealTimeUpdates: boolean;
  sanityProjectId?: string;
  sanityDataset?: string;
  sanityApiVersion?: string;
  sanityToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private config: EnvironmentConfig;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.config = this.loadEnvironmentConfig();
  }

  private loadEnvironmentConfig(): EnvironmentConfig {
    // Try to load from environment variables first, fallback to environment.ts
    return {
      apiUrl: this.getEnvVar('VITE_API_URL') || environment.apiUrl,
      stripePublishableKey: this.getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY') || environment.stripePublishableKey,
      websocketUrl: this.getEnvVar('VITE_APP_URL')?.replace('http', 'ws') || environment.websocketUrl,
      enableRealTimeUpdates: environment.enableRealTimeUpdates,
      sanityProjectId: this.getEnvVar('VITE_SANITY_PROJECT_ID'),
      sanityDataset: this.getEnvVar('VITE_SANITY_DATASET'),
      sanityApiVersion: this.getEnvVar('VITE_SANITY_API_VERSION'),
      sanityToken: this.getEnvVar('VITE_SANITY_TOKEN')
    };
  }

  private getEnvVar(key: string): string | undefined {
    // For Angular CLI, we need to access environment variables differently
    // This will work if the variables are set in the build process
    if (isPlatformBrowser(this.platformId)) {
      // In browser, only access window variables, not process.env
      return (window as any)[key];
    }
    // In server-side rendering, we can access process.env
    return typeof process !== 'undefined' ? process.env?.[key] : undefined;
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get stripePublishableKey(): string {
    return this.config.stripePublishableKey;
  }

  get websocketUrl(): string {
    return this.config.websocketUrl;
  }

  get enableRealTimeUpdates(): boolean {
    return this.config.enableRealTimeUpdates;
  }

  get sanityProjectId(): string | undefined {
    return this.config.sanityProjectId;
  }

  get sanityDataset(): string | undefined {
    return this.config.sanityDataset;
  }

  get sanityApiVersion(): string | undefined {
    return this.config.sanityApiVersion;
  }

  get sanityToken(): string | undefined {
    return this.config.sanityToken;
  }

  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }
} 