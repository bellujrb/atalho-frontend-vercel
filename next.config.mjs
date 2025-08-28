/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para Next.js 15
  experimental: {
    // Habilitar recursos experimentais do Next.js 15
    serverComponentsExternalPackages: [],
  },
  // Configurações de imagens
  images: {
    unoptimized: true,
  },
}

export default nextConfig
