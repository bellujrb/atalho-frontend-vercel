import { Skeleton } from '@/components/ui/skeleton';

export function BankSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Header da tabela */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-28" />
      </div>
      
      {/* Linhas da tabela */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-36" />
        </div>
      ))}
      
      {/* Linha adicional para mostrar mais conteúdo */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-40" />
      </div>
    </div>
  );
}

export default BankSkeleton;
