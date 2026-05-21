// Professional Cold Storage Monitoring Mock Data
// Based on WHO guidelines and industry best practices

// ============================================
// TYPE DEFINITIONS
// ============================================

type ZoneType = 'ambient' | 'chill' | 'frozen' | 'processing';
type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';
type DoorStatus = 'open' | 'closed' | 'fault';

interface ZoneReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  nh3Level?: number; // Ammonia in ppm
  co2Level?: number; // CO2 in ppm
}

interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  capacity: number; // in tonnes
  currentOccupancy: number; // in tonnes
  temperature: {
    current: number;
    target: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
  };
  humidity: {
    current: number;
    target: number;
    min: number;
    max: number;
  };
  safety: {
    nh3Level: number; // Ammonia in ppm (safe: <25 ppm)
    co2Level: number; // CO2 in ppm (safe: <5000 ppm)
    lastUpdated: string;
  };
  doors: {
    id: string;
    name: string;
    status: DoorStatus;
    openDuration?: number; // minutes
    lastEvent: string;
  }[];
  energy: {
    consumption: number; // kWh today
    cost: number; // INR today
  };
  occupancy: number; // percentage
  products: {
    name: string;
    quantity: number; // tonnes
    expiryDate: string;
    value: number; // INR
  }[];
  alerts: {
    id: string;
    severity: AlertSeverity;
    message: string;
    time: string;
  }[];
}

interface Facility {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  totalCapacity: number;
  zones: Zone[];
  energy: {
    today: number;
    yesterday: number;
    thisWeek: number;
    costPerTonne: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  occupancy: number; // percentage
  status: 'operational' | 'maintenance' | 'critical';
}

// ============================================
// ZONE DATA
// ============================================

export const chennaiFacility: Facility = {
  id: 'FAC-001',
  name: 'Chennai Cold Storage',
  location: 'Chennai, Tamil Nadu',
  latitude: 13.0827,
  longitude: 80.2707,
  totalCapacity: 2000,
  zones: [
    {
      id: 'Z-001',
      name: 'Ambient Zone A',
      type: 'ambient',
      capacity: 400,
      currentOccupancy: 360,
      temperature: {
        current: 18,
        target: 20,
        min: 15,
        max: 25,
        trend: 'stable'
      },
      humidity: {
        current: 65,
        target: 60,
        min: 50,
        max: 70
      },
      safety: {
        nh3Level: 8,
        co2Level: 420,
        lastUpdated: '2025-01-15T14:30:00'
      },
      doors: [
        {
          id: 'D-001',
          name: 'Main Entrance',
          status: 'closed',
          lastEvent: '2025-01-15T14:25:00'
        },
        {
          id: 'D-002',
          name: 'Loading Dock',
          status: 'closed',
          lastEvent: '2025-01-15T14:20:00'
        }
      ],
      energy: {
        consumption: 145,
        cost: 892
      },
      occupancy: 90,
      products: [
        { name: 'Potatoes', quantity: 120, expiryDate: '2025-03-15', value: 480000 },
        { name: 'Onions', quantity: 140, expiryDate: '2025-02-28', value: 420000 },
        { name: 'Citrus Fruits', quantity: 100, expiryDate: '2025-02-15', value: 600000 }
      ],
      alerts: []
    },
    {
      id: 'Z-002',
      name: 'Chill Zone B',
      type: 'chill',
      capacity: 600,
      currentOccupancy: 510,
      temperature: {
        current: 4,
        target: 4,
        min: 2,
        max: 8,
        trend: 'down'
      },
      humidity: {
        current: 85,
        target: 80,
        min: 75,
        max: 90
      },
      safety: {
        nh3Level: 12,
        co2Level: 580,
        lastUpdated: '2025-01-15T14:30:00'
      },
      doors: [
        {
          id: 'D-003',
          name: 'Chill Door 1',
          status: 'closed',
          lastEvent: '2025-01-15T14:28:00'
        },
        {
          id: 'D-004',
          name: 'Chill Door 2',
          status: 'open',
          openDuration: 3,
          lastEvent: '2025-01-15T14:27:00'
        }
      ],
      energy: {
        consumption: 320,
        cost: 2150
      },
      occupancy: 85,
      products: [
        { name: 'Dairy Products', quantity: 180, expiryDate: '2025-02-20', value: 1080000 },
        { name: 'Fresh Meat', quantity: 150, expiryDate: '2025-01-22', value: 900000 },
        { name: 'Poultry', quantity: 180, expiryDate: '2025-01-25', value: 720000 }
      ],
      alerts: [
        {
          id: 'ALT-001',
          severity: 'warning',
          message: 'Door D-004 open for 3 minutes',
          time: '2025-01-15T14:27:00'
        }
      ]
    },
    {
      id: 'Z-003',
      name: 'Frozen Zone C',
      type: 'frozen',
      capacity: 1000,
      currentOccupancy: 860,
      temperature: {
        current: -21,
        target: -18,
        min: -25,
        max: -15,
        trend: 'up'
      },
      humidity: {
        current: 45,
        target: 50,
        min: 40,
        max: 60
      },
      safety: {
        nh3Level: 18,
        co2Level: 650,
        lastUpdated: '2025-01-15T14:30:00'
      },
      doors: [
        {
          id: 'D-005',
          name: 'Frozen Door 1',
          status: 'closed',
          lastEvent: '2025-01-15T14:15:00'
        },
        {
          id: 'D-006',
          name: 'Frozen Door 2',
          status: 'closed',
          lastEvent: '2025-01-15T13:45:00'
        }
      ],
      energy: {
        consumption: 580,
        cost: 4120
      },
      occupancy: 86,
      products: [
        { name: 'Frozen Seafood', quantity: 300, expiryDate: '2025-06-15', value: 2400000 },
        { name: 'Frozen Meat', quantity: 280, expiryDate: '2025-05-20', value: 1960000 },
        { name: 'Ice Cream', quantity: 180, expiryDate: '2025-04-10', value: 1440000 },
        { name: 'Frozen Vegetables', quantity: 100, expiryDate: '2025-07-01', value: 600000 }
      ],
      alerts: [
        {
          id: 'ALT-002',
          severity: 'critical',
          message: 'Temperature above target (-21°C vs -18°C)',
          time: '2025-01-15T14:20:00'
        }
      ]
    }
  ],
  energy: {
    today: 1045,
    yesterday: 1150,
    thisWeek: 7200,
    costPerTonne: 2100
  },
  revenue: {
    today: 85600,
    thisWeek: 542000,
    thisMonth: 2180000
  },
  occupancy: 86,
  status: 'operational'
};

// Temperature history for charts (last 24 hours)
export const temperatureHistory = {
  'Z-001': [
    { time: '00:00', temp: 19.5 }, { time: '04:00', temp: 19.2 }, { time: '08:00', temp: 18.8 },
    { time: '12:00', temp: 18.2 }, { time: '16:00', temp: 18.0 }, { time: '20:00', temp: 18.5 }
  ],
  'Z-002': [
    { time: '00:00', temp: 4.2 }, { time: '04:00', temp: 4.1 }, { time: '08:00', temp: 4.0 },
    { time: '12:00', temp: 3.9 }, { time: '16:00', temp: 4.1 }, { time: '20:00', temp: 4.0 }
  ],
  'Z-003': [
    { time: '00:00', temp: -19.5 }, { time: '04:00', temp: -20.2 }, { time: '08:00', temp: -20.8 },
    { time: '12:00', temp: -21.2 }, { time: '16:00', temp: -21.0 }, { time: '20:00', temp: -20.5 }
  ]
};

// Energy consumption history (last 7 days)
export const energyHistory = [
  { day: 'Mon', consumption: 1080, cost: 7560 },
  { day: 'Tue', consumption: 1150, cost: 8050 },
  { day: 'Wed', consumption: 1020, cost: 7140 },
  { day: 'Thu', consumption: 1200, cost: 8400 },
  { day: 'Fri', consumption: 1100, cost: 7700 },
  { day: 'Sat', consumption: 980, cost: 6860 },
  { day: 'Sun', consumption: 1045, cost: 7315 }
];

// Regional facilities data
export const regionalFacilities: Facility[] = [
  chennaiFacility,
  {
    id: 'FAC-002',
    name: 'Bangalore Cold Storage',
    location: 'Bangalore, Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    totalCapacity: 2500,
    zones: [],
    energy: { today: 1250, yesterday: 1300, thisWeek: 8800, costPerTonne: 1900 },
    revenue: { today: 125000, thisWeek: 780000, thisMonth: 3120000 },
    occupancy: 92,
    status: 'operational'
  },
  {
    id: 'FAC-003',
    name: 'Hyderabad Cold Storage',
    location: 'Hyderabad, Telangana',
    latitude: 17.3850,
    longitude: 78.4867,
    totalCapacity: 1800,
    zones: [],
    energy: { today: 920, yesterday: 980, thisWeek: 6700, costPerTonne: 2200 },
    revenue: { today: 72000, thisWeek: 450000, thisMonth: 1850000 },
    occupancy: 78,
    status: 'operational'
  },
  {
    id: 'FAC-004',
    name: 'Coimbatore Cold Storage',
    location: 'Coimbatore, Tamil Nadu',
    latitude: 11.0168,
    longitude: 76.9558,
    totalCapacity: 1500,
    zones: [],
    energy: { today: 780, yesterday: 820, thisWeek: 5600, costPerTonne: 1850 },
    revenue: { today: 68000, thisWeek: 420000, thisMonth: 1720000 },
    occupancy: 88,
    status: 'operational'
  }
];

// Network-wide metrics for HQ
export const networkMetrics = {
  totalFacilities: 15,
  totalCapacity: 32000,
  avgOccupancy: 86,
  totalEnergyToday: 18500,
  totalRevenueMonth: 28500000,
  activeAlerts: 12,
  facilitiesInCritical: 1,
  topPerformers: [
    { facility: 'Bangalore', roi: 24, margin: 28 },
    { facility: 'Chandigarh', roi: 26, margin: 30 },
    { facility: 'Pune', roi: 22, margin: 25 }
  ],
  growthRegions: [
    { region: 'South', current: 7800, projected: 9200, recommendation: 'expand' },
    { region: 'West', current: 6500, projected: 6800, recommendation: 'maintain' },
    { region: 'North', current: 9200, projected: 10500, recommendation: 'expand' }
  ]
};

// Safety thresholds
export const safetyThresholds = {
  nh3: {
    warning: 15, // ppm
    critical: 25 // ppm
  },
  co2: {
    warning: 3000, // ppm
    critical: 5000 // ppm
  }
};
