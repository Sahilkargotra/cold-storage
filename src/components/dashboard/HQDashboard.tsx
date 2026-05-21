import { KpiGrid, BarChart } from '@vrushabh-b/oneiot-ui';
import type { KpiGridItem } from '@vrushabh-b/oneiot-ui';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, XCircle, Database, Users, Zap, TrendingUp as TrendUp } from 'lucide-react';
import { networkMetrics, regionalFacilities } from '@/data/mockData';
import { FacilitiesMap } from '@/components/map/FacilitiesMap';

export function HQDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'expand':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'reduce':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const totalEnergy = regionalFacilities.reduce((sum, f) => sum + f.energy.today, 0);

  const facilitiesWithAlerts = regionalFacilities
    .map(f => ({
      ...f,
      criticalCount: f.zones.reduce((acc, z) => acc + z.alerts.filter(a => a.severity === 'critical').length, 0),
      warningCount: f.zones.reduce((acc, z) => acc + z.alerts.filter(a => a.severity === 'warning').length, 0),
    }))
    .filter(f => f.criticalCount > 0 || f.warningCount > 0)
    .sort((a, b) => b.criticalCount - a.criticalCount);

  const criticalFacilities = networkMetrics.facilitiesInCritical;
  const operationalFacilities = networkMetrics.totalFacilities - criticalFacilities;

  const kpiItems: KpiGridItem[] = [
    {
      label: 'Total Capacity',
      value: `${networkMetrics.totalCapacity.toLocaleString()} T`,
      icon: <Database className="h-5 w-5" />,
      sublabel: `${networkMetrics.totalFacilities} facilities`,
    },
    {
      label: 'Avg Occupancy',
      value: `${networkMetrics.avgOccupancy}%`,
      icon: <Users className="h-5 w-5" />,
      delta: '+2%',
      deltaPositive: true,
      sublabel: 'Across all facilities',
    },
    {
      label: 'Daily Energy Cost',
      value: formatCurrency(totalEnergy * 7),
      icon: <Zap className="h-5 w-5" />,
      delta: '-8%',
      deltaPositive: true,
      sublabel: 'from last month',
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(networkMetrics.totalRevenueMonth),
      icon: <TrendUp className="h-5 w-5" />,
      delta: '+12%',
      deltaPositive: true,
      sublabel: 'from last month',
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── 1. KPI ROW ── */}
      <KpiGrid items={kpiItems} columns={4} />

      {/* ── 2. NETWORK HEALTH STRIP ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`flex items-center gap-3 rounded-xl px-5 py-4 border ${criticalFacilities > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-muted border-border'}`}>
          <XCircle className={`h-5 w-5 flex-shrink-0 ${criticalFacilities > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          <div>
            <p className="text-xs text-muted-foreground">Critical</p>
            <p className={`text-2xl font-bold ${criticalFacilities > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>{criticalFacilities}</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 rounded-xl px-5 py-4 border ${networkMetrics.activeAlerts > 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-muted border-border'}`}>
          <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${networkMetrics.activeAlerts > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
          <div>
            <p className="text-xs text-muted-foreground">Active Alerts</p>
            <p className={`text-2xl font-bold ${networkMetrics.activeAlerts > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>{networkMetrics.activeAlerts}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl px-5 py-4 bg-green-500/10 border border-green-500/30">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
          <div>
            <p className="text-xs text-muted-foreground">Operational</p>
            <p className="text-2xl font-bold text-green-500">{operationalFacilities}</p>
          </div>
        </div>
      </div>

      {/* ── 3. MAP + ALERTS SIDE-BY-SIDE (50/50) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Facility Locations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{regionalFacilities.length} facilities · click marker for details</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />OK</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Maint.</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Critical</span>
            </div>
          </div>
          <FacilitiesMap
            facilities={regionalFacilities}
            center={[78.9629, 20.5937]}
            zoom={5}
            height="360px"
            showNetworkStats={false}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-card rounded-xl border border-border flex-1">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Network Alerts</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Facilities requiring attention</p>
            </div>
            <div className="p-4 space-y-2">
              {facilitiesWithAlerts.length === 0 ? (
                <div className="flex items-center gap-2 py-4 text-green-500 justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">All facilities operating normally</span>
                </div>
              ) : (
                facilitiesWithAlerts.map(f => (
                  <div key={f.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted hover:bg-muted/80 transition">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${f.criticalCount > 0 ? 'bg-red-500' : 'bg-yellow-400'}`} />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">{f.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {f.criticalCount > 0 && (
                        <Badge variant="destructive" className="text-[10px] px-2 py-0.5">{f.criticalCount} Critical</Badge>
                      )}
                      {f.warningCount > 0 && (
                        <Badge variant="warning" className="text-[10px] px-2 py-0.5">{f.warningCount} Warning</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Top Performers</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Ranked by ROI</p>
            </div>
            <div className="p-4 space-y-2">
              {networkMetrics.topPerformers.slice(0, 3).map((f, i) => (
                <div key={f.facility} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      i === 1 ? 'bg-muted-foreground/20 text-muted-foreground' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>{i + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{f.facility}</p>
                      <p className="text-[10px] text-muted-foreground">{f.margin}% margin</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">{f.roi}% ROI</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. FACILITY CARDS GRID ── */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Network Facilities Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regionalFacilities.map((facility) => {
            const facilityAlerts = facility.zones.reduce((acc, z) => acc + z.alerts.length, 0);
            const facilityCritical = facility.zones.reduce((acc, z) => acc + z.alerts.filter(a => a.severity === 'critical').length, 0);
            const revenuePerTonne = facility.revenue.today / facility.totalCapacity;

            return (
              <div key={facility.id} className="bg-card rounded-xl border border-border p-5 hover:border-border/60 transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-foreground">{facility.name}</h3>
                      <Badge variant={facility.status === 'operational' ? 'success' : 'destructive'} className="text-[10px]">
                        {facility.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{facility.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-foreground">{formatCurrency(facility.revenue.today)}</p>
                    <p className="text-[10px] text-muted-foreground">today</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-muted rounded-lg py-2">
                    <p className="text-xs font-bold text-foreground">{facility.occupancy}%</p>
                    <p className="text-[10px] text-muted-foreground">Occupancy</p>
                  </div>
                  <div className="bg-muted rounded-lg py-2">
                    <p className="text-xs font-bold text-foreground">{facility.totalCapacity}T</p>
                    <p className="text-[10px] text-muted-foreground">Capacity</p>
                  </div>
                  <div className="bg-muted rounded-lg py-2">
                    <p className="text-xs font-bold text-foreground">₹{revenuePerTonne.toFixed(0)}</p>
                    <p className="text-[10px] text-muted-foreground">Rev/T</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    {facilityCritical > 0 ? (
                      <span className="text-xs text-destructive font-semibold">{facilityCritical} Critical</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{facilityAlerts} alerts</span>
                    )}
                  </div>
                  <button className="text-xs text-primary hover:opacity-80 font-medium">View →</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. GROWTH INTELLIGENCE ── */}
      <div className="bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Growth & Expansion Intelligence</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Capacity vs projected demand by region</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {networkMetrics.growthRegions.map((region) => (
              <div key={region.region} className="p-4 border border-border rounded-xl hover:bg-muted/50 transition">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">{region.region}</h4>
                  <Badge variant={region.recommendation === 'expand' ? 'info' : 'secondary'} className="text-[10px]">
                    {region.recommendation.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Current</span>
                      <span className="font-medium text-foreground">{region.current.toLocaleString()} T</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${(region.current / region.projected) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Projected</span>
                      <span className="font-medium text-foreground">{region.projected.toLocaleString()} T</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div className="h-1.5 bg-muted-foreground/40 rounded-full w-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                    {getTrendIcon(region.recommendation)}
                    <span className="text-xs text-foreground">
                      {region.recommendation === 'expand'
                        ? `Expand by ${((region.projected - region.current) / region.current * 100).toFixed(0)}%`
                        : 'Maintain current capacity'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. ENERGY OPTIMIZATION + DOOR/TEMP COMPLIANCE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Energy Cost Ranking</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Highest cost/tonne = biggest savings opportunity</p>
          </div>
          <div className="p-4 space-y-2">
            {[...regionalFacilities]
              .sort((a, b) => b.energy.costPerTonne - a.energy.costPerTonne)
              .map((facility, index) => {
                const potentialSavings = facility.energy.costPerTonne > 2000
                  ? ((facility.energy.costPerTonne - 1800) * (facility.totalCapacity * facility.occupancy / 100))
                  : 0;
                return (
                  <div key={facility.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                    index === 0 ? 'bg-destructive/10 border-destructive/30' :
                    index === 1 ? 'bg-orange-500/10 border-orange-500/30' :
                    'bg-muted border-border'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        index === 0 ? 'bg-destructive/20 text-destructive' :
                        index === 1 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-muted-foreground/20 text-muted-foreground'
                      }`}>{index + 1}</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{facility.name}</p>
                        <p className="text-[10px] text-muted-foreground">{facility.energy.today} kWh/day</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${index < 2 ? 'text-destructive' : 'text-foreground'}`}>₹{facility.energy.costPerTonne}/T</p>
                      {potentialSavings > 0 && (
                        <p className="text-[10px] text-green-400 font-medium">Save {formatCurrency(potentialSavings * 30)}/mo</p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Operational Issues</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Open doors & temperature violations</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-destructive/10 rounded-xl p-3 border border-destructive/20">
              <p className="text-xs font-semibold text-destructive mb-2">Open Doors</p>
              <div className="space-y-1.5">
                {regionalFacilities
                  .map(f => ({
                    ...f,
                    openDoors: f.zones.reduce((s, z) => s + z.doors.filter(d => d.status === 'open').length, 0),
                    avgDuration: f.zones.reduce((s, z) => s + z.doors.reduce((ds, d) => ds + (d.openDuration || 0), 0), 0) / f.zones.length || 0,
                  }))
                  .filter(f => f.openDoors > 0)
                  .map(f => (
                    <div key={f.id} className="flex justify-between text-xs bg-card rounded-lg px-3 py-2 border border-border">
                      <span className="font-medium text-foreground">{f.name.split(' ')[0]}</span>
                      <span className="text-destructive font-semibold">{f.openDoors} open · {f.avgDuration.toFixed(0)} min avg</span>
                    </div>
                  ))}
                {regionalFacilities.every(f => f.zones.every(z => z.doors.every(d => d.status === 'closed'))) && (
                  <p className="text-xs text-green-400 text-center py-1">✓ All doors closed</p>
                )}
              </div>
            </div>
            <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
              <p className="text-xs font-semibold text-orange-400 mb-2">Temperature Violations</p>
              <div className="space-y-1.5">
                {regionalFacilities
                  .map(f => ({
                    ...f,
                    violations: f.zones.filter(z => z.temperature.current < z.temperature.min || z.temperature.current > z.temperature.max),
                  }))
                  .filter(f => f.violations.length > 0)
                  .map(f => (
                    <div key={f.id} className="flex justify-between text-xs bg-card rounded-lg px-3 py-2 border border-border">
                      <span className="font-medium text-foreground">{f.name.split(' ')[0]}</span>
                      <span className="text-orange-400 font-semibold">{f.violations.length} zone{f.violations.length > 1 ? 's' : ''} out of range</span>
                    </div>
                  ))}
                {regionalFacilities.every(f => f.zones.every(z => z.temperature.current >= z.temperature.min && z.temperature.current <= z.temperature.max)) && (
                  <p className="text-xs text-green-400 text-center py-1">✓ All zones in range</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. PERFORMANCE CHART ── */}
      <div className="bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Facility Performance Comparison</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Revenue vs energy cost across facilities</p>
        </div>
        <div className="p-5">
          <BarChart
            data={regionalFacilities.map(f => ({
              name: f.name.split(' ')[0],
              revenue: Math.round(f.revenue.today / 1000),
            }))}
            xKey="name"
            series={['revenue']}
            config={{ revenue: { label: 'Revenue (₹K)', color: '#02A19E' } }}
            className="h-72"
          />
        </div>
      </div>
    </div>
  );
}
