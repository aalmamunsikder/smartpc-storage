const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const builder = require('electron-builder');

// Constants
const rootDir = path.resolve(__dirname, '..');
const electronDir = path.join(rootDir, 'electron');
const nextDir = path.join(rootDir, '.next');
const distDir = path.join(rootDir, 'dist');

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

// Run electron-builder
console.log('Packaging Electron app...');
builder.build({
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
      target: 'AppImage',
      icon: 'electron/icons/icon.png',
    },
  },
})
.then(() => {
  console.log('Electron build completed successfully!');
})
.catch((err) => {
  console.error('Electron build failed:', err);
  process.exit(1);
}); 