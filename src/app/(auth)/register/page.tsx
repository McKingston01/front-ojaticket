/**
 * ============================================================
 * @file        page.tsx
 * @description Página de registro con validación completa
 * @author      Matías Carrión
 * @created     2025-01-08
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAuth } from '../../../features/auth/context/AuthContext'
import { HttpError } from '../../../shared/lib/http-error'
// import type { Country, DocumentType } from '../../../shared/types'

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z
    .string()
    .min(9, 'El teléfono debe tener al menos 9 dígitos')
    .regex(/^[0-9+]+$/, 'El teléfono solo debe contener números'),
  documentType: z.enum(['RUT', 'DNI', 'PASSPORT']),
  documentNumber: z
    .string()
    .min(7, 'El documento debe tener al menos 7 caracteres'),
  country: z.enum(['CL', 'AR']),
  dateOfBirth: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida'),
})

type RegisterFormData = z.infer<typeof registerSchema>

// ============================================================================
// COMPONENT
// ============================================================================

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      country: 'CL',
      documentType: 'RUT',
    },
  })

  const selectedCountry = watch('country')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null)
      await registerUser(data)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.getUserFriendlyMessage())
      } else {
        setError('Ocurrió un error inesperado. Intenta nuevamente.')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            FTM Ticketera
          </h1>
          <h2 className="mt-6 text-2xl font-semibold text-gray-700">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                {...register('firstName')}
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                {...register('lastName')}
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                País
              </label>
              <select
                {...register('country')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="CL">Chile</option>
                <option value="AR">Argentina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Documento
              </label>
              <select
                {...register('documentType')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {selectedCountry === 'CL' && <option value="RUT">RUT</option>}
                {selectedCountry === 'AR' && <option value="DNI">DNI</option>}
                <option value="PASSPORT">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de Documento
              </label>
              <input
                {...register('documentNumber')}
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.documentNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.documentNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Nacimiento
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                {...register('password')}
                type="password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-white font-medium hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}