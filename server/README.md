# Product Management API

A RESTful backend API built with Node.js, Express, and MongoDB, featuring JWT-based authentication (with refresh-token rotation) and full product management with image uploads via ImageKit.

The project follows a centralized error-handling pattern, request validation with `express-validator`, and a clean, modular folder structure.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth Routes](#auth-routes)
  - [Product Routes](#product-routes)
- [Validation Rules](#validation-rules)
- [Error Handling](#error-handling)
- [Response Structure](#response-structure)
- [Image Upload Flow](#image-upload-flow)
- [Authentication Flow](#authentication-flow)
- [Testing](#testing)
- [Security Considerations](#security-considerations)
- [API Summary](#api-summary)
- [License](#license)

---

## Features

**Authentication**

- User registration & login
- JWT access tokens + refresh tokens
- HTTP-only refresh-token cookies
- Refresh-token rotation
- Logout & "get current user"
- Password hashing
- Auth middleware with centralized error handling

**Product Management**

- Create, read, update, and delete products
- Product ID & request validation
- Image upload via ImageKit (Multer for parsing/validation)

**Core Utilities**

- Centralized `ApiError` and `ApiResponse` classes
- Async controller error handling (`asyncHandler`)
- Global error handler
- Request validation via `express-validator`

---

## Tech Stack

| Category      | Technology                     |
| ------------- | ------------------------------ |
| Runtime       | Node.js                        |
| Framework     | Express.js                     |
| Database      | MongoDB + Mongoose             |
| Auth          | JWT (`jsonwebtoken`), `bcrypt` |
| Validation    | `express-validator`            |
| File Upload   | Multer                         |
| Image Hosting | ImageKit                       |
| Cookies       | `cookie-parser`                |

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── auth/
│   │   │   ├── login.controller.js
│   │   │   ├── logout.controller.js
│   │   │   ├── me.controller.js
│   │   │   ├── refresh-token.controller.js
│   │   │   └── register.controller.js
│   │   │
│   │   └── product/
│   │       ├── create-product.controller.js
│   │       ├── delete-product.controller.js
│   │       ├── get-product.controller.js
│   │       ├── get-products.controller.js
│   │       └── update-product.controller.js
│   │
│   ├── core/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── errorHandler.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── image-upload.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── product.model.js
│   │
│   ├── routes/
│   │   ├── auth.route.js
│   │   └── products.route.js
│   │
│   ├── utils/
│   │   ├── cookie.util.js
│   │   ├── password.utils.js
│   │   ├── token.utils.js
│   │   └── providers/
│   │       └── imagekit.service.js
│   │
│   ├── integrations/
│   │   └── media/
│   │       └── image.provider.js
│   │
│   ├── validators/
│   │   ├── auth/
│   │   │   ├── login.validator.js
│   │   │   └── register.validator.js
│   │   │
│   │   └── product/
│   │       ├── create-product.validator.js
│   │       ├── product-id.validator.js
│   │       └── update-product.validator.js
│   │
│   └── app.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js
```

---

## Installation

1. **Clone the project**

   ```bash
   git clone <your-repository-url>
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   PORT=5000

   MONGO_URI=mongodb://localhost:27017/product-api

   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=15m

   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=7d

   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

   > ⚠️ Use strong, unique secrets in production. Never commit `.env` to Git.

---

## Running the Server

**Development**

```bash
npm run dev
```

**Production**

```bash
npm start
```

The API will be available at `http://localhost:5000` (or your configured `PORT`).

---

## Authentication

The API uses a two-token authentication system.

### Access Token

- A short-lived JWT returned in the login/register response.
- Sent by the client on protected requests via the `Authorization` header:
  ```
  Authorization: Bearer <access_token>
  ```
- The auth middleware reads the header, verifies the JWT, looks up the user, and attaches it to `req.user`.

### Refresh Token

- Stored as an **HTTP-only cookie** (`refreshToken=<token>`) — never returned in the response body.
- When the access token expires, the client calls `POST /api/auth/refresh-token`.
- The server reads the cookie, verifies the token, hashes it, compares it against the stored hash, and — if valid — issues a **new** access token and a **new** refresh token (rotation), storing the new hash and resetting the cookie.

---

## API Endpoints

All routes below are mounted at `/api`.

### Auth Routes

#### Register

```
POST /api/auth/register
```

**Request body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response** `201 Created`

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Registration Successful!",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
    "accessToken": "..."
  }
}
```

A refresh token is also set as an HTTP-only cookie.

#### Login

```
POST /api/auth/login
```

**Request body**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login Successful!",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
    "accessToken": "..."
  }
}
```

#### Refresh Access Token

```
POST /api/auth/refresh-token
```

No request body needed — requires a valid `refreshToken` cookie.

**Response** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Access token refreshed successfully.",
  "data": { "accessToken": "..." }
}
```

#### Logout

```
POST /api/auth/logout
```

🔒 Requires `Authorization: Bearer <access_token>`

**Response** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Logout Successful!",
  "data": null
}
```

Clears the stored refresh-token hash and the refresh-token cookie.

#### Get Current User

```
GET /api/auth/me
```

🔒 Requires `Authorization: Bearer <access_token>`

**Response** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User fetched successfully.",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
  }
}
```

---

### Product Routes

#### Create Product

```
POST /api/products
```

🔒 Requires `Authorization: Bearer <access_token>`
Content-Type: `multipart/form-data`

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `name`        | String | Yes      |
| `description` | String | Yes      |
| `price`       | Number | Yes      |
| `category`    | String | Yes      |
| `stock`       | Number | No       |
| `image`       | File   | Yes      |

Supported image types: **JPEG, PNG, WebP** — max size **5 MB**.

**Response** `201 Created`

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "product": {
      "_id": "...",
      "name": "iPhone 15",
      "description": "Latest Apple smartphone",
      "price": 79999,
      "category": "Electronics",
      "stock": 10,
      "image": "https://ik.imagekit.io/..."
    }
  }
}
```

#### Get All Products

```
GET /api/products
```

No authentication required.

**Response** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Products fetched successfully.",
  "data": { "products": [] }
}
```

#### Get Single Product

```
GET /api/products/:id
```

No authentication required.

**Response** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product fetched successfully.",
  "data": { "product": { "_id": "...", "name": "iPhone 15", "...": "..." } }
}
```

#### Update Product

```
PATCH /api/products/:id
```

🔒 Requires `Authorization: Bearer <access_token>`
Content-Type: `application/json`

All fields optional — only supplied fields are updated. **Image cannot be updated here** (image uploads only happen on creation).

```json
{
  "name": "iPhone 15 Pro",
  "price": 99999,
  "stock": 5
}
```

**Response** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product updated successfully.",
  "data": {
    "product": {
      "_id": "...",
      "name": "iPhone 15 Pro",
      "price": 99999,
      "stock": 5,
      "...": "..."
    }
  }
}
```

#### Delete Product

```
DELETE /api/products/:id
```

🔒 Requires `Authorization: Bearer <access_token>`

**Response** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product deleted successfully.",
  "data": null
}
```

---

## Validation Rules

**Create Product**

| Field         | Rules                                 |
| ------------- | ------------------------------------- |
| `name`        | Required, string, 2–100 chars         |
| `description` | Required, string, 10–2000 chars       |
| `price`       | Required, number, ≥ 0                 |
| `category`    | Required, string, 2–50 chars          |
| `stock`       | Optional, integer, ≥ 0, defaults to 0 |
| `image`       | Required, JPEG/PNG/WebP, max 5 MB     |

**Update Product**

All fields optional; only supplied fields are validated and updated. E.g. `{ "price": 499 }` updates only the price.

---

## Error Handling

The API uses a centralized error-handling system built around a custom `ApiError` class:

```js
throw new ApiError(404, "Product not found.");
```

**Standard error response**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product not found.",
  "errors": []
}
```

**Validation error response**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid product data.",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Product name is required",
      "path": "name",
      "location": "body"
    }
  ]
}
```

**Unexpected server error**

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Response Structure

All successful responses use a standardized `ApiResponse` shape:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {}
}
```

`success` is derived automatically from the status code: `success = statusCode < 400`.

---

## Image Upload Flow

```
Client
  │  multipart/form-data
  ▼
Multer (memory storage, 5 MB limit)
  │  req.file.buffer
  ▼
Create Product Controller
  │
  ▼
Image Provider
  │
  ▼
ImageKit
  │  image URL
  ▼
MongoDB
```

The resulting ImageKit URL is stored on the product document, e.g. `image: "https://ik.imagekit.io/..."`.

---

## Authentication Flow

**Register**

```
Hash password → Create user → Generate access token → Generate refresh token → Set HTTP-only cookie
```

**Login**

```
Find user → Verify password → Generate access token → Generate refresh token → Set HTTP-only cookie
```

**Protected Request**

```
Authorization: Bearer <accessToken> → Auth Middleware (verify JWT → find user → attach req.user)
```

---

## Testing

Recommended tools: **Postman**, **Insomnia**, or **Thunder Client**.

Suggested testing order:

1. Register
2. Login
3. Copy access token
4. Create product
5. Get all products
6. Get product by ID
7. Update product
8. Delete product
9. Get `/me`
10. Refresh access token
11. Logout

> For product creation, use `multipart/form-data` and attach the image under the field name `image`.

---

## Security Considerations

- Passwords are hashed before storage
- Refresh tokens are hashed before database storage
- Refresh tokens are stored in HTTP-only cookies
- Access tokens are required for protected routes
- Input is validated via `express-validator`
- Uploaded images are restricted by MIME type and size (≤ 5 MB)
- Sensitive user fields are excluded from auth responses

For production, consider adding: rate limiting, CORS configuration, CSRF protection, stronger authorization checks, structured logging, and more comprehensive input validation.

---

## API Summary

| Method | Endpoint                  | Auth   | Description          |
| ------ | ------------------------- | ------ | -------------------- |
| POST   | `/api/auth/register`      | No     | Register user        |
| POST   | `/api/auth/login`         | No     | Login user           |
| POST   | `/api/auth/refresh-token` | Cookie | Refresh access token |
| POST   | `/api/auth/logout`        | Yes    | Logout user          |
| GET    | `/api/auth/me`            | Yes    | Get current user     |
| POST   | `/api/products`           | Yes    | Create product       |
| GET    | `/api/products`           | No     | Get all products     |
| GET    | `/api/products/:id`       | No     | Get product          |
| PATCH  | `/api/products/:id`       | Yes    | Update product       |
| DELETE | `/api/products/:id`       | Yes    | Delete product       |

---

## License

This project was created as an assignment/project for educational purposes.
