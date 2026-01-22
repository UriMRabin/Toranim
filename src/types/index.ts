export type GroupName = 'Sinai' | 'Ziv' | 'Nvia';

export interface VolunteeringHours {
    start: string; // "HH:MM", 24h format
    end: string;   // "HH:MM", 24h format
}

export interface Student {
    id: string; // Unique ID
    name: string;
    group: GroupName;
    volunteeringHours: VolunteeringHours;
}

export interface TamiAssignment {
    main: Student;
    replacements: {
        lunch?: Student;
        dinner?: Student;
    };
}

export interface DailyShift {
    date: string; // "YYYY-MM-DD"
    dayOfWeek: number; // 0=Sun
    assignments: {
        Sinai: TamiAssignment;
        Ziv: TamiAssignment;
        Nvia: TamiAssignment;
    };
}

export interface Schedule {
    [date: string]: DailyShift;
}
