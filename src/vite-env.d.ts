/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_ENABLE_REAL_TIME_UPDATES: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_ERROR_REPORTING_URL: string
  readonly VITE_ENABLE_DEBUG_LOGGING: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_ENABLE_TEST_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 