/**
 * Generates realistic procedural satellite imagery pairs for demonstration.
 * Creates authentic-looking multi-spectral earth observation tiles
 * representing genuine landscape change scenarios:
 * 1. Amazon Rainforest - Canopy clearing & access road expansion
 * 2. Lake Mead Reservoir - Shoreline recession & drought bathtub ring
 * 3. Aral Sea / Salt Basin - Rapid water surface retreat & evaporite beds
 * 4. Urban Expansion - Agricultural to structural urban conversion
 */

function createNoise(ctx, width, height, density = 0.2) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * density * 255;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);
}

// Scenario 1: Amazon Rainforest Canopy Deforestation
export function generateRainforestPair(size = 512) {
  // Canvas 1: Historical (2020) - Dense pristine canopy
  const c1 = document.createElement('canvas');
  c1.width = size;
  c1.height = size;
  const ctx1 = c1.getContext('2d');

  // Base emerald / dark forest green
  const grad1 = ctx1.createLinearGradient(0, 0, size, size);
  grad1.addColorStop(0, '#1c4323');
  grad1.addColorStop(0.5, '#133519');
  grad1.addColorStop(1, '#0e2913');
  ctx1.fillStyle = grad1;
  ctx1.fillRect(0, 0, size, size);

  // Organic canopy texture
  for (let i = 0; i < 250; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 15 + Math.random() * 35;
    const gVal = 45 + Math.floor(Math.random() * 50);
    ctx1.fillStyle = `rgba(${15 + Math.random() * 20}, ${gVal}, ${20 + Math.random() * 15}, 0.35)`;
    ctx1.beginPath();
    ctx1.arc(x, y, r, 0, Math.PI * 2);
    ctx1.fill();
  }

  // Winding natural river
  ctx1.strokeStyle = '#1b3b4f';
  ctx1.lineWidth = 14;
  ctx1.lineCap = 'round';
  ctx1.beginPath();
  ctx1.moveTo(0, size * 0.2);
  ctx1.bezierCurveTo(size * 0.3, size * 0.15, size * 0.6, size * 0.45, size, size * 0.35);
  ctx1.stroke();

  // Subtle natural tributary
  ctx1.lineWidth = 6;
  ctx1.beginPath();
  ctx1.moveTo(size * 0.45, size * 0.28);
  ctx1.bezierCurveTo(size * 0.5, size * 0.6, size * 0.7, size * 0.8, size * 0.85, size);
  ctx1.stroke();

  // Minor existing forest road in 2020
  ctx1.strokeStyle = '#6e5a40';
  ctx1.lineWidth = 3;
  ctx1.beginPath();
  ctx1.moveTo(size * 0.1, 0);
  ctx1.lineTo(size * 0.2, size * 0.4);
  ctx1.stroke();

  createNoise(ctx1, size, size, 0.08);

  // Canvas 2: Recent (2024) - Fishbone deforestation & clearings
  const c2 = document.createElement('canvas');
  c2.width = size;
  c2.height = size;
  const ctx2 = c2.getContext('2d');

  // Copy baseline image 1
  ctx2.drawImage(c1, 0, 0);

  // New logging access highway (fishbone spine)
  ctx2.strokeStyle = '#8d704b';
  ctx2.lineWidth = 6;
  ctx2.beginPath();
  ctx2.moveTo(size * 0.1, 0);
  ctx2.bezierCurveTo(size * 0.22, size * 0.45, size * 0.35, size * 0.75, size * 0.5, size);
  ctx2.stroke();

  // Lateral fishbone logging tracks
  ctx2.lineWidth = 3;
  ctx2.strokeStyle = '#9c815c';
  const ribs = [
    { y: size * 0.25, len: 110, dir: 1 },
    { y: size * 0.32, len: 140, dir: -1 },
    { y: size * 0.45, len: 180, dir: 1 },
    { y: size * 0.52, len: 120, dir: -1 },
    { y: size * 0.68, len: 160, dir: 1 },
    { y: size * 0.80, len: 130, dir: -1 },
  ];
  ribs.forEach((rib) => {
    ctx2.beginPath();
    ctx2.moveTo(size * 0.25 + (rib.y / size) * 0.25 * size, rib.y);
    ctx2.lineTo(size * 0.25 + (rib.y / size) * 0.25 * size + rib.len * rib.dir, rib.y + 10);
    ctx2.stroke();
  });

  // Large geometric agricultural deforestation patches (clearings)
  const clearings = [
    { x: size * 0.32, y: size * 0.35, w: 95, h: 75, angle: 0.1 },
    { x: size * 0.52, y: size * 0.5, w: 120, h: 85, angle: -0.15 },
    { x: size * 0.68, y: size * 0.2, w: 80, h: 65, angle: 0.05 },
    { x: size * 0.42, y: size * 0.72, w: 110, h: 90, angle: 0.2 },
    { x: size * 0.75, y: size * 0.62, w: 70, h: 60, angle: -0.1 },
  ];

  clearings.forEach((c) => {
    ctx2.save();
    ctx2.translate(c.x + c.w / 2, c.y + c.h / 2);
    ctx2.rotate(c.angle);
    // Bare soil & scorched land gradient
    const soilGrad = ctx2.createLinearGradient(-c.w / 2, -c.h / 2, c.w / 2, c.h / 2);
    soilGrad.addColorStop(0, '#a58156');
    soilGrad.addColorStop(0.6, '#bfa075');
    soilGrad.addColorStop(1, '#8f683a');
    ctx2.fillStyle = soilGrad;
    ctx2.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);

    // Subtle agricultural tillage lines inside clearing
    ctx2.strokeStyle = 'rgba(100, 70, 40, 0.4)';
    ctx2.lineWidth = 1.5;
    for (let lx = -c.w / 2 + 6; lx < c.w / 2; lx += 8) {
      ctx2.beginPath();
      ctx2.moveTo(lx, -c.h / 2 + 2);
      ctx2.lineTo(lx, c.h / 2 - 2);
      ctx2.stroke();
    }
    ctx2.restore();
  });

  createNoise(ctx2, size, size, 0.06);

  return {
    id: 'amazon-rainforest',
    title: 'Amazon Basin Canopy Clearing',
    location: 'Rondônia State, Southern Amazonia',
    coordinates: '10°52\'45.2"S, 62°21\'10.8"W',
    historicalDate: '2020-07-15',
    recentDate: '2024-08-04',
    category: 'Vegetation & Forestry (Simulation)',
    description: 'Illustrative optical simulation of canopy clearance and fishbone logging corridors.',
    isDemo: true,
    imageryType: 'Illustrative demo imagery',
    provider: 'Not provided',
    satelliteSensor: 'Illustrative synthetic simulation',
    sceneIdentifier: 'Not provided',
    sourceUrl: 'Not provided',
    historicalOriginalDimensions: '512 × 512 px',
    recentOriginalDimensions: '512 × 512 px',
    comparisonDimensions: '512 × 512 pixels',
    demoNotice: 'Illustrative demo imagery — Source metadata not provided. Illustrative simulation for demonstration and screening purposes only.',
    imageBefore: c1.toDataURL('image/jpeg', 0.92),
    imageAfter: c2.toDataURL('image/jpeg', 0.92),
  };
}

// Scenario 2: Lake Mead / Reservoir Water Recession
export function generateReservoirPair(size = 512) {
  // Canvas 1: Historical (2018) - High reservoir volume
  const c1 = document.createElement('canvas');
  c1.width = size;
  c1.height = size;
  const ctx1 = c1.getContext('2d');

  // Arid canyon rock base (buff / red sandstone)
  const gradTerrain = ctx1.createLinearGradient(0, 0, size, size);
  gradTerrain.addColorStop(0, '#7c5137');
  gradTerrain.addColorStop(0.5, '#9a6b4b');
  gradTerrain.addColorStop(1, '#66402a');
  ctx1.fillStyle = gradTerrain;
  ctx1.fillRect(0, 0, size, size);

  // Canyon topography ridges
  ctx1.strokeStyle = '#5a341e';
  for (let r = 0; r < 20; r++) {
    ctx1.lineWidth = 2 + Math.random() * 4;
    ctx1.beginPath();
    ctx1.moveTo(0, r * 28 + Math.random() * 20);
    ctx1.bezierCurveTo(size * 0.3, r * 28, size * 0.7, r * 30 + 20, size, r * 28 + 10);
    ctx1.stroke();
  }

  // 2018 Full Reservoir Pool
  ctx1.fillStyle = '#174f6e';
  ctx1.beginPath();
  ctx1.moveTo(size * 0.1, size * 0.1);
  ctx1.bezierCurveTo(size * 0.4, size * 0.05, size * 0.7, size * 0.2, size * 0.9, size * 0.35);
  ctx1.bezierCurveTo(size * 0.85, size * 0.7, size * 0.65, size * 0.85, size * 0.45, size * 0.9);
  ctx1.bezierCurveTo(size * 0.25, size * 0.85, size * 0.05, size * 0.5, size * 0.1, size * 0.1);
  ctx1.closePath();
  ctx1.fill();

  // Water depth gradient
  const deepGrad = ctx1.createRadialGradient(size * 0.5, size * 0.5, 20, size * 0.5, size * 0.5, size * 0.35);
  deepGrad.addColorStop(0, '#0c354d');
  deepGrad.addColorStop(1, 'rgba(23, 79, 110, 0)');
  ctx1.fillStyle = deepGrad;
  ctx1.fill();

  createNoise(ctx1, size, size, 0.07);

  // Canvas 2: Recent (2023) - Severe Drought & Exposed Bathtub Ring
  const c2 = document.createElement('canvas');
  c2.width = size;
  c2.height = size;
  const ctx2 = c2.getContext('2d');

  ctx2.drawImage(c1, 0, 0);

  // Mineralized bleached white bathtub ring (exposed dry sediment)
  ctx2.fillStyle = '#d9cfbe';
  ctx2.beginPath();
  ctx2.moveTo(size * 0.1, size * 0.1);
  ctx2.bezierCurveTo(size * 0.4, size * 0.05, size * 0.7, size * 0.2, size * 0.9, size * 0.35);
  ctx2.bezierCurveTo(size * 0.85, size * 0.7, size * 0.65, size * 0.85, size * 0.45, size * 0.9);
  ctx2.bezierCurveTo(size * 0.25, size * 0.85, size * 0.05, size * 0.5, size * 0.1, size * 0.1);
  ctx2.closePath();
  ctx2.fill();

  // Shrunken remaining water body (2023)
  ctx2.fillStyle = '#1c5e82';
  ctx2.beginPath();
  ctx2.moveTo(size * 0.25, size * 0.3);
  ctx2.bezierCurveTo(size * 0.45, size * 0.28, size * 0.6, size * 0.38, size * 0.72, size * 0.45);
  ctx2.bezierCurveTo(size * 0.68, size * 0.62, size * 0.55, size * 0.72, size * 0.42, size * 0.74);
  ctx2.bezierCurveTo(size * 0.32, size * 0.68, size * 0.22, size * 0.52, size * 0.25, size * 0.3);
  ctx2.closePath();
  ctx2.fill();

  // Exposed sandbars and drying mudflats
  ctx2.fillStyle = '#9e8b6b';
  ctx2.beginPath();
  ctx2.ellipse(size * 0.45, size * 0.48, 45, 25, 0.3, 0, Math.PI * 2);
  ctx2.fill();

  createNoise(ctx2, size, size, 0.06);

  return {
    id: 'lake-mead-drought',
    title: 'Lake Mead Reservoir Desiccation',
    location: 'Nevada / Arizona Border, Colorado River Basin',
    coordinates: '36°01\'12.5"N, 114°44\'18.0"W',
    historicalDate: '2018-05-20',
    recentDate: '2023-06-18',
    category: 'Water Resource Depletion (Simulation)',
    description: 'Illustrative optical simulation of surface water contraction and exposed mineral bathtub ring.',
    isDemo: true,
    imageryType: 'Illustrative demo imagery',
    provider: 'Not provided',
    satelliteSensor: 'Illustrative synthetic simulation',
    sceneIdentifier: 'Not provided',
    sourceUrl: 'Not provided',
    historicalOriginalDimensions: '512 × 512 px',
    recentOriginalDimensions: '512 × 512 px',
    comparisonDimensions: '512 × 512 pixels',
    demoNotice: 'Illustrative demo imagery — Source metadata not provided. Illustrative simulation for demonstration and screening purposes only.',
    imageBefore: c1.toDataURL('image/jpeg', 0.92),
    imageAfter: c2.toDataURL('image/jpeg', 0.92),
  };
}

// Scenario 3: Dubai South / Urban Infrastructure Expansion
export function generateUrbanPair(size = 512) {
  // Canvas 1: Historical (2019) - Desert dunes & open sand
  const c1 = document.createElement('canvas');
  c1.width = size;
  c1.height = size;
  const ctx1 = c1.getContext('2d');

  // Desert sand gradient
  const desertGrad = ctx1.createLinearGradient(0, 0, size, size);
  desertGrad.addColorStop(0, '#caa274');
  desertGrad.addColorStop(0.5, '#b99263');
  gradTerrain = '#c29a6b';
  desertGrad.addColorStop(1, '#b08a5c');
  ctx1.fillStyle = desertGrad;
  ctx1.fillRect(0, 0, size, size);

  // Soft dune ridges
  ctx1.strokeStyle = 'rgba(150, 110, 70, 0.4)';
  for (let d = 0; d < 14; d++) {
    ctx1.lineWidth = 15;
    ctx1.beginPath();
    ctx1.moveTo(0, d * 40);
    ctx1.quadraticCurveTo(size * 0.5, d * 40 - 25, size, d * 40);
    ctx1.stroke();
  }

  // Single existing desert highway
  ctx1.strokeStyle = '#3e4347';
  ctx1.lineWidth = 5;
  ctx1.beginPath();
  ctx1.moveTo(0, size * 0.5);
  ctx1.lineTo(size, size * 0.5);
  ctx1.stroke();

  createNoise(ctx1, size, size, 0.08);

  // Canvas 2: Recent (2024) - Mega-logistics hub & urban development
  const c2 = document.createElement('canvas');
  c2.width = size;
  c2.height = size;
  const ctx2 = c2.getContext('2d');

  ctx2.drawImage(c1, 0, 0);

  // New arterial highway grid
  ctx2.strokeStyle = '#2b2f33';
  ctx2.lineWidth = 4;
  for (let x = 80; x < size; x += 85) {
    ctx2.beginPath();
    ctx2.moveTo(x, 0);
    ctx2.lineTo(x, size);
    ctx2.stroke();
  }
  for (let y = 70; y < size; y += 80) {
    ctx2.beginPath();
    ctx2.moveTo(0, y);
    ctx2.lineTo(size, y);
    ctx2.stroke();
  }

  // Concrete slabs & commercial industrial warehouses (high reflectance)
  const buildings = [
    { x: 95, y: 85, w: 60, h: 55, color: '#e5e9ec' },
    { x: 180, y: 85, w: 70, h: 55, color: '#f8fafc' },
    { x: 270, y: 90, w: 65, h: 50, color: '#d8dee4' },
    { x: 95, y: 170, w: 60, h: 55, color: '#ffffff' },
    { x: 180, y: 170, w: 70, h: 55, color: '#e2e8f0' },
    { x: 355, y: 165, w: 65, h: 60, color: '#cbd5e1' },
    { x: 270, y: 250, w: 65, h: 55, color: '#f1f5f9' },
    { x: 355, y: 250, w: 70, h: 55, color: '#ffffff' },
    { x: 95, y: 335, w: 60, h: 60, color: '#e2e8f0' },
    { x: 180, y: 335, w: 70, h: 60, color: '#f8fafc' },
    { x: 270, y: 335, w: 65, h: 60, color: '#e5e9ec' },
  ];

  buildings.forEach((b) => {
    // Asphalt foundation
    ctx2.fillStyle = '#475569';
    ctx2.fillRect(b.x - 3, b.y - 3, b.w + 6, b.h + 6);
    // Roof membrane
    ctx2.fillStyle = b.color;
    ctx2.fillRect(b.x, b.y, b.w, b.h);
    // Solar / HVAC modules on roof
    ctx2.fillStyle = '#1e293b';
    ctx2.fillRect(b.x + 8, b.y + 8, b.w - 16, b.h - 16);
  });

  createNoise(ctx2, size, size, 0.05);

  return {
    id: 'dubai-urban-expansion',
    title: 'Dubai South Logistics District',
    location: 'Dubai Logistics City, UAE',
    coordinates: '24°53\'18.4"N, 55°09\'45.0"E',
    historicalDate: '2019-02-10',
    recentDate: '2024-03-15',
    category: 'Urbanization & Infrastructure (Simulation)',
    description: 'Illustrative optical simulation of open desert transition to industrial logistics infrastructure.',
    isDemo: true,
    imageryType: 'Illustrative demo imagery',
    provider: 'Not provided',
    satelliteSensor: 'Illustrative synthetic simulation',
    sceneIdentifier: 'Not provided',
    sourceUrl: 'Not provided',
    historicalOriginalDimensions: '512 × 512 px',
    recentOriginalDimensions: '512 × 512 px',
    comparisonDimensions: '512 × 512 pixels',
    demoNotice: 'Illustrative demo imagery — Source metadata not provided. Illustrative simulation for demonstration and screening purposes only.',
    imageBefore: c1.toDataURL('image/jpeg', 0.92),
    imageAfter: c2.toDataURL('image/jpeg', 0.92),
  };
}

let cachedDemos = null;

export function getAllDemoScenarios() {
  if (!cachedDemos) {
    try {
      cachedDemos = [
        generateRainforestPair(512),
        generateReservoirPair(512),
        generateUrbanPair(512),
      ];
    } catch (e) {
      console.warn('Canvas not ready for demo generation yet:', e);
      return [];
    }
  }
  return cachedDemos;
}

export function getDefaultDemo() {
  const demos = getAllDemoScenarios();
  return demos[0] || null;
}
