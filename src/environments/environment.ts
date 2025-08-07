export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  stripePublishableKey: 'pk_test_your_stripe_publishable_key_here',
  websocketUrl: 'ws://localhost:3001',
  enableRealTimeUpdates: false,
  
  // Production-ready configuration
  appName: 'PawComfort E-Commerce',
  version: '1.0.0',
  
  // Performance settings
  requestTimeout: 15000, // 15 seconds
  retryAttempts: 3,
  cacheDuration: 300000, // 5 minutes
  
  // Feature flags
  enableAnalytics: false,
  enableErrorReporting: false,
  enablePerformanceMonitoring: false,
  
  // Security settings
  enableCSP: true,
  enableHSTS: true,
  
  // Business logic
  freeShippingThreshold: 50,
  defaultTaxRate: 0.085, // 8.5%
  maxCartItems: 100,
  maxQuantityPerItem: 10,
  
  // External services
  analyticsId: '',
  errorReportingUrl: '',
  
  // Development settings
  enableDebugLogging: true,
  enableMockData: false,
  enableTestMode: false,
  
  // Stripe settings
  stripeOptions: {
    apiVersion: '2023-10-16',
    betas: ['elements_enable_deferred_intent_beta_1']
  }
}; 