export const ROUTES_CONFIG = {
  PUBLIC: [
    '/',
    '/companies',
    '/erp',
    '/automations',
    '/bancos',
    '/whatsapp',
    '/chat/:id',
  ]
} as const

export function isPublicRoute(pathname: string): boolean {
  return ROUTES_CONFIG.PUBLIC.includes(pathname as any)
}
