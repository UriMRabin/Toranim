# Mechina Scheduler Backend

Backend server for the Rabin Mechina Duty Scheduler.

## Setup

1. Copy `.env.example` to `.env`
2. Add your Google API Key to `.env`
3. Run `npm install`
4. Run `npm start`

## Environment Variables

- `GOOGLE_API_KEY` - Your Google Calendar API key
- `CALENDAR_ID` - The Google Calendar ID  
- `PORT` - Server port (default: 3001)

## Endpoints

- `GET /api/health` - Health check
- `GET /api/schedule?startDate=...&days=7` - Generate schedule
- `POST /api/schedule/confirm` - Confirm and persist schedule
- `GET /api/calendar/meals?date=...` - Get meal times
- `GET /api/history/stats` - Get duty statistics
