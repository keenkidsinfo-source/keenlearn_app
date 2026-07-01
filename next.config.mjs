/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
    ],
  },
  // Allow TurboWarp iframe embedding
  async headers() {
    return [
      {
        source: '/coding/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://turbowarp.org https://coding.keenkidsenrichment.com;",
          },
        ],
      },
    ]
  },
}

export default nextConfig
