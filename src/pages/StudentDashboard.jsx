import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useEvents } from '../context/EventContext';
import './StudentDashboard.css';

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

const categoryColors = {
  Technical: '#8b5cf6',
  Cultural: '#f59e0b',
  Sports: '#10b981',
};

function StudentDashboard() {
  const navigate = useNavigate();
  const { approvedEvents, loading, registerEvent, isRegistered, registrations, fetchRegistrations } = useEvents();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showRegistrations, setShowRegistrations] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/'); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'student') { navigate('/'); return; }
    setUser(parsed);
    fetchRegistrations();
  }, [navigate, fetchRegistrations]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleRegister = async (event) => {
    if (isRegistered(event.id)) return;
    const result = await registerEvent(event.id);
    if (result.success) {
      alert(`Registered successfully for "${event.title}"!`);
    } else {
      alert(result.error || 'Registration failed');
    }
  };

  const filteredEvents = approvedEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) return null;

  return (
    <div className="stu-dashboard">
      {/* Navbar */}
      <nav className="stu-nav">
        <div className="stu-nav-brand">🎓 KIIT Event</div>
        <div className="stu-nav-links">
          <button
            className={`stu-nav-tab ${!showRegistrations ? 'active' : ''}`}
            onClick={() => setShowRegistrations(false)}
          >
            Explore Events
          </button>
          <button
            className={`stu-nav-tab ${showRegistrations ? 'active' : ''}`}
            onClick={() => setShowRegistrations(true)}
          >
            My Registrations
            {registrations.length > 0 && (
              <span className="stu-badge">{registrations.length}</span>
            )}
          </button>
        </div>
        <div className="stu-nav-right">
          <span className="stu-nav-user">{user.email}</span>
          <button className="stu-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="stu-main">
        {!showRegistrations ? (
          <>
            {/* Header */}
            <header className="stu-header">
              <h1>Explore Events</h1>
              <p>Discover and register for upcoming campus events</p>
            </header>

            {/* Stats */}
            <div className="stu-stats">
              <div className="stu-stat-card">
                <span className="stu-stat-num">{approvedEvents.length}</span>
                <span className="stu-stat-label">Available Events</span>
              </div>
              <div className="stu-stat-card">
                <span className="stu-stat-num">{registrations.length}</span>
                <span className="stu-stat-label">Registered</span>
              </div>
              <div className="stu-stat-card">
                <span className="stu-stat-num">{categories.length - 1}</span>
                <span className="stu-stat-label">Categories</span>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="stu-toolbar">
              <div className="stu-search-wrap">
                <span className="stu-search-icon">🔍</span>
                <input
                  className="stu-search"
                  type="text"
                  placeholder="Search events by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="stu-filters">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`stu-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="stu-empty">
                <p>Loading events...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="stu-events-grid">
                {filteredEvents.map((event) => {
                  const registered = isRegistered(event.id);
                  return (
                    <div className="stu-event-card" key={event.id}>
                      {event.image && (
                        <div className="stu-event-image">
                          <img src={event.image} alt={event.title} />
                        </div>
                      )}
                      <div className="stu-card-top">
                        <span
                          className="stu-event-tag"
                          style={{ background: categoryColors[event.category] }}
                        >
                          {event.category}
                        </span>
                        <span className="stu-event-date">📅 {event.date}</span>
                      </div>
                      <h3 className="stu-event-title">{event.title}</h3>
                      <p className="stu-event-desc">{event.description}</p>
                      {event.venue && (
                        <p className="stu-event-desc" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                          📍 {event.venue}
                        </p>
                      )}
                      <button
                        className={`stu-register-btn ${registered ? 'registered' : ''}`}
                        onClick={() => handleRegister(event)}
                        disabled={registered}
                      >
                        {registered ? '✓ Registered' : 'Register Now'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="stu-empty">
                <p>No approved events found matching your search.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* My Registrations */}
            <header className="stu-header">
              <h1>My Registrations</h1>
              <p>Events you've registered for</p>
            </header>

            {registrations.length > 0 ? (
              <div className="stu-reg-list">
                {registrations.map((reg) => (
                  <div className="stu-reg-item" key={reg.id}>
                    <div className="stu-reg-left">
                      <span
                        className="stu-reg-dot"
                        style={{ background: categoryColors[reg.category] }}
                      ></span>
                      <div>
                        <h4 className="stu-reg-title">{reg.title}</h4>
                        <p className="stu-reg-meta">
                          {reg.category} &middot; {reg.date}
                        </p>
                      </div>
                    </div>
                    <span className="stu-reg-badge">✓ Registered</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="stu-empty">
                <p>You haven't registered for any events yet.</p>
                <button
                  className="stu-explore-btn"
                  onClick={() => setShowRegistrations(false)}
                >
                  Explore Events
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
