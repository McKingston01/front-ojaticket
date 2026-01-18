/**
 * HTTP Error - FTM Ticketera
 * 
 * Clase personalizada para manejar errores de API
 */

import { ERROR_CODES } from '../config/api.config'

export class HttpError extends Error {
  public readonly statusCode: number
  public readonly errorCode: string
  public readonly details?: unknown

  constructor(
    message: string,
    statusCode: number,
    errorCode: string = ERROR_CODES.UNKNOWN_ERROR,
    details?: unknown
  ) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.details = details

    // Mantener el stack trace correcto
    Object.setPrototypeOf(this, HttpError.prototype)
  }

  /**
   * Verifica si el error es un error de autenticación
   */
  isAuthError(): boolean {
    return (
      this.statusCode === 401 ||
      this.errorCode === ERROR_CODES.INVALID_CREDENTIALS ||
      this.errorCode === ERROR_CODES.TOKEN_EXPIRED ||
      this.errorCode === ERROR_CODES.INVALID_TOKEN
    )
  }

  /**
   * Verifica si el error es un error de validación
   */
  isValidationError(): boolean {
    return (
      this.statusCode === 422 ||
      this.errorCode === ERROR_CODES.VALIDATION_ERROR ||
      this.errorCode === ERROR_CODES.INVALID_INPUT
    )
  }

  /**
   * Verifica si el error es un error de red
   */
  isNetworkError(): boolean {
    return (
      this.errorCode === ERROR_CODES.NETWORK_ERROR ||
      this.errorCode === ERROR_CODES.TIMEOUT_ERROR
    )
  }

  /**
   * Obtiene un mensaje de error amigable para el usuario
   */
  getUserFriendlyMessage(): string {
    switch (this.errorCode) {
      case ERROR_CODES.INVALID_CREDENTIALS:
        return 'Credenciales inválidas. Verifica tu email y contraseña.'
      
      case ERROR_CODES.EMAIL_ALREADY_EXISTS:
        return 'Este email ya está registrado.'
      
      case ERROR_CODES.TOKEN_EXPIRED:
        return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      
      case ERROR_CODES.EVENT_NOT_FOUND:
        return 'El evento no existe o no está disponible.'
      
      case ERROR_CODES.TICKET_NOT_AVAILABLE:
        return 'Las entradas seleccionadas ya no están disponibles.'
      
      case ERROR_CODES.RESERVATION_EXPIRED:
        return 'Tu reserva ha expirado. Por favor, intenta nuevamente.'
      
      case ERROR_CODES.INSUFFICIENT_CAPACITY:
        return 'No hay suficientes entradas disponibles.'
      
      case ERROR_CODES.PAYMENT_FAILED:
        return 'El pago no pudo ser procesado. Intenta nuevamente.'
      
      case ERROR_CODES.NETWORK_ERROR:
        return 'Error de conexión. Verifica tu internet e intenta nuevamente.'
      
      case ERROR_CODES.TIMEOUT_ERROR:
        return 'La solicitud tardó demasiado. Intenta nuevamente.'
      
      default:
        return this.message || 'Ocurrió un error inesperado. Intenta nuevamente.'
    }
  }

  /**
   * Convierte el error a un objeto JSON serializable
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      details: this.details,
    }
  }
}