import { Skeleton } from "@/components/ui/skeleton";

export function CompanySkeleton() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header skeleton */}
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </header>

      {/* Content skeleton */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Companies Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 9 cards de skeleton para simular a grid completa */}
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Nome da empresa */}
                <Skeleton className="h-6 w-32" />
                
                {/* CNPJ */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                
                {/* ERP */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                
                {/* Botão Acessar */}
                <Skeleton className="h-10 w-full rounded-md mt-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </main>
    </div>
  );
}

export default CompanySkeleton;
