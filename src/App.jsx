import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Overview from './components/Overview';
import Workspace from './components/Workspace';
import HistoryView from './components/HistoryView';
import EnvironmentalReportModal from './components/EnvironmentalReportModal';
import MonitoringAreasModal from './components/MonitoringAreasModal';
import SettingsModal from './components/SettingsModal';

import { getAllDemoScenarios, getDefaultDemo } from './utils/sampleDataGenerator';
import { compareSatelliteImages } from './utils/imageProcessor';
import { generateEnvironmentalReport } from './utils/reportGenerator';

export default function App() {
  // Navigation State: 'landing' or dashboard tab ('workspace' | 'overview' | 'reports' | 'areas' | 'history' | 'settings')
  const [currentView, setCurrentView] = useState('workspace'); // default to workspace for instant hackathon test, but landing is 1 click away

  // Satellite Imagery State
  const [imageBefore, setImageBefore] = useState(null);
  const [imageAfter, setImageAfter] = useState(null);
  const [beforeFileName, setBeforeFileName] = useState('');
  const [afterFileName, setAfterFileName] = useState('');
  const [beforeFileSize, setBeforeFileSize] = useState('');
  const [afterFileSize, setAfterFileSize] = useState('');
  const [beforeOriginalDimensions, setBeforeOriginalDimensions] = useState('Not provided');
  const [afterOriginalDimensions, setAfterOriginalDimensions] = useState('Not provided');
  const [isDemoImage, setIsDemoImage] = useState(true);
  const [historicalDate, setHistoricalDate] = useState('2020-07-15');
  const [recentDate, setRecentDate] = useState('2024-08-04');
  const [locationTitle, setLocationTitle] = useState('Amazon Rainforest Canopy Disturbance');
  const [targetLocation, setTargetLocation] = useState('Rondônia State, Southern Amazonia');
  const [targetCoordinates, setTargetCoordinates] = useState('10°52\'45.2"S, 62°21\'10.8"W');

  // Comparison & Algorithm State
  const [sensitivity, setSensitivity] = useState(35);
  const [showSubtleOverlay, setShowSubtleOverlay] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [heatmapImage, setHeatmapImage] = useState(null);
  const [cumulativePixels, setCumulativePixels] = useState(262144);
  const [isSaved, setIsSaved] = useState(false);

  // Settings & Metadata
  const [analystName, setAnalystName] = useState('Geospatial Analyst (TerraWatch)');

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAreasOpen, setIsAreasOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  // Demo Scenarios Catalog
  const [demoScenarios, setDemoScenarios] = useState([]);

  // Local Storage Analysis History
  const [savedAnalyses, setSavedAnalyses] = useState(() => {
    try {
      const stored = localStorage.getItem('terrawatch_analyses_v1');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to read localStorage:', e);
      return [];
    }
  });

  // Save history to localStorage
  const updateSavedAnalyses = (newList) => {
    setSavedAnalyses(newList);
    try {
      localStorage.setItem('terrawatch_analyses_v1', JSON.stringify(newList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  // Run change detection algorithm
  const executeAnalysis = useCallback(
    async (
      img1,
      img2,
      sens = sensitivity,
      overlay = showSubtleOverlay,
      customProv = null
    ) => {
      if (!img1 || !img2) return;
      setIsAnalyzing(true);
      try {
        const results = await compareSatelliteImages(img1, img2, {
          dimension: 512,
          sensitivity: sens,
          showSubtleOverlay: overlay,
        });

        setMetrics(results);
        setHeatmapImage(results.heatmapDataUrl);
        setCumulativePixels((prev) => prev + results.totalPixels);
        setIsSaved(false);

        // Build accurate data provenance
        const provData = customProv || {
          historicalFileName: beforeFileName || 'historical_baseline.jpg',
          recentFileName: afterFileName || 'recent_observation.jpg',
          historicalOriginalDimensions: beforeOriginalDimensions,
          recentOriginalDimensions: afterOriginalDimensions,
          comparisonDimensions: results.comparisonDimensions || '512 × 512 pixels',
          imageProvider: 'Not provided',
          satelliteSensor: isDemoImage ? 'Illustrative synthetic simulation' : 'Not provided',
          sceneIdentifier: 'Not provided',
          sourceUrl: 'Not provided',
          isDemo: isDemoImage,
          imageryType: isDemoImage ? 'Illustrative demo imagery' : 'User-supplied satellite imagery',
        };

        // Generate matching environmental report object
        const rep = generateEnvironmentalReport({
          title: locationTitle,
          location: targetLocation,
          coordinates: targetCoordinates,
          historicalDate,
          recentDate,
          metrics: results,
          provenance: provData,
        });
        setCurrentReport(rep);
      } catch (err) {
        console.error('Analysis failed:', err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [
      sensitivity,
      showSubtleOverlay,
      locationTitle,
      targetLocation,
      targetCoordinates,
      historicalDate,
      recentDate,
      beforeFileName,
      afterFileName,
      beforeOriginalDimensions,
      afterOriginalDimensions,
      isDemoImage,
    ]
  );

  // Bootstrapping: Initialize demo scenarios & load default scenario into workspace
  useEffect(() => {
    const demos = getAllDemoScenarios();
    setDemoScenarios(demos);
    if (demos.length > 0 && !imageBefore) {
      loadScenario(demos[0]);
    }
  }, []);

  // Recalculate if sensitivity or overlay setting changes
  const handleSensitivityChange = (newSensitivity) => {
    setSensitivity(newSensitivity);
    if (imageBefore && imageAfter) {
      executeAnalysis(imageBefore, imageAfter, newSensitivity, showSubtleOverlay);
    }
  };

  // Load a scenario
  const loadScenario = (scenario) => {
    setImageBefore(scenario.imageBefore);
    setImageAfter(scenario.imageAfter);
    setBeforeFileName(`${scenario.id}_before_${scenario.historicalDate}.jpg`);
    setAfterFileName(`${scenario.id}_after_${scenario.recentDate}.jpg`);
    setBeforeFileSize('384 KB');
    setAfterFileSize('392 KB');
    setBeforeOriginalDimensions('512 × 512 px');
    setAfterOriginalDimensions('512 × 512 px');
    setIsDemoImage(true);
    setHistoricalDate(scenario.historicalDate);
    setRecentDate(scenario.recentDate);
    setLocationTitle(scenario.title);
    setTargetLocation(scenario.location);
    setTargetCoordinates(scenario.coordinates);

    const demoProv = {
      historicalFileName: `${scenario.id}_before_${scenario.historicalDate}.jpg`,
      recentFileName: `${scenario.id}_after_${scenario.recentDate}.jpg`,
      historicalOriginalDimensions: '512 × 512 px',
      recentOriginalDimensions: '512 × 512 px',
      comparisonDimensions: '512 × 512 pixels',
      imageProvider: 'Not provided',
      satelliteSensor: 'Illustrative synthetic simulation',
      sceneIdentifier: 'Not provided',
      sourceUrl: 'Not provided',
      isDemo: true,
      imageryType: 'Illustrative demo imagery',
      demoNotice:
        'Illustrative demo imagery — Source metadata not provided. Illustrative simulation for demonstration and screening purposes only.',
    };

    executeAnalysis(scenario.imageBefore, scenario.imageAfter, sensitivity, showSubtleOverlay, demoProv);
  };

  // Manual Trigger for Analysis
  const handleRunManual = () => {
    if (imageBefore && imageAfter) {
      executeAnalysis(imageBefore, imageAfter, sensitivity, showSubtleOverlay);
    }
  };

  // Save current analysis to history (preserves full provenance and pixel analysis)
  const handleSaveToHistory = () => {
    if (!metrics) return;
    const newEntry = {
      id: `analysis_${Date.now()}`,
      title: locationTitle,
      location: targetLocation,
      coordinates: targetCoordinates,
      historicalDate,
      recentDate,
      savedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      changePercentage: metrics.changePercentage,
      unchangedPercentage: metrics.unchangedPercentage,
      visualChangeCategory: metrics.visualChangeCategory,
      visualChangeCategoryColor: metrics.visualChangeCategoryColor,
      visualChangeCategoryBadgeClass: metrics.visualChangeCategoryBadgeClass,
      severity: metrics.visualChangeCategory,
      severityBadgeClass: metrics.visualChangeCategoryBadgeClass,
      changedPixels: metrics.changedPixels,
      unchangedPixels: metrics.unchangedPixels,
      totalPixels: metrics.totalPixels,
      comparisonDimensions: metrics.comparisonDimensions,
      sensitivityUsed: metrics.sensitivityUsed,
      imageBefore,
      imageAfter,
      heatmapImage,
      provenance: currentReport?.provenance || {
        historicalFileName: beforeFileName || 'Not provided',
        recentFileName: afterFileName || 'Not provided',
        isDemo: isDemoImage,
        imageryType: isDemoImage ? 'Illustrative demo imagery' : 'User-supplied satellite imagery',
      },
      report: currentReport,
    };

    const updated = [newEntry, ...savedAnalyses.filter((s) => s.title !== locationTitle)];
    updateSavedAnalyses(updated);
    setIsSaved(true);
  };

  // Load historical session back into workspace (preserves original values without recalculation)
  const handleLoadFromHistory = (item) => {
    setImageBefore(item.imageBefore);
    setImageAfter(item.imageAfter);
    setHistoricalDate(item.historicalDate);
    setRecentDate(item.recentDate);
    setLocationTitle(item.title);
    setTargetLocation(item.location || 'Archived Location');
    setTargetCoordinates(item.coordinates || 'Not provided');
    if (item.provenance) {
      setBeforeFileName(item.provenance.historicalFileName || '');
      setAfterFileName(item.provenance.recentFileName || '');
      setIsDemoImage(Boolean(item.provenance.isDemo));
      setBeforeOriginalDimensions(item.provenance.historicalOriginalDimensions || 'Not provided');
      setAfterOriginalDimensions(item.provenance.recentOriginalDimensions || 'Not provided');
    }
    setMetrics({
      changePercentage: item.changePercentage,
      unchangedPercentage: item.unchangedPercentage || Number((100 - item.changePercentage).toFixed(2)),
      visualChangeCategory: item.visualChangeCategory || item.severity || 'Low Visual Difference',
      visualChangeCategoryColor: item.visualChangeCategoryColor || '#3b82f6',
      visualChangeCategoryBadgeClass: item.visualChangeCategoryBadgeClass || item.severityBadgeClass || 'badge-blue',
      severity: item.visualChangeCategory || item.severity || 'Low Visual Difference',
      severityBadgeClass: item.visualChangeCategoryBadgeClass || item.severityBadgeClass || 'badge-blue',
      changedPixels: item.changedPixels,
      unchangedPixels: item.unchangedPixels || (item.totalPixels - item.changedPixels),
      totalPixels: item.totalPixels,
      comparisonDimensions: item.comparisonDimensions || '512 × 512 pixels',
      sensitivityUsed: item.sensitivityUsed,
      environmentalClassificationStatus: 'Environmental categories have not been independently classified.',
      visualChangeCategoryExplanation:
        'Visual Change Category describes the proportion of pixels flagged as different. It does not represent environmental damage or ecological severity.',
    });
    setHeatmapImage(item.heatmapImage);
    setCurrentReport(item.report);
    setCurrentView('workspace');
  };

  // If user is on landing page view
  if (currentView === 'landing') {
    return (
      <LandingPage
        onStartAnalyzing={() => setCurrentView('workspace')}
        onExploreDemo={() => {
          if (demoScenarios.length > 0) loadScenario(demoScenarios[0]);
          setCurrentView('workspace');
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={currentView}
        setActiveTab={(tab) => {
          if (tab === 'reports') {
            setIsReportOpen(true);
          } else if (tab === 'areas') {
            setIsAreasOpen(true);
          } else if (tab === 'settings') {
            setIsSettingsOpen(true);
          } else {
            setCurrentView(tab);
          }
        }}
        savedAnalysesCount={savedAnalyses.length}
        onOpenDemo={() => {
          if (demoScenarios.length > 0) loadScenario(demoScenarios[0]);
          setCurrentView('workspace');
        }}
        onOpenLanding={() => setCurrentView('landing')}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Navbar
          activeTab={currentView}
          onOpenDemo={() => {
            if (demoScenarios.length > 0) loadScenario(demoScenarios[0]);
            setCurrentView('workspace');
          }}
          onOpenAreas={() => setIsAreasOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          hasAnalysis={Boolean(metrics)}
          metrics={metrics}
          isProcessing={isAnalyzing}
        />

        {/* View Switching */}
        {currentView === 'workspace' && (
          <Workspace
            imageBefore={imageBefore}
            imageAfter={imageAfter}
            beforeFileName={beforeFileName}
            afterFileName={afterFileName}
            beforeFileSize={beforeFileSize}
            afterFileSize={afterFileSize}
            historicalDate={historicalDate}
            recentDate={recentDate}
            onImageBeforeChange={(fileInfo) => {
              setImageBefore(fileInfo.dataUrl);
              setBeforeFileName(fileInfo.name);
              setBeforeFileSize(fileInfo.size);
              setBeforeOriginalDimensions(fileInfo.originalDimensions || 'Not provided');
              setIsDemoImage(false);
              if (imageAfter) {
                executeAnalysis(fileInfo.dataUrl, imageAfter, sensitivity, showSubtleOverlay, {
                  historicalFileName: fileInfo.name,
                  recentFileName: afterFileName || 'recent_observation.jpg',
                  historicalOriginalDimensions: fileInfo.originalDimensions || 'Not provided',
                  recentOriginalDimensions: afterOriginalDimensions,
                  comparisonDimensions: '512 × 512 pixels',
                  imageProvider: 'Not provided',
                  satelliteSensor: 'Not provided',
                  sceneIdentifier: 'Not provided',
                  sourceUrl: 'Not provided',
                  isDemo: false,
                  imageryType: 'User-supplied satellite imagery',
                });
              }
            }}
            onImageAfterChange={(fileInfo) => {
              setImageAfter(fileInfo.dataUrl);
              setAfterFileName(fileInfo.name);
              setAfterFileSize(fileInfo.size);
              setAfterOriginalDimensions(fileInfo.originalDimensions || 'Not provided');
              setIsDemoImage(false);
              if (imageBefore) {
                executeAnalysis(imageBefore, fileInfo.dataUrl, sensitivity, showSubtleOverlay, {
                  historicalFileName: beforeFileName || 'historical_baseline.jpg',
                  recentFileName: fileInfo.name,
                  historicalOriginalDimensions: beforeOriginalDimensions,
                  recentOriginalDimensions: fileInfo.originalDimensions || 'Not provided',
                  comparisonDimensions: '512 × 512 pixels',
                  imageProvider: 'Not provided',
                  satelliteSensor: 'Not provided',
                  sceneIdentifier: 'Not provided',
                  sourceUrl: 'Not provided',
                  isDemo: false,
                  imageryType: 'User-supplied satellite imagery',
                });
              }
            }}
            onHistoricalDateChange={setHistoricalDate}
            onRecentDateChange={setRecentDate}
            onRemoveBefore={() => {
              setImageBefore(null);
              setBeforeFileName('');
              setMetrics(null);
            }}
            onRemoveAfter={() => {
              setImageAfter(null);
              setAfterFileName('');
              setMetrics(null);
            }}
            onLoadDemo={() => {
              if (demoScenarios.length > 0) loadScenario(demoScenarios[0]);
            }}
            metrics={metrics}
            heatmapImage={heatmapImage}
            sensitivity={sensitivity}
            onSensitivityChange={handleSensitivityChange}
            isAnalyzing={isAnalyzing}
            onRunAnalysis={handleRunManual}
            onOpenReport={() => setIsReportOpen(true)}
            onSaveAnalysis={handleSaveToHistory}
            isSaved={isSaved}
            locationTitle={locationTitle}
            onLocationTitleChange={setLocationTitle}
          />
        )}

        {currentView === 'overview' && (
          <Overview
            onGoToWorkspace={() => setCurrentView('workspace')}
            onLoadScenario={(scen) => {
              loadScenario(scen);
              setCurrentView('workspace');
            }}
            demoScenarios={demoScenarios}
            savedAnalyses={savedAnalyses}
            cumulativePixelsAnalyzed={cumulativePixels}
            lastMetrics={metrics}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            savedAnalyses={savedAnalyses}
            onLoadIntoWorkspace={handleLoadFromHistory}
            onViewReport={(item) => {
              setCurrentReport(item.report);
              setIsReportOpen(true);
            }}
            onClearHistory={() => updateSavedAnalyses([])}
            onDeleteItem={(id) => updateSavedAnalyses(savedAnalyses.filter((s) => s.id !== id))}
          />
        )}
      </main>

      {/* Environmental Intelligence Report Modal */}
      <EnvironmentalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={
          currentReport ||
          (metrics
            ? generateEnvironmentalReport({
                title: locationTitle,
                location: targetLocation,
                coordinates: targetCoordinates,
                historicalDate,
                recentDate,
                metrics,
              })
            : null)
        }
        imageBefore={imageBefore}
        imageAfter={imageAfter}
        heatmapImage={heatmapImage}
      />

      {/* Global Monitoring Hotspots Modal */}
      <MonitoringAreasModal
        isOpen={isAreasOpen}
        onClose={() => setIsAreasOpen(false)}
        scenarios={demoScenarios}
        onSelectScenario={(scen) => {
          loadScenario(scen);
          setCurrentView('workspace');
        }}
      />

      {/* Algorithm Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        sensitivity={sensitivity}
        onSensitivityChange={handleSensitivityChange}
        showSubtleOverlay={showSubtleOverlay}
        onToggleSubtleOverlay={(val) => {
          setShowSubtleOverlay(val);
          if (imageBefore && imageAfter) {
            executeAnalysis(imageBefore, imageAfter, sensitivity, val);
          }
        }}
        analystName={analystName}
        onAnalystNameChange={setAnalystName}
      />
    </div>
  );
}
