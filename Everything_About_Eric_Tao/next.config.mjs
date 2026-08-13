/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Hostnames only — NOT full URLs. Entries like "http://host:3000" never
  // match, so the origin stays blocked.
  //
  // Dev-only assets are refused for any origin not listed here. The failure is
  // quiet and easy to misread: the HTML still renders, so the page looks fine,
  // but every JS chunk is rejected and React never hydrates — taps do nothing,
  // effects never run, and anything revealed by an effect stays hidden.
  //
  // The wildcard covers this campus range so a new DHCP lease cannot break
  // phone testing again. Widen it if you test from another network.
  allowedDevOrigins: ["localhost", "127.0.0.1", "149.157.*.*"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "ndszsepzvtrxsmzg.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },
}

export default nextConfig
