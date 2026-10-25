import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  Columns,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ComparisonSlider({
  imageBefore,
  imageAfter,
  heatmapImage,
  historicalDate = '2020-01-01',
  recentDate = '2024-01-01',
  viewMode = 'slider', // 'slider' | 'side-by-side' | 'before-only' | 'after-only' | 'diff-only'
  onViewModeChange
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef(null);

  const handlePointerDown = (e) => {
    if (e.target.closest('.slider-handle-touch') || viewMode === 'slider') {
      setIsDragging(true);
      updateSliderPosition(e.clientX);
    }
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      updateSliderPosition(e.clientX);
    } else if (isPanning && zoomLevel > 1) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanPos({ x: dx, y: dy });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  const updateSliderPosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = (offsetX / rect.width) * 100;
    setSliderPos(percent);
  };

  // Reset zoom and pan
  const handleResetView = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(1, z - 0.25));

  return (
    <div className="card" style={styles.cardContainer}>
      {/* Control Bar */}
      <div style={styles.controlBar}>
        {/* View Mode Selectors */}
        <div style={styles.modeButtonGroup}>
          <button
            onClick={() => onViewModeChange('slider')}
            className={`btn btn-sm ${viewMode === 'slider' ? 'btn-primary' : 'btn-secondary'}`}
            title="Interactive Split Slider"
          >
            <SlidersHorizontal size={14} />
            <span>Split Slider</span>
          </button>

          <button
            onClick={() => onViewModeChange('side-by-side')}
            className={`btn btn-sm ${viewMode === 'side-by-side' ? 'btn-primary' : 'btn-secondary'}`}
            title="Side-by-Side Dual View"
          >
            <Columns size={14} />
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => onViewModeChange('before-only')}
            className={`btn btn-sm ${viewMode === 'before-only' ? 'btn-primary' : 'btn-secondary'}`}
            title="Historical Baseline Only"
          >
            <Eye size={14} />
            <span>Before ({historicalDate})</span>
          </button>

          <button
            onClick={() => onViewModeChange('after-only')}
            className={`btn btn-sm ${viewMode === 'after-only' ? 'btn-primary' : 'btn-secondary'}`}
            title="Recent Observation Only"
          >
            <Eye size={14} />
            <span>After ({recentDate})</span>
          </button>

          {heatmapImage && (
            <button
              onClick={() => onViewModeChange('diff-only')}
              className={`btn btn-sm ${viewMode === 'diff-only' ? 'btn-danger' : 'btn-secondary'}`}
              title="Difference Heatmap Highlight"
            >
              <Layers size={14} />
              <span>Difference Map</span>
            </button>
          )}
        </div>

        {/* Zoom Controls */}
        <div style={styles.zoomControls}>
          <button onClick={handleZoomOut} className="btn btn-secondary btn-sm" disabled={zoomLevel <= 1} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <span style={styles.zoomLabel}>{Math.round(zoomLevel * 100)}%</span>
          <button onClick={handleZoomIn} className="btn btn-secondary btn-sm" disabled={zoomLevel >= 2.5} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          {(zoomLevel !== 1 || panPos.x !== 0 || panPos.y !== 0) && (
            <button onClick={handleResetView} className="btn btn-ghost btn-sm" title="Reset Zoom">
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Comparison Canvas Viewport */}
      <div
        ref={containerRef}
        style={{
          ...styles.viewport,
          cursor: isDragging ? 'ew-resize' : zoomLevel > 1 ? 'grab' : 'default'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          style={{
            ...styles.zoomWrapper,
            transform: `scale(${zoomLevel}) translate(${panPos.x / zoomLevel}px, ${panPos.y / zoomLevel}px)`
          }}
        >
          {/* MODE: Split Slider */}
          {viewMode === 'slider' && (
            <div style={styles.sliderContainer}>
              {/* Layer 2: Recent Image (Full width background) */}
              <img src={imageAfter} alt="Recent" style={styles.baseImage} />
              <div style={styles.badgeAfter}>
                AFTER: {recentDate}
              </div>

              {/* Layer 1: Historical Image (Clipped by slider position) */}
              <div
                style={{
                  ...styles.clippedLayer,
                  width: `${sliderPos}%`
                }}
              >
                <img
                  src={imageBefore}
                  alt="Historical"
                  style={{
                    ...styles.clippedImage,
                    width: containerRef.current ? containerRef.current.clientWidth : '100%'
                  }}
                />
                <div style={styles.badgeBefore}>
                  BEFORE: {historicalDate}
                </div>
              </div>

              {/* Draggable Divider Handle */}
              <div
                className="slider-handle-touch"
                style={{
                  ...styles.sliderHandle,
                  left: `${sliderPos}%`
                }}
              >
                <div style={styles.handleThumb}>
                  <div style={styles.thumbArrows}>◀ ▶</div>
                </div>
              </div>
            </div>
          )}

          {/* MODE: Side-by-Side Dual View */}
          {viewMode === 'side-by-side' && (
            <div style={styles.sideBySideContainer}>
              <div style={styles.sidePane}>
                <img src={imageBefore} alt="Before" style={styles.paneImage} />
                <div style={styles.badgeBefore}>BEFORE: {historicalDate}</div>
              </div>
              <div style={styles.sidePane}>
                <img src={imageAfter} alt="After" style={styles.paneImage} />
                <div style={styles.badgeAfter}>AFTER: {recentDate}</div>
              </div>
            </div>
          )}

          {/* MODE: Before Only */}
          {viewMode === 'before-only' && (
            <div style={styles.singleViewContainer}>
              <img src={imageBefore} alt="Before" style={styles.baseImage} />
              <div style={styles.badgeBefore}>BEFORE: {historicalDate}</div>
            </div>
          )}

          {/* MODE: After Only */}
          {viewMode === 'after-only' && (
            <div style={styles.singleViewContainer}>
              <img src={imageAfter} alt="After" style={styles.baseImage} />
              <div style={styles.badgeAfter}>AFTER: {recentDate}</div>
            </div>
          )}

          {/* MODE: Difference Heatmap Only */}
          {viewMode === 'diff-only' && (
            <div style={styles.singleViewContainer}>
              <img src={heatmapImage} alt="Difference Heatmap" style={styles.baseImage} />
              <div style={{ ...styles.badgeAfter, backgroundColor: 'rgba(239, 68, 68, 0.9)' }}>
                DIFFERENCE HEATMAP (RED = POTENTIAL CHANGE)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Helpful Hint Footer */}
      <div style={styles.viewFooter}>
        <div style={styles.hintText}>
          {viewMode === 'slider' && 'Drag the vertical slider thumb horizontally to reveal visual alterations between passes.'}
          {viewMode === 'side-by-side' && 'Simultaneous dual-pane inspection showing spatial correspondence.'}
          {viewMode === 'diff-only' && 'Highlighting algorithmic pixel divergence clusters (red = high divergence, dark = stable).'}
        </div>
        <div style={styles.resolutionBadge}>
          512 × 512 Multi-spectral Matrix
        </div>
      </div>
    </div>
  );
}

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '16px 20px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-medium)',
    borderRadius: 'var(--radius-xl)'
  },
  controlBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  modeButtonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  zoomControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  zoomLabel: {
    fontSize: '0.78rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    minWidth: '40px',
    textAlign: 'center'
  },
  viewport: {
    position: 'relative',
    height: '480px',
    width: '100%',
    backgroundColor: '#050a12',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
    userSelect: 'none'
  },
  zoomWrapper: {
    width: '100%',
    height: '100%',
    transition: 'transform 0.1s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sliderContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  baseImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block'
  },
  clippedLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRight: '2px solid var(--emerald-400)'
  },
  clippedImage: {
    height: '100%',
    objectFit: 'contain',
    display: 'block'
  },
  sliderHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '3px',
    backgroundColor: 'var(--emerald-400)',
    transform: 'translateX(-50%)',
    cursor: 'ew-resize',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(16, 185, 129, 0.7)'
  },
  handleThumb: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#060b14',
    border: '2px solid var(--emerald-400)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
    cursor: 'ew-resize'
  },
  thumbArrows: {
    fontSize: '0.7rem',
    color: 'var(--emerald-400)',
    fontWeight: 800,
    letterSpacing: '-1px'
  },
  sideBySideContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    gap: '6px'
  },
  sidePane: {
    flex: 1,
    position: 'relative',
    height: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden'
  },
  paneImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  singleViewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  badgeBefore: {
    position: 'absolute',
    top: '14px',
    left: '14px',
    backgroundColor: 'rgba(6, 11, 20, 0.88)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    color: 'var(--emerald-400)',
    fontSize: '0.74rem',
    fontWeight: 700,
    padding: '5px 12px',
    borderRadius: '6px',
    backdropFilter: 'blur(8px)',
    letterSpacing: '0.04em'
  },
  badgeAfter: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    backgroundColor: 'rgba(6, 11, 20, 0.88)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    color: '#fbbf24',
    fontSize: '0.74rem',
    fontWeight: 700,
    padding: '5px 12px',
    borderRadius: '6px',
    backdropFilter: 'blur(8px)',
    letterSpacing: '0.04em'
  },
  viewFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 4px 0',
    fontSize: '0.76rem'
  },
  hintText: {
    color: 'var(--text-muted)'
  },
  resolutionBadge: {
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem'
  }
};
