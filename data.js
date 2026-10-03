// RailHorizon 360 - Comprehensive Railway, Corridor, Elevation & Weather Datasets
// Integrated with RailRadar, MapTiler, OpenTopo, and OpenWeather APIs

export const API_KEYS = {
  maptiler: 'mnxtRwonc66QSP7qRrko',
  openweather: '798e006ce0b1fc5f40e2adaa2e273198',
  opentopo: '789bd9c9b89a0539e1e06f58e62144b3',
  railradar: 'rg_ed4678f11c1f461a908f3317a2f1aa8c'
};

export const TRAINS_DATABASE = [
  {
    number: "12951",
    name: "Mumbai Tejas Rajdhani Express",
    type: "Tejas Superfast Express",
    zone: "Western Railway (WR)",
    origin: { name: "Mumbai Central", code: "MMCT", city: "Mumbai", coords: [72.8193, 18.9696] },
    destination: { name: "New Delhi", code: "NDLS", city: "New Delhi", coords: [77.2215, 28.6415] },
    totalDistanceKm: 1386,
    avgSpeedKmh: 88,
    maxPermissibleSpeed: 130,
    currentTelemetry: {
      speedKmh: 108,
      status: "RUNNING",
      delayMinutes: 14,
      statusSeverity: "warning", // 'ontime' | 'warning' | 'delayed'
      lastReportedStation: "Vadodara Jn (BRC)",
      nextStation: "Ratlam Jn (RTM)",
      distanceCoveredKm: 428,
      currentCoords: [73.5412, 22.8123],
      heading: 32, // degrees
      locoNumber: "WAP-7 #30452 (BRC Shed)",
      coachCount: 20,
      rakeType: "Tejas LHB Smart Rake"
    },
    elevationRange: { minM: 12, maxM: 580 },
    stations: [
      { code: "MMCT", name: "Mumbai Central", km: 0, schedArr: "--:--", schedDep: "17:00", actualArr: "--:--", actualDep: "17:00", delayArr: 0, delayDep: 0, status: "departed", platform: 1, elevationM: 14, coords: [72.8193, 18.9696] },
      { code: "BVI", name: "Borivali", km: 30, schedArr: "17:22", schedDep: "17:24", actualArr: "17:23", actualDep: "17:25", delayArr: 1, delayDep: 1, status: "departed", platform: 6, elevationM: 18, coords: [72.8569, 19.2291] },
      { code: "ST", name: "Surat", km: 263, schedArr: "19:43", schedDep: "19:48", actualArr: "19:50", actualDep: "19:54", delayArr: 7, delayDep: 6, status: "departed", platform: 1, elevationM: 21, coords: [72.8407, 21.2044] },
      { code: "BRC", name: "Vadodara Jn", km: 393, schedArr: "21:06", schedDep: "21:16", actualArr: "21:18", actualDep: "21:28", delayArr: 12, delayDep: 12, status: "departed", platform: 2, elevationM: 36, coords: [73.1812, 22.3107] },
      { code: "RTM", name: "Ratlam Jn", km: 653, schedArr: "00:25", schedDep: "00:28", actualArr: "00:39", actualDep: "00:42", delayArr: 14, delayDep: 14, status: "approaching", platform: 5, elevationM: 488, coords: [75.0560, 23.3441] },
      { code: "KOTA", name: "Kota Jn", km: 920, schedArr: "03:15", schedDep: "03:20", actualArr: "03:25", actualDep: "03:30", delayArr: 10, delayDep: 10, status: "upcoming", platform: 1, elevationM: 253, coords: [75.8648, 25.2185] },
      { code: "SWM", name: "Sawai Madhopur", km: 1028, schedArr: "04:33", schedDep: "04:35", actualArr: "04:40", actualDep: "04:42", delayArr: 7, delayDep: 7, status: "upcoming", platform: 1, elevationM: 275, coords: [76.3533, 26.0124] },
      { code: "MTJ", name: "Mathura Jn", km: 1245, schedArr: "06:40", schedDep: "06:45", actualArr: "06:42", actualDep: "06:46", delayArr: 2, delayDep: 1, status: "upcoming", platform: 3, elevationM: 177, coords: [77.6737, 27.4924] },
      { code: "NDLS", name: "New Delhi", km: 1386, schedArr: "08:32", schedDep: "--:--", actualArr: "08:35", actualDep: "--:--", delayArr: 3, delayDep: 0, status: "upcoming", platform: 1, elevationM: 216, coords: [77.2215, 28.6415] }
    ],
    // High-resolution corridor elevation profile points (km, altitudeM, label)
    elevationProfile: [
      { km: 0, alt: 14, label: "Mumbai Central (Sea Level)" },
      { km: 50, alt: 22, label: "Vasai Creek Bridge" },
      { km: 120, alt: 45, label: "Dahanu Coastal Flat" },
      { km: 263, alt: 21, label: "Surat (Tapi River)" },
      { km: 393, alt: 36, label: "Vadodara" },
      { km: 460, alt: 120, label: "Godhra Foothills" },
      { km: 530, alt: 290, label: "Dahod Incline" },
      { km: 610, alt: 512, label: "Malwa Plateau Crest" },
      { km: 653, alt: 488, label: "Ratlam Junction" },
      { km: 740, alt: 420, label: "Nagda Junction" },
      { km: 820, alt: 360, label: "Chambal River Valley" },
      { km: 870, alt: 310, label: "Darrah Pass (Ghat Section)" },
      { km: 920, alt: 253, label: "Kota Junction" },
      { km: 1028, alt: 275, label: "Sawai Madhopur" },
      { km: 1140, alt: 220, label: "Bharatpur Plain" },
      { km: 1245, alt: 177, label: "Mathura (Yamuna Basin)" },
      { km: 1320, alt: 195, label: "Faridabad Corridor" },
      { km: 1386, alt: 216, label: "New Delhi" }
    ],
    rakeComposition: [
      { pos: 1, type: "LOCO", label: "WAP-7", code: "ENG" },
      { pos: 2, type: "EOG", label: "End on Gen", code: "EOG1" },
      { pos: 3, type: "3A", label: "3-Tier AC", code: "B1" },
      { pos: 4, type: "3A", label: "3-Tier AC", code: "B2" },
      { pos: 5, type: "3A", label: "3-Tier AC", code: "B3" },
      { pos: 6, type: "3A", label: "3-Tier AC", code: "B4", isUserCoach: true },
      { pos: 7, type: "3A", label: "3-Tier AC", code: "B5" },
      { pos: 8, type: "2A", label: "2-Tier AC", code: "A1" },
      { pos: 9, type: "2A", label: "2-Tier AC", code: "A2" },
      { pos: 10, type: "PC", label: "Pantry Car", code: "PC" },
      { pos: 11, type: "1A", label: "First AC", code: "H1" },
      { pos: 12, type: "2A", label: "2-Tier AC", code: "A3" },
      { pos: 13, type: "3A", label: "3-Tier AC", code: "B6" },
      { pos: 14, type: "3A", label: "3-Tier AC", code: "B7" },
      { pos: 15, type: "EOG", label: "End on Gen", code: "EOG2" }
    ]
  },
  {
    number: "22436",
    name: "Vande Bharat Express",
    type: "Semi-High Speed EMU",
    zone: "Northern Railway (NR)",
    origin: { name: "New Delhi", code: "NDLS", city: "New Delhi", coords: [77.2215, 28.6415] },
    destination: { name: "Varanasi Jn", code: "BSB", city: "Varanasi", coords: [82.9866, 25.3283] },
    totalDistanceKm: 759,
    avgSpeedKmh: 95,
    maxPermissibleSpeed: 160,
    currentTelemetry: {
      speedKmh: 130,
      status: "RUNNING",
      delayMinutes: 0,
      statusSeverity: "ontime",
      lastReportedStation: "Kanpur Central (CNB)",
      nextStation: "Prayagraj Jn (PRYJ)",
      distanceCoveredKm: 512,
      currentCoords: [81.0123, 25.8451],
      heading: 124,
      locoNumber: "Train 18 Self-Propelled EMU Rake #04",
      coachCount: 16,
      rakeType: "Vande Bharat 2.0"
    },
    elevationRange: { minM: 80, maxM: 216 },
    stations: [
      { code: "NDLS", name: "New Delhi", km: 0, schedArr: "--:--", schedDep: "06:00", actualArr: "--:--", actualDep: "06:00", delayArr: 0, delayDep: 0, status: "departed", platform: 16, elevationM: 216, coords: [77.2215, 28.6415] },
      { code: "CNB", name: "Kanpur Central", km: 440, schedArr: "10:08", schedDep: "10:10", actualArr: "10:07", actualDep: "10:10", delayArr: 0, delayDep: 0, status: "departed", platform: 1, elevationM: 126, coords: [80.3541, 26.4539] },
      { code: "PRYJ", name: "Prayagraj Jn", km: 635, schedArr: "12:08", schedDep: "12:10", actualArr: "12:09", actualDep: "12:10", delayArr: 0, delayDep: 0, status: "approaching", platform: 6, elevationM: 98, coords: [81.8340, 25.4526] },
      { code: "BSB", name: "Varanasi Jn", km: 759, schedArr: "14:00", schedDep: "--:--", actualArr: "14:00", actualDep: "--:--", delayArr: 0, delayDep: 0, status: "upcoming", platform: 1, elevationM: 82, coords: [82.9866, 25.3283] }
    ],
    elevationProfile: [
      { km: 0, alt: 216, label: "New Delhi" },
      { km: 130, alt: 190, label: "Aligarh" },
      { km: 280, alt: 155, label: "Tundla" },
      { km: 360, alt: 140, label: "Etawah" },
      { km: 440, alt: 126, label: "Kanpur Central" },
      { km: 540, alt: 110, label: "Fatehpur" },
      { km: 635, alt: 98, label: "Prayagraj Jn (Ganga-Yamuna Doab)" },
      { km: 700, alt: 89, label: "Mirzapur" },
      { km: 759, alt: 82, label: "Varanasi Junction" }
    ],
    rakeComposition: [
      { pos: 1, type: "DTC", label: "Driving Cab", code: "C16" },
      { pos: 2, type: "MC", label: "Chair Car", code: "C15" },
      { pos: 3, type: "TC", label: "Chair Car", code: "C14" },
      { pos: 4, type: "MC", label: "Chair Car", code: "C13" },
      { pos: 5, type: "EC", label: "Exec Chair", code: "E1" },
      { pos: 6, type: "EC", label: "Exec Chair", code: "E2", isUserCoach: true },
      { pos: 7, type: "MC", label: "Chair Car", code: "C12" },
      { pos: 8, type: "DTC", label: "Driving Cab", code: "C1" }
    ]
  },
  {
    number: "12301",
    name: "Howrah Rajdhani Express",
    type: "Rajdhani Superfast",
    zone: "Eastern Railway (ER)",
    origin: { name: "Howrah Jn", code: "HWH", city: "Kolkata", coords: [88.3426, 22.5838] },
    destination: { name: "New Delhi", code: "NDLS", city: "New Delhi", coords: [77.2215, 28.6415] },
    totalDistanceKm: 1450,
    avgSpeedKmh: 84,
    maxPermissibleSpeed: 130,
    currentTelemetry: {
      speedKmh: 92,
      status: "RUNNING",
      delayMinutes: 48,
      statusSeverity: "delayed",
      lastReportedStation: "Pt. Deen Dayal Upadhyaya Jn (DDU)",
      nextStation: "Prayagraj Jn (PRYJ)",
      distanceCoveredKm: 780,
      currentCoords: [82.5120, 25.3101],
      heading: 285,
      locoNumber: "WAP-7 #30211 (HWH Shed)",
      coachCount: 21,
      rakeType: "LHB Rajdhani Rake"
    },
    elevationRange: { minM: 9, maxM: 216 },
    stations: [
      { code: "HWH", name: "Howrah Jn", km: 0, schedArr: "--:--", schedDep: "16:50", actualArr: "--:--", actualDep: "16:50", delayArr: 0, delayDep: 0, status: "departed", platform: 9, elevationM: 9, coords: [88.3426, 22.5838] },
      { code: "ASN", name: "Asansol Jn", km: 200, schedArr: "18:57", schedDep: "19:00", actualArr: "19:05", actualDep: "19:08", delayArr: 8, delayDep: 8, status: "departed", platform: 4, elevationM: 126, coords: [86.9746, 23.6889] },
      { code: "DHN", name: "Dhanbad Jn", km: 259, schedArr: "19:55", schedDep: "20:00", actualArr: "20:12", actualDep: "20:17", delayArr: 17, delayDep: 17, status: "departed", platform: 3, elevationM: 227, coords: [86.4304, 23.7957] },
      { code: "GAYA", name: "Gaya Jn", km: 459, schedArr: "22:19", schedDep: "22:22", actualArr: "22:45", actualDep: "22:48", delayArr: 26, delayDep: 26, status: "departed", platform: 1, elevationM: 113, coords: [85.0002, 24.7955] },
      { code: "DDU", name: "Pt. Deen Dayal Upadhyaya", km: 664, schedArr: "00:45", schedDep: "00:55", actualArr: "01:30", actualDep: "01:40", delayArr: 45, delayDep: 45, status: "departed", platform: 4, elevationM: 78, coords: [83.1167, 25.2818] },
      { code: "PRYJ", name: "Prayagraj Jn", km: 817, schedArr: "02:43", schedDep: "02:45", actualArr: "03:31", actualDep: "03:33", delayArr: 48, delayDep: 48, status: "approaching", platform: 1, elevationM: 98, coords: [81.8340, 25.4526] },
      { code: "CNB", name: "Kanpur Central", km: 1011, schedArr: "04:40", schedDep: "04:45", actualArr: "05:25", actualDep: "05:30", delayArr: 45, delayDep: 45, status: "upcoming", platform: 1, elevationM: 126, coords: [80.3541, 26.4539] },
      { code: "NDLS", name: "New Delhi", km: 1450, schedArr: "10:05", schedDep: "--:--", actualArr: "10:45", actualDep: "--:--", delayArr: 40, delayDep: 0, status: "upcoming", platform: 14, elevationM: 216, coords: [77.2215, 28.6415] }
    ],
    elevationProfile: [
      { km: 0, alt: 9, label: "Howrah (Ganges Estuary)" },
      { km: 100, alt: 42, label: "Bardhaman Plain" },
      { km: 200, alt: 126, label: "Asansol Coal Belt" },
      { km: 259, alt: 227, label: "Dhanbad Plateau" },
      { km: 350, alt: 310, label: "Parasnath Foothills" },
      { km: 459, alt: 113, label: "Gaya Junction" },
      { km: 664, alt: 78, label: "Pt. Deen Dayal Upadhyaya" },
      { km: 817, alt: 98, label: "Prayagraj (Sangam Basin)" },
      { km: 1011, alt: 126, label: "Kanpur Central" },
      { km: 1220, alt: 160, label: "Aligarh" },
      { km: 1450, alt: 216, label: "New Delhi" }
    ],
    rakeComposition: [
      { pos: 1, type: "LOCO", label: "WAP-7", code: "ENG" },
      { pos: 2, type: "EOG", label: "Power Car", code: "EOG1" },
      { pos: 3, type: "3A", label: "3-Tier AC", code: "B1" },
      { pos: 4, type: "3A", label: "3-Tier AC", code: "B2" },
      { pos: 5, type: "3A", label: "3-Tier AC", code: "B3", isUserCoach: true },
      { pos: 6, type: "2A", label: "2-Tier AC", code: "A1" },
      { pos: 7, type: "1A", label: "First AC", code: "H1" },
      { pos: 8, type: "EOG", label: "Power Car", code: "EOG2" }
    ]
  },
  {
    number: "12626",
    name: "Kerala Express",
    type: "Superfast Express",
    zone: "Southern Railway (SR)",
    origin: { name: "New Delhi", code: "NDLS", city: "New Delhi", coords: [77.2215, 28.6415] },
    destination: { name: "Thiruvananthapuram Central", code: "TVC", city: "Thiruvananthapuram", coords: [76.9507, 8.4875] },
    totalDistanceKm: 3031,
    avgSpeedKmh: 64,
    maxPermissibleSpeed: 110,
    currentTelemetry: {
      speedKmh: 82,
      status: "RUNNING",
      delayMinutes: 28,
      statusSeverity: "warning",
      lastReportedStation: "Bhopal Jn (BPL)",
      nextStation: "Itarsi Jn (ET)",
      distanceCoveredKm: 835,
      currentCoords: [77.5213, 23.0112],
      heading: 172,
      locoNumber: "WAP-7 #37012 (RPM Shed)",
      coachCount: 22,
      rakeType: "LHB Conventional Express"
    },
    elevationRange: { minM: 8, maxM: 520 },
    stations: [
      { code: "NDLS", name: "New Delhi", km: 0, schedArr: "--:--", schedDep: "20:10", actualArr: "--:--", actualDep: "20:10", delayArr: 0, delayDep: 0, status: "departed", platform: 3, elevationM: 216, coords: [77.2215, 28.6415] },
      { code: "AGC", name: "Agra Cantt", km: 195, schedArr: "22:20", schedDep: "22:25", actualArr: "22:22", actualDep: "22:26", delayArr: 2, delayDep: 1, status: "departed", platform: 1, elevationM: 167, coords: [78.0081, 27.1593] },
      { code: "GWL", name: "Gwalior Jn", km: 313, schedArr: "23:43", schedDep: "23:45", actualArr: "23:51", actualDep: "23:53", delayArr: 8, delayDep: 8, status: "departed", platform: 1, elevationM: 212, coords: [78.1828, 26.2163] },
      { code: "VGLJ", name: "VGL Jhansi Jn", km: 410, schedArr: "01:30", schedDep: "01:38", actualArr: "01:45", actualDep: "01:52", delayArr: 15, delayDep: 14, status: "departed", platform: 2, elevationM: 258, coords: [78.5600, 25.4484] },
      { code: "BPL", name: "Bhopal Jn", km: 702, schedArr: "05:35", schedDep: "05:40", actualArr: "06:00", actualDep: "06:06", delayArr: 25, delayDep: 26, status: "departed", platform: 1, elevationM: 505, coords: [77.4126, 23.2599] },
      { code: "ET", name: "Itarsi Jn", km: 794, schedArr: "07:15", schedDep: "07:20", actualArr: "07:44", actualDep: "07:48", delayArr: 29, delayDep: 28, status: "approaching", platform: 3, elevationM: 304, coords: [77.7554, 22.6148] },
      { code: "NGP", name: "Nagpur Jn", km: 1092, schedArr: "11:45", schedDep: "11:50", actualArr: "12:10", actualDep: "12:15", delayArr: 25, delayDep: 25, status: "upcoming", platform: 2, elevationM: 312, coords: [79.0882, 21.1458] },
      { code: "TVC", name: "Thiruvananthapuram", km: 3031, schedArr: "14:15", schedDep: "--:--", actualArr: "14:35", actualDep: "--:--", delayArr: 20, delayDep: 0, status: "upcoming", platform: 1, elevationM: 10, coords: [76.9507, 8.4875] }
    ],
    elevationProfile: [
      { km: 0, alt: 216, label: "New Delhi" },
      { km: 195, alt: 167, label: "Agra Cantt" },
      { km: 410, alt: 258, label: "Jhansi" },
      { km: 702, alt: 505, label: "Bhopal (Malwa Ridge)" },
      { km: 794, alt: 304, label: "Itarsi (Narmada Valley)" },
      { km: 920, alt: 520, label: "Betul (Satpura Mountain Range)" },
      { km: 1092, alt: 312, label: "Nagpur Central Hub" },
      { km: 1700, alt: 60, label: "Vijayawada (Krishna River)" },
      { km: 2300, alt: 40, label: "Katpadi (Eastern Ghats)" },
      { km: 2600, alt: 350, label: "Palakkad Gap" },
      { km: 3031, alt: 10, label: "Thiruvananthapuram Central (Coastal)" }
    ],
    rakeComposition: [
      { pos: 1, type: "LOCO", label: "WAP-7", code: "ENG" },
      { pos: 2, type: "SLR", label: "Luggage Car", code: "SLR1" },
      { pos: 3, type: "GEN", label: "General", code: "GS1" },
      { pos: 4, type: "SL", label: "Sleeper", code: "S1" },
      { pos: 5, type: "SL", label: "Sleeper", code: "S2" },
      { pos: 6, type: "3A", label: "3-Tier AC", code: "B1", isUserCoach: true },
      { pos: 7, type: "2A", label: "2-Tier AC", code: "A1" },
      { pos: 8, type: "SLR", label: "Luggage Car", code: "SLR2" }
    ]
  }
];

export const DEMO_PNR_DATA = {
  "2418937210": {
    pnr: "2418937210",
    trainNumber: "12951",
    trainName: "Mumbai Tejas Rajdhani Express",
    doj: "2026-10-05",
    from: "MMCT",
    to: "NDLS",
    class: "3A",
    quota: "GN",
    chartStatus: "Chart Prepared",
    confirmationProb: 98,
    passengers: [
      { num: 1, name: "Rohit Sharma", bookingStatus: "RLWL 12", currentStatus: "CNF", coach: "B4", berth: 35, berthType: "Middle Berth", statusBadge: "confirmed" },
      { num: 2, name: "Pooja Sharma", bookingStatus: "RLWL 13", currentStatus: "CNF", coach: "B4", berth: 36, berthType: "Upper Berth", statusBadge: "confirmed" }
    ]
  },
  "8529143670": {
    pnr: "8529143670",
    trainNumber: "22436",
    trainName: "Vande Bharat Express",
    doj: "2026-10-06",
    from: "NDLS",
    to: "BSB",
    class: "EC",
    quota: "GN",
    chartStatus: "Chart Prepared",
    confirmationProb: 100,
    passengers: [
      { num: 1, name: "Ananya Sen", bookingStatus: "CNF", currentStatus: "CNF", coach: "E2", berth: 14, berthType: "Window Seat", statusBadge: "confirmed" }
    ]
  },
  "4109283745": {
    pnr: "4109283745",
    trainNumber: "12301",
    trainName: "Howrah Rajdhani Express",
    doj: "2026-10-07",
    from: "HWH",
    to: "NDLS",
    class: "3A",
    quota: "GN",
    chartStatus: "Chart Pending (Prep at 14:00)",
    confirmationProb: 78,
    passengers: [
      { num: 1, name: "Vikramaditya S.", bookingStatus: "PQWL 34", currentStatus: "WL 14", coach: "WL", berth: "--", berthType: "Waiting List", statusBadge: "waiting" }
    ]
  }
};

export const CORRIDORS_RADAR_DATA = [
  {
    id: "corridor-fog-north",
    name: "Northern Gangetic Fog Corridor (NDLS - CNB - DDU)",
    lengthKm: 780,
    activeTrains: 84,
    riskLevel: "HIGH",
    hazardType: "Dense Winter Fog & Inversion Layer",
    summary: "Widespread dense radiation fog reducing runway and signal visibility to under 120 meters. Automatic train protection protocols enforce 60 km/h ceiling speed.",
    weatherMetrics: {
      avgTemp: "11°C",
      humidity: "94%",
      visibilityM: 110,
      precipitationMm: 0,
      windSpeedKmh: 4
    },
    delayCorrelation: [
      { time: "00:00", visibilityM: 180, delayMins: 38 },
      { time: "03:00", visibilityM: 90, delayMins: 62 },
      { time: "06:00", visibilityM: 70, delayMins: 78 },
      { time: "09:00", visibilityM: 250, delayMins: 45 },
      { time: "12:00", visibilityM: 1200, delayMins: 20 },
      { time: "15:00", visibilityM: 3500, delayMins: 12 },
      { time: "18:00", visibilityM: 800, delayMins: 30 },
      { time: "21:00", visibilityM: 200, delayMins: 55 }
    ]
  },
  {
    id: "corridor-west-freight",
    name: "Western Freight & Express Corridor (MMCT - BRC - KOTA - NDLS)",
    lengthKm: 1386,
    activeTrains: 112,
    riskLevel: "LOW",
    hazardType: "Nominal Atmospheric Operating Conditions",
    summary: "Clear visibility throughout the Malwa plateau and Rajasthan plains. Optimum track temperatures and nominal signal telemetry.",
    weatherMetrics: {
      avgTemp: "28°C",
      humidity: "42%",
      visibilityM: 8500,
      precipitationMm: 0,
      windSpeedKmh: 12
    },
    delayCorrelation: [
      { time: "00:00", visibilityM: 8000, delayMins: 12 },
      { time: "04:00", visibilityM: 7500, delayMins: 10 },
      { time: "08:00", visibilityM: 8500, delayMins: 14 },
      { time: "12:00", visibilityM: 9000, delayMins: 8 },
      { time: "16:00", visibilityM: 9000, delayMins: 11 },
      { time: "20:00", visibilityM: 8500, delayMins: 14 }
    ]
  },
  {
    id: "corridor-konkan-ghats",
    name: "Konkan Coastal & Ghat Corridor (Mumbai - Madgaon - Mangaluru)",
    lengthKm: 740,
    activeTrains: 38,
    riskLevel: "MEDIUM",
    hazardType: "Heavy Monsoonal Squalls & Incline Crosswinds",
    summary: "Intermittent heavy localized convection cells with rainfall rates up to 24 mm/hr. Water sensor telemetry active on viaduct bridges and cutting sections.",
    weatherMetrics: {
      avgTemp: "26°C",
      humidity: "89%",
      visibilityM: 2200,
      precipitationMm: 24,
      windSpeedKmh: 36
    },
    delayCorrelation: [
      { time: "00:00", visibilityM: 3000, delayMins: 18 },
      { time: "04:00", visibilityM: 1800, delayMins: 28 },
      { time: "08:00", visibilityM: 2200, delayMins: 32 },
      { time: "12:00", visibilityM: 1500, delayMins: 42 },
      { time: "16:00", visibilityM: 2600, delayMins: 24 },
      { time: "20:00", visibilityM: 2400, delayMins: 20 }
    ]
  }
];

export const STATIONS_LIVE_BOARD = {
  "NDLS": [
    { number: "12951", name: "Mumbai Tejas Rajdhani", dest: "Mumbai Central (MMCT)", sched: "16:55", expected: "16:55", delay: 0, status: "On Time", platform: "1", type: "Departing" },
    { number: "22436", name: "Vande Bharat Express", dest: "Varanasi Jn (BSB)", sched: "06:00", expected: "06:00", delay: 0, status: "On Time", platform: "16", type: "Departing" },
    { number: "12302", name: "Howrah Rajdhani Express", dest: "Howrah Jn (HWH)", sched: "16:50", expected: "17:15", delay: 25, status: "Delayed +25m", platform: "14", type: "Departing" },
    { number: "12626", name: "Kerala Express", dest: "Thiruvananthapuram (TVC)", sched: "20:10", expected: "20:38", delay: 28, status: "Delayed +28m", platform: "3", type: "Departing" },
    { number: "12004", name: "Lucknow Shatabdi", dest: "Lucknow Jn (LJN)", sched: "06:10", expected: "06:10", delay: 0, status: "On Time", platform: "2", type: "Departing" },
    { number: "12952", name: "Mumbai Rajdhani (Inbound)", dest: "Terminating (NDLS)", sched: "08:32", expected: "08:46", delay: 14, status: "Arrived", platform: "1", type: "Arriving" }
  ],
  "MMCT": [
    { number: "12951", name: "Mumbai Tejas Rajdhani", dest: "New Delhi (NDLS)", sched: "17:00", expected: "17:00", delay: 0, status: "Boarding", platform: "1", type: "Departing" },
    { number: "12953", name: "August Kranti Rajdhani", dest: "Hazrat Nizamuddin (NZM)", sched: "17:10", expected: "17:10", delay: 0, status: "On Time", platform: "2", type: "Departing" },
    { number: "12925", name: "Paschim Express", dest: "Amritsar Jn (ASR)", sched: "11:25", expected: "11:45", delay: 20, status: "Delayed +20m", platform: "4", type: "Departing" },
    { number: "12267", name: "Mumbai Duronto Express", dest: "Ahmedabad Jn (ADI)", sched: "23:25", expected: "23:25", delay: 0, status: "On Time", platform: "3", type: "Departing" }
  ],
  "HWH": [
    { number: "12301", name: "Howrah Rajdhani Express", dest: "New Delhi (NDLS)", sched: "16:50", expected: "16:50", delay: 0, status: "Boarding", platform: "9", type: "Departing" },
    { number: "12860", name: "Gitanjali Express", dest: "Mumbai CSMT", sched: "14:05", expected: "14:40", delay: 35, status: "Delayed +35m", platform: "21", type: "Departing" },
    { number: "12841", name: "Coromandel Express", dest: "MGR Chennai Central", sched: "15:20", expected: "15:20", delay: 0, status: "On Time", platform: "23", type: "Departing" }
  ]
};

export const SAAS_FLEET_DATA = [
  { id: "FL-901", rakeName: "Amazon Intermodal Parcel Express", origin: "Bhiwandi (BIRD)", dest: "Tughlakabad (TKD)", speed: "84 km/h", status: "Nominal", delayMins: 5, corridor: "Western DFC", weatherRisk: "Low (Clear, 27°C)", healthScore: 98 },
  { id: "FL-902", rakeName: "Maruti Automotive Carrier Rake", origin: "Gurugram (GGN)", dest: "Sanand Rake Terminal (SND)", speed: "78 km/h", status: "Nominal", delayMins: 8, corridor: "Delhi-Ahmedabad", weatherRisk: "Low (Clear, 29°C)", healthScore: 96 },
  { id: "FL-903", rakeName: "Concor Cold Chain Container 42", origin: "JNPT Nhava Sheva", dest: "Dadri ICD", speed: "62 km/h", status: "Delayed", delayMins: 42, corridor: "Western DFC / Ghats", weatherRisk: "Medium (Crosswind 32 km/h)", healthScore: 82 },
  { id: "FL-904", rakeName: "Tata Steel Coil Rake 18", origin: "Jamshedpur (TATA)", dest: "Faridabad Yard", speed: "52 km/h", status: "Critical Weather Watch", delayMins: 75, corridor: "Eastern Gangetic", weatherRisk: "High (Dense Fog, Vis 90m)", healthScore: 68 }
];
