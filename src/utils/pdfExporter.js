/**
 * TerraWatch AI - Scientific Satellite Intelligence PDF Report Exporter
 *
 * Generates an executive-ready, multi-page scientific dossier using jsPDF.
 * Implements rigorous data provenance, exact pixel analysis metrics,
 * explicit verification statuses, analysis methodology, and strict separation
 * between measured visual differences and possible environmental interpretations.
 */
import { jsPDF } from 'jspdf';

export async function exportAnalysisToPDF({
  report,
  imageBefore,
  imageAfter,
  heatmapImage,
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Curated color palette
  const NAVY = [11, 19, 43];         // #0b132b
  const DARK_BG = [15, 23, 42];      // #0f172a
  const EMERALD = [16, 185, 129];    // #10b981
  const SLATE = [100, 116, 139];      // #64748b
  const LIGHT_SLATE = [241, 245, 249];// #f1f5f9
  const TEXT_DARK = [15, 23, 42];     // #0f172a
  const TEXT_MUTED = [71, 85, 105];   // #475569
  const ACCENT_RED = [239, 68, 68];   // #ef4444
  const ACCENT_AMBER = [245, 158, 11];// #f59e0b
  const ACCENT_BLUE = [59, 130, 246]; // #3b82f6

  // Helper for dynamic page breaks
  const checkPageBreak = (neededHeight) => {
    if (yPos + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      yPos = margin + 10;
      renderRunningHeader();
    }
  };

  const renderRunningHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text('TERRAWATCH AI — SATELLITE INTELLIGENCE DOSSIER', margin, margin);
    doc.setFont('helvetica', 'normal');
    doc.text(`REPORT ID: ${report.reportId}`, pageWidth - margin, margin, { align: 'right' });
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2.5, pageWidth - margin, margin + 2.5);
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

  // ==========================================
  // PAGE 1: COVER HEADER & SUMMARY OVERVIEW
  // ==========================================

  // Header Banner
  doc.setFillColor(...NAVY);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2.5, 2.5, 'F');

  // TerraWatch AI Brand Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('TERRAWATCH AI', margin + 6, yPos + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...EMERALD);
  doc.text('SATELLITE INTELLIGENCE & ENVIRONMENTAL CHANGE DETECTION', margin + 6, yPos + 15.5);

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`REPORT ID: ${report.reportId}`, pageWidth - margin - 6, yPos + 9.5, { align: 'right' });
  doc.text(`ISSUED: ${report.generatedAt}`, pageWidth - margin - 6, yPos + 15.5, { align: 'right' });

  yPos += 28;

  // Prominent Verification Status Callout Banner
  doc.setFillColor(254, 242, 242); // very soft red tint
  doc.setDrawColor(252, 165, 165);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, yPos, contentWidth, 8.5, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...ACCENT_RED);
  doc.text('VERIFICATION STATUS:', margin + 4, yPos + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text('Automated visual screening — not independently verified.', margin + 42, yPos + 5.5);

  yPos += 13;

  // Title & Subject Metadata
  doc.setTextColor(...TEXT_DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(report.title || 'Orbital Landscape Comparison Analysis', contentWidth);
  doc.text(titleLines, margin, yPos);
  yPos += titleLines.length * 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE);
  doc.text(`Target Location: ${report.location}   |   Coordinates: ${report.coordinates}`, margin, yPos);
  yPos += 4.5;
  doc.text(`Temporal Comparison Baseline: ${report.historicalDate}  --->  ${report.recentDate} (${report.elapsedDaysText})`, margin, yPos);

  yPos += 9;

  // Executive Observation Summary Box
  doc.setFillColor(...LIGHT_SLATE);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPos, contentWidth, 23, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text('EXECUTIVE OBSERVATION SUMMARY', margin + 4, yPos + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_DARK);
  const summaryLines = doc.splitTextToSize(report.executiveSummary, contentWidth - 8);
  doc.text(summaryLines, margin + 4, yPos + 9.5);

  yPos += 27;

  // Satellite Imagery Trio + Heatmap
  const imgWidth = (contentWidth - 8) / 3;
  const imgHeight = 44; // Fixed clean height

  // Box 1: Historical Baseline Image
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, yPos, imgWidth, imgHeight, 'FD');
  if (imageBefore) {
    try {
      doc.addImage(imageBefore, 'JPEG', margin + 0.5, yPos + 0.5, imgWidth - 1, imgHeight - 1);
    } catch (e) {
      console.warn('Could not render before image in PDF:', e);
    }
  }
  doc.setFillColor(...DARK_BG);
  doc.rect(margin, yPos, imgWidth, 4.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`HISTORICAL BASELINE (${report.historicalDate})`, margin + 2.5, yPos + 3.3);

  // Box 2: Recent Observation Image
  const img2X = margin + imgWidth + 4;
  doc.setFillColor(245, 247, 250);
  doc.rect(img2X, yPos, imgWidth, imgHeight, 'FD');
  if (imageAfter) {
    try {
      doc.addImage(imageAfter, 'JPEG', img2X + 0.5, yPos + 0.5, imgWidth - 1, imgHeight - 1);
    } catch (e) {
      console.warn('Could not render after image in PDF:', e);
    }
  }
  doc.setFillColor(...DARK_BG);
  doc.rect(img2X, yPos, imgWidth, 4.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`RECENT OBSERVATION (${report.recentDate})`, img2X + 2.5, yPos + 3.3);

  // Box 3: Difference Heatmap
  const img3X = margin + (imgWidth + 4) * 2;
  doc.setFillColor(11, 19, 43);
  doc.rect(img3X, yPos, imgWidth, imgHeight, 'FD');
  if (heatmapImage) {
    try {
      doc.addImage(heatmapImage, 'PNG', img3X + 0.5, yPos + 0.5, imgWidth - 1, imgHeight - 1);
    } catch (e) {
      console.warn('Could not render heatmap image in PDF:', e);
    }
  }
  doc.setFillColor(...ACCENT_RED);
  doc.rect(img3X, yPos, imgWidth, 4.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('DIFFERENCE HEATMAP (RED=CHANGE)', img3X + 2.5, yPos + 3.3);

  yPos += imgHeight + 3.5;

  // Heatmap Color Legend Bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 6.5, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...SLATE);
  doc.text('HEATMAP LEGEND:', margin + 3, yPos + 4.2);

  // Red dot
  doc.setFillColor(...ACCENT_RED);
  doc.circle(margin + 29, yPos + 3.8, 1.4, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text('High Difference (>55%)', margin + 32, yPos + 4.2);

  // Amber dot
  doc.setFillColor(...ACCENT_AMBER);
  doc.circle(margin + 67, yPos + 3.8, 1.4, 'F');
  doc.text('Moderate Shift (25-55%)', margin + 70, yPos + 4.2);

  // Yellow dot
  doc.setFillColor(234, 179, 8);
  doc.circle(margin + 107, yPos + 3.8, 1.4, 'F');
  doc.text('Minor Shift (<25%)', margin + 110, yPos + 4.2);

  // Dark dot
  doc.setFillColor(15, 23, 42);
  doc.circle(margin + 142, yPos + 3.8, 1.4, 'F');
  doc.text('Unchanged Terrain', margin + 145, yPos + 4.2);

  yPos += 11;

  // ==========================================
  // PIXEL ANALYSIS STATISTICS TABLE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY);
  doc.text('1. PIXEL ANALYSIS STATISTICS', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE);
  doc.text(`Comparison Dimensions: ${pAnalysis.comparisonDimensions}   |   Threshold: T = ${pAnalysis.sensitivityUsed}`, margin + 58, yPos);

  yPos += 3.5;

  // Table Container (satisfies Analyzed = Changed + Unchanged)
  const colW = contentWidth / 5;
  const tableH = 13.5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, yPos, contentWidth, tableH, 'FD');

  const stats = [
    { label: 'TOTAL PIXELS ANALYZED', val: pAnalysis.totalPixels.toLocaleString(), sub: '100.00% matrix', col: NAVY },
    { label: 'CHANGED PIXELS', val: pAnalysis.changedPixels.toLocaleString(), sub: `${pAnalysis.changePercentage}% of total`, col: ACCENT_RED },
    { label: 'UNCHANGED PIXELS', val: pAnalysis.unchangedPixels.toLocaleString(), sub: `${pAnalysis.unchangedPercentage}% of total`, col: EMERALD },
    { label: '% FLAGGED CHANGED', val: `${pAnalysis.changePercentage}%`, sub: 'Above threshold', col: ACCENT_RED },
    { label: '% UNCHANGED', val: `${pAnalysis.unchangedPercentage}%`, sub: 'Continuous terrain', col: EMERALD },
  ];

  stats.forEach((st, i) => {
    const cx = margin + i * colW;
    if (i > 0) {
      doc.setDrawColor(226, 232, 240);
      doc.line(cx, yPos, cx, yPos + tableH);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.setTextColor(...SLATE);
    doc.text(st.label, cx + 2.5, yPos + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...st.col);
    doc.text(st.val, cx + 2.5, yPos + 8.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(st.sub, cx + 2.5, yPos + 12);
  });

  yPos += tableH + 2.5;

  // Invariant formula confirmation footnote
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(
    `Mathematical Relation: Analyzed Pixels (${pAnalysis.totalPixels.toLocaleString()}) = Changed Pixels (${pAnalysis.changedPixels.toLocaleString()}) + Unchanged Pixels (${pAnalysis.unchangedPixels.toLocaleString()})`,
    margin,
    yPos
  );

  yPos += 8;

  // ==========================================
  // VISUAL CHANGE CATEGORY BOX
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY);
  doc.text('2. VISUAL CHANGE CATEGORY', margin, yPos);

  yPos += 3.5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, yPos, contentWidth, 14.5, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  const catColor =
    vCat.category.includes('High') ? ACCENT_RED : vCat.category.includes('Moderate') ? ACCENT_AMBER : ACCENT_BLUE;
  doc.setTextColor(...catColor);
  doc.text(vCat.category.toUpperCase(), margin + 4, yPos + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...SLATE);
  doc.text(`[Threshold Range: ${vCat.thresholds}]`, margin + 65, yPos + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_DARK);
  const catExplLines = doc.splitTextToSize(vCat.explanation, contentWidth - 8);
  doc.text(catExplLines, margin + 4, yPos + 9.8);

  // ==========================================
  // PAGE 2: ENVIRONMENTAL INTERPRETATION & PROVENANCE
  // ==========================================
  doc.addPage();
  yPos = margin + 8;
  renderRunningHeader();
  yPos += 5;

  // Section 3: Environmental Interpretation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text('3. ENVIRONMENTAL INTERPRETATION & OBJECTIVE CLASSIFICATION', margin, yPos);
  yPos += 4.5;

  // Prominent notice: Environmental categories have not been independently classified
  doc.setFillColor(254, 249, 195); // soft amber highlight
  doc.setDrawColor(250, 204, 21);
  doc.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(161, 98, 7);
  doc.text('CLASSIFICATION NOTICE:', margin + 3.5, yPos + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(report.environmentalInterpretation.classificationStatus, margin + 45, yPos + 4.5);
  yPos += 10.5;

  // Distinct Subsections (A, B, C)
  const interpTiers = [
    {
      label: 'A. Measured Visual Differences (Quantitative Observation)',
      text: report.environmentalInterpretation.measuredDifferences,
    },
    {
      label: 'B. Possible Environmental Interpretations (Hypothetical Context)',
      text: report.environmentalInterpretation.possibleInterpretations,
    },
    {
      label: 'C. Findings Requiring Independent Verification (Ground-Truthing)',
      text: report.environmentalInterpretation.independentVerificationNeeded,
    },
  ];

  interpTiers.forEach((tier) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(...NAVY);
    doc.text(tier.label, margin, yPos);
    yPos += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...TEXT_DARK);
    const lines = doc.splitTextToSize(tier.text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 3.6 + 4;
  });

  yPos += 2;

  // Section 4: Verification Recommendations (7 Actionable Steps)
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text('4. VERIFICATION RECOMMENDATIONS (ACTIONABLE PROTOCOLS)', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...SLATE);
  doc.text('Steps are required before asserting physical change; not yet performed.', margin + 98, yPos);
  yPos += 4;

  report.verificationRecommendations.forEach((rec) => {
    checkPageBreak(8);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, yPos, contentWidth, 7, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...EMERALD);
    doc.text(`[STEP ${rec.step}]`, margin + 2, yPos + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    doc.text(`${rec.title}:`, margin + 17, yPos + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...TEXT_DARK);
    const recW = contentWidth - 65;
    const txt = doc.splitTextToSize(rec.detail, recW);
    doc.text(txt[0], margin + 64, yPos + 4.5);

    yPos += 8;
  });

  // ==========================================
  // PAGE 3: PROVENANCE, METHODOLOGY & LIMITATIONS
  // ==========================================
  doc.addPage();
  yPos = margin + 8;
  renderRunningHeader();
  yPos += 5;

  // Section 5: Complete Data Provenance
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text('5. COMPLETE DATA PROVENANCE & SENSOR METADATA', margin, yPos);
  yPos += 4;

  if (prov.demoNotice) {
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(margin, yPos, contentWidth, 6, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...ACCENT_BLUE);
    doc.text('DEMONSTRATION NOTICE:', margin + 3, yPos + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    doc.text(prov.demoNotice, margin + 37, yPos + 4);
    yPos += 8;
  }

  // Provenance 2-column table
  const provRows = [
    [
      { label: 'Historical Image File', val: prov.historicalFileName },
      { label: 'Recent Image File', val: prov.recentFileName },
    ],
    [
      { label: 'Historical Acquisition Date', val: prov.historicalAcquisitionDate },
      { label: 'Recent Acquisition Date', val: prov.recentAcquisitionDate },
    ],
    [
      { label: 'Image Provider', val: prov.imageProvider },
      { label: 'Satellite / Sensor Name', val: prov.satelliteSensor },
    ],
    [
      { label: 'Scene Identifier', val: prov.sceneIdentifier },
      { label: 'Source URL', val: prov.sourceUrl },
    ],
    [
      { label: 'Historical Original Dimensions', val: prov.historicalOriginalDimensions },
      { label: 'Recent Original Dimensions', val: prov.recentOriginalDimensions },
    ],
    [
      { label: 'Comparison Dimensions', val: prov.comparisonDimensions },
      { label: 'Imagery Provenance Type', val: prov.imageryType },
    ],
  ];

  const provColW = contentWidth / 2;
  provRows.forEach((row, ri) => {
    checkPageBreak(7);
    doc.setFillColor(ri % 2 === 0 ? 255 : 248, ri % 2 === 0 ? 255 : 250, ri % 2 === 0 ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, yPos, contentWidth, 6.5, 'FD');

    row.forEach((cell, ci) => {
      const cx = margin + ci * provColW;
      if (ci > 0) {
        doc.line(cx, yPos, cx, yPos + 6.5);
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);
      doc.setTextColor(...SLATE);
      doc.text(`${cell.label}:`, cx + 2.5, yPos + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...TEXT_DARK);
      const valText = cell.val && cell.val.length > 40 ? `${cell.val.substring(0, 38)}...` : cell.val || 'Not provided';
      doc.text(valText, cx + 46, yPos + 4.2);
    });

    yPos += 6.5;
  });

  yPos += 7;

  // Section 6: Analysis Methodology
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text('6. ANALYSIS METHODOLOGY & IMPLEMENTED ALGORITHM', margin, yPos);
  yPos += 4;

  const methItems = [
    { label: 'A. Pixel Comparison Algorithm', text: report.methodology.pixelComparisonAlgorithm },
    { label: 'B. Sensitivity Threshold', text: report.methodology.sensitivityThreshold },
    { label: 'C. Image Resizing', text: report.methodology.imageResizing },
    { label: 'D. Image Alignment', text: report.methodology.imageAlignment },
    { label: 'E. Difference Heatmap', text: report.methodology.differenceHeatmap },
  ];

  methItems.forEach((m) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...NAVY);
    doc.text(m.label, margin, yPos);
    yPos += 3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...TEXT_DARK);
    const mLines = doc.splitTextToSize(m.text, contentWidth);
    doc.text(mLines, margin, yPos);
    yPos += mLines.length * 3.2 + 2.5;
  });

  yPos += 4;

  // Section 7: Scientific Limitations
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text('7. SCIENTIFIC LIMITATIONS & DISCLOSURES', margin, yPos);
  yPos += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 21, 1.5, 1.5, 'FD');

  report.limitations.forEach((lim, li) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...SLATE);
    doc.text(`•`, margin + 3.5, yPos + 4.2 + li * 4.4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.3);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(lim, margin + 7, yPos + 4.2 + li * 4.4, { maxWidth: contentWidth - 10 });
  });

  // ==========================================
  // PAGE NUMBERING FOOTER ON ALL PAGES
  // ==========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = pageHeight - 8;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2.5, pageWidth - margin, footerY - 2.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...SLATE);
    doc.text('TERRAWATCH AI — SATELLITE INTELLIGENCE & ENVIRONMENTAL CHANGE DETECTION', margin, footerY + 1.5);

    doc.setFont('helvetica', 'normal');
    doc.text(`REPORT ID: ${report.reportId}`, pageWidth / 2, footerY + 1.5, { align: 'center' });
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY + 1.5, { align: 'right' });
  }

  // Save PDF with sanitized timestamped filename
  const cleanTitle = (report.title || 'Screening_Dossier').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `TerraWatch_AI_Report_${cleanTitle}_${Date.now()}.pdf`;
  doc.save(filename);
  return filename;
}
