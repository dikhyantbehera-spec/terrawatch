# TERRAWATCH AI
### Satellite Intelligence & Environmental Change Detection

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![HTML5 Canvas](https://img.shields.io/badge/Engine-HTML5%20Canvas%20API-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![jsPDF](https://img.shields.io/badge/Export-jsPDF%20Multi--Page-FF6F00)](https://github.com/parallax/jsPDF)
[![Zero API Key](https://img.shields.io/badge/API-Zero%20External%20Key-10B981)](#)

> **Automated visual screening — not independently verified.**  
> *TerraWatch AI is a browser-native geospatial intelligence platform that performs multi-temporal optical pixel screening across aerial and satellite passes. Pixel differences indicate potential visual change and do not establish unverified environmental damage, legal deforestation, or construction.*

---

## 🛰️ Core Features

- **Pixel Analysis Engine:**
  - Strict mathematical consistency: $\text{Analyzed Pixels} = \text{Changed Pixels} + \text{Unchanged Pixels}$ ($100.00\% = \% \text{changed} + \% \text{unchanged}$).
  - Normalized raster alignment to $512 \times 512$ matrix ($262,144$ pixels).
  - Evaluates Euclidean RGB vector distance and ITU-R BT.601 photometric luminance divergence.
- **Visual Change Categories (Objective Screening):**
  - **Low Visual Difference:** $0\%$ to $< 5\%$
  - **Moderate Visual Difference:** $5\%$ to $< 20\%$
  - **High Visual Difference:** $\ge 20\%$
  - Explicit transparency: *Describes the proportion of pixels flagged as visually different; does not represent environmental damage or ecological severity.*
- **Interactive Multi-Mode Viewport:**
  - Interactive draggable split curtain slider with mouse & touch controls.
  - Dual synchronized side-by-side inspection.
  - Single-pass isolation (Historical T1 baseline vs Recent T2 observation).
  - Difference heatmap with intensity grading (red, amber, yellow, dark slate).
  - Real-time zoom ($100\%$–$250\%$) and pan dragging.
- **Scientific Environmental Interpretation:**
  - Explicit classification status: *"Environmental categories have not been independently classified."*
  - Clear separation of:
    1. Measured visual differences (quantified pixel coordinates)
    2. Possible environmental interpretations (hypothetical contextual hypotheses)
    3. Findings requiring independent verification (ground-truthing protocols)
  - No arbitrary category percentages or fabricated location claims.
  - Zero annualized rate extrapolations.
- **7-Point Actionable Verification Recommendations:**
  1. Verify image alignment and spatial co-registration.
  2. Check cloud cover and atmospheric aerosol haze.
  3. Check shadows and solar azimuth illumination angles.
  4. Account for natural seasonal phonological cycles.
  5. Use calibrated Bottom-Of-Atmosphere (BOA) surface reflectance imagery.
  6. Verify findings using independent ground evidence and localized UAV/LiDAR.
  7. Consult official authoritative satellite repositories (ESA Copernicus, USGS, NASA Earthdata).
- **Comprehensive Data Provenance:**
  - Tracks filenames, acquisition dates, providers, sensors, scene IDs, source URLs, original dimensions, comparison dimensions ($512 \times 512$), and imagery type.
  - Missing metadata is explicitly labeled as `"Not provided"` or `"Unknown"` without fabrication.
  - Demonstration imagery is explicitly labeled as `"Illustrative demo imagery"`.
- **Multi-Page PDF Dossier Generation:**
  - Client-side A4 generation via `jsPDF`.
  - Embedded before/after imagery and difference heatmap snapshots.
  - Complete tables for Pixel Analysis, Visual Change Category, Environmental Interpretation, Verification Protocols, Data Provenance, and Implemented Methodology.
- **Local Storage Session History:**
  - Restores historical sessions, metrics, and metadata with 100% fidelity without arbitrary recalculation.

---

## 📐 Implemented Methodology

### 1. Pixel Comparison Algorithm
For each corresponding coordinate $(x, y)$ between Historical Baseline ($T_1$) and Recent Observation ($T_2$):

$$\text{dist}_{\text{RGB}} = \sqrt{(R_2 - R_1)^2 + (G_2 - G_1)^2 + (B_2 - B_1)^2}$$

$$\Delta \text{Lum} = |(0.299 R_2 + 0.587 G_2 + 0.114 B_2) - (0.299 R_1 + 0.587 G_1 + 0.114 B_1)|$$

$$\text{diffScore} = \min(255, \, \text{dist}_{\text{RGB}} \times 0.70 + \Delta \text{Lum} \times 0.50)$$

If $\text{diffScore} > T$ (where $T$ is the user sensitivity threshold, default $35$), the pixel is classified as **changed**.

### 2. Image Resizing & Alignment
- Both passes are rendered onto an offscreen HTML5 canvas normalized to $512 \times 512$ pixels using bilinear interpolation.
- **Alignment Statement:** *Images are compared in their displayed pixel coordinates. Geospatial registration is not performed.*

### 3. Difference Heatmap Generation
- **High Difference** ($>55\%$ above threshold): Vivid Red (`#ef4444`)
- **Moderate Difference** ($25\%–55\%$ above threshold): Amber (`#f59e0b`)
- **Minor Difference** ($<25\%$ above threshold): Yellow (`#eab308`)
- **Unchanged Terrain**: Dark slate (`#0b1329`) with subtle orientation texture.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Clone repository
git clone https://github.com/dikhyantbehera-spec/terrawatch.git
cd terrawatch

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://127.0.0.1:5173/` or `http://localhost:5173/`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License. Built for the ORCA CODER Hackathon.
>>>>>>> 025eafe (feat: complete TerraWatch AI with scientific pixel analysis, visual change categories, data provenance, and multi-page PDF reporting)
