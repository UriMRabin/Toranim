import React, { useState } from 'react';

interface Student {
    id: string;
    name: string;
    group: string;
}

interface Props {
    students: Student[];
    onGenerate: (days: number, excludedIds: string[]) => void;
    loading: boolean;
}

export const GenerationControls: React.FC<Props> = ({ students, onGenerate, loading }) => {
    const [duration, setDuration] = useState(7);
    const [isCustomDuration, setIsCustomDuration] = useState(false);
    const [excludedIds, setExcludedIds] = useState<string[]>([]);
    const [showExclusions, setShowExclusions] = useState(false);

    const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = parseInt(e.target.value);
        if (val === -1) {
            setIsCustomDuration(true);
            setDuration(1);
        } else {
            setIsCustomDuration(false);
            setDuration(val);
        }
    };

    const toggleExclusion = (id: string) => {
        setExcludedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleGenerate = () => {
        onGenerate(duration, excludedIds);
    };

    // Group students for display
    const groupedStudents: Record<string, Student[]> = {
        Sinai: students.filter(s => s.group === 'Sinai'),
        Ziv: students.filter(s => s.group === 'Ziv'),
        Nvia: students.filter(s => s.group === 'Nvia')
    };

    const groupNames: Record<string, string> = {
        Sinai: 'סיני',
        Ziv: 'זיו',
        Nvia: 'נביעה'
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>⚙️ הגדרות יצירת לו"ז</h3>

            <div className="flex-row" style={{ flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
                {/* Duration Selector */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>משך הלו"ז:</label>
                    <select
                        value={isCustomDuration ? -1 : duration}
                        onChange={handleDurationChange}
                        className="control-input"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                    >
                        <option value={7}>שבוע אחד (7 ימים)</option>
                        <option value={14}>שבועיים (14 ימים)</option>
                        <option value={21}>שלושה שבועות (21 ימים)</option>
                        <option value={28}>ארבעה שבועות (28 ימים)</option>
                        <option value={-1}>מותאם אישית...</option>
                    </select>

                    {isCustomDuration && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <label>מספר ימים: </label>
                            <input
                                type="number"
                                min="1"
                                max="90"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                                style={{ padding: '0.3rem', width: '60px' }}
                            />
                        </div>
                    )}
                </div>

                {/* Exclusion Selector */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        חניכים חסרים ({excludedIds.length})
                    </label>
                    <button
                        className="btn-secondary"
                        onClick={() => setShowExclusions(!showExclusions)}
                        style={{ width: '100%' }}
                    >
                        {showExclusions ? 'סגור רשימה' : 'בחר חניכים לא זמינים...'}
                    </button>

                    {showExclusions && (
                        <div className="exclusion-list" style={{
                            marginTop: '0.5rem',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            padding: '0.5rem',
                            background: 'rgba(0,0,0,0.2)'
                        }}>
                            {Object.entries(groupedStudents).map(([group, groupList]) => (
                                <div key={group} style={{ marginBottom: '0.5rem' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.2rem', color: 'var(--text-muted)' }}>
                                        {groupNames[group]}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.3rem' }}>
                                        {groupList.map(student => (
                                            <label key={student.id} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={excludedIds.includes(student.id)}
                                                    onChange={() => toggleExclusion(student.id)}
                                                    style={{ marginLeft: '0.4rem' }}
                                                />
                                                {student.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div style={{ flex: 0, minWidth: '150px', alignSelf: 'center', marginTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ width: '100%', padding: '0.8rem' }}>
                        {loading ? 'מייצר...' : 'צור לו"ז חדש 🎲'}
                    </button>
                </div>
            </div>
        </div>
    );
};
