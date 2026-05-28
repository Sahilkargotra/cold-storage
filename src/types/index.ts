export type UserRole = 'hq' | 'regional' | 'facility';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  facility?: string;
  region?: string;
}

// HQ Dashboard Types
export interface HQStats {
  capacityUsed: number;
  shrinkageLoss: number;
  energyCost: number;
  compliance: number;
}

export interface FacilityPerformance {
  facility: string;
  stockUtilization: number;
  shrinkageLoss: number;
  trend: 'up' | 'down' | 'stable';
}

export interface StockMixItem {
  category: string;
  percentage: number;
  value: number;
}

export interface RegionalEnergyCost {
  region: string;
  costPerTonne: number;
  change: number;
}

export interface NetworkAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  facility: string;
  message: string;
  time: string;
  financialImpact?: number;
}

export interface ROIData {
  facility: string;
  roi: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface GrowthIntelligence {
  region: string;
  currentCapacity: number;
  projectedDemand: number;
  recommendation: 'expand' | 'maintain' | 'reduce';
}

export interface ESGMetrics {
  carbonFootprint: number;
  energyEfficiency: number;
  renewableEnergy: number;
  complianceScore: number;
}

// Regional Dashboard Types
export interface FacilityHealthRanking {
  rank: number;
  facility: string;
  profitability: number;
  spoilageRate: number;
  energyCostPerTonne: number;
  fillRate: number;
  alertVolume: number;
}

export interface AgingInventory {
  facility: string;
  sku: string;
  batch: string;
  age: number;
  value: number;
  expiryDate: string;
  action: 'transfer' | 'discount' | 'dispose';
}

export interface DemandForecast {
  region: string;
  product: string;
  currentDemand: number;
  projectedDemand: number;
  timeFrame: string;
  confidence: number;
}

export interface TransferSuggestion {
  from: string;
  to: string;
  product: string;
  quantity: number;
  reason: string;
  savings: number;
}

export interface PricingRecommendation {
  facility: string;
  currentRate: number;
  recommendedRate: number;
  reason: string;
  projectedImpact: number;
}

export interface StaffPerformance {
  facility: string;
  productivity: number;
  ticketResolutionTime: number;
  complianceScore: number;
}

export interface FacilityFinancials {
  facility: string;
  revenue: number;
  costPerTonne: number;
  profitMargin: number;
  oneTimeEvents: number;
}

// Facility Dashboard Types
export interface CriticalAlert {
  id: string;
  type: 'temperature' | 'door' | 'compressor' | 'inventory' | 'staff';
  severity: 'critical' | 'warning';
  message: string;
  financialImpact: number;
  time: string;
  zone?: string;
}

export interface OperationalMetrics {
  energyCostPerTonne: number;
  fillRate: number;
  orderFulfillmentTime: number;
  spoilageThisMonth: number;
  doorOpenMinutes: number;
  compressorRunTime: number;
}

export interface BatchInfo {
  sku: string;
  product: string;
  batch: string;
  quantity: number;
  age: number;
  expiryDate: string;
  zone: string;
  value: number;
}

export interface TransferRequest {
  id: string;
  product: string;
  fromFacility: string;
  toFacility: string;
  quantity: number;
  status: 'pending' | 'approved' | 'in-transit' | 'completed';
  savings: number;
  createdAt: string;
}

export interface ComplianceDocument {
  type: 'FSSAI' | 'FDA' | 'EU-GDP' | 'Temperature-Log' | 'Cleaning-Log' | 'Incident-Report';
  lastGenerated: string;
  validUntil: string;
  status: 'valid' | 'expiring' | 'expired';
}

export interface EnergyMetrics {
  costTrend: number[];
  carbonFootprint: number;
  peakVsOffPeak: { peak: number; offPeak: number };
  equipmentEfficiency: number;
}

export type ZoneType = 'ambient' | 'chill' | 'frozen' | 'processing';
export type DoorStatus = 'open' | 'closed' | 'fault';

export interface ZoneDoor {
  id: string;
  name: string;
  status: DoorStatus;
  openDuration?: number;
  lastEvent: string;
}

export interface ZoneProduct {
  sku: string;
  name: string;
  category: 'fruits' | 'vegetables' | 'dairy' | 'meat' | 'poultry' | 'seafood' | 'frozen-foods' | 'pharma' | 'other';
  brand: string;
  supplier: string;
  batchNumber: string;
  lotNumber: string;
  unitType: 'kg' | 'tonne' | 'box' | 'pallet' | 'crate';
  quantity: number;
  shelfLifeDays: number;
  entryDate: string;
  expiryDate: string;
  storageMinTemp: number;
  storageMaxTemp: number;
  humidityMin: number;
  humidityMax: number;
  barcode: string;
  value: number;
}

export interface ZoneAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}

export interface ZoneSafety {
  nh3Level: number;
  co2Level: number;
  lastUpdated: string;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  capacity: number;
  currentOccupancy: number;
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
  safety: ZoneSafety;
  doors: ZoneDoor[];
  energy: {
    consumption: number;
    cost: number;
  };
  occupancy: number;
  products: ZoneProduct[];
  alerts: ZoneAlert[];
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  change?: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}
