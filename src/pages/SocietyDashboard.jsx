import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useEvents } from '../context/EventContext';
import './SocietyDashboard.css';

const categories = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

const statusColors = {
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
};

function SocietyDashboard() {
  const navigate = useNavigate();
  const { events, addEvent, editEvent, deleteEvent } = useEvents();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: '',
    date: '',
    venue: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/'); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'society') { navigate('/'); return; }
    setUser(parsed);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: '', category: '', date: '', venue: '', description: '', image: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.date || !form.venue || !form.description) {
      alert('Please fill all fields');
      return;
    }

    if (editingId) {
      const result = await editEvent(editingId, form);
      if (result.success) {
        resetForm();
      } else {
        alert(result.error || 'Failed to update event');
      }
    } else {
      const result = await addEvent(form);
      if (result.success) {
        resetForm();
      } else {
        alert(result.error || 'Failed to create event');
      }
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      category: event.category,
      date: event.date,
      venue: event.venue,
      description: event.description,
      image: event.image || '',
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (event) => {
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    const result = await deleteEvent(event.id);
    if (!result.success) {
      alert(result.error || 'Failed to delete event');
    }
  };

  if (!user) return null;

  const myEvents = events.filter((e) => e.createdBy === user.email);

  const approved = myEvents.filter((e) => e.status === 'approved').length;
  const pending = myEvents.filter((e) => e.status === 'pending').length;
  const rejected = myEvents.filter((e) => e.status === 'rejected').length;

  return (
    <div className="soc-dashboard">
      {/* Navbar */}
      <nav className="soc-nav">
        <div className="soc-nav-brand">🎓 KIIT Event</div>
        <div className="soc-nav-right">
          <span className="soc-role-badge">Society</span>
          <span className="soc-nav-user">{user.email}</span>
          <button className="soc-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="soc-main">
        {/* Header */}
        <header className="soc-header">
          <div>
            <h1>Society Dashboard 🏛️</h1>
            <p>Create and manage your society's events</p>
          </div>
          <button className="soc-create-btn" onClick={() => {
            if (showForm) { resetForm(); } else { setShowForm(true); }
          }}>
            {showForm ? '✕ Cancel' : '+ Create Event'}
          </button>
        </header>

        {/* Stats */}
        <div className="soc-stats">
          <div className="soc-stat-card">
            <span className="soc-stat-num">{myEvents.length}</span>
            <span className="soc-stat-label">Total Events</span>
          </div>
          <div className="soc-stat-card">
            <span className="soc-stat-num soc-stat-green">{approved}</span>
            <span className="soc-stat-label">Approved</span>
          </div>
          <div className="soc-stat-card">
            <span className="soc-stat-num soc-stat-yellow">{pending}</span>
            <span className="soc-stat-label">Pending</span>
          </div>
          <div className="soc-stat-card">
            <span className="soc-stat-num soc-stat-red">{rejected}</span>
            <span className="soc-stat-label">Rejected</span>
          </div>
        </div>

        {/* Create / Edit Event Form */}
        {showForm && (
          <section className="soc-form-section">
            <h2>{editingId ? 'Edit Event' : 'Create New Event'}</h2>
            <form className="soc-form" onSubmit={handleSubmit}>
              <div className="soc-form-row">
                <div className="soc-form-group">
                  <label>Event Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Hackathon 2026"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="soc-form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="" disabled>Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="soc-form-row">
                <div className="soc-form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="soc-form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    name="venue"
                    placeholder="e.g. Campus 6 Auditorium"
                    value={form.venue}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="soc-form-group soc-form-full">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Describe the event..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              <div className="soc-form-group soc-form-full">
                <label>Poster Image URL <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/poster.jpg"
                  value={form.image}
                  onChange={handleChange}
                />
                {form.image && (
                  <div className="soc-image-preview">
                    <img src={form.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
              <button type="submit" className="soc-submit-btn">
                {editingId ? 'Save Changes' : 'Create Event'}
              </button>
            </form>
          </section>
        )}

        {/* My Events List */}
        <section className="soc-events-section">
          <h2>My Events</h2>
          {myEvents.length === 0 ? (
            <div className="soc-empty">
              <p>No events created yet. Click "Create Event" to get started!</p>
            </div>
          ) : (
            <div className="soc-events-list">
              {myEvents.map((event) => (
                <div className="soc-event-card" key={event.id}>
                  {event.image && (
                    <div className="soc-event-image">
                      <img src={event.image} alt={event.title} />
                    </div>
                  )}
                  <div className="soc-event-body">
                    <div className="soc-event-left">
                      <div className="soc-event-status-dot" style={{ background: statusColors[event.status] }}></div>
                      <div className="soc-event-info">
                        <h3>{event.title}</h3>
                        <p className="soc-event-meta">
                          {event.category} &middot; {event.date} &middot; {event.venue}
                        </p>
                        <p className="soc-event-desc">{event.description}</p>
                        <p className="soc-event-reg-count">👥 {event.registrationCount || 0} students registered</p>
                      </div>
                    </div>
                  <div className="soc-event-right">
                    <span
                      className="soc-event-status"
                      style={{
                        background: `${statusColors[event.status]}20`,
                        color: statusColors[event.status],
                        borderColor: `${statusColors[event.status]}40`,
                      }}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    <div className="soc-event-actions">
                      <button className="soc-edit-btn" onClick={() => handleEdit(event)}>
                        ✏️ Edit
                      </button>
                      <button className="soc-delete-btn" onClick={() => handleDelete(event)}>
                        🗑️ Delete
                      </button>
                    </div>
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

export default SocietyDashboard;
