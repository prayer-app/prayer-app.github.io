# Prayer & Praise Desktop App

A desktop version of the Prayer & Praise app built with Electron.

## Features

- Cross-platform support (Windows, macOS, Linux)
- Native file system integration for data export/import
- Desktop menu with keyboard shortcuts
- Automatic updates (future feature)
- Offline functionality

## Development

### Prerequisites

- Node.js 16+ 
- npm or yarn
- For macOS builds: Xcode Command Line Tools
- For Windows builds: Windows 10+ (can build on macOS/Linux)
- For Linux builds: Linux with required dependencies

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the web app first:
```bash
cd ../web && npm install && npm run build
```

3. Run in development mode:
```bash
npm run dev
```

This will start the web development server and launch the Electron app.

### Building

#### Build for current platform:
```bash
npm run build
```

#### Build for specific platforms:

**Windows:**
```bash
npm run dist:win
```

**macOS:**
```bash
npm run dist:mac
```

**Linux:**
```bash
npm run dist:linux
```

#### Package without installer:
```bash
npm run pack
```

### Build Outputs

- **Windows**: `.exe` installer and portable `.exe`
- **macOS**: `.dmg` installer and `.zip` archive
- **Linux**: `.AppImage`, `.deb`, and `.rpm` packages

## Desktop Features

### Menu Integration
- File menu with Export/Import data
- Edit menu with standard text operations
- View menu with zoom and developer tools
- Help menu with app information

### Keyboard Shortcuts
- `Ctrl/Cmd + E`: Export data
- `Ctrl/Cmd + I`: Import data
- `Ctrl/Cmd + Q`: Quit app

### File Operations
- Native file dialogs for export/import
- Automatic file format validation
- Error handling and user feedback

## Architecture

The desktop app uses:
- **Electron**: Main process for window management and native APIs
- **Preload Script**: Secure bridge between main and renderer processes
- **Web App**: Existing React app as the renderer process
- **Shared Package**: Common business logic shared with web/mobile

## Troubleshooting

### Common Issues

1. **Build fails**: Ensure web app is built first (`cd ../web && npm run build`)
2. **Icons missing**: Convert the SVG icon to PNG/ICO/ICNS formats
3. **Permission errors**: Check file system permissions for build directory

### Development Tips

- Use `npm run dev` for hot reloading during development
- Check console for error messages
- Use DevTools for debugging (available in View menu)

## Distribution

Built applications are available in the `dist/` directory after building.

For code signing and auto-updates, additional configuration will be needed in the `package.json` build section. 