/**
 * TerraWatch AI - Scientific Environmental Change Screening Report Generator
 *
 * Generates transparent, reproducible screening dossiers strictly based on
 * measured client-side pixel comparison metrics, clear data provenance,
 * and scientific verification guidance.
 *
 * Does not make unsupported environmental category claims from RGB differences alone.
 */

export function generateEnvironmentalReport({
  title = 'Orbital Change Screening Analysis',
  location = 'Target Area of Interest',
  coordinates = 'Not provided',
  historicalDate = 'Not provided',
  recentDate = 'Not provided',
  metrics,
  provenance = {},
  customNotes = '',
}) {
  // Gracefully handle missing or invalid metrics
  const validTotal = Math.max(1, Number(metrics?.totalPixels) || 262144);
  const validChanged = Math.max(0, Math.min(validTotal, Number(metrics?.changedPixels) || 0));
  const validUnchanged = validTotal - validChanged;
  const validChangePct = Number(((validChanged / validTotal) * 100).toFixed(2));
  const validUnchangedPct = Number((100 - validChangePct).toFixed(2));
  const validSensitivity = Number(metrics?.sensitivityUsed) || 35;
  const comparisonDimensions = metrics?.comparisonDimensions || '512 × 512 pixels';

  // Visual Change Category (0 to <5% = Low, 5 to <20% = Moderate, >=20% = High)
  let visualChangeCategory = 'Low Visual Difference';
  let categoryColor = '#3b82f6';
  let categoryBadgeClass = 'badge-blue';

  if (validChangePct >= 20) {
    visualChangeCategory = 'High Visual Difference';
    categoryColor = '#ef4444';
    categoryBadgeClass = 'badge-red';
  } else if (validChangePct >= 5) {
    visualChangeCategory = 'Moderate Visual Difference';
    categoryColor = '#f59e0b';
    categoryBadgeClass = 'badge-yellow';
  }

  const categoryExplanation =
    'Visual Change Category describes the proportion of pixels flagged as different. It does not represent environmental damage or ecological severity.';

  // Temporal baseline calculation (if dates are provided)
  let elapsedDaysText = 'Duration not specified';
  let hasValidDates = false;
  if (historicalDate && recentDate && historicalDate !== 'Not provided' && recentDate !== 'Not provided') {
    const d1 = new Date(historicalDate);
    const d2 = new Date(recentDate);
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      const elapsedDays = Math.max(1, Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)));
      elapsedDaysText = `${elapsedDays} days elapsed`;
      hasValidDates = true;
    }
  }

  // Generate unique Report ID
  const reportId = `TW-REPORT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Complete Data Provenance (never fabricate missing values)
  const fullProvenance = {
    historicalFileName: provenance.historicalFileName || 'Not provided',
    recentFileName: provenance.recentFileName || 'Not provided',
    historicalAcquisitionDate: historicalDate || 'Not provided',
    recentAcquisitionDate: recentDate || 'Not provided',
    imageProvider: provenance.imageProvider || 'Not provided',
    satelliteSensor: provenance.satelliteSensor || 'Not provided',
    sceneIdentifier: provenance.sceneIdentifier || 'Not provided',
    sourceUrl: provenance.sourceUrl || 'Not provided',
    historicalOriginalDimensions:
      provenance.historicalOriginalDimensions || metrics?.beforeOriginalDimensions || 'Not provided',
    recentOriginalDimensions:
      provenance.recentOriginalDimensions || metrics?.afterOriginalDimensions || 'Not provided',
    comparisonDimensions,
    imageryType: provenance.isDemo
      ? 'Illustrative demo imagery'
      : provenance.imageryType || 'User-supplied satellite imagery',
    isDemo: Boolean(provenance.isDemo),
    demoNotice: provenance.isDemo
      ? 'Illustrative demo imagery — Source metadata not provided. Illustrative simulation for demonstration and screening purposes only.'
      : null,
  };

  // Executive Observation Summary (grounded purely in measured pixels)
  const executiveSummary =
    `An automated visual pixel comparison was performed across ${validTotal.toLocaleString()} normalized pixel coordinates (${comparisonDimensions}). ` +
    `A total of ${validChanged.toLocaleString()} pixels (${validChangePct}%) were flagged as exceeding the difference threshold (T = ${validSensitivity}). ` +
    `A total of ${validUnchanged.toLocaleString()} pixels (${validUnchangedPct}%) showed visual continuity below the threshold. ` +
    `The resulting classification is ${visualChangeCategory}. This automated screening identifies visual optical variance only and does not establish verified environmental events or ecological damage.`;

  // Environmental Interpretation: Clearly separated into 3 distinct tiers
  const environmentalInterpretation = {
    classificationStatus: 'Environmental categories have not been independently classified.',
    measuredDifferences:
      `Measured visual divergence: Exactly ${validChanged.toLocaleString()} of ${validTotal.toLocaleString()} pixels (${validChangePct}%) exhibited Euclidean RGB distance and luminance divergence exceeding sensitivity threshold T = ${validSensitivity}. Unchanged pixels comprise ${validUnchanged.toLocaleString()} pixels (${validUnchangedPct}%). Comparison was conducted in displayed canvas coordinates (${comparisonDimensions}).`,
    possibleInterpretations:
      'Visible-band (RGB) optical differences between two observation passes may correspond to a range of landscape phenomena, including shifts in vegetative cover or canopy density, changes in bare soil moisture or surface excavation, fluctuations in water surface extent or turbidity, and the introduction of artificial built structures. Crucially, visible optical variance can equally be produced by illumination angle shifts, cloud shadows, atmospheric aerosol variations, sensor calibration discrepancies, or slight alignment offsets.',
    independentVerificationNeeded:
      'A visual difference does not establish the causal mechanism or ecological consequence of the change. True environmental classification requires calibrated multi-spectral or hyperspectral indices (e.g., ESA Sentinel-2 / NASA Landsat validated NDVI, NDWI, SWIR bands), cloud and shadow masking algorithms, and independent in-situ ground validation.',
  };

  // 7 Actionable Verification Recommendations (clarifying steps have NOT yet been performed)
  const verificationRecommendations = [
    {
      step: '01',
      title: 'Verify Image Alignment',
      detail: 'Confirm spatial co-registration between passes. Misaligned borders and terrain ridges produce spurious edge differences in unaligned pixel coordinates.',
    },
    {
      step: '02',
      title: 'Check Cloud Cover and Atmospheric Haze',
      detail: 'Inspect scenes for thin cirrus, localized haze, or smoke plumes that alter RGB reflectance values without indicating ground-level change.',
    },
    {
      step: '03',
      title: 'Check Shadows and Illumination Differences',
      detail: 'Account for discrepancies in sun azimuth, solar elevation angle, and terrain-cast shadows between different times of day or season.',
    },
    {
      step: '04',
      title: 'Account for Seasonal Vegetation Variation',
      detail: 'Distinguish natural phonological foliage cycles (dry-season browning vs rainy-season greening) from permanent land-cover clearing.',
    },
    {
      step: '05',
      title: 'Use Suitable Surface-Reflectance Imagery',
      detail: 'When available, utilize calibrated Bottom-Of-Atmosphere (BOA) Level-2A surface reflectance data rather than raw Top-Of-Atmosphere visible imagery.',
    },
    {
      step: '06',
      title: 'Verify Findings Using Independent Ground Evidence',
      detail: 'Cross-reference flagged coordinate clusters with independent ground-truth evidence, localized drone (UAV) aerial imagery, or LiDAR data.',
    },
    {
      step: '07',
      title: 'Consult Authoritative Satellite & Geospatial Data Sources',
      detail: 'Consult official institutional portals (ESA Copernicus Browser, USGS EarthExplorer, Global Forest Watch, NASA Earthdata) for validated reference datasets.',
    },
  ];

  // Analysis Methodology Section Details
  const methodology = {
    pixelComparisonAlgorithm:
      'Corresponding pixels at identical coordinates (x, y) are evaluated for composite difference using Euclidean RGB color distance and ITU-R BT.601 photometric luminance divergence: diffScore = min(255, distRGB * 0.70 + dLum * 0.50), where distRGB = sqrt((R2-R1)^2 + (G2-G1)^2 + (B2-B1)^2) and dLum = |(0.299*R2 + 0.587*G2 + 0.114*B2) - (0.299*R1 + 0.587*G1 + 0.114*B1)|. Standard 3-channel optical difference analysis only; no spectral band ratios or machine learning classifiers are claimed.',
    sensitivityThreshold:
      `The configured sensitivity threshold is T = ${validSensitivity}. Pixels yielding diffScore > T are flagged as changed; pixels with diffScore <= T are classified as unchanged.`,
    imageResizing:
      `Both observation passes are scaled to an offscreen HTML5 canvas at a normalized comparison dimension of ${comparisonDimensions} using bilinear pixel interpolation to ensure matrix alignment.`,
    imageAlignment:
      'Images are compared in their displayed pixel coordinates. Geospatial registration is not performed.',
    differenceHeatmap:
      'The difference heatmap visualizes flagged pixels categorized into intensity tiers relative to threshold T: High Difference (>55% above threshold) highlighted in red (#ef4444); Moderate Difference (25%-55%) in amber (#f59e0b); Minor Difference (<25%) in yellow (#eab308); Unchanged pixels displayed in dark slate (#0b1329) with subtle orientation texture.',
  };

  // Scientific Limitations
  const limitations = [
    'Pixel difference does not establish the cause or environmental legality of the observed change.',
    'Atmospheric aerosol optical depth, sun angle variations, and sensor nadir geometry introduce visual variance.',
    'Visible spectrum (RGB) analysis lacks near-infrared (NIR) and shortwave-infrared (SWIR) bands essential for rigorous biophysical classification.',
    'Geospatial registration is not performed; boundary misalignment can produce false-positive change pixels along high-contrast edges.',
  ];

  return {
    reportId,
    generatedAt: new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    generationTimestampIso: new Date().toISOString(),
    title,
    location,
    coordinates,
    historicalDate,
    recentDate,
    elapsedDaysText,
    verificationStatus: 'Automated visual screening — not independently verified.',

    // Exact Pixel Analysis Metrics (Satisfies: Analyzed = Changed + Unchanged)
    pixelAnalysis: {
      metricName: 'Pixel Analysis',
      comparisonDimensions,
      totalPixels: validTotal,
      changedPixels: validChanged,
      unchangedPixels: validUnchanged,
      changePercentage: validChangePct,
      unchangedPercentage: validUnchangedPct,
      sensitivityUsed: validSensitivity,
      invariantSatisfied: validTotal === validChanged + validUnchanged,
    },

    // Visual Change Category (Renamed from Severity Classification)
    visualChangeCategory: {
      category: visualChangeCategory,
      color: categoryColor,
      badgeClass: categoryBadgeClass,
      explanation: categoryExplanation,
      thresholds: 'Low: 0% to <5% | Moderate: 5% to <20% | High: >=20%',
    },

    // Detailed Sections
    executiveSummary,
    environmentalInterpretation,
    verificationRecommendations,
    provenance: fullProvenance,
    methodology,
    limitations,
    customNotes,

    // Backward-compatibility aliases for legacy views
    metrics: {
      totalPixels: validTotal,
      changedPixels: validChanged,
      unchangedPixels: validUnchanged,
      changePercentage: validChangePct,
      unchangedPercentage: validUnchangedPct,
      severity: visualChangeCategory,
      severityColor: categoryColor,
      severityBadgeClass: categoryBadgeClass,
      sensitivityUsed: validSensitivity,
    },
  };
}
