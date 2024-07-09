/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript:{
      ignoreBuildErrors:true
    }
    images: {
      domains: ['dummyimage.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
          port: '',
          pathname: '/wikipedia/commons/**',
        },
      ],

    },
  };
  
  export default nextConfig;