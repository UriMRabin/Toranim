import express from 'express';
import { generateSchedule } from '../services/scheduler.js';

export const scheduleRouter = express.Router();

// GET /api/schedule?startDate=YYYY-MM-DD&days=7&persist=false
scheduleRouter.get('/', async (req, res) => {
    try {
        const { startDate, days = 7, persist = 'false' } = req.query;

        const start = startDate ? new Date(startDate) : new Date();
        const numDays = parseInt(days, 10);
        const shouldPersist = persist === 'true';

        const schedule = await generateSchedule(start, numDays, shouldPersist);
        res.json({ schedule });
    } catch (error) {
        console.error('Schedule generation error:', error);
        res.status(500).json({ error: 'Failed to generate schedule' });
    }
});

// POST /api/schedule/confirm - Confirm and persist a generated schedule
scheduleRouter.post('/confirm', async (req, res) => {
    try {
        const { startDate, days = 7 } = req.body;

        const start = startDate ? new Date(startDate) : new Date();
        const numDays = parseInt(days, 10);

        // Generate and persist
        const schedule = await generateSchedule(start, numDays, true);
        res.json({ success: true, schedule });
    } catch (error) {
        console.error('Schedule confirmation error:', error);
        res.status(500).json({ error: 'Failed to confirm schedule' });
    }
});
