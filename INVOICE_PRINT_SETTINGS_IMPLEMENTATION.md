# Invoice Print Settings - Implementation Specification

## Overview
Allow users to customize which invoice item fields to print, adjust column widths, and include custom fields in the printed PDF. Each user will have their own print settings with sensible defaults.

**Implementation Approach:** Full Database-Backed Settings

**Benefits:**
- Settings persist across devices and browsers
- Backup and restore capability
- Can be managed by admin in future
- Centralized configuration
- Professional and scalable solution

---

## Backend Requirements

### 1. Database Schema

Create a new table: `InvoicePrintSettings`

```prisma
model InvoicePrintSettings {
  id                    String      @id @default(uuid())
  userId                String      @unique
  user                  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Field visibility settings (JSON object)
  visibleFields         Json        // Array of field names to show
  
  // Column width settings (JSON object)
  columnWidths          Json        // Object with field name as key, width percentage as value
  
  // Custom fields settings
  includeCustomFields   Boolean     @default(true)
  customFieldsPosition  String      @default("end") // "end" or "inline"
  
  // General settings
  fontSize              String      @default("small") // "small", "medium", "large"
  tableBorders          Boolean     @default(true)
  showItemNumbers       Boolean     @default(true)
  
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  @@index([userId])
}
```

### 2. Default Settings Configuration

Default visible fields and widths:
```json
{
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
    "fixedNotifiedValueOrRetailPrice": 10,
    "salesTaxApplicable": 10,
    "salesTaxWithheldAtSource": 10,
    "furtherTax": 8,
    "fedPayable": 8,
    "discount": 8,
    "sroScheduleNo": 10,
    "sroItemSerialNo": 10
  }
}
```

### 3. API Endpoints

#### **GET /api/v1/invoice-print-settings**
Get current user's print settings. If not exists, return default settings.

**Response (200 OK):**
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
      "includeCustomFields": true,
      "customFieldsPosition": "end",
      "fontSize": "small",
      "tableBorders": true,
      "showItemNumbers": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  }
}
```

**If no settings exist (200 OK):**
```json
{
  "status": "success",
  "data": {
    "printSettings": null,
    "defaultSettings": {
      "visibleFields": [...],
      "columnWidths": {...},
      "includeCustomFields": true,
      "customFieldsPosition": "end",
      "fontSize": "small",
      "tableBorders": true,
      "showItemNumbers": true
    }
  }
}
```

---

#### **POST /api/v1/invoice-print-settings**
Create or update print settings for the current user (upsert logic).

**Note:** This endpoint handles both creating new settings and updating existing ones. Frontend doesn't need to check if settings exist first.

**Request Body:**
```json
{
  "visibleFields": [
    "itemNumber",
    "productDescription",
    "quantity",
    "totalValues"
  ],
  "columnWidths": {
    "itemNumber": 8,
    "productDescription": 30,
    "quantity": 12,
    "totalValues": 15
  },
  "includeCustomFields": true,
  "customFieldsPosition": "end",
  "fontSize": "medium",
  "tableBorders": true,
  "showItemNumbers": true
}
```

**Validation Rules:**
- `visibleFields`: Array of strings, at least 1 field required, max 15 fields
- `columnWidths`: Object with field names as keys, numbers 1-50 as values
- `includeCustomFields`: Boolean
- `customFieldsPosition`: Enum: "end", "inline"
- `fontSize`: Enum: "small", "medium", "large"
- `tableBorders`: Boolean
- `showItemNumbers`: Boolean
- Total column widths should ideally sum to 100 (warning if not)

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
      "includeCustomFields": true,
      "customFieldsPosition": "end",
      "fontSize": "medium",
      "tableBorders": true,
      "showItemNumbers": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:30:00.000Z"
    }
  }
}
```

---

#### **DELETE /api/v1/invoice-print-settings**
Reset to default settings by deleting user's custom settings.

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Print settings reset to defaults"
}
```

---

### 4. Available Fields Configuration

Backend should provide a list of all available fields with metadata:

**GET /api/v1/invoice-print-settings/available-fields**

**Response (200 OK):**
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
      {
        "key": "hsCode",
        "label": "HS Code",
        "description": "Harmonized System Code",
        "category": "basic",
        "defaultVisible": true,
        "minWidth": 8,
        "maxWidth": 15,
        "required": true
      },
      {
        "key": "quantity",
        "label": "Quantity",
        "description": "Quantity of items",
        "category": "basic",
        "defaultVisible": true,
        "minWidth": 6,
        "maxWidth": 12,
        "required": true
      },
      {
        "key": "uoM",
        "label": "UoM",
        "description": "Unit of Measurement",
        "category": "basic",
        "defaultVisible": true,
        "minWidth": 5,
        "maxWidth": 10,
        "required": true
      },
      {
        "key": "rate",
        "label": "Rate",
        "description": "Tax rate",
        "category": "basic",
        "defaultVisible": true,
        "minWidth": 6,
        "maxWidth": 12,
        "required": true
      },
      {
        "key": "totalValues",
        "label": "Total Value",
        "description": "Total value including tax",
        "category": "pricing",
        "defaultVisible": true,
        "minWidth": 8,
        "maxWidth": 15,
        "required": true
      },
      {
        "key": "valueSalesExcludingST",
        "label": "Value (Excl. ST)",
        "description": "Value excluding sales tax",
        "category": "pricing",
        "defaultVisible": true,
        "minWidth": 8,
        "maxWidth": 15,
        "required": true
      },
      {
        "key": "fixedNotifiedValueOrRetailPrice",
        "label": "Retail Price",
        "description": "Fixed notified value or retail price",
        "category": "pricing",
        "defaultVisible": false,
        "minWidth": 8,
        "maxWidth": 15,
        "required": false
      },
      {
        "key": "salesTaxApplicable",
        "label": "Sales Tax",
        "description": "Applicable sales tax",
        "category": "tax",
        "defaultVisible": true,
        "minWidth": 8,
        "maxWidth": 15,
        "required": true
      },
      {
        "key": "salesTaxWithheldAtSource",
        "label": "Tax Withheld",
        "description": "Sales tax withheld at source",
        "category": "tax",
        "defaultVisible": false,
        "minWidth": 8,
        "maxWidth": 15,
        "required": false
      },
      {
        "key": "furtherTax",
        "label": "Further Tax",
        "description": "Additional further tax",
        "category": "tax",
        "defaultVisible": false,
        "minWidth": 6,
        "maxWidth": 12,
        "required": false
      },
      {
        "key": "fedPayable",
        "label": "FED Payable",
        "description": "Federal Excise Duty payable",
        "category": "tax",
        "defaultVisible": false,
        "minWidth": 6,
        "maxWidth": 12,
        "required": false
      },
      {
        "key": "discount",
        "label": "Discount",
        "description": "Discount amount",
        "category": "pricing",
        "defaultVisible": false,
        "minWidth": 6,
        "maxWidth": 12,
        "required": false
      },
      {
        "key": "sroScheduleNo",
        "label": "SRO Schedule",
        "description": "SRO schedule number",
        "category": "compliance",
        "defaultVisible": false,
        "minWidth": 8,
        "maxWidth": 15,
        "required": false
      },
      {
        "key": "sroItemSerialNo",
        "label": "SRO Item Serial",
        "description": "SRO item serial number",
        "category": "compliance",
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
      { "key": "compliance", "label": "Compliance & SRO", "order": 4 }
    ]
  }
}
```

---

### 5. Backend Implementation Notes

1. **Database Migration:**
   - Create `InvoicePrintSettings` table
   - Add foreign key relationship to `User` table
   - Add unique constraint on `userId`

2. **Controller Logic:**
   - Implement upsert logic (create if not exists, update if exists)
   - Validate column width totals
   - Ensure at least one field is visible
   - Validate field names against allowed list

3. **Default Settings:**
   - Store default configuration in a constant/config file
   - Return defaults if user has no custom settings
   - Allow admin to update default settings (future feature)

4. **Security:**
   - Ensure users can only access their own settings
   - Validate JWT token for all endpoints
   - Sanitize JSON inputs to prevent injection

5. **Performance:**
   - Add database index on `userId`
   - Cache available fields list (rarely changes)
   - Use JSON columns for flexible settings storage

---

## Frontend Implementation Plan

### 1. New Components to Create

#### **PrintSettingsModal.tsx**
Modal component for configuring print settings:
- Field selection checklist (grouped by category)
- Column width sliders for each selected field
- Custom fields toggle
- Font size selector
- Table borders toggle
- Live preview (optional)
- Save/Cancel/Reset buttons

#### **PrintPreview.tsx** (Optional)
Live preview of how the PDF will look with current settings.

### 2. Updated Components

#### **InvoicePDF.tsx**
Update to accept print settings prop and render accordingly:
- Filter items to only show visible fields
- Apply column widths dynamically
- Include/exclude custom fields based on settings
- Apply font size and border settings

#### **page.tsx (Invoices)**
- Add "Print Settings" button near print/download
- Fetch user's print settings
- Pass settings to InvoicePDF component

### 3. New Services

#### **printSettings.service.ts**
```typescript
export const printSettingsService = {
  getPrintSettings: () => axiosInstance.get('/v1/invoice-print-settings'),
  savePrintSettings: (data) => axiosInstance.post('/v1/invoice-print-settings', data),
  resetPrintSettings: () => axiosInstance.delete('/v1/invoice-print-settings'),
  getAvailableFields: () => axiosInstance.get('/v1/invoice-print-settings/available-fields'),
};
```

### 4. New Hooks

#### **usePrintSettings.ts**
```typescript
export const usePrintSettings = () => useQuery({...});
export const useSavePrintSettings = () => useMutation({...});
export const useResetPrintSettings = () => useMutation({...});
export const useAvailableFields = () => useQuery({...});
```

### 5. Type Definitions

#### **types/api.ts**
```typescript
export interface PrintSettings {
  id: string;
  userId: string;
  visibleFields: string[];
  columnWidths: Record<string, number>;
  includeCustomFields: boolean;
  customFieldsPosition: 'end' | 'inline';
  fontSize: 'small' | 'medium' | 'large';
  tableBorders: boolean;
  showItemNumbers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableField {
  key: string;
  label: string;
  description: string;
  category: string;
  defaultVisible: boolean;
  minWidth: number;
  maxWidth: number;
  required: boolean;
}

export interface FieldCategory {
  key: string;
  label: string;
  order: number;
}
```

---

## UI/UX Design

### Print Settings Modal Layout

```
┌─────────────────────────────────────────────────────────┐
│  Configure Print Settings                          [X]   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Basic Information]                                      │
│  ☑ Item Number        Width: [===5%===]                  │
│  ☑ Product Description Width: [=======20%=======]        │
│  ☑ HS Code            Width: [====10%====]               │
│  ☑ Quantity           Width: [===8%===]                  │
│  ☑ UoM                Width: [==6%==]                    │
│  ☑ Rate               Width: [===8%===]                  │
│                                                           │
│  [Pricing & Values]                                       │
│  ☑ Total Value        Width: [====10%====]               │
│  ☑ Value (Excl. ST)   Width: [====10%====]               │
│  ☐ Retail Price       Width: [====10%====]               │
│  ☐ Discount           Width: [===8%===]                  │
│                                                           │
│  [Tax Information]                                        │
│  ☑ Sales Tax          Width: [====10%====]               │
│  ☐ Tax Withheld       Width: [====10%====]               │
│  ☐ Further Tax        Width: [===8%===]                  │
│  ☐ FED Payable        Width: [===8%===]                  │
│                                                           │
│  [Compliance & SRO]                                       │
│  ☐ SRO Schedule       Width: [====10%====]               │
│  ☐ SRO Item Serial    Width: [====10%====]               │
│                                                           │
│  ─────────────────────────────────────────────────────   │
│                                                           │
│  [Additional Settings]                                    │
│  ☑ Include Custom Fields                                 │
│    Position: (•) End of table  ( ) Inline with items     │
│  ☑ Show Item Numbers                                      │
│  ☑ Show Table Borders                                     │
│  Font Size: ( ) Small  (•) Medium  ( ) Large             │
│                                                           │
│  Total Width: 95% ⚠ Recommend 100%                       │
│                                                           │
│  [Reset to Defaults]  [Cancel]  [Save Settings]          │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Backend Setup
1. Create database migration for `InvoicePrintSettings` table
2. Create controller with CRUD endpoints
3. Implement default settings configuration
4. Create available fields endpoint
5. Add validation logic
6. Test all endpoints with Postman

### Phase 2: Frontend - Data Layer
1. Create `printSettings.service.ts`
2. Create `usePrintSettings.ts` hooks
3. Add TypeScript type definitions
4. Test service functions

### Phase 3: Frontend - UI Components
1. Create `PrintSettingsModal.tsx`
2. Add field selection UI with categories
3. Add width sliders with live total calculation
4. Add additional settings toggles
5. Add validation and error messages

### Phase 4: Frontend - PDF Integration
1. Update `InvoicePDF.tsx` to accept settings prop
2. Implement dynamic column rendering
3. Apply width percentages
4. Handle custom fields positioning
5. Apply font size and border styles

### Phase 5: Testing & Refinement
1. Test with various field combinations
2. Test with different widths
3. Test with custom fields enabled/disabled
4. Ensure PDF renders correctly on all paper sizes
5. Test mobile responsiveness of settings modal

---

## Backend Implementation Checklist

### Phase 1: Database Setup
- [ ] Create Prisma migration for `InvoicePrintSettings` table
- [ ] Add relationship to User model
- [ ] Run migration on development database
- [ ] Verify table structure and indexes

### Phase 2: API Development
- [ ] Create `invoicePrintSettingsController.ts`
- [ ] Implement GET endpoint (with defaults fallback)
- [ ] Implement POST endpoint with upsert logic (Prisma upsert)
- [ ] Implement DELETE endpoint (reset to defaults)
- [ ] Implement available-fields endpoint
- [ ] Add input validation for all endpoints
- [ ] Add error handling

### Phase 3: Testing
- [ ] Test GET with no existing settings
- [ ] Test GET with existing settings
- [ ] Test POST with valid data
- [ ] Test POST with invalid data (validation)
- [ ] Test DELETE and verify defaults return
- [ ] Test concurrent updates
- [ ] Test with Postman collection

### Phase 4: Documentation
- [ ] Update API documentation
- [ ] Add example requests/responses
- [ ] Document error codes
- [ ] Share with frontend team

---

## Frontend Implementation Checklist

### Phase 1: Data Layer
- [ ] Create `printSettings.service.ts`
- [ ] Create `usePrintSettings.ts` hooks
- [ ] Add TypeScript interfaces to `types/api.ts`
- [ ] Test service functions

### Phase 2: UI Components
- [ ] Create `PrintSettingsModal.tsx`
- [ ] Add field selection with categories
- [ ] Add width sliders with validation
- [ ] Add additional settings toggles
- [ ] Add save/cancel/reset buttons
- [ ] Add loading states and error handling

### Phase 3: PDF Integration
- [ ] Update `InvoicePDF.tsx` to accept settings
- [ ] Implement dynamic column rendering
- [ ] Apply width percentages
- [ ] Handle custom fields positioning
- [ ] Apply font size and borders

### Phase 4: Integration
- [ ] Add "Print Settings" button to invoices page
- [ ] Fetch settings on component mount
- [ ] Pass settings to PDF component
- [ ] Test end-to-end flow

### Phase 5: Testing & Polish
- [ ] Test with various field combinations
- [ ] Test with different column widths
- [ ] Test with custom fields enabled/disabled
- [ ] Test PDF rendering on different paper sizes
- [ ] Test mobile responsiveness
- [ ] Add tooltips and help text

---

## Future Enhancements (Phase 2)

1. **Preset Templates:**
   - "Minimal" (only basic fields)
   - "Standard" (default)
   - "Detailed" (all fields)
   - "Tax-focused" (emphasis on tax fields)

2. **Save Multiple Profiles:**
   - Different settings for different invoice types
   - Quick switch between profiles

3. **Export/Import Settings:**
   - Share settings with team members
   - Backup and restore

4. **Admin Features:**
   - Company-wide default settings
   - Lock certain fields as required

5. **Advanced Features:**
   - Drag and drop to reorder columns
   - Conditional field display
   - Print history tracking

---

## Estimated Development Time

**Backend Development:**
- Database schema & migration: 30 minutes
- API endpoints implementation: 2 hours
- Validation logic & error handling: 1.5 hours
- Testing with Postman: 1 hour
- **Backend Total: 5 hours**

**Frontend Development:**
- Service layer & hooks: 1 hour
- PrintSettingsModal component: 4-5 hours
- InvoicePDF component updates: 3-4 hours
- Integration & testing: 2-3 hours
- **Frontend Total: 10-13 hours**

**Overall Total: 15-18 hours**

---

## Implementation Decisions

### ✅ Endpoints Architecture
**Decision: Option A - Single POST endpoint with upsert logic**

**Rationale:**
- Simpler for frontend to use (one endpoint for create and update)
- Reduces code duplication
- User doesn't need to know if settings exist or not
- Frontend just POSTs settings, backend handles create vs update

**Implementation:**
```typescript
// Single endpoint handles both create and update
POST /api/v1/invoice-print-settings
// Uses Prisma's upsert: update if exists, create if not
```

### ✅ Default Settings Behavior
**Decision: Option A - Return null + defaultSettings in response**

**Rationale:**
- Don't pollute database with unused default settings
- User only gets a database record when they customize
- Frontend can use defaults without backend storing them
- Saves database space for users who never customize

**Implementation:**
```json
// First GET request (no custom settings yet)
{
  "status": "success",
  "data": {
    "printSettings": null,
    "defaultSettings": {
      "visibleFields": [...],
      "columnWidths": {...},
      ...
    }
  }
}

// After user saves custom settings
{
  "status": "success",
  "data": {
    "printSettings": {
      "id": "uuid",
      "userId": "uuid",
      "visibleFields": [...],
      ...
    }
  }
}
```

### ❌ Audit Logging
**Decision: Not implementing audit logging at this time**

**Rationale:**
- Not required for MVP
- Can be added later if needed
- Keeps implementation simpler and faster
- Focus on core functionality first

---

## Questions for Backend Developer

1. ✅ **Can we add the `InvoicePrintSettings` table to the existing database?**
   - *Awaiting confirmation*

2. ✅ **Should we use JSON columns for `visibleFields` and `columnWidths`?**
   - *Yes, use JSON columns for flexibility*

3. ✅ **Endpoints preference?**
   - **Answer: Single POST endpoint with upsert logic**

4. ✅ **Audit logging?**
   - **Answer: Not needed at this time**

5. ✅ **Default settings behavior?**
   - **Answer: Return null + defaultSettings (don't auto-create)**

6. ❓ **Any concerns about JSON column performance?**
   - *Awaiting feedback*

7. ❓ **When can we schedule this implementation?**
   - *Awaiting timeline*

---

**Document Version:** 1.0  
**Last Updated:** February 1, 2026  
**Status:** Ready for Backend Implementation  
**Author:** Frontend Team  
**Review Required By:** Backend Team Lead
