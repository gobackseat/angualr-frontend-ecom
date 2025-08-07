# API Endpoints Documentation

## Overview
This document outlines the backend API endpoints required to support the Angular e-commerce application, matching the functionality of the React app.

## Base URL
```
https://api.dogbackseatextender.com/api/v1
```

## Authentication Endpoints

### POST /auth/register
**Register a new user**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/login
**Login user**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

### GET /auth/me
**Get current user profile**
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### PUT /auth/profile
**Update user profile**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "password": "current_password_for_verification"
}
```

### PUT /auth/password
**Change password**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "oldPassword": "current_password",
  "newPassword": "new_secure_password"
}
```

## Product Endpoints

### GET /products
**Get all products**
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Dog Backseat Extender",
      "description": "Premium backseat extender for dogs",
      "price": 299.99,
      "basePrice": 299.99,
      "images": [
        "/assets/images/products/dog-backseat-extender-black.jpg",
        "/assets/images/products/dog-backseat-extender-brown.jpg",
        "/assets/images/products/dog-backseat-extender-blue.jpg"
      ],
      "colors": ["Black", "Brown", "Blue"],
      "features": [
        "Premium materials",
        "Easy installation",
        "Safety tested"
      ],
      "rating": 4.5,
      "reviews": 128,
      "inStock": true
    }
  ]
}
```

### GET /products/:id
**Get single product**
**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Dog Backseat Extender",
    "description": "Premium backseat extender for dogs",
    "price": 299.99,
    "basePrice": 299.99,
    "images": [
      "/assets/images/products/dog-backseat-extender-black.jpg",
      "/assets/images/products/dog-backseat-extender-brown.jpg",
      "/assets/images/products/dog-backseat-extender-blue.jpg"
    ],
    "colors": ["Black", "Brown", "Blue"],
    "features": [
      "Premium materials",
      "Easy installation",
      "Safety tested"
    ],
    "rating": 4.5,
    "reviews": 128,
    "inStock": true,
    "shippingInfo": "Free shipping on all orders",
    "warrantyInfo": "1-year warranty included"
  }
}
```

## Cart Endpoints

### GET /cart
**Get user's cart**
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "cart_item_id",
        "productId": "product_id",
        "name": "Dog Backseat Extender - Black",
        "price": 299.99,
        "quantity": 1,
        "image": "/assets/images/products/dog-backseat-extender-black.jpg",
        "color": "Black"
      }
    ],
    "total": 299.99,
    "itemCount": 1
  }
}
```

### POST /cart/add
**Add item to cart**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "productId": "product_id",
  "quantity": 1,
  "color": "Black"
}
```

### PUT /cart/:itemId
**Update cart item quantity**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "quantity": 2
}
```

### DELETE /cart/:itemId
**Remove item from cart**
**Headers:** `Authorization: Bearer <token>`

### DELETE /cart
**Clear entire cart**
**Headers:** `Authorization: Bearer <token>`

## Wishlist Endpoints

### GET /wishlist
**Get user's wishlist**
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "wishlist_item_id",
      "productId": "product_id",
      "name": "Dog Backseat Extender",
      "price": 299.99,
      "basePrice": 299.99,
      "image": "/assets/images/products/dog-backseat-extender-black.jpg",
      "rating": 4.5,
      "reviews": 128,
      "description": "Premium backseat extender for dogs"
    }
  ]
}
```

### POST /wishlist/add
**Add item to wishlist**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "productId": "product_id"
}
```

### DELETE /wishlist/:itemId
**Remove item from wishlist**
**Headers:** `Authorization: Bearer <token>`

## Order Endpoints

### GET /orders
**Get user's orders**
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "orderNumber": "ORD-2024-001",
      "createdAt": "2024-01-15T10:30:00Z",
      "status": "delivered",
      "totalPrice": 299.99,
      "isPaid": true,
      "orderItems": [
        {
          "productId": "product_id",
          "name": "Dog Backseat Extender - Black",
          "price": 299.99,
          "quantity": 1,
          "image": "/assets/images/products/dog-backseat-extender-black.jpg"
        }
      ],
      "shippingAddress": {
        "address": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "United States"
      },
      "trackingNumber": "1Z999AA1234567890"
    }
  ]
}
```

### GET /orders/:id
**Get single order details**
**Headers:** `Authorization: Bearer <token>`

### POST /orders
**Create new order**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 1,
      "color": "Black"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "paymentMethod": "stripe",
  "paymentIntentId": "pi_1234567890"
}
```

### PUT /orders/:id/status
**Update order status**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890"
}
```

## Checkout Endpoints

### POST /checkout/create-payment-intent
**Create Stripe payment intent**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "amount": 29999,
  "currency": "usd",
  "items": [
    {
      "productId": "product_id",
      "quantity": 1,
      "price": 299.99
    }
  ]
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234567890_secret_abc123",
    "paymentIntentId": "pi_1234567890"
  }
}
```

### POST /checkout/confirm-payment
**Confirm payment and create order**
**Headers:** `Authorization: Bearer <token>`
```json
{
  "paymentIntentId": "pi_1234567890",
  "orderData": {
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "United States"
    }
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### Common Error Codes
- `AUTHENTICATION_FAILED` - Invalid or missing token
- `VALIDATION_ERROR` - Invalid input data
- `PRODUCT_NOT_FOUND` - Product doesn't exist
- `INSUFFICIENT_STOCK` - Product out of stock
- `PAYMENT_FAILED` - Payment processing error
- `ORDER_NOT_FOUND` - Order doesn't exist
- `PERMISSION_DENIED` - User not authorized

## Authentication

### JWT Token Format
```
Authorization: Bearer <jwt_token>
```

### Token Expiration
- Access tokens expire after 24 hours
- Refresh tokens expire after 7 days

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## CORS Configuration
```
Access-Control-Allow-Origin: https://dogbackseatextender.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Environment Variables
```
DATABASE_URL=mongodb://localhost:27017/dogbackseat
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  basePrice: Number,
  images: [String],
  colors: [String],
  features: [String],
  rating: Number,
  reviews: Number,
  inStock: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  orderNumber: String,
  status: String,
  totalPrice: Number,
  isPaid: Boolean,
  orderItems: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    color: String
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  trackingNumber: String,
  paymentIntentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    color: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Wishlist Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  createdAt: Date
}
```

## Implementation Notes

1. **Security**: All endpoints should validate JWT tokens and user permissions
2. **Validation**: Use Joi or similar for request validation
3. **Error Handling**: Implement comprehensive error handling with proper HTTP status codes
4. **Logging**: Log all API requests and errors for monitoring
5. **Caching**: Implement Redis caching for product data and user sessions
6. **Testing**: Write comprehensive unit and integration tests
7. **Documentation**: Use Swagger/OpenAPI for API documentation
8. **Monitoring**: Implement health checks and performance monitoring 