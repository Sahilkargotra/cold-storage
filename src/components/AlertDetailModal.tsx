import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useWorkflow } from '../contexts/WorkflowContext';
import { AlertTriangle, CheckCircle, ArrowUp, Clock, User } from 'lucide-react';

// Inline types to avoid import issues
type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';
type EscalationTarget = 'regional' | 'hq';

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

interface AlertDetailModalProps {
  alert: Alert;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole: 'facility' | 'regional' | 'hq';
}

export function AlertDetailModal({ alert, open, onOpenChange, currentUserRole }: AlertDetailModalProps) {
  const { resolveAlert, escalateAlert } = useWorkflow();
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResolve = () => {
    setIsSubmitting(true);
    const actor = currentUserRole === 'facility' ? 'Ravi (Facility Manager)' :
                  currentUserRole === 'regional' ? 'Priya (Regional Manager)' :
                  'Rajesh (COO)';

    resolveAlert(alert.id, resolutionNotes || 'Alert resolved', actor);
    setResolutionNotes('');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleEscalate = () => {
    setIsSubmitting(true);
    const actor = currentUserRole === 'facility' ? 'Ravi (Facility Manager)' :
                  currentUserRole === 'regional' ? 'Priya (Regional Manager)' :
                  'Rajesh (COO)';

    const escalateTo = currentUserRole === 'facility' ? 'regional' :
                       currentUserRole === 'regional' ? 'hq' : 'hq';

    escalateAlert(alert.id, escalateTo, actor);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const getStatusBadge = () => {
    switch (alert.status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'escalated':
        return <Badge variant="outline">Escalated to {alert.escalatedTo}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${alert.severity === 'critical' ? 'text-destructive' : 'text-yellow-500'}`} />
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
            </DialogTitle>
            {getStatusBadge()}
          </div>
          <DialogDescription className="text-base mt-2">
            {alert.message}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Financial Impact */}
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-destructive">Financial Impact</span>
              <span className="text-2xl font-bold text-destructive">
                ₹{alert.financialImpact.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">
              {alert.severity === 'critical' ? 'Critical - Immediate action required' : 'Warning - Attention needed'}
            </p>
          </div>

          {/* Alert Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Time
              </div>
              <div className="font-medium">{new Date(alert.time).toLocaleString('en-IN')}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Facility
              </div>
              <div className="font-medium">{alert.facility}</div>
            </div>
            {alert.zone && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Zone</div>
                <div className="font-medium">{alert.zone}</div>
              </div>
            )}
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Severity</div>
              <div className="font-medium capitalize">{alert.severity}</div>
            </div>
          </div>

          {/* Resolution Notes */}
          {alert.status === 'open' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Notes</label>
              <textarea
                className="w-full min-h-[100px] p-3 border border-border rounded-md text-sm bg-background text-foreground"
                placeholder="Describe the action taken to resolve this alert..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
              />
            </div>
          )}

          {/* Resolution Info */}
          {alert.status === 'resolved' && alert.resolutionNotes && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-sm font-medium text-green-400 mb-1">Resolution Notes</div>
              <div className="text-sm text-green-300">{alert.resolutionNotes}</div>
            </div>
          )}

          {alert.status === 'escalated' && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-1">
                <ArrowUp className="h-4 w-4" />
                Escalated to {alert.escalatedTo === 'regional' ? 'Regional Manager' : 'HQ (COO)'}
              </div>
              <div className="text-sm text-blue-300">
                {new Date(alert.escalationTime!).toLocaleString('en-IN')}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {alert.status === 'open' && (
            <>
              {currentUserRole === 'facility' && (
                <Button
                  variant="outline"
                  onClick={handleEscalate}
                  disabled={isSubmitting}
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Escalate to Regional
                </Button>
              )}
              {currentUserRole === 'regional' && (
                <Button
                  variant="outline"
                  onClick={handleEscalate}
                  disabled={isSubmitting}
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Escalate to HQ
                </Button>
              )}
              <Button
                onClick={handleResolve}
                disabled={isSubmitting || !resolutionNotes.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve Alert
              </Button>
            </>
          )}
          {alert.status !== 'open' && (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
