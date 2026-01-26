/**
 * ============================================================
 * @file        api.config.ts
 * @description Configuración de API - FTM Ticketera
 * @author      Matías Carrión
 * @created     2025-01-08
 * @updated     2026-01-25
 * @version     2.0.1 - Endpoints alineados con backend /api/v1
 * ============================================================
 */

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api-ojaticket.onrender.com'

const API_VERSION =
  process.env.NEXT_PUBLIC_API_VERSION || 'v1'

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  baseURL: `${API_URL}/api/${API_VERSION}`,
  timeout: 30000, // 30s
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const

// ============================================================================
// API ENDPOINTS (ALINEADOS CON BACKEND REAL)
// ============================================================================

export const API_ENDPOINTS = {
  // --------------------------------------------------------------------------
  // AUTH
  // --------------------------------------------------------------------------
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    GOOGLE: '/auth/google',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // --------------------------------------------------------------------------
  // USER (EL BACKEND EXPONE auth/me, NO users/me)
  // --------------------------------------------------------------------------
  USERS: {
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/me',
    CHANGE_PASSWORD: '/auth/me/password',
  },

  // --------------------------------------------------------------------------
  // EVENTS (FUTURO)
  // --------------------------------------------------------------------------
  EVENTS: {
    LIST: '/events',
    PUBLIC_LIST: '/events/public',
    BY_ID: (id: string) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
    PUBLISH: (id: string) => `/events/${id}/publish`,
    CANCEL: (id: string) => `/events/${id}/cancel`,
    STATS: (id: string) => `/events/${id}/stats`,
  },

  // --------------------------------------------------------------------------
  // TICKETS (FUTURO)
  // --------------------------------------------------------------------------
  TICKETS: {
    RESERVE: '/tickets/reserve',
    CONFIRM_PURCHASE: '/tickets/confirm-purchase',
    MY_TICKETS: '/tickets/my-tickets',
    BY_ID: (id: string) => `/tickets/${id}`,
    VALIDATE: '/tickets/validate',
    TRANSFER: (id: string) => `/tickets/${id}/transfer`,
    DOWNLOAD_PDF: (id: string) => `/tickets/${id}/download`,
  },

  // --------------------------------------------------------------------------
  // PURCHASES (FUTURO)
  // --------------------------------------------------------------------------
  PURCHASES: {
    MY_PURCHASES: '/purchases/my-purchases',
    BY_ID: (id: string) => `/purchases/${id}`,
    REQUEST_REFUND: (id: string) => `/purchases/${id}/refund`,
  },

  // --------------------------------------------------------------------------
  // DASHBOARD (FUTURO)
  // --------------------------------------------------------------------------
  DASHBOARD: {
    PRODUCER_STATS: '/dashboard/producer/stats',
    STAFF_STATS: '/dashboard/staff/stats',
  },

  // --------------------------------------------------------------------------
  // STAFF (FUTURO)
  // --------------------------------------------------------------------------
  STAFF: {
    ONBOARDING_STATUS: '/staff/onboarding/status',
    START_ONBOARDING: '/staff/onboarding/start',
    SUBMIT_TEST: '/staff/onboarding/submit-test',
    ASSIGNMENTS: '/staff/assignments',
  },

  // --------------------------------------------------------------------------
  // HEALTH
  // --------------------------------------------------------------------------
  HEALTH: {
    CHECK: '/health',
  },
} as const

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

// ============================================================================
// ERROR CODES (ALINEADOS CON BACKEND)
// ============================================================================

export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Business
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  TICKET_NOT_AVAILABLE: 'TICKET_NOT_AVAILABLE',
  RESERVATION_EXPIRED: 'RESERVATION_EXPIRED',
  INSUFFICIENT_CAPACITY: 'INSUFFICIENT_CAPACITY',
  UNAUTHORIZED_ACTION: 'UNAUTHORIZED_ACTION',

  // Payment
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  REFUND_NOT_ALLOWED: 'REFUND_NOT_ALLOWED',

  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // Unknown
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ftm_access_token',
  REFRESH_TOKEN: 'ftm_refresh_token',
  USER: 'ftm_user',
} as const
