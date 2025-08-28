export function validateCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCNPJ.length !== 14) {
    return false;
  }
  
  if (/^(\d)\1+$/.test(cleanCNPJ)) {
    return false;
  }
  
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  
  if (parseInt(cleanCNPJ.charAt(12)) !== digit) {
    return false;
  }
  
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  
  if (parseInt(cleanCNPJ.charAt(13)) !== digit) {
    return false;
  }
  
  return true;
}

export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCNPJ.length !== 14) {
    return cnpj;
  }
  
  return cleanCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

export function validateCompanyName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

export function validateFullName(name: string): boolean {
  const trimmedName = name.trim();
  return trimmedName.length >= 3 && trimmedName.length <= 100 && trimmedName.includes(' ');
}

export function validateRequestAccess(data: {
  companyName: string;
  purchaserName: string;
  phoneNumber: string;
  email: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!validateCompanyName(data.companyName)) {
    errors.push('Nome da empresa deve ter entre 2 e 100 caracteres');
  }

  if (!validateFullName(data.purchaserName)) {
    errors.push('Nome completo deve ter pelo menos 3 caracteres e incluir sobrenome');
  }

  if (!validatePhone(data.phoneNumber)) {
    errors.push('Telefone deve ter entre 10 e 11 dígitos');
  }

  if (!validateEmail(data.email)) {
    errors.push('Email deve ser válido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateBankName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

export function validateAccountNumber(accountNumber: string): boolean {
  const cleanAccount = accountNumber.replace(/[^\d]/g, '');
  return cleanAccount.length >= 3 && cleanAccount.length <= 20;
}

export function validatePixKey(pixKey: string): boolean {
  return pixKey.trim().length >= 3 && pixKey.trim().length <= 100;
}

export function validateBankIntegration(data: {
  pixKey: string;
  accountNumber: string;
  clientId: string;
  clientSecret: string;
  certification: File | null;
  key: File | null;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!validatePixKey(data.pixKey)) {
    errors.push('Chave PIX deve ter entre 3 e 100 caracteres');
  }

  if (!validateAccountNumber(data.accountNumber)) {
    errors.push('Número da conta deve ter entre 3 e 20 dígitos');
  }

  if (!data.clientId || data.clientId.trim().length < 3) {
    errors.push('Client ID deve ter pelo menos 3 caracteres');
  }

  if (!data.clientSecret || data.clientSecret.trim().length < 3) {
    errors.push('Client Secret deve ter pelo menos 3 caracteres');
  }

  if (!data.certification) {
    errors.push('Certificado é obrigatório');
  }

  if (!data.key) {
    errors.push('Chave é obrigatória');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
