import express from 'express';
import { getCalendarEvents, getMealTimes } from '../services/googleCalendar.js';

export const calendarRouter = express.Router();

// GET /api/calendar/events?startDate=...&endDate=...
calendarRouter.get('/events', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required' });
        }

        const events = await getCalendarEvents(startDate, endDate);
        res.json({ events });
    } catch (error) {
        console.error('Calendar events error:', error);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
});

// GET /api/calendar/meals?date=YYYY-MM-DD
calendarRouter.get('/meals', async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'date is required' });
        }

        const mealTimes = await getMealTimes(date);
        res.json(mealTimes);
    } catch (error) {
        console.error('Meal times error:', error);
        res.status(500).json({ error: 'Failed to fetch meal times' });
    }
});
