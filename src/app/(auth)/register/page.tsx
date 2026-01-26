'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAuth } from '@/features/auth/context/AuthContext'
import { HttpError } from '@/shared/lib/http-error'
import type { RegisterRequest } from '@/shared/types'

// ============================================================================
// FORM SCHEMA (FRONTEND)
// ============================================================================

const registerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),

  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Password inseguro'
    ),

  firstName: z.string().min(2),
  lastName: z.string().min(2),

  documentType: z.enum(['RUT', 'DNI']),
  documentNumber: z.string().min(7),

  country: z.enum(['CL', 'AR']),

  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/),
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
      documentType: 'RUT',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null)

      // 🔒 Contrato API EXACTO
      const payload: RegisterRequest = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        country: data.country,
        dateOfBirth: data.dateOfBirth,
      }

      await registerUser(payload)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.getUserFriendlyMessage())
      } else {
        setError('Error inesperado')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">FTM Ticketera</h1>
          <p className="text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('firstName')} placeholder="Nombre" />
          <input {...register('lastName')} placeholder="Apellido" />
          <input {...register('email')} type="email" placeholder="Email" />
          <input {...register('password')} type="password" placeholder="Password" />

          <select {...register('documentType')}>
            <option value="RUT">RUT</option>
            <option value="DNI">DNI</option>
          </select>

          <input {...register('documentNumber')} placeholder="Documento" />
          <input {...register('dateOfBirth')} type="date" />
          <input {...register('phone')} placeholder="+56912345678" />

          <select {...register('country')}>
            <option value="CL">Chile</option>
            <option value="AR">Argentina</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-blue-600 py-2 text-white"
          >
            {isSubmitting ? 'Registrando…' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
