import express from 'express';
import { loadHistory, saveHistory, updateStudentStats } from '../services/historyService.js';
import { STUDENTS_DATA } from '../data/students.js';

export const historyRouter = express.Router();

// GET /api/history - Get full history
historyRouter.get('/', (req, res) => {
    try {
        const history = loadHistory();
        res.json(history);
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// GET /api/history/stats - Get statistics per student
historyRouter.get('/stats', (req, res) => {
    try {
        const history = loadHistory();

        const stats = STUDENTS_DATA.map(student => ({
            id: student.id,
            name: student.name,
            group: student.group,
            tamiCount: history.tamiCount[student.id] || 0,
            torenCount: history.torenCount[student.id] || 0,
            lastTamiDate: history.lastTamiDate[student.id] || null,
            lastTorenDate: history.lastTorenDate[student.id] || null
        }));

        res.json({ stats });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// POST /api/history/update - Update stats for a student
historyRouter.post('/update', (req, res) => {
    try {
        const { studentId, tamiCount, torenCount } = req.body;

        if (!studentId || tamiCount === undefined || torenCount === undefined) {
             return res.status(400).json({ error: 'Missing required fields' });
        }

        updateStudentStats(studentId, parseInt(tamiCount, 10), parseInt(torenCount, 10));
        res.json({ success: true });
    } catch (error) {
        console.error('Stats update error:', error);
        res.status(500).json({ error: 'Failed to update stats' });
    }
});

// DELETE /api/history/reset - Reset all history (use with caution)
historyRouter.delete('/reset', (req, res) => {
    try {
        saveHistory({
            tamiCount: {},
            torenCount: {},
            lastTamiDate: {},
            lastTorenDate: {},
            schedule: []
        });
        res.json({ success: true, message: 'History reset' });
    } catch (error) {
        console.error('History reset error:', error);
        res.status(500).json({ error: 'Failed to reset history' });
    }
});
