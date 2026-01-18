export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          FTM Ticketera
        </h1>
        
        <div className="bg-primary text-secondary p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            ✅ Proyecto Inicializado
          </h2>
          
          <ul className="space-y-2">
            <li>✅ Next.js 14+ (App Router)</li>
            <li>✅ TypeScript estricto (zero any)</li>
            <li>✅ Tailwind CSS</li>
            <li>✅ ESLint configurado</li>
            <li>✅ Estructura feature-based</li>
          </ul>

          <div className="mt-6 pt-6 border-t border-secondary-dark">
            <p className="text-sm">
              Estado: <span className="font-bold">Base configurada</span>
            </p>
            <p className="text-sm mt-2">
              Siguiente: Configurar tipos compartidos y cliente API
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
