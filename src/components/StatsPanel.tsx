import React from 'react';
import './StatsPanel.css';

interface StudentStats {
    id: string;
    name: string;
    group: string;
    tamiCount: number;
    torenCount: number;
    lastTamiDate: string | null;
    lastTorenDate: string | null;
}

interface Props {
    stats: StudentStats[];
}

export const StatsPanel: React.FC<Props> = ({ stats }) => {
    const groupedStats = {
        Sinai: stats.filter(s => s.group === 'Sinai'),
        Ziv: stats.filter(s => s.group === 'Ziv'),
        Nvia: stats.filter(s => s.group === 'Nvia')
    };

    const groupColors: Record<string, string> = {
        Sinai: 'var(--color-sinai)',
        Ziv: 'var(--color-ziv)',
        Nvia: 'var(--color-nvia)'
    };

    const groupNames: Record<string, string> = {
        Sinai: 'סיני',
        Ziv: 'זיו',
        Nvia: 'נביעה'
    };

    return (
        <div className="stats-panel glass-panel" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>📊 סטטיסטיקות תורנויות</h3>

            <div className="stats-grid">
                {Object.entries(groupedStats).map(([group, students]) => (
                    <div key={group} className="group-stats" style={{ borderTop: `3px solid ${groupColors[group]}` }}>
                        <h4 style={{ color: groupColors[group] }}>{groupNames[group]}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>שם</th>
                                    <th>תמ"י</th>
                                    <th>תורן</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.sort((a, b) => b.tamiCount - a.tamiCount).map(student => (
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.tamiCount}</td>
                                        <td>{student.torenCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};
