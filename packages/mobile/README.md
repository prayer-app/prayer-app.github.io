# Prayer & Praise Mobile App

A React Native mobile application for tracking prayer requests and giving thanks for answered prayers. This app works alongside the PWA version, sharing the same business logic and data structure.

## Features

- **Prayer Management**: Add, edit, and track prayer requests
- **Follow-up System**: Schedule and manage prayer follow-ups
- **Praise Tracking**: Record and celebrate answered prayers
- **Push Notifications**: Get reminders for follow-ups and daily prayer time
- **Cross-Platform**: Works on both iOS and Android
- **Shared Logic**: Uses the same business logic as the PWA version

## Prerequisites

Before running this app, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **React Native CLI** or **Expo CLI**
- **Xcode** (for iOS development on macOS)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS dependencies)

## Installation

1. **Install dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **iOS Setup** (macOS only):
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Start Metro bundler**:
   ```bash
   npm start
   ```

## Running the App

### iOS
```bash
npm run ios
```
Or open `ios/PrayerPraiseMobile.xcworkspace` in Xcode and run from there.

### Android
```bash
npm run android
```
Make sure you have an Android emulator running or a device connected.

## Project Structure

```
mobile/
├── src/
│   └── screens/
│       ├── PrayerListScreen.js      # Main prayer list view
│       ├── PraiseListScreen.js      # Main praise list view
│       ├── PrayerDetailsScreen.js   # Prayer details and editing
│       ├── PraiseDetailsScreen.js   # Praise details and editing
│       ├── AddPrayerScreen.js       # Add new prayer form
│       ├── AddPraiseScreen.js       # Add new praise form
│       └── SettingsScreen.js        # App settings and notifications
├── App.js                           # Main app component with navigation
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## Shared Business Logic

The mobile app shares business logic with the PWA version through the `../shared/` directory:

- **Storage**: Platform-agnostic storage utilities
- **Date Utils**: Date formatting and manipulation
- **Notifications**: Cross-platform notification service

## Key Dependencies

- **React Navigation**: Navigation between screens
- **React Native Paper**: Material Design components
- **React Native Vector Icons**: Icon library
- **AsyncStorage**: Local data persistence
- **Push Notifications**: Local notifications
- **DateTimePicker**: Date/time selection

## Development Scripts

- `npm start`: Start Metro bundler
- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator
- `npm run clean`: Clean build artifacts
- `npm run pod-install`: Install iOS dependencies

## Configuration

### iOS Configuration

1. Open `ios/PrayerPraiseMobile.xcworkspace` in Xcode
2. Configure your team and bundle identifier
3. Set up push notification capabilities if needed

### Android Configuration

1. Update `android/app/build.gradle` with your application ID
2. Configure signing keys for release builds
3. Set up Firebase for push notifications (optional)

## Building for Production

### iOS
```bash
cd ios
xcodebuild -workspace PrayerPraiseMobile.xcworkspace -scheme PrayerPraiseMobile -configuration Release -destination generic/platform=iOS -archivePath PrayerPraiseMobile.xcarchive archive
```

### Android
```bash
cd android
./gradlew assembleRelease
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npm start -- --reset-cache`
2. **iOS build errors**: Run `cd ios && pod install` and clean build folder
3. **Android build errors**: Clean project with `cd android && ./gradlew clean`

### Dependencies Issues

If you encounter dependency conflicts:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. For iOS, run `cd ios && pod install`

## Contributing

1. Follow the existing code style and patterns
2. Test on both iOS and Android
3. Update documentation for new features
4. Ensure shared logic remains compatible with PWA version

## License

This project is licensed under the ISC License - see the main project README for details.
