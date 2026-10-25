import React from 'react';
import {
  Satellite,
  Layers,
  FileText,
  MapPin,
  History,
  Sliders,
  Globe2,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  savedAnalysesCount = 0,
  onOpenDemo,
  onOpenLanding
}) {
  const navItems = [
    {
      id: 'workspace',
      label: 'Change Detection',
      icon: Layers,
      badge: 'Active',
      badgeColor: 'badge-emerald'
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: Globe2
    },
    {
      id: 'reports',
      label: 'Environmental Reports',
      icon: FileText
    },
    {
      id: 'areas',
      label: 'Monitoring Areas',
      icon: MapPin,
      badge: '3 Hotspots',
      badgeColor: 'badge-slate'
    },
    {
      id: 'history',
      label: 'Analysis History',
      icon: History,
      badge: savedAnalysesCount > 0 ? String(savedAnalysesCount) : null,
      badgeColor: 'badge-emerald'
    },
    {
      id: 'settings',
      label: 'Settings & About',
      icon: Sliders
    }
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandContainer}>
        <div style={styles.logoRow}>
          <div style={styles.logoBadge}>
            <Satellite size={22} color="#10b981" />
          </div>
          <div>
            <div style={styles.brandTitle}>
              TERRAWATCH <span style={{ color: '#10b981' }}>AI</span>
            </div>
            <div style={styles.brandSubtitle}>Orbital Intelligence</div>
          </div>
        </div>

        <div style={styles.engineBadge}>
          <div className="radar-dot" />
          <span>Local Canvas Engine Online</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navSectionLabel}>GEOSPATIAL PLATFORM</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navButton,
                ...(isActive ? styles.navButtonActive : {})
              }}
            >
              <div style={styles.navButtonLeft}>
                <Icon
                  size={18}
                  color={isActive ? '#10b981' : '#94a3b8'}
                  style={{ transition: 'color 0.2s' }}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge ${item.badgeColor || 'badge-slate'}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Demo Mode Quick Launch Card */}
      <div style={styles.demoCard}>
        <div style={styles.demoCardHeader}>
          <Sparkles size={16} color="#10b981" />
          <span style={styles.demoCardTitle}>Sample Hotspots</span>
        </div>
        <p style={styles.demoCardText}>
          Explore pre-calibrated multi-spectral change scenarios instantly without uploading.
        </p>
        <button
          onClick={onOpenDemo}
          className="btn btn-primary btn-sm"
          style={{ width: '100%', marginTop: '8px' }}
        >
          <Sparkles size={14} />
          Load Demo Imagery
        </button>
      </div>

      {/* Landing Link & Disclaimer Footer */}
      <div style={styles.footer}>
        <button
          onClick={onOpenLanding}
          style={styles.landingLink}
        >
          <Globe2 size={14} />
          <span>View Public Landing Page</span>
          <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
        </button>

        <div style={styles.footerNotice}>
          <Info size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            Demonstration platform. Pixel changes indicate potential visual shifts.
          </span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    flexShrink: 0,
    zIndex: 20
  },
  brandContainer: {
    padding: '24px 20px 18px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)'
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.08rem',
    letterSpacing: '-0.02em',
    color: '#ffffff'
  },
  brandSubtitle: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  engineBadge: {
    marginTop: '14px',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.72rem',
    color: 'var(--text-secondary)'
  },
  nav: {
    padding: '16px 12px',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  navSectionLabel: {
    fontSize: '0.66rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--text-dim)',
    padding: '6px 10px 4px',
    textTransform: 'uppercase'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.86rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease'
  },
  navButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    color: '#ffffff',
    fontWeight: 600
  },
  navButtonLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  demoCard: {
    margin: '12px 14px',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)'
  },
  demoCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px'
  },
  demoCardTitle: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--emerald-400)'
  },
  demoCardText: {
    fontSize: '0.74rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4
  },
  footer: {
    padding: '14px 14px 20px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  landingLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    fontSize: '0.76rem',
    cursor: 'pointer',
    width: '100%'
  },
  footerNotice: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    fontSize: '0.68rem',
    color: 'var(--text-dim)',
    lineHeight: 1.3
  }
};
