import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@vrushabh-b/oneiot-ui';
import { AlertDetailModal } from '@/components/AlertDetailModal';
import { useWorkflow } from '@/contexts/WorkflowContext';
import {
  AlertTriangle, Thermometer, DoorOpen, Wrench, Package, Users,
  CheckCircle2, ArrowUp, Clock, Filter,
} from 'lucide-react';

type AlertType = 'temperature' | 'door' | 'compressor' | 'inventory' | 'staff';
type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';

interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  financialImpact: number;
  time: string;
  zone?: string;
  facility: string;
  status: AlertStatus;
  resolutionNotes?: string;
  escalatedTo?: 'regional' | 'hq';
  escalationTime?: string;
}

const TYPE_ICON: Record<AlertType, React.ReactNode> = {
  temperature: <Thermometer className="h-4 w-4" />,
  door: <DoorOpen className="h-4 w-4" />,
  compressor: <Wrench className="h-4 w-4" />,
  inventory: <Package className="h-4 w-4" />,
  staff: <Users className="h-4 w-4" />,
};

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  critical: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
};

const STATUS_BADGE: Record<AlertStatus, React.ReactNode> = {
  open: <Badge className="bg-red-500/15 text-red-400 border-red-500/30">Open</Badge>,
  in_progress: <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30">In Progress</Badge>,
  resolved: <Badge className="bg-green-500/15 text-green-400 border-green-500/30">Resolved</Badge>,
  escalated: <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30">Escalated</Badge>,
};

function fmt(ts: string) {
  return new Date(ts).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function fmtINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

type FilterStatus = 'all' | AlertStatus;
type FilterSeverity = 'all' | AlertSeverity;
type FilterType = 'all' | AlertType;

export function AlertsPage() {
  const { alerts } = useWorkflow();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const open = alerts.filter(a => a.status === 'open').length;
  const inProgress = alerts.filter(a => a.status === 'in_progress').length;
  const escalated = alerts.filter(a => a.status === 'escalated').length;
  const resolved = alerts.filter(a => a.status === 'resolved').length;
  const totalAtRisk = alerts
    .filter(a => a.status !== 'resolved')
    .reduce((sum, a) => sum + a.financialImpact, 0);

  const filtered = alerts.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (filterType !== 'all' && a.type !== filterType) return false;
    return true;
  });

  const openAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setModalOpen(true);
  };

  const FIELD = 'rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#02A19E]';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">Facility-wide incident and alert tracker</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">Open</p>
          <p className="text-2xl font-bold text-red-400">{open}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold text-amber-400">{inProgress}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">Escalated</p>
          <p className="text-2xl font-bold text-blue-400">{escalated}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold text-green-400">{resolved}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1 md:col-span-1 col-span-2">
          <p className="text-xs text-muted-foreground">Total at Risk</p>
          <p className="text-xl font-bold text-red-400">{fmtINR(totalAtRisk)}</p>
          <p className="text-xs text-muted-foreground">unresolved alerts</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Alert Feed
              </CardTitle>
              <CardDescription>{filtered.length} alert{filtered.length !== 1 ? 's' : ''} shown</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select className={FIELD} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value as FilterSeverity)}>
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
              <select className={FIELD} value={filterStatus} onChange={e => setFilterStatus(e.target.value as FilterStatus)}>
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
              </select>
              <select className={FIELD} value={filterType} onChange={e => setFilterType(e.target.value as FilterType)}>
                <option value="all">All Types</option>
                <option value="temperature">Temperature</option>
                <option value="door">Door</option>
                <option value="compressor">Compressor</option>
                <option value="inventory">Inventory</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
              <AlertTriangle className="h-10 w-10 opacity-30" />
              <p className="text-sm">No alerts match the current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(alert => (
                <button
                  key={alert.id}
                  onClick={() => openAlert(alert as Alert)}
                  className={[
                    'w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-muted/40 transition-colors',
                    alert.severity === 'critical' ? 'border-l-2 border-red-500' : alert.severity === 'warning' ? 'border-l-2 border-amber-500' : 'border-l-2 border-blue-500',
                  ].join(' ')}
                >
                  <div className={`flex-shrink-0 mt-0.5 rounded-full p-1.5 ${SEVERITY_STYLES[alert.severity]}`}>
                    {TYPE_ICON[alert.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-snug">{alert.message}</p>
                      <div className="flex-shrink-0">{STATUS_BADGE[alert.status]}</div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {fmt(alert.time)}
                      </span>
                      {alert.zone && (
                        <span className="text-xs text-muted-foreground">{alert.zone}</span>
                      )}
                      <span className="text-xs text-muted-foreground capitalize">{alert.facility}</span>
                      <span className={`text-xs font-medium capitalize px-1.5 py-0.5 rounded ${SEVERITY_STYLES[alert.severity]}`}>
                        {alert.severity}
                      </span>
                    </div>
                    {alert.status === 'escalated' && alert.escalatedTo && (
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-blue-400">
                        <ArrowUp className="h-3 w-3" />
                        Escalated to {alert.escalatedTo === 'regional' ? 'Regional Manager' : 'HQ (COO)'}
                      </div>
                    )}
                    {alert.status === 'resolved' && alert.resolutionNotes && (
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-green-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {alert.resolutionNotes}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-red-400">{fmtINR(alert.financialImpact)}</p>
                    <p className="text-xs text-muted-foreground">at risk</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          open={modalOpen}
          onOpenChange={setModalOpen}
          currentUserRole="facility"
        />
      )}
    </div>
  );
}
