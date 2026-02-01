/**
 * Common API response types
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Query parameters for pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * User and Authentication types
 */
export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  province: string;
  address: string;
  ntncnic: string;
  role: 'ADMIN' | 'USER';
  postInvoiceTokenTest: string | null;
  validateInvoiceTokenTest: string | null;
  postInvoiceToken: string | null;
  validateInvoiceToken: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  status: string;
  data: {
    accessToken: string;
  };
}

export interface ProfileResponse {
  status: string;
  data: {
    user: User;
  };
}

/**
 * Buyer Management types
 */
export interface Buyer {
  id: string;
  userId: string;
  ntncnic: string;
  businessName: string;
  province: string;
  address: string;
  registrationType: 'Registered' | 'Unregistered';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuyerRequest {
  ntncnic: string;
  businessName: string;
  province: string;
  address: string;
  registrationType: 'Registered' | 'Unregistered';
}

export interface UpdateBuyerRequest {
  businessName?: string;
  province?: string;
  address?: string;
  registrationType?: 'Registered' | 'Unregistered';
}

/**
 * HS Code Management types
 */
export interface HSCode {
  id: string;
  userId: string;
  hsCode: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHSCodeRequest {
  hsCode: string;
  description?: string;
}

export interface BulkCreateHSCodeRequest {
  hsCodes: Array<{
    hsCode: string;
    description?: string;
  }>;
}

export interface BulkCreateHSCodeResponse {
  summary: {
    total: number;
    created: number;
    failed: number;
  };
  created: Array<HSCode>;
  failed: Array<{
    hsCode: string;
    error: string;
  }>;
}

export interface UpdateHSCodeRequest {
  description?: string;
}

/**
 * Scenario types
 */
export interface Scenario {
  id: string;
  scenarioCode: string;
  scenarioDescription: string;
  salesType?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Global Scenario types (Admin)
 */
export interface GlobalScenario {
  id: string;
  scenarioCode: string;
  scenarioDescription: string;
  salesType: string;
  fbrId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGlobalScenarioRequest {
  scenarioCode: string;
  scenarioDescription: string;
  salesType: string;
  fbrId?: number;
}

export interface UpdateGlobalScenarioRequest {
  scenarioCode?: string;
  scenarioDescription?: string;
  salesType?: string;
  fbrId?: number;
}

export interface AssignScenarioRequest {
  userId: string;
  scenarioId: string;
}

export interface BulkAssignScenarioRequest {
  userId: string;
  scenarioIds?: string[];
  scenarioCodes?: string[];
}

export interface UnassignScenarioRequest {
  userId: string;
  scenarioId: string;
}

export interface UserScenarioAssignment {
  id: string;
  userId: string;
  scenarioId: string;
  scenario?: GlobalScenario;
  user?: User;
  createdAt: string;
}

/**
 * Invoice Management types
 */
export interface InvoiceItem {
  id?: string;
  invoiceId?: string;
  hsCodeId: string;
  hsCode?: HSCode;
  productDescription: string;
  rate: string;
  uoM: string;
  quantity: number;
  totalValues: number;
  valueSalesExcludingST: number;
  fixedNotifiedValueOrRetailPrice: number;
  salesTaxApplicable: number;
  salesTaxWithheldAtSource: number;
  extraTax: string;
  furtherTax: number;
  sroScheduleNo: string;
  fedPayable: number;
  discount: number;
  saleType: string;
  sroItemSerialNo: string;
  customFields?: InvoiceCustomField[];
  customFieldValues?: CustomFieldValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  buyerId: string;
  scenarioId: string;
  invoiceType: string;
  invoiceDate: string;
  invoiceRefNo: string | null;
  fbrInvoiceNumber: string | null;
  fbrResponse: Record<string, unknown> | null;
  isTestEnvironment: boolean;
  createdAt: string;
  updatedAt: string;
  items?: InvoiceItem[];
  buyer?: Buyer;
  scenario?: Scenario;
  user?: User;
}

export interface CreateInvoiceRequest {
  invoiceType: string;
  invoiceDate: string;
  buyerId: string;
  scenarioId: string;
  invoiceRefNo?: string;
  isTestEnvironment?: boolean;
  sroScheduleNo?: string;
  sroItemSerialNo?: string;
  items: InvoiceItem[];
}

export interface CreateProductionInvoiceRequest {
  invoiceType: string;
  invoiceDate: string;
  buyerId: string;
  invoiceRefNo?: string;
  items: Array<Omit<InvoiceItem, 'extraTax'> & { extraTax: number | string }>;
}

export interface ValidateInvoiceRequest {
  invoiceNumber: string;
  isTestEnvironment?: boolean;
}

export interface ValidateInvoiceResponse {
  status: string;
  data: {
    invoiceNumber: string;
    validationResult: Record<string, unknown>;
  };
}

/**
 * Custom Fields types
 */
export interface CustomField {
  id: string;
  userId: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'textarea';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomFieldRequest {
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'textarea';
}

export interface UpdateCustomFieldRequest {
  fieldName?: string;
  fieldType?: 'text' | 'number' | 'date' | 'textarea';
  isActive?: boolean;
}

export interface CustomFieldValue {
  id: string;
  invoiceItemId: string;
  customFieldId: string;
  value: string;
  customField?: CustomField;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceCustomField {
  customFieldId: string;
  value: string;
}

/**
 * Invoice Print Settings types
 */
export interface PrintSettings {
  id: string;
  userId: string;
  visibleFields: string[]; // Now includes both regular fields and "customField_{uuid}" entries
  columnWidths: Record<string, number>; // Includes widths for custom fields too
  fontSize: 'small' | 'medium' | 'large';
  tableBorders: boolean;
  showItemNumbers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavePrintSettingsRequest {
  visibleFields: string[]; // Array of field keys including custom fields with "customField_" prefix
  columnWidths: Record<string, number>; // Width percentages for all visible fields
  fontSize: 'small' | 'medium' | 'large';
  tableBorders: boolean;
  showItemNumbers: boolean;
}

export interface DefaultPrintSettings {
  visibleFields: string[];
  columnWidths: Record<string, number>;
  fontSize: 'small' | 'medium' | 'large';
  tableBorders: boolean;
  showItemNumbers: boolean;
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

export interface CustomFieldOption {
  key: string; // "customField_{uuid}"
  id: string; // Just the UUID
  label: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'textarea';
  description: string;
  category: 'custom';
  defaultVisible: boolean;
  minWidth: number;
  maxWidth: number;
  required: boolean;
}
