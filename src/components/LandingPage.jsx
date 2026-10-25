import React, { useState } from 'react';
import {
  Satellite,
  Layers,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Activity,
  Compass,
  AlertCircle,
  Eye,
  CheckCircle2,
  Database
} from 'lucide-react';

export default function LandingPage({ onStartAnalyzing, onExploreDemo }) {
  const [sliderPos, setSliderPos] = useState(50);

  const features = [
    {
      icon: Layers,
      title: 'Satellite Change Detection',
      desc: 'Pixel-level multi-temporal algorithmic comparison across standard visible spectrum imagery, identifying spatial alterations with custom sensitivity thresholds.',
      badge: 'Canvas Engine'
    },
    {
      icon: Activity,
      title: 'Environmental Monitoring',
      desc: 'Analyze potential vegetation canopy retreat, desertification, surface water contraction, and structural expansion without requiring proprietary cloud APIs.',
      badge: 'Zero API Dependency'
    },
    {
      icon: Eye,
      title: 'Visual Difference Analysis',
      desc: 'Interactive split-curtain slider and chromatic difference heatmaps that isolate altered terrain clusters in high-contrast red overlays.',
      badge: 'Interactive Heatmap'
    },
    {
      icon: FileText,
      title: 'Automated Reporting',
      desc: 'Generate comprehensive environmental dossiers and export high-resolution PDF dossiers containing quantitative metrics, proxies, and actionable protocols.',
      badge: 'jsPDF Export'
    }
  ];

  const handleSliderDrag = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div style={styles.landingContainer}>
      {/* Top Floating Nav */}
      <nav style={styles.topNav}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>
            <Satellite size={20} color="#10b981" />
          </div>
          <span style={styles.navTitle}>
            TERRAWATCH <span style={{ color: '#10b981' }}>AI</span>
          </span>
        </div>

        <div style={styles.navActions}>
          <button onClick={onExploreDemo} className="btn btn-secondary btn-sm">
            <Sparkles size={14} color="#10b981" />
            Explore Demo
          </button>
          <button onClick={onStartAnalyzing} className="btn btn-primary btn-sm">
            Start Analyzing
            <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>
          <div className="radar-dot" />
          <span>Next-Generation Orbital Observation Platform</span>
        </div>

        <h1 style={styles.heroTitle}>
          See How Our <span style={styles.heroGradient}>Planet Changes.</span>
        </h1>

        <p style={styles.heroSubtitle}>
          Satellite intelligence that transforms landscape imagery into environmental insights.
          Compare historical and recent aerial observations to detect vegetation loss, urban sprawl,
          and hydrological shifts in real time.
        </p>

        <div style={styles.heroCtaGroup}>
          <button
            onClick={onStartAnalyzing}
            className="btn btn-primary btn-lg"
            style={{ fontSize: '1.05rem', padding: '16px 32px' }}
          >
            Start Analyzing
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onExploreDemo}
            className="btn btn-secondary btn-lg"
            style={{ fontSize: '1.05rem', padding: '16px 28px' }}
          >
            <Sparkles size={18} color="#10b981" />
            Explore Demo Scenarios
          </button>
        </div>

        {/* Interactive Comparison Preview Hero */}
        <div style={styles.heroPreviewWrapper}>
          <div style={styles.previewHeader}>
            <div style={styles.previewHeaderLeft}>
              <span className="badge badge-emerald">Interactive Demonstration</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Amazon Rainforest Canopy Deforestation (2020 vs 2024)
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Drag slider below to compare
            </div>
          </div>

          <div
            style={styles.heroPreviewCanvas}
            onMouseMove={(e) => e.buttons === 1 && handleSliderDrag(e)}
            onClick={handleSliderDrag}
          >
            {/* Background (After image simulation) */}
            <div style={styles.heroSimAfter}>
              <div style={styles.simLabelAfter}>RECENT (2024) - CLEARINGS & ROADS</div>
            </div>

            {/* Foreground (Before image simulation clipped) */}
            <div
              style={{
                ...styles.heroSimBefore,
                width: `${sliderPos}%`
              }}
            >
              <div style={styles.simLabelBefore}>HISTORICAL (2020) - PRISTINE CANOPY</div>
            </div>

            {/* Split Slider Line */}
            <div style={{ ...styles.heroSliderHandle, left: `${sliderPos}%` }}>
              <div style={styles.sliderButton}>
                <span>◀ ▶</span>
              </div>
            </div>
          </div>

          <div style={styles.previewFooter}>
            <div style={styles.statMini}>
              <span style={styles.statMiniLabel}>POTENTIAL CHANGE DETECTED</span>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>24.8% Area Variance</span>
            </div>
            <div style={styles.statMini}>
              <span style={styles.statMiniLabel}>SEVERITY LEVEL</span>
              <span className="badge badge-orange">High Disruption</span>
            </div>
            <div style={styles.statMini}>
              <span style={styles.statMiniLabel}>PROCESSING ENGINE</span>
              <span style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>HTML5 Canvas (Client-side)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionBadge}>CORE CAPABILITIES</div>
          <h2 style={styles.sectionTitle}>Engineered for Geospatial Clarity</h2>
          <p style={styles.sectionSubtitle}>
            Built to provide researchers, analysts, and environmental advocates with
            instant temporal transparency directly inside the browser.
          </p>
        </div>

        <div style={styles.grid}>
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="card card-glow-emerald" style={styles.featureCard}>
                <div style={styles.featureTop}>
                  <div style={styles.featureIconBox}>
                    <Icon size={24} color="#10b981" />
                  </div>
                  <span className="badge badge-slate">{feat.badge}</span>
                </div>
                <h3 style={styles.featureTitle}>{feat.title}</h3>
                <p style={styles.featureDesc}>{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scientific Transparency & Disclaimer Banner */}
      <section style={styles.disclaimerSection}>
        <div style={styles.disclaimerCard}>
          <div style={styles.disclaimerIconBox}>
            <ShieldCheck size={28} color="#10b981" />
          </div>
          <div>
            <h4 style={styles.disclaimerTitle}>
              Scientific Transparency & Analytical Limitations
            </h4>
            <p style={styles.disclaimerText}>
              TerraWatch AI performs multi-temporal visual pixel analysis.
              Pixel differences indicate <strong>potential visual change</strong>, not definitive proof
              of deforestation, construction, or mining. Variations in illumination, sensor angle,
              seasonal foliage cycles, and atmospheric haze can influence visual comparison.
              All findings are structured as screening indicators for targeted ground verification.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerBrand}>
          <Satellite size={18} color="#10b981" />
          <span style={{ fontWeight: 700, color: '#ffffff' }}>TERRAWATCH AI</span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Satellite Intelligence & Environmental Change Detection • Hackathon Edition
          </span>
        </div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          Fully Browser-based • No Paid API Key Required • Client Privacy Preserved
        </div>
      </footer>
    </div>
  );
}

const styles = {
  landingContainer: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    overflowY: 'auto'
  },
  topNav: {
    height: '75px',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-subtle)',
    backgroundColor: 'rgba(6, 11, 20, 0.8)',
    backdropFilter: 'blur(16px)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  navLogo: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.15rem',
    letterSpacing: '-0.02em'
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  heroSection: {
    padding: '70px 24px 60px',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--emerald-400)',
    marginBottom: '24px'
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    maxWidth: '850px',
    marginBottom: '20px'
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    maxWidth: '750px',
    marginBottom: '36px'
  },
  heroCtaGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '54px'
  },
  heroPreviewWrapper: {
    width: '100%',
    maxWidth: '920px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-medium)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.1)'
  },
  previewHeader: {
    padding: '14px 20px',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.6)'
  },
  previewHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  heroPreviewCanvas: {
    position: 'relative',
    height: '420px',
    width: '100%',
    cursor: 'ew-resize',
    userSelect: 'none',
    overflow: 'hidden'
  },
  heroSimAfter: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 65% 55%, #a58156 0%, #7d5e37 40%, #173d1e 85%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '18px'
  },
  heroSimBefore: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 45% 45%, #184e23 0%, #113618 60%, #0a2410 100%)',
    overflow: 'hidden',
    borderRight: '2px solid var(--emerald-400)',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '18px'
  },
  simLabelBefore: {
    backgroundColor: 'rgba(6, 11, 20, 0.85)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.74rem',
    fontWeight: 700,
    color: 'var(--emerald-400)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    whiteSpace: 'nowrap'
  },
  simLabelAfter: {
    backgroundColor: 'rgba(6, 11, 20, 0.85)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.74rem',
    fontWeight: 700,
    color: '#fbbf24',
    border: '1px solid rgba(251, 191, 36, 0.4)',
    whiteSpace: 'nowrap'
  },
  heroSliderHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '2px',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sliderButton: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#060b14',
    border: '2px solid var(--emerald-400)',
    color: 'var(--emerald-400)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)'
  },
  previewFooter: {
    padding: '16px 24px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    flexWrap: 'wrap',
    gap: '12px'
  },
  statMini: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px'
  },
  statMiniLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-dim)',
    fontWeight: 700,
    letterSpacing: '0.05em'
  },
  featuresSection: {
    padding: '90px 24px',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  sectionBadge: {
    fontSize: '0.74rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--emerald-400)',
    marginBottom: '8px'
  },
  sectionTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    marginBottom: '12px'
  },
  sectionSubtitle: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: 1.5
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px'
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '28px 24px'
  },
  featureTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  featureIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  featureTitle: {
    fontSize: '1.12rem',
    fontWeight: 700
  },
  featureDesc: {
    fontSize: '0.86rem',
    color: 'var(--text-muted)',
    lineHeight: 1.55
  },
  disclaimerSection: {
    padding: '0 24px 80px',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  disclaimerCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid var(--border-medium)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px 28px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start'
  },
  disclaimerIconBox: {
    flexShrink: 0,
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  disclaimerTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '6px'
  },
  disclaimerText: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6
  },
  footer: {
    padding: '36px 40px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-secondary)',
    flexWrap: 'wrap',
    gap: '16px'
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }
};
