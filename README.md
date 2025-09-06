# Prayer & Praise App

A comprehensive prayer and praise tracking application available as both a Progressive Web App (PWA) and React Native mobile app. Track prayer requests, manage follow-ups, and celebrate answered prayers across all your devices.

## 🌟 Features

### Core Functionality
- **Prayer Management**: Add, edit, and track prayer requests for people you care about
- **Follow-up System**: Schedule and manage prayer follow-ups with reminders
- **Praise Tracking**: Record and celebrate answered prayers and blessings
- **Cross-Platform**: Available as PWA and native mobile apps
- **Offline Support**: Works without internet connection
- **Data Sync**: Shared business logic ensures consistent experience

### PWA Features
- **Progressive Web App**: Install on desktop and mobile browsers
- **Service Worker**: Background sync and offline functionality
- **Push Notifications**: Web-based notifications for reminders
- **Responsive Design**: Optimized for all screen sizes

### Mobile App Features
- **Native Performance**: Smooth animations and native UI components
- **Push Notifications**: Native notifications for iOS and Android
- **Offline Storage**: Local data persistence with AsyncStorage
- **Platform Integration**: Native sharing, date pickers, and more

## 📱 Platforms

### PWA Version
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome, Samsung Internet
- **Installable**: Add to home screen on supported devices

### React Native Version
- **iOS**: iPhone and iPad (iOS 12+)
- **Android**: Android 6.0+ (API level 23+)

## 🚀 Quick Start

### PWA Version
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/prayer-app.github.io.git
   cd prayer-app.github.io
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### React Native Version
1. **Navigate to mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📁 Project Structure

```
prayer-app.github.io/
├── src/                    # PWA source code
│   ├── components/         # React components
│   ├── utils/             # Utilities and services
│   └── assets/            # Images, fonts, styles
├── mobile/                # React Native app
│   ├── src/screens/       # Mobile screens
│   ├── App.js             # Main mobile app
│   └── package.json       # Mobile dependencies
├── shared/                # Shared business logic
│   ├── storage.js         # Cross-platform storage
│   ├── dateUtils.js       # Date utilities
│   └── notifications.js   # Notification service
├── public/                # PWA static assets
├── package.json           # PWA dependencies
└── README.md              # This file
```

## 🔧 Development

### Shared Business Logic
Both versions share core business logic through the `shared/` directory:
- **Storage**: Platform-agnostic data persistence
- **Date Utils**: Consistent date formatting and manipulation
- **Notifications**: Cross-platform notification handling

### PWA Development
- Built with React and Create React App
- Uses Bootstrap for UI components
- Service worker for offline functionality
- Web Push API for notifications

### Mobile Development
- React Native with React Navigation
- React Native Paper for Material Design
- AsyncStorage for local data
- React Native Push Notification for alerts

## 📦 Available Scripts

### PWA Scripts
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Lint code

### Mobile Scripts
- `npm run mobile:ios`: Run on iOS simulator
- `npm run mobile:android`: Run on Android emulator
- `npm run mobile:start`: Start Metro bundler
- `npm run mobile:clean`: Clean build artifacts

## 🔔 Notifications

### PWA Notifications
- Web Push API integration
- Service worker background sync
- Browser-based permission handling

### Mobile Notifications
- Native push notifications
- Local notification scheduling
- Platform-specific channels (Android)

## 🎨 UI/UX Features

### Consistent Design
- Material Design principles
- Responsive layouts
- Accessibility support
- Dark/light theme support (planned)

### Mobile Optimizations
- Touch-friendly interfaces
- Native gestures
- Platform-specific navigation
- Optimized for one-handed use

## 🔒 Data & Privacy

- **Local Storage**: All data stored locally on device
- **No Cloud Sync**: Privacy-focused, no external servers
- **Export/Import**: Backup and restore functionality
- **Data Control**: Full user control over data

## 🛠️ Technology Stack

### PWA
- React 18
- Bootstrap 5
- Service Workers
- Web Push API
- Local Storage

### Mobile
- React Native 0.80
- React Navigation 6
- React Native Paper
- AsyncStorage
- Push Notifications

### Shared
- date-fns
- UUID generation
- Cross-platform utilities

## 📋 Requirements

### PWA
- Modern web browser
- JavaScript enabled
- HTTPS for service worker (production)

### Mobile
- iOS 12+ / Android 6.0+
- React Native development environment
- Xcode (iOS) / Android Studio (Android)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both PWA and mobile
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Test on multiple platforms
- Update documentation
- Ensure shared logic compatibility

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and React Native communities
- Material Design principles
- Open source contributors
- Prayer and faith communities for inspiration

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check the documentation
- Review the troubleshooting guides

---

**Prayer & Praise** - Keeping faith and gratitude organized across all your devices. 🙏✨ 