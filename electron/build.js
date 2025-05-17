const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const builder = require('electron-builder');

// Constants
const rootDir = path.resolve(__dirname, '..');
const electronDir = path.join(rootDir, 'electron');
const nextDir = path.join(rootDir, '.next');
const distDir = path.join(rootDir, 'dist');

// Process command line arguments
const args = process.argv.slice(2);
const isLinuxBuild = args.includes('--linux');
const isWindowsBuild = args.includes('--windows');
const isMacBuild = args.includes('--mac');

// Clean up any previous builds
console.log('Cleaning up previous builds...');
try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
  }
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
} catch (err) {
  console.error('Error cleaning directories:', err);
}

// Build the Next.js app in static export mode
console.log('Building Next.js app...');
try {
  execSync('npm run build', {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, BUILD_ELECTRON: 'true', NODE_ENV: 'production' }
  });
} catch (err) {
  console.error('Next.js build failed:', err);
  process.exit(1);
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(electronDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Created icons directory');
}

// Check if icon file exists, if not create a placeholder
const iconFile = path.join(iconsDir, 'icon.png');
if (!fs.existsSync(iconFile)) {
  console.log('Creating placeholder icon...');
  // Copy a placeholder icon or create a simple one
  try {
    // Try to find an existing icon in the public folder
    if (fs.existsSync(path.join(rootDir, 'public/favicon.ico'))) {
      fs.copyFileSync(
        path.join(rootDir, 'public/favicon.ico'),
        iconFile
      );
    } else {
      console.log('No icon found, skipping...');
    }
  } catch (err) {
    console.error('Error creating icon:', err);
  }
}

// Set up build configuration
const buildConfig = {
  config: {
    appId: 'com.smartpc.desktop',
    productName: 'SmartPC Desktop',
    directories: {
      output: 'dist',
    },
    files: [
      'electron/**/*',
      '.next/**/*',
      'package.json',
    ],
    win: {
      target: 'nsis',
      icon: 'electron/icons/icon.png',
    },
    mac: {
      target: 'dmg',
      icon: 'electron/icons/icon.png',
    },
    linux: {
      target: ['AppImage', 'deb', 'rpm'],
      icon: 'electron/icons/icon.png',
      category: 'Utility',
      desktop: {
        Name: 'SmartPC Storage',
        Comment: 'Cloud Storage Desktop Application',
        Categories: 'Utility;FileManager;Network'
      },
      maintainer: 'SmartPC Storage Team'
    },
  },
};

// Handle build based on target platform
if (isWindowsBuild) {
  console.log('Building only for Windows platforms...');
  // Run electron-builder for Windows
  console.log('Packaging Electron app for Windows...');
  builder.build({
    targets: builder.Platform.WINDOWS.createTarget(),
    config: buildConfig.config
  })
  .then(() => {
    console.log('Electron Windows build completed successfully!');
  })
  .catch((err) => {
    console.error('Electron Windows build failed:', err);
    process.exit(1);
  });
} else if (isLinuxBuild) {
// If Linux build is specified, only build for Linux
  console.log('Building only for Linux platforms...');
  buildConfig.config.mac = undefined;
  buildConfig.config.win = undefined;
  
  // Run electron-builder
  console.log('Packaging Electron app for Linux...');
  builder.build(buildConfig)
  .then(() => {
    console.log('Electron Linux build completed successfully!');
  })
  .catch((err) => {
    console.error('Electron Linux build failed:', err);
    process.exit(1);
  });
} else if (isMacBuild) {
  // If Mac build is specified, only build for Mac
  console.log('Building for macOS platforms...');
  
  // Check if we're on macOS
  const platform = process.platform;
  if (platform !== 'darwin') {
    console.log('');
    console.log('⚠️  ERROR: Cannot build for macOS on a non-macOS platform');
    console.log('');
    console.log('Building for macOS requires:');
    console.log('1. A macOS system (macOS is required for DMG creation and signing)');
    console.log('2. macOS-specific dependencies like "dmg-license"');
    console.log('');
    console.log('Alternative approaches:');
    console.log('- Use a macOS system or VM to build the macOS app');
    console.log('- Use a CI/CD service with macOS runners');
    console.log('- For development testing only, you can use a basic zip package:');
    console.log('  npm run electron:build -- --mac zip');
    console.log('');
    
    process.exit(1);
  }
  
  // Run electron-builder for Mac
  console.log('Packaging Electron app for macOS...');
  builder.build({
    targets: builder.Platform.MAC.createTarget(),
    config: buildConfig.config
  })
  .then(() => {
    console.log('Electron macOS build completed successfully!');
  })
  .catch((err) => {
    console.error('Electron macOS build failed:', err);
    process.exit(1);
  });
} else {
  // Default build for current platform
  console.log('Packaging Electron app for current platform...');
builder.build(buildConfig)
.then(() => {
  console.log('Electron build completed successfully!');
})
.catch((err) => {
  console.error('Electron build failed:', err);
  process.exit(1);
}); 
} 