/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_ELECTRON ? 'export' : undefined,
  distDir: process.env.BUILD_ELECTRON ? '.next' : '.next',

  // Used for electron build to ensure static export works correctly
  images: {
    unoptimized: !!process.env.BUILD_ELECTRON,
  },

  // Ensure Next.js handles the app in Electron correctly
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '' : undefined,
  
  // Webpack configuration for Electron compatibility
  webpack: (config, { isServer }) => {
    // Ensure we don't process native modules in Next.js build
    if (!isServer) {
      config.externals = [...(config.externals || []), 'electron'];
    }
    
    // Handle specific file types for Electron
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      type: 'asset/resource',
    });
    
    return config;
  },
};

module.exports = nextConfig; 