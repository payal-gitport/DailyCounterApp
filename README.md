# DailyCounterApp

A simple and intuitive React Native mobile application for tracking daily counts and activities, built with Expo.

## Features

- 📊 **Dashboard**: Track and visualize your daily counts
- 🔍 **Explore**: Browse through your tracking history
- 📈 **Summary**: View analytics and statistics with charts
- ⚙️ **Settings**: Customize your app preferences
- 👤 **Profile**: Manage your personal information
- 💬 **Feedback**: Share your thoughts and suggestions
- ❓ **Help**: Access support and documentation

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Charts**: React Native Chart Kit
- **State Management**: React Context API
- **UI**: Custom themed components with dark mode support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/payal-gitport/DailyCounterApp.git
cd DailyCounterApp
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality checks
- `npm run reset-project` - Reset the project to initial state

## Project Structure

```
DailyCounterApp/
├── app/                    # App screens using Expo Router
├── src/
│   ├── navigation/        # Navigation configuration
│   └── screens/           # Screen components
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── constants/             # App constants and theme
├── hooks/                 # Custom React hooks
├── assets/                # Images and static files
├── android/               # Android native code
└── ios/                   # iOS native code
```

## Building for Production

### Android

```bash
npm run android -- --variant release
```

### iOS

```bash
npm run ios -- --configuration Release
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ using React Native and Expo
