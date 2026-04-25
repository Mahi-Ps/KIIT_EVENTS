import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import './Layout.css';

const sidebarItems = {
  society: [
    { icon: '📊', label: 'Dashboard', section: 'dashboard' },
    { icon: '📅', label: 'My Events', section: 'events' },
    { icon: '➕', label: 'Create Event', section: 'create' },
  ],
  admin: [
    { icon: '📊', label: 'Dashboard', section: 'dashboard' },
    { icon: '📅', label: 'All Events', section: 'events' },
    { icon: '⏳', label: 'Pending', section: 'pending' },
  ],
  student: [
    { icon: '🔍', label: 'Explore Events', section: 'explore' },
    { icon: '📋', label: 'My Registrations', section: 'registrations' },
  ],
};

const roleLabels = {
  society: 'Society',
  admin: 'Faculty / Admin',
  student: 'Student',
};

export default function Layout({ children, user, activeSection, onSectionChange }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const items = sidebarItems[user?.role] || [];

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">🎓</span>
          <span className="sidebar-title">KIIT Events</span>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => (
            <button
              key={item.section}
              className={`sidebar-link ${activeSection === item.section ? 'active' : ''}`}
              onClick={() => {
                onSectionChange?.(item.section);
                setSidebarOpen(false);
              }}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-link-icon">🚪</span>
            <span className="sidebar-link-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="layout-main">
        {/* Topbar */}
        <header className="topbar">
          <button className="topbar-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span></span><span></span><span></span>
          </button>
          <div className="topbar-left">
            <h2 className="topbar-page-title">
              {roleLabels[user?.role] || 'Dashboard'}
            </h2>
          </div>
          <div className="topbar-right">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="topbar-user">
              <div className="topbar-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="topbar-user-info">
                <span className="topbar-user-email">{user?.email}</span>
                <span className="topbar-user-role">{roleLabels[user?.role]}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}
