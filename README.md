# Vessel Fresh Water Tank Calculator

A desktop application built with Electron and React for calculating fresh water tank volumes from sounding measurements.

## Features

- Enter sounding measurements (in cm) for 7 fresh water tanks
- Automatic volume calculation (in metric tonnes) based on calibration tables
- Visual progress bars showing tank capacity percentages
- Total fresh water volume calculation
- Modern, user-friendly interface
- Installable Windows application

## Tank Configuration

The application supports the following fresh water tanks:
- **Tank No. 1 Port** (Max: 438 cm / 62.678 tonnes)
- **Tank No. 1 Starboard** (Max: 436 cm / 62.678 tonnes)
- **Tank No. 2 Port** (Max: 170 cm / 10.653 tonnes)
- **Tank No. 2 Starboard** (Max: 170 cm / 10.653 tonnes)
- **Tank No. 3 Port** (Max: 180 cm / 14.212 tonnes)
- **Tank No. 3 Starboard** (Max: 180 cm / 14.212 tonnes)
- **Tank No. 3 Center** (Max: 298 cm / 21.607 tonnes)

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running in Development Mode

```bash
npm run electron:dev
```

This will start both the Vite dev server and Electron.

### Building for Production

To create an installable Windows executable:

```bash
npm run electron:build:win
```

The installer will be created in the `dist-electron` directory.

## Project Structure

```
vessel-calculator/
├── electron/               # Electron main process files
│   ├── main.js            # Main Electron process
│   └── preload.js         # Preload script
├── src/                   # React application
│   ├── components/        # React components
│   │   ├── TankSoundingForm.jsx
│   │   ├── TankResults.jsx
│   │   └── *.css
│   ├── data/             # Sounding calibration data
│   │   └── soundingData.js
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # React entry point
│   └── *.css             # Styles
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## How to Use

1. Launch the application
2. Enter sounding measurements (in centimeters) for each tank
3. Click "Calculate Volumes" to see results
4. View individual tank volumes and total fresh water capacity
5. Use "Reset All" to clear all fields

## Sounding Data

The application includes complete sounding calibration tables for all tanks with 2cm increments. Linear interpolation is used for values between calibration points.

## License

MIT
