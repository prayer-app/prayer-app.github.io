# Prayer & Praise App - React Version

[![Build and Deploy](https://github.com/your-username/prayer-app.github.io/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/your-username/prayer-app.github.io/actions)

A React-based prayer and praise tracking application that helps you manage prayer requests and record praises.

## Features

- **Prayer Management**: Add, edit, and track prayer requests with follow-up dates
- **Praise Recording**: Log and archive praises
- **Follow-up System**: Track when you've followed up on prayers
- **Status Tracking**: Mark prayers as answered, archived, or active
- **Data Export**: Export your data as JSON backup
- **Responsive Design**: Works on desktop and mobile devices

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Automated Testing**: Runs linting and tests on every commit
- **Build Verification**: Ensures the app builds successfully
- **Deployment**: Automatically deploys to GitHub Pages on main branch
- **Build Artifacts**: Stores build files for 30 days
- **PR Comments**: Provides build status feedback on pull requests

### Build Information

Each build includes:
- Commit SHA
- Branch name
- Build number
- Trigger information
- Build timestamp

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prayer-app.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## Usage

### Adding Prayers
1. Click the "Add Prayer" button (floating action button)
2. Fill in the person's name and prayer request
3. Optionally set a follow-up date
4. Click "Add Prayer"

### Managing Prayers
- **Mark as Answered**: Click the star icon to mark a prayer as answered
- **Edit**: Click the pen icon to edit prayer details
- **Follow-up**: Click the calendar icon to manage follow-up dates
- **Archive**: Click the archive icon to archive a prayer
- **Remove**: Click the X icon to remove a prayer

### Adding Praises
1. Switch to the "Praise" tab
2. Click the "Add Praise" button
3. Enter your praise
4. Click "Add Praise"

### Settings
- **Export Data**: Download a JSON backup of all your data
- **Reset Database**: Clear all prayers and praises (use with caution)

## Data Storage

All data is stored locally in your browser's localStorage. This means:
- Your data stays private and local to your device
- No internet connection required
- Data persists between browser sessions
- You can export your data for backup

## Technology Stack

- **React 18**: Modern React with hooks
- **React Bootstrap**: UI components and styling
- **Bootstrap 5**: CSS framework
- **Bootstrap Icons**: Icon library
- **date-fns**: Date manipulation utilities
- **date-fns-tz**: Timezone support

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.js
│   ├── PrayerList.js
│   ├── PraiseList.js
│   ├── AddPrayerModal.js
│   ├── AddPraiseModal.js
│   ├── SettingsModal.js
│   ├── FollowupModal.js
│   ├── EditPrayerModal.js
│   ├── ConfirmationModal.js
│   └── PrayerDetailsModal.js
├── utils/              # Utility functions
│   ├── storage.js      # localStorage management
│   └── dateUtils.js    # Date formatting utilities
├── assets/             # Static assets
│   ├── images/
│   ├── fonts/
│   ├── css/
│   └── js/
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Migration from Vanilla JavaScript

This React version is a complete rewrite of the original vanilla JavaScript application. The core functionality remains the same, but the codebase is now:

- More maintainable with component-based architecture
- Easier to test with isolated components
- More performant with React's virtual DOM
- Better developer experience with modern tooling

All existing data from the vanilla JavaScript version should be compatible and will be automatically migrated when you first load the React app.
