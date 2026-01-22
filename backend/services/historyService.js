import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_FILE = path.join(__dirname, '..', 'data', 'history.json');

/**
 * Loads the duty history from file
 * @returns {Object} History object with dutyCount and lastDutyDate per student
 */
export function loadHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading history:', error.message);
    }

    // Return default empty history
    return {
        tamiCount: {},      // { "studentId": number }
        torenCount: {},     // { "studentId": number }
        lastTamiDate: {},   // { "studentId": "YYYY-MM-DD" }
        lastTorenDate: {},  // { "studentId": "YYYY-MM-DD" }
        schedule: []        // Array of past assignments
    };
}

/**
 * Saves the duty history to file
 * @param {Object} history - The history object to save
 */
export function saveHistory(history) {
    try {
        const dir = path.dirname(HISTORY_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('Error saving history:', error.message);
        throw error;
    }
}

/**
 * Records a Tami assignment
 * @param {string} studentId 
 * @param {string} date - YYYY-MM-DD
 */
export function recordTami(studentId, date) {
    const history = loadHistory();
    history.tamiCount[studentId] = (history.tamiCount[studentId] || 0) + 1;
    history.lastTamiDate[studentId] = date;
    saveHistory(history);
}

/**
 * Records a Toren (replacement) assignment
 * @param {string} studentId 
 * @param {string} date - YYYY-MM-DD
 */
export function recordToren(studentId, date) {
    const history = loadHistory();
    history.torenCount[studentId] = (history.torenCount[studentId] || 0) + 1;
    history.lastTorenDate[studentId] = date;
    saveHistory(history);
}

/**
 * Gets the Tami count for a student
 * @param {string} studentId 
 * @returns {number}
 */
export function getTamiCount(studentId) {
    const history = loadHistory();
    return history.tamiCount[studentId] || 0;
}

/**
 * Gets the Toren count for a student
 * @param {string} studentId 
 * @returns {number}
 */
export function getTorenCount(studentId) {
    const history = loadHistory();
    return history.torenCount[studentId] || 0;
}
