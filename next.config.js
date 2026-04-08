/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Uber Eats CDN
      {
        protocol: 'https',
        hostname: 'tb-static.uber.com',
      },
      // Glovo CDN
      {
        protocol: 'https',
        hostname: '*.glovo.com',
      },
      // Facebook / Instagram CDN
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
    ],
  },
};

module.exports = nextConfig;
