/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
      'upload.wikimedia.org',
      'res.cloudinary.com',
    ],
    formats: ["image/avif", "image/webp"],
  },
  swcMinify: true,
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
};

export default nextConfig;
