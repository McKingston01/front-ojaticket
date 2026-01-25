'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAuth } from '../../../features/auth/context/AuthContext'
import { HttpError } from '../../../shared/lib/http-error'

// ============================================================================
// VALIDATION SCHEMA (ALINEADO AL BACKEND)
// ============================================================================

const registerSchema = z.object({
  email: z.string().email('Email inválido'),

  password: z
    .string()
    .min(8, 'Debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Debe incluir mayúscula, minúscula, número y carácter especial'
    ),

  firstName: z
    .string()
    .min(2, 'Nombre mínimo 2 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras'),

  lastName: z
    .string()
    .min(2, 'Apellido mínimo 2 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras'),

  documentId: z
    .string()
    .min(7, 'Documento inválido')
    .max(20, 'Documento inválido'),

  country: z.enum(['CL', 'AR']),

  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),

  // ✅ OBLIGATORIO (alineado con backend y AuthContext)
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, 'Formato internacional'),
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
    formState: { isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      country: 'CL',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null)
      await registerUser(data)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.getUserFriendlyMessage())
      } else {
        setError('Error inesperado. Intenta nuevamente.')
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
          <h2 className="mt-4 text-xl text-gray-700">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <input {...register('firstName')} placeholder="Nombre" />
          <input {...register('lastName')} placeholder="Apellido" />
          <input {...register('email')} type="email" placeholder="Email" />
          <input {...register('password')} type="password" placeholder="Contraseña" />
          <input {...register('documentId')} placeholder="Documento" />
          <input {...register('birthDate')} type="date" />
          <input {...register('phone')} placeholder="+56912345678" />

          <select {...register('country')}>
            <option value="CL">Chile</option>
            <option value="AR">Argentina</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-primary py-2 text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
