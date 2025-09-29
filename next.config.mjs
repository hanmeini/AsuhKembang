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
};

export default nextConfig;
