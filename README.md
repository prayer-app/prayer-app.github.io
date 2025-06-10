# Prayer & Praise

A Progressive Web App (PWA) for managing prayer requests and praises, built with modern web technologies. The application helps users track prayer requests, set follow-up dates, and record praises, with robust timezone handling and offline support.

## Features

- **Prayer Management**
  - Add and track prayer requests
  - Set follow-up dates with timezone support
  - Mark prayers as answered
  - Archive prayers
  - Track follow-up history
  - Automatic date conversion between UTC and local timezone

- **Praise Journal**
  - Record and store praises
  - View praise history
  - Timestamp tracking with timezone support

- **Offline Support**
  - Works without internet connection
  - Syncs when back online
  - Local storage for data persistence

- **Timezone Handling**
  - Automatic timezone detection
  - UTC storage for consistency
  - Local timezone display
  - Proper handling of daylight saving time

## Tech Stack

- **Frontend**
  - HTML5
  - CSS3 (Bootstrap 5)
  - JavaScript (ES6+)
  - Bootstrap Icons
  - jQuery
  - date-fns & date-fns-tz for timezone-aware date handling

- **Build Tools**
  - Webpack 5
  - npm for package management

## Development Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd prayer-praise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development build**
   ```bash
   npm run build:dev
   ```

4. **Production build**
   ```bash
   npm run build:prod
   ```

5. **Watch mode (development)**
   ```bash
   npm run watch
   ```

5. **Serving the HTML files (development)**
   ```bash
   npm run serve
   ```

## Project Structure

```
prayer-praise/
├── assets/
│   ├── dist/          # Compiled files
│   │   ├── css/
│   │   ├── js/
│   │   ├── fonts/
│   │   └── images/
│   └── src/
│       ├── css/
│       ├── js/
│       ├── fonts/
│       └── images/
├── node_modules/
├── index.html
├── service-worker.js
├── webpack.config.js
├── package.json
└── README.md
```

## Date and Timezone Handling

The application uses a robust date handling system:

- **Storage**: All dates are stored in UTC format
- **Display**: Dates are converted to the user's local timezone
- **Conversion**: Uses date-fns-tz for reliable timezone conversions
- **Format**: Consistent date formatting across the application

### Date Functions

- `formatDateForStorage(date)`: Converts local dates to UTC for storage
- `formatDate(dateString)`: Converts UTC dates to local timezone for display
- `localToUTC(date)`: Converts local dates to UTC
- `utcToLocal(utcDate)`: Converts UTC dates to local timezone

## Build Process

The project uses Webpack for bundling and building:

- **Development Build**
  - Generates source maps
  - Uncompressed files
  - Hot reloading support

- **Production Build**
  - Minified files
  - Optimized assets
  - No source maps

## Dependencies

- **Production**
  - bootstrap: ^5.3.0
  - bootstrap-icons: ^1.11.0
  - date-fns: ^2.30.0
  - date-fns-tz: ^2.0.0
  - jquery: ^3.7.0

- **Development**
  - webpack: ^5.89.0
  - webpack-cli: ^5.1.4
  - css-loader: ^6.8.1
  - style-loader: ^3.3.3
  - mini-css-extract-plugin: ^2.7.6
  - copy-webpack-plugin: ^11.0.0

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap team for the amazing UI framework
- date-fns team for the excellent date manipulation library
- All contributors who have helped shape this project 
