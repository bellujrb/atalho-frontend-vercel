export interface Company {
  id: string;
  name: string;
  description: string;
  taxId: string;
  erpType: string;
  createdAt: string;
}

export interface CompanyAPIResponse {
  companies: Company[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface UpsertCompany {
  name: string;
  taxId: string;
  description?: string;
}

export interface RequestCompanyAccess {
  companyName: string;
  purchaserName: string;
  phoneNumber: string;
  email: string;
}

export interface CompanyListItem {
  id: string;
  name: string;
  displayName: string;
  taxId: string;
  erpType: string;
}

export interface PaginationParams {
  p?: number;
  itemsPerPage?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
