import React, { useState } from 'react';
import {
  Flame,
  Layers,
  Sliders,
  Info,
  Activity,
  AlertTriangle,
  Eye,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function HeatmapViewer({
  heatmapImage,
  imageAfter,
  metrics,
  sensitivity,
  onSensitivityChange,
  isRecalculating = false
}) {
  const [blendOpacity, setBlendOpacity] = useState(85);
  const [viewStyle, setViewStyle] = useState('heatmap-pure'); // 'heatmap-pure' | 'heatmap-blend'

  if (!metrics) {
    return (
      <div className="card" style={styles.placeholderCard}>
        <Activity size={32} color="var(--text-dim)" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Run change detection on uploaded or demo images to view the spectral difference heatmap.
        </p>
      </div>
    );
  }

  const {
    totalPixels = 262144,
    changedPixels = 0,
    unchangedPixels = totalPixels - changedPixels,
    changePercentage = 0,
    unchangedPercentage = Number((100 - changePercentage).toFixed(2)),
    visualChangeCategory = metrics.visualChangeCategory || metrics.severity || 'Low Visual Difference',
    visualChangeCategoryColor = metrics.visualChangeCategoryColor || metrics.severityColor || '#3b82f6',
    visualChangeCategoryBadgeClass = metrics.visualChangeCategoryBadgeClass || metrics.severityBadgeClass || 'badge-blue',
    visualChangeCategoryExplanation = metrics.visualChangeCategoryExplanation,
    environmentalClassificationStatus = metrics.environmentalClassificationStatus || 'Environmental categories have not been independently classified.',
    comparisonDimensions = metrics.comparisonDimensions || '512 × 512 pixels',
    highDifferencePixels = metrics.highDifferencePixels || metrics.highSeverityPixels || 0,
    moderateDifferencePixels = metrics.moderateDifferencePixels || metrics.moderateSeverityPixels || 0,
    minorDifferencePixels = metrics.minorDifferencePixels || metrics.lowSeverityPixels || 0,
  } = metrics;

  return (
    <div className="card" style={styles.cardContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitleGroup}>
          <div style={styles.flameIconBox}>
            <Flame size={20} color="#ef4444" />
          </div>
          <div>
            <h3 style={styles.title}>Visual Change Detection Heatmap</h3>
            <p style={styles.subtitle}>Algorithmic chromatic and luminance divergence isolation ({comparisonDimensions})</p>
          </div>
        </div>

        {/* Visual Change Category Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${visualChangeCategoryBadgeClass}`} style={{ fontSize: '0.84rem', padding: '6px 14px' }}>
            {visualChangeCategory} ({changePercentage}%)
          </span>
        </div>
      </div>

      {/* Pixel Analysis Metrics Row */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>TOTAL PIXELS ANALYZED</span>
          <span style={styles.metricVal}>{totalPixels.toLocaleString()}</span>
          <span style={styles.metricSub}>{comparisonDimensions}</span>
        </div>
        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>CHANGED PIXELS</span>
          <span style={{ ...styles.metricVal, color: '#ef4444' }}>{changedPixels.toLocaleString()}</span>
          <span style={styles.metricSub}>{changePercentage}% flagged change</span>
        </div>
        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>UNCHANGED PIXELS</span>
          <span style={{ ...styles.metricVal, color: 'var(--emerald-400)' }}>{unchangedPixels.toLocaleString()}</span>
          <span style={styles.metricSub}>{unchangedPercentage}% unchanged</span>
        </div>
        <div style={styles.metricItem}>
          <span style={styles.metricLabel}>VISUAL CHANGE CATEGORY</span>
          <span style={{ ...styles.metricVal, fontSize: '0.98rem', color: visualChangeCategoryColor }}>
            {visualChangeCategory}
          </span>
          <span style={styles.metricSub}>Screening classification</span>
        </div>
      </div>

      {/* Invariant & Disclaimer Strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', backgroundColor: 'rgba(6, 11, 20, 0.4)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
        <div>
          <strong>Pixel Analysis Relation:</strong> Analyzed Pixels ({totalPixels.toLocaleString()}) = Changed Pixels ({changedPixels.toLocaleString()}) + Unchanged Pixels ({unchangedPixels.toLocaleString()})
        </div>
        <div style={{ color: '#fbbf24' }}>
          <strong>Notice:</strong> {environmentalClassificationStatus}
        </div>
      </div>

      {/* Heatmap Display & Controls */}
      <div style={styles.viewportSection}>
        {/* View Mode & Opacity Controls */}
        <div style={styles.heatmapControlsBar}>
          <div style={styles.viewToggleGroup}>
            <button
              onClick={() => setViewStyle('heatmap-pure')}
              className={`btn btn-sm ${viewStyle === 'heatmap-pure' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Pure Heatmap
            </button>
            <button
              onClick={() => setViewStyle('heatmap-blend')}
              className={`btn btn-sm ${viewStyle === 'heatmap-blend' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Overlay On Satellite
            </button>
          </div>

          {viewStyle === 'heatmap-blend' && (
            <div style={styles.opacitySliderGroup}>
              <span style={styles.opacityLabel}>Heatmap Opacity: {blendOpacity}%</span>
              <input
                type="range"
                min="10"
                max="100"
                value={blendOpacity}
                onChange={(e) => setBlendOpacity(Number(e.target.value))}
                style={{ width: '130px' }}
              />
            </div>
          )}
        </div>

        {/* Canvas Display Port */}
        <div style={styles.heatmapViewport}>
          {viewStyle === 'heatmap-blend' && imageAfter && (
            <img src={imageAfter} alt="Satellite Base" style={styles.blendBaseImage} />
          )}

          <img
            src={heatmapImage}
            alt="Difference Heatmap"
            style={{
              ...styles.heatmapImage,
              opacity: viewStyle === 'heatmap-blend' ? blendOpacity / 100 : 1
            }}
          />

          {isRecalculating && (
            <div style={styles.recalcOverlay}>
              <div className="radar-dot" />
              <span>Updating raster comparison...</span>
            </div>
          )}
        </div>
      </div>

      {/* Sensitivity Slider & Presets */}
      <div style={styles.sensitivitySection}>
        <div style={styles.sensitivityHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} color="var(--emerald-400)" />
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
              Comparison Sensitivity Adjustment
            </span>
          </div>

          {/* Preset Buttons */}
          <div style={styles.presetButtons}>
            <button
              onClick={() => onSensitivityChange(55)}
              className={`btn btn-sm ${sensitivity >= 48 ? 'btn-primary' : 'btn-secondary'}`}
              title="Flag only extreme color and luminance shifts"
            >
              Low Sensitivity
            </button>
            <button
              onClick={() => onSensitivityChange(35)}
              className={`btn btn-sm ${sensitivity >= 28 && sensitivity < 48 ? 'btn-primary' : 'btn-secondary'}`}
              title="Balanced standard threshold for typical satellite optical passes"
            >
              Medium Sensitivity
            </button>
            <button
              onClick={() => onSensitivityChange(20)}
              className={`btn btn-sm ${sensitivity < 28 ? 'btn-primary' : 'btn-secondary'}`}
              title="Flag subtle hue, moisture, and shadow shifts"
            >
              High Sensitivity
            </button>
          </div>
        </div>

        {/* Continuous Range Slider */}
        <div style={styles.sliderRow}>
          <span style={styles.sliderTag}>Threshold: {sensitivity}</span>
          <input
            type="range"
            min="12"
            max="80"
            value={sensitivity}
            onChange={(e) => onSensitivityChange(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            (Lower = more sensitive to visual anomalies)
          </span>
        </div>
      </div>

      {/* Color Legend */}
      <div style={styles.legendContainer}>
        <span style={styles.legendTitle}>HEATMAP LEGEND:</span>
        <div style={styles.legendItems}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
            <span>High Disruption ({highSeverityPixels.toLocaleString()} px)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <span>Moderate Shift ({moderateSeverityPixels.toLocaleString()} px)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: '#eab308' }} />
            <span>Minor Variation ({lowSeverityPixels.toLocaleString()} px)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, backgroundColor: '#0f172a', border: '1px solid var(--border-medium)' }} />
            <span>Unchanged Terrain (Dark)</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimerBox}>
        <Info size={14} color="var(--emerald-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={styles.disclaimerText}>
          <strong>Potential visual change detected.</strong> Pixel differences do not constitute legal or definitive
          proof of deforestation, construction, or mining. Weather conditions, solar elevation angles, atmospheric
          aerosols, and seasonal vegetation cycles influence visual appearance.
        </span>
      </div>
    </div>
  );
}

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '22px 24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-medium)',
    borderRadius: 'var(--radius-xl)'
  },
  placeholderCard: {
    padding: '48px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'center'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  flameIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.08rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  subtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    backgroundColor: 'rgba(6, 11, 20, 0.5)',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  metricLabel: {
    fontSize: '0.66rem',
    color: 'var(--text-dim)',
    fontWeight: 700,
    letterSpacing: '0.05em'
  },
  metricVal: {
    fontSize: '1.25rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    color: '#ffffff'
  },
  metricSub: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)'
  },
  viewportSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  heatmapControlsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px'
  },
  viewToggleGroup: {
    display: 'flex',
    gap: '8px'
  },
  opacitySliderGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  opacityLabel: {
    fontSize: '0.76rem',
    color: 'var(--text-secondary)'
  },
  heatmapViewport: {
    position: 'relative',
    height: '420px',
    backgroundColor: '#040810',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  blendBaseImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  heatmapImage: {
    position: 'relative',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    zIndex: 2,
    transition: 'opacity 0.15s ease'
  },
  recalcOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(6, 11, 20, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: 'var(--emerald-400)',
    fontSize: '0.84rem',
    zIndex: 10
  },
  sensitivitySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '14px 16px',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  sensitivityHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px'
  },
  presetButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap'
  },
  sliderTag: {
    fontSize: '0.76rem',
    fontWeight: 700,
    color: 'var(--emerald-400)',
    fontFamily: 'var(--font-mono)'
  },
  legendContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    padding: '10px 14px',
    backgroundColor: 'rgba(6, 11, 20, 0.4)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
    fontSize: '0.74rem'
  },
  legendTitle: {
    fontWeight: 700,
    color: 'var(--text-dim)',
    fontSize: '0.68rem',
    letterSpacing: '0.06em'
  },
  legendItems: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-secondary)'
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  disclaimerBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)'
  },
  disclaimerText: {
    fontSize: '0.74rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.45
  }
};
