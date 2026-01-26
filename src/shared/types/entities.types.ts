/**
 * Tipos de Entidades del Dominio - FTM Ticketera
 * 
 * REGLA CRÍTICA: Estos tipos DEBEN estar 1:1 alineados con el backend
 * NO modificar sin verificar cambios en el backend primero
 * 
 * Backend Reference: src/domain/entities/
 */

// ============================================================================
// ROLES Y ESTADOS
// ============================================================================

export type UserRole = 'customer' | 'producer' | 'staff' | 'dev'

export type EventStatus = 'draft' | 'published' | 'sold_out' | 'cancelled' | 'completed'

export type TicketStatus = 'reserved' | 'purchased' | 'validated' | 'transferred' | 'refunded'

export type PurchaseStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type ReservationStatus = 'active' | 'expired' | 'confirmed' | 'cancelled'

// ============================================================================
// COUNTRY & DOCUMENT TYPES
// ============================================================================

export type Country = 'CL' | 'AR'

export type DocumentType = 'RUT' | 'DNI' | 'PASSPORT'

// ============================================================================
// USER
// ============================================================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  documentId: DocumentType
  documentNumber: string
  country: Country
  birthDate: string 
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

// ============================================================================
// VENUE
// ============================================================================

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  country: Country
  capacity: number
  createdAt: string
  updatedAt: string
}

// ============================================================================
// EVENT
// ============================================================================

export interface Event {
  id: string
  title: string
  description: string
  producerId: string
  venueId: string
  startDateTime: string // ISO datetime
  endDateTime: string // ISO datetime
  status: EventStatus
  imageUrl?: string
  ageRestriction?: number
  allowTransfers: boolean
  termsAndConditions?: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// EVENT ZONE
// ============================================================================

export interface EventZone {
  id: string
  eventId: string
  name: string
  capacity: number
  price: number
  currency: string
  availableTickets: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// ============================================================================
// TICKET
// ============================================================================

export interface Ticket {
  id: string
  purchaseId: string
  eventId: string
  zoneId: string
  ownerUserId: string
  qrCode: string
  status: TicketStatus
  validatedAt?: string
  validatedBy?: string
  transferredFrom?: string
  transferredAt?: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// PURCHASE
// ============================================================================

export interface Purchase {
  id: string
  userId: string
  eventId: string
  totalAmount: number
  currency: string
  status: PurchaseStatus
  paymentMethod: string
  mercadoPagoId?: string
  mercadoPagoStatus?: string
  purchasedAt?: string
  refundedAt?: string
  refundReason?: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// RESERVATION
// ============================================================================

export interface Reservation {
  id: string
  userId: string
  eventId: string
  zoneId: string
  quantity: number
  status: ReservationStatus
  expiresAt: string // ISO datetime
  createdAt: string
}

// ============================================================================
// STAFF ASSIGNMENT
// ============================================================================

export interface StaffAssignment {
  id: string
  userId: string
  eventId: string
  role: string
  assignedBy: string
  assignedAt: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// ONBOARDING PROGRESS
// ============================================================================

export interface OnboardingProgress {
  id: string
  userId: string
  completedAt?: string
  testScore?: number
  attemptsCount: number
  lastAttemptAt?: string
  canRetryAt?: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
}