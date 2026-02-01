# Custom Fields API Documentation

## Overview
The Custom Fields feature allows users to define their own fields for invoices. These fields are user-specific and stored locally in the database but **NOT sent to the FBR API**.

## Use Cases
- Add custom tracking fields (e.g., "Purchase Order Number", "Department Code")
- Store internal reference data (e.g., "Project Name", "Cost Center")
- Track additional business metrics (e.g., "Delivery Date", "Warehouse Location")

---

## Authentication
All Custom Fields endpoints require JWT authentication.

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### 1. Create Custom Field

Create a new custom field definition for the authenticated user.

**Endpoint:** `POST /api/v1/custom-fields`

**Request Body:**
```json
{
  "fieldName": "Purchase Order Number",
  "fieldType": "text"
}
```

**Field Types:**
- `text` - Short text input
- `number` - Numeric values
- `date` - Date values
- `textarea` - Long text input

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Custom field created successfully",
  "data": {
    "customField": {
      "id": "uuid",
      "userId": "uuid",
      "fieldName": "Purchase Order Number",
      "fieldType": "text",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Field with this name already exists
- `422` - Validation errors

**Validation Rules:**
- `fieldName`: Required, 1-50 characters, alphanumeric + spaces + underscores
- `fieldType`: Required, must be one of: text, number, date, textarea

---

### 2. Get All Custom Fields

Retrieve all custom fields for the authenticated user.

**Endpoint:** `GET /api/v1/custom-fields`

**Query Parameters:**
- `includeInactive` (optional): `true` or `false` - Include deactivated fields. Default: `false`

**Example:** `GET /api/v1/custom-fields?includeInactive=true`

**Response (200 OK):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "customFields": [
      {
        "id": "uuid-1",
        "userId": "uuid",
        "fieldName": "Purchase Order Number",
        "fieldType": "text",
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00.000Z",
        "updatedAt": "2026-02-01T10:00:00.000Z"
      },
      {
        "id": "uuid-2",
        "userId": "uuid",
        "fieldName": "Department Code",
        "fieldType": "number",
        "isActive": true,
        "createdAt": "2026-02-01T11:00:00.000Z",
        "updatedAt": "2026-02-01T11:00:00.000Z"
      },
      {
        "id": "uuid-3",
        "userId": "uuid",
        "fieldName": "Delivery Date",
        "fieldType": "date",
        "isActive": false,
        "createdAt": "2026-02-01T12:00:00.000Z",
        "updatedAt": "2026-02-01T12:00:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get Custom Field by ID

Retrieve a specific custom field by its ID.

**Endpoint:** `GET /api/v1/custom-fields/:id`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "customField": {
      "id": "uuid",
      "userId": "uuid",
      "fieldName": "Purchase Order Number",
      "fieldType": "text",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404` - Custom field not found

---

### 4. Update Custom Field

Update an existing custom field.

**Endpoint:** `PUT /api/v1/custom-fields/:id`

**Request Body (all fields optional):**
```json
{
  "fieldName": "PO Number",
  "fieldType": "text",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Custom field updated successfully",
  "data": {
    "customField": {
      "id": "uuid",
      "userId": "uuid",
      "fieldName": "PO Number",
      "fieldType": "text",
      "isActive": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T15:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Field name already exists (if renaming)
- `404` - Custom field not found

---

### 5. Delete Custom Field

Deactivate (soft delete) or permanently delete a custom field.

**Endpoint:** `DELETE /api/v1/custom-fields/:id`

**Query Parameters:**
- `hardDelete` (optional): `true` or `false` - Permanently delete. Default: `false` (soft delete)

**Soft Delete (Default):**
`DELETE /api/v1/custom-fields/:id`

**Hard Delete:**
`DELETE /api/v1/custom-fields/:id?hardDelete=true`

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Custom field deactivated successfully"
}
```
OR (for hard delete)
```json
{
  "status": "success",
  "message": "Custom field permanently deleted"
}
```

**Notes:**
- Soft delete sets `isActive` to `false` - data is preserved
- Hard delete permanently removes the field and all associated values from invoices
- Use soft delete to preserve historical data

---

## Using Custom Fields with Invoices

### Create Invoice with Custom Fields

When creating an invoice, you can include custom field values **for each item**.

**Endpoint:** `POST /api/v1/invoices`

**Request Body:**
```json
{
  "invoiceType": "Sales",
  "invoiceDate": "2026-02-01",
  "buyerId": "buyer-uuid",
  "scenarioId": "scenario-uuid",
  "invoiceRefNo": "INV-2026-001",
  "items": [
    {
      "hsCodeId": "hs-code-uuid-1",
      "productDescription": "Steel Rods",
      "rate": "100",
      "uoM": "KG",
      "quantity": 500,
      "totalValues": 50000,
      "valueSalesExcludingST": 45000,
      "fixedNotifiedValueOrRetailPrice": 100,
      "salesTaxApplicable": 5000,
      "salesTaxWithheldAtSource": 0,
      "furtherTax": 0,
      "fedPayable": 0,
      "discount": 0,
      "customFields": [
        {
          "customFieldId": "custom-field-uuid-1",
          "value": "100"
        },
        {
          "customFieldId": "custom-field-uuid-2",
          "value": "Warehouse A"
        }
      ]
    },
    {
      "hsCodeId": "hs-code-uuid-2",
      "productDescription": "Cement Bags",
      "rate": "50",
      "uoM": "BAG",
      "quantity": 200,
      "totalValues": 10000,
      "valueSalesExcludingST": 9000,
      "fixedNotifiedValueOrRetailPrice": 50,
      "salesTaxApplicable": 1000,
      "salesTaxWithheldAtSource": 0,
      "furtherTax": 0,
      "fedPayable": 0,
      "discount": 0,
      "customFields": [
        {
          "customFieldId": "custom-field-uuid-1",
          "value": "55"
        },
        {
          "customFieldId": "custom-field-uuid-2",
          "value": "Warehouse B"
        }
      ]
    }
  ],
  "isTestEnvironment": true
}
```

**Important Notes:**
- `customFields` array is **optional** for each item
- Each item can have different custom field values
- Custom fields must belong to the authenticated user
- Custom fields must be active (`isActive: true`)
- Custom field values are **NOT sent to FBR API** - only stored locally
- All values are stored as strings regardless of field type

---

### Retrieve Invoice with Custom Fields

When fetching invoices, custom field values are automatically included **for each item**.

**Endpoint:** `GET /api/v1/invoices/:id`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "invoice": {
      "id": "invoice-uuid",
      "invoiceType": "Sales",
      "invoiceDate": "2026-02-01",
      "fbrInvoiceNumber": "FBR123456",
      "buyer": {...},
      "scenario": {...},
      "items": [
        {
          "id": "item-uuid-1",
          "productDescription": "Steel Rods",
          "rate": "100",
          "quantity": 500,
          "hsCode": {...},
          "customFieldValues": [
            {
              "id": "value-uuid-1",
              "invoiceItemId": "item-uuid-1",
              "customFieldId": "custom-field-uuid-1",
              "value": "100",
              "customField": {
                "id": "custom-field-uuid-1",
                "fieldName": "Unit Rate",
                "fieldType": "number",
                "isActive": true
              },
              "createdAt": "2026-02-01T10:00:00.000Z",
              "updatedAt": "2026-02-01T10:00:00.000Z"
            },
            {
              "id": "value-uuid-2",
              "invoiceItemId": "item-uuid-1",
              "customFieldId": "custom-field-uuid-2",
              "value": "Warehouse A",
              "customField": {
                "id": "custom-field-uuid-2",
                "fieldName": "Warehouse Location",
                "fieldType": "text",
                "isActive": true
              },
              "createdAt": "2026-02-01T10:00:00.000Z",
              "updatedAt": "2026-02-01T10:00:00.000Z"
            }
          ]
        },
        {
          "id": "item-uuid-2",
          "productDescription": "Cement Bags",
          "rate": "50",
          "quantity": 200,
          "hsCode": {...},
          "customFieldValues": [
            {
              "id": "value-uuid-3",
              "invoiceItemId": "item-uuid-2",
              "customFieldId": "custom-field-uuid-1",
              "value": "55",
              "customField": {
                "id": "custom-field-uuid-1",
                "fieldName": "Unit Rate",
                "fieldType": "number",
                "isActive": true
              },
              "createdAt": "2026-02-01T10:00:00.000Z",
              "updatedAt": "2026-02-01T10:00:00.000Z"
            }
          ]
        }
      ],
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  }
}
```

**List All Invoices:**
`GET /api/v1/invoices` also includes `customFieldValues` in each invoice item.

---

## Common Workflows

### Workflow 1: Setting Up Custom Fields

1. **Create custom fields** (one-time setup):
```bash
POST /api/v1/custom-fields
{
  "fieldName": "Purchase Order Number",
  "fieldType": "text"
}

POST /api/v1/custom-fields
{
  "fieldName": "Cost Center",
  "fieldType": "number"
}
```

2. **Retrieve custom fields** to get their IDs:
```bash
GET /api/v1/custom-fields
```

3. **Use custom field IDs when creating invoices**:
```bash
POST /api/v1/invoices
{
  "invoiceType": "Sales",
  "buyerId": "...",
  "scenarioId": "...",
  "items": [
    {
      "hsCodeId": "...",
      "productDescription": "Product A",
      "rate": "100",
      ...other item fields...,
      "customFields": [
        {
          "customFieldId": "uuid-from-step-2",
          "value": "Warehouse A"
        }
      ]
    },
    {
      "hsCodeId": "...",
      "productDescription": "Product B",
      "rate": "200",
      ...other item fields...,
      "customFields": [
        {
          "customFieldId": "uuid-from-step-2",
          "value": "Warehouse B"
        }
      ]
    }
  ]
}
```

---

### Workflow 2: Managing Custom Fields

**Rename a field:**
```bash
PUT /api/v1/custom-fields/:id
{
  "fieldName": "New Field Name"
}
```

**Deactivate a field (soft delete):**
```bash
DELETE /api/v1/custom-fields/:id
```

**Permanently delete a field:**
```bash
DELETE /api/v1/custom-fields/:id?hardDelete=true
```

---

## Validation Rules Summary

### Custom Field Creation
- Field name: 1-50 characters, alphanumeric + spaces + underscores
- Field type: Must be one of: `text`, `number`, `date`, `textarea`
- Unique per user (cannot have duplicate field names)

### Custom Field Values in Invoices
- Custom field ID must be valid UUID
- Custom field must belong to the authenticated user
- Custom field must be active (`isActive: true`)
- Value is required (cannot be empty)
- Values are stored as strings (frontend handles type conversion)

---

## Database Schema

### CustomField Table
```prisma
model CustomField {
  id                      String
  userId                  String
  fieldName               String
  fieldType               String  // 'text', 'number', 'date', 'textarea'
  isActive                Boolean
  createdAt               DateTime
  updatedAt               DateTime
  
  // Unique constraint: userId + fieldName
}
```

### InvoiceItemCustomFieldValue Table
```prisma
model InvoiceItemCustomFieldValue {
  id                      String
  invoiceItemId           String  // References invoice item, not invoice
  customFieldId           String
  value                   String  // All values stored as string
  createdAt               DateTime
  updatedAt               DateTime
  
  // Unique constraint: invoiceItemId + customFieldId
}
```

---

## Important Notes

### Data Isolation
- Custom fields are **user-specific** - each user has their own set of fields
- One user's custom fields cannot be accessed by other users
- Custom field values are tied to specific **invoice items**, not invoices
- Each item in an invoice can have different custom field values

### FBR API Integration
- Custom fields are **NOT sent to FBR API**
- They are stored locally for internal tracking only
- FBR API payload remains unchanged

### Data Retention
- Soft delete (`isActive: false`) preserves all data
- Hard delete permanently removes field and all values from invoice items
- Deleting a custom field (hard) will cascade delete all values in invoice items

### Best Practices
1. Use soft delete to preserve historical data
2. Create custom fields before using them in invoices
3. Use descriptive field names for better tracking
4. Choose appropriate field types (text, number, date, textarea)
5. Keep field names consistent across your organization

---

## Error Codes Reference

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 204  | No Content (successful deletion) |
| 400  | Bad Request (validation error, duplicate field name) |
| 401  | Unauthorized (missing or invalid token) |
| 404  | Not Found (custom field or invoice not found) |
| 422  | Unprocessable Entity (validation failed) |
| 500  | Internal Server Error |

---

## Example Frontend Implementation

### React Example - Create Custom Field

```javascript
const createCustomField = async (fieldName, fieldType) => {
  const response = await fetch('http://localhost:5000/api/v1/custom-fields', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ fieldName, fieldType })
  });
  
  const data = await response.json();
  return data;
};
```

### React Example - Create Invoice with Custom Fields

```javascript
const createInvoiceWithCustomFields = async (invoiceData, items) => {
  // items is an array where each item can have customFields
  const itemsWithCustomFields = items.map(item => ({
    ...item,
    customFields: item.customFields ? item.customFields.map(cf => ({
      customFieldId: cf.fieldId,
      value: cf.value
    })) : []
  }));
  
  const payload = {
    ...invoiceData,
    items: itemsWithCustomFields
  };
  
  const response = await fetch('http://localhost:5000/api/v1/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  
  const data = await response.json();
  return data;
};
```

---

## Support & Questions

For questions or issues with the Custom Fields API, please contact the development team or refer to the main API documentation.

**Last Updated:** February 1, 2026
