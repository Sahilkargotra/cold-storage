import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Clock, FileText, Wrench } from 'lucide-react';

// Inline types to avoid import issues
type ActionStatus = 'completed' | 'pending' | 'failed';

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

interface ActionHistoryProps {
  actions: Action[];
  facility?: string;
}

export function ActionHistory({ actions, facility }: ActionHistoryProps) {
  const getActionIcon = (type: Action['type']) => {
    switch (type) {
      case 'alert_resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'transfer_approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'transfer_rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'report_generated':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'maintenance_requested':
        return <Wrench className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    if (value === undefined) return '-';
    const prefix = value < 0 ? 'Saved ₹' : '₹';
    return prefix + Math.abs(value).toLocaleString('en-IN');
  };

  const filteredActions = facility
    ? actions.filter(action => action.facility === facility)
    : actions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action History</CardTitle>
        <CardDescription>
          Recent actions and their financial impact
          {facility && ` - ${facility}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredActions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No actions recorded yet
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActions.map((action) => (
              <div key={action.id} className="p-3 border rounded-lg hover:bg-muted/50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getActionIcon(action.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{action.description}</div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{action.actor}</span>
                        <span>•</span>
                        <span>{new Date(action.timestamp).toLocaleString('en-IN')}</span>
                        {action.facility && (
                          <>
                            <span>•</span>
                            <span>{action.facility}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {action.financialImpact !== undefined && (
                      <div className={`font-semibold ${action.financialImpact < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(action.financialImpact)}
                      </div>
                    )}
                    <Badge
                      variant={action.status === 'completed' ? 'success' : 'warning'}
                      className="mt-1"
                    >
                      {action.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
