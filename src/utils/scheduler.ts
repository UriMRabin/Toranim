import type { DailyShift, GroupName, Student, TamiAssignment } from '../types';
import { STUDENTS_DATA } from '../data/students';

const LUNCH_DUTY_START = "12:30";
const LUNCH_DUTY_END = "15:00";
const DINNER_DUTY_START = "18:00";
const DINNER_DUTY_END = "20:00";

// Helper to convert time string to minutes for comparison
function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function isOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return Math.max(s1, s2) < Math.min(e1, e2);
}

function getNextStudent(students: Student[], lastIndex: number): [Student, number] {
    const nextIndex = (lastIndex + 1) % students.length;
    return [students[nextIndex], nextIndex];
}

// Global state trackers for Round Robin (per group)
// In a real app, this would be persisted. For now, we cycle through the list order.
let groupIndices: Record<GroupName, number> = {
    'Sinai': -1,
    'Ziv': -1,
    'Nvia': -1
};

export function resetScheduler() {
    groupIndices = { 'Sinai': -1, 'Ziv': -1, 'Nvia': -1 };
}

function findReplacement(
    dutyStart: string,
    dutyEnd: string,
    excludedStudentId: string,
    backupPool: Student[] // Usually the rest of the group
): Student | undefined {
    // Find someone who:
    // 1. Is not the excluded student
    // 2. Does NOT overlap with the duty time
    // Strategy: Random pick or Round Robin? 
    // For simplicity: Pick first available random to distribute load? 
    // Or just pick next in list? Next in list might be Tami tomorrow.
    // Better: Pick someone far from being Tami?
    // Simplest: Pick random available.

    const candidates = backupPool.filter(s =>
        s.id !== excludedStudentId &&
        !isOverlapping(s.volunteeringHours.start, s.volunteeringHours.end, dutyStart, dutyEnd)
    );

    if (candidates.length === 0) return undefined;

    // Return random candidate
    return candidates[Math.floor(Math.random() * candidates.length)];
}

export function generateSchedule(startDate: Date, days: number): DailyShift[] {
    const schedule: DailyShift[] = [];
    const studentsByGroup: Record<GroupName, Student[]> = {
        'Sinai': STUDENTS_DATA.filter(s => s.group === 'Sinai'),
        'Ziv': STUDENTS_DATA.filter(s => s.group === 'Ziv'),
        'Nvia': STUDENTS_DATA.filter(s => s.group === 'Nvia'),
    };

    for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dayOfWeek = currentDate.getDay(); // 0-6
        const dateStr = currentDate.toISOString().split('T')[0];

        // Skip weekends? Usually Friday/Saturday might have different rules.
        // User requested "Every day of the week". But usually Mechina has fewer duties on Shabbat?
        // Assuming 7 days a week for now. 

        // Logic for replacements is only relevant on Mon (1) and Wed (3)
        const isVolunteeringDay = dayOfWeek === 1 || dayOfWeek === 3;

        const assignments: any = {};

        (['Sinai', 'Ziv', 'Nvia'] as GroupName[]).forEach(group => {
            // Pick Main Tami
            const [tami, idx] = getNextStudent(studentsByGroup[group], groupIndices[group]);
            groupIndices[group] = idx;

            const assignment: TamiAssignment = {
                main: tami,
                replacements: {}
            };

            // Check Lunch
            if (isVolunteeringDay) {
                // Check Lunch
                if (isOverlapping(tami.volunteeringHours.start, tami.volunteeringHours.end, LUNCH_DUTY_START, LUNCH_DUTY_END)) {
                    assignment.replacements.lunch = findReplacement(LUNCH_DUTY_START, LUNCH_DUTY_END, tami.id, studentsByGroup[group]);
                }
                // Check Dinner
                if (isOverlapping(tami.volunteeringHours.start, tami.volunteeringHours.end, DINNER_DUTY_START, DINNER_DUTY_END)) {
                    assignment.replacements.dinner = findReplacement(DINNER_DUTY_START, DINNER_DUTY_END, tami.id, studentsByGroup[group]);
                }
            }

            assignments[group] = assignment;
        });

        schedule.push({
            date: dateStr,
            dayOfWeek,
            assignments: assignments
        });
    }

    return schedule;
}
