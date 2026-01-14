# FBR Invoice Management API Documentation

**Base URL**: `http://localhost:5000/api/v1`

**Last Updated**: January 14, 2026

---

## Table of Contents
- [Rate Limiting](#rate-limiting)
- [Authentication APIs](#authentication-apis)
  - [Login](#1-login)
  - [Refresh Token](#2-refresh-token)
  - [Logout](#3-logout)
  - [Get Profile](#4-get-profile)
- [User Management APIs (Admin Only)](#user-management-apis-admin-only)
  - [Create User](#1-create-user)
  - [Get All Users](#2-get-all-users)
  - [Get User by ID](#3-get-user-by-id)
  - [Update User](#4-update-user)
  - [Delete User](#5-delete-user)
  - [Toggle User Status](#6-toggle-user-status)
  - [Update User Password](#7-update-user-password)
- [Error Responses](#error-responses)

---

## Rate Limiting

**DDoS Protection**: All API endpoints are protected with rate limiting to prevent abuse and DDoS attacks.

### Rate Limit Tiers

| Endpoint Type | Limit | Window | Response Headers |
|--------------|-------|--------|------------------|
| **General API** | 100 requests | 15 minutes | `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` |
| **Authentication** (login, refresh) | 5 requests | 15 minutes | `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` |
| **User Creation** | 10 requests | 1 hour | `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` |
| **Password Update** | 3 requests | 1 hour | `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` |

### Rate Limit Headers

Every response includes rate limit information in headers:

```
RateLimit-Limit: 100          # Maximum requests allowed
RateLimit-Remaining: 95       # Remaining requests in current window
RateLimit-Reset: 1705251600   # Unix timestamp when limit resets
```

### Rate Limit Exceeded Response

**Status Code**: 429 Too Many Requests

**Response**:
```json
{
  "status": "fail",
  "message": "Too many requests from this IP, please try again later."
}
```

**For Authentication Endpoints**:
```json
{
  "status": "fail",
  "message": "Too many authentication attempts, please try again after 15 minutes."
}
```

**For User Creation**:
```json
{
  "status": "fail",
  "message": "Too many user creation attempts, please try again later."
}
```

**For Password Updates**:
```json
{
  "status": "fail",
  "message": "Too many password change attempts, please try again after an hour."
}
```

---

## Authentication APIs

### 1. Login

Login with email and password to get access and refresh tokens.

**Endpoint**: `POST /auth/login`

**Rate Limit**: 5 requests per 15 minutes per IP

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "admin@fbr.gov.pk",
  "password": "Admin@123"
}
```

**cURL Request**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@fbr.gov.pk\",\"password\":\"Admin@123\"}"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Xenax_33",
      "email": "admin@fbr.gov.pk",
      "businessName": "FBR Admin",
      "province": "Islamabad Capital Territory",
      "address": "Constitution Avenue, Islamabad",
      "ntncnic": "1234567890123",
      "role": "ADMIN",
      "postInvoiceTokenTest": null,
      "validateInvoiceTokenTest": null,
      "postInvoiceToken": null,
      "validateInvoiceToken": null,
      "isActive": true,
      "createdAt": "2026-01-14T15:30:00.000Z",
      "updatedAt": "2026-01-14T15:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:

**400 Bad Request** - Validation Error:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400
  },
  "message": "[{\"field\":\"email\",\"message\":\"Please provide a valid email\"}]"
}
```

**401 Unauthorized** - Invalid Credentials:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Invalid email or password"
}
```

---

### 2. Refresh Token

Get a new access token using a refresh token.

**Endpoint**: `POST /auth/refresh`

**Rate Limit**: 5 requests per 15 minutes per IP

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Request**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:

**400 Bad Request** - Missing Token:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400
  },
  "message": "Refresh token is required"
}
```

**401 Unauthorized** - Invalid/Expired Token:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Invalid or expired refresh token"
}
```

---

### 3. Logout

Logout and invalidate the refresh token.

**Endpoint**: `POST /auth/logout`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Request**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### 4. Get Profile

Get the current authenticated user's profile.

**Endpoint**: `GET /auth/profile`

**Headers**:
```
Authorization: Bearer <access-token>
```

**cURL Request**:
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Xenax_33",
      "email": "admin@fbr.gov.pk",
      "businessName": "FBR Admin",
      "province": "Islamabad Capital Territory",
      "address": "Constitution Avenue, Islamabad",
      "ntncnic": "1234567890123",
      "role": "ADMIN",
      "postInvoiceTokenTest": null,
      "validateInvoiceTokenTest": null,
      "postInvoiceToken": null,
      "validateInvoiceToken": null,
      "isActive": true,
      "createdAt": "2026-01-14T15:30:00.000Z",
      "updatedAt": "2026-01-14T15:30:00.000Z"
    }
  }
}
```

**Error Responses**:

**401 Unauthorized** - Missing Token:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Authentication token is required"
}
```

**401 Unauthorized** - Invalid Token:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Invalid or expired token"
}
```

**404 Not Found** - User Not Found:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404
  },
  "message": "User not found"
}
```

---

## User Management APIs (Admin Only)

All user management endpoints require:
- **Authentication**: Valid access token
- **Authorization**: ADMIN role

**Required Header**:
```
Authorization: Bearer <admin-access-token>
```

---

### 1. Create User

Create a new user (Admin only).

**Endpoint**: `POST /users`

**Rate Limit**: 10 requests per hour per IP

**Headers**:
```
Authorization: Bearer <admin-access-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "businessName": "ABC Trading Company",
  "province": "Punjab",
  "address": "123 Main Street, Lahore, Pakistan",
  "ntncnic": "3520212345678",
  "password": "SecurePass@123",
  "postInvoiceTokenTest": "test_token_123",
  "validateInvoiceTokenTest": "validate_test_token_456",
  "postInvoiceToken": "prod_token_789",
  "validateInvoiceToken": "validate_prod_token_012"
}
```

**Note**: All FBR token fields are optional. Only include them if you have the tokens.

**cURL Request**:
```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john.doe@example.com\",\"businessName\":\"ABC Trading Company\",\"province\":\"Punjab\",\"address\":\"123 Main Street, Lahore\",\"ntncnic\":\"3520212345678\",\"password\":\"SecurePass@123\"}"
```

**Success Response (201 Created)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "businessName": "ABC Trading Company",
      "province": "Punjab",
      "address": "123 Main Street, Lahore, Pakistan",
      "ntncnic": "3520212345678",
      "role": "USER",
      "postInvoiceTokenTest": "test_token_123",
      "validateInvoiceTokenTest": "validate_test_token_456",
      "postInvoiceToken": "prod_token_789",
      "validateInvoiceToken": "validate_prod_token_012",
      "isActive": true,
      "createdAt": "2026-01-14T16:00:00.000Z",
      "updatedAt": "2026-01-14T16:00:00.000Z"
    }
  }
}
```

**Error Responses**:

**400 Bad Request** - Validation Error:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400
  },
  "message": "[{\"field\":\"email\",\"message\":\"Please provide a valid email\"},{\"field\":\"password\",\"message\":\"Password must be at least 8 characters long\"}]"
}
```

**400 Bad Request** - Duplicate User:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400
  },
  "message": "User with this email or NTN/CNIC already exists"
}
```

**401 Unauthorized** - Not Authenticated:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Authentication token is required"
}
```

**403 Forbidden** - Not Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "You do not have permission to perform this action"
}
```

---

### 2. Get All Users

Get a paginated list of all users with optional filtering.

**Endpoint**: `GET /users`

**Headers**:
```
Authorization: Bearer <admin-access-token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in name, email, business name, or NTN/CNIC
- `role` (optional): Filter by role (ADMIN or USER)
- `isActive` (optional): Filter by active status (true or false)

**cURL Request**:
```bash
# Get all users (page 1, 10 per page)
curl -X GET "http://localhost:5000/api/v1/users" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# With pagination
curl -X GET "http://localhost:5000/api/v1/users?page=2&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# With search
curl -X GET "http://localhost:5000/api/v1/users?search=john" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# Filter by role and status
curl -X GET "http://localhost:5000/api/v1/users?role=USER&isActive=true" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# Combined filters
curl -X GET "http://localhost:5000/api/v1/users?page=1&limit=5&search=trading&role=USER&isActive=true" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Xenax_33",
        "email": "admin@fbr.gov.pk",
        "businessName": "FBR Admin",
        "province": "Islamabad Capital Territory",
        "address": "Constitution Avenue, Islamabad",
        "ntncnic": "1234567890123",
        "role": "ADMIN",
        "isActive": true,
        "createdAt": "2026-01-14T15:30:00.000Z",
        "updatedAt": "2026-01-14T15:30:00.000Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "businessName": "ABC Trading Company",
        "province": "Punjab",
        "address": "123 Main Street, Lahore",
        "ntncnic": "3520212345678",
        "role": "USER",
        "isActive": true,
        "createdAt": "2026-01-14T16:00:00.000Z",
        "updatedAt": "2026-01-14T16:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

**Error Responses**:

**401 Unauthorized** - Not Authenticated:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Authentication token is required"
}
```

**403 Forbidden** - Not Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "You do not have permission to perform this action"
}
```

---

### 3. Get User by ID

Get detailed information about a specific user.

**Endpoint**: `GET /users/:id`

**Headers**:
```
Authorization: Bearer <admin-access-token>
```

**URL Parameters**:
- `id`: User ID (UUID)

**cURL Request**:
```bash
curl -X GET "http://localhost:5000/api/v1/users/660e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "businessName": "ABC Trading Company",
      "province": "Punjab",
      "address": "123 Main Street, Lahore, Pakistan",
      "ntncnic": "3520212345678",
      "role": "USER",
      "postInvoiceTokenTest": "test_token_123",
      "validateInvoiceTokenTest": "validate_test_token_456",
      "postInvoiceToken": "prod_token_789",
      "validateInvoiceToken": "validate_prod_token_012",
      "isActive": true,
      "createdAt": "2026-01-14T16:00:00.000Z",
      "updatedAt": "2026-01-14T16:00:00.000Z"
    }
  }
}
```

**Error Responses**:

**401 Unauthorized** - Not Authenticated:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Authentication token is required"
}
```

**403 Forbidden** - Not Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "You do not have permission to perform this action"
}
```

**404 Not Found** - User Not Found:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404
  },
  "message": "User not found"
}
```

---

### 4. Update User

Update user information (Admin only).

**Endpoint**: `PATCH /users/:id`

**Headers**:
```
Authorization: Bearer <admin-access-token>
Content-Type: application/json
```

**URL Parameters**:
- `id`: User ID (UUID)

**Request Body** (all fields are optional):
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "businessName": "XYZ Trading Company",
  "province": "Sindh",
  "address": "456 New Avenue, Karachi",
  "ntncnic": "4210312345678",
  "postInvoiceTokenTest": "new_test_token",
  "validateInvoiceTokenTest": "new_validate_test_token",
  "postInvoiceToken": "new_prod_token",
  "validateInvoiceToken": "new_validate_prod_token"
}
```

**cURL Request**:
```bash
curl -X PATCH "http://localhost:5000/api/v1/users/660e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Smith\",\"businessName\":\"XYZ Trading Company\"}"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "businessName": "XYZ Trading Company",
      "province": "Sindh",
      "address": "456 New Avenue, Karachi",
      "ntncnic": "4210312345678",
      "role": "USER",
      "postInvoiceTokenTest": "new_test_token",
      "validateInvoiceTokenTest": "new_validate_test_token",
      "postInvoiceToken": "new_prod_token",
      "validateInvoiceToken": "new_validate_prod_token",
      "isActive": true,
      "createdAt": "2026-01-14T16:00:00.000Z",
      "updatedAt": "2026-01-14T17:00:00.000Z"
    }
  }
}
```

**Error Responses**:

**400 Bad Request** - Validation Error:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400
  },
  "message": "[{\"field\":\"email\",\"message\":\"Please provide a valid email\"}]"
}
```

**400 Bad Request** - Duplicate Email/NTN:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400
  },
  "message": "Email or NTN/CNIC already in use"
}
```

**401 Unauthorized** - Not Authenticated:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Authentication token is required"
}
```

**403 Forbidden** - Not Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "You do not have permission to perform this action"
}
```

**404 Not Found** - User Not Found:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404
  },
  "message": "User not found"
}
```

---

### 5. Delete User

Delete a user (Admin only). Cannot delete admin users.

**Endpoint**: `DELETE /users/:id`

**Headers**:
```
Authorization: Bearer <admin-access-token>
```

**URL Parameters**:
- `id`: User ID (UUID)

**cURL Request**:
```bash
curl -X DELETE "http://localhost:5000/api/v1/users/660e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

**Success Response (204 No Content)**:
```json
{
  "status": "success",
  "data": null
}
```

**Error Responses**:

**401 Unauthorized** - Not Authenticated:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Authentication token is required"
}
```

**403 Forbidden** - Not Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "You do not have permission to perform this action"
}
```

**403 Forbidden** - Cannot Delete Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "Cannot delete admin user"
}
```

**404 Not Found** - User Not Found:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404
  },
  "message": "User not found"
}
```

---

### 6. Toggle User Status

Toggle a user's active/inactive status (Admin only). Cannot deactivate admin users.

**Endpoint**: `PATCH /users/:id/toggle-status`

**Headers**:
```
Authorization: Bearer <admin-access-token>
```

**URL Parameters**:
- `id`: User ID (UUID)

**cURL Request**:
```bash
curl -X PATCH "http://localhost:5000/api/v1/users/660e8400-e29b-41d4-a716-446655440001/toggle-status" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "businessName": "ABC Trading Company",
      "isActive": false
    }
  }
}
```

**Error Responses**:

**401 Unauthorized** - Not Authenticated:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Authentication token is required"
}
```

**403 Forbidden** - Not Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "You do not have permission to perform this action"
}
```

**403 Forbidden** - Cannot Deactivate Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "Cannot deactivate admin user"
}
```

**404 Not Found** - User Not Found:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404
  },
  "message": "User not found"
}
```

---

### 7. Update User Password

Update a user's password (Admin only). This will force the user to re-login.

**Endpoint**: `PATCH /users/:id/password`

**Rate Limit**: 3 requests per hour per IP

**Headers**:
```
Authorization: Bearer <admin-access-token>
Content-Type: application/json
```

**URL Parameters**:
- `id`: User ID (UUID)

**Request Body**:
```json
{
  "password": "NewSecurePass@456"
}
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&#)

**cURL Request**:
```bash
curl -X PATCH "http://localhost:5000/api/v1/users/660e8400-e29b-41d4-a716-446655440001/password" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"NewSecurePass@456\"}"
```

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

**Note**: All refresh tokens for this user are invalidated, forcing re-login.

**Error Responses**:

**400 Bad Request** - Validation Error:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400
  },
  "message": "[{\"field\":\"password\",\"message\":\"Password must be at least 8 characters long\"}]"
}
```

**401 Unauthorized** - Not Authenticated:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 401
  },
  "message": "Authentication token is required"
}
```

**403 Forbidden** - Not Admin:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 403
  },
  "message": "You do not have permission to perform this action"
}
```

**404 Not Found** - User Not Found:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404
  },
  "message": "User not found"
}
```

---

## Error Responses

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

### Error Response Format

All errors follow this format:

```json
{
  "status": "fail" | "error",
  "error": {
    "statusCode": 400,
    // Additional error details in development mode
  },
  "message": "Error message here"
}
```

### Validation Errors

Validation errors return an array of field-specific errors:

```json
{
  "status": "fail",
  "error": {
    "statusCode": 400
  },
  "message": "[{\"field\":\"email\",\"message\":\"Please provide a valid email\"},{\"field\":\"password\",\"message\":\"Password must be at least 8 characters long\"}]"
}
```

---

## Authentication Flow

1. **Login**: Call `/auth/login` with email and password
2. **Store Tokens**: Save both `accessToken` and `refreshToken`
3. **API Requests**: Include `accessToken` in `Authorization: Bearer <token>` header
4. **Token Expiry**: When access token expires (401 error), call `/auth/refresh`
5. **Logout**: Call `/auth/logout` with refresh token to invalidate session

---

## Testing with cURL

### Complete Flow Example

```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fbr.gov.pk","password":"Admin@123"}'

# Save the accessToken and refreshToken from response

# 2. Create a new user
curl -X POST http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","businessName":"Test Business","province":"Punjab","address":"Test Address","ntncnic":"1234567890123","password":"TestPass@123"}'

# 3. Get all users
curl -X GET http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Logout
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- User IDs are UUIDs (v4)
- Access tokens expire in 24 hours
- Refresh tokens expire in 7 days
- All API endpoints return JSON responses
- Passwords are hashed using bcrypt (12 rounds)
- NTN/CNIC must be exactly 13 digits

---

**Last Updated**: January 14, 2026
**Version**: 1.0.0
