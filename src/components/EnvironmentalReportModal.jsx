import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  Satellite,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  MapPin,
  TrendingDown,
  Layers,
  Sparkles,
  Info,
  Database,
  Cpu
} from 'lucide-react';
import { exportAnalysisToPDF } from '../utils/pdfExporter';

export default function EnvironmentalReportModal({
  isOpen,
  onClose,
  report,
  imageBefore,
  imageAfter,
  heatmapImage
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState('');

  if (!isOpen || !report) return null;

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setExportSuccess('');
    try {
      const filename = await exportAnalysisToPDF({
        report,
        imageBefore,
        imageAfter,
        heatmapImage,
      });
      setExportSuccess(`Dossier downloaded: ${filename}`);
      setTimeout(() => setExportSuccess(''), 6000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Error generating PDF report. Please verify image assets.');
    } finally {
      setIsExporting(false);
    }
  };

  const pAnalysis = report.pixelAnalysis || {
    totalPixels: report.metrics?.totalPixels || 262144,
    changedPixels: report.metrics?.changedPixels || 0,
    unchangedPixels: (report.metrics?.totalPixels || 262144) - (report.metrics?.changedPixels || 0),
    changePercentage: report.metrics?.changePercentage || 0,
    unchangedPercentage: Number((100 - (report.metrics?.changePercentage || 0)).toFixed(2)),
    comparisonDimensions: '512 × 512 pixels',
    sensitivityUsed: report.metrics?.sensitivityUsed || 35,
  };

  const vCat = report.visualChangeCategory || {
    category: report.metrics?.severity || 'Low Visual Difference',
    explanation:
      'Visual Change Category describes the proportion of pixels flagged as different. It does not represent environmental damage or ecological severity.',
    thresholds: 'Low: 0% to <5% | Moderate: 5% to <20% | High: >=20%',
  };

  const prov = report.provenance || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={styles.modalBody}>
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.headerTitleGroup}>
            <div style={styles.iconBox}>
              <FileText size={22} color="var(--emerald-400)" />
            </div>
            <div>
              <div style={styles.reportTag}>TERRAWATCH AI DOSSIER • {report.reportId}</div>
              <h2 style={styles.title}>{report.title}</h2>
            </div>
          </div>

          <div style={styles.headerActions}>
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 18px' }}
            >
              <Download size={15} />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Verification Status Prominent Banner */}
        <div style={styles.verificationBanner}>
          <ShieldCheck size={18} color="#ef4444" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 700, color: '#f87171' }}>VERIFICATION STATUS: </span>
            <span style={{ color: '#ffffff' }}>{report.verificationStatus}</span>
          </div>
        </div>

        {/* Success Toast */}
        {exportSuccess && (
          <div style={styles.successToast}>
            <CheckCircle2 size={16} color="var(--emerald-400)" />
            <span>{exportSuccess}</span>
          </div>
        )}

        {/* Metadata Strip */}
        <div style={styles.metaStrip}>
          <div style={styles.metaItem}>
            <MapPin size={14} color="var(--emerald-400)" />
            <span><strong>Target Area:</strong> {report.location}</span>
          </div>
          <div style={styles.metaItem}>
            <Calendar size={14} color="var(--emerald-400)" />
            <span><strong>Baseline:</strong> {report.historicalDate} → {report.recentDate} ({report.elapsedDaysText})</span>
          </div>
          <div style={styles.metaItem}>
            <Satellite size={14} color="var(--emerald-400)" />
            <span><strong>Type:</strong> {prov.imageryType}</span>
          </div>
        </div>

        {/* Section 1: Pixel Analysis Statistics Table */}
        <div style={styles.section}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={styles.sectionTitle}>1. Pixel Analysis Statistics</h4>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Comparison Dimensions: {pAnalysis.comparisonDimensions} | Sensitivity Threshold: T = {pAnalysis.sensitivityUsed}
            </span>
          </div>

          <div style={styles.pixelStatsGrid}>
            <div style={styles.statBox}>
              <span style={styles.statBoxLabel}>TOTAL PIXELS ANALYZED</span>
              <span style={styles.statBoxVal}>{pAnalysis.totalPixels.toLocaleString()}</span>
              <span style={styles.statBoxSub}>100.00% comparison raster</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statBoxLabel}>CHANGED PIXELS</span>
              <span style={{ ...styles.statBoxVal, color: '#ef4444' }}>{pAnalysis.changedPixels.toLocaleString()}</span>
              <span style={styles.statBoxSub}>{pAnalysis.changePercentage}% flagged change</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statBoxLabel}>UNCHANGED PIXELS</span>
              <span style={{ ...styles.statBoxVal, color: 'var(--emerald-400)' }}>{pAnalysis.unchangedPixels.toLocaleString()}</span>
              <span style={styles.statBoxSub}>{pAnalysis.unchangedPercentage}% continuous pixels</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statBoxLabel}>% FLAGGED AS CHANGED</span>
              <span style={{ ...styles.statBoxVal, color: '#ef4444' }}>{pAnalysis.changePercentage}%</span>
              <span style={styles.statBoxSub}>Above sensitivity threshold</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statBoxLabel}>% UNCHANGED</span>
              <span style={{ ...styles.statBoxVal, color: 'var(--emerald-400)' }}>{pAnalysis.unchangedPercentage}%</span>
              <span style={styles.statBoxSub}>Below sensitivity threshold</span>
            </div>
          </div>

          <div style={styles.mathInvariantNote}>
            <strong>Mathematical Relation:</strong> Analyzed Pixels ({pAnalysis.totalPixels.toLocaleString()}) = Changed Pixels ({pAnalysis.changedPixels.toLocaleString()}) + Unchanged Pixels ({pAnalysis.unchangedPixels.toLocaleString()})
          </div>
        </div>

        {/* Section 2: Visual Change Category */}
        <div style={styles.categoryCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dim)' }}>
              VISUAL CHANGE CATEGORY
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Thresholds: Low (0% to &lt;5%) | Moderate (5% to &lt;20%) | High (&gt;=20%)
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: vCat.category.includes('High') ? '#ef4444' : vCat.category.includes('Moderate') ? '#f59e0b' : '#3b82f6' }}>
            {vCat.category.toUpperCase()}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {vCat.explanation}
          </p>
        </div>

        {/* Visual Snapshot Trio */}
        <div style={styles.trioContainer}>
          <div style={styles.trioCard}>
            <div style={styles.trioLabel}>T1: HISTORICAL BASELINE ({report.historicalDate})</div>
            <img src={imageBefore} alt="Historical" style={styles.trioImg} />
          </div>
          <div style={styles.trioCard}>
            <div style={styles.trioLabel}>T2: RECENT OBSERVATION ({report.recentDate})</div>
            <img src={imageAfter} alt="Recent" style={styles.trioImg} />
          </div>
          <div style={styles.trioCard}>
            <div style={{ ...styles.trioLabel, color: '#f87171' }}>DIFFERENCE HEATMAP</div>
            <img src={heatmapImage} alt="Heatmap" style={styles.trioImg} />
          </div>
        </div>

        {/* Executive Summary Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>3. Executive Observation Summary</h4>
          <p style={styles.sectionParagraph}>{report.executiveSummary}</p>
        </div>

        {/* Environmental Interpretation Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>4. Environmental Interpretation & Cautionary Assessment</h4>
          
          <div style={styles.unclassifiedNotice}>
            <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span>{report.environmentalInterpretation.classificationStatus}</span>
          </div>

          <div style={styles.interpretationList}>
            <div style={styles.interpCard}>
              <span style={styles.interpLabel}>A. MEASURED VISUAL DIFFERENCES</span>
              <p style={styles.interpText}>{report.environmentalInterpretation.measuredDifferences}</p>
            </div>
            <div style={styles.interpCard}>
              <span style={styles.interpLabel}>B. POSSIBLE ENVIRONMENTAL INTERPRETATIONS</span>
              <p style={styles.interpText}>{report.environmentalInterpretation.possibleInterpretations}</p>
            </div>
            <div style={styles.interpCard}>
              <span style={styles.interpLabel}>C. FINDINGS REQUIRING INDEPENDENT VERIFICATION</span>
              <p style={styles.interpText}>{report.environmentalInterpretation.independentVerificationNeeded}</p>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div style={styles.section}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={styles.sectionTitle}>5. Verification Recommendations</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Required protocols prior to physical change confirmation
            </span>
          </div>
          <div style={styles.recommendationsList}>
            {report.verificationRecommendations.map((rec) => (
              <div key={rec.step} style={styles.recItem}>
                <div style={styles.recNum}>{rec.step}</div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{rec.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{rec.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Provenance Table */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>6. Complete Data Provenance & Sensor Metadata</h4>
          
          {prov.demoNotice && (
            <div style={styles.demoNoticeBox}>
              <Info size={15} color="#38bdf8" style={{ flexShrink: 0 }} />
              <span>{prov.demoNotice}</span>
            </div>
          )}

          <div style={styles.provenanceGrid}>
            <div style={styles.provItem}><span style={styles.provKey}>Historical Image File:</span> <span style={styles.provVal}>{prov.historicalFileName}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Recent Image File:</span> <span style={styles.provVal}>{prov.recentFileName}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Historical Date:</span> <span style={styles.provVal}>{prov.historicalAcquisitionDate}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Recent Date:</span> <span style={styles.provVal}>{prov.recentAcquisitionDate}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Image Provider:</span> <span style={styles.provVal}>{prov.imageProvider}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Satellite / Sensor:</span> <span style={styles.provVal}>{prov.satelliteSensor}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Scene Identifier:</span> <span style={styles.provVal}>{prov.sceneIdentifier}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Source URL:</span> <span style={styles.provVal}>{prov.sourceUrl}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Historical Original Dimensions:</span> <span style={styles.provVal}>{prov.historicalOriginalDimensions}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Recent Original Dimensions:</span> <span style={styles.provVal}>{prov.recentOriginalDimensions}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Comparison Dimensions:</span> <span style={styles.provVal}>{prov.comparisonDimensions}</span></div>
            <div style={styles.provItem}><span style={styles.provKey}>Imagery Provenance:</span> <span style={styles.provVal}>{prov.imageryType}</span></div>
          </div>
        </div>

        {/* Analysis Methodology */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>7. Analysis Methodology & Implemented Algorithm</h4>
          <div style={styles.methodologyBox}>
            <div style={styles.methodItem}>
              <strong>A. Pixel Comparison Algorithm:</strong> {report.methodology.pixelComparisonAlgorithm}
            </div>
            <div style={styles.methodItem}>
              <strong>B. Sensitivity Threshold:</strong> {report.methodology.sensitivityThreshold}
            </div>
            <div style={styles.methodItem}>
              <strong>C. Image Resizing:</strong> {report.methodology.imageResizing}
            </div>
            <div style={styles.methodItem}>
              <strong>D. Image Alignment:</strong> {report.methodology.imageAlignment}
            </div>
            <div style={styles.methodItem}>
              <strong>E. Difference Heatmap:</strong> {report.methodology.differenceHeatmap}
            </div>
          </div>
        </div>

        {/* Scientific Limitations */}
        <div style={styles.limitationsBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={18} color="var(--emerald-400)" />
            <h5 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
              Scientific Limitations & Disclosures
            </h5>
          </div>
          <ul style={styles.limitationsList}>
            {report.limitations.map((lim, idx) => (
              <li key={idx} style={styles.limitationsItem}>
                {lim}
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Footer */}
        <div style={styles.footer}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Report ID: {report.reportId} • Issued: {report.generatedAt}
          </div>
          <button onClick={handleDownloadPDF} disabled={isExporting} className="btn btn-primary btn-md">
            <Download size={15} />
            <span>Download Multi-Page PDF Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalBody: {
    padding: '30px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-subtle)',
    flexWrap: 'wrap',
    gap: '12px'
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  reportTag: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--emerald-400)'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#ffffff'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  verificationBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    fontSize: '0.82rem'
  },
  successToast: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    color: 'var(--emerald-400)',
    fontSize: '0.82rem'
  },
  metaStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '12px 16px',
    backgroundColor: 'rgba(6, 11, 20, 0.6)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    flexWrap: 'wrap'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  sectionTitle: {
    fontSize: '0.96rem',
    fontWeight: 700,
    color: 'var(--emerald-400)',
    letterSpacing: '0.02em'
  },
  pixelStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  statBox: {
    padding: '12px 14px',
    backgroundColor: 'rgba(15, 25, 44, 0.7)',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  statBoxLabel: {
    fontSize: '0.64rem',
    color: 'var(--text-dim)',
    fontWeight: 700
  },
  statBoxVal: {
    fontSize: '1.2rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    color: '#ffffff'
  },
  statBoxSub: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)'
  },
  mathInvariantNote: {
    fontSize: '0.74rem',
    color: 'var(--text-muted)',
    backgroundColor: 'rgba(6, 11, 20, 0.4)',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-subtle)'
  },
  categoryCard: {
    padding: '14px 18px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(15, 25, 44, 0.7)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  trioContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px'
  },
  trioCard: {
    backgroundColor: '#040810',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column'
  },
  trioLabel: {
    fontSize: '0.66rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    padding: '6px 10px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderBottom: '1px solid var(--border-subtle)'
  },
  trioImg: {
    width: '100%',
    height: '140px',
    objectFit: 'contain'
  },
  sectionParagraph: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6
  },
  unclassifiedNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
    fontSize: '0.78rem',
    fontWeight: 600
  },
  interpretationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  interpCard: {
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  interpLabel: {
    fontSize: '0.74rem',
    fontWeight: 700,
    color: 'var(--emerald-400)'
  },
  interpText: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.45
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  recItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    border: '1px solid rgba(16, 185, 129, 0.15)'
  },
  recNum: {
    fontSize: '0.78rem',
    fontWeight: 800,
    color: 'var(--emerald-400)',
    fontFamily: 'var(--font-mono)',
    paddingTop: '1px'
  },
  demoNoticeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    color: '#7dd3fc',
    fontSize: '0.76rem'
  },
  provenanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '8px',
    backgroundColor: 'rgba(6, 11, 20, 0.4)',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)'
  },
  provItem: {
    fontSize: '0.76rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  provKey: {
    color: 'var(--text-dim)',
    fontWeight: 600,
    fontSize: '0.68rem'
  },
  provVal: {
    color: '#ffffff',
    wordBreak: 'break-all'
  },
  methodologyBox: {
    padding: '14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(6, 11, 20, 0.5)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.45
  },
  methodItem: {},
  limitationsBox: {
    padding: '16px 20px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(6, 11, 20, 0.7)',
    border: '1px solid var(--border-subtle)'
  },
  limitationsList: {
    paddingLeft: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  limitationsItem: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)',
    flexWrap: 'wrap',
    gap: '12px'
  }
};
