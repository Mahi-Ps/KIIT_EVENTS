import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Dashboard.css';

const sampleEvents = [
  { id: 1, title: 'Hackathon 2026', date: 'May 10', tag: 'Tech', color: '#7c5cfc' },
  { id: 2, title: 'Cultural Night', date: 'May 15', tag: 'Cultural', color: '#f59e0b' },
  { id: 3, title: 'Sports Meet', date: 'May 20', tag: 'Sports', color: '#10b981' },
  { id: 4, title: 'AI Workshop', date: 'Jun 02', tag: 'Tech', color: '#7c5cfc' },
];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      {/* Top Navbar */}
      <nav className="dash-nav">
        <div className="nav-brand">🎓 KIIT Event</div>
        <div className="nav-right">
          <span className="nav-user">{user.email}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dash-main">
        <header className="dash-header">
          <h1>Welcome back 👋</h1>
          <p>Here's what's happening on campus</p>
        </header>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">12</span>
            <span className="stat-label">Upcoming Events</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">3</span>
            <span className="stat-label">Registered</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">5</span>
            <span className="stat-label">Societies</span>
          </div>
        </div>

        {/* Events Grid */}
        <section className="events-section">
          <h2>Upcoming Events</h2>
          <div className="events-grid">
            {sampleEvents.map((event) => (
              <div className="event-card" key={event.id}>
                <div className="event-tag" style={{ background: event.color }}>
                  {event.tag}
                </div>
                <h3>{event.title}</h3>
                <p className="event-date">📅 {event.date}</p>
                <button className="register-btn">Register</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
