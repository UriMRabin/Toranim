import { useState, useEffect } from 'react';
import { ScheduleBoard } from './components/ScheduleBoard';
import { StatsPanel } from './components/StatsPanel';
import { GenerationControls } from './components/GenerationControls';
import './index.css';

// Backend URL - will be updated after Render deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  // lastGenParams is less critical now that we persist current schedule, but kept for fetchSchedule usage
  const [lastGenParams, setLastGenParams] = useState({ days: 28, excludedIds: [] });

  const fetchSchedule = async (days = 28, excludedIds: string[] = [], persist = false) => {
    setLoading(true);
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startDate = startOfWeek.toISOString().split('T')[0];

      const params = new URLSearchParams({
          startDate,
          days: days.toString(),
          persist: persist.toString()
      });

      if (excludedIds.length > 0) {
          params.append('excludedIds', excludedIds.join(','));
      }

      const url = `${API_URL}/api/schedule?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.schedule) {
        setSchedule(data.schedule);
        setWeekOffset(0);
        if (!persist) {
            setLastGenParams({ days, excludedIds });
        }
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      // Fallback message
      alert('לא ניתן להתחבר לשרת. ודא שהשרת פועל.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/history/stats`);
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchSchedule(7); // Default to 1 week on load
    fetchStats();
  }, []);

  const currentWeek = schedule.slice(weekOffset * 7, (weekOffset + 1) * 7);

  const nextWeek = () => {
    if ((weekOffset + 1) * 7 < schedule.length) setWeekOffset(weekOffset + 1);
  };

  const prevWeek = () => {
    if (weekOffset > 0) setWeekOffset(weekOffset - 1);
  };

  const confirmSchedule = async () => {
    if (confirm('האם לאשר ולשמור את הלו"ז הנוכחי? פעולה זו תעדכן את ההיסטוריה.')) {
      setLoading(true);
      try {
          const response = await fetch(`${API_URL}/api/schedule/confirm`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  schedule // Send the current schedule to persist
              })
          });

          if (response.ok) {
              await fetchStats();
              alert('הלו"ז אושר ונשמר!');
          } else {
              alert('שגיאה בשמירת הלו"ז');
          }
      } catch (error) {
          console.error('Error confirming schedule:', error);
          alert('שגיאה בתקשורת עם השרת');
      } finally {
          setLoading(false);
      }
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(88, 166, 255, 0.5)' }}>
          לוח תורנים - מכינת רבין
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>צוות אח"י</p>
      </header>

      <main>
        <GenerationControls
            students={stats} // Using stats as it contains all students
            loading={loading}
            onGenerate={(days, excludedIds) => fetchSchedule(days, excludedIds, false)}
        />

        <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="flex-row">
            <button className="glass-panel" onClick={prevWeek} disabled={weekOffset === 0} style={{ padding: '0.5rem 1rem' }}>
              &rarr; שבוע קודם
            </button>
            <button className="glass-panel" onClick={nextWeek} disabled={(weekOffset + 1) * 7 >= schedule.length} style={{ padding: '0.5rem 1rem' }}>
              שבוע הבא &larr;
            </button>
          </div>
          <div className="flex-row">
            <button className="glass-panel" onClick={() => setShowStats(!showStats)} style={{ padding: '0.5rem 1rem' }}>
              {showStats ? 'הסתר סטטיסטיקות' : 'הצג סטטיסטיקות'} 📊
            </button>
            <button className="btn-confirm" onClick={confirmSchedule} disabled={loading || schedule.length === 0}>
              אשר ושמור ✓
            </button>
          </div>
        </div>

        {showStats && <StatsPanel stats={stats} onStatsUpdate={fetchStats} />}

        <ScheduleBoard schedule={currentWeek} />

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>לוח שנה</h2>
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', height: '600px' }}>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=034130f7e25c66e68c41966fe63c34e1a3501e1c2dc5d01cb5fd24280d6cf76a%40group.calendar.google.com&ctz=Asia%2FJerusalem&mode=WEEK"
              style={{ border: 0, width: '100%', height: '100%' }}
              frameBorder="0"
              scrolling="no">
            </iframe>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
