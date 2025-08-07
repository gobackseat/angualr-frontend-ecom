import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly requiredEnvVars = [
    'VITE_API_URL',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_WEBSOCKET_URL',
    'VITE_APP_VERSION',
    'VITE_ANALYTICS_ID',
    'VITE_ERROR_REPORTING_URL'
  ];

  constructor() {
    this.validateEnvironment();
  }

  /**
   * Validates that all required environment variables are present
   * Throws an error if any are missing
   */
  private validateEnvironment(): void {
    const missingVars: string[] = [];

    this.requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}\n\nPlease ensure all required environment variables are set in your .env.local file or deployment platform.`;
      console.error(errorMessage);
      
      if (environment.production) {
        // In production, throw error to prevent app from running with missing config
        throw new Error(errorMessage);
      } else {
        // In development, just warn
        console.warn('Environment validation failed. Some features may not work correctly.');
      }
    }
  }

  // API Configuration
  get apiUrl(): string {
    return environment.apiUrl;
  }

  get websocketUrl(): string {
    return environment.websocketUrl;
  }

  // Stripe Configuration
  get stripePublishableKey(): string {
    return environment.stripePublishableKey;
  }

  get stripeOptions(): any {
    return environment.stripeOptions;
  }

  // App Configuration
  get appName(): string {
    return environment.appName;
  }

  get version(): string {
    return environment.version;
  }

  // Feature Flags
  get enableRealTimeUpdates(): boolean {
    return environment.enableRealTimeUpdates;
  }

  get enableAnalytics(): boolean {
    return environment.enableAnalytics;
  }

  get enableErrorReporting(): boolean {
    return environment.enableErrorReporting;
  }

  get enablePerformanceMonitoring(): boolean {
    return environment.enablePerformanceMonitoring;
  }

  get enableDebugLogging(): boolean {
    return environment.enableDebugLogging;
  }

  get enableMockData(): boolean {
    return environment.enableMockData;
  }

  get enableTestMode(): boolean {
    return environment.enableTestMode;
  }

  // Performance Settings
  get requestTimeout(): number {
    return environment.requestTimeout;
  }

  get retryAttempts(): number {
    return environment.retryAttempts;
  }

  get cacheDuration(): number {
    return environment.cacheDuration;
  }

  // Business Logic
  get freeShippingThreshold(): number {
    return environment.freeShippingThreshold;
  }

  get defaultTaxRate(): number {
    return environment.defaultTaxRate;
  }

  get maxCartItems(): number {
    return environment.maxCartItems;
  }

  get maxQuantityPerItem(): number {
    return environment.maxQuantityPerItem;
  }

  // External Services
  get analyticsId(): string {
    return environment.analyticsId;
  }

  get errorReportingUrl(): string {
    return environment.errorReportingUrl;
  }

  // Security Settings
  get enableCSP(): boolean {
    return environment.enableCSP;
  }

  get enableHSTS(): boolean {
    return environment.enableHSTS;
  }

  /**
   * Get all environment variables for debugging
   */
  getAllConfig(): any {
    return {
      production: environment.production,
      apiUrl: this.apiUrl,
      websocketUrl: this.websocketUrl,
      stripePublishableKey: this.stripePublishableKey,
      appName: this.appName,
      version: this.version,
      enableRealTimeUpdates: this.enableRealTimeUpdates,
      enableAnalytics: this.enableAnalytics,
      enableErrorReporting: this.enableErrorReporting,
      enablePerformanceMonitoring: this.enablePerformanceMonitoring,
      enableDebugLogging: this.enableDebugLogging,
      enableMockData: this.enableMockData,
      enableTestMode: this.enableTestMode,
      requestTimeout: this.requestTimeout,
      retryAttempts: this.retryAttempts,
      cacheDuration: this.cacheDuration,
      freeShippingThreshold: this.freeShippingThreshold,
      defaultTaxRate: this.defaultTaxRate,
      maxCartItems: this.maxCartItems,
      maxQuantityPerItem: this.maxQuantityPerItem,
      analyticsId: this.analyticsId,
      errorReportingUrl: this.errorReportingUrl,
      enableCSP: this.enableCSP,
      enableHSTS: this.enableHSTS
    };
  }
} 