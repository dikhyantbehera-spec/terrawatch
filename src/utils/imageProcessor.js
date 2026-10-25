/**
 * TerraWatch AI - Core Browser-based Satellite Image Processing & Change Detection Engine
 * Uses HTML Canvas API for client-side pixel comparison, difference mapping,
 * and visual change category evaluation without external API dependencies.
 *
 * Implements transparent, reproducible RGB distance and luminance divergence.
 * Does not make unsupported environmental inferences from 3-band visible imagery alone.
 */

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image. Check format or file integrity.'));
    img.src = src;
  });
}

/**
 * Normalizes and analyzes two images pixel-by-pixel.
 *
 * Algorithm:
 * 1. Both input images are rendered to an offscreen canvas at a normalized comparison dimension (e.g. 512x512).
 * 2. Corresponding pixels at each coordinate (x, y) are compared using:
 *    - Euclidean RGB distance: sqrt((R2 - R1)^2 + (G2 - G1)^2 + (B2 - B1)^2)
 *    - Photometric luminance divergence: |Lum2 - Lum1|
 *    - Composite difference score: min(255, distRGB * 0.70 + dLum * 0.50)
 * 3. Pixels with diffScore > sensitivity threshold are flagged as changed.
 *
 * Invariant: Analyzed Pixels = Changed Pixels + Unchanged Pixels
 *
 * @param {HTMLImageElement|string} beforeSource
 * @param {HTMLImageElement|string} afterSource
 * @param {Object} options { dimension: 512, sensitivity: 35, showSubtleOverlay: true }
 */
export async function compareSatelliteImages(beforeSource, afterSource, options = {}) {
  const {
    dimension = 512,
    sensitivity = 35, // threshold: lower = higher sensitivity to changes
    showSubtleOverlay = true,
  } = options;

  const [imgBefore, imgAfter] = await Promise.all([
    typeof beforeSource === 'string' ? loadImage(beforeSource) : beforeSource,
    typeof afterSource === 'string' ? loadImage(afterSource) : afterSource,
  ]);

  // Capture original dimensions if available from Image elements
  const beforeOriginalDimensions =
    imgBefore.naturalWidth && imgBefore.naturalHeight
      ? `${imgBefore.naturalWidth} × ${imgBefore.naturalHeight} px`
      : 'Not provided';
  const afterOriginalDimensions =
    imgAfter.naturalWidth && imgAfter.naturalHeight
      ? `${imgAfter.naturalWidth} × ${imgAfter.naturalHeight} px`
      : 'Not provided';

  // Create canvas for Before image
  const canvasBefore = document.createElement('canvas');
  canvasBefore.width = dimension;
  canvasBefore.height = dimension;
  const ctxBefore = canvasBefore.getContext('2d');
  ctxBefore.drawImage(imgBefore, 0, 0, dimension, dimension);
  const dataBefore = ctxBefore.getImageData(0, 0, dimension, dimension).data;

  // Create canvas for After image
  const canvasAfter = document.createElement('canvas');
  canvasAfter.width = dimension;
  canvasAfter.height = dimension;
  const ctxAfter = canvasAfter.getContext('2d');
  ctxAfter.drawImage(imgAfter, 0, 0, dimension, dimension);
  const dataAfter = ctxAfter.getImageData(0, 0, dimension, dimension).data;

  // Output Heatmap Canvas
  const canvasHeatmap = document.createElement('canvas');
  canvasHeatmap.width = dimension;
  canvasHeatmap.height = dimension;
  const ctxHeatmap = canvasHeatmap.getContext('2d');
  const heatmapImageData = ctxHeatmap.createImageData(dimension, dimension);
  const dataHeat = heatmapImageData.data;

  // Output Difference Mask Canvas (pure mask for overlays)
  const canvasMask = document.createElement('canvas');
  canvasMask.width = dimension;
  canvasMask.height = dimension;
  const ctxMask = canvasMask.getContext('2d');
  const maskImageData = ctxMask.createImageData(dimension, dimension);
  const dataMask = maskImageData.data;

  const totalPixels = dimension * dimension;
  let changedPixels = 0;
  let highDifferencePixels = 0;
  let moderateDifferencePixels = 0;
  let minorDifferencePixels = 0;

  // Pixel comparison loop (comparing corresponding pixel coordinates)
  for (let i = 0; i < dataBefore.length; i += 4) {
    const r1 = dataBefore[i];
    const g1 = dataBefore[i + 1];
    const b1 = dataBefore[i + 2];

    const r2 = dataAfter[i];
    const g2 = dataAfter[i + 1];
    const b2 = dataAfter[i + 2];

    // Euclidean RGB distance
    const dr = r2 - r1;
    const dg = g2 - g1;
    const db = b2 - b1;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    // Perceptual luminance difference (ITU-R BT.601 coefficients)
    const lum1 = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;
    const lum2 = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;
    const dLum = Math.abs(lum2 - lum1);

    // Composite difference score normalized to 0 - 255
    const diffScore = Math.min(255, dist * 0.70 + dLum * 0.50);

    if (diffScore > sensitivity) {
      changedPixels++;

      // Intensity tier relative to sensitivity threshold
      const intensity = (diffScore - sensitivity) / (255 - sensitivity);

      if (intensity > 0.55) {
        // High visual difference: Vivid red
        dataHeat[i] = 239;     // R
        dataHeat[i + 1] = 68;  // G
        dataHeat[i + 2] = 68;  // B
        dataHeat[i + 3] = 245; // A
        highDifferencePixels++;
      } else if (intensity > 0.25) {
        // Moderate visual difference: Amber / Orange
        dataHeat[i] = 245;
        dataHeat[i + 1] = 158;
        dataHeat[i + 2] = 11;
        dataHeat[i + 3] = 220;
        moderateDifferencePixels++;
      } else {
        // Minor visual difference: Yellow
        dataHeat[i] = 234;
        dataHeat[i + 1] = 179;
        dataHeat[i + 2] = 8;
        dataHeat[i + 3] = 190;
        minorDifferencePixels++;
      }

      // Difference mask (semi-transparent red for slider overlay)
      dataMask[i] = 239;
      dataMask[i + 1] = 68;
      dataMask[i + 2] = 68;
      dataMask[i + 3] = Math.min(230, Math.floor(intensity * 255) + 60);
    } else {
      // Unchanged pixels: Dark slate / muted satellite base
      if (showSubtleOverlay) {
        const muted = Math.floor(lum2 * 0.18);
        dataHeat[i] = 10 + Math.floor(muted * 0.4);
        dataHeat[i + 1] = 18 + Math.floor(muted * 0.6);
        dataHeat[i + 2] = 30 + Math.floor(muted * 1.0);
        dataHeat[i + 3] = 255;
      } else {
        dataHeat[i] = 6;
        dataHeat[i + 1] = 11;
        dataHeat[i + 2] = 24;
        dataHeat[i + 3] = 255;
      }

      // Transparent in mask
      dataMask[i] = 0;
      dataMask[i + 1] = 0;
      dataMask[i + 2] = 0;
      dataMask[i + 3] = 0;
    }
  }

  ctxHeatmap.putImageData(heatmapImageData, 0, 0);
  ctxMask.putImageData(maskImageData, 0, 0);

  // Exact Pixel Analysis relationship:
  // Analyzed Pixels = Changed Pixels + Unchanged Pixels
  const unchangedPixels = totalPixels - changedPixels;
  const changePercentage = Number(((changedPixels / totalPixels) * 100).toFixed(2));
  const unchangedPercentage = Number((100 - changePercentage).toFixed(2));

  // Determine Visual Change Category
  // Categories:
  // - Low Visual Difference: 0% to less than 5%
  // - Moderate Visual Difference: 5% to less than 20%
  // - High Visual Difference: 20% or greater
  let visualChangeCategory = 'Low Visual Difference';
  let visualChangeCategoryColor = '#3b82f6'; // blue
  let visualChangeCategoryBadgeClass = 'badge-blue';

  if (changePercentage >= 20) {
    visualChangeCategory = 'High Visual Difference';
    visualChangeCategoryColor = '#ef4444'; // red
    visualChangeCategoryBadgeClass = 'badge-red';
  } else if (changePercentage >= 5) {
    visualChangeCategory = 'Moderate Visual Difference';
    visualChangeCategoryColor = '#f59e0b'; // amber
    visualChangeCategoryBadgeClass = 'badge-yellow';
  }

  const visualChangeCategoryExplanation =
    'Visual Change Category describes the proportion of pixels flagged as different. It does not represent environmental damage or ecological severity.';

  const environmentalClassificationStatus =
    'Environmental categories have not been independently classified.';

  return {
    dimension,
    comparisonDimensions: `${dimension} × ${dimension} pixels`,
    totalPixels,
    changedPixels,
    unchangedPixels,
    changePercentage,
    unchangedPercentage,

    // Visual Change Category (renamed from Severity Classification)
    visualChangeCategory,
    visualChangeCategoryColor,
    visualChangeCategoryBadgeClass,
    visualChangeCategoryExplanation,

    // Backward compatibility aliases for existing UI components
    severity: visualChangeCategory,
    severityColor: visualChangeCategoryColor,
    severityBadgeClass: visualChangeCategoryBadgeClass,

    // Heatmap pixel intensity counts
    highDifferencePixels,
    moderateDifferencePixels,
    minorDifferencePixels,

    // Verification and classification notices
    environmentalClassificationStatus,
    verificationStatus: 'Automated visual screening — not independently verified.',

    // Sensitivity parameter used
    sensitivityUsed: sensitivity,

    // Dimension metadata
    beforeOriginalDimensions,
    afterOriginalDimensions,

    // Output Data URLs
    heatmapDataUrl: canvasHeatmap.toDataURL('image/png'),
    maskDataUrl: canvasMask.toDataURL('image/png'),
    analyzedAt: new Date().toISOString(),
  };
}
