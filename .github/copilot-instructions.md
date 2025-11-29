# Vessel Fresh Water Tank Calculator - Copilot Instructions

## Project Overview
Electron + React desktop application for calculating fresh water tank volumes from sounding measurements. The app includes complete calibration tables for 7 fresh water tanks and automatically calculates volumes in metric tonnes based on sounding inputs in centimeters.

## Technology Stack
- Electron: Desktop application framework
- React: UI framework
- Vite: Build tool
- electron-builder: Create installable packages

## Tank Configuration
- Tank No. 1 Port (0-438 cm, max 62.678 tonnes)
- Tank No. 1 Starboard (0-436 cm, max 62.678 tonnes)
- Tank No. 2 Port/Starboard (0-170 cm, max 10.653 tonnes each)
- Tank No. 3 Port/Starboard (0-180 cm, max 14.212 tonnes each)
- Tank No. 3 Center (0-298 cm, max 21.607 tonnes)

## Development Guidelines
- Sounding data is stored in `src/data/soundingData.js` with 2cm increments
- Linear interpolation is used for values between calibration points
- All soundings input in centimeters (cm)
- All volumes calculated in metric tonnes
- UI shows individual tank volumes, percentages, and total fresh water volume
- Package as installable Windows .exe

## Project Status
✅ Project fully scaffolded and ready for development
✅ All dependencies installed
✅ Complete sounding data tables implemented for all 7 tanks
✅ Fresh water tank calculator UI completed
✅ Ready to run with `npm run electron:dev`
✅ Ready to build installer with `npm run electron:build:win`
