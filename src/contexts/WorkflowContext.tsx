import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Inline types to avoid import issues
type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';
type EscalationTarget = 'regional' | 'hq';
type TransferStatus = 'pending' | 'approved' | 'rejected' | 'in_transit' | 'completed';
type ActionStatus = 'completed' | 'pending' | 'failed';
type ComplianceStatus = 'valid' | 'expiring' | 'expired';

interface Action {
  id: string;
  type: 'alert_resolved' | 'transfer_approved' | 'transfer_rejected' | 'report_generated' | 'maintenance_requested';
  description: string;
  actor: string;
  timestamp: string;
  financialImpact?: number;
  facility?: string;
  status: ActionStatus;
}

interface Alert {
  id: string;
  type: 'temperature' | 'door' | 'compressor' | 'inventory' | 'staff';
  severity: AlertSeverity;
  message: string;
  financialImpact: number;
  time: string;
  zone?: string;
  facility: string;
  status: AlertStatus;
  resolutionNotes?: string;
  escalatedTo?: EscalationTarget;
  escalationTime?: string;
}

interface TransferRequest {
  id: string;
  product: string;
  fromFacility: string;
  toFacility: string;
  quantity: number;
  reason: string;
  savings: number;
  status: TransferStatus;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  estimatedArrival?: string;
}

interface ComplianceReport {
  id: string;
  type: 'FSSAI' | 'FDA' | 'EU-GDP' | 'Temperature-Log' | 'Cleaning-Log' | 'Incident-Report';
  facility: string;
  generatedAt: string;
  validUntil: string;
  status: ComplianceStatus;
  generatedBy: string;
  downloadUrl?: string;
}

interface WorkflowContextType {
  alerts: Alert[];
  transfers: TransferRequest[];
  actions: Action[];
  reports: ComplianceReport[];
  resolveAlert: (alertId: string, notes: string, actor: string) => void;
  escalateAlert: (alertId: string, to: 'regional' | 'hq', actor: string) => void;
  approveTransfer: (transferId: string, actor: string) => void;
  rejectTransfer: (transferId: string, actor: string) => void;
  generateReport: (type: ComplianceReport['type'], facility: string, actor: string) => void;
  addAction: (action: Omit<Action, 'id' | 'timestamp'>) => void;
  getActionsByFacility: (facility: string) => Action[];
  getOpenAlerts: (facility?: string) => Alert[];
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'temperature',
      severity: 'critical',
      message: 'Zone B temperature at -12°C (should be -18°C)',
      financialImpact: 45000,
      time: '2025-01-15 09:30',
      zone: 'Zone B',
      facility: 'Chennai',
      status: 'open',
    },
    {
      id: '2',
      type: 'compressor',
      severity: 'warning',
      message: 'Compressor #3 abnormal cycles (45 min run, 5 min idle)',
      financialImpact: 35000,
      time: '2025-01-15 09:00',
      zone: 'Zone B',
      facility: 'Chennai',
      status: 'in_progress',
    },
    {
      id: '3',
      type: 'inventory',
      severity: 'critical',
      message: '5 tonnes Mangoes expiring in 48 hours',
      financialImpact: 40000,
      time: '2025-01-15 08:00',
      zone: 'Zone C',
      facility: 'Chennai',
      status: 'open',
    },
  ]);

  const [transfers, setTransfers] = useState<TransferRequest[]>([
    {
      id: 'TR-001',
      product: 'Mangoes (5 tonnes)',
      fromFacility: 'Chennai',
      toFacility: 'Bangalore',
      quantity: 5000,
      reason: 'High demand in Bangalore, expiring in 7 days',
      savings: 40000,
      status: 'pending',
      createdAt: '2025-01-15 10:00',
    },
  ]);

  const [actions, setActions] = useState<Action[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);

  const resolveAlert = (alertId: string, notes: string, actor: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'resolved' as const, resolutionNotes: notes }
        : alert
    ));

    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      addAction({
        type: 'alert_resolved',
        description: `Resolved ${alert.type} alert: ${alert.message}`,
        actor,
        financialImpact: -alert.financialImpact, // Negative means saved
        facility: alert.facility,
        status: 'completed',
      });
    }
  };

  const escalateAlert = (alertId: string, to: 'regional' | 'hq', actor: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            status: 'escalated' as const,
            escalatedTo: to,
            escalationTime: new Date().toISOString(),
          }
        : alert
    ));

    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      addAction({
        type: 'alert_resolved',
        description: `Escalated ${alert.type} alert to ${to} level`,
        actor,
        facility: alert.facility,
        status: 'pending',
      });
    }
  };

  const approveTransfer = (transferId: string, actor: string) => {
    setTransfers(prev => prev.map(transfer =>
      transfer.id === transferId
        ? {
            ...transfer,
            status: 'approved' as const,
            approvedBy: actor,
            approvedAt: new Date().toISOString(),
            estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          }
        : transfer
    ));

    const transfer = transfers.find(t => t.id === transferId);
    if (transfer) {
      addAction({
        type: 'transfer_approved',
        description: `Approved transfer: ${transfer.product} from ${transfer.fromFacility} to ${transfer.toFacility}`,
        actor,
        financialImpact: transfer.savings,
        facility: transfer.fromFacility,
        status: 'completed',
      });
    }
  };

  const rejectTransfer = (transferId: string, actor: string) => {
    setTransfers(prev => prev.map(transfer =>
      transfer.id === transferId
        ? { ...transfer, status: 'rejected' as const }
        : transfer
    ));

    const transfer = transfers.find(t => t.id === transferId);
    if (transfer) {
      addAction({
        type: 'transfer_rejected',
        description: `Rejected transfer: ${transfer.product} from ${transfer.fromFacility} to ${transfer.toFacility}`,
        actor,
        facility: transfer.fromFacility,
        status: 'completed',
      });
    }
  };

  const generateReport = (type: ComplianceReport['type'], facility: string, actor: string) => {
    const newReport: ComplianceReport = {
      id: `RPT-${Date.now()}`,
      type,
      facility,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'valid',
      generatedBy: actor,
      downloadUrl: '#',
    };

    setReports(prev => [...prev, newReport]);

    addAction({
      type: 'report_generated',
      description: `Generated ${type} report for ${facility}`,
      actor,
      facility,
      status: 'completed',
    });
  };

  const addAction = (action: Omit<Action, 'id' | 'timestamp'>) => {
    const newAction: Action = {
      ...action,
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setActions(prev => [newAction, ...prev]);
  };

  const getActionsByFacility = (facility: string) => {
    return actions.filter(action => action.facility === facility);
  };

  const getOpenAlerts = (facility?: string) => {
    return alerts.filter(alert =>
      alert.status !== 'resolved' &&
      (!facility || alert.facility === facility)
    );
  };

  return (
    <WorkflowContext.Provider
      value={{
        alerts,
        transfers,
        actions,
        reports,
        resolveAlert,
        escalateAlert,
        approveTransfer,
        rejectTransfer,
        generateReport,
        addAction,
        getActionsByFacility,
        getOpenAlerts,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
