export const environment = {
  production: true,
  apiUrl: process.env['VITE_API_URL'] || 'https://e-comerce-backend-mmvv.onrender.com/api',
  stripePublishableKey: process.env['VITE_STRIPE_PUBLISHABLE_KEY'] || 'pk_test_your_stripe_key_here',
  websocketUrl: process.env['VITE_WEBSOCKET_URL'] || 'wss://e-comerce-backend-mmvv.onrender.com',
  enableRealTimeUpdates: process.env['VITE_ENABLE_REAL_TIME_UPDATES'] === 'true',
  
  // Production-ready configuration
  appName: 'PawComfort E-Commerce',
  version: process.env['VITE_APP_VERSION'] || '1.0.0',
  
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
  analyticsId: process.env['VITE_ANALYTICS_ID'] || 'G-XXXXXXXXXX',
  errorReportingUrl: process.env['VITE_ERROR_REPORTING_URL'] || 'https://your-error-reporting-service.com',
  
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
 
 