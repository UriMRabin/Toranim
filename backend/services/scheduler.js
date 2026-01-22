import { getMealTimes } from './googleCalendar.js';
import { loadHistory, recordTami, recordToren } from './historyService.js';
import { STUDENTS_DATA, getStudentsByGroup } from '../data/students.js';

/**
 * Convert time string to minutes
 */
function timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

/**
 * Check if two time ranges overlap
 */
function isOverlapping(start1, end1, start2, end2) {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return Math.max(s1, s2) < Math.min(e1, e2);
}

/**
 * Check if a student has a conflict with meal duty
 */
function hasConflict(student, mealTime) {
    return isOverlapping(
        student.volunteeringHours.start,
        student.volunteeringHours.end,
        mealTime.start,
        mealTime.end
    );
}

/**
 * Count conflicts for a student on a volunteering day
 */
function countConflicts(student, mealTimes) {
    let conflicts = 0;
    if (hasConflict(student, mealTimes.lunch)) conflicts++;
    if (hasConflict(student, mealTimes.dinner)) conflicts++;
    return conflicts;
}

/**
 * Smart selection: choose candidate with least conflicts, then by least duties
 */
function selectBestTami(candidates, mealTimes, isVolunteeringDay, tamiCounts) {
    if (candidates.length === 0) return null;

    // Sort by: 
    // 1. Conflicts (if volunteering day) - ascending
    // 2. Tami count - ascending  
    // 3. Random tie-break

    const scored = candidates.map(student => ({
        student,
        conflicts: isVolunteeringDay ? countConflicts(student, mealTimes) : 0,
        tamiCount: tamiCounts[student.id] || 0
    }));

    scored.sort((a, b) => {
        // First by conflicts (prefer less conflicts)
        if (a.conflicts !== b.conflicts) return a.conflicts - b.conflicts;
        // Then by tami count (prefer fewer duties)
        if (a.tamiCount !== b.tamiCount) return a.tamiCount - b.tamiCount;
        // Random tie-break
        return Math.random() - 0.5;
    });

    return scored[0].student;
}

/**
 * Find a replacement who is free during the duty time
 */
function findReplacement(excludedStudentId, dutyStart, dutyEnd, groupStudents, torenCounts) {
    const candidates = groupStudents.filter(s =>
        s.id !== excludedStudentId &&
        !isOverlapping(s.volunteeringHours.start, s.volunteeringHours.end, dutyStart, dutyEnd)
    );

    if (candidates.length === 0) return null;

    // Prefer candidate with least toren count
    const scored = candidates.map(s => ({
        student: s,
        torenCount: torenCounts[s.id] || 0
    }));

    scored.sort((a, b) => {
        if (a.torenCount !== b.torenCount) return a.torenCount - b.torenCount;
        return Math.random() - 0.5;
    });

    return scored[0].student;
}

/**
 * Generate schedule for a range of days
 * @param {Date} startDate 
 * @param {number} days 
 * @param {boolean} persist - Whether to save to history
 */
export async function generateSchedule(startDate, days, persist = false) {
    const schedule = [];
    const groups = ['Sinai', 'Ziv', 'Nvia'];

    // Load history once at the start
    const history = loadHistory();
    // Create local copies to track assignments during this generation run
    const tamiCounts = { ...history.tamiCount };
    const torenCounts = { ...history.torenCount };

    for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dayOfWeek = currentDate.getDay();
        const dateStr = currentDate.toISOString().split('T')[0];

        // Monday (1) and Wednesday (3) are volunteering days
        const isVolunteeringDay = dayOfWeek === 1 || dayOfWeek === 3;

        // Get meal times from calendar (or defaults)
        let mealTimes;
        try {
            mealTimes = await getMealTimes(dateStr);
        } catch {
            mealTimes = {
                lunch: { start: '12:30', end: '15:00' },
                dinner: { start: '18:00', end: '20:00' }
            };
        }

        const assignments = {};

        for (const group of groups) {
            const groupStudents = getStudentsByGroup(group);

            // Select best Tami for this day using local counts
            const tami = selectBestTami(groupStudents, mealTimes, isVolunteeringDay, tamiCounts);

            if (!tami) {
                console.error(`No tami found for group ${group} on ${dateStr}`);
                continue;
            }

            // Increment local count immediately so next day sees updated count
            tamiCounts[tami.id] = (tamiCounts[tami.id] || 0) + 1;

            const assignment = {
                main: tami,
                replacements: {}
            };

            // Check for conflicts on volunteering days
            if (isVolunteeringDay) {
                if (hasConflict(tami, mealTimes.lunch)) {
                    const replacement = findReplacement(tami.id, mealTimes.lunch.start, mealTimes.lunch.end, groupStudents, torenCounts);
                    if (replacement) {
                        assignment.replacements.lunch = replacement;
                        // Update replacement count locally
                        torenCounts[replacement.id] = (torenCounts[replacement.id] || 0) + 1;

                        if (persist) recordToren(replacement.id, dateStr);
                    }
                }

                if (hasConflict(tami, mealTimes.dinner)) {
                    const replacement = findReplacement(tami.id, mealTimes.dinner.start, mealTimes.dinner.end, groupStudents, torenCounts);
                    if (replacement) {
                        assignment.replacements.dinner = replacement;
                        // Update replacement count locally
                        torenCounts[replacement.id] = (torenCounts[replacement.id] || 0) + 1;

                        if (persist) recordToren(replacement.id, dateStr);
                    }
                }
            }

            if (persist) recordTami(tami.id, dateStr);
            assignments[group] = assignment;
        }

        schedule.push({
            date: dateStr,
            dayOfWeek,
            mealTimes,
            assignments
        });
    }

    return schedule;
}
