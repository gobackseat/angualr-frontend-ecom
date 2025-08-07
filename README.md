# Angular E-commerce Frontend

A modern, responsive e-commerce frontend built with Angular 17, featuring Stripe payment integration, real-time updates, and a complete shopping experience.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Angular CLI 17+

### Installation
```bash
# Clone the repository
git clone https://github.com/gobackseat/angualr-frontend-ecom.git
cd angualr-frontend-ecom

# Install dependencies
npm install

# Set up environment variables (REQUIRED)
cp env.template .env.local
# Edit .env.local with your actual values - ALL variables are required!

# Start development server
npm start
```

## 🌍 Environment Configuration (REQUIRED)

**⚠️ IMPORTANT: This application requires ALL environment variables to be set. No fallbacks are provided.**

### Local Development
Create `.env.local` file with ALL required variables:
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_WEBSOCKET_URL=ws://localhost:3001

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_DEBUG_LOGGING=true
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_TEST_MODE=false

# Analytics & Monitoring
VITE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_ERROR_REPORTING_URL=https://your-error-reporting-service.com
```

### Production Deployment (Vercel)
Add these environment variables in your Vercel project settings:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Your backend API URL | ✅ | `https://your-backend.com/api` |
| `VITE_WEBSOCKET_URL` | WebSocket URL for real-time updates | ✅ | `wss://your-backend.com` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ | `pk_test_...` or `pk_live_...` |
| `VITE_APP_VERSION` | Application version | ✅ | `1.0.0` |
| `VITE_ENABLE_REAL_TIME_UPDATES` | Enable WebSocket updates | ✅ | `true` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | ✅ | `true` |
| `VITE_ENABLE_ERROR_REPORTING` | Enable error reporting | ✅ | `true` |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Enable performance monitoring | ✅ | `true` |
| `VITE_ENABLE_DEBUG_LOGGING` | Enable debug logging | ✅ | `false` (production) |
| `VITE_ENABLE_MOCK_DATA` | Enable mock data | ✅ | `false` (production) |
| `VITE_ENABLE_TEST_MODE` | Enable test mode | ✅ | `false` (production) |
| `VITE_ANALYTICS_ID` | Google Analytics ID | ✅ | `G-XXXXXXXXXX` |
| `VITE_ERROR_REPORTING_URL` | Error reporting service URL | ✅ | `https://your-service.com` |

## 🔧 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🛠️ Features

- ✅ **Stripe Payment Integration** - Complete checkout flow
- ✅ **Guest Checkout** - No account required
- ✅ **Real-time Updates** - WebSocket integration
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Performance Optimized** - Lazy loading, caching
- ✅ **Production Ready** - Environment configs, build scripts
- ✅ **Environment Validation** - Automatic validation of required variables

## 📁 Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── guards/        # Route guards
│   └── interceptors/  # HTTP interceptors
├── assets/            # Static assets
└── environments/      # Environment configs
```

## 🔗 API Integration

The frontend integrates with your backend API for:
- Product catalog and search
- Shopping cart management
- Order processing
- User authentication
- Real-time updates

## 🚨 Troubleshooting

### Environment Variable Errors
If you see errors about missing environment variables:
1. Ensure ALL variables in `env.template` are set in your `.env.local` file
2. For Vercel deployment, add ALL variables in project settings
3. Check that variable names start with `VITE_`
4. Restart your development server after changing environment variables

### CORS Errors
If you see CORS errors in production:
1. Ensure your backend CORS is configured for your frontend domain
2. Check that `VITE_API_URL` points to your production backend
3. Verify environment variables are set correctly in Vercel

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🔒 Security Notes

- **Never commit `.env.local` files** to version control
- **Use different keys** for development and production
- **Rotate secrets regularly**
- **Validate environment variables** on application startup

## 📄 License

MIT License - see LICENSE file for details.
