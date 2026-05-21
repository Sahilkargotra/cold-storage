import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Thermometer, DoorOpen, Cpu, Package, Clock, FileText, Zap, Leaf, Download, AlertCircle, History } from 'lucide-react';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { AlertDetailModal } from '@/components/AlertDetailModal';
import { ActionHistory } from '@/components/ActionHistory';
import { operationalMetrics, energyMetrics } from '@/data/mockData';

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

export function FacilityDashboardEnhanced() {
  const { alerts, transfers, actions, approveTransfer, rejectTransfer, generateReport } = useWorkflow();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-5 w-5" />;
      case 'door':
        return <DoorOpen className="h-5 w-5" />;
      case 'compressor':
        return <Cpu className="h-5 w-5" />;
      case 'inventory':
        return <Package className="h-5 w-5" />;
      case 'staff':
        return <Clock className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const handleGenerateReport = (type: any) => {
    generateReport(type, 'Chennai', 'Ravi (Facility Manager)');
    alert(`${type} report generated successfully!`);
  };

  const facilityAlerts = alerts.filter(a => a.facility === 'Chennai');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facility Dashboard</h1>
          <p className="text-muted-foreground">Chennai Cold Storage - 2,000 Tonnes Capacity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <History className="h-4 w-4 mr-2" />
            {showHistory ? 'Hide' : 'Show'} History
          </Button>
          <Badge variant="outline" className="text-sm px-4 py-2">
            Role: Facility Manager
          </Badge>
        </div>
      </div>

      {/* Action History - Toggle */}
      {showHistory && (
        <ActionHistory actions={actions} facility="Chennai" />
      )}

      {/* Critical Alerts - Interactive */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Critical Alerts
            <Badge variant="destructive" className="ml-2">
              {facilityAlerts.filter(a => a.status === 'open').length} Open
            </Badge>
          </CardTitle>
          <CardDescription>Click on alerts to view details and take action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {facilityAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start justify-between p-4 bg-white border rounded-lg hover:shadow-md transition cursor-pointer ${
                  alert.status === 'resolved' ? 'opacity-60' : ''
                }`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{alert.message}</div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{new Date(alert.time).toLocaleString('en-IN')}</span>
                      {alert.zone && <Badge variant="outline">{alert.zone}</Badge>}
                      <Badge variant={
                        alert.status === 'open' ? 'destructive' :
                        alert.status === 'in_progress' ? 'warning' :
                        alert.status === 'resolved' ? 'success' : 'outline'
                      }>
                        {alert.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{formatCurrency(alert.financialImpact)}</div>
                  <div className="text-xs text-muted-foreground">at risk</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transfer Requests - Interactive */}
      <Card>
        <CardHeader>
          <CardTitle>Cross-Facility Transfer Suggestions</CardTitle>
          <CardDescription>AI-recommended inventory moves - Take action to save costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transfers.filter(t => t.fromFacility === 'Chennai').map((transfer) => (
              <div key={transfer.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={transfer.status === 'pending' ? 'warning' : 'outline'}>
                    {transfer.status.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-green-600 font-semibold">
                    Save {formatCurrency(transfer.savings)}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">{transfer.product}</span>
                  <span className="text-muted-foreground ml-2">({transfer.quantity} kg)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>Chennai</span>
                  <span>→</span>
                  <span>{transfer.toFacility}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{transfer.reason}</p>
                {transfer.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveTransfer(transfer.id, 'Ravi (Facility Manager)')}
                    >
                      Approve Transfer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectTransfer(transfer.id, 'Ravi (Facility Manager)')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Operational Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Operational Metrics</CardTitle>
          <CardDescription>Current performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Energy Cost/Tonne</span>
                <Zap className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">₹{operationalMetrics.energyCostPerTonne}</div>
              <div className="text-xs text-green-500 mt-1">↓ 12% from last month</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Fill Rate</span>
                <Package className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{operationalMetrics.fillRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">2,000 tonnes capacity</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Order Fulfillment</span>
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">{operationalMetrics.orderFulfillmentTime}h</div>
              <div className="text-xs text-green-500 mt-1">Within SLA</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Spoilage This Month</span>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold">{operationalMetrics.spoilageThisMonth}%</div>
              <div className="text-xs text-green-500 mt-1">Below target (2%)</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Door Open (Today)</span>
                <DoorOpen className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">{operationalMetrics.doorOpenMinutes} min</div>
              <div className="text-xs text-yellow-500 mt-1">Above optimal (&lt;10 min)</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Compressor Run Time</span>
                <Cpu className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{operationalMetrics.compressorRunTime}%</div>
              <div className="text-xs text-muted-foreground mt-1">Efficient range</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Documentation - Interactive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Compliance & Documentation
          </CardTitle>
          <CardDescription>Auto-generated reports - One-click export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: 'FSSAI' as const, desc: 'Food Safety Report' },
              { type: 'FDA' as const, desc: 'FDA Compliance' },
              { type: 'Temperature-Log' as const, desc: 'Temperature Records' },
              { type: 'Cleaning-Log' as const, desc: 'Cleaning Schedule' },
              { type: 'Incident-Report' as const, desc: 'Incident Documentation' },
              { type: 'EU-GDP' as const, desc: 'EU GDP Guidelines' },
            ].map((doc) => (
              <div key={doc.type} className="p-4 border rounded-lg hover:shadow-md transition">
                <div className="font-medium mb-1">{doc.type.replace('-', ' ')}</div>
                <div className="text-xs text-muted-foreground mb-3">{doc.desc}</div>
                <Button
                  className="w-full"
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerateReport(doc.type)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Energy & Sustainability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Energy Cost Trend
            </CardTitle>
            <CardDescription>6-month cost analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={energyMetrics.costTrend.map((cost: number, index: number) => ({
                month: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][index],
                cost: cost,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="#f59e0b" name="Energy Cost (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Sustainability Metrics
            </CardTitle>
            <CardDescription>Environmental impact tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Carbon Footprint</div>
                <div className="text-2xl font-bold">{energyMetrics.carbonFootprint} tonnes CO₂/tonne</div>
                <div className="text-xs text-green-500 mt-1">-21% improvement</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Peak vs Off-Peak Usage</div>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Peak</div>
                    <div className="font-semibold">₹{energyMetrics.peakVsOffPeak.peak}</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div>
                    <div className="text-xs text-muted-foreground">Off-Peak</div>
                    <div className="font-semibold text-green-600">₹{energyMetrics.peakVsOffPeak.offPeak}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Equipment Efficiency</div>
                <div className="text-2xl font-bold">{energyMetrics.equipmentEfficiency}/100</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${energyMetrics.equipmentEfficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          open={showAlertModal}
          onOpenChange={setShowAlertModal}
          currentUserRole="facility"
        />
      )}
    </div>
  );
}
