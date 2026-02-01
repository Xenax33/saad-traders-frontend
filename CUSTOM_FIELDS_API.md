# Custom Fields API Documentation

## Overview

The Custom Fields API allows users to define and manage custom fields that can be attached to invoices. These fields are user-specific and stored locally in your database - they are NOT sent to the FBR API. This feature enables users to track additional invoice data relevant to their business needs.

**Base URL:** `/api/v1/custom-fields`

**Authentication:** All endpoints require Bearer token authentication.

---

## Table of Contents

1. [Create Custom Field](#1-create-custom-field)
2. [Get All Custom Fields](#2-get-all-custom-fields)
3. [Get Custom Field by ID](#3-get-custom-field-by-id)
4. [Update Custom Field](#4-update-custom-field)
5. [Delete Custom Field](#5-delete-custom-field)
6. [Using Custom Fields in Invoices](#6-using-custom-fields-in-invoices)

---

## 1. Create Custom Field

Create a new custom field definition for the authenticated user.

**Endpoint:** `POST /api/v1/custom-fields`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:**
```json
{
  "fieldName": "rate",
  "fieldType": "number"
}
```

**Field Types:** `text`, `number`, `date`, `textarea`

**Validation Rules:**
- `fieldName`: Required, 1-50 characters, alphanumeric with underscores and spaces
- `fieldType`: Required, must be one of: `text`, `number`, `date`, `textarea`
- Field names must be unique per user

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Custom field created successfully",
  "data": {
    "customField": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "456e7890-e89b-12d3-a456-426614174001",
      "fieldName": "rate",
      "fieldType": "number",
      "isActive": true,
      "createdAt": "2026-02-01T10:30:00.000Z",
      "updatedAt": "2026-02-01T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "status": "fail",
  "message": "A custom field with this name already exists"
}
```

---

## 2. Get All Custom Fields

Retrieve all custom fields for the authenticated user.

**Endpoint:** `GET /api/v1/custom-fields`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Query Parameters:**
- `includeInactive` (optional): `true` | `false` - Include deactivated fields (default: `false`)

**Request Example:**
```
GET /api/v1/custom-fields?includeInactive=false
```

**Success Response (200):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "customFields": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "userId": "456e7890-e89b-12d3-a456-426614174001",
        "fieldName": "rate",
        "fieldType": "number",
        "isActive": true,
        "createdAt": "2026-02-01T10:30:00.000Z",
        "updatedAt": "2026-02-01T10:30:00.000Z"
      },
      {
        "id": "223e4567-e89b-12d3-a456-426614174002",
        "userId": "456e7890-e89b-12d3-a456-426614174001",
        "fieldName": "units",
        "fieldType": "text",
        "isActive": true,
        "createdAt": "2026-02-01T09:15:00.000Z",
        "updatedAt": "2026-02-01T09:15:00.000Z"
      },
      {
        "id": "323e4567-e89b-12d3-a456-426614174003",
        "userId": "456e7890-e89b-12d3-a456-426614174001",
        "fieldName": "delivery_date",
        "fieldType": "date",
        "isActive": true,
        "createdAt": "2026-02-01T08:00:00.000Z",
        "updatedAt": "2026-02-01T08:00:00.000Z"
      }
    ]
  }
}
```

---

## 3. Get Custom Field by ID

Retrieve a specific custom field by its ID.

**Endpoint:** `GET /api/v1/custom-fields/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Request Example:**
```
GET /api/v1/custom-fields/123e4567-e89b-12d3-a456-426614174000
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "customField": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "456e7890-e89b-12d3-a456-426614174001",
      "fieldName": "rate",
      "fieldType": "number",
      "isActive": true,
      "createdAt": "2026-02-01T10:30:00.000Z",
      "updatedAt": "2026-02-01T10:30:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "status": "fail",
  "message": "Custom field not found"
}
```

---

## 4. Update Custom Field

Update an existing custom field.

**Endpoint:** `PUT /api/v1/custom-fields/:id`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Request Body:** (All fields optional)
```json
{
  "fieldName": "discount_rate",
  "fieldType": "number",
  "isActive": true
}
```

**Request Example:**
```
PUT /api/v1/custom-fields/123e4567-e89b-12d3-a456-426614174000
```

**Validation Rules:**
- `fieldName`: Optional, 1-50 characters, alphanumeric with underscores and spaces, must be unique
- `fieldType`: Optional, must be one of: `text`, `number`, `date`, `textarea`
- `isActive`: Optional, boolean

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Custom field updated successfully",
  "data": {
    "customField": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "456e7890-e89b-12d3-a456-426614174001",
      "fieldName": "discount_rate",
      "fieldType": "number",
      "isActive": true,
      "createdAt": "2026-02-01T10:30:00.000Z",
      "updatedAt": "2026-02-01T11:45:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "status": "fail",
  "message": "A custom field with this name already exists"
}
```

**Error Response (404):**
```json
{
  "status": "fail",
  "message": "Custom field not found"
}
```

---

## 5. Delete Custom Field

Delete or deactivate a custom field.

**Endpoint:** `DELETE /api/v1/custom-fields/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Query Parameters:**
- `hardDelete` (optional): `true` | `false` - Permanently delete the field (default: `false` - soft delete)

**Request Examples:**

Soft delete (deactivate):
```
DELETE /api/v1/custom-fields/123e4567-e89b-12d3-a456-426614174000
```

Hard delete (permanent):
```
DELETE /api/v1/custom-fields/123e4567-e89b-12d3-a456-426614174000?hardDelete=true
```

**Success Response (200) - Soft Delete:**
```json
{
  "status": "success",
  "message": "Custom field deactivated successfully"
}
```

**Success Response (200) - Hard Delete:**
```json
{
  "status": "success",
  "message": "Custom field permanently deleted"
}
```

**Error Response (404):**
```json
{
  "status": "fail",
  "message": "Custom field not found"
}
```

---

## 6. Using Custom Fields in Invoices

Once you've created custom fields, you can include them when posting invoices.

### Modified Invoice Creation Endpoint

**Endpoint:** `POST /api/v1/invoices`

**Request Body Example:**
```json
{
  "invoiceType": "Sales",
  "invoiceDate": "2026-02-01",
  "buyerId": "789e0123-e89b-12d3-a456-426614174002",
  "scenarioId": "890e1234-e89b-12d3-a456-426614174003",
  "invoiceRefNo": "INV-2026-001",
  "isTestEnvironment": true,
  "items": [
    {
      "hsCodeId": "abc12345-e89b-12d3-a456-426614174004",
      "productDescription": "Steel Rods",
      "rate": "100",
      "uoM": "KG",
      "quantity": 500,
      "totalValues": 50000,
      "valueSalesExcludingST": 45000,
      "fixedNotifiedValueOrRetailPrice": 100,
      "salesTaxApplicable": 5000,
      "salesTaxWithheldAtSource": 0,
      "extraTax": "",
      "furtherTax": 0,
      "sroScheduleNo": "",
      "fedPayable": 0,
      "discount": 0,
      "sroItemSerialNo": ""
    }
  ],
  "customFields": [
    {
      "customFieldId": "123e4567-e89b-12d3-a456-426614174000",
      "value": "95.50"
    },
    {
      "customFieldId": "223e4567-e89b-12d3-a456-426614174002",
      "value": "kilograms"
    },
    {
      "customFieldId": "323e4567-e89b-12d3-a456-426614174003",
      "value": "2026-02-15"
    }
  ]
}
```

**Custom Fields Validation:**
- `customFields`: Optional array
- `customFields[].customFieldId`: Required if customFields provided, must be valid UUID, must belong to user
- `customFields[].value`: Required if customFields provided, stored as string

**Important Notes:**
- Custom fields are stored locally in your database
- Custom fields are NOT sent to the FBR API
- Custom field values are always stored as strings, regardless of field type
- Only active custom fields that belong to the user can be used
- Custom field values will be included when retrieving invoice data

### Invoice Response with Custom Fields

When you retrieve invoices (GET requests), custom fields will be included:

```json
{
  "status": "success",
  "data": {
    "invoice": {
      "id": "invoice-uuid",
      "invoiceType": "Sales",
      "invoiceDate": "2026-02-01",
      "fbrInvoiceNumber": "FBR123456789",
      "items": [...],
      "buyer": {...},
      "scenario": {...},
      "customFieldValues": [
        {
          "id": "value-uuid-1",
          "invoiceId": "invoice-uuid",
          "customFieldId": "123e4567-e89b-12d3-a456-426614174000",
          "value": "95.50",
          "customField": {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "fieldName": "rate",
            "fieldType": "number",
            "isActive": true
          },
          "createdAt": "2026-02-01T12:00:00.000Z",
          "updatedAt": "2026-02-01T12:00:00.000Z"
        },
        {
          "id": "value-uuid-2",
          "invoiceId": "invoice-uuid",
          "customFieldId": "223e4567-e89b-12d3-a456-426614174002",
          "value": "kilograms",
          "customField": {
            "id": "223e4567-e89b-12d3-a456-426614174002",
            "fieldName": "units",
            "fieldType": "text",
            "isActive": true
          },
          "createdAt": "2026-02-01T12:00:00.000Z",
          "updatedAt": "2026-02-01T12:00:00.000Z"
        }
      ],
      "createdAt": "2026-02-01T12:00:00.000Z",
      "updatedAt": "2026-02-01T12:00:00.000Z"
    }
  }
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "status": "fail",
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "status": "fail",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "status": "fail",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Implementation Workflow

### Step 1: Create Custom Fields
Before creating invoices with custom fields, define the fields:

```javascript
// Create custom field for rate
POST /api/v1/custom-fields
{
  "fieldName": "discount_rate",
  "fieldType": "number"
}

// Create custom field for notes
POST /api/v1/custom-fields
{
  "fieldName": "internal_notes",
  "fieldType": "textarea"
}
```

### Step 2: List Your Custom Fields
Retrieve your custom field IDs:

```javascript
GET /api/v1/custom-fields
```

### Step 3: Create Invoice with Custom Fields
Use the custom field IDs when creating invoices:

```javascript
POST /api/v1/invoices
{
  "invoiceType": "Sales",
  "buyerId": "...",
  "scenarioId": "...",
  "items": [...],
  "customFields": [
    {
      "customFieldId": "<discount_rate_field_id>",
      "value": "5.5"
    },
    {
      "customFieldId": "<internal_notes_field_id>",
      "value": "Rush order - deliver before Feb 10"
    }
  ]
}
```

### Step 4: Retrieve Invoices
Custom fields will be included automatically:

```javascript
GET /api/v1/invoices
GET /api/v1/invoices/:id
```

---

## Best Practices

1. **Field Naming**: Use clear, descriptive names (e.g., "delivery_date" instead of "dd")
2. **Field Types**: Choose appropriate types:
   - `number`: For numeric values (rates, quantities, percentages)
   - `text`: For short text (units, codes, names)
   - `textarea`: For longer text (notes, descriptions)
   - `date`: For dates (delivery dates, due dates)
3. **Soft Delete**: Use soft delete (default) to preserve historical data
4. **Field Validation**: Validate values on the frontend based on field type
5. **Unique Names**: Ensure field names are unique and meaningful to your business

---

## Example Use Cases

### 1. Tracking Internal Rates
Create a "commission_rate" field to track sales commission:
```json
{
  "fieldName": "commission_rate",
  "fieldType": "number"
}
```

### 2. Delivery Information
Create a "delivery_date" field:
```json
{
  "fieldName": "delivery_date",
  "fieldType": "date"
}
```

### 3. Internal Notes
Create a "notes" field for internal comments:
```json
{
  "fieldName": "internal_notes",
  "fieldType": "textarea"
}
```

### 4. Payment Terms
Create a "payment_terms" field:
```json
{
  "fieldName": "payment_terms",
  "fieldType": "text"
}
```

---

## Technical Notes

- Custom field values are stored as strings in the database regardless of field type
- The frontend should handle type conversion based on the `fieldType` property
- Custom fields are NOT included in FBR API requests
- Deleting a custom field (hard delete) will also delete all associated values from invoices
- Soft deleting (deactivating) a custom field preserves existing values but prevents new usage
- Custom fields are user-scoped - each user has their own set of fields

---

## Support

For issues or questions, please contact the development team or refer to the main API documentation.
