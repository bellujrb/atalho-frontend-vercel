import { auth } from '@clerk/nextjs/server';

export async function getAuthToken(): Promise<string | null> {
  try {
    const { getToken } = await auth();
    return await getToken();
  } catch (error) {
    console.warn('Erro ao obter token de autenticação:', error);
    return null;
  }
}

export async function getAuthUser() {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.warn('Erro ao obter usuário autenticado:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const { userId } = await auth();
    return !!userId;
  } catch (error) {
    console.warn('Erro ao verificar autenticação:', error);
    return false;
  }
}
