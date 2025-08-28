'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CompanyListItem } from '@/types/company';
import { chatService } from '@/services/chat.service';
import { useRouter } from 'next/navigation';

interface AppContextType {
  selectedCompany: CompanyListItem | null;
  selectCompany: (company: CompanyListItem) => void;
  clearSelectedCompany: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}

export function useSelectedCompany() {
  const { selectedCompany, selectCompany, clearSelectedCompany } = useAppContext();
  return { selectedCompany, selectCompany, clearSelectedCompany };
}

interface AppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyListItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCompany = localStorage.getItem('selectedCompany');
    if (storedCompany) {
      try {
        const company = JSON.parse(storedCompany);
        setSelectedCompany(company);
      } catch (error) {
        console.error('Erro ao carregar empresa selecionada:', error);
        localStorage.removeItem('selectedCompany');
      }
    }
    setIsLoaded(true);
  }, []);

  const selectCompany = (company: CompanyListItem) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
  };

  const clearSelectedCompany = () => {
    setSelectedCompany(null);
    localStorage.removeItem('selectedCompany');
  };

  const contextValue: AppContextType = {
    selectedCompany: isLoaded ? selectedCompany : null,
    selectCompany,
    clearSelectedCompany,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
