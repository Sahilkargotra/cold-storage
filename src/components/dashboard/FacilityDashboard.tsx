import {
  StatCard,
  AlertFeed,
  SensorPanel,
  MetricGauge,
  StatTrend,
  BarChart,
  AreaChart,
  ProgressRing,
  CounterCard,
} from '@vrushabh-b/oneiot-ui';
import type { AlertFeedItem, SensorReading } from '@vrushabh-b/oneiot-ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Thermometer,
  Droplets,
  Zap,
  AlertTriangle,
  Package,
  Wind,
  Activity,
  MapPin,
  Clock,
  DoorOpen,
  TrendingDown,
} from 'lucide-react';
import { chennaiFacility, temperatureHistory, energyHistory } from '@/data/mockData';

const TEAL = '#02A19E';
const PURPLE = '#6333ff';
const AMBER = '#f59e0b';

export function FacilityDashboard() {
  const facility = chennaiFacility;

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const totalAlerts = facility.zones.reduce((acc, z) => acc + z.alerts.length, 0);
  const criticalAlerts = facility.zones.reduce(
    (acc, z) => acc + z.alerts.filter(a => a.severity === 'critical').length,
    0,
  );

  const alertFeedItems: AlertFeedItem[] = facility.zones.flatMap(z =>
    z.alerts.map(a => ({
      id: a.id,
      severity: (a.severity === 'critical' ? 'destructive' : a.severity === 'warning' ? 'warning' : 'info') as AlertFeedItem['severity'],
      title: a.message,
      timestamp: a.time,
      device: z.name,
    })),
  );

  const zoneSensors = (zoneId: string): SensorReading[] => {
    const zone = facility.zones.find(z => z.id === zoneId)!;
    const tHistory = (temperatureHistory as Record<string, { time: string; temp: number }[]>)[zoneId] ?? [];
    const tempOk = zone.temperature.current >= zone.temperature.min && zone.temperature.current <= zone.temperature.max;
    const tempStatus: SensorReading['status'] = !tempOk ? 'critical' : Math.abs(zone.temperature.current - zone.temperature.target) > 2 ? 'warning' : 'ok';
    const humOk = zone.humidity.current >= zone.humidity.min && zone.humidity.current <= zone.humidity.max;

    return [
      {
        id: 'temp',
        label: 'Temperature',
        value: zone.temperature.current,
        unit: '°C',
        status: tempStatus,
        trend: zone.temperature.trend,
        sparkline: tHistory.map(r => r.temp),
        icon: Thermometer,
      },
      {
        id: 'humidity',
        label: 'Humidity',
        value: zone.humidity.current,
        unit: '%',
        status: humOk ? 'ok' : 'warning',
        icon: Droplets,
      },
      {
        id: 'nh3',
        label: 'Ammonia',
        value: zone.safety.nh3Level,
        unit: 'ppm',
        status: zone.safety.nh3Level > 20 ? 'warning' : 'ok',
        icon: Wind,
      },
      {
        id: 'co2',
        label: 'CO₂',
        value: zone.safety.co2Level,
        unit: 'ppm',
        status: zone.safety.co2Level > 600 ? 'warning' : 'ok',
        icon: Activity,
      },
      {
        id: 'occ',
        label: 'Occupancy',
        value: zone.occupancy,
        unit: '%',
        status: zone.occupancy > 95 ? 'warning' : 'ok',
        icon: Package,
      },
      {
        id: 'energy',
        label: 'Energy',
        value: zone.energy.consumption,
        unit: 'kWh',
        status: 'ok',
        icon: Zap,
      },
    ];
  };

  const openDoors = facility.zones.flatMap(z =>
    z.doors.filter(d => d.status === 'open').map(d => ({ ...d, zoneName: z.name })),
  );

  const totalInventoryValue = facility.zones.flatMap(z => z.products).reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <p className="text-lg font-semibold text-foreground">{facility.name}</p>
            <Badge variant={facility.status === 'operational' ? 'default' : 'destructive'} className="capitalize">
              {facility.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {facility.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Updated just now
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              {facility.zones.length} zones · {facility.totalCapacity.toLocaleString()} T capacity
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {criticalAlerts > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">{criticalAlerts} critical</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue"
          value={fmt(facility.revenue.today)}
          delta="+8%"
          deltaPositive
          sublabel="from yesterday"
          trend={[71000, 74000, 78000, 80000, 83000, 85600]}
        />
        <StatCard
          label="Energy Cost"
          value={fmt(facility.energy.today * 7)}
          delta="-9%"
          deltaPositive
          sublabel="from yesterday"
          icon={<Zap className="h-5 w-5" />}
          trend={[8400, 8200, 8050, 7900, 7700, 7315]}
        />
        <StatCard
          label="Occupancy"
          value={`${facility.occupancy}%`}
          sublabel={`${Math.round(facility.totalCapacity * facility.occupancy / 100).toLocaleString()} / ${facility.totalCapacity.toLocaleString()} T`}
          icon={<Package className="h-5 w-5" />}
          trend={[80, 82, 83, 85, 85, 86]}
        />
        <StatCard
          label="Active Alerts"
          value={String(totalAlerts)}
          delta={criticalAlerts > 0 ? `${criticalAlerts} critical` : 'all clear'}
          deltaPositive={criticalAlerts === 0}
          sublabel={criticalAlerts > 0 ? 'needs attention' : 'no critical issues'}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={[5, 4, 3, 4, 3, totalAlerts]}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CounterCard
          label="Total Capacity"
          value={facility.totalCapacity}
          unit="T"
          icon={Package}
          iconColor={TEAL}
          description="Total storage capacity"
        />
        <CounterCard
          label="Energy Today"
          value={facility.energy.today}
          unit="kWh"
          icon={Zap}
          iconColor={PURPLE}
          delta={-9}
          deltaLabel="vs yesterday"
          description={`₹${facility.energy.costPerTonne}/tonne`}
        />
        <CounterCard
          label="Weekly Revenue"
          value={Math.round(facility.revenue.thisWeek / 1000)}
          unit="K"
          prefix="₹"
          icon={TrendingDown}
          iconColor={AMBER}
          delta={5}
          deltaLabel="vs last week"
        />
        <CounterCard
          label="Zones Active"
          value={facility.zones.length}
          icon={Activity}
          iconColor="#ec4899"
          description={`${openDoors.length} door${openDoors.length !== 1 ? 's' : ''} open`}
        />
      </div>

      {alertFeedItems.length > 0 && (
        <AlertFeed
          items={alertFeedItems}
          showHeader
          title="Active Alerts"
          maxHeight="280px"
        />
      )}

      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">Zone Monitoring</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {facility.zones.map(zone => (
            <div key={zone.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{zone.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{zone.type} · {zone.capacity} T</p>
                </div>
                <ProgressRing
                  value={zone.occupancy}
                  size={44}
                  strokeWidth={4}
                  color={zone.occupancy > 90 ? '#f59e0b' : TEAL}
                  showValue
                />
              </div>
              <div className="p-2">
                <SensorPanel
                  sensors={zoneSensors(zone.id)}
                  columns={2}
                  showSparklines
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatTrend
          label="Today"
          value={facility.revenue.today}
          unit="₹"
          delta={8}
          deltaPositive
          trend={[78000, 80000, 82000, 83000, 84000, 85600]}
          accentColor={TEAL}
        />
        <StatTrend
          label="This Week"
          value={Math.round(facility.revenue.thisWeek / 1000)}
          unit="₹K"
          delta={5}
          deltaPositive
          trend={[480, 495, 510, 520, 530, 542]}
          accentColor={PURPLE}
        />
        <StatTrend
          label="This Month"
          value={Math.round(facility.revenue.thisMonth / 1000)}
          unit="₹K"
          delta={12}
          deltaPositive
          trend={[1800, 1900, 1950, 2050, 2100, 2180]}
          accentColor={AMBER}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption (7 Days)</CardTitle>
            <CardDescription>Daily kWh usage across the facility</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={energyHistory}
              xKey="day"
              series={['consumption']}
              config={{ consumption: { label: 'Consumption (kWh)', color: TEAL } }}
              className="h-56"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Cost Trend</CardTitle>
            <CardDescription>Daily cost in INR</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={energyHistory}
              xKey="day"
              series={['cost']}
              config={{ cost: { label: 'Cost (₹)', color: PURPLE } }}
              gradient
              className="h-56"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Zone Capacity</CardTitle>
            <CardDescription>Occupancy across all zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around py-2">
              {facility.zones.map(zone => (
                <MetricGauge
                  key={zone.id}
                  value={zone.occupancy}
                  min={0}
                  max={100}
                  unit="%"
                  label={zone.name.split(' ').slice(0, 2).join(' ')}
                  thresholds={{ warning: 80, danger: 95 }}
                  size={110}
                />
              ))}
            </div>
            {openDoors.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <DoorOpen className="h-3.5 w-3.5" />
                  Open doors ({openDoors.length})
                </p>
                {openDoors.map(door => (
                  <div key={door.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-sm">
                    <span className="font-medium text-foreground">{door.name}</span>
                    <span className="text-yellow-400 text-xs">{door.zoneName} · {door.openDuration} min open</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Performance</CardTitle>
            <CardDescription>Cost efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  Today vs Yesterday
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{facility.energy.today.toLocaleString()} kWh</p>
                  <p className={`text-xs font-medium flex items-center gap-1 justify-end ${facility.energy.today < facility.energy.yesterday ? 'text-green-400' : 'text-destructive'}`}>
                    <TrendingDown className="h-3 w-3" />
                    {facility.energy.yesterday.toLocaleString()} kWh yesterday
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Cost per Tonne</span>
                <span className={`text-sm font-bold ${facility.energy.costPerTonne < 2000 ? 'text-green-400' : 'text-destructive'}`}>
                  ₹{facility.energy.costPerTonne.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Revenue per Tonne</span>
                <span className="text-sm font-bold text-foreground">
                  {fmt(facility.revenue.today / (facility.totalCapacity * facility.occupancy / 100))}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Energy Efficiency</span>
                <span className="text-sm font-bold text-foreground">
                  {(facility.energy.today / facility.totalCapacity).toFixed(2)} kWh/T
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">This Week Total</span>
                <span className="text-sm font-bold text-foreground">{facility.energy.thisWeek.toLocaleString()} kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
          <CardDescription>
            {facility.zones.flatMap(z => z.products).length} products · Total value {fmt(totalInventoryValue)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Zone</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Product</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Qty (T)</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Expires</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {facility.zones.flatMap(zone =>
                  zone.products.map((product, idx) => {
                    const expiry = new Date(product.expiryDate);
                    const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
                    const expiryUrgent = daysLeft < 14;
                    return (
                      <tr key={`${zone.id}-${idx}`} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                            {zone.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-foreground">{product.name}</td>
                        <td className="py-2.5 px-3 text-right text-foreground">{product.quantity}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-xs ${expiryUrgent ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                            {expiry.toLocaleDateString('en-IN')}
                            {expiryUrgent && ` · ${daysLeft}d`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-foreground">{fmt(product.value)}</td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
