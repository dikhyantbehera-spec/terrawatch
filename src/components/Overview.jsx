import React from 'react';
import {
  Satellite,
  Layers,
  MapPin,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  History,
  FileText,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Overview({
  onGoToWorkspace,
  onLoadScenario,
  demoScenarios = [],
  savedAnalyses = [],
  cumulativePixelsAnalyzed = 262144,
  lastMetrics = null
}) {
  return (
    <div style={styles.container}>
      {/* Welcome Banner */}
      <div className="card" style={styles.welcomeBanner}>
        <div style={styles.bannerLeft}>
          <div style={styles.bannerBadge}>
            <div className="radar-dot" />
            <span>OPERATIONAL INTELLIGENCE DASHBOARD</span>
          </div>
          <h1 style={styles.bannerTitle}>
            Welcome to <span style={{ color: 'var(--emerald-400)' }}>TerraWatch AI</span>
          </h1>
          <p style={styles.bannerText}>
            TerraWatch AI empowers researchers, environmental auditors, and civic observers to
            detect landscape shifts using multi-temporal visual pixel divergence. Compare satellite
            and aerial passes to identify potential canopy clearing, urban sprawl, and water line
            desiccation directly in your browser.
          </p>

          <div style={styles.bannerActionRow}>
            <button onClick={onGoToWorkspace} className="btn btn-primary btn-md">
              <Layers size={16} />
              Open Detection Workspace
            </button>
            <span style={styles.demoNoticeBadge}>
              <ShieldCheck size={14} color="#10b981" />
              Demo Data & Local Analysis Engine Active
            </span>
          </div>
        </div>

        <div style={styles.bannerRightWidget}>
          <div style={styles.bannerSatOrb}>
            <Satellite size={48} color="#10b981" />
          </div>
          <div style={styles.satMetrics}>
            <div style={styles.satMetricVal}>SENTINEL-2 / LANDSAT</div>
            <div style={styles.satMetricLabel}>Simulation Spectrum Bands (RGB)</div>
          </div>
        </div>
      </div>

      {/* Statistics Row */}
      <div style={styles.statsGrid}>
        {/* Stat 1 */}
        <div className="card card-glow-emerald" style={styles.statCard}>
          <div style={styles.statTop}>
            <span style={styles.statLabel}>TOTAL PIXELS PROCESSED</span>
            <div style={styles.statIconBadge}>
              <Activity size={18} color="#10b981" />
            </div>
          </div>
          <div style={styles.statNumber}>
            {cumulativePixelsAnalyzed.toLocaleString()}
          </div>
          <div style={styles.statDesc}>
            Calculated across multi-band normalized raster grids (512x512 standard resolution)
          </div>
        </div>

        {/* Stat 2 */}
        <div className="card card-glow-emerald" style={styles.statCard}>
          <div style={styles.statTop}>
            <span style={styles.statLabel}>LATEST POTENTIAL CHANGE</span>
            <div style={{ ...styles.statIconBadge, backgroundColor: 'rgba(239, 68, 68, 0.12)' }}>
              <TrendingDown size={18} color="#ef4444" />
            </div>
          </div>
          <div style={{ ...styles.statNumber, color: lastMetrics ? lastMetrics.severityColor : '#10b981' }}>
            {lastMetrics ? `${lastMetrics.changePercentage}%` : '24.8%'}
          </div>
          <div style={styles.statDesc}>
            {lastMetrics ? `${lastMetrics.severity} visual divergence detected` : 'Sample scenario baseline'}
          </div>
        </div>

        {/* Stat 3 */}
        <div className="card card-glow-emerald" style={styles.statCard}>
          <div style={styles.statTop}>
            <span style={styles.statLabel}>MONITORING HOTSPOTS</span>
            <div style={{ ...styles.statIconBadge, backgroundColor: 'rgba(56, 189, 248, 0.12)' }}>
              <MapPin size={18} color="#38bdf8" />
            </div>
          </div>
          <div style={styles.statNumber}>
            {demoScenarios.length}
          </div>
          <div style={styles.statDesc}>
            Calibrated planetary reference sites (Amazon, Lake Mead, Dubai South)
          </div>
        </div>

        {/* Stat 4 */}
        <div className="card card-glow-emerald" style={styles.statCard}>
          <div style={styles.statTop}>
            <span style={styles.statLabel}>SAVED ANALYSES</span>
            <div style={{ ...styles.statIconBadge, backgroundColor: 'rgba(245, 158, 11, 0.12)' }}>
              <History size={18} color="#f59e0b" />
            </div>
          </div>
          <div style={styles.statNumber}>
            {savedAnalyses.length}
          </div>
          <div style={styles.statDesc}>
            Cached in local browser storage for immediate inspection and PDF export
          </div>
        </div>
      </div>

      {/* Main Grid: Hotspots & Recent Sessions */}
      <div style={styles.mainColumns}>
        {/* Hotspots Section */}
        <div style={{ flex: 1.4 }}>
          <div style={styles.sectionHeadingRow}>
            <div>
              <h2 style={styles.sectionHeading}>Planetary Change Reference Hotspots</h2>
              <p style={styles.sectionSubheading}>
                Pre-configured multi-spectral comparison pairs ready for immediate verification
              </p>
            </div>
            <span className="badge badge-slate">Demonstration Data</span>
          </div>

          <div style={styles.hotspotsList}>
            {demoScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="card card-glow-emerald"
                style={styles.hotspotCard}
                onClick={() => onLoadScenario(scenario)}
              >
                <div style={styles.hotspotThumbs}>
                  <img src={scenario.imageBefore} alt="Before" style={styles.thumbImg} />
                  <div style={styles.thumbDivider}>VS</div>
                  <img src={scenario.imageAfter} alt="After" style={styles.thumbImg} />
                </div>

                <div style={styles.hotspotInfo}>
                  <div style={styles.hotspotCategory}>
                    <span className="badge badge-emerald">{scenario.category}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      {scenario.historicalDate} → {scenario.recentDate}
                    </span>
                  </div>
                  <h3 style={styles.hotspotTitle}>{scenario.title}</h3>
                  <div style={styles.hotspotLoc}>
                    <MapPin size={12} color="var(--emerald-400)" />
                    <span>{scenario.location} ({scenario.coordinates})</span>
                  </div>
                  <p style={styles.hotspotDesc}>{scenario.description}</p>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={styles.hotspotLaunchBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadScenario(scenario);
                  }}
                >
                  <span>Launch in Workspace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Recent History & Guidance */}
        <div style={{ flex: 1 }}>
          <div style={styles.sectionHeadingRow}>
            <div>
              <h2 style={styles.sectionHeading}>Recent Activity</h2>
              <p style={styles.sectionSubheading}>Sessions saved in local storage</p>
            </div>
          </div>

          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {savedAnalyses.length === 0 ? (
              <div style={styles.emptyHistoryBox}>
                <Clock size={28} color="var(--text-dim)" />
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No saved analyses yet. Process any image pair in the workspace to record history.
                </p>
                <button
                  onClick={onGoToWorkspace}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '8px' }}
                >
                  Open Workspace
                </button>
              </div>
            ) : (
              savedAnalyses.slice(0, 4).map((item, idx) => (
                <div key={idx} style={styles.historyRowItem}>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {item.historicalDate} → {item.recentDate}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${item.severityBadgeClass || 'badge-red'}`}>
                      {item.changePercentage}% Change
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      {item.savedAt}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Environmental Method Guidance Box */}
          <div className="card" style={{ marginTop: '20px', padding: '18px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={18} color="#10b981" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--emerald-400)' }}>
                Ethical Observation Guidelines
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Pixel differences reflect optical divergence and are labelled as <strong>potential visual change</strong>.
              Always pair findings with ground truth verification or official multispectral Sentinel-2 L2A data before
              drawing definitive environmental conclusions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  welcomeBanner: {
    padding: '32px 36px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(15, 25, 44, 0.9) 0%, rgba(10, 20, 36, 0.95) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    gap: '30px',
    flexWrap: 'wrap'
  },
  bannerLeft: {
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  bannerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.74rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'var(--emerald-400)'
  },
  bannerTitle: {
    fontSize: '2.1rem',
    fontWeight: 800,
    letterSpacing: '-0.02em'
  },
  bannerText: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6
  },
  bannerActionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '6px'
  },
  demoNoticeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.78rem',
    color: 'var(--text-muted)'
  },
  bannerRightWidget: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 30px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'rgba(6, 11, 20, 0.6)',
    border: '1px solid var(--border-subtle)',
    textAlign: 'center',
    minWidth: '220px'
  },
  bannerSatOrb: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 24px rgba(16, 185, 129, 0.25)',
    marginBottom: '14px'
  },
  satMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  satMetricVal: {
    fontSize: '0.84rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  satMetricLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px'
  },
  statCard: {
    padding: '22px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'var(--text-dim)'
  },
  statIconBadge: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statNumber: {
    fontSize: '1.9rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    color: '#ffffff'
  },
  statDesc: {
    fontSize: '0.76rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4
  },
  mainColumns: {
    display: 'flex',
    gap: '28px',
    flexWrap: 'wrap'
  },
  sectionHeadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  sectionHeading: {
    fontSize: '1.25rem',
    fontWeight: 700
  },
  sectionSubheading: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  hotspotsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  hotspotCard: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    cursor: 'pointer',
    flexWrap: 'wrap'
  },
  hotspotThumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    flexShrink: 0
  },
  thumbImg: {
    width: '68px',
    height: '68px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid var(--border-medium)'
  },
  thumbDivider: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(6, 11, 20, 0.9)',
    border: '1px solid var(--border-subtle)',
    fontSize: '0.62rem',
    fontWeight: 800,
    color: 'var(--emerald-400)',
    padding: '2px 5px',
    borderRadius: '4px'
  },
  hotspotInfo: {
    flex: 1,
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  hotspotCategory: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  hotspotTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  hotspotLoc: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.74rem',
    color: 'var(--text-secondary)'
  },
  hotspotDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: 1.35
  },
  hotspotLaunchBtn: {
    flexShrink: 0
  },
  emptyHistoryBox: {
    padding: '36px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  historyRowItem: {
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};
