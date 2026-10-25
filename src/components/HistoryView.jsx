import React from 'react';
import {
  History,
  Trash2,
  FileText,
  Layers,
  Calendar,
  MapPin,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function HistoryView({
  savedAnalyses = [],
  onLoadIntoWorkspace,
  onViewReport,
  onClearHistory,
  onDeleteItem
}) {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Local Analysis History</h2>
          <p style={styles.subtitle}>
            Archived observation sessions stored locally in your browser (LocalStorage).
          </p>
        </div>

        {savedAnalyses.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all stored analysis history?')) {
                onClearHistory();
              }
            }}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items */}
      {savedAnalyses.length === 0 ? (
        <div className="card" style={styles.emptyCard}>
          <Clock size={40} color="var(--text-dim)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '8px' }}>
            No Analysis Records Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '420px', lineHeight: 1.5 }}>
            Whenever you run image change detection in the workspace, the results are automatically saved here for quick reloading and PDF report generation.
          </p>
        </div>
      ) : (
        <div style={styles.historyList}>
          {savedAnalyses.map((item) => (
            <div key={item.id} className="card card-glow-emerald" style={styles.historyCard}>
              {/* Thumbnail */}
              <div style={styles.thumbWrapper}>
                <img src={item.heatmapImage || item.imageAfter} alt={item.title} style={styles.thumbImg} />
                <span className={`badge ${item.severityBadgeClass || 'badge-red'}`} style={styles.thumbBadge}>
                  {item.changePercentage}% Change
                </span>
              </div>

              {/* Details */}
              <div style={styles.detailsCol}>
                <div style={styles.metaRow}>
                  <span style={styles.savedDate}>{item.savedAt}</span>
                  <span className="badge badge-slate">{item.severity} Severity</span>
                </div>

                <h3 style={styles.itemTitle}>{item.title}</h3>

                <div style={styles.dateCompareRow}>
                  <Calendar size={13} color="var(--emerald-400)" />
                  <span>
                    Baseline: <strong>{item.historicalDate}</strong> → Recent: <strong>{item.recentDate}</strong>
                  </span>
                </div>

                <div style={styles.statsMiniRow}>
                  <span>Pixels Altered: {item.changedPixels ? item.changedPixels.toLocaleString() : 'N/A'}</span>
                  <span>•</span>
                  <span>Sensitivity Threshold: {item.sensitivityUsed || 35}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={styles.actionsCol}>
                <button
                  onClick={() => onLoadIntoWorkspace(item)}
                  className="btn btn-secondary btn-sm"
                  title="Reload this session into the comparison workspace"
                >
                  <Layers size={14} />
                  <span>Inspect in Workspace</span>
                </button>

                <button
                  onClick={() => onViewReport(item)}
                  className="btn btn-primary btn-sm"
                  title="View and download environmental intelligence report"
                >
                  <FileText size={14} />
                  <span>View Report</span>
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#f87171' }}
                  title="Delete this record"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 800
  },
  subtitle: {
    fontSize: '0.84rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  emptyCard: {
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'center'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  historyCard: {
    padding: '18px 22px',
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
    flexWrap: 'wrap'
  },
  thumbWrapper: {
    position: 'relative',
    width: '110px',
    height: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid var(--border-medium)',
    backgroundColor: '#000000',
    flexShrink: 0
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  thumbBadge: {
    position: 'absolute',
    bottom: '4px',
    left: '4px',
    fontSize: '0.66rem',
    padding: '2px 6px'
  },
  detailsCol: {
    flex: 1,
    minWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  savedDate: {
    fontSize: '0.74rem',
    color: 'var(--text-dim)'
  },
  itemTitle: {
    fontSize: '1.04rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  dateCompareRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)'
  },
  statsMiniRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.74rem',
    color: 'var(--text-muted)'
  },
  actionsCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  }
};
