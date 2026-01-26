'use client'

import { useState } from 'react'
import { useAuth } from '../../../features/auth/context/AuthContext'
import type { RegisterRequest } from '@/shared/types'

interface RegisterFormValues {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  country: 'CL' | 'AR'
  dateOfBirth: string
  documentType: 'RUT' | 'DNI'
  documentNumber: string
}

export default function RegisterPage() {
  const { register } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<RegisterFormValues>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: 'CL',
    dateOfBirth: '',
    documentType: 'RUT',
    documentNumber: '',
  })

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // ✅ DTO EXACTO QUE TU FRONTEND ESPERA
    const payload: RegisterRequest = {
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      country: form.country,
      dateOfBirth: form.dateOfBirth,
      documentType: form.documentType,
      documentNumber: form.documentNumber,
    }

    try {
      await register(payload)
    } catch {
      setError('No se pudo completar el registro')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-center">Crear cuenta</h1>

        {error && (
          <p className="rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <input name="email" type="email" placeholder="Email" required value={form.email} onChange={onChange} className="w-full rounded border p-2" />
        <input name="password" type="password" placeholder="Contraseña" required value={form.password} onChange={onChange} className="w-full rounded border p-2" />
        <input name="firstName" placeholder="Nombre" required value={form.firstName} onChange={onChange} className="w-full rounded border p-2" />
        <input name="lastName" placeholder="Apellido" required value={form.lastName} onChange={onChange} className="w-full rounded border p-2" />
        <input name="phone" placeholder="Teléfono" required value={form.phone} onChange={onChange} className="w-full rounded border p-2" />

        <select name="country" value={form.country} onChange={onChange} className="w-full rounded border p-2">
          <option value="CL">Chile</option>
          <option value="AR">Argentina</option>
        </select>

        <input name="dateOfBirth" type="date" required value={form.dateOfBirth} onChange={onChange} className="w-full rounded border p-2" />

        <select name="documentType" value={form.documentType} onChange={onChange} className="w-full rounded border p-2">
          <option value="RUT">RUT</option>
          <option value="DNI">DNI</option>
        </select>

        <input name="documentNumber" placeholder="Número de documento" required value={form.documentNumber} onChange={onChange} className="w-full rounded border p-2" />

        <button type="submit" disabled={isSubmitting} className="w-full rounded bg-black p-2 text-white disabled:opacity-50">
          {isSubmitting ? 'Registrando…' : 'Registrarse'}
        </button>
      </form>
    </main>
  )
}
