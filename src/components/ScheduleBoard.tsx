import React from 'react';
import type { DailyShift } from '../types';
import './ScheduleBoard.css';

interface Props {
    schedule: DailyShift[];
    onEditAssignment: (date: string, group: string, role: string, currentId: string) => void;
}

const DAYS_HEBREW = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export const ScheduleBoard: React.FC<Props> = ({ schedule, onEditAssignment }) => {
    return (
        <div className="schedule-grid">
            {schedule.map((day) => (
                <div key={day.date} className="day-card glass-panel">
                    <div className="day-header">
                        <span className="day-name">{DAYS_HEBREW[day.dayOfWeek]}</span>
                        <span className="day-date">{day.date}</span>
                    </div>

                    <div className="groups-list">
                        <GroupRow
                            groupName="סיני"
                            groupId="Sinai"
                            data={day.assignments.Sinai}
                            color="var(--color-sinai)"
                            onEdit={(role, currentId) => onEditAssignment(day.date, 'Sinai', role, currentId)}
                        />
                        <GroupRow
                            groupName="זיו"
                            groupId="Ziv"
                            data={day.assignments.Ziv}
                            color="var(--color-ziv)"
                            onEdit={(role, currentId) => onEditAssignment(day.date, 'Ziv', role, currentId)}
                        />
                        <GroupRow
                            groupName="נביעה"
                            groupId="Nvia"
                            data={day.assignments.Nvia}
                            color="var(--color-nvia)"
                            onEdit={(role, currentId) => onEditAssignment(day.date, 'Nvia', role, currentId)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

interface GroupRowProps {
    groupName: string;
    groupId: string;
    data: any;
    color: string;
    onEdit: (role: string, currentId: string) => void;
}

const GroupRow: React.FC<GroupRowProps> = ({ groupName, data, color, onEdit }) => {
    return (
        <div className="group-row" style={{ borderRight: `4px solid ${color}` }}>
            <div className="group-name" style={{ color }}>{groupName}</div>

            <div
                className="tami-name editable-cell"
                onClick={() => onEdit('main', data.main.id)}
                title="לחץ לעריכה"
            >
                {data.main.name}
            </div>

            {(data.replacements.lunch || data.replacements.dinner) && (
                <div className="replacements">
                    {data.replacements.lunch && (
                        <div
                            className="rep-badge lunch editable-cell"
                            title="מחליף צהריים (לחץ לעריכה)"
                            onClick={() => onEdit('lunch', data.replacements.lunch.id)}
                        >
                            <span>🍽️</span> {data.replacements.lunch.name}
                        </div>
                    )}
                    {data.replacements.dinner && (
                        <div
                            className="rep-badge dinner editable-cell"
                            title="מחליף ערב (לחץ לעריכה)"
                            onClick={() => onEdit('dinner', data.replacements.dinner.id)}
                        >
                            <span>🌙</span> {data.replacements.dinner.name}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
