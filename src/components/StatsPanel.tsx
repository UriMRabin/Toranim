import React, { useState } from 'react';
import './StatsPanel.css';

// Backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    onStatsUpdate: () => void;
}

export const StatsPanel: React.FC<Props> = ({ stats, onStatsUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedStats, setEditedStats] = useState<Record<string, { tami: number, toren: number }>>({});

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

    const handleEditChange = (id: string, field: 'tami' | 'toren', value: string) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return;

        setEditedStats(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: numValue
            }
        }));
    };

    const initializeEdit = () => {
        const initial: Record<string, { tami: number, toren: number }> = {};
        stats.forEach(s => {
            initial[s.id] = { tami: s.tamiCount, toren: s.torenCount };
        });
        setEditedStats(initial);
        setEditMode(true);
    };

    const saveChanges = async () => {
        if (!confirm('האם לשמור את השינויים בסטטיסטיקות?')) return;

        try {
            // Save each changed student
            const updates = Object.entries(editedStats).map(async ([id, counts]) => {
                const response = await fetch(`${API_URL}/api/history/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: id,
                        tamiCount: counts.tami,
                        torenCount: counts.toren
                    })
                });
                return response.json();
            });

            await Promise.all(updates);
            setEditMode(false);
            onStatsUpdate(); // Refresh parent
        } catch (error) {
            console.error('Failed to update stats:', error);
            alert('שגיאה בשמירת הנתונים');
        }
    };

    return (
        <div className="stats-panel glass-panel" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>📊 סטטיסטיקות תורנויות</h3>
                <div>
                    {!editMode ? (
                        <button className="btn-secondary" onClick={initializeEdit} style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>
                            ✏️ עריכה
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-primary" onClick={saveChanges} style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>
                                שמור ✓
                            </button>
                            <button className="btn-secondary" onClick={() => setEditMode(false)} style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>
                                ביטול ✕
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
                                        <td>
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    className="stat-input"
                                                    value={editedStats[student.id]?.tami ?? student.tamiCount}
                                                    onChange={(e) => handleEditChange(student.id, 'tami', e.target.value)}
                                                />
                                            ) : (
                                                student.tamiCount
                                            )}
                                        </td>
                                        <td>
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    className="stat-input"
                                                    value={editedStats[student.id]?.toren ?? student.torenCount}
                                                    onChange={(e) => handleEditChange(student.id, 'toren', e.target.value)}
                                                />
                                            ) : (
                                                student.torenCount
                                            )}
                                        </td>
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
