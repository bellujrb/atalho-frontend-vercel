import { Skeleton } from "@/components/ui/skeleton";

export function AppLayoutSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
        <Skeleton className="h-8 w-8 rounded-md" />
      </header>

      <div className="flex flex-col items-center justify-center flex-1 p-8">
        {/* Mascote Fin skeleton */}
        <div className="mb-8 relative">
          <div className="relative">
            {/* Imagem do mascote */}
            <Skeleton className="w-40 h-40 rounded-full" />
            
            {/* Efeito de brilho */}
            <div className="absolute inset-0">
              <Skeleton className="w-40 h-40 rounded-full opacity-20" />
            </div>
            
            {/* Partículas flutuantes */}
            <Skeleton className="absolute -top-2 -right-2 w-3 h-3 rounded-full" />
            <Skeleton className="absolute -top-4 -left-2 w-2 h-2 rounded-full" />
            <Skeleton className="absolute -top-6 right-8 w-2.5 h-2.5 rounded-full" />
          </div>
        </div>
        
        {/* Título principal skeleton */}
        <div className="mb-12 max-w-4xl">
          <Skeleton className="h-16 w-full max-w-3xl mx-auto" />
        </div>

        {/* Campo de input skeleton */}
        <div className="w-full max-w-4xl">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm min-h-[120px] p-8">
            <Skeleton className="flex-1 h-8" />
            
            <div className="flex items-center gap-3 px-6">
              {/* Botão Fin-1 skeleton */}
              <Skeleton className="h-8 w-20 rounded-md" />
              
              {/* Botão de envio skeleton */}
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Área inferior skeleton */}
        <div className="flex items-center justify-between w-full max-w-4xl mt-8 px-2">
          {/* Texto beta skeleton */}
          <Skeleton className="h-4 w-80" />
          
          {/* Botão feedback skeleton */}
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default AppLayoutSkeleton;
