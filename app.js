// RailHorizon 360 - Complete Geospatial & Railway Intelligence Cockpit
// Authors: Staff Product Manager, Principal Software Architect, Senior UX Designer
// Integrations: RailRadar Telemetry, MapTiler Vector Engine, OpenTopo DEM, OpenWeather API

import { 
  API_KEYS, 
  TRAINS_DATABASE, 
  DEMO_PNR_DATA, 
  CORRIDORS_RADAR_DATA, 
  STATIONS_LIVE_BOARD, 
  SAAS_FLEET_DATA 
} from './data.js';

class RailHorizonApp {
  constructor() {
    this.currentTrain = TRAINS_DATABASE[0]; // Default: 12951 Mumbai Tejas Rajdhani
    this.map = null;
    this.mapStyle = 'dataviz-dark';
    this.trainMarker = null;
    this.scrubMapMarker = null;
    this.stationMarkers = [];
    this.weatherLayerActive = true;
    this.weatherOpacity = 0.75;
    this.is3DTilted = false;
    
    // Simulation state
    this.isSimulating = false;
    this.simSpeedMultiplier = 2;
    this.simInterval = null;
    this.simProgressRatio = 0.31; // starting around Vadodara
    
    // UI state
    this.activeStationCode = 'NDLS';
    this.activePNR = '2418937210';
    this.activeCorridorId = 'corridor-fog-north';

    this.init();
  }

  async init() {
    this.initClock();
    this.initNavigation();
    this.initGlobalSearch();
    this.renderTrainCockpit();
    this.initMap();
    this.renderStationBoard();
    this.renderPNRInspector();
    this.renderCorridorRadar();
    this.renderFleetWatchlist();
    this.initModalHandlers();
    this.fetchStationLiveWeather('New Delhi');
  }

  // --------------------------------------------------------------------------
  // 1. Clock & Real-time Telemetry Pulse
  // --------------------------------------------------------------------------
  initClock() {
    const clockEl = document.getElementById('system-time-display');
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });
      if (clockEl) {
        clockEl.textContent = `GPS SYNC ${timeStr} IST`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // --------------------------------------------------------------------------
  // 2. Global Navigation Tabs
  // --------------------------------------------------------------------------
  initNavigation() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const views = document.querySelectorAll('.view-section');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));

        btn.classList.add('active');
        const targetViewId = btn.dataset.target;
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
          targetView.classList.add('active');
        }

        // Trigger map resize if switching to cockpit
        if (targetViewId === 'view-cockpit' && this.map) {
          setTimeout(() => this.map.resize(), 100);
        }
      });
    });

    // Brand logo returns to cockpit
    const brandBtn = document.getElementById('brand-home-btn');
    if (brandBtn) {
      brandBtn.addEventListener('click', () => {
        document.getElementById('tab-btn-cockpit')?.click();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. Global Omnibox Search (⌘K / Ctrl+K)
  // --------------------------------------------------------------------------
  initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchDropdown = document.getElementById('search-dropdown-results');

    if (!searchInput || !searchDropdown) return;

    // Keyboard shortcut (⌘K or Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });

    const handleSearch = (query) => {
      const q = query.trim().toLowerCase();
      if (!q) {
        searchDropdown.classList.remove('active');
        searchDropdown.innerHTML = '';
        return;
      }

      let matches = [];

      // Match trains
      TRAINS_DATABASE.forEach(t => {
        if (t.number.includes(q) || t.name.toLowerCase().includes(q) || t.origin.name.toLowerCase().includes(q) || t.destination.name.toLowerCase().includes(q)) {
          matches.push({
            type: 'train',
            title: `${t.number} • ${t.name}`,
            subtitle: `${t.origin.code} ➔ ${t.destination.code} (${t.type})`,
            badge: `${t.currentTelemetry.speedKmh} km/h`,
            item: t
          });
        }
      });

      // Match PNRs
      Object.values(DEMO_PNR_DATA).forEach(p => {
        if (p.pnr.includes(q) || p.trainName.toLowerCase().includes(q)) {
          matches.push({
            type: 'pnr',
            title: `PNR: ${p.pnr}`,
            subtitle: `${p.trainName} • Class ${p.class}`,
            badge: `${p.confirmationProb}% Conf`,
            item: p
          });
        }
      });

      // Match Stations
      const stationsList = [
        { code: 'NDLS', name: 'New Delhi Railway Station' },
        { code: 'MMCT', name: 'Mumbai Central Terminal' },
        { code: 'HWH', name: 'Howrah Junction Kolkata' },
        { code: 'BRC', name: 'Vadodara Junction' },
        { code: 'CNB', name: 'Kanpur Central' }
      ];

      stationsList.forEach(st => {
        if (st.code.toLowerCase().includes(q) || st.name.toLowerCase().includes(q)) {
          matches.push({
            type: 'station',
            title: `${st.name} (${st.code})`,
            subtitle: `Live Station Departure & Arrival Board`,
            badge: 'Terminal',
            item: st
          });
        }
      });

      if (matches.length === 0) {
        searchDropdown.innerHTML = `
          <div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 0.85rem;">
            No railway telemetry found matching "${query}". Try "12951", "Vande Bharat", "NDLS", or "2418937210".
          </div>
        `;
        searchDropdown.classList.add('active');
        return;
      }

      searchDropdown.innerHTML = `
        <div class="search-group-title">Matches (${matches.length})</div>
        ${matches.map(m => `
          <div class="search-item" data-type="${m.type}" data-id="${m.type === 'train' ? m.item.number : (m.type === 'pnr' ? m.item.pnr : m.item.code)}">
            <div class="search-item-info">
              <span class="search-item-title">${m.title}</span>
              <span class="search-item-subtitle">${m.subtitle}</span>
            </div>
            <span class="search-item-badge">${m.badge}</span>
          </div>
        `).join('')}
      `;
      searchDropdown.classList.add('active');

      // Click handler on search items
      searchDropdown.querySelectorAll('.search-item').forEach(el => {
        el.addEventListener('click', () => {
          const type = el.dataset.type;
          const id = el.dataset.id;
          searchDropdown.classList.remove('active');
          searchInput.value = '';

          if (type === 'train') {
            const train = TRAINS_DATABASE.find(t => t.number === id);
            if (train) {
              this.switchTrain(train);
              document.getElementById('tab-btn-cockpit')?.click();
            }
          } else if (type === 'pnr') {
            this.activePNR = id;
            document.getElementById('tab-btn-pnr-inspector')?.click();
            this.inspectPNR(id);
          } else if (type === 'station') {
            this.activeStationCode = id;
            document.getElementById('tab-btn-station-board')?.click();
            this.renderStationBoard();
          }
        });
      });
    };

    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    searchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim()) handleSearch(e.target.value);
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Render Train Cockpit (Left Sidebar & Telemetry)
  // --------------------------------------------------------------------------
  renderTrainCockpit() {
    const t = this.currentTrain;

    // Header & Meta
    document.getElementById('hero-train-number').textContent = t.number;
    document.getElementById('hero-train-zone').textContent = t.zone;
    document.getElementById('hero-train-name').textContent = t.name;
    document.getElementById('hero-origin-code').textContent = t.origin.code;
    document.getElementById('hero-origin-name').textContent = t.origin.name;
    document.getElementById('hero-dest-code').textContent = t.destination.code;
    document.getElementById('hero-dest-name').textContent = t.destination.name;

    // Status Banner
    const statusBanner = document.getElementById('hero-status-banner');
    const statusLabel = document.getElementById('hero-status-label');
    const statusDelta = document.getElementById('hero-status-delta');
    const statusSpeed = document.getElementById('hero-status-speed');

    statusBanner.className = `status-pill-banner ${t.currentTelemetry.statusSeverity}`;
    if (t.currentTelemetry.delayMinutes === 0) {
      statusLabel.textContent = 'ON TIME';
      statusDelta.textContent = 'Operating strictly to schedule';
    } else {
      statusLabel.textContent = 'RUNNING LATE';
      statusDelta.textContent = `+${t.currentTelemetry.delayMinutes} mins behind schedule`;
    }
    statusSpeed.textContent = `${t.currentTelemetry.speedKmh} km/h`;

    // Metrics
    document.getElementById('metric-speed').innerHTML = `${t.currentTelemetry.speedKmh} <span class="metric-unit">km/h</span>`;
    document.getElementById('metric-covered').innerHTML = `${t.currentTelemetry.distanceCoveredKm} <span class="metric-unit">km</span>`;
    document.getElementById('metric-max-speed').innerHTML = `${t.maxPermissibleSpeed} <span class="metric-unit">km/h</span>`;

    // Next Halt
    const nextStn = t.stations.find(s => s.status === 'approaching') || t.stations[1];
    if (nextStn) {
      document.getElementById('next-halt-name').textContent = `${nextStn.name} (${nextStn.code})`;
      document.getElementById('next-halt-eta').textContent = `ETA: ${nextStn.actualArr || nextStn.schedArr}`;
      document.getElementById('next-halt-platform').textContent = `Platform ${nextStn.platform}`;
      const distRem = Math.max(0, nextStn.km - t.currentTelemetry.distanceCoveredKm);
      document.getElementById('next-halt-distance').textContent = `In ${distRem} km`;
    }

    // Schedule Timeline
    const timelineContainer = document.getElementById('station-timeline-container');
    document.getElementById('timeline-station-count').textContent = `${t.stations.length} Halts`;

    timelineContainer.innerHTML = t.stations.map((st, idx) => {
      let nodeClass = st.status; // 'departed' | 'current' | 'approaching' | 'upcoming'
      let delayText = '';
      if (st.delayDep > 0) {
        delayText = `<span class="station-delay-tag delayed">+${st.delayDep}m</span>`;
      } else if (st.delayDep === 0 && st.status === 'departed') {
        delayText = `<span class="station-delay-tag ontime">On Time</span>`;
      }

      return `
        <div class="station-timeline-item ${nodeClass}" data-index="${idx}" data-code="${st.code}">
          <div class="station-node-icon"></div>
          <div class="station-info-row">
            <div>
              <span class="station-name-text">${st.name}</span>
              <span class="station-km-badge">${st.km} km</span>
              <div class="station-sub-details">
                <span>PF ${st.platform}</span>
                <span>•</span>
                <span>Alt: ${st.elevationM}m</span>
              </div>
            </div>
            <div class="station-times">
              <div class="station-sched-time">${st.schedDep !== '--:--' ? st.schedDep : st.schedArr}</div>
              <div>${delayText}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Click on timeline station fly-to
    timelineContainer.querySelectorAll('.station-timeline-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        const stn = t.stations[idx];
        if (stn && this.map) {
          this.map.flyTo({
            center: stn.coords,
            zoom: 11,
            pitch: 30,
            essential: true
          });
        }
      });
    });

    // Render Elevation Profile
    this.renderElevationChart();

    // Setup Simulation controls
    this.initSimulationControls();
  }

  // --------------------------------------------------------------------------
  // 5. MapTiler Vector Engine with MapLibre GL
  // --------------------------------------------------------------------------
  initMap() {
    const defaultCoords = this.currentTrain.currentTelemetry.currentCoords;

    const styleUrl = `https://api.maptiler.com/maps/${this.mapStyle}/style.json?key=${API_KEYS.maptiler}`;

    this.map = new maplibregl.Map({
      container: 'maptiler-map-canvas',
      style: styleUrl,
      center: defaultCoords,
      zoom: 6.5,
      pitch: 0,
      bearing: 0,
      attributionControl: false
    });

    this.map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-left');

    this.map.on('load', () => {
      this.drawTrainRoute();
      this.addWeatherRasterLayer();
      this.addLocomotiveMarker();
      this.addStationMarkers();
    });

    this.initMapHUDControls();
  }

  drawTrainRoute() {
    if (!this.map) return;

    const coordinates = this.currentTrain.stations.map(s => s.coords);

    const geojsonData = {
      type: 'Feature',
      properties: {
        trainNumber: this.currentTrain.number,
        trainName: this.currentTrain.name
      },
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    };

    // Remove existing if present
    if (this.map.getSource('train-corridor-route')) {
      this.map.getSource('train-corridor-route').setData(geojsonData);
      return;
    }

    this.map.addSource('train-corridor-route', {
      type: 'geojson',
      data: geojsonData
    });

    // Outer glow track
    this.map.addLayer({
      id: 'train-corridor-route-glow',
      type: 'line',
      source: 'train-corridor-route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#38bdf8',
        'line-width': 8,
        'line-opacity': 0.35,
        'line-blur': 4
      }
    });

    // Core vector rail track
    this.map.addLayer({
      id: 'train-corridor-route-core',
      type: 'line',
      source: 'train-corridor-route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#0ea5e9',
        'line-width': 3.5,
        'line-opacity': 0.95
      }
    });
  }

  addWeatherRasterLayer() {
    if (!this.map) return;

    const tileUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEYS.openweather}`;

    if (this.map.getSource('openweather-precipitation')) return;

    this.map.addSource('openweather-precipitation', {
      type: 'raster',
      tiles: [tileUrl],
      tileSize: 256
    });

    this.map.addLayer({
      id: 'openweather-precipitation-layer',
      type: 'raster',
      source: 'openweather-precipitation',
      paint: {
        'raster-opacity': this.weatherOpacity
      }
    });
  }

  addLocomotiveMarker() {
    if (!this.map) return;
    if (this.trainMarker) this.trainMarker.remove();

    const t = this.currentTrain;
    const el = document.createElement('div');
    el.className = 'train-custom-marker';
    el.title = `${t.number} - ${t.name} (${t.currentTelemetry.speedKmh} km/h)`;
    el.innerHTML = `
      <div class="marker-pulse-ring"></div>
      <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
    `;

    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
      <div style="font-family: var(--font-sans); padding: 4px; color: #070a11;">
        <strong style="font-size: 0.9rem; color: #0284c7;">${t.number} ${t.name}</strong><br>
        <span style="font-size: 0.75rem; color: #475569;">Speed: ${t.currentTelemetry.speedKmh} km/h • Heading: ${t.currentTelemetry.heading}°</span><br>
        <span style="font-size: 0.75rem; font-weight: 700; color: ${t.currentTelemetry.delayMinutes > 0 ? '#e11d48' : '#16a34a'};">
          ${t.currentTelemetry.delayMinutes > 0 ? `Late by +${t.currentTelemetry.delayMinutes} mins` : 'On Time'}
        </span>
      </div>
    `);

    this.trainMarker = new maplibregl.Marker({ element: el, rotationAlignment: 'map' })
      .setLngLat(t.currentTelemetry.currentCoords)
      .setPopup(popup)
      .addTo(this.map);
  }

  addStationMarkers() {
    if (!this.map) return;

    this.stationMarkers.forEach(m => m.remove());
    this.stationMarkers = [];

    this.currentTrain.stations.forEach(st => {
      const el = document.createElement('div');
      el.className = 'station-custom-marker';
      el.title = `${st.name} (${st.code})`;

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="font-family: var(--font-sans); padding: 4px; color: #070a11;">
          <strong style="font-size: 0.88rem; color: #1e293b;">${st.name} (${st.code})</strong><br>
          <span style="font-size: 0.75rem; color: #64748b;">Distance: ${st.km} km • Elevation: ${st.elevationM}m MSL</span><br>
          <span style="font-size: 0.75rem; color: #0f172a;">Platform ${st.platform} • Sched: ${st.schedArr !== '--:--' ? st.schedArr : st.schedDep}</span>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(st.coords)
        .setPopup(popup)
        .addTo(this.map);

      this.stationMarkers.push(marker);
    });
  }

  initMapHUDControls() {
    // Style switchers
    const styleButtons = [
      { id: 'btn-style-dark', style: 'dataviz-dark' },
      { id: 'btn-style-topo', style: 'topo-v2' },
      { id: 'btn-style-hybrid', style: 'hybrid' }
    ];

    styleButtons.forEach(btnObj => {
      const btn = document.getElementById(btnObj.id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        styleButtons.forEach(b => document.getElementById(b.id)?.classList.remove('active'));
        btn.classList.add('active');
        this.mapStyle = btnObj.style;
        const newStyleUrl = `https://api.maptiler.com/maps/${this.mapStyle}/style.json?key=${API_KEYS.maptiler}`;
        this.map.setStyle(newStyleUrl);

        // Re-add layers when style reloads
        this.map.once('style.load', () => {
          this.drawTrainRoute();
          if (this.weatherLayerActive) this.addWeatherRasterLayer();
        });
      });
    });

    // 3D Pitch Tilt Toggle
    const pitchBtn = document.getElementById('btn-toggle-3d-pitch');
    if (pitchBtn) {
      pitchBtn.addEventListener('click', () => {
        this.is3DTilted = !this.is3DTilted;
        pitchBtn.classList.toggle('active', this.is3DTilted);
        this.map.easeTo({
          pitch: this.is3DTilted ? 50 : 0,
          bearing: this.is3DTilted ? 25 : 0,
          duration: 1000
        });
      });
    }

    // Weather Layer Toggle
    const weatherBtn = document.getElementById('btn-toggle-weather-layer');
    if (weatherBtn) {
      weatherBtn.addEventListener('click', () => {
        this.weatherLayerActive = !this.weatherLayerActive;
        weatherBtn.classList.toggle('active', this.weatherLayerActive);

        if (this.map.getLayer('openweather-precipitation-layer')) {
          this.map.setLayoutProperty(
            'openweather-precipitation-layer',
            'visibility',
            this.weatherLayerActive ? 'visible' : 'none'
          );
        } else if (this.weatherLayerActive) {
          this.addWeatherRasterLayer();
        }
      });
    }

    // Radar Opacity Slider
    const opacityInput = document.getElementById('radar-opacity-input');
    const opacityValLabel = document.getElementById('radar-opacity-val');
    if (opacityInput && opacityValLabel) {
      opacityInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.weatherOpacity = val / 100;
        opacityValLabel.textContent = `${val}%`;
        if (this.map.getLayer('openweather-precipitation-layer')) {
          this.map.setPaintProperty('openweather-precipitation-layer', 'raster-opacity', this.weatherOpacity);
        }
      });
    }

    // Recenter Camera Button
    const recenterBtn = document.getElementById('btn-recenter-train');
    if (recenterBtn) {
      recenterBtn.addEventListener('click', () => {
        const coords = this.currentTrain.currentTelemetry.currentCoords;
        this.map.flyTo({
          center: coords,
          zoom: 8.5,
          speed: 1.2,
          essential: true
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. OpenTopo Elevation Profile & Interactive Bi-Directional Scrubber
  // --------------------------------------------------------------------------
  renderElevationChart() {
    const svgEl = document.getElementById('elevation-svg-element');
    const badge = document.getElementById('elevation-hover-badge');
    const drawer = document.getElementById('elevation-drawer-component');
    const toggleBtn = document.getElementById('btn-collapse-elevation');
    const toggleHeader = document.getElementById('elevation-toggle-header');

    if (!svgEl) return;

    // Toggle collapse drawer
    if (toggleHeader) {
      toggleHeader.onclick = () => {
        drawer.classList.toggle('collapsed');
        toggleBtn.textContent = drawer.classList.contains('collapsed') ? '▲' : '▼';
      };
    }

    const profile = this.currentTrain.elevationProfile;
    const maxKm = this.currentTrain.totalDistanceKm;
    const maxAlt = Math.max(...profile.map(p => p.alt), 600);

    const width = 1000;
    const height = 150;
    const padding = { top: 20, right: 30, bottom: 25, left: 50 };

    const getX = (km) => padding.left + (km / maxKm) * (width - padding.left - padding.right);
    const getY = (alt) => height - padding.bottom - (alt / maxAlt) * (height - padding.top - padding.bottom);

    // Build SVG Path points
    let pathD = `M ${getX(profile[0].km)} ${getY(profile[0].alt)}`;
    profile.forEach(p => {
      pathD += ` L ${getX(p.km)} ${getY(p.alt)}`;
    });

    const areaD = `${pathD} L ${getX(profile[profile.length - 1].km)} ${height - padding.bottom} L ${getX(profile[0].km)} ${height - padding.bottom} Z`;

    // Calculate current train position on chart
    const trainKm = this.currentTrain.currentTelemetry.distanceCoveredKm;
    const trainX = getX(trainKm);
    
    // Interpolate altitude at trainKm
    let trainAlt = profile[0].alt;
    for (let i = 0; i < profile.length - 1; i++) {
      if (trainKm >= profile[i].km && trainKm <= profile[i + 1].km) {
        const ratio = (trainKm - profile[i].km) / (profile[i + 1].km - profile[i].km);
        trainAlt = profile[i].alt + ratio * (profile[i + 1].alt - profile[i].alt);
        break;
      }
    }
    const trainY = getY(trainAlt);

    svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgEl.innerHTML = `
      <defs>
        <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.38"/>
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"/>
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      <line x1="${padding.left}" y1="${getY(0)}" x2="${width - padding.right}" y2="${getY(0)}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="${padding.left}" y1="${getY(250)}" x2="${width - padding.right}" y2="${getY(250)}" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="4 4"/>
      <line x1="${padding.left}" y1="${getY(500)}" x2="${width - padding.right}" y2="${getY(500)}" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="4 4"/>

      <!-- Altitude Axis Labels -->
      <text x="${padding.left - 8}" y="${getY(0) + 4}" fill="#64748b" font-size="10" text-anchor="end" font-family="JetBrains Mono">0m</text>
      <text x="${padding.left - 8}" y="${getY(250) + 4}" fill="#64748b" font-size="10" text-anchor="end" font-family="JetBrains Mono">250m</text>
      <text x="${padding.left - 8}" y="${getY(500) + 4}" fill="#64748b" font-size="10" text-anchor="end" font-family="JetBrains Mono">500m</text>

      <!-- Area fill & Line path -->
      <path d="${areaD}" fill="url(#elevationGradient)" />
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round" />

      <!-- Major Waypoint Dots & Labels -->
      ${profile.filter((_, idx) => idx % 2 === 0).map(p => `
        <circle cx="${getX(p.km)}" cy="${getY(p.alt)}" r="3" fill="#ffffff" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="${getX(p.km)}" y="${height - 8}" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="Inter">${p.km}km</text>
      `).join('')}

      <!-- Current Live Train Indicator -->
      <line x1="${trainX}" y1="${padding.top}" x2="${trainX}" y2="${height - padding.bottom}" stroke="#10b981" stroke-width="2" stroke-dasharray="3 3"/>
      <circle cx="${trainX}" cy="${trainY}" r="5.5" fill="#10b981" stroke="#ffffff" stroke-width="2">
        <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x="${trainX}" y="${trainY - 10}" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle" font-family="JetBrains Mono">
        LIVE ${Math.round(trainAlt)}m
      </text>

      <!-- Scrubber Cursor elements (Hidden by default) -->
      <g id="elevation-scrub-group" style="display: none;">
        <line id="scrub-line" class="scrub-vertical-line" x1="0" y1="${padding.top}" x2="0" y2="${height - padding.bottom}"/>
        <circle id="scrub-dot" class="scrub-point-dot" cx="0" cy="0" r="5"/>
      </g>
    `;

    // Interactive Mouse Scrubbing with Map Synchronization
    const scrubGroup = svgEl.querySelector('#elevation-scrub-group');
    const scrubLine = svgEl.querySelector('#scrub-line');
    const scrubDot = svgEl.querySelector('#scrub-dot');

    svgEl.onmousemove = (e) => {
      const rect = svgEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const svgX = (mouseX / rect.width) * width;

      if (svgX < padding.left || svgX > width - padding.right) {
        scrubGroup.style.display = 'none';
        return;
      }

      scrubGroup.style.display = 'block';
      const scrubKm = Math.round(((svgX - padding.left) / (width - padding.left - padding.right)) * maxKm);

      // Find elevation and nearest label
      let currentSample = profile[0];
      for (let i = 0; i < profile.length - 1; i++) {
        if (scrubKm >= profile[i].km && scrubKm <= profile[i + 1].km) {
          const ratio = (scrubKm - profile[i].km) / (profile[i + 1].km - profile[i].km);
          const alt = profile[i].alt + ratio * (profile[i + 1].alt - profile[i].alt);
          currentSample = { km: scrubKm, alt: Math.round(alt), label: profile[i + 1].label };
          break;
        }
      }

      const pointY = getY(currentSample.alt);
      scrubLine.setAttribute('x1', svgX);
      scrubLine.setAttribute('x2', svgX);
      scrubDot.setAttribute('cx', svgX);
      scrubDot.setAttribute('cy', pointY);

      badge.innerHTML = `KM ${currentSample.km} • Altitude: <strong>${currentSample.alt}m MSL</strong> • Corridor: ${currentSample.label}`;

      // Project corresponding coordinates on Map
      this.highlightScrubLocationOnMap(currentSample.km, maxKm);
    };

    svgEl.onmouseleave = () => {
      scrubGroup.style.display = 'none';
      badge.textContent = 'Hover along profile to inspect terrain altitude & gradient';
      if (this.scrubMapMarker) {
        this.scrubMapMarker.remove();
        this.scrubMapMarker = null;
      }
    };
  }

  highlightScrubLocationOnMap(km, totalKm) {
    if (!this.map) return;

    // Interpolate coordinates along station points
    const stations = this.currentTrain.stations;
    let targetCoords = stations[0].coords;

    for (let i = 0; i < stations.length - 1; i++) {
      if (km >= stations[i].km && km <= stations[i + 1].km) {
        const ratio = (km - stations[i].km) / (stations[i + 1].km - stations[i].km);
        const lng = stations[i].coords[0] + ratio * (stations[i + 1].coords[0] - stations[i].coords[0]);
        const lat = stations[i].coords[1] + ratio * (stations[i + 1].coords[1] - stations[i].coords[1]);
        targetCoords = [lng, lat];
        break;
      }
    }

    if (!this.scrubMapMarker) {
      const el = document.createElement('div');
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#38bdf8';
      el.style.border = '2px solid #ffffff';
      el.style.boxShadow = '0 0 10px #38bdf8';
      this.scrubMapMarker = new maplibregl.Marker({ element: el }).setLngLat(targetCoords).addTo(this.map);
    } else {
      this.scrubMapMarker.setLngLat(targetCoords);
    }
  }

  // --------------------------------------------------------------------------
  // 7. Live Movement Simulation Engine
  // --------------------------------------------------------------------------
  initSimulationControls() {
    const simBtn = document.getElementById('btn-toggle-simulation');
    const speedBtn = document.getElementById('btn-sim-speed');

    if (!simBtn || !speedBtn) return;

    simBtn.onclick = () => {
      this.isSimulating = !this.isSimulating;
      simBtn.classList.toggle('simulating', this.isSimulating);
      document.getElementById('sim-btn-text').textContent = this.isSimulating ? 'Pause Simulation' : 'Simulate Live Movement';

      if (this.isSimulating) {
        this.startSimulation();
      } else {
        this.stopSimulation();
      }
    };

    speedBtn.onclick = () => {
      if (this.simSpeedMultiplier === 2) this.simSpeedMultiplier = 5;
      else if (this.simSpeedMultiplier === 5) this.simSpeedMultiplier = 10;
      else this.simSpeedMultiplier = 2;
      speedBtn.textContent = `Speed: ${this.simSpeedMultiplier}x`;
    };
  }

  startSimulation() {
    if (this.simInterval) clearInterval(this.simInterval);

    this.simInterval = setInterval(() => {
      this.simProgressRatio += 0.0015 * (this.simSpeedMultiplier / 2);
      if (this.simProgressRatio > 0.98) this.simProgressRatio = 0.05;

      const t = this.currentTrain;
      const totalDist = t.totalDistanceKm;
      const currentKm = Math.round(this.simProgressRatio * totalDist);
      t.currentTelemetry.distanceCoveredKm = currentKm;

      // Realistic speed fluctuation
      const baseSpeed = t.currentTelemetry.speedKmh;
      const jitter = Math.floor(Math.sin(Date.now() / 2000) * 8);
      const simulatedSpeed = Math.min(t.maxPermissibleSpeed, Math.max(75, 105 + jitter));
      t.currentTelemetry.speedKmh = simulatedSpeed;

      // Interpolate GPS coordinates
      const stations = t.stations;
      for (let i = 0; i < stations.length - 1; i++) {
        if (currentKm >= stations[i].km && currentKm <= stations[i + 1].km) {
          const ratio = (currentKm - stations[i].km) / (stations[i + 1].km - stations[i].km);
          const lng = stations[i].coords[0] + ratio * (stations[i + 1].coords[0] - stations[i].coords[0]);
          const lat = stations[i].coords[1] + ratio * (stations[i + 1].coords[1] - stations[i].coords[1]);
          t.currentTelemetry.currentCoords = [lng, lat];
          break;
        }
      }

      // Update UI displays
      document.getElementById('metric-speed').innerHTML = `${simulatedSpeed} <span class="metric-unit">km/h</span>`;
      document.getElementById('metric-covered').innerHTML = `${currentKm} <span class="metric-unit">km</span>`;
      document.getElementById('hero-status-speed').textContent = `${simulatedSpeed} km/h`;

      // Update Map Marker
      if (this.trainMarker) {
        this.trainMarker.setLngLat(t.currentTelemetry.currentCoords);
      }

      // Refresh Elevation pin
      this.renderElevationChart();
    }, 400);
  }

  stopSimulation() {
    if (this.simInterval) {
      clearInterval(this.simInterval);
      this.simInterval = null;
    }
  }

  switchTrain(train) {
    this.stopSimulation();
    this.currentTrain = train;
    this.simProgressRatio = 0.3;
    this.renderTrainCockpit();
    if (this.map) {
      this.drawTrainRoute();
      this.addLocomotiveMarker();
      this.addStationMarkers();
      this.map.flyTo({
        center: train.currentTelemetry.currentCoords,
        zoom: 7,
        essential: true
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. Live Station Board View
  // --------------------------------------------------------------------------
  renderStationBoard() {
    const activeStn = this.activeStationCode;
    const records = STATIONS_LIVE_BOARD[activeStn] || STATIONS_LIVE_BOARD['NDLS'];
    const tbody = document.getElementById('station-board-tbody');
    const titleEl = document.getElementById('station-board-active-name');

    const names = {
      'NDLS': 'New Delhi Railway Station (NDLS)',
      'MMCT': 'Mumbai Central Terminal (MMCT)',
      'HWH': 'Howrah Junction Kolkata (HWH)'
    };

    if (titleEl) titleEl.textContent = names[activeStn] || `${activeStn} Railway Station`;

    if (tbody) {
      tbody.innerHTML = records.map(r => `
        <tr>
          <td>
            <div class="train-cell-title">
              <span class="train-cell-num">${r.number}</span>
              <span>${r.name}</span>
            </div>
            <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">${r.type}</div>
          </td>
          <td>${r.dest}</td>
          <td style="font-family: var(--font-mono);">${r.sched}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: ${r.delay > 0 ? 'var(--status-delayed)' : '#cbd5e1'};">
            ${r.expected}
          </td>
          <td>
            <span class="badge-platform">Platform ${r.platform}</span>
          </td>
          <td>
            <span class="corridor-status-tag ${r.delay > 0 ? 'medium' : 'low'}">
              ${r.status}
            </span>
          </td>
          <td>
            <button class="btn-track-action" data-train-num="${r.number}">Track Live</button>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.btn-track-action').forEach(btn => {
        btn.addEventListener('click', () => {
          const num = btn.dataset.trainNum;
          const found = TRAINS_DATABASE.find(t => t.number === num);
          if (found) {
            this.switchTrain(found);
            document.getElementById('tab-btn-cockpit')?.click();
          } else {
            alert(`Train ${num} telemetry stream is currently loaded into tracking corridor.`);
          }
        });
      });
    }

    // Station Quick Select Pills
    document.querySelectorAll('.station-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.stcode === activeStn);
      btn.onclick = () => {
        this.activeStationCode = btn.dataset.stcode;
        this.renderStationBoard();
        const cityMap = { 'NDLS': 'New Delhi', 'MMCT': 'Mumbai', 'HWH': 'Kolkata' };
        this.fetchStationLiveWeather(cityMap[this.activeStationCode] || 'New Delhi');
      };
    });
  }

  // --------------------------------------------------------------------------
  // 9. OpenWeather API Integration
  // --------------------------------------------------------------------------
  async fetchStationLiveWeather(city) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEYS.openweather}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather fetch status ${res.status}`);
      const data = await res.json();

      const temp = Math.round(data.main.temp);
      const hum = data.main.humidity;
      const vis = data.visibility || 10000;
      const windKmh = Math.round((data.wind.speed || 0) * 3.6);
      const desc = data.weather[0]?.main || 'Clear';

      // Update Live Station Weather Board
      const tempEl = document.getElementById('stn-weather-temp');
      const descEl = document.getElementById('stn-weather-desc');
      const visEl = document.getElementById('stn-weather-vis');
      const humEl = document.getElementById('stn-weather-hum');
      const windEl = document.getElementById('stn-weather-wind');
      const hazardEl = document.getElementById('stn-weather-hazard');

      if (tempEl) tempEl.textContent = `${temp}°C`;
      if (descEl) descEl.textContent = `${desc} (${city})`;
      if (visEl) visEl.textContent = vis < 1000 ? `${vis}m` : `${(vis / 1000).toFixed(1)}km`;
      if (humEl) humEl.textContent = `${hum}%`;
      if (windEl) windEl.textContent = `${windKmh} km/h`;

      if (hazardEl) {
        if (vis < 250) {
          hazardEl.textContent = 'Severe Fog Hazard';
          hazardEl.style.color = 'var(--status-delayed)';
        } else if (vis < 1000 || hum > 85) {
          hazardEl.textContent = 'Moderate Fog/Rain';
          hazardEl.style.color = 'var(--status-warning)';
        } else {
          hazardEl.textContent = 'Nominal / Clear';
          hazardEl.style.color = 'var(--status-ontime)';
        }
      }
    } catch (err) {
      console.warn('Using calibrated station weather data:', err.message);
    }
  }

  // --------------------------------------------------------------------------
  // 10. PNR Status & Coach Rake Inspector
  // --------------------------------------------------------------------------
  renderPNRInspector() {
    this.inspectPNR(this.activePNR);

    // Form search button
    const fetchBtn = document.getElementById('btn-fetch-pnr');
    const pnrInput = document.getElementById('pnr-query-input');
    if (fetchBtn && pnrInput) {
      fetchBtn.onclick = () => {
        const val = pnrInput.value.trim();
        if (val.length === 10) {
          this.inspectPNR(val);
        } else {
          alert('Please enter a valid 10-digit numeric Indian Railways PNR.');
        }
      };
    }

    // Demo pills
    document.querySelectorAll('.pnr-demo-chip').forEach(chip => {
      chip.onclick = () => {
        const pnr = chip.dataset.pnr;
        if (pnrInput) pnrInput.value = pnr;
        this.inspectPNR(pnr);
      };
    });
  }

  inspectPNR(pnrNumber) {
    const data = DEMO_PNR_DATA[pnrNumber] || DEMO_PNR_DATA['2418937210'];
    this.activePNR = data.pnr;

    document.getElementById('pnr-card-number').textContent = `PNR: ${data.pnr}`;
    document.getElementById('pnr-card-train-title').textContent = `${data.trainNumber} • ${data.trainName}`;
    document.getElementById('pnr-card-journey-meta').textContent = `${data.from} ➔ ${data.to} • DOJ: ${data.doj} • Class: ${data.class} (${data.quota} Quota)`;
    document.getElementById('pnr-chart-badge').textContent = data.chartStatus;

    // Passenger Rows
    const tbody = document.getElementById('pnr-passengers-tbody');
    tbody.innerHTML = data.passengers.map(p => `
      <tr>
        <td>
          <div style="font-weight: 700; color: #ffffff;">${p.name}</div>
          <div style="font-size: 0.72rem; color: #64748b;">Passenger #${p.num}</div>
        </td>
        <td style="font-family: var(--font-mono); color: #94a3b8;">${p.bookingStatus}</td>
        <td>
          <span class="corridor-status-tag ${p.statusBadge === 'confirmed' ? 'low' : 'medium'}">
            ${p.currentStatus}
          </span>
        </td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--brand-cyan);">
          Coach ${p.coach} / Berth ${p.berth}
        </td>
        <td style="font-size: 0.8rem; color: #cbd5e1;">${p.berthType}</td>
      </tr>
    `).join('');

    // Confirmation Probability Meter
    const gaugeCircle = document.getElementById('gauge-circle-progress');
    const gaugeText = document.getElementById('gauge-percentage-text');
    const gaugeDesc = document.getElementById('gauge-status-desc');

    if (gaugeCircle && gaugeText) {
      const prob = data.confirmationProb;
      gaugeText.textContent = `${prob}%`;
      const circumference = 264;
      const offset = circumference - (prob / 100) * circumference;
      gaugeCircle.style.strokeDashoffset = offset;

      if (prob >= 90) {
        gaugeDesc.textContent = 'High Odds / Confirmed';
        gaugeDesc.style.color = '#10b981';
      } else if (prob >= 60) {
        gaugeDesc.textContent = 'Moderate Probability';
        gaugeDesc.style.color = '#f59e0b';
      } else {
        gaugeDesc.textContent = 'Low Clearance Probability';
        gaugeDesc.style.color = '#f43f5e';
      }
    }

    // Render Visual Rake
    this.renderCoachRake(data);
  }

  renderCoachRake(pnrData) {
    const container = document.getElementById('rake-assembly-container');
    const assignedCoachCode = pnrData.passengers[0]?.coach || 'B4';
    document.getElementById('user-coach-highlight-tag').textContent = assignedCoachCode;

    // Use current train's rake or standard
    const rake = this.currentTrain.rakeComposition || [
      { code: 'ENG', label: 'WAP-7', type: 'LOCO' },
      { code: 'EOG1', label: 'End on Gen', type: 'EOG' },
      { code: 'B1', label: '3-Tier AC', type: '3A' },
      { code: 'B2', label: '3-Tier AC', type: '3A' },
      { code: 'B3', label: '3-Tier AC', type: '3A' },
      { code: 'B4', label: '3-Tier AC', type: '3A' },
      { code: 'A1', label: '2-Tier AC', type: '2A' },
      { code: 'H1', label: '1st AC', type: '1A' }
    ];

    container.innerHTML = rake.map(c => {
      const isAssigned = (c.code === assignedCoachCode);
      return `
        <div class="rake-coach-box ${isAssigned ? 'active-user-coach' : ''}" data-coach-code="${c.code}" data-coach-type="${c.label}">
          ${isAssigned ? '<div class="user-coach-beacon" title="Your Assigned Coach"></div>' : ''}
          <span class="rake-coach-code">${c.code}</span>
          <span class="rake-coach-label">${c.label}</span>
        </div>
      `;
    }).join('');

    // Open Coach Floorplan on click
    container.querySelectorAll('.rake-coach-box').forEach(box => {
      box.onclick = () => {
        const code = box.dataset.coachCode;
        const type = box.dataset.coachType;
        this.openCoachFloorplan(code, type, pnrData);
      };
    });
  }

  // --------------------------------------------------------------------------
  // 11. Modal: Coach Berth Floorplan
  // --------------------------------------------------------------------------
  initModalHandlers() {
    const modal = document.getElementById('coach-floorplan-modal');
    const closeBtn = document.getElementById('btn-close-floorplan-modal');

    if (closeBtn && modal) {
      closeBtn.onclick = () => modal.classList.remove('active');
      modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
      };
    }
  }

  openCoachFloorplan(coachCode, coachType, pnrData) {
    const modal = document.getElementById('coach-floorplan-modal');
    const title = document.getElementById('modal-coach-title');
    const grid = document.getElementById('floorplan-berth-grid-container');

    if (!modal || !grid) return;

    title.textContent = `Coach ${coachCode} (${coachType}) - Visual Compartment Layout`;
    const userBerth = pnrData.passengers[0]?.berth || 35;

    // Generate 64 berths for 3-Tier AC coach
    const berthTypes = ['LB', 'MB', 'UB', 'LB', 'MB', 'UB', 'SL', 'SU'];
    let cellsHtml = '';

    for (let i = 1; i <= 64; i++) {
      const typeCode = berthTypes[(i - 1) % 8];
      const isAssigned = (i === userBerth);

      cellsHtml += `
        <div class="berth-cell ${isAssigned ? 'assigned' : ''}" title="Berth #${i} (${typeCode})">
          <div class="berth-num">${i}</div>
          <div class="berth-type-code">${typeCode}</div>
        </div>
      `;
    }

    grid.innerHTML = cellsHtml;
    modal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // 12. Corridor Weather Radar & Atmospheric Hazards
  // --------------------------------------------------------------------------
  renderCorridorRadar() {
    const tabsContainer = document.getElementById('corridors-tabs-container');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = CORRIDORS_RADAR_DATA.map(c => `
      <div class="corridor-tab-card ${c.id === this.activeCorridorId ? 'active' : ''}" data-id="${c.id}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #94a3b8;">${c.lengthKm} km</span>
          <span class="corridor-status-tag ${c.riskLevel.toLowerCase()}">${c.riskLevel} RISK</span>
        </div>
        <div style="font-family: var(--font-sans); font-size: 0.95rem; font-weight: 700; color: #ffffff;">${c.name}</div>
        <div style="font-size: 0.76rem; color: var(--brand-cyan); margin-top: 4px;">${c.hazardType}</div>
      </div>
    `).join('');

    tabsContainer.querySelectorAll('.corridor-tab-card').forEach(card => {
      card.onclick = () => {
        this.activeCorridorId = card.dataset.id;
        this.renderCorridorRadar();
      };
    });

    const activeCorridor = CORRIDORS_RADAR_DATA.find(c => c.id === this.activeCorridorId) || CORRIDORS_RADAR_DATA[0];

    document.getElementById('corridor-active-title').textContent = activeCorridor.name;
    const badge = document.getElementById('corridor-active-badge');
    badge.textContent = `${activeCorridor.riskLevel} HAZARD`;
    badge.className = `corridor-status-tag ${activeCorridor.riskLevel.toLowerCase()}`;

    document.getElementById('corridor-hazard-heading').textContent = activeCorridor.hazardType;
    document.getElementById('corridor-hazard-text').textContent = activeCorridor.summary;

    document.getElementById('corridor-temp').textContent = activeCorridor.weatherMetrics.avgTemp;
    document.getElementById('corridor-vis').textContent = `${activeCorridor.weatherMetrics.visibilityM} m`;
    document.getElementById('corridor-hum').textContent = activeCorridor.weatherMetrics.humidity;
    document.getElementById('corridor-trains').textContent = activeCorridor.activeTrains;

    this.renderCorrelationChart(activeCorridor.delayCorrelation);
  }

  renderCorrelationChart(data) {
    const chart = document.getElementById('corridor-correlation-chart');
    if (!chart || !data) return;

    const width = 500;
    const height = 180;
    const pad = { top: 20, right: 30, bottom: 25, left: 45 };

    const maxDelay = 90;
    const getX = (idx) => pad.left + (idx / (data.length - 1)) * (width - pad.left - pad.right);
    const getY = (delay) => height - pad.bottom - (delay / maxDelay) * (height - pad.top - pad.bottom);

    let pathD = `M ${getX(0)} ${getY(data[0].delayMins)}`;
    data.forEach((d, idx) => {
      pathD += ` L ${getX(idx)} ${getY(d.delayMins)}`;
    });

    chart.setAttribute('viewBox', `0 0 ${width} ${height}`);
    chart.innerHTML = `
      <!-- Horizontal Delay Grid -->
      <line x1="${pad.left}" y1="${getY(0)}" x2="${width - pad.right}" y2="${getY(0)}" stroke="rgba(255,255,255,0.08)"/>
      <line x1="${pad.left}" y1="${getY(30)}" x2="${width - pad.right}" y2="${getY(30)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>
      <line x1="${pad.left}" y1="${getY(60)}" x2="${width - pad.right}" y2="${getY(60)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>

      <text x="${pad.left - 6}" y="${getY(0) + 4}" fill="#64748b" font-size="9" text-anchor="end" font-family="JetBrains Mono">0m</text>
      <text x="${pad.left - 6}" y="${getY(30) + 4}" fill="#64748b" font-size="9" text-anchor="end" font-family="JetBrains Mono">+30m</text>
      <text x="${pad.left - 6}" y="${getY(60) + 4}" fill="#64748b" font-size="9" text-anchor="end" font-family="JetBrains Mono">+60m</text>

      <!-- Curve -->
      <path d="${pathD}" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Data Dots -->
      ${data.map((d, idx) => `
        <circle cx="${getX(idx)}" cy="${getY(d.delayMins)}" r="4" fill="#ffffff" stroke="#f43f5e" stroke-width="2"/>
        <text x="${getX(idx)}" y="${height - 8}" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="Inter">${d.time}</text>
      `).join('')}
    `;
  }

  // --------------------------------------------------------------------------
  // 13. B2B SaaS Fleet Watchlist
  // --------------------------------------------------------------------------
  renderFleetWatchlist() {
    const tbody = document.getElementById('fleet-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = SAAS_FLEET_DATA.map(f => `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--brand-cyan);">${f.id}</td>
        <td style="font-weight: 600; color: #ffffff;">${f.rakeName}</td>
        <td>${f.origin} ➔ ${f.dest}</td>
        <td style="font-family: var(--font-mono);">${f.speed}</td>
        <td style="color: #cbd5e1;">${f.corridor}</td>
        <td>
          <span style="font-size: 0.78rem; color: #94a3b8;">${f.weatherRisk}</span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="health-bar-wrapper">
              <div class="health-bar-fill" style="width: ${f.healthScore}%; background-color: ${f.healthScore > 85 ? '#10b981' : '#f59e0b'};"></div>
            </div>
            <span style="font-family: var(--font-mono); font-size: 0.78rem;">${f.healthScore}%</span>
          </div>
        </td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: ${f.delayMins > 30 ? 'var(--status-delayed)' : '#10b981'};">
          +${f.delayMins}m
        </td>
      </tr>
    `).join('');

    // Export CSV Download
    const exportBtn = document.getElementById('btn-export-fleet-csv');
    if (exportBtn) {
      exportBtn.onclick = () => {
        let csvContent = "data:text/csv;charset=utf-8,Rake ID,Consignment,Origin,Destination,Speed,Corridor,Weather Risk,Health Score,Delay Minutes\n";
        SAAS_FLEET_DATA.forEach(row => {
          csvContent += `"${row.id}","${row.rakeName}","${row.origin}","${row.dest}","${row.speed}","${row.corridor}","${row.weatherRisk}",${row.healthScore},${row.delayMins}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `railhorizon_fleet_audit_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.railHorizonApp = new RailHorizonApp();
});
