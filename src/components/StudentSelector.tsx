import React, { useState } from 'react';
import './StudentSelector.css';

interface Student {
    id: string;
    name: string;
    group: string;
}

interface Props {
    students: Student[];
    isOpen: boolean;
    onClose: () => void;
    onSelect: (student: Student) => void;
    currentStudentId?: string;
}

export const StudentSelector: React.FC<Props> = ({ students, isOpen, onClose, onSelect, currentStudentId }) => {
    const [search, setSearch] = useState('');

    if (!isOpen) return null;

    const filteredStudents = students.filter(s =>
        s.name.includes(search) || s.group.includes(search)
    );

    const groupedStudents = {
        Sinai: filteredStudents.filter(s => s.group === 'Sinai'),
        Ziv: filteredStudents.filter(s => s.group === 'Ziv'),
        Nvia: filteredStudents.filter(s => s.group === 'Nvia')
    };

    const groupNames: Record<string, string> = {
        Sinai: 'סיני',
        Ziv: 'זיו',
        Nvia: 'נביעה'
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>בחר חניך</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <input
                    type="text"
                    placeholder="חפש חניך..."
                    className="search-input"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus
                />

                <div className="students-list">
                    {Object.entries(groupedStudents).map(([group, list]) => (
                        list.length > 0 && (
                            <div key={group} className="group-section">
                                <h4>{groupNames[group]}</h4>
                                <div className="students-grid">
                                    {list.map(student => (
                                        <button
                                            key={student.id}
                                            className={`student-btn ${student.id === currentStudentId ? 'active' : ''}`}
                                            onClick={() => onSelect(student)}
                                        >
                                            {student.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};
