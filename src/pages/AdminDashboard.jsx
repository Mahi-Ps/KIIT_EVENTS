import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useEvents } from '../context/EventContext';
import './AdminDashboard.css';

const statusColors = {
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
};

const categoryColors = {
  Technical: '#8b5cf6',
  Cultural: '#f59e0b',
  Sports: '#10b981',
  Workshop: '#3b82f6',
  Seminar: '#ec4899',
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { events, approveEvent, rejectEvent, fetchEvents } = useEvents();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/'); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') { navigate('/'); return; }
    setUser(parsed);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((e) => e.status === filter);

  const pending = events.filter((e) => e.status === 'pending').length;
  const approved = events.filter((e) => e.status === 'approved').length;
  const rejected = events.filter((e) => e.status === 'rejected').length;

  return (
    <div className="adm-dashboard">
      {/* Navbar */}
      <nav className="adm-nav">
        <div className="adm-nav-brand">🎓 KIIT Event</div>
        <div className="adm-nav-right">
          <span className="adm-role-badge">Faculty / Admin</span>
          <span className="adm-nav-user">{user.email}</span>
          <button className="adm-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="adm-main">
        {/* Header */}
        <header className="adm-header">
          <h1>Faculty Dashboard ⚙️</h1>
          <p>Review, approve or reject society events</p>
        </header>

        {/* Stats */}
        <div className="adm-stats">
          <div className="adm-stat-card" onClick={() => setFilter('all')}>
            <span className="adm-stat-num">{events.length}</span>
            <span className="adm-stat-label">Total Events</span>
          </div>
          <div className="adm-stat-card" onClick={() => setFilter('pending')}>
            <span className="adm-stat-num adm-stat-yellow">{pending}</span>
            <span className="adm-stat-label">Pending</span>
          </div>
          <div className="adm-stat-card" onClick={() => setFilter('approved')}>
            <span className="adm-stat-num adm-stat-green">{approved}</span>
            <span className="adm-stat-label">Approved</span>
          </div>
          <div className="adm-stat-card" onClick={() => setFilter('rejected')}>
            <span className="adm-stat-num adm-stat-red">{rejected}</span>
            <span className="adm-stat-label">Rejected</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="adm-filter-tabs">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              className={`adm-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Events List */}
        <section className="adm-events-section">
          {filteredEvents.length === 0 ? (
            <div className="adm-empty">
              <p>No {filter === 'all' ? '' : filter} events found.</p>
            </div>
          ) : (
            <div className="adm-events-list">
              {filteredEvents.map((event) => (
                <div className="adm-event-card" key={event.id}>
                  {event.image && (
                    <div className="adm-event-image">
                      <img src={event.image} alt={event.title} />
                    </div>
                  )}
                  <div className="adm-event-top">
                    <div className="adm-event-info">
                      <div className="adm-event-badges">
                        <span
                          className="adm-cat-tag"
                          style={{ background: categoryColors[event.category] || '#6b7280' }}
                        >
                          {event.category}
                        </span>
                        <span
                          className="adm-status-tag"
                          style={{
                            background: `${statusColors[event.status]}20`,
                            color: statusColors[event.status],
                            borderColor: `${statusColors[event.status]}40`,
                          }}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      <h3>{event.title}</h3>
                      <p className="adm-event-meta">
                        📅 {event.date} &nbsp;&middot;&nbsp; 📍 {event.venue}
                      </p>
                      <p className="adm-event-desc">{event.description}</p>
                      <p className="adm-event-reg-count">👥 {event.registrationCount || 0} students registered</p>
                    </div>
                    <div className="adm-event-actions">
                      {event.status === 'pending' && (
                        <>
                          <button
                            className="adm-approve-btn"
                            onClick={async () => {
                              await approveEvent(event.id);
                            }}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="adm-reject-btn"
                            onClick={async () => {
                              await rejectEvent(event.id);
                            }}
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}
                      {event.status === 'approved' && (
                        <span className="adm-done-label">✓ Approved</span>
                      )}
                      {event.status === 'rejected' && (
                        <span className="adm-rejected-label">✕ Rejected</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
