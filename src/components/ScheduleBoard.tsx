import React from 'react';
import type { DailyShift } from '../types';
import './ScheduleBoard.css';

interface Props {
    schedule: DailyShift[];
}

const DAYS_HEBREW = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export const ScheduleBoard: React.FC<Props> = ({ schedule }) => {
    return (
        <div className="schedule-grid">
            {schedule.map((day) => (
                <div key={day.date} className="day-card glass-panel">
                    <div className="day-header">
                        <span className="day-name">{DAYS_HEBREW[day.dayOfWeek]}</span>
                        <span className="day-date">{day.date}</span>
                    </div>

                    <div className="groups-list">
                        <GroupRow groupName="סיני" data={day.assignments.Sinai} color="var(--color-sinai)" />
                        <GroupRow groupName="זיו" data={day.assignments.Ziv} color="var(--color-ziv)" />
                        <GroupRow groupName="נביעה" data={day.assignments.Nvia} color="var(--color-nvia)" />
                    </div>
                </div>
            ))}
        </div>
    );
};

const GroupRow: React.FC<{ groupName: string, data: any, color: string }> = ({ groupName, data, color }) => {
    return (
        <div className="group-row" style={{ borderRight: `4px solid ${color}` }}>
            <div className="group-name" style={{ color }}>{groupName}</div>
            <div className="tami-name">{data.main.name}</div>

            {(data.replacements.lunch || data.replacements.dinner) && (
                <div className="replacements">
                    {data.replacements.lunch && (
                        <div className="rep-badge lunch" title="מחליף צהריים">
                            <span>🍽️</span> {data.replacements.lunch.name}
                        </div>
                    )}
                    {data.replacements.dinner && (
                        <div className="rep-badge dinner" title="מחליף ערב">
                            <span>🌙</span> {data.replacements.dinner.name}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
