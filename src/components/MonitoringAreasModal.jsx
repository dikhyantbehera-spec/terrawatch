import React from 'react';
import {
  MapPin,
  X,
  ArrowRight,
  Satellite,
  Compass,
  AlertTriangle,
  Globe2,
  Calendar,
  Layers
} from 'lucide-react';

export default function MonitoringAreasModal({
  isOpen,
  onClose,
  scenarios = [],
  onSelectScenario
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={styles.modalBody}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}>
              <MapPin size={22} color="var(--emerald-400)" />
            </div>
            <div>
              <h2 style={styles.title}>Global Monitoring Hotspots</h2>
              <p style={styles.subtitle}>
                Curated planetary reference sites with pre-calibrated temporal satellite pairs.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Hotspots Grid */}
        <div style={styles.grid}>
          {scenarios.map((item) => (
            <div key={item.id} className="card card-glow-emerald" style={styles.card}>
              <div style={styles.imageTrio}>
                <div style={styles.imgCol}>
                  <img src={item.imageBefore} alt="Before" style={styles.cardImg} />
                  <span style={styles.imgLabel}>T1: {item.historicalDate}</span>
                </div>
                <div style={styles.vsBadge}>VS</div>
                <div style={styles.imgCol}>
                  <img src={item.imageAfter} alt="After" style={styles.cardImg} />
                  <span style={styles.imgLabel}>T2: {item.recentDate}</span>
                </div>
              </div>

              <div style={styles.contentCol}>
                <div style={styles.categoryRow}>
                  <span className="badge badge-emerald">{item.category}</span>
                  <span style={styles.coords}>
                    <Compass size={12} color="var(--emerald-400)" />
                    {item.coordinates}
                  </span>
                </div>

                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardLocation}>{item.location}</p>
                <p style={styles.cardDesc}>{item.description}</p>

                <button
                  onClick={() => {
                    onSelectScenario(item);
                    onClose();
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '6px' }}
                >
                  <Layers size={14} />
                  <span>Analyze This Area</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalBody: {
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  iconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 800
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px'
  },
  card: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  imageTrio: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative'
  },
  imgCol: {
    flex: 1,
    position: 'relative',
    height: '130px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
    backgroundColor: '#000000'
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imgLabel: {
    position: 'absolute',
    bottom: '4px',
    left: '4px',
    backgroundColor: 'rgba(6, 11, 20, 0.85)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.62rem',
    fontWeight: 700,
    color: 'var(--text-secondary)'
  },
  vsBadge: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-medium)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: 800,
    color: 'var(--emerald-400)',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5
  },
  contentCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  coords: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.7rem',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)'
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  cardLocation: {
    fontSize: '0.76rem',
    color: 'var(--text-secondary)'
  },
  cardDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4
  }
};
