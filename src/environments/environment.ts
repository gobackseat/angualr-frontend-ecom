export const environment = {
  production: false,
  apiUrl: 'https://e-comerce-backend-mmvv.onrender.com/api',
  stripePublishableKey: 'pk_test_51RDZZD01xy1dyeH8ERFOWsxCQcja2ujjntPRbWCwLBNUy5b3YqPAWkWmo8JhSvgEaeMnuc6XwMXXW82MuR1qyO8b00oIho4zqN',
  websocketUrl: 'wss://e-comerce-backend-mmvv.onrender.com',
  enableRealTimeUpdates: true,
  
  // Production-ready configuration
  appName: 'PawComfort E-Commerce',
  version: '1.0.0',
  
  // Performance settings
  requestTimeout: 15000, // 15 seconds
  retryAttempts: 3,
  cacheDuration: 300000, // 5 minutes
  
  // Feature flags
  enableAnalytics: true,
  enableErrorReporting: true,
  enablePerformanceMonitoring: true,
  
  // Security settings
  enableCSP: true,
  enableHSTS: true,
  
  // Business logic
  freeShippingThreshold: 50,
  defaultTaxRate: 0.085, // 8.5%
  maxCartItems: 100,
  maxQuantityPerItem: 10,
  
  // External services
  analyticsId: 'G-XXXXXXXXXX',
  errorReportingUrl: 'https://your-error-reporting-service.com',
  
  // Development settings
  enableDebugLogging: false,
  enableMockData: false,
  enableTestMode: false,
  
  // Stripe settings
  stripeOptions: {
    apiVersion: '2023-10-16',
    betas: ['elements_enable_deferred_intent_beta_1']
  }
}; 