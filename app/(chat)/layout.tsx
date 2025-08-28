"use client"

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { ScriptWrapper } from '@/components/script-wrapper';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Carregar o estado da sidebar do localStorage no lado do cliente
    try {
      const sidebarState = localStorage.getItem('sidebar:state');
      const isCollapsed = sidebarState === 'true';
      setIsCollapsed(isCollapsed);
    } catch (error) {
      console.error('Erro ao carregar estado da sidebar:', error);
      setIsCollapsed(false);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Não renderizar até que o estado seja carregado para evitar hidratação
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScriptWrapper />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
