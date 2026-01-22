import express from 'express';
import { generateSchedule, persistSchedule } from '../services/scheduler.js';

export const scheduleRouter = express.Router();

// GET /api/schedule?startDate=YYYY-MM-DD&days=7&persist=false&excludedIds=id1,id2
scheduleRouter.get('/', async (req, res) => {
    try {
        const { startDate, days = 7, persist = 'false', excludedIds = '' } = req.query;

        const start = startDate ? new Date(startDate) : new Date();
        const numDays = parseInt(days, 10);
        const shouldPersist = persist === 'true';
        const excludedIdsList = excludedIds ? excludedIds.split(',') : [];

        const schedule = await generateSchedule(start, numDays, shouldPersist, excludedIdsList);
        res.json({ schedule });
    } catch (error) {
        console.error('Schedule generation error:', error);
        res.status(500).json({ error: 'Failed to generate schedule' });
    }
});

// POST /api/schedule/confirm - Confirm and persist a generated schedule
scheduleRouter.post('/confirm', async (req, res) => {
    try {
        const { startDate, days = 7, excludedIds = [], schedule } = req.body;

        if (schedule) {
            // New logic: Persist the provided schedule directly
            await persistSchedule(schedule);
            res.json({ success: true, schedule });
        } else {
            // Old logic: Regenerate and persist (Fallback or legacy support)
            const start = startDate ? new Date(startDate) : new Date();
            const numDays = parseInt(days, 10);
            const newSchedule = await generateSchedule(start, numDays, true, excludedIds);
            res.json({ success: true, schedule: newSchedule });
        }
    } catch (error) {
        console.error('Schedule confirmation error:', error);
        res.status(500).json({ error: 'Failed to confirm schedule' });
    }
});
