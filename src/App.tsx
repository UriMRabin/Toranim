import { useState, useEffect } from 'react';
import { ScheduleBoard } from './components/ScheduleBoard';
import { StatsPanel } from './components/StatsPanel';
import './index.css';

// Backend URL - will be updated after Render deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const fetchSchedule = async (persist = false) => {
    setLoading(true);
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startDate = startOfWeek.toISOString().split('T')[0];
      const url = `${API_URL}/api/schedule?startDate=${startDate}&days=28&persist=${persist}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.schedule) {
        setSchedule(data.schedule);
        setWeekOffset(0);
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
    fetchSchedule(false);
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
      await fetchSchedule(true);
      await fetchStats();
      alert('הלו"ז אושר ונשמר!');
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
            <button className="btn-primary" onClick={() => fetchSchedule(false)} disabled={loading}>
              {loading ? 'טוען...' : 'צור לו"ז חדש 🎲'}
            </button>
            <button className="btn-confirm" onClick={confirmSchedule} disabled={loading}>
              אשר ושמור ✓
            </button>
          </div>
        </div>

        {showStats && <StatsPanel stats={stats} />}

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
