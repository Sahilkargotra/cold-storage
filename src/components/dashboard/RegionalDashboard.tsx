import { KpiGrid, BarChart } from '@vrushabh-b/oneiot-ui';
import type { KpiGridItem } from '@vrushabh-b/oneiot-ui';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Zap, Database, TrendingUp, Activity } from 'lucide-react';
import { regionalFacilities } from '@/data/mockData';
import { FacilitiesMap } from '@/components/map/FacilitiesMap';

export function RegionalDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalCapacity = regionalFacilities.reduce((sum, f) => sum + f.totalCapacity, 0);
  const totalOccupancy = regionalFacilities.reduce((sum, f) => sum + (f.totalCapacity * f.occupancy / 100), 0);
  const avgOccupancy = (totalOccupancy / totalCapacity * 100);
  const totalRevenue = regionalFacilities.reduce((sum, f) => sum + f.revenue.today, 0);
  const totalEnergy = regionalFacilities.reduce((sum, f) => sum + f.energy.today, 0);

  const facilitiesWithAlerts = regionalFacilities
    .map(f => ({
      ...f,
      criticalCount: f.zones.reduce((acc, z) => acc + z.alerts.filter(a => a.severity === 'critical').length, 0),
      warningCount: f.zones.reduce((acc, z) => acc + z.alerts.filter(a => a.severity === 'warning').length, 0),
    }))
    .filter(f => f.criticalCount > 0 || f.warningCount > 0)
    .sort((a, b) => b.criticalCount - a.criticalCount);

  const totalCritical = facilitiesWithAlerts.reduce((s, f) => s + f.criticalCount, 0);

  const kpiItems: KpiGridItem[] = [
    {
      label: 'Total Capacity',
      value: `${totalCapacity.toLocaleString()} T`,
      icon: <Database className="h-5 w-5" />,
      sublabel: `${regionalFacilities.length} facilities`,
    },
    {
      label: 'Avg Occupancy',
      value: `${avgOccupancy.toFixed(1)}%`,
      icon: <Activity className="h-5 w-5" />,
      delta: '+3%',
      deltaPositive: true,
      sublabel: 'from last week',
    },
    {
      label: "Today's Revenue",
      value: formatCurrency(totalRevenue),
      icon: <TrendingUp className="h-5 w-5" />,
      delta: '+7%',
      deltaPositive: true,
      sublabel: 'from yesterday',
    },
    {
      label: 'Energy Cost',
      value: formatCurrency(totalEnergy * 7),
      icon: <Zap className="h-5 w-5" />,
      delta: '-5%',
      deltaPositive: true,
      sublabel: 'from yesterday',
    },
  ];

  return (
    <div className="space-y-6">

      <KpiGrid items={kpiItems} columns={4} />

      {totalCritical > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-destructive">
              {totalCritical} critical alert{totalCritical > 1 ? 's' : ''} across {facilitiesWithAlerts.filter(f => f.criticalCount > 0).length} facilit{facilitiesWithAlerts.filter(f => f.criticalCount > 0).length > 1 ? 'ies' : 'y'}
            </p>
            <p className="text-xs text-destructive/80 mt-0.5">
              {facilitiesWithAlerts.filter(f => f.criticalCount > 0).map(f => f.name).join(' · ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Facility Locations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{regionalFacilities.length} facilities · click for details</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />OK</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Critical</span>
            </div>
          </div>
          <FacilitiesMap
            facilities={regionalFacilities}
            center={[78.9629, 20.5937]}
            zoom={5}
            height="340px"
            showNetworkStats={false}
          />
        </div>

        <div className="flex flex-col gap-3">
          {regionalFacilities.map(facility => {
            const criticalCount = facility.zones.reduce((acc, z) => acc + z.alerts.filter(a => a.severity === 'critical').length, 0);
            const warningCount = facility.zones.reduce((acc, z) => acc + z.alerts.filter(a => a.severity === 'warning').length, 0);
            const revenuePerTonne = facility.revenue.today / facility.totalCapacity;

            return (
              <div key={facility.id} className={`bg-card rounded-xl border p-4 hover:bg-muted/30 transition ${
                criticalCount > 0 ? 'border-destructive/40' : 'border-border'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        facility.status === 'operational' && criticalCount === 0 ? 'bg-green-500' :
                        criticalCount > 0 ? 'bg-red-500' : 'bg-yellow-400'
                      }`} />
                      <h4 className="text-sm font-semibold text-foreground">{facility.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 pl-4">{facility.location}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {criticalCount > 0 && <Badge variant="destructive" className="text-[10px]">{criticalCount} Critical</Badge>}
                    {warningCount > 0 && <Badge variant="warning" className="text-[10px]">{warningCount} Warning</Badge>}
                    {criticalCount === 0 && warningCount === 0 && <Badge variant="success" className="text-[10px]">OK</Badge>}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs font-bold text-foreground">{facility.occupancy}%</p>
                    <p className="text-[10px] text-muted-foreground">Occupancy</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{formatCurrency(facility.revenue.today)}</p>
                    <p className="text-[10px] text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{facility.energy.today} kWh</p>
                    <p className="text-[10px] text-muted-foreground">Energy</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">₹{revenuePerTonne.toFixed(0)}</p>
                    <p className="text-[10px] text-muted-foreground">Rev/T</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Active Alerts by Facility</h3>
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
                    {f.criticalCount > 0 && <Badge variant="destructive" className="text-[10px]">{f.criticalCount} Critical</Badge>}
                    {f.warningCount > 0 && <Badge variant="warning" className="text-[10px]">{f.warningCount} Warning</Badge>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Performance Leaderboard</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Ranked by revenue per tonne</p>
          </div>
          <div className="p-4 space-y-2">
            {[...regionalFacilities]
              .sort((a, b) => (b.revenue.today / b.totalCapacity) - (a.revenue.today / a.totalCapacity))
              .slice(0, 4)
              .map((facility, index) => {
                const revenuePerTonne = facility.revenue.today / facility.totalCapacity;
                return (
                  <div key={facility.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-muted-foreground/20 text-muted-foreground' :
                        index === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-muted-foreground/10 text-muted-foreground'
                      }`}>{index + 1}</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{facility.name}</p>
                        <p className="text-[10px] text-muted-foreground">₹{revenuePerTonne.toFixed(0)}/T</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">{formatCurrency(facility.revenue.today)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Facility Comparison</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Side-by-side metrics</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalFacilities.map(facility => (
              <div key={facility.id} className="bg-muted rounded-xl p-4 hover:bg-muted/80 transition">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">{facility.name.split(' ')[0]}</h4>
                  <Badge variant={facility.status === 'operational' ? 'success' : 'destructive'} className="text-[10px]">
                    {facility.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    ['Capacity', `${facility.totalCapacity}T`],
                    ['Occupancy', `${facility.occupancy}%`],
                    ['Revenue', formatCurrency(facility.revenue.today)],
                    ['Energy', `${facility.energy.today} kWh`],
                    ['Cost/T', `₹${facility.energy.costPerTonne}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="h-1.5 bg-border rounded-full mt-3">
                  <div className="h-1.5 bg-primary rounded-full" style={{ width: `${facility.occupancy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Revenue by Facility</h3>
          </div>
          <div className="p-5">
            <BarChart
              data={regionalFacilities.map(f => ({ name: f.name.split(' ')[0], revenue: Math.round(f.revenue.today / 1000) }))}
              xKey="name"
              series={['revenue']}
              config={{ revenue: { label: 'Revenue (₹K)', color: '#02A19E' } }}
              className="h-60"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Energy Consumption</h3>
          </div>
          <div className="p-5">
            <BarChart
              data={regionalFacilities.map(f => ({ name: f.name.split(' ')[0], energy: f.energy.today }))}
              xKey="name"
              series={['energy']}
              config={{ energy: { label: 'Energy (kWh)', color: '#6333ff' } }}
              className="h-60"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Energy Efficiency Rankings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Cost per tonne — highest = worst efficiency</p>
          </div>
          <div className="p-4 space-y-2">
            {[...regionalFacilities]
              .sort((a, b) => b.energy.costPerTonne - a.energy.costPerTonne)
              .map((facility, index) => {
                const efficiencyScore = facility.occupancy > 0
                  ? (facility.energy.today / (facility.totalCapacity * facility.occupancy / 100))
                  : 0;
                const isHighCost = facility.energy.costPerTonne > 2000;
                return (
                  <div key={facility.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                    index === 0 && isHighCost ? 'bg-destructive/10 border-destructive/30' :
                    index === 1 && isHighCost ? 'bg-orange-500/10 border-orange-500/30' :
                    'bg-muted border-border'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        index === 0 && isHighCost ? 'bg-destructive/20 text-destructive' :
                        index === 1 && isHighCost ? 'bg-orange-500/20 text-orange-400' :
                        'bg-muted-foreground/20 text-muted-foreground'
                      }`}>{index + 1}</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{facility.name}</p>
                        <p className="text-[10px] text-muted-foreground">{efficiencyScore.toFixed(1)} kWh/T · {facility.location}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${isHighCost && index < 2 ? 'text-destructive' : 'text-foreground'}`}>
                      ₹{facility.energy.costPerTonne}/T
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Cost Reduction Opportunities</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-destructive/10 rounded-xl p-3 border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-destructive/20 rounded-lg"><AlertTriangle className="w-3.5 h-3.5 text-destructive" /></div>
                <span className="text-xs font-semibold text-destructive">Open Door Impact</span>
              </div>
              <div className="space-y-1.5">
                {regionalFacilities
                  .map(f => ({
                    ...f,
                    openDoors: f.zones.reduce((s, z) => s + z.doors.filter(d => d.status === 'open').length, 0),
                    avgDuration: f.zones.reduce((s, z) => s + z.doors.reduce((ds, d) => ds + (d.openDuration || 0), 0), 0) / f.zones.length || 0,
                  }))
                  .filter(f => f.openDoors > 0)
                  .slice(0, 3)
                  .map(f => (
                    <div key={f.id} className="flex justify-between text-xs bg-card rounded-lg px-3 py-2 border border-destructive/20">
                      <span className="font-medium text-foreground">{f.name.split(' ')[0]}</span>
                      <span className="text-destructive font-semibold">{formatCurrency(f.avgDuration * 0.5 * f.openDoors * 7 * 30)}/mo waste</span>
                    </div>
                  ))}
                {regionalFacilities.every(f => f.zones.every(z => z.doors.every(d => d.status === 'closed'))) && (
                  <p className="text-xs text-green-400 text-center py-1">✓ All doors closed</p>
                )}
              </div>
            </div>

            <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-yellow-500/20 rounded-lg"><Zap className="w-3.5 h-3.5 text-yellow-400" /></div>
                <span className="text-xs font-semibold text-yellow-400">Temperature Setpoint Issues</span>
              </div>
              <div className="space-y-1.5">
                {regionalFacilities
                  .filter(f => f.zones.some(z => Math.abs(z.temperature.current - z.temperature.target) > 2))
                  .slice(0, 3)
                  .map(f => {
                    const zonesOff = f.zones.filter(z => Math.abs(z.temperature.current - z.temperature.target) > 2);
                    return (
                      <div key={f.id} className="flex justify-between text-xs bg-card rounded-lg px-3 py-2 border border-yellow-500/20">
                        <span className="font-medium text-foreground">{f.name.split(' ')[0]}</span>
                        <span className="text-yellow-400 font-semibold">{zonesOff.length} zone{zonesOff.length > 1 ? 's' : ''} off-target</span>
                      </div>
                    );
                  })}
                {regionalFacilities.every(f => f.zones.every(z => Math.abs(z.temperature.current - z.temperature.target) <= 2)) && (
                  <p className="text-xs text-green-400 text-center py-1">✓ All zones optimized</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
