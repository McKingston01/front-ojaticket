# FTM Ticketera - Frontend

Sistema de venta y gestión de entradas - FTM Producciones

## Stack

- Next.js 14+ (App Router)
- TypeScript 5+ (strict, zero any)
- Tailwind CSS
- React Query + Zustand

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar desarrollo
npm run dev
```

Abrir http://localhost:3001

## Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run lint         # ESLint
npm run type-check   # Verificar tipos
```

## Reglas

- ❌ JAMÁS usar `any`
- ✅ TypeScript strict mode
- ✅ Feature-based architecture
- ✅ Zero business logic en frontend
- ✅ DTOs 1:1 con backend

## Estructura

```
src/
├── app/              # Next.js App Router
├── features/         # Features (auth, events, tickets, etc.)
└── shared/           # Código compartido
```

## Autor

Matías Carrión

## Licencia

UNLICENSED - Uso privado FTM Producciones

DEPENDENCIAS 
npm install @tanstack/react-query date-fns

