import { useState } from 'react';
import {
  StatCard,
  BarChart,
  AreaChart,

} from '@vrushabh-b/oneiot-ui';
import type { AlertFeedItem } from '@vrushabh-b/oneiot-ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@vrushabh-b/oneiot-ui';
import {
  Thermometer,
  Droplets,
  Zap,
  AlertTriangle,
  Package,
  Wind,
  MapPin,
  Clock,
  DoorOpen,
  TrendingDown,
  Sun,
  IndianRupee,
  ChevronRight,
} from 'lucide-react';
import { chennaiFacility, energyHistory, outsideConditions } from '@/data/mockData';
import { ZoneDetailPage } from '@/components/zones/ZoneDetailPage';

const TEAL = '#02A19E';
const PURPLE = '#6333ff';


export function FacilityDashboard() {
  const facility = chennaiFacility;
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  if (selectedZoneId) {
    return <ZoneDetailPage zoneId={selectedZoneId} onBack={() => setSelectedZoneId(null)} />;
  }

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
  void alertFeedItems;

  const openDoors = facility.zones.flatMap(z =>
    z.doors.filter(d => d.status === 'open').map(d => ({ ...d, zoneName: z.name })),
  );

  const totalInventoryValue = facility.zones.flatMap(z => z.products).reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
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

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                <Sun className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Outside Temp</p>
                <p className="text-sm font-bold text-foreground">{outsideConditions.temperature}°C</p>
                <p className="text-[10px] text-orange-400">Feels {outsideConditions.heatIndex}°C</p>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Droplets className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Humidity</p>
                <p className="text-sm font-bold text-foreground">{outsideConditions.humidity}%</p>
                <p className="text-[10px] text-muted-foreground">Dew {outsideConditions.dewPoint}°C</p>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
                <Wind className="h-4 w-4 text-teal-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Wind</p>
                <p className="text-sm font-bold text-foreground">{outsideConditions.windSpeed} km/h</p>
                <p className="text-[10px] text-muted-foreground">{outsideConditions.windDirection}</p>
              </div>
            </div>
            {/* <div className="w-px h-8 bg-border" /> */}
            {/* <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <Gauge className="h-4 w-4 text-purple-400" />
              </div>
               <div>
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Pressure</p>
                <p className="text-sm font-bold text-foreground">{outsideConditions.pressure} hPa</p>
                <p className="text-[10px] text-muted-foreground">UV {outsideConditions.uvIndex}</p>
              </div> 
            </div> */}
            {/* <div className="w-px h-8 bg-border" /> */}
            {/* <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
                <Eye className="h-4 w-4 text-sky-400" />
              </div>
               <div>
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Visibility</p>
                <p className="text-sm font-bold text-foreground">{outsideConditions.visibility} km</p>
                <p className="text-[10px] text-muted-foreground">{outsideConditions.updatedAt}</p>
              </div> 
            </div> */}
          </div>

          {/* {criticalAlerts > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">{criticalAlerts} critical</span>
            </div>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue"
          value={fmt(facility.revenue.today)}
          delta="+8%"
          deltaPositive
          sublabel="from yesterday"
          icon={<IndianRupee className="h-5 w-5" />}
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

      <div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-base font-semibold text-foreground">Zone Monitoring</h2>
          {openDoors.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 text-xs font-medium text-yellow-400">
              <DoorOpen className="h-3 w-3" />
              {openDoors.length} door{openDoors.length !== 1 ? 's' : ''} open
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {facility.zones.map(zone => {
            const tempOk = zone.temperature.current >= zone.temperature.min && zone.temperature.current <= zone.temperature.max;
            const tempStatus = !tempOk ? 'critical' : Math.abs(zone.temperature.current - zone.temperature.target) > 2 ? 'warning' : 'ok';
            const humOk = zone.humidity.current >= zone.humidity.min && zone.humidity.current <= zone.humidity.max;
            const openDoorCount = zone.doors.filter(d => d.status === 'open').length;
            const topAlert = zone.alerts.sort((a, b) => (a.severity === 'critical' ? -1 : b.severity === 'critical' ? 1 : 0))[0];
            const tempColor = tempStatus === 'critical' ? 'text-destructive' : tempStatus === 'warning' ? 'text-yellow-400' : 'text-foreground';
            const hasIssue = !!topAlert || openDoorCount > 0;

            return (
              <div
                key={zone.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedZoneId(zone.id)}
                onKeyDown={e => e.key === 'Enter' && setSelectedZoneId(zone.id)}
                className="rounded-xl border border-border bg-card px-4 py-3.5 space-y-3 cursor-pointer hover:border-[#02A19E]/50 hover:bg-muted/30 transition-all"
              >

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${hasIssue ? (topAlert?.severity === 'critical' ? 'bg-destructive' : 'bg-yellow-400') : 'bg-green-500'}`} />
                    <p className="text-sm font-semibold text-foreground truncate">{zone.name}</p>
                    <span className="text-[10px] text-muted-foreground capitalize border border-border rounded px-1.5 py-0.5 flex-shrink-0">{zone.type}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground leading-none">{zone.occupancy}%</p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{zone.capacity} T</p>
                    </div>
                    <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${zone.occupancy > 90 ? 'bg-yellow-400' : 'bg-[#02A19E]'}`}
                        style={{ width: `${zone.occupancy}%` }}
                      />
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>

                <div className="grid grid-cols-4 divide-x divide-border">
                  <div className="pr-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                      <Thermometer className="h-2.5 w-2.5" />Temp
                    </p>
                    <p className={`text-sm font-bold leading-none ${tempColor}`}>{zone.temperature.current}°C</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{zone.temperature.min}–{zone.temperature.max}°C</p>
                  </div>
                  <div className="px-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                      <Droplets className="h-2.5 w-2.5" />Humidity
                    </p>
                    <p className={`text-sm font-bold leading-none ${humOk ? 'text-foreground' : 'text-yellow-400'}`}>{zone.humidity.current}%</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{zone.humidity.min}–{zone.humidity.max}%</p>
                  </div>
                  <div className="px-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5" />Energy
                    </p>
                    <p className="text-sm font-bold leading-none text-foreground">{zone.energy.consumption}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">kWh</p>
                  </div>
                  <div className="pl-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                      <DoorOpen className="h-2.5 w-2.5" />Doors
                    </p>
                    <p className={`text-sm font-bold leading-none ${openDoorCount > 0 ? 'text-yellow-400' : 'text-foreground'}`}>
                      {openDoorCount}<span className="text-[10px] font-normal text-muted-foreground">/{zone.doors.length}</span>
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{openDoorCount > 0 ? 'open' : 'closed'}</p>
                  </div>
                </div>

                {topAlert ? (
                  <div className={`flex items-start gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] leading-snug border ${topAlert.severity === 'critical' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                    <AlertTriangle className="h-2.5 w-2.5 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{topAlert.message}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] text-green-400 bg-green-500/5 border border-green-500/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    All systems normal
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      </div> */}

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
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Today</span>
                <span className="text-sm font-bold text-foreground">{facility.energy.today.toLocaleString()} kWh</span>
                <span className={`text-xs font-medium flex items-center gap-1 ${facility.energy.today < facility.energy.yesterday ? 'text-green-400' : 'text-destructive'}`}>
                  <TrendingDown className="h-3 w-3" />
                  {facility.energy.yesterday.toLocaleString()} kWh yesterday
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">This Week</span>
                <span className="text-sm font-bold text-foreground">{facility.energy.thisWeek.toLocaleString()} kWh</span>
                <span className="text-xs text-muted-foreground">Efficiency: {(facility.energy.today / facility.totalCapacity).toFixed(2)} kWh/T</span>
              </div>
            </div>
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
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Cost / Tonne</span>
                <span className={`text-sm font-bold ${facility.energy.costPerTonne < 2000 ? 'text-green-400' : 'text-destructive'}`}>
                  ₹{facility.energy.costPerTonne.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Revenue / Tonne</span>
                <span className="text-sm font-bold text-foreground">
                  {fmt(facility.revenue.today / (facility.totalCapacity * facility.occupancy / 100))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Register</CardTitle>
          <CardDescription>
            {facility.zones.flatMap(z => z.products).length} SKUs across {facility.zones.length} zones · Total value {fmt(totalInventoryValue)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left py-2.5 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">SKU</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Product</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Category</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Brand / Supplier</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Batch / Lot</th>
                  <th className="text-right py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Qty</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Storage Temp</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Humidity Req.</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Entry Date</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Expiry</th>
                  <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Barcode</th>
                  <th className="text-right py-2.5 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">Value</th>
                </tr>
              </thead>
              <tbody>
                {facility.zones.flatMap(zone =>
                  zone.products.map((product) => {
                    const expiry = new Date(product.expiryDate);
                    const entry = new Date(product.entryDate);
                    const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
                    const expiryUrgent = daysLeft < 14;
                    const expiryWarning = daysLeft < 30 && !expiryUrgent;
                    const categoryColors: Record<string, string> = {
                      fruits: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                      vegetables: 'bg-green-500/10 text-green-400 border-green-500/20',
                      dairy: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                      meat: 'bg-red-500/10 text-red-400 border-red-500/20',
                      poultry: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                      seafood: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                      'frozen-foods': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                      pharma: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                      other: 'bg-muted text-muted-foreground border-border',
                    };
                    return (
                      <tr key={product.sku} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-foreground whitespace-nowrap">{product.name}</p>
                          <p className="text-muted-foreground mt-0.5 capitalize">{product.unitType} · {product.shelfLifeDays}d shelf life</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize whitespace-nowrap ${categoryColors[product.category]}`}>
                            {product.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-foreground whitespace-nowrap">{product.brand}</p>
                          <p className="text-muted-foreground mt-0.5 whitespace-nowrap">{product.supplier}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-mono text-foreground whitespace-nowrap">{product.batchNumber}</p>
                          <p className="font-mono text-muted-foreground mt-0.5 whitespace-nowrap">{product.lotNumber}</p>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <p className="font-bold text-foreground">{product.quantity}</p>
                          <p className="text-muted-foreground mt-0.5 capitalize">{product.unitType}</p>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <p className="font-medium text-foreground">{product.storageMinTemp}°C – {product.storageMaxTemp}°C</p>
                          <p className="text-muted-foreground mt-0.5">{zone.name}</p>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <p className="font-medium text-foreground">{product.humidityMin}% – {product.humidityMax}%</p>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-muted-foreground">
                          {entry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <p className={`font-medium ${expiryUrgent ? 'text-destructive' : expiryWarning ? 'text-yellow-400' : 'text-foreground'}`}>
                            {expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className={`mt-0.5 ${expiryUrgent ? 'text-destructive font-semibold' : expiryWarning ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                            {daysLeft > 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d ago`}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-muted-foreground whitespace-nowrap">{product.barcode}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <p className="font-bold text-foreground whitespace-nowrap">{fmt(product.value)}</p>
                        </td>
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
