import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const calendar = google.calendar({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY
});

const CALENDAR_ID = process.env.CALENDAR_ID;

/**
 * Fetches events from Google Calendar for a date range
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {Promise<Array>} Array of calendar events
 */
export async function getCalendarEvents(startDate, endDate) {
    try {
        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: new Date(startDate).toISOString(),
            timeMax: new Date(endDate).toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });

        return response.data.items || [];
    } catch (error) {
        console.error('Error fetching calendar events:', error.message);
        throw error;
    }
}

/**
 * Parses meal times from calendar events for a specific date
 * @param {string} date - YYYY-MM-DD format
 * @returns {Promise<{lunch: {start: string, end: string}, dinner: {start: string, end: string}}>}
 */
export async function getMealTimes(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await getCalendarEvents(startOfDay.toISOString(), endOfDay.toISOString());

    // Default meal times
    let mealTimes = {
        lunch: { start: '12:30', end: '15:00' },
        dinner: { start: '18:00', end: '20:00' }
    };

    // Look for events with "ארוחת צהריים" or "ארוחת ערב" in the title
    for (const event of events) {
        const title = event.summary?.toLowerCase() || '';

        if (title.includes('צהריים') || title.includes('lunch')) {
            const start = event.start?.dateTime;
            const end = event.end?.dateTime;
            if (start && end) {
                mealTimes.lunch = {
                    start: new Date(start).toTimeString().slice(0, 5),
                    end: new Date(end).toTimeString().slice(0, 5)
                };
            }
        }

        if (title.includes('ערב') || title.includes('dinner')) {
            const start = event.start?.dateTime;
            const end = event.end?.dateTime;
            if (start && end) {
                mealTimes.dinner = {
                    start: new Date(start).toTimeString().slice(0, 5),
                    end: new Date(end).toTimeString().slice(0, 5)
                };
            }
        }
    }

    return mealTimes;
}
