import { KpiGrid, BarChart, ProgressRing, StatCard } from '@vrushabh-b/oneiot-ui';
import type { KpiGridItem } from '@vrushabh-b/oneiot-ui';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertTriangle, CheckCircle2, Zap, Database, TrendingUp, Activity,
  MapPin, ArrowUpRight, ArrowDownRight, Thermometer, DoorOpen, IndianRupee,
} from 'lucide-react';
import { regionalFacilities } from '@/data/mockData';
import { FacilitiesMap } from '@/components/map/FacilitiesMap';

const TEAL = '#02A19E';
const PURPLE = '#6333ff';
const AMBER = '#f59e0b';

export function RegionalDashboard() {
  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const totalCapacity = regionalFacilities.reduce((s, f) => s + f.totalCapacity, 0);
  const totalOccupied = regionalFacilities.reduce((s, f) => s + f.totalCapacity * f.occupancy / 100, 0);
  const avgOccupancy = totalOccupied / totalCapacity * 100;
  const totalRevenue = regionalFacilities.reduce((s, f) => s + f.revenue.today, 0);
  const totalEnergy = regionalFacilities.reduce((s, f) => s + f.energy.today, 0);

  const facilitiesWithAlerts = regionalFacilities
    .map(f => ({
      ...f,
      criticalCount: f.zones.reduce((a, z) => a + z.alerts.filter(al => al.severity === 'critical').length, 0),
      warningCount: f.zones.reduce((a, z) => a + z.alerts.filter(al => al.severity === 'warning').length, 0),
      openDoors: f.zones.reduce((a, z) => a + z.doors.filter(d => d.status === 'open').length, 0),
      zonesOffTarget: f.zones.filter(z => Math.abs(z.temperature.current - z.temperature.target) > 2).length,
    }))
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
      value: fmt(totalRevenue),
      icon: <TrendingUp className="h-5 w-5" />,
      delta: '+7%',
      deltaPositive: true,
      sublabel: 'from yesterday',
    },
    {
      label: 'Energy Cost',
      value: fmt(totalEnergy * 7),
      icon: <Zap className="h-5 w-5" />,
      delta: '-5%',
      deltaPositive: true,
      sublabel: 'from yesterday',
    },
  ];

  const revenueSorted = [...regionalFacilities].sort(
    (a, b) => b.revenue.today / b.totalCapacity - a.revenue.today / a.totalCapacity,
  );

  const energySorted = [...regionalFacilities].sort(
    (a, b) => b.energy.costPerTonne - a.energy.costPerTonne,
  );

  return (
    <div className="space-y-6">

      <KpiGrid items={kpiItems} columns={4} />

      {totalCritical > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
          <p className="text-sm font-semibold text-destructive flex-1">
            {totalCritical} critical alert{totalCritical > 1 ? 's' : ''} across{' '}
            {facilitiesWithAlerts.filter(f => f.criticalCount > 0).length} facilit{facilitiesWithAlerts.filter(f => f.criticalCount > 0).length > 1 ? 'ies' : 'y'}
            <span className="font-normal text-destructive/80 ml-2">
              — {facilitiesWithAlerts.filter(f => f.criticalCount > 0).map(f => f.name.split(' ')[0]).join(', ')}
            </span>
          </p>
        </div>
      )}

      {/* Map + Facility Status List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Facility Locations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{regionalFacilities.length} facilities · click for details</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Operational</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive inline-block" />Critical</span>
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
          {facilitiesWithAlerts.map(facility => {
            const revenuePerTonne = facility.revenue.today / facility.totalCapacity;
            const hasIssues = facility.criticalCount > 0 || facility.warningCount > 0;
            const statusColor =
              facility.criticalCount > 0 ? 'bg-destructive' :
              facility.warningCount > 0 ? 'bg-yellow-400' : 'bg-green-500';
            const borderColor =
              facility.criticalCount > 0 ? 'border-destructive/40' :
              facility.warningCount > 0 ? 'border-yellow-500/30' : 'border-border';

            return (
              <div key={facility.id} className={`bg-card rounded-xl border ${borderColor} p-4 hover:bg-muted/20 transition-colors`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`} />
                      <h4 className="text-sm font-semibold text-foreground truncate">{facility.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 pl-4 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{facility.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {facility.criticalCount > 0 && <Badge variant="destructive" className="text-[10px]">{facility.criticalCount} Critical</Badge>}
                    {facility.warningCount > 0 && <Badge variant="warning" className="text-[10px]">{facility.warningCount} Warning</Badge>}
                    {!hasIssues && <Badge variant="success" className="text-[10px]">All Clear</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'Occupancy', value: `${facility.occupancy}%`, color: facility.occupancy > 95 ? 'text-yellow-400' : 'text-foreground' },
                    { label: 'Revenue', value: fmt(facility.revenue.today), color: 'text-foreground' },
                    { label: 'Energy', value: `${facility.energy.today} kWh`, color: 'text-foreground' },
                    { label: 'Rev/T', value: `₹${revenuePerTonne.toFixed(0)}`, color: 'text-foreground' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center bg-muted/50 rounded-lg py-2 px-1">
                      <p className={`text-xs font-bold ${color}`}>{value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Capacity utilisation</span>
                    <span>{facility.occupancy}% of {facility.totalCapacity.toLocaleString()} T</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${facility.occupancy > 95 ? 'bg-yellow-400' : 'bg-teal-400'}`}
                      style={{ width: `${facility.occupancy}%` }}
                    />
                  </div>
                </div>

                {(facility.openDoors > 0 || facility.zonesOffTarget > 0) && (
                  <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-border/50">
                    {facility.openDoors > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-yellow-400">
                        <DoorOpen className="h-3 w-3" />{facility.openDoors} door{facility.openDoors > 1 ? 's' : ''} open
                      </span>
                    )}
                    {facility.zonesOffTarget > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-destructive">
                        <Thermometer className="h-3 w-3" />{facility.zonesOffTarget} zone{facility.zonesOffTarget > 1 ? 's' : ''} off-target
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue + Energy Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatCard
          label="Network Revenue"
          value={fmt(totalRevenue)}
          delta="+7%"
          deltaPositive
          sublabel="from yesterday"
          icon={<IndianRupee className="h-5 w-5" />}
          trend={[280000, 295000, 305000, 310000, 315000, totalRevenue]}
        />
        <StatCard
          label="Best Performing"
          value={revenueSorted[0].name.split(' ')[0]}
          sublabel={`₹${(revenueSorted[0].revenue.today / revenueSorted[0].totalCapacity).toFixed(0)}/T`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={[38, 40, 42, 43, 44, 45]}
        />
        <StatCard
          label="Total Energy"
          value={`${totalEnergy.toLocaleString()} kWh`}
          delta="-5%"
          deltaPositive
          sublabel="from yesterday"
          icon={<Zap className="h-5 w-5" />}
          trend={[4100, 4050, 3980, 3950, 3920, totalEnergy]}
        />
        <StatCard
          label="Avg Rev/Tonne"
          value={fmt(totalRevenue / (totalCapacity * avgOccupancy / 100))}
          sublabel="across all facilities"
          icon={<Activity className="h-5 w-5" />}
          trend={[38, 40, 41, 42, 43, 44]}
        />
      </div>

      {/* Alerts + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Active Alerts by Facility
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            {facilitiesWithAlerts.every(f => f.criticalCount === 0 && f.warningCount === 0) ? (
              <div className="flex items-center gap-2 py-8 text-green-400 justify-center">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">All facilities operating normally</span>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                {facilitiesWithAlerts.filter(f => f.criticalCount > 0 || f.warningCount > 0).map(f => (
                  <div key={f.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${f.criticalCount > 0 ? 'bg-destructive/5 border-destructive/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${f.criticalCount > 0 ? 'bg-destructive' : 'bg-yellow-400'}`} />
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Performance Leaderboard
            </CardTitle>
            <CardDescription>Ranked by revenue per tonne</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="px-4 space-y-2">
              {revenueSorted.map((facility, index) => {
                const revenuePerTonne = facility.revenue.today / facility.totalCapacity;
                const medalColors = ['bg-yellow-500/20 text-yellow-400', 'bg-slate-400/20 text-slate-400', 'bg-orange-500/20 text-orange-400'];
                return (
                  <div key={facility.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${medalColors[index] ?? 'bg-muted-foreground/10 text-muted-foreground'}`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{facility.name}</p>
                      <p className="text-[10px] text-muted-foreground">{facility.location}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground">{fmt(facility.revenue.today)}</p>
                      <p className="text-[10px] text-muted-foreground">₹{revenuePerTonne.toFixed(0)}/T</p>
                    </div>
                    <div className="flex-shrink-0">
                      {index === 0
                        ? <ArrowUpRight className="h-4 w-4 text-green-400" />
                        : <ArrowDownRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facility Comparison Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Comparison</CardTitle>
          <CardDescription>Side-by-side operational metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalFacilities.map(facility => {
              const critCount = facility.zones.reduce((a, z) => a + z.alerts.filter(al => al.severity === 'critical').length, 0);
              return (
                <div key={facility.id} className={`rounded-xl border p-4 ${critCount > 0 ? 'bg-destructive/5 border-destructive/30' : 'bg-muted/30 border-border'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-foreground">{facility.name.split(' ')[0]}</h4>
                    <Badge variant={facility.status === 'operational' ? 'success' : 'destructive'} className="text-[10px] capitalize">
                      {facility.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <ProgressRing
                      value={facility.occupancy}
                      size={56}
                      strokeWidth={5}
                      color={facility.occupancy > 95 ? AMBER : TEAL}
                      showValue
                    />
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{fmt(facility.revenue.today)}</p>
                      <p className="text-[10px] text-muted-foreground">Today's revenue</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs border-t border-border/50 pt-3">
                    {[
                      ['Capacity', `${facility.totalCapacity.toLocaleString()} T`],
                      ['Energy', `${facility.energy.today.toLocaleString()} kWh`],
                      ['Cost/T', `₹${facility.energy.costPerTonne.toLocaleString()}`],
                      ['Weekly Rev', fmt(facility.revenue.thisWeek)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue + Energy Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Facility</CardTitle>
            <CardDescription>Today's revenue in ₹K</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={regionalFacilities.map(f => ({ name: f.name.split(' ')[0], revenue: Math.round(f.revenue.today / 1000) }))}
              xKey="name"
              series={['revenue']}
              config={{ revenue: { label: 'Revenue (₹K)', color: TEAL } }}
              className="h-56"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption</CardTitle>
            <CardDescription>Today's usage in kWh</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={regionalFacilities.map(f => ({ name: f.name.split(' ')[0], energy: f.energy.today }))}
              xKey="name"
              series={['energy']}
              config={{ energy: { label: 'Energy (kWh)', color: PURPLE } }}
              className="h-56"
            />
          </CardContent>
        </Card>
      </div>

      {/* Energy Efficiency + Cost Reduction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Efficiency Rankings</CardTitle>
            <CardDescription>Cost per tonne — lower is better</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="px-4 space-y-2">
              {energySorted.map((facility, index) => {
                const efficiencyScore = facility.occupancy > 0
                  ? (facility.energy.today / (facility.totalCapacity * facility.occupancy / 100)).toFixed(1)
                  : '0.0';
                const isHighCost = facility.energy.costPerTonne > 2000;
                return (
                  <div key={facility.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                    index === 0 && isHighCost ? 'bg-destructive/10 border-destructive/30' :
                    index === 1 && isHighCost ? 'bg-orange-500/10 border-orange-500/30' :
                    'bg-muted/40 border-border/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        index === 0 && isHighCost ? 'bg-destructive/20 text-destructive' :
                        index === 1 && isHighCost ? 'bg-orange-500/20 text-orange-400' :
                        'bg-muted-foreground/20 text-muted-foreground'
                      }`}>{index + 1}</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{facility.name}</p>
                        <p className="text-[10px] text-muted-foreground">{efficiencyScore} kWh/T · {facility.location}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${isHighCost && index < 2 ? 'text-destructive' : 'text-foreground'}`}>
                      ₹{facility.energy.costPerTonne}/T
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Reduction Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-destructive/20 rounded-lg"><DoorOpen className="w-3.5 h-3.5 text-destructive" /></div>
                <span className="text-xs font-semibold text-destructive">Open Door Energy Waste</span>
              </div>
              <div className="space-y-1.5">
                {regionalFacilities
                  .map(f => ({
                    ...f,
                    openDoors: f.zones.reduce((s, z) => s + z.doors.filter(d => d.status === 'open').length, 0),
                    avgDuration: f.zones.reduce((s, z) => s + z.doors.reduce((ds, d) => ds + (d.openDuration ?? 0), 0), 0) / Math.max(f.zones.length, 1),
                  }))
                  .filter(f => f.openDoors > 0)
                  .slice(0, 3)
                  .map(f => (
                    <div key={f.id} className="flex justify-between text-xs bg-card rounded-lg px-3 py-2 border border-destructive/20">
                      <span className="font-medium text-foreground">{f.name.split(' ')[0]}</span>
                      <span className="text-destructive font-semibold">{fmt(f.avgDuration * 0.5 * f.openDoors * 7 * 30)}/mo waste</span>
                    </div>
                  ))}
                {regionalFacilities.every(f => f.zones.every(z => z.doors.every(d => d.status === 'closed'))) && (
                  <p className="text-xs text-green-400 text-center py-1 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All doors closed
                  </p>
                )}
              </div>
            </div>

            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-yellow-500/20 rounded-lg"><Thermometer className="w-3.5 h-3.5 text-yellow-400" /></div>
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
                  <p className="text-xs text-green-400 text-center py-1 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All zones on-target
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
