# API Documentation

## Overview

This API is built using **Express.js**, **Node.js**, and **TypeScript**, with **Mongoose** for MongoDB integration. It follows a modular architecture with clear separation of concerns.

## Project Structure

```
src/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middlewares/        # Express middlewares
├── models/             # Mongoose models
├── routes/             # API routes
├── services/           # Business logic
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
└── server.ts           # Entry point
```

## Features

- **JWT Authentication** with role-based access control.
- **RESTful API Design** with clean and consistent endpoints.
- **MongoDB with Mongoose** for structured data handling.
- **Comprehensive Error Handling** for robust error management.
- **Middleware Support** for authentication, validation, and more.
- **Environment Variables** for easy configuration.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### User Management

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/password` - Update user password
- `DELETE /api/users/:id` - Delete user (admin only)

### Brand Management

- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get brand by ID
- `POST /api/brands` - Create a new brand
- `PUT /api/brands/:id` - Update a brand
- `DELETE /api/brands/:id` - Delete a brand

### Product Management

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Accessory Management

- `GET /api/accessories` - Get all accessories
- `GET /api/accessories/:id` - Get accessory by ID
- `POST /api/accessories` - Create a new accessory
- `PUT /api/accessories/:id` - Update an accessory
- `DELETE /api/accessories/:id` - Delete an accessory

### Spare Part Management

- `GET /api/spare-parts` - Get all spare parts
- `GET /api/spare-parts/:id` - Get spare part by ID
- `POST /api/spare-parts` - Create a new spare part
- `PUT /api/spare-parts/:id` - Update a spare part
- `DELETE /api/spare-parts/:id` - Delete a spare part

## Getting Started

### Installation

1. Clone the repository:
   ```sh
   git clone <repository_url>
   ```
2. Copy the `.env.example` file and rename it to `.env`:
   ```sh
   cp .env.example .env
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Build and start for production:
   ```sh
   npm run build
   npm start
   ```

## Testing API Endpoints

You can use **Postman**, **Insomnia**, or **curl** to test the endpoints.

### Example: Register a User

```sh
POST /api/auth/register
Content-Type: application/json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Example: Login User

```sh
POST /api/auth/login
Content-Type: application/json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Example: Get Products

```sh
GET /api/products
```

## Filtering & Searching

- Products: `GET /api/products?brand=FMS&minPrice=100&maxPrice=500`
- Accessories: `GET /api/accessories?brand=FMS&category=Power&inStock=true`
- Spare Parts: `GET /api/spare-parts?brand=FMS&category=Propulsion`

## Error Handling

- `400` - Bad Request (Validation Errors)
- `401` - Unauthorized (Authentication Required)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found (Resource Not Found)
- `409` - Conflict (Duplicate Entry)
- `500` - Internal Server Error

## Next Steps

- Implement **pagination** for large datasets.
- Add **search functionality** for products and accessories.
- Enable **image uploads** via cloud storage.
- Optimize with **Redis caching** for frequent data requests.

---

Let me know if you need any modifications or additional features! 🚀

