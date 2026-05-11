# Smart Waste Bin Monitor

A React Native Expo app for monitoring an AI-powered waste bin that segregates waste into four compartments (Plastic, Paper, Metal, Others). This prototype uses mock data and is structured for easy database integration later.

## Features

### Landing Page
- Green-themed eco-friendly UI with gradient background
- Two login options: Client and Admin
- Welcome message and app description

### Login System
- Secure credential validation
- Test credentials:
  - **Client**: Username: `CLIENT@2000`, Password: `Client@2004`
  - **Admin**: Username: `ADMIN@2000`, Password: `Admin@2004`

### Client Dashboard (View-Only)
- Real-time circular progress bars showing fill levels (0-100%) for each compartment
- Color-coded compartments:
  - Plastic (Blue)
  - Paper (Green)
  - Metal (Orange)
  - Others (Gray)
- Status indicators (No issues, Attention Required, Jam Detected)
- Push notifications for high levels (>80%) and jams
- View history of events
- View-only settings display

### Admin Dashboard (Full Control)
- All Client Dashboard features plus:
- Empty compartment buttons (reset to 0%)
- Bin selector (switch between Bin A, B, and C)
- Adjustable thresholds for each compartment
- Export report functionality
- Real-time mock data updates every 5 seconds

### History Screen
- Chronological list of events with timestamps
- Color-coded event types:
  - Info (Blue)
  - Warning (Orange)
  - Error (Red)
- Automatic event generation for testing
- Relative time display (e.g., "2h ago")

### Mock Data Simulation
- Levels change ±10% every 5 seconds
- Random jam detection (higher probability when >85%)
- Automatic notifications for threshold breaches and jams
- Three pre-configured bins with different starting states

## Project Structure

```
project/
├── app/
│   ├── _layout.tsx              # Root navigation layout
│   ├── index.tsx                # Landing page
│   ├── login.tsx                # Login screen
│   ├── client-dashboard.tsx     # Client dashboard
│   ├── admin-dashboard.tsx      # Admin dashboard
│   └── history.tsx              # Event history
├── components/
│   └── CircularProgress.tsx     # Reusable circular progress component
├── utils/
│   ├── mockData.ts              # Mock data and update logic
│   └── notifications.ts         # Notification setup and functions
└── assets/
    └── images/                  # App icons and images
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Run on specific platform:
- **Web**: Press `w` in the terminal
- **iOS Simulator**: Press `i` (macOS only)
- **Android Emulator**: Press `a` (requires Android Studio setup)

## Testing the App

### Login Credentials
Use these credentials to access different dashboards:

**Client Access** (View-Only):
- Username: `CLIENT@2000`
- Password: `Client@2004`

**Admin Access** (Full Control):
- Username: `ADMIN@2000`
- Password: `Admin@2004`

### What to Test

1. **Landing Page**
   - Navigate to Client/Admin login
   - Observe the green eco-friendly theme

2. **Login**
   - Try invalid credentials (should show error)
   - Login with valid credentials

3. **Client Dashboard**
   - Watch circular progress bars update every 5 seconds
   - Observe jam warnings when they occur
   - Check notifications icon for alerts
   - Navigate to History screen
   - View settings (read-only)

4. **Admin Dashboard**
   - Switch between Bin A, B, and C
   - Empty compartments using the Empty button
   - Adjust thresholds in Settings
   - Export report to see current status
   - Navigate to History screen

5. **History Screen**
   - View chronological events
   - Watch new events appear automatically
   - Check event types and timestamps

6. **Notifications**
   - Wait for levels to exceed thresholds
   - Check for notification alerts
   - Observe jam detection notifications

## Mock Data Behavior

The app simulates real-time updates:
- **Update Interval**: Every 5 seconds
- **Level Changes**: ±10% random variation
- **Jam Probability**: 2% normally, 10% when level >85%
- **Notifications**: Triggered when level crosses threshold or jam occurs

## Future Integration

The app is structured for easy Firebase/Supabase integration:

1. Replace mock data in `utils/mockData.ts` with API calls
2. Connect authentication in `app/login.tsx`
3. Set up real-time listeners for bin status updates
4. Connect notification system to backend alerts
5. Store history events in database
6. Add user management for multiple clients

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development and build tooling
- **Expo Router**: File-based navigation
- **React Native SVG**: Circular progress graphics
- **Expo Notifications**: Local push notifications
- **Lucide React Native**: Icon library
- **Expo Linear Gradient**: Green-themed gradients

## Design Features

- Green eco-friendly color scheme (#2E7D32, #4CAF50, #66BB6A)
- Smooth animations and transitions
- Responsive layout for different screen sizes
- Material Design inspired UI elements
- Shadow effects and elevation for depth
- Clear visual hierarchy

## Troubleshooting

### Common Issues

**Dependencies not installing:**
```bash
npm cache clean --force
npm install
```

**Build errors:**
```bash
npm run build:web
```

**Notifications not working:**
- Ensure notification permissions are granted
- Check device/emulator notification settings
- For web, notifications may be limited

**Navigation errors:**
- Clear Metro bundler cache: Press `r` in terminal
- Restart development server

## Scripts

- `npm run dev` - Start development server
- `npm run build:web` - Build for web platform
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## License

This is a prototype application for demonstration purposes.

## Support

For issues or questions, refer to:
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Router Documentation](https://expo.github.io/router)
