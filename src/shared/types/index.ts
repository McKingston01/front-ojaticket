/**
 * ============================================================
 * @file        index.ts
 * @description Export central de tipos
 * @author      Matías Carrión
 * @created     2025-01-08
 * @updated     2025-01-16
 * @version     2.0.0
 * ============================================================
 */

// Entities
export type * from './entities.types'

// API Types - Actions
export type {
  EventActions,
  TicketActions,
  PurchaseActions,
  EventProducerActions,
} from './api.types'

// API Types - Result Pattern
export type {
  ApiSuccess,
  ApiError,
  ApiResult,
} from './api.types'

export {
  isApiSuccess,
  isApiError,
} from './api.types'

// API Types - Pagination
export type {
  PaginationParams,
  PaginatedResponse,
  PaginationMetadataDTO,
} from './api.types'

// API Types - Auth
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
} from './api.types'

// API Types - Events
export type {
  CreateEventRequest,
  CreateEventZoneRequest,
  UpdateEventRequest,
  EventWithZones,
  EventPublicListItemDTO,
  EventPublicDetailDTO,
  EventProducerDetailDTO,
  EventFiltersDTO,
  EventsListResponseDTO,
} from './api.types'

// API Types - Tickets
export type {
  ReserveTicketsRequest,
  ReserveTicketsResponse,
  ConfirmPurchaseRequest,
  ConfirmPurchaseResponse,
  TransferTicketRequest,
  ValidateTicketRequest,
  ValidateTicketResponse,
  TicketCustomerDTO,
  TransferTicketDTO,
  TransferResultDTO,
} from './api.types'

// API Types - Purchase
export type {
  PurchaseWithDetails,
  PurchaseCustomerDTO,
} from './api.types'

// API Types - Availability
export type {
  AvailabilityDTO,
} from './api.types'

// API Types - Reservation
export type {
  CreateReservationDTO,
  TicketReservationDTO,
  ReservationDTO,
} from './api.types'

// API Types - Checkout
export type {
  ValidationErrorDTO,
  ValidationResultDTO,
  CheckoutResponseDTO,
} from './api.types'

// API Types - QR Validation
export type {
  ValidateQRDTO,
  TicketStaffValidationDTO,
  QRValidationResultDTO,
} from './api.types'

// API Types - Dashboard
export type {
  ProducerDashboardStats,
  EventDetailedStats,
} from './api.types'

// API Types - Staff Onboarding
export type {
  OnboardingTestRequest,
  OnboardingTestResponse,
  OnboardingStatusDTO,
  SubmitTestDTO,
  TestResultDTO,
} from './api.types'

// API Types - Analytics
export type {
  SalesStatsDTO,
  ValidationStatsDTO,
} from './api.types'

// API Types - APK Distribution
export type {
  APKDownloadDTO,
} from './api.types'

// API Types - OAuth
export type {
  OAuthIntentDTO,
  OAuthCompleteDTO,
} from './api.types'

// API Types - Dev Dashboard
export type {
  LogFiltersDTO,
  LogEntryDTO,
  LogsListDTO,
  SystemMetricsDTO,
  BusinessMetricsDTO,
  UsersListDTO,
} from './api.types'

// API Types - Refunds
export type {
  RefundRequestDTO,
  RefundCreatedDTO,
  RefundStatusDTO,
} from './api.types'

// API Types - Staff Assignment
export type {
  AssignStaffDTO,
  StaffAssignmentDTO,
  CurrentEventDTO,
  ValidationRecordDTO,
  ValidationHistoryDTO,
} from './api.types'