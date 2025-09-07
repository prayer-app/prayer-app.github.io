# Desktop App Setup Guide

## Overview

I've successfully created a desktop version of your Prayer & Praise app using Electron. The desktop app provides:

- **Cross-platform support**: Windows, macOS, and Linux
- **Native file integration**: Enhanced export/import with file dialogs
- **Desktop menu**: Native menus with keyboard shortcuts
- **Offline functionality**: Works without internet connection
- **Shared codebase**: Reuses your existing web app code

## What's Been Created

### 1. Desktop Package Structure
```
packages/desktop/
├── package.json          # Electron app configuration
├── main.js              # Main Electron process
├── preload.js           # Secure bridge for renderer process
├── assets/              # App icons and resources
├── generate-icons.js    # Icon generation script
└── README.md           # Desktop-specific documentation
```

### 2. Enhanced Web App Integration
- `packages/web/src/utils/desktopStorage.js` - Desktop-specific storage utilities
- Updated `packages/web/src/App.js` - Desktop feature integration
- Enhanced export/import functionality with native file dialogs

### 3. Workspace Configuration
- Updated root `package.json` with desktop scripts
- Desktop package included in workspace

## Key Features

### Desktop-Specific Features
- **Native File Dialogs**: Export/import data using system file dialogs
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + E`: Export data
  - `Ctrl/Cmd + I`: Import data
  - `Ctrl/Cmd + Q`: Quit app
- **Desktop Menu**: Native menus with File, Edit, View, Window, and Help options
- **Window Management**: Proper window lifecycle and platform-specific behaviors

### Cross-Platform Build Support
- **Windows**: `.exe` installer and portable executable
- **macOS**: `.dmg` installer and `.zip` archive (Intel + Apple Silicon)
- **Linux**: `.AppImage`, `.deb`, and `.rpm` packages

## Current Status

### ✅ Completed
- Desktop app structure and configuration
- Electron main process with proper security settings
- Preload script for secure IPC communication
- Desktop-specific storage utilities
- Web app integration for desktop features
- Build configuration for all platforms
- Comprehensive documentation

### ⚠️ Pending Setup
- Dependency installation (blocked by React version conflicts)
- Icon generation (SVG template created, needs conversion)
- Testing and validation

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn
- For macOS builds: Xcode Command Line Tools
- For Windows builds: Can build on macOS/Linux
- For Linux builds: Linux with required dependencies

### Step 1: Resolve Dependencies
The current React version conflict needs to be resolved. Options:

**Option A: Update React versions (Recommended)**
```bash
# Update React to 19.x in all packages
cd packages/web && npm install react@^19.1.0 react-dom@^19.1.0
cd ../mobile && npm install react@^19.1.0
```

**Option B: Use legacy peer deps**
```bash
# Install with legacy peer deps
npm install --legacy-peer-deps
```

### Step 2: Install Desktop Dependencies
```bash
cd packages/desktop
npm install
```

### Step 3: Build Web App
```bash
cd ../web
npm install
npm run build
```

### Step 4: Test Desktop App
```bash
cd ../desktop
npm run dev  # Development mode with hot reload
# or
npm start    # Production mode
```

### Step 5: Build Desktop App
```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

## Development Workflow

### Development Mode
```bash
npm run dev
```
This starts the web development server and launches Electron, enabling hot reload.

### Production Testing
```bash
npm run build-web  # Build web app
npm start          # Launch desktop app
```

### Building Distributables
```bash
npm run dist       # Build for current platform
npm run pack       # Package without installer
```

## Architecture

### Security Model
- **Context Isolation**: Enabled for security
- **Node Integration**: Disabled for security
- **Preload Script**: Secure bridge between processes
- **File System Access**: Controlled through IPC

### File Structure
```
packages/desktop/
├── main.js              # Main process (Node.js)
├── preload.js           # Preload script (Node.js)
├── assets/              # Static assets
└── dist/               # Build output (after building)
```

### IPC Communication
- **Main Process** ↔ **Preload Script** ↔ **Renderer Process**
- Secure APIs exposed through `window.electronAPI`
- File operations handled in main process

## Troubleshooting

### Common Issues

1. **Dependency Conflicts**
   - Use `--legacy-peer-deps` flag
   - Update React versions across packages
   - Check for conflicting peer dependencies

2. **Build Failures**
   - Ensure web app is built first
   - Check file permissions
   - Verify icon files exist

3. **Runtime Errors**
   - Check console for error messages
   - Verify preload script is loading
   - Test IPC communication

### Development Tips
- Use DevTools for debugging (View menu)
- Check main process logs in terminal
- Test file operations with small datasets

## Next Steps

1. **Resolve Dependencies**: Fix React version conflicts
2. **Generate Icons**: Convert SVG to PNG/ICO/ICNS formats
3. **Test Functionality**: Verify all features work correctly
4. **Code Signing**: Add code signing for distribution
5. **Auto Updates**: Implement automatic update system
6. **Packaging**: Create installers for distribution

## Distribution

Once built, the desktop app will be available in:
- `packages/desktop/dist/` - Built applications
- Platform-specific installers and packages
- Ready for distribution to users

The desktop app maintains feature parity with your web app while adding native desktop capabilities for a better user experience. 