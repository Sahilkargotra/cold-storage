export interface Action {
  id: string;
  type: 'alert_resolved' | 'transfer_approved' | 'transfer_rejected' | 'report_generated' | 'maintenance_requested';
  description: string;
  actor: string; // Who performed the action
  timestamp: string;
  financialImpact?: number;
  facility?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Alert {
  id: string;
  type: 'temperature' | 'door' | 'compressor' | 'inventory' | 'staff';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  financialImpact: number;
  time: string;
  zone?: string;
  facility: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  resolutionNotes?: string;
  escalatedTo?: 'regional' | 'hq';
  escalationTime?: string;
}

export interface TransferRequest {
  id: string;
  product: string;
  fromFacility: string;
  toFacility: string;
  quantity: number;
  reason: string;
  savings: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_transit' | 'completed';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  estimatedArrival?: string;
}

export interface ComplianceReport {
  id: string;
  type: 'FSSAI' | 'FDA' | 'EU-GDP' | 'Temperature-Log' | 'Cleaning-Log' | 'Incident-Report';
  facility: string;
  generatedAt: string;
  validUntil: string;
  status: 'valid' | 'expiring' | 'expired';
  generatedBy: string;
  downloadUrl?: string;
}
