# Print Settings - Custom Field Positioning Backend Changes

## Overview
This document outlines the backend changes required to support custom field positioning in invoice print settings. This enhancement allows users to position custom fields anywhere among regular fields (drag-and-drop ordering).

---

## Database Schema Changes

### Update `InvoicePrintSettings` Table

**Current Schema:**
```prisma
model InvoicePrintSettings {
  id                    String      @id @default(uuid())
  userId                String      @unique
  visibleFields         Json        // Array of regular field names only
  columnWidths          Json        
  includeCustomFields   Boolean     @default(true)      // REMOVE THIS
  customFieldsPosition  String      @default("end")     // REMOVE THIS
  fontSize              String      @default("small")
  tableBorders          Boolean     @default(true)
  showItemNumbers       Boolean     @default(true)
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
}
```

**New Schema:**
```prisma
model InvoicePrintSettings {
  id                    String      @id @default(uuid())
  userId                String      @unique
  user                  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // CHANGED: Now includes both regular fields AND custom field IDs
  visibleFields         Json        // Array: ["itemNumber", "customField_uuid1", "quantity", ...]
  
  // CHANGED: Now includes widths for custom fields too
  columnWidths          Json        // Object: {"itemNumber": 5, "customField_uuid1": 10, ...}
  
  // REMOVED: No longer needed
  // includeCustomFields   Boolean
  // customFieldsPosition  String
  
  fontSize              String      @default("small")
  tableBorders          Boolean     @default(true)
  showItemNumbers       Boolean     @default(true)
  
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  @@index([userId])
}
```

### Migration Notes

1. **Remove columns**: `includeCustomFields`, `customFieldsPosition`
2. **Update visibleFields format**: Change from array of regular fields to array that can include both regular and custom fields
3. **Update columnWidths format**: Add entries for custom fields

**Migration Script Example:**
```sql
-- PostgreSQL example
-- Step 1: For existing records, append custom fields to visibleFields if includeCustomFields was true
UPDATE "InvoicePrintSettings" AS settings
SET "visibleFields" = (
  CASE 
    WHEN settings."includeCustomFields" = true THEN
      settings."visibleFields" || (
        SELECT jsonb_agg('customField_' || cf.id::text)
        FROM "CustomField" AS cf
        WHERE cf."userId" = settings."userId" AND cf."isActive" = true
      )
    ELSE settings."visibleFields"
  END
);

-- Step 2: Update columnWidths to add default widths for custom fields
UPDATE "InvoicePrintSettings" AS settings
SET "columnWidths" = (
  settings."columnWidths" || (
    SELECT jsonb_object_agg('customField_' || cf.id::text, 10)
    FROM "CustomField" AS cf
    WHERE cf."userId" = settings."userId" 
      AND cf."isActive" = true
      AND ('customField_' || cf.id::text)::jsonb <@ settings."visibleFields"
  )
);

-- Step 3: Drop old columns
ALTER TABLE "InvoicePrintSettings" DROP COLUMN IF EXISTS "includeCustomFields";
ALTER TABLE "InvoicePrintSettings" DROP COLUMN IF EXISTS "customFieldsPosition";
```

---

## Field Naming Convention

### Regular Fields
Use the field name as-is:
```
"itemNumber"
"productDescription"
"hsCode"
"quantity"
"uoM"
```

### Custom Fields
Prefix with `customField_` followed by the UUID:
```
"customField_123e4567-e89b-12d3-a456-426614174000"
"customField_223e4567-e89b-12d3-a456-426614174001"
```

**Example visibleFields array:**
```json
[
  "itemNumber",
  "productDescription",
  "customField_123e4567-e89b-12d3-a456-426614174000",
  "hsCode",
  "quantity",
  "customField_223e4567-e89b-12d3-a456-426614174001",
  "totalValues"
]
```

---

## API Changes

### 1. GET /api/v1/invoice-print-settings

**Updated Response (With Custom Settings):**
```json
{
  "status": "success",
  "data": {
    "printSettings": {
      "id": "uuid",
      "userId": "uuid",
      "visibleFields": [
        "itemNumber",
        "productDescription",
        "customField_123e4567-e89b-12d3-a456-426614174000",
        "hsCode",
        "quantity",
        "customField_223e4567-e89b-12d3-a456-426614174001",
        "uoM",
        "totalValues"
      ],
      "columnWidths": {
        "itemNumber": 5,
        "productDescription": 20,
        "customField_123e4567-e89b-12d3-a456-426614174000": 12,
        "hsCode": 10,
        "quantity": 8,
        "customField_223e4567-e89b-12d3-a456-426614174001": 10,
        "uoM": 6,
        "totalValues": 15
      },
      "fontSize": "small",
      "tableBorders": true,
      "showItemNumbers": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  }
}
```

**Updated Response (No Custom Settings - Return Defaults):**
```json
{
  "status": "success",
  "data": {
    "printSettings": null,
    "defaultSettings": {
      "visibleFields": [
        "itemNumber",
        "productDescription",
        "hsCode",
        "quantity",
        "uoM",
        "rate",
        "totalValues",
        "valueSalesExcludingST",
        "salesTaxApplicable"
      ],
      "columnWidths": {
        "itemNumber": 5,
        "productDescription": 20,
        "hsCode": 10,
        "quantity": 8,
        "uoM": 6,
        "rate": 8,
        "totalValues": 10,
        "valueSalesExcludingST": 10,
        "salesTaxApplicable": 10
      },
      "fontSize": "small",
      "tableBorders": true,
      "showItemNumbers": true
    }
  }
}
```

---

### 2. POST /api/v1/invoice-print-settings

**Updated Request Body:**
```json
{
  "visibleFields": [
    "itemNumber",
    "productDescription",
    "customField_123e4567-e89b-12d3-a456-426614174000",
    "quantity",
    "totalValues"
  ],
  "columnWidths": {
    "itemNumber": 8,
    "productDescription": 30,
    "customField_123e4567-e89b-12d3-a456-426614174000": 12,
    "quantity": 12,
    "totalValues": 15
  },
  "fontSize": "medium",
  "tableBorders": true,
  "showItemNumbers": true
}
```

**Field Descriptions:**
- `visibleFields` (array, required): Array of field keys including custom fields with `customField_` prefix
- `columnWidths` (object, required): Width percentages for all visible fields
- `fontSize` (string, required): "small", "medium", or "large"
- `tableBorders` (boolean, required): Show/hide table borders
- `showItemNumbers` (boolean, required): Show/hide item row numbers

**Validation Rules:**

1. **Field Name Format Validation:**
```javascript
visibleFields.forEach(field => {
  if (field.startsWith('customField_')) {
    // Extract UUID from "customField_123e4567-..." -> "123e4567-..."
    const customFieldId = field.replace('customField_', '');
    
    // Validate UUID format
    if (!isValidUUID(customFieldId)) {
      throw new ValidationError(`Invalid custom field ID format: ${field}`);
    }
  } else {
    // Regular field - validate against allowed list
    const allowedFields = [
      'itemNumber', 'productDescription', 'hsCode', 'quantity', 'uoM', 'rate',
      'totalValues', 'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice',
      'salesTaxApplicable', 'salesTaxWithheldAtSource', 'furtherTax',
      'fedPayable', 'discount', 'sroScheduleNo', 'sroItemSerialNo'
    ];
    
    if (!allowedFields.includes(field)) {
      throw new ValidationError(`Unknown field: ${field}`);
    }
  }
});
```

2. **Custom Field Ownership & Active Status:**
```javascript
// Extract all custom field IDs
const customFieldIds = visibleFields
  .filter(f => f.startsWith('customField_'))
  .map(f => f.replace('customField_', ''));

if (customFieldIds.length > 0) {
  // Verify all custom fields exist, belong to user, and are active
  const customFields = await CustomField.findAll({
    where: {
      id: { [Op.in]: customFieldIds },
      userId: userId,
      isActive: true
    }
  });

  if (customFields.length !== customFieldIds.length) {
    throw new ValidationError('One or more custom fields not found, inactive, or do not belong to you');
  }
}
```

3. **Column Width Requirements:**
```javascript
// Ensure every visible field has a corresponding width
visibleFields.forEach(field => {
  if (!columnWidths[field]) {
    throw new ValidationError(`Missing width for field: ${field}`);
  }
  
  // Validate width is between 1-50
  if (columnWidths[field] < 1 || columnWidths[field] > 50) {
    throw new ValidationError(`Width for ${field} must be between 1-50%`);
  }
});
```

4. **Field Count Limits:**
```javascript
// Minimum 1 field, maximum 20 fields total (including custom)
if (visibleFields.length < 1) {
  throw new ValidationError('At least 1 field must be visible');
}

if (visibleFields.length > 20) {
  throw new ValidationError('Maximum 20 fields allowed');
}
```

5. **Width Total Warning (non-blocking):**
```javascript
const totalWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
const warning = (totalWidth < 95 || totalWidth > 105) 
  ? `Total column width is ${totalWidth}%. Recommended: 100%`
  : null;
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Print settings saved successfully",
  "data": {
    "printSettings": {
      "id": "uuid",
      "userId": "uuid",
      "visibleFields": [...],
      "columnWidths": {...},
      "fontSize": "medium",
      "tableBorders": true,
      "showItemNumbers": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:30:00.000Z"
    }
  },
  "warning": "Total column width is 77%. Recommended: 100%"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400,
    "errors": [
      {
        "field": "visibleFields",
        "message": "Custom field 123e4567-e89b-12d3-a456-426614174000 not found or inactive"
      },
      {
        "field": "columnWidths",
        "message": "Missing width for field: customField_223e4567-..."
      }
    ]
  },
  "message": "Validation failed"
}
```

---

### 3. GET /api/v1/invoice-print-settings/available-fields

**Updated to Include Custom Fields:**

This endpoint should now return the user's active custom fields in addition to regular fields.

**Updated Response:**
```json
{
  "status": "success",
  "data": {
    "fields": [
      {
        "key": "itemNumber",
        "label": "Item #",
        "description": "Item serial number",
        "category": "basic",
        "defaultVisible": true,
        "minWidth": 5,
        "maxWidth": 10,
        "required": false
      },
      {
        "key": "productDescription",
        "label": "Product Description",
        "description": "Description of the product",
        "category": "basic",
        "defaultVisible": true,
        "minWidth": 15,
        "maxWidth": 40,
        "required": true
      },
      // ... all other regular fields ...
    ],
    "customFields": [
      {
        "key": "customField_123e4567-e89b-12d3-a456-426614174000",
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "label": "Purchase Order Number",
        "fieldName": "Purchase Order Number",
        "fieldType": "text",
        "description": "Custom field: Purchase Order Number",
        "category": "custom",
        "defaultVisible": false,
        "minWidth": 8,
        "maxWidth": 20,
        "required": false
      },
      {
        "key": "customField_223e4567-e89b-12d3-a456-426614174001",
        "id": "223e4567-e89b-12d3-a456-426614174001",
        "label": "Delivery Date",
        "fieldName": "Delivery Date",
        "fieldType": "date",
        "description": "Custom field: Delivery Date",
        "category": "custom",
        "defaultVisible": false,
        "minWidth": 8,
        "maxWidth": 15,
        "required": false
      },
      {
        "key": "customField_323e4567-e89b-12d3-a456-426614174002",
        "id": "323e4567-e89b-12d3-a456-426614174002",
        "label": "Warehouse Code",
        "fieldName": "Warehouse Code",
        "fieldType": "text",
        "description": "Custom field: Warehouse Code",
        "category": "custom",
        "defaultVisible": false,
        "minWidth": 8,
        "maxWidth": 15,
        "required": false
      }
    ],
    "categories": [
      { "key": "basic", "label": "Basic Information", "order": 1 },
      { "key": "pricing", "label": "Pricing & Values", "order": 2 },
      { "key": "tax", "label": "Tax Information", "order": 3 },
      { "key": "compliance", "label": "Compliance & SRO", "order": 4 },
      { "key": "custom", "label": "Custom Fields", "order": 5 }
    ]
  }
}
```

**Implementation Logic:**
```javascript
// Get user's active custom fields
const customFields = await CustomField.findAll({
  where: {
    userId: userId,
    isActive: true
  }
});

// Transform to match expected format
const customFieldsFormatted = customFields.map(cf => ({
  key: `customField_${cf.id}`,
  id: cf.id,
  label: cf.fieldName,
  fieldName: cf.fieldName,
  fieldType: cf.fieldType,
  description: `Custom field: ${cf.fieldName}`,
  category: 'custom',
  defaultVisible: false,
  minWidth: 8,
  maxWidth: cf.fieldType === 'textarea' ? 30 : 20,
  required: false
}));

return {
  fields: REGULAR_FIELDS_CONSTANT,
  customFields: customFieldsFormatted,
  categories: CATEGORIES_CONSTANT
};
```

---

## Controller Implementation Example

```javascript
// POST /api/v1/invoice-print-settings
async savePrintSettings(req, res) {
  try {
    const { visibleFields, columnWidths, fontSize, tableBorders, showItemNumbers } = req.body;
    const userId = req.user.id;

    // VALIDATION 1: Validate field name formats and extract custom field IDs
    const customFieldIds = [];
    const allowedRegularFields = [
      'itemNumber', 'productDescription', 'hsCode', 'quantity', 'uoM', 'rate',
      'totalValues', 'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice',
      'salesTaxApplicable', 'salesTaxWithheldAtSource', 'furtherTax',
      'fedPayable', 'discount', 'sroScheduleNo', 'sroItemSerialNo'
    ];

    for (const field of visibleFields) {
      if (field.startsWith('customField_')) {
        const customFieldId = field.replace('customField_', '');
        
        // Validate UUID format
        if (!isValidUUID(customFieldId)) {
          return res.status(400).json({
            status: 'fail',
            message: `Invalid custom field ID format: ${field}`
          });
        }
        
        customFieldIds.push(customFieldId);
      } else {
        // Validate regular field
        if (!allowedRegularFields.includes(field)) {
          return res.status(400).json({
            status: 'fail',
            message: `Unknown field: ${field}`
          });
        }
      }
    }

    // VALIDATION 2: Verify custom fields exist, belong to user, and are active
    if (customFieldIds.length > 0) {
      const customFields = await CustomField.findAll({
        where: {
          id: { [Op.in]: customFieldIds },
          userId: userId,
          isActive: true
        }
      });

      if (customFields.length !== customFieldIds.length) {
        return res.status(400).json({
          status: 'fail',
          message: 'One or more custom fields not found, inactive, or do not belong to you'
        });
      }
    }

    // VALIDATION 3: Ensure all visible fields have widths
    for (const field of visibleFields) {
      if (!columnWidths[field]) {
        return res.status(400).json({
          status: 'fail',
          message: `Missing width for field: ${field}`
        });
      }

      if (columnWidths[field] < 1 || columnWidths[field] > 50) {
        return res.status(400).json({
          status: 'fail',
          message: `Width for ${field} must be between 1-50%`
        });
      }
    }

    // VALIDATION 4: Field count limits
    if (visibleFields.length < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'At least 1 field must be visible'
      });
    }

    if (visibleFields.length > 20) {
      return res.status(400).json({
        status: 'fail',
        message: 'Maximum 20 fields allowed'
      });
    }

    // VALIDATION 5: Calculate width warning (non-blocking)
    const totalWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
    const warning = (totalWidth < 95 || totalWidth > 105) 
      ? `Total column width is ${totalWidth}%. Recommended: 100%`
      : null;

    // UPSERT: Create or update settings
    const [settings, created] = await InvoicePrintSettings.upsert({
      where: { userId },
      update: {
        visibleFields,
        columnWidths,
        fontSize,
        tableBorders,
        showItemNumbers,
        updatedAt: new Date()
      },
      create: {
        userId,
        visibleFields,
        columnWidths,
        fontSize,
        tableBorders,
        showItemNumbers
      }
    });

    // Return success response
    return res.status(200).json({
      status: 'success',
      message: 'Print settings saved successfully',
      data: { printSettings: settings },
      ...(warning && { warning })
    });

  } catch (error) {
    console.error('Error saving print settings:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
}
```

---

## Testing Checklist

### Unit Tests
- [ ] Validate regular field names
- [ ] Validate custom field UUID format
- [ ] Verify custom field ownership check
- [ ] Verify custom field active status check
- [ ] Test with mix of regular and custom fields
- [ ] Test with only regular fields
- [ ] Test with only custom fields
- [ ] Test field count limits (min 1, max 20)
- [ ] Test column width validation (1-50)
- [ ] Test missing column widths error
- [ ] Test width warning calculation

### Integration Tests
- [ ] Create settings with custom fields
- [ ] Update settings (add/remove custom fields)
- [ ] Reorder custom fields among regular fields
- [ ] Delete custom field that's in print settings (should fail or auto-remove)
- [ ] Deactivate custom field that's in print settings
- [ ] GET settings with custom fields returns correct format
- [ ] GET available-fields includes user's custom fields
- [ ] Reset settings removes custom field references

### Edge Cases
- [ ] User has no custom fields
- [ ] User deletes a custom field that was in print settings
- [ ] User deactivates a custom field that was in print settings
- [ ] Invalid UUID format in field name
- [ ] Custom field belongs to different user
- [ ] Duplicate field names in visibleFields
- [ ] Column width for non-visible field

---

## Summary of Changes

### What Changed
1. **Database**: Removed `includeCustomFields` and `customFieldsPosition` columns
2. **visibleFields**: Now includes both regular fields AND custom field IDs with `customField_` prefix
3. **columnWidths**: Now includes widths for custom fields
4. **available-fields endpoint**: Returns user's active custom fields
5. **Validation**: Enhanced to verify custom field ownership and active status

### Field Naming
- **Regular fields**: `"productDescription"`, `"quantity"`, etc.
- **Custom fields**: `"customField_{uuid}"` - e.g., `"customField_123e4567-e89b-12d3-a456-426614174000"`

### Benefits
- ✅ Full flexibility in column ordering (drag any field anywhere)
- ✅ Simpler API (one array controls everything)
- ✅ Custom fields are first-class columns
- ✅ No special handling for "inline" vs "end" positioning

---

## Implementation Decisions

### 1. Migration Strategy

**Question:** For existing print settings where `includeCustomFields=false`, should we:
- Option A: Don't add any custom fields to visibleFields (preserve user's choice)
- Option B: Add them anyway since we're removing the toggle

**✅ Decision: Option A - Preserve User's Choice**

**Rationale:**
- Respects the user's explicit preference to not show custom fields
- Prevents unwanted changes to existing print layouts
- Users can manually add custom fields later if they want

**Migration Script Update:**
```sql
-- Only add custom fields if includeCustomFields was true
UPDATE "InvoicePrintSettings" AS settings
SET "visibleFields" = (
  CASE 
    WHEN settings."includeCustomFields" = true THEN
      settings."visibleFields" || (
        SELECT jsonb_agg('customField_' || cf.id::text)
        FROM "CustomField" AS cf
        WHERE cf."userId" = settings."userId" AND cf."isActive" = true
      )
    ELSE settings."visibleFields"  -- Keep as-is if false
  END
);
```

---

### 2. Inactive/Deleted Custom Fields Handling

**Question:** When a custom field in print settings becomes inactive or deleted, should we:
- Option A: Auto-remove from visibleFields silently during the next GET/POST
- Option B: Return a validation error when trying to save with inactive fields
- Option C: Show a warning but allow it (filter out at print time)

**✅ Decision: Option A - Auto-Remove Silently**

**Rationale:**
- Cleanest user experience (no errors for something they didn't do wrong)
- Prevents broken print layouts when custom fields are deactivated
- User can see what's missing and re-add if field is reactivated

**Implementation:**

**On GET /api/v1/invoice-print-settings:**
```javascript
async getPrintSettings(req, res) {
  const settings = await InvoicePrintSettings.findOne({ where: { userId: req.user.id } });
  
  if (settings) {
    // Get user's active custom fields
    const activeCustomFields = await CustomField.findAll({
      where: { userId: req.user.id, isActive: true }
    });
    
    const activeCustomFieldKeys = activeCustomFields.map(cf => `customField_${cf.id}`);
    
    // Filter out inactive/deleted custom fields
    const cleanedVisibleFields = settings.visibleFields.filter(field => {
      if (field.startsWith('customField_')) {
        return activeCustomFieldKeys.includes(field);
      }
      return true; // Keep all regular fields
    });
    
    // Update if fields were removed
    if (cleanedVisibleFields.length !== settings.visibleFields.length) {
      settings.visibleFields = cleanedVisibleFields;
      
      // Also clean up columnWidths
      const cleanedColumnWidths = {};
      cleanedVisibleFields.forEach(field => {
        if (settings.columnWidths[field]) {
          cleanedColumnWidths[field] = settings.columnWidths[field];
        }
      });
      settings.columnWidths = cleanedColumnWidths;
      
      await settings.save();
    }
    
    return res.json({
      status: 'success',
      data: { printSettings: settings }
    });
  }
  
  // Return defaults if no settings exist
  return res.json({
    status: 'success',
    data: { printSettings: null, defaultSettings: DEFAULT_SETTINGS }
  });
}
```

**On POST /api/v1/invoice-print-settings:**
- Still validate that referenced custom fields exist and are active
- Return specific error if user tries to add an inactive field
- But silently accept if field was already there and became inactive (will be cleaned on next GET)

---

### 3. Field Count Limit

**Question:** Should we:
- Option A: Keep it at 20 total fields (regular + custom combined)
- Option B: Use a different limit like 15 regular + unlimited custom

**✅ Decision: Option A - 20 Total Fields (Combined)**

**Rationale:**
- Simpler to implement and explain
- PDF readability concerns (too many columns = unreadable)
- Forces users to be selective about what's important
- More flexible (user decides the mix)

**Validation:**
```javascript
// Maximum 20 fields total (regular + custom combined)
if (visibleFields.length > 20) {
  return res.status(400).json({
    status: 'fail',
    message: 'Maximum 20 fields allowed (including custom fields)'
  });
}
```

**Note:** If users need more fields in the future, we can:
1. Increase the limit (e.g., to 25 or 30)
2. Add pagination/multiple page support for PDFs
3. Add field grouping/collapsing features

---

### 4. Validation Error Specificity

**Question:** When a custom field is referenced but doesn't exist/inactive, should we:
- Option A: Return specific error identifying which custom field ID is invalid
- Option B: Generic error message for security

**✅ Decision: Option A - Specific Error Messages**

**Rationale:**
- Better debugging experience for users and support team
- Field IDs are UUIDs (not sensitive information)
- User already knows their own custom field IDs
- Faster problem resolution

**Error Response Format:**
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400,
    "errors": [
      {
        "field": "customField_123e4567-e89b-12d3-a456-426614174000",
        "message": "Custom field not found or inactive"
      },
      {
        "field": "customField_223e4567-e89b-12d3-a456-426614174001",
        "message": "Custom field does not belong to your account"
      }
    ]
  },
  "message": "Validation failed: 2 custom fields are invalid"
}
```

**Implementation:**
```javascript
// Detailed validation with specific error messages
const customFieldIds = visibleFields
  .filter(f => f.startsWith('customField_'))
  .map(f => f.replace('customField_', ''));

if (customFieldIds.length > 0) {
  const customFields = await CustomField.findAll({
    where: {
      id: { [Op.in]: customFieldIds },
      userId: userId,
      isActive: true
    }
  });

  const foundIds = customFields.map(cf => cf.id);
  const errors = [];

  // Identify which specific fields are missing/invalid
  for (const fieldId of customFieldIds) {
    if (!foundIds.includes(fieldId)) {
      errors.push({
        field: `customField_${fieldId}`,
        message: 'Custom field not found, inactive, or does not belong to your account'
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      error: {
        statusCode: 400,
        errors: errors
      },
      message: `Validation failed: ${errors.length} custom field(s) are invalid`
    });
  }
}
```

---

## Summary of Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| **Migration Strategy** | Option A - Preserve user choice | Respects existing preferences |
| **Inactive/Deleted Fields** | Option A - Auto-remove silently on GET | Cleanest UX, prevents errors |
| **Field Count Limit** | Option A - 20 total (combined) | Simple, flexible, readable |
| **Error Specificity** | Option A - Specific error messages | Better debugging, not sensitive data |

---

**Document Version:** 1.1  
**Created:** February 1, 2026  
**Last Updated:** February 1, 2026  
**Status:** Ready for Backend Implementation  
**Author:** Frontend Team  
**Reviewed By:** Product Team  
**Requires Implementation By:** Backend Developer
