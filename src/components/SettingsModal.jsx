import React, { useState } from 'react';
import {
  Sliders,
  X,
  ShieldCheck,
  Satellite,
  Info,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Database
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  sensitivity,
  onSensitivityChange,
  showSubtleOverlay,
  onToggleSubtleOverlay,
  analystName,
  onAnalystNameChange
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={styles.modalBody}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}>
              <Sliders size={22} color="var(--emerald-400)" />
            </div>
            <div>
              <h2 style={styles.title}>Algorithm Configuration & Platform Details</h2>
              <p style={styles.subtitle}>
                Parameters for the browser-based multi-temporal optical difference engine.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Configuration Options */}
        <div style={styles.section}>
          <h4 style={styles.sectionHeading}>
            <Cpu size={16} color="var(--emerald-400)" />
            <span>Image Processing Engine</span>
          </h4>

          {/* Option 1: Comparison Dimension */}
          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionTitle}>Raster Comparison Resolution</div>
              <div style={styles.optionDesc}>
                Normalized grid dimensions for client-side pixel-by-pixel differential math.
              </div>
            </div>
            <span className="badge badge-slate" style={{ fontFamily: 'var(--font-mono)' }}>
              512 × 512 (262,144 px)
            </span>
          </div>

          {/* Option 2: Default Sensitivity */}
          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionTitle}>Default Sensitivity Threshold: {sensitivity}</div>
              <div style={styles.optionDesc}>
                Lower values detect subtle variations; higher values highlight only major structural shifts.
              </div>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              value={sensitivity}
              onChange={(e) => onSensitivityChange(Number(e.target.value))}
              style={{ width: '150px' }}
            />
          </div>

          {/* Option 3: Heatmap Base Texture */}
          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionTitle}>Subtle Satellite Basemap on Heatmap</div>
              <div style={styles.optionDesc}>
                Render low-contrast muted terrain under unchanged pixels for spatial orientation.
              </div>
            </div>
            <button
              onClick={() => onToggleSubtleOverlay(!showSubtleOverlay)}
              className={`btn btn-sm ${showSubtleOverlay ? 'btn-primary' : 'btn-secondary'}`}
            >
              {showSubtleOverlay ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Analyst Identity */}
        <div style={styles.section}>
          <h4 style={styles.sectionHeading}>
            <Satellite size={16} color="var(--emerald-400)" />
            <span>Report Metadata</span>
          </h4>

          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionTitle}>Observer / Analyst Signature</div>
              <div style={styles.optionDesc}>
                Appears on generated environmental intelligence dossiers and exported PDF documents.
              </div>
            </div>
            <input
              type="text"
              value={analystName}
              onChange={(e) => onAnalystNameChange(e.target.value)}
              placeholder="e.g. Lead Environmental Auditor"
              style={styles.textInput}
            />
          </div>
        </div>

        {/* Scientific Transparency & Hackathon Ethics */}
        <div style={styles.ethicsBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck size={18} color="var(--emerald-400)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
              Scientific Observation Standards
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            TerraWatch AI is engineered to maintain high ethical observation integrity.
            Raster pixel differences are classified as <strong>potential visual changes</strong> and
            do not constitute legal confirmation of illegal logging, excavation, or unauthorized construction.
            Atmospheric conditions, cloud shadows, sun azimuth angles, and seasonal vegetative senescence
            can influence visual divergence.
          </p>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            TerraWatch AI v1.0 • Client-side Canvas Vector Pipeline
          </div>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Save & Close
          </button>
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
    gap: '22px'
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
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '16px',
    backgroundColor: 'rgba(6, 11, 20, 0.4)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  sectionHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '10px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    flexWrap: 'wrap'
  },
  optionTitle: {
    fontSize: '0.86rem',
    fontWeight: 600,
    color: '#ffffff'
  },
  optionDesc: {
    fontSize: '0.74rem',
    color: 'var(--text-muted)',
    maxWidth: '440px',
    marginTop: '2px'
  },
  textInput: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid var(--border-medium)',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '0.82rem',
    width: '240px',
    outline: 'none'
  },
  ethicsBox: {
    padding: '16px 20px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)'
  }
};
