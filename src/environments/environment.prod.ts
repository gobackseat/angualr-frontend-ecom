export const environment = {
  production: true,
  apiUrl: process.env['VITE_API_URL'] || 'https://api.pawcomfort.com/api',
  stripePublishableKey: process.env['VITE_STRIPE_PUBLISHABLE_KEY'] || 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  websocketUrl: process.env['VITE_WEBSOCKET_URL'] || 'wss://api.pawcomfort.com',
  enableRealTimeUpdates: process.env['VITE_ENABLE_REAL_TIME_UPDATES'] === 'true',
  
  // Production-ready configuration
  appName: 'PawComfort E-Commerce',
  version: process.env['VITE_APP_VERSION'] || '1.0.0',
  
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
  analyticsId: process.env['VITE_ANALYTICS_ID'] || 'G-XXXXXXXXXX',
  errorReportingUrl: process.env['VITE_ERROR_REPORTING_URL'] || 'https://your-error-reporting-service.com',
  
  // Development settings
  enableDebugLogging: false,
  enableMockData: false,
  enableTestMode: false
}; 
 
 