/**
 * ============================================================
 * @file        api.types.ts
 * @description Tipos de API (DTOs y Responses) - ACTUALIZADO FASE 5
 * @author      Matías Carrión
 * @created     2025-01-08
 * @updated     2025-01-16
 * @version     2.0.0
 * ============================================================
 */

import type {
  User,
  Event,
  EventZone,
  Purchase,
  Country,
  DocumentType,
} from './entities.types'

// ============================================================================
// RESULT PATTERN
// ============================================================================

export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

export const isApiSuccess = <T>(result: ApiResult<T>): result is ApiSuccess<T> => {
  return result.success === true
}

export const isApiError = <T>(result: ApiResult<T>): result is ApiError => {
  return result.success === false
}

// ============================================================================
// ACTIONS - BACKEND CALCULATED PERMISSIONS
// ============================================================================

/**
 * Acciones permitidas para un evento público (vista de cliente).
 * 
 * El backend calcula estos permisos basándose en:
 * - Estado del evento (draft, published, cancelled, sold_out)
 * - Disponibilidad actual de tickets
 * - Fecha del evento (futuro, pasado, próximo)
 * - Configuración del evento
 * 
 * @example
 * // Frontend usa así:
 * if (event.actions.canPurchase) {
 *   return <Button>Comprar</Button>
 * }
 * 
 * // Frontend NUNCA hace:
 * if (event.status === 'published' && event.availableTickets > 0) { ... }
 */
export interface EventActions {
  /**
   * ¿Se pueden comprar tickets para este evento?
   * Backend retorna `true` si:
   * - event.status === 'published'
   * - event.availableTickets > 0
   * - event.startDateTime > now
   * - !event.isCancelled
   */
  canPurchase: boolean

  /**
   * ¿Se pueden hacer reservas temporales?
   * Backend retorna `true` si:
   * - canPurchase === true
   * - user está autenticado
   * - user no tiene reservas activas para este evento
   */
  canReserve: boolean

  /**
   * ¿El evento está disponible (no agotado/cancelado)?
   * Backend retorna `true` si:
   * - event.status !== 'cancelled'
   * - event.status !== 'sold_out'
   */
  isAvailable: boolean

  /**
   * ¿Se debe mostrar countdown hasta el evento?
   * Backend retorna `true` si:
   * - event.startDateTime está entre ahora y +7 días
   * - event.status === 'published'
   */
  showCountdown: boolean
}

/**
 * Acciones permitidas para un ticket (vista de cliente).
 * 
 * El backend calcula estos permisos basándose en:
 * - Estado del ticket (purchased, transferred, refunded, validated)
 * - Políticas del evento (allowTransfers, refundPolicy)
 * - Fecha del evento
 * - Propiedad del ticket (currentOwnerId)
 * 
 * @example
 * if (!ticket.actions.canTransfer) {
 *   return <Button disabled>Transferir (No permitido)</Button>
 * }
 */
export interface TicketActions {
  /**
   * ¿Se puede transferir este ticket a otro usuario?
   * Backend retorna `true` si:
   * - ticket.status === 'purchased'
   * - ticket.transferCount === 0 (límite: 1 transferencia)
   * - event.allowTransfers === true
   * - event.startDateTime > now + 24h (mínimo 24h antes)
   * - currentUserId === ticket.ownerId
   */
  canTransfer: boolean

  /**
   * ¿Se puede solicitar reembolso?
   * Backend retorna `true` si:
   * - ticket.status === 'purchased'
   * - event.refundPolicy permite reembolso en esta fecha
   * - event.startDateTime > now + refundPolicy.minimumHours
   * - ticket no tiene refund request pendiente
   */
  canRefund: boolean

  /**
   * ¿Se puede descargar el PDF del ticket?
   * Backend retorna `true` si:
   * - ticket.status === 'purchased'
   * - ticket.pdfUrl existe
   * - currentUserId === ticket.ownerId
   */
  canDownload: boolean

  /**
   * ¿Se puede ver el código QR?
   * Backend retorna `true` si:
   * - ticket.status === 'purchased'
   * - currentUserId === ticket.ownerId
   * - event.startDateTime está entre ahora - 12h y ahora + 24h
   */
  canViewQR: boolean
}

/**
 * Acciones permitidas para una compra (vista de cliente).
 */
export interface PurchaseActions {
  /**
   * ¿Se puede solicitar reembolso total de la compra?
   * Backend retorna `true` si:
   * - Todos los tickets de la compra tienen canRefund === true
   */
  canRefund: boolean

  /**
   * ¿Se puede exportar factura/comprobante?
   * Backend retorna `true` si:
   * - purchase.status === 'approved'
   */
  canExport: boolean

  /**
   * ¿Se puede cancelar la compra?
   * Backend retorna `true` si:
   * - purchase.status === 'pending'
   * - purchase.createdAt < now + 15min (ventana de cancelación)
   */
  canCancel: boolean
}

/**
 * Acciones permitidas para un evento (vista de productora).
 * 
 * Permisos más amplios que EventActions porque es el creador.
 */
export interface EventProducerActions {
  /**
   * ¿Se puede editar el evento?
   * Backend retorna `true` si:
   * - currentUserId === event.producerId
   * - event.status !== 'cancelled'
   * - No hay ventas confirmadas (o solo edición limitada)
   */
  canEdit: boolean

  /**
   * ¿Se puede eliminar el evento?
   * Backend retorna `true` si:
   * - currentUserId === event.producerId
   * - event.totalTicketsSold === 0
   * - event.status === 'draft'
   */
  canDelete: boolean

  /**
   * ¿Se puede publicar el evento?
   * Backend retorna `true` si:
   * - currentUserId === event.producerId
   * - event.status === 'draft'
   * - event tiene al menos 1 zona configurada
   * - event.venue existe
   */
  canPublish: boolean

  /**
   * ¿Se puede pausar las ventas?
   * Backend retorna `true` si:
   * - currentUserId === event.producerId
   * - event.status === 'published'
   */
  canPause: boolean

  /**
   * ¿Se puede asignar staff al evento?
   * Backend retorna `true` si:
   * - currentUserId === event.producerId
   * - event.status !== 'cancelled'
   * - event.startDateTime > now
   */
  canAssignStaff: boolean

  /**
   * ¿Se pueden ver analytics del evento?
   * Backend retorna `true` si:
   * - currentUserId === event.producerId
   * - event tiene al menos 1 venta
   */
  canViewAnalytics: boolean

  /**
   * ¿Se puede exportar reporte (Excel/CSV)?
   * Backend retorna `true` si:
   * - currentUserId === event.producerId
   */
  canExport: boolean
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================================
// AUTH DTOs
// ============================================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  documentType: DocumentType
  documentNumber: string
  country: Country
  dateOfBirth: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// ============================================================================
// EVENT DTOs
// ============================================================================

export interface CreateEventRequest {
  title: string
  description: string
  venueId: string
  startDateTime: string
  endDateTime: string
  imageUrl?: string
  ageRestriction?: number
  allowTransfers: boolean
  termsAndConditions?: string
  zones: CreateEventZoneRequest[]
}

export interface CreateEventZoneRequest {
  name: string
  capacity: number
  price: number
  sortOrder: number
}

export interface UpdateEventRequest {
  title?: string
  description?: string
  startDateTime?: string
  endDateTime?: string
  imageUrl?: string
  ageRestriction?: number
  allowTransfers?: boolean
  termsAndConditions?: string
  status?: 'draft' | 'published' | 'cancelled'
}

export interface EventWithZones extends Event {
  zones: EventZone[]
  venue: {
    id: string
    name: string
    city: string
  }
}

/**
 * DTO para listado público de eventos (GET /api/events)
 */
export interface EventPublicListItemDTO {
  id: string
  title: string
  description: string
  startDateTime: string
  imageUrl?: string
  venue: {
    name: string
    city: string
  }
  minPrice: number
  maxPrice: number
  availableTickets: number
  actions: EventActions
}

/**
 * DTO para detalle público de evento (GET /api/events/:id)
 */
export interface EventPublicDetailDTO {
  id: string
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  imageUrl?: string
  ageRestriction?: number
  venue: {
    id: string
    name: string
    address: string
    city: string
    country: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  zones: Array<{
    id: string
    name: string
    price: number
    capacity: number
    available: number
    sortOrder: number
  }>
  refundPolicy: {
    allowRefunds: boolean
    refundableUntilHours?: number
    refundPercentage?: number
  }
  producer: {
    name: string
    email: string
  }
  termsAndConditions?: string
  allowTransfers: boolean
  actions: EventActions
}

/**
 * DTO para evento con zonas (vista productora)
 */
export interface EventProducerDetailDTO {
  id: string
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  status: 'draft' | 'published' | 'cancelled' | 'sold_out'
  imageUrl?: string
  ageRestriction?: number
  allowTransfers: boolean
  termsAndConditions?: string
  venue: {
    id: string
    name: string
    city: string
  }
  zones: Array<{
    id: string
    name: string
    price: number
    capacity: number
    sold: number
    available: number
  }>
  refundPolicy: {
    allowRefunds: boolean
    refundableUntilHours?: number
    refundPercentage?: number
  }
  totalTicketsSold: number
  totalRevenue: number
  totalValidations: number
  assignedStaff: Array<{
    userId: string
    name: string
    role: 'entry_validator' | 'coordinator' | 'security'
  }>
  actions: EventProducerActions
}

/**
 * DTO para ticket de cliente (GET /api/purchases/:userId/tickets)
 */
export interface TicketCustomerDTO {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  zoneName: string
  qrCode?: string
  status: 'purchased' | 'transferred' | 'refunded' | 'validated'
  price: number
  purchaseId: string
  purchaseDate: string
  ownerName: string
  actions: TicketActions
}

/**
 * DTO para compra de cliente (GET /api/purchases/:id)
 */
export interface PurchaseCustomerDTO {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  totalAmount: number
  purchaseDate: string
  status: 'pending' | 'approved' | 'rejected' | 'refunded'
  paymentMethod: string
  tickets: TicketCustomerDTO[]
  actions: PurchaseActions
}

// ============================================================================
// TICKET DTOs
// ============================================================================

export interface ReserveTicketsRequest {
  eventId: string
  zoneId: string
  quantity: number
}

export interface ReserveTicketsResponse {
  reservationId: string
  tickets: Array<{
    zoneId: string
    zoneName: string
    quantity: number
    unitPrice: number
  }>
  totalAmount: number
  expiresAt: string
}

export interface ConfirmPurchaseRequest {
  reservationId: string
  paymentMethodId?: string
}

export interface ConfirmPurchaseResponse {
  purchaseId: string
  checkoutUrl: string
  mercadoPagoId: string
}

export interface TransferTicketRequest {
  ticketId: string
  recipientEmail: string
}

export interface ValidateTicketRequest {
  qrCode: string
  eventId: string
}

export interface ValidateTicketResponse {
  valid: boolean
  ticket?: {
    id: string
    ownerName: string
    zoneName: string
    status: string
  }
  reason?: string
}

// ============================================================================
// PURCHASE DTOs
// ============================================================================

export interface PurchaseWithDetails extends Purchase {
  event: {
    id: string
    title: string
    startDateTime: string
  }
  tickets: Array<{
    id: string
    zoneName: string
    qrCode: string
    status: string
  }>
}

// ============================================================================
// DASHBOARD DTOs
// ============================================================================

export interface ProducerDashboardStats {
  totalEvents: number
  upcomingEvents: number
  totalRevenue: number
  totalTicketsSold: number
  recentSales: Array<{
    purchaseId: string
    eventTitle: string
    amount: number
    purchasedAt: string
  }>
}

export interface EventDetailedStats {
  eventId: string
  title: string
  totalTicketsSold: number
  totalRevenue: number
  ticketsByZone: Array<{
    zoneName: string
    sold: number
    capacity: number
    revenue: number
  }>
  salesByDay: Array<{
    date: string
    ticketsSold: number
    revenue: number
  }>
}

// ============================================================================
// STAFF DTOs
// ============================================================================

export interface OnboardingTestRequest {
  answers: Record<string, string | number>
}

export interface OnboardingTestResponse {
  score: number
  passed: boolean
  correctAnswers: number
  totalQuestions: number
  canRetryAt?: string
}

// ============================================================================
// PAGINATION & FILTERS
// ============================================================================

/**
 * Metadata de paginación para listas
 */
export interface PaginationMetadataDTO {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Filtros para listado de eventos públicos
 */
export interface EventFiltersDTO {
  city?: string
  date_from?: string
  date_to?: string
  price_min?: number
  price_max?: number
  page?: number
  limit?: number
  sort?: 'date' | 'price' | 'title'
  order?: 'asc' | 'desc'
}

/**
 * Respuesta de listado de eventos públicos
 */
export interface EventsListResponseDTO {
  data: EventPublicListItemDTO[]
  pagination: PaginationMetadataDTO
}

// ============================================================================
// AVAILABILITY DTOs
// ============================================================================

/**
 * Disponibilidad de tickets en tiempo real
 */
export interface AvailabilityDTO {
  available: number
  reserved: number
  total: number
}

// ============================================================================
// RESERVATION DTOs
// ============================================================================

/**
 * DTO para crear reserva
 */
export interface CreateReservationDTO {
  eventId: string
  zoneId: string
  quantity: number
}

/**
 * DTO de ticket en reserva
 */
export interface TicketReservationDTO {
  zoneId: string
  zoneName: string
  quantity: number
  unitPrice: number
}

/**
 * Respuesta de reserva creada
 */
export interface ReservationDTO {
  reservationId: string
  expiresAt: string
  tickets: TicketReservationDTO[]
  totalAmount: number
}

// ============================================================================
// CHECKOUT DTOs
// ============================================================================

/**
 * Error de validación en checkout
 */
export interface ValidationErrorDTO {
  field: string
  message: string
}

/**
 * Resultado de validación de checkout
 */
export interface ValidationResultDTO {
  valid: boolean
  errors?: ValidationErrorDTO[]
}

/**
 * Respuesta de proceso de checkout
 */
export interface CheckoutResponseDTO {
  redirectUrl: string
}

// ============================================================================
// QR VALIDATION DTOs
// ============================================================================

/**
 * DTO para validar QR
 */
export interface ValidateQRDTO {
  qrCode: string
  rutOptional?: string
  eventId: string
}

/**
 * DTO de ticket para staff en validación
 */
export interface TicketStaffValidationDTO {
  id: string
  eventTitle: string
  zoneName: string
  customerName: string
  status: string
}

/**
 * Resultado de validación de QR
 */
export interface QRValidationResultDTO {
  valid: boolean
  ticket?: TicketStaffValidationDTO
  reason?: 'duplicate' | 'not_found' | 'already_used'
}

// ============================================================================
// ONBOARDING DTOs (STAFF)
// ============================================================================

/**
 * Estado de onboarding de staff
 */
export interface OnboardingStatusDTO {
  required: boolean
  completed: boolean
  attempts: number
  score?: number
  nextAttemptAt?: string
}

/**
 * DTO para enviar respuestas de test
 */
export interface SubmitTestDTO {
  answers: Array<{
    questionId: string
    answer: string | number
  }>
}

/**
 * Resultado de test de onboarding
 */
export interface TestResultDTO {
  score: number
  passed: boolean
  attemptsRemaining: number
  cooldownUntil?: string
}

// ============================================================================
// ANALYTICS DTOs (PRODUCER)
// ============================================================================

/**
 * Estadísticas de ventas
 */
export interface SalesStatsDTO {
  series: Array<{
    date: string
    revenue: number
    ticketsSold: number
  }>
  byZone: Array<{
    zoneName: string
    revenue: number
    ticketsSold: number
  }>
  byPaymentMethod: Array<{
    method: string
    revenue: number
    count: number
  }>
}

/**
 * Estadísticas de validaciones
 */
export interface ValidationStatsDTO {
  total: number
  byStaff: Array<{
    staffName: string
    count: number
  }>
  byHour: Array<{
    hour: number
    count: number
  }>
}

// ============================================================================
// APK DISTRIBUTION DTOs
// ============================================================================

/**
 * DTO para descarga de APK
 */
export interface APKDownloadDTO {
  downloadUrl: string
  version: string
  size: number
  checksum: string
  releaseNotes: string
  expiresAt: string
  minAndroidVersion: number
}

// ============================================================================
// OAUTH DTOs (MOBILE)
// ============================================================================

/**
 * Intent de OAuth para app móvil
 */
export interface OAuthIntentDTO {
  authUrl: string
  provider: 'google' | 'oidc'
  state: string
  codeChallenge: string
}

/**
 * Completar OAuth desde app móvil
 */
export interface OAuthCompleteDTO {
  code: string
  state: string
  codeVerifier: string
}

// ============================================================================
// DEV DASHBOARD DTOs
// ============================================================================

/**
 * Filtros para logs del sistema
 */
export interface LogFiltersDTO {
  level?: 'info' | 'warn' | 'error'
  from?: string
  to?: string
  limit?: number
}

/**
 * Entrada de log del sistema
 */
export interface LogEntryDTO {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
  user?: {
    id: string
    name: string
  }
  resource?: string
  action?: string
  ipAddress?: string
  metadata?: Record<string, unknown>
}

/**
 * Lista de logs
 */
export interface LogsListDTO {
  logs: LogEntryDTO[]
}

/**
 * Métricas del sistema
 */
export interface SystemMetricsDTO {
  uptime: number
  memoryUsage: {
    used: number
    total: number
    percentage: number
  }
  cpuUsage: number
  requestsPerMinute: number
  errorRate: number
}

/**
 * Métricas de negocio
 */
export interface BusinessMetricsDTO {
  activeUsers: number
  salesToday: number
  ticketsValidated: number
  avgResponseTime: number
}

/**
 * Lista de usuarios (Dev dashboard)
 */
export interface UsersListDTO {
  users: User[]
  pagination: PaginationMetadataDTO
}

// ============================================================================
// TRANSFER DTOs
// ============================================================================

/**
 * DTO para transferir ticket
 */
export interface TransferTicketDTO {
  toEmail: string
  toDocumentId: string
}

/**
 * Resultado de transferencia
 */
export interface TransferResultDTO {
  ticket: TicketCustomerDTO
  transferId: string
}

// ============================================================================
// REFUND DTOs
// ============================================================================

/**
 * DTO para solicitar reembolso
 */
export interface RefundRequestDTO {
  ticketId: string
  reason: string
}

/**
 * DTO de solicitud de reembolso creada
 */
export interface RefundCreatedDTO {
  refundRequest: {
    id: string
    ticketId: string
    status: 'pending' | 'approved' | 'rejected' | 'completed'
    requestedAt: string
  }
}

/**
 * Estado de reembolso
 */
export interface RefundStatusDTO {
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  progress: number
  estimatedDate: string
}

// ============================================================================
// STAFF ASSIGNMENT DTOs
// ============================================================================

/**
 * DTO para asignar staff
 */
export interface AssignStaffDTO {
  userId: string
  role: 'entry_validator' | 'coordinator' | 'security'
  shift: {
    id: string
    start: string
    end: string
  }
}

/**
 * DTO de asignación de staff
 */
export interface StaffAssignmentDTO {
  id: string
  userId: string
  eventId: string
  role: 'entry_validator' | 'coordinator' | 'security'
  shift: {
    id: string
    start: string
    end: string
  }
}

/**
 * Evento actual del staff
 */
export interface CurrentEventDTO {
  event: {
    id: string
    title: string
    startDateTime: string
  }
  assignment: StaffAssignmentDTO
  validationsToday: number
}

/**
 * Historial de validaciones
 */
export interface ValidationRecordDTO {
  ticketId: string
  eventTitle: string
  timestamp: string
  result: 'valid' | 'invalid'
}

/**
 * Historial de validaciones del staff
 */
export interface ValidationHistoryDTO {
  validations: ValidationRecordDTO[]
}