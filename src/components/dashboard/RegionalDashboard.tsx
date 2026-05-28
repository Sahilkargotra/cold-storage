import { KpiGrid, BarChart } from '@vrushabh-b/oneiot-ui';
import type { KpiGridItem } from '@vrushabh-b/oneiot-ui';
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@vrushabh-b/oneiot-ui';
import {
  AlertTriangle, CheckCircle2, Zap, Database, Activity,
  MapPin, Thermometer, DoorOpen, IndianRupee, Building2,
  TrendingUp, RefreshCw,
} from 'lucide-react';
import { regionalFacilities } from '@/data/mockData';
import { FacilitiesMap } from '@/components/map/FacilitiesMap';
import { useSetup } from '@/contexts/SetupContext';

const TEAL = '#02A19E';
const PURPLE = '#6333ff';

export function RegionalDashboard() {
  const { facilities } = useSetup();

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const totalCapacity = regionalFacilities.reduce((s, f) => s + f.totalCapacity, 0);
  const totalOccupied = regionalFacilities.reduce((s, f) => s + f.totalCapacity * f.occupancy / 100, 0);
  const avgOccupancy = Math.round(totalOccupied / totalCapacity * 100);
  const totalRevenue = regionalFacilities.reduce((s, f) => s + f.revenue.today, 0);
  const totalEnergy = regionalFacilities.reduce((s, f) => s + f.energy.today, 0);

  const enriched = regionalFacilities.map(f => ({
    ...f,
    criticalCount: f.zones.reduce((a, z) => a + z.alerts.filter(al => al.severity === 'critical').length, 0),
    warningCount: f.zones.reduce((a, z) => a + z.alerts.filter(al => al.severity === 'warning').length, 0),
    openDoors: f.zones.reduce((a, z) => a + z.doors.filter(d => d.status === 'open').length, 0),
    zonesOffTarget: f.zones.filter(z => Math.abs(z.temperature.current - z.temperature.target) > 2).length,
    avgTemp: f.zones.length > 0
      ? f.zones.reduce((a, z) => a + z.temperature.current, 0) / f.zones.length
      : null,
  }));

  const totalCritical = enriched.reduce((s, f) => s + f.criticalCount, 0);
  const totalWarning = enriched.reduce((s, f) => s + f.warningCount, 0);

  const kpiItems: KpiGridItem[] = [
    {
      id: 'capacity',
      label: 'Total Capacity',
      value: `${totalCapacity.toLocaleString()} T`,
      icon: <Database className="h-5 w-5" />,
      sublabel: `${regionalFacilities.length} facilities`,
    },
    {
      id: 'occupancy',
      label: 'Avg Occupancy',
      value: `${avgOccupancy}%`,
      icon: <Activity className="h-5 w-5" />,
      delta: '+3%',
      deltaPositive: true,
      sublabel: 'from last week',
    },
    {
      id: 'revenue',
      label: "Today's Revenue",
      value: fmt(totalRevenue),
      icon: <IndianRupee className="h-5 w-5" />,
      delta: '+7%',
      deltaPositive: true,
      sublabel: 'from yesterday',
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: String(totalCritical + totalWarning),
      icon: <AlertTriangle className="h-5 w-5" />,
      delta: totalCritical > 0 ? `${totalCritical} critical` : 'none critical',
      deltaPositive: totalCritical === 0,
      sublabel: `${totalWarning} warnings`,
    },
  ];

  const allAlerts = enriched.flatMap(f =>
    f.zones.flatMap(z =>
      z.alerts.map(a => ({ ...a, facilityName: f.name, facilityLocation: f.location }))
    )
  ).sort((a, b) => (a.severity === 'critical' ? -1 : b.severity === 'critical' ? 1 : 0));

  return (
    <div className="space-y-6">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">South Region</h1>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Tamil Nadu · Karnataka · Kerala · Telangana</span>
            <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3" />Updated just now</span>
            {facilities.length > 0 && (
              <span className="flex items-center gap-1 text-[#02A19E]"><Building2 className="h-3 w-3" />{facilities.length} custom facility</span>
            )}
          </div>
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <KpiGrid items={kpiItems} cols={4} />

      {/* ── CRITICAL BANNER ── */}
      {totalCritical > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
          <p className="text-sm font-semibold text-destructive flex-1">
            {totalCritical} critical alert{totalCritical > 1 ? 's' : ''} across{' '}
            {enriched.filter(f => f.criticalCount > 0).length} facilit{enriched.filter(f => f.criticalCount > 0).length > 1 ? 'ies' : 'y'}
            <span className="ml-2 font-normal text-destructive/80">
              — {enriched.filter(f => f.criticalCount > 0).map(f => f.name.split(' ')[0]).join(', ')}
            </span>
          </p>
        </div>
      )}

      {/* ── PRIMARY ZONE: MAP (2/3) + ALERTS (1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Facility Locations</p>
              <p className="text-xs text-muted-foreground mt-0.5">{regionalFacilities.length} facilities · click marker for details</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />Operational</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-400" />Maintenance</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" />Critical</span>
            </div>
          </div>
          <FacilitiesMap
            facilities={regionalFacilities}
            center={[78.9629, 20.5937]}
            zoom={5}
            height="380px"
            showNetworkStats={false}
          />
        </div>

        <div className="rounded-xl border border-border bg-card flex flex-col">
          <div className="px-5 py-3.5 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Active Alerts</p>
            <p className="text-xs text-muted-foreground mt-0.5">{allAlerts.length} total · sorted by severity</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/60" style={{ maxHeight: '380px' }}>
            {allAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <p className="text-sm font-medium text-foreground">All clear</p>
                <p className="text-xs text-muted-foreground">No active alerts across the region</p>
              </div>
            ) : (
              allAlerts.map(alert => (
                <div key={alert.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${alert.severity === 'critical' ? 'bg-destructive' : alert.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug">{alert.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{alert.facilityName} · {alert.facilityLocation}</p>
                    </div>
                    <Badge
                      variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'warning' ? 'warning' : 'info'}
                      className="text-[9px] flex-shrink-0 ml-auto"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── FACILITY PERFORMANCE TABLE ── */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Performance</CardTitle>
          <CardDescription>Real-time status across all {regionalFacilities.length} facilities in the region</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Facility</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Occupancy</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Today's Rev</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Rev / T</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Energy</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Alerts</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Issues</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map(f => {
                  const revenuePerTonne = Math.round(f.revenue.today / f.totalCapacity);
                  const hasIssues = f.openDoors > 0 || f.zonesOffTarget > 0;
                  return (
                    <tr key={f.id} className="border-b border-border/40 hover:bg-muted/25 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-foreground">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />{f.location}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={f.status === 'operational' ? 'success' : f.status === 'critical' ? 'destructive' : 'warning'}
                          className="capitalize text-[10px]"
                        >
                          {f.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${f.occupancy > 95 ? 'bg-yellow-400' : 'bg-[#02A19E]'}`}
                              style={{ width: `${f.occupancy}%` }}
                            />
                          </div>
                          <span className={`font-semibold ${f.occupancy > 95 ? 'text-yellow-400' : 'text-foreground'}`}>{f.occupancy}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{f.totalCapacity.toLocaleString()} T total</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-semibold text-foreground">{fmt(f.revenue.today)}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-semibold text-foreground">₹{revenuePerTonne}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-semibold text-foreground">{f.energy.today.toLocaleString()} kWh</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">₹{f.energy.costPerTonne}/T</p>
                      </td>
                      <td className="py-4 px-4">
                        {f.criticalCount === 0 && f.warningCount === 0 ? (
                          <span className="flex items-center gap-1 text-green-400 text-[10px] font-medium">
                            <CheckCircle2 className="h-3 w-3" />All clear
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 flex-wrap">
                            {f.criticalCount > 0 && <Badge variant="destructive" className="text-[9px]">{f.criticalCount} Critical</Badge>}
                            {f.warningCount > 0 && <Badge variant="warning" className="text-[9px]">{f.warningCount} Warning</Badge>}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {!hasIssues ? (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {f.openDoors > 0 && (
                              <span className="flex items-center gap-1 text-[10px] text-yellow-400">
                                <DoorOpen className="h-3 w-3" />{f.openDoors} door{f.openDoors > 1 ? 's' : ''} open
                              </span>
                            )}
                            {f.zonesOffTarget > 0 && (
                              <span className="flex items-center gap-1 text-[10px] text-destructive">
                                <Thermometer className="h-3 w-3" />{f.zonesOffTarget} zone{f.zonesOffTarget > 1 ? 's' : ''} off-target
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/20">
                  <td className="py-3 px-4 text-xs font-semibold text-muted-foreground" colSpan={2}>Region Total</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-[#02A19E]" style={{ width: `${avgOccupancy}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground">{avgOccupancy}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{totalCapacity.toLocaleString()} T total</p>
                  </td>
                  <td className="py-3 px-4 text-right text-xs font-semibold text-foreground">{fmt(totalRevenue)}</td>
                  <td className="py-3 px-4 text-right text-xs font-semibold text-foreground">₹{Math.round(totalRevenue / totalCapacity)}</td>
                  <td className="py-3 px-4 text-right text-xs font-semibold text-foreground">{totalEnergy.toLocaleString()} kWh</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {totalCritical > 0 && <Badge variant="destructive" className="text-[9px]">{totalCritical} Critical</Badge>}
                      {totalWarning > 0 && <Badge variant="warning" className="text-[9px]">{totalWarning} Warning</Badge>}
                      {totalCritical === 0 && totalWarning === 0 && <span className="text-[10px] text-green-400">All clear</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4" />
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Revenue by Facility
            </CardTitle>
            <CardDescription>Today's revenue in ₹K · sorted by performance</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={[...regionalFacilities]
                .sort((a, b) => b.revenue.today - a.revenue.today)
                .map(f => ({ name: f.name.split(' ')[0], revenue: Math.round(f.revenue.today / 1000) }))}
              xKey="name"
              series={['revenue']}
              config={{ revenue: { label: 'Revenue (₹K)', color: TEAL } }}
              className="h-56"
            />
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Best today</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {[...regionalFacilities].sort((a, b) => b.revenue.today - a.revenue.today)[0].name.split(' ')[0]}
                </p>
                <p className="text-xs text-[#02A19E]">
                  {fmt([...regionalFacilities].sort((a, b) => b.revenue.today - a.revenue.today)[0].revenue.today)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Needs attention</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {[...regionalFacilities].sort((a, b) => a.revenue.today - b.revenue.today)[0].name.split(' ')[0]}
                </p>
                <p className="text-xs text-yellow-400">
                  {fmt([...regionalFacilities].sort((a, b) => a.revenue.today - b.revenue.today)[0].revenue.today)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              Energy Cost per Tonne
            </CardTitle>
            <CardDescription>₹/T · lower is better · target below ₹2,000/T</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={[...regionalFacilities]
                .sort((a, b) => b.energy.costPerTonne - a.energy.costPerTonne)
                .map(f => ({ name: f.name.split(' ')[0], cost: f.energy.costPerTonne }))}
              xKey="name"
              series={['cost']}
              config={{ cost: { label: 'Cost (₹/T)', color: PURPLE } }}
              className="h-56"
            />
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Most efficient</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {[...regionalFacilities].sort((a, b) => a.energy.costPerTonne - b.energy.costPerTonne)[0].name.split(' ')[0]}
                </p>
                <p className="text-xs text-green-400">
                  ₹{[...regionalFacilities].sort((a, b) => a.energy.costPerTonne - b.energy.costPerTonne)[0].energy.costPerTonne}/T
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Highest cost</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {[...regionalFacilities].sort((a, b) => b.energy.costPerTonne - a.energy.costPerTonne)[0].name.split(' ')[0]}
                </p>
                <p className="text-xs text-destructive">
                  ₹{[...regionalFacilities].sort((a, b) => b.energy.costPerTonne - a.energy.costPerTonne)[0].energy.costPerTonne}/T
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
