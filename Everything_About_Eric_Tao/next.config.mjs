/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["http://149.157.37.128:3000", "http://localhost:3000", "http://127.0.0.1:3000"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "ndszsepzvtrxsmzg.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
