import React from 'react';
import {
  Satellite,
  Sparkles,
  MapPin,
  FileText,
  ShieldCheck,
  Download,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function Navbar({
  activeTab,
  onOpenDemo,
  onOpenAreas,
  onOpenReport,
  hasAnalysis,
  metrics,
  isProcessing
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'workspace':
        return 'Change Detection Workspace';
      case 'overview':
        return 'Planetary Intelligence Overview';
      case 'reports':
        return 'Environmental Analysis & Dossiers';
      case 'areas':
        return 'Global Ecological Monitoring Hotspots';
      case 'history':
        return 'Local Analysis History';
      case 'settings':
        return 'Algorithm Configuration & Disclaimers';
      default:
        return 'Satellite Intelligence';
    }
  };

  return (
    <header style={styles.navbar}>
      {/* Title & Status */}
      <div style={styles.titleSection}>
        <div style={styles.breadcrumb}>
          <span>TerraWatch AI</span>
          <span style={styles.crumbDivider}>/</span>
          <span style={styles.currentCrumb}>{getTabTitle()}</span>
        </div>
        <div style={styles.subtitleRow}>
          <div className="radar-dot" />
          <span style={styles.platformStatus}>Multi-temporal Pixel Difference Engine • Ready</span>
          {metrics && (
            <span className={`badge ${metrics.severityBadgeClass}`} style={{ fontSize: '0.72rem' }}>
              {metrics.severity} Change ({metrics.changePercentage}%)
            </span>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div style={styles.actionsSection}>
        <button
          onClick={onOpenDemo}
          className="btn btn-secondary btn-sm"
          title="Instantly load pre-configured satellite change scenarios"
        >
          <Sparkles size={14} color="#10b981" />
          <span>Load Demo Data</span>
        </button>

        <button
          onClick={onOpenAreas}
          className="btn btn-secondary btn-sm"
          title="Browse preset planetary monitoring hotspots"
        >
          <MapPin size={14} color="#38bdf8" />
          <span>Hotspots</span>
        </button>

        {hasAnalysis && (
          <button
            onClick={onOpenReport}
            className="btn btn-primary btn-sm"
            title="Generate and view environmental intelligence dossier"
          >
            <FileText size={14} />
            <span>Generate Report</span>
          </button>
        )}
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    height: 'var(--navbar-height)',
    backgroundColor: 'rgba(10, 17, 32, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    flexShrink: 0,
    zIndex: 15
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  crumbDivider: {
    color: 'var(--text-dim)'
  },
  currentCrumb: {
    color: 'var(--text-primary)',
    fontWeight: 600
  },
  subtitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  platformStatus: {
    fontSize: '0.74rem',
    color: 'var(--text-muted)'
  },
  actionsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }
};
