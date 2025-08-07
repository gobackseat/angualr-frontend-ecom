export const environment = {
  production: true,
  apiUrl: import.meta.env.VITE_API_URL || 'https://e-comerce-backend-mmvv.onrender.com/api',
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RDZZD01xy1dyeH8ERFOWsxCQcja2ujjntPRbWCwLBNUy5b3YqPAWkWmo8JhSvgEaeMnuc6XwMXXW82MuR1qyO8b00oIho4zqN',
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'wss://e-comerce-backend-mmvv.onrender.com',
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
  analyticsId: import.meta.env.VITE_ANALYTICS_ID || 'G-XXXXXXXXXX',
  errorReportingUrl: import.meta.env.VITE_ERROR_REPORTING_URL || 'https://your-error-reporting-service.com',
  
  // Development settings
  enableDebugLogging: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true',
  enableMockData: false,
  enableTestMode: false,
  
  // Stripe settings
  stripeOptions: {
    apiVersion: '2023-10-16',
    betas: ['elements_enable_deferred_intent_beta_1']
  }
}; 
 
 