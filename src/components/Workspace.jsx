import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  FileText,
  Sliders,
  Play,
  RotateCcw,
  Download,
  AlertTriangle,
  Info,
  Calendar,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Eye,
  Flame,
  ShieldCheck
} from 'lucide-react';
import ImageUploader from './ImageUploader';
import ComparisonSlider from './ComparisonSlider';
import HeatmapViewer from './HeatmapViewer';

export default function Workspace({
  imageBefore,
  imageAfter,
  beforeFileName,
  afterFileName,
  beforeFileSize,
  afterFileSize,
  historicalDate,
  recentDate,
  onImageBeforeChange,
  onImageAfterChange,
  onHistoricalDateChange,
  onRecentDateChange,
  onRemoveBefore,
  onRemoveAfter,
  onLoadDemo,
  metrics,
  heatmapImage,
  sensitivity,
  onSensitivityChange,
  isAnalyzing,
  onRunAnalysis,
  onOpenReport,
  onSaveAnalysis,
  isSaved,
  locationTitle,
  onLocationTitleChange
}) {
  const [activeWorkspaceView, setActiveWorkspaceView] = useState('slider'); // 'slider' | 'heatmap' | 'side-by-side'

  const hasBothImages = Boolean(imageBefore && imageAfter);

  return (
    <div style={styles.container}>
      {/* Workspace Top Header */}
      <div className="card" style={styles.topCard}>
        <div style={styles.topCardLeft}>
          <div style={styles.workspaceBadge}>
            <Layers size={15} color="var(--emerald-400)" />
            <span>SPECTRAL COMPARISON WORKSPACE</span>
          </div>
          <div style={styles.titleInputRow}>
            <input
              type="text"
              value={locationTitle}
              onChange={(e) => onLocationTitleChange(e.target.value)}
              placeholder="Analysis Target (e.g. Amazon Rainforest Canopy Monitoring)"
              style={styles.titleInput}
            />
          </div>
          <p style={styles.topCardDesc}>
            Upload two temporal passes (Historical T1 & Recent T2) or load high-resolution demo imagery
            to compute visual surface differences and environmental change proxies.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={styles.topCardActions}>
          <button
            onClick={onLoadDemo}
            className="btn btn-secondary btn-sm"
            title="Load sample satellite change pairs"
          >
            <Sparkles size={14} color="#10b981" />
            <span>Load Demo Data</span>
          </button>

          {hasBothImages && (
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="btn btn-primary btn-sm"
              title="Run or recalculate pixel difference math"
            >
              <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
              <span>{isAnalyzing ? 'Processing Raster...' : 'Recalculate Change'}</span>
            </button>
          )}

          {metrics && (
            <button
              onClick={onOpenReport}
              className="btn btn-primary btn-sm"
              title="Open full AI environmental analysis report"
            >
              <FileText size={14} />
              <span>Generate Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Dual Image Uploaders (Section A & Section B) */}
      <div style={styles.uploadGrid}>
        <ImageUploader
          label="Historical Satellite Image (T1 Baseline)"
          section="A"
          imageData={imageBefore}
          fileName={beforeFileName}
          fileSize={beforeFileSize}
          selectedDate={historicalDate}
          onImageChange={onImageBeforeChange}
          onDateChange={onHistoricalDateChange}
          onRemove={onRemoveBefore}
          defaultDate="2020-07-15"
          isLoading={isAnalyzing}
        />

        <ImageUploader
          label="Recent Satellite Image (T2 Observation)"
          section="B"
          imageData={imageAfter}
          fileName={afterFileName}
          fileSize={afterFileSize}
          selectedDate={recentDate}
          onImageChange={onImageAfterChange}
          onDateChange={onRecentDateChange}
          onRemove={onRemoveAfter}
          defaultDate="2024-08-04"
          isLoading={isAnalyzing}
        />
      </div>

      {/* Core Comparison & Heatmap Workspace Area */}
      {hasBothImages ? (
        <div style={styles.analysisArea}>
          {/* View Tab Selector Bar */}
          <div style={styles.viewTabsHeader}>
            <div style={styles.tabsGroup}>
              <button
                onClick={() => setActiveWorkspaceView('slider')}
                className={`btn btn-sm ${activeWorkspaceView === 'slider' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Layers size={14} />
                <span>Interactive Split Slider</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceView('heatmap')}
                className={`btn btn-sm ${activeWorkspaceView === 'heatmap' ? 'btn-danger' : 'btn-secondary'}`}
              >
                <Flame size={14} />
                <span>Difference Heatmap & Metrics</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceView('side-by-side')}
                className={`btn btn-sm ${activeWorkspaceView === 'side-by-side' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Eye size={14} />
                <span>Dual Side-by-Side</span>
              </button>
            </div>

            {/* Save to History Button */}
            {metrics && (
              <div style={styles.saveActions}>
                <button
                  onClick={onSaveAnalysis}
                  className={`btn btn-sm ${isSaved ? 'btn-ghost' : 'btn-secondary'}`}
                  disabled={isSaved}
                >
                  <CheckCircle2 size={14} color={isSaved ? 'var(--emerald-400)' : 'currentColor'} />
                  <span>{isSaved ? 'Saved to Local History' : 'Save Session to History'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Active View Component */}
          {activeWorkspaceView === 'slider' && (
            <ComparisonSlider
              imageBefore={imageBefore}
              imageAfter={imageAfter}
              heatmapImage={heatmapImage}
              historicalDate={historicalDate}
              recentDate={recentDate}
              viewMode="slider"
              onViewModeChange={(m) => {
                if (m === 'diff-only') setActiveWorkspaceView('heatmap');
                else if (m === 'side-by-side') setActiveWorkspaceView('side-by-side');
              }}
            />
          )}

          {activeWorkspaceView === 'side-by-side' && (
            <ComparisonSlider
              imageBefore={imageBefore}
              imageAfter={imageAfter}
              heatmapImage={heatmapImage}
              historicalDate={historicalDate}
              recentDate={recentDate}
              viewMode="side-by-side"
              onViewModeChange={(m) => {
                if (m === 'slider') setActiveWorkspaceView('slider');
                else if (m === 'diff-only') setActiveWorkspaceView('heatmap');
              }}
            />
          )}

          {activeWorkspaceView === 'heatmap' && (
            <HeatmapViewer
              heatmapImage={heatmapImage}
              imageAfter={imageAfter}
              metrics={metrics}
              sensitivity={sensitivity}
              onSensitivityChange={onSensitivityChange}
              isRecalculating={isAnalyzing}
            />
          )}
        </div>
      ) : (
        /* Empty State Guidance */
        <div className="card" style={styles.emptyPromptCard}>
          <div style={styles.emptyIconCircle}>
            <Layers size={36} color="var(--emerald-400)" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
            Ready for Satellite Imagery Pair
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '480px', lineHeight: 1.6 }}>
            Upload both Historical (Before) and Recent (After) images above, or click below to load pre-calibrated sample imagery demonstrating real landscape change.
          </p>
          <button onClick={onLoadDemo} className="btn btn-primary btn-md" style={{ marginTop: '8px' }}>
            <Sparkles size={16} />
            Load Sample Satellite Data
          </button>
        </div>
      )}

      {/* Disclaimers & Methodological Integrity Footer */}
      <div className="card" style={styles.disclaimerCard}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <ShieldCheck size={20} color="var(--emerald-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Potential Visual Change Notice & Sensor Caveats
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All algorithmic outputs are classified as <strong>potential visual changes</strong>.
              Variations in lighting, sensor azimuth, atmospheric moisture, terrain shadows, and seasonal
              vegetation phonology can produce spectral divergence. Findings should be cross-validated
              against ESA Sentinel-2 / NASA Landsat calibrated multispectral indices before making legal or policy assertions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '28px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  topCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '22px 28px',
    gap: '20px',
    flexWrap: 'wrap'
  },
  topCardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxWidth: '720px'
  },
  workspaceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: 'var(--emerald-400)'
  },
  titleInputRow: {
    marginTop: '4px'
  },
  titleInput: {
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border-medium)',
    color: '#ffffff',
    outline: 'none',
    width: '100%',
    padding: '4px 0'
  },
  topCardDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: 1.45,
    marginTop: '4px'
  },
  topCardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  uploadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '20px'
  },
  analysisArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  viewTabsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  tabsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  saveActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  emptyPromptCard: {
    padding: '70px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '14px',
    border: '2px dashed var(--border-medium)'
  },
  emptyIconCircle: {
    width: '74px',
    height: '74px',
    borderRadius: '50%',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  disclaimerCard: {
    padding: '18px 22px',
    backgroundColor: 'rgba(6, 11, 20, 0.6)',
    borderColor: 'var(--border-subtle)'
  }
};
