#!/bin/bash

# Prayer & Praise App Installation Script
# This script helps set up the monorepo with all packages

set -e

echo "🙏 Welcome to Prayer & Praise App Setup"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Root dependencies installed successfully"
else
    echo "❌ Failed to install root dependencies"
    exit 1
fi

# Install shared package dependencies
echo ""
echo "🔄 Installing shared package dependencies..."
cd packages/shared
npm install
cd ../..

if [ $? -eq 0 ]; then
    echo "✅ Shared package dependencies installed successfully"
else
    echo "❌ Failed to install shared package dependencies"
    exit 1
fi

# Install web package dependencies
echo ""
echo "🌐 Installing web package dependencies..."
cd packages/web
npm install
cd ../..

if [ $? -eq 0 ]; then
    echo "✅ Web package dependencies installed successfully"
else
    echo "❌ Failed to install web package dependencies"
    exit 1
fi

# Install mobile package dependencies
echo ""
echo "📱 Installing mobile package dependencies..."
cd packages/mobile
npm install

if [ $? -eq 0 ]; then
    echo "✅ Mobile package dependencies installed successfully"
else
    echo "❌ Failed to install mobile package dependencies"
    exit 1
fi

# Check if we're on macOS for iOS setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo ""
    echo "🍎 Setting up iOS dependencies..."
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo "⚠️  CocoaPods not found. Installing..."
        sudo gem install cocoapods
    fi
    
    # Install iOS dependencies
    cd ios
    pod install
    
    if [ $? -eq 0 ]; then
        echo "✅ iOS dependencies installed successfully"
    else
        echo "❌ Failed to install iOS dependencies"
        exit 1
    fi
    
    cd ..
else
    echo "ℹ️  Skipping iOS setup (macOS required)"
fi

cd ../..

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "🚀 Next steps:"
echo ""
echo "🌐 Web (PWA) Version:"
echo "   npm run web:start     # Start development server"
echo "   npm run web:build     # Build for production"
echo "   npm run web:test      # Run tests"
echo "   npm run web:lint      # Lint code"
echo ""
echo "📱 Mobile Version:"
echo "   npm run mobile:start  # Start Metro bundler"
echo "   npm run mobile:ios    # Run on iOS simulator"
echo "   npm run mobile:android # Run on Android emulator"
echo ""
echo "🔄 Shared Package:"
echo "   npm run shared:build  # Build shared package"
echo ""
echo "📦 All Packages:"
echo "   npm run install:all   # Install all dependencies"
echo "   npm run build         # Build all packages"
echo "   npm run test          # Test all packages"
echo "   npm run lint          # Lint all packages"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🙏 Happy praying and praising!" 
echo "🙏 Happy praying and praising!" 