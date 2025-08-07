export const environment = {
  production: true,
  apiUrl: process.env['VITE_API_URL']!,
  stripePublishableKey: process.env['VITE_STRIPE_PUBLISHABLE_KEY']!,
  websocketUrl: process.env['VITE_WEBSOCKET_URL']!,
  enableRealTimeUpdates: process.env['VITE_ENABLE_REAL_TIME_UPDATES'] === 'true',
  
  // Production-ready configuration
  appName: 'PawComfort E-Commerce',
  version: process.env['VITE_APP_VERSION']!,
  
  // Performance settings
  requestTimeout: 15000, // 15 seconds
  retryAttempts: 3,
  cacheDuration: 300000, // 5 minutes
  
  // Feature flags
  enableAnalytics: process.env['VITE_ENABLE_ANALYTICS'] === 'true',
  enableErrorReporting: process.env['VITE_ENABLE_ERROR_REPORTING'] === 'true',
  enablePerformanceMonitoring: process.env['VITE_ENABLE_PERFORMANCE_MONITORING'] === 'true',
  
  // Security settings
  enableCSP: true,
  enableHSTS: true,
  
  // Business logic
  freeShippingThreshold: 50,
  defaultTaxRate: 0.085, // 8.5%
  maxCartItems: 100,
  maxQuantityPerItem: 10,
  
  // External services
  analyticsId: process.env['VITE_ANALYTICS_ID']!,
  errorReportingUrl: process.env['VITE_ERROR_REPORTING_URL']!,
  
  // Development settings
  enableDebugLogging: process.env['VITE_ENABLE_DEBUG_LOGGING'] === 'true',
  enableMockData: false,
  enableTestMode: false,
  
  // Stripe settings
  stripeOptions: {
    apiVersion: '2023-10-16',
    betas: ['elements_enable_deferred_intent_beta_1']
  }
}; 
 
 