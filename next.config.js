/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const inscripcionHas = [
      { type: 'header', key: 'host', value: 'inscripcion.snrg.lat' },
    ]
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/inscripcion',
          has: inscripcionHas,
        },
        {
          source: '/api/:path*',
          destination: '/api/:path*',
          has: inscripcionHas,
        },
        {
          source: '/_next/:path*',
          destination: '/_next/:path*',
          has: inscripcionHas,
        },
        {
          source: '/favicon.ico',
          destination: '/favicon.ico',
          has: inscripcionHas,
        },
        {
          source: '/:path+',
          destination: '/inscripcion/:path*',
          has: inscripcionHas,
        },
      ],
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
