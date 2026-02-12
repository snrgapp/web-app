/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/inscripcion',
          has: [{ type: 'header', key: 'host', value: 'inscripcion.snrg.lat' }],
        },
        {
          source: '/api/:path*',
          destination: '/api/:path*',
          has: [{ type: 'header', key: 'host', value: 'inscripcion.snrg.lat' }],
        },
        {
          source: '/:path+',
          destination: '/inscripcion/:path*',
          has: [{ type: 'header', key: 'host', value: 'inscripcion.snrg.lat' }],
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
