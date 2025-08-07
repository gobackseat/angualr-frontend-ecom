#!/bin/bash

# Production Deployment Script for Angular E-commerce Frontend
# Optimized for 100k+ live users

echo "🚀 Starting production deployment..."

# Set environment variables for production
export NODE_ENV=production
export VITE_API_URL=https://e-comerce-backend-mmvv.onrender.com/api
export VITE_WEBSOCKET_URL=wss://e-comerce-backend-mmvv.onrender.com

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf .angular/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=moderate

# Run tests
echo "🧪 Running tests..."
npm run test -- --watch=false --browsers=ChromeHeadless

# Build for production
echo "🏗️ Building for production..."
npm run build -- --configuration=production

# Optimize images
echo "🖼️ Optimizing images..."
if command -v imagemin &> /dev/null; then
    find dist/assets -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs imagemin --out-dir=dist/assets
fi

# Generate sitemap
echo "🗺️ Generating sitemap..."
cat > dist/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://angualr-frontend-ecom.vercel.app/</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://angualr-frontend-ecom.vercel.app/products</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://angualr-frontend-ecom.vercel.app/about</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://angualr-frontend-ecom.vercel.app/contact</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
EOF

# Create robots.txt
echo "🤖 Creating robots.txt..."
cat > dist/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://angualr-frontend-ecom.vercel.app/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
EOF

# Create .htaccess for Apache (if needed)
echo "⚙️ Creating .htaccess..."
cat > dist/.htaccess << EOF
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Handle Angular routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
EOF

# Create nginx.conf for Nginx (if needed)
echo "🌐 Creating nginx.conf..."
cat > dist/nginx.conf << EOF
server {
    listen 80;
    server_name angualr-frontend-ecom.vercel.app;
    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # Handle Angular routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass https://e-comerce-backend-mmvv.onrender.com/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Build size analysis
echo "📊 Analyzing build size..."
du -sh dist/
echo "📁 Build contents:"
ls -la dist/

# Performance check
echo "⚡ Performance check..."
if command -v lighthouse &> /dev/null; then
    echo "Running Lighthouse audit..."
    lighthouse dist/index.html --output=json --output-path=dist/lighthouse-report.json --chrome-flags="--headless"
fi

echo "✅ Production deployment ready!"
echo "📦 Build location: dist/"
echo "🌐 Deploy to: https://angualr-frontend-ecom.vercel.app"
echo "🔗 Backend API: https://e-comerce-backend-mmvv.onrender.com/api" 