export const environment = {
  production: false,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here',
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001',
  enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES === 'true',
  
  // Production-ready configuration
  appName: 'PawComfort E-Commerce',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Performance settings
  requestTimeout: 15000, // 15 seconds
  retryAttempts: 3,
  cacheDuration: 300000, // 5 minutes
  
  // Feature flags
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  
  // Security settings
  enableCSP: true,
  enableHSTS: true,
  
  // Business logic
  freeShippingThreshold: 50,
  defaultTaxRate: 0.085, // 8.5%
  maxCartItems: 100,
  maxQuantityPerItem: 10,
  
  // External services
  analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
  errorReportingUrl: import.meta.env.VITE_ERROR_REPORTING_URL || '',
  
  // Development settings
  enableDebugLogging: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  enableTestMode: import.meta.env.VITE_ENABLE_TEST_MODE === 'true',
  
  // Stripe settings
  stripeOptions: {
    apiVersion: '2023-10-16',
    betas: ['elements_enable_deferred_intent_beta_1']
  }
}; 