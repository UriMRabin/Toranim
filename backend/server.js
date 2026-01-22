import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { scheduleRouter } from './routes/schedule.js';
import { calendarRouter } from './routes/calendar.js';
import { historyRouter } from './routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/schedule', scheduleRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/history', historyRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
