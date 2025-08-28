export interface BankIntegration {
  id: string;
  bankName: string;
  accountNumber: string;
  pixKey: string;
}

export interface BankIntegrationInput {
  pixKey: string;
  accountNumber: string;
  clientId: string;
  clientSecret: string;
  certification: File | null;
  key: File | null;
}

export interface BankIntegrationAPIResponse extends Array<BankIntegration> {}

export interface BankIntegrationListItem {
  id: string;
  bankName: string;
  conta: string;
  pix: string;
}
