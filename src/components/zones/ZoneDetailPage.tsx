import type React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Badge, Button, ProgressRing,
} from '@vrushabh-b/oneiot-ui';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import {
  Thermometer, Droplets, Zap, Wind, Activity, DoorOpen,
  AlertTriangle, Package, ArrowLeft,
  Clock, IndianRupee, Layers, TrendingUp, TrendingDown,
} from 'lucide-react';
import { chennaiFacility, temperatureHistory } from '@/data/mockData';
import { useBookings } from '@/contexts/BookingsContext';

const TEAL = '#02A19E';
const AMBER = '#f59e0b';
const PURPLE = '#6333ff';

const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysLeft(expiryDate: string) {
  return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / 86400000);
}

const CATEGORY_STYLE: Record<string, string> = {
  fruits:         'bg-orange-500/10 text-orange-400 border-orange-500/20',
  vegetables:     'bg-green-500/10 text-green-400 border-green-500/20',
  dairy:          'bg-blue-500/10 text-blue-400 border-blue-500/20',
  meat:           'bg-red-500/10 text-red-400 border-red-500/20',
  poultry:        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  seafood:        'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'frozen-foods': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  pharma:         'bg-purple-500/10 text-purple-400 border-purple-500/20',
  other:          'bg-muted text-muted-foreground border-border',
};

const TYPE_BADGE: Record<string, string> = {
  ambient:    'bg-teal-500/10 text-teal-400 border-teal-500/30',
  chill:      'bg-blue-500/10 text-blue-400 border-blue-500/30',
  frozen:     'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  processing: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
};

function generateHumidityHistory(
  zoneId: string,
  base: number,
  min: number,
  max: number,
): { time: string; humidity: number }[] {
  const HOURS = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'];
  const seed = zoneId.charCodeAt(zoneId.length - 1);
  return HOURS.map((time, i) => {
    const wave = Math.sin((i / HOURS.length) * Math.PI * 2 + seed) * ((max - min) * 0.25);
    const humidity = Math.max(min, Math.min(max, Math.round((base + wave) * 10) / 10));
    return { time, humidity };
  });
}

function buildTempChartData(
  zoneId: string,
  current: number,
  target: number,
  min: number,
  max: number,
) {
  const raw = (temperatureHistory as Record<string, { time: string; temp: number }[]>)[zoneId];
  if (raw && raw.length > 0) {
    return raw.map(r => ({ time: r.time, temp: r.temp, target, min, max }));
  }
  const HOURS = ['00:00','04:00','08:00','12:00','16:00','20:00'];
  return HOURS.map((time, i) => {
    const drift = (current - target) * (i / (HOURS.length - 1));
    return { time, temp: Math.round((target + drift) * 10) / 10, target, min, max };
  });
}

function SensorTile({
  icon: Icon, label, value, unit, sub, warn, color,
}: {
  icon: React.ElementType; label: string; value: string | number; unit?: string;
  sub?: string; warn?: boolean; color?: string;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3.5 flex flex-col gap-1 ${warn ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-card border-border'}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" style={{ color: warn ? AMBER : (color ?? 'var(--muted-foreground)') }} />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-bold leading-none ${warn ? 'text-yellow-400' : 'text-foreground'}`} style={!warn && color ? { color } : {}}>
        {value}<span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
      </p>
      {sub && <p className="text-[10px] text-muted-foreground leading-tight">{sub}</p>}
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; dataKey: string; color: string }[];
  label?: string;
  unit?: string;
}

function ChartTooltip({ active, payload, label, unit }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground mb-1 font-semibold">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === 'temp' ? 'Temperature' : p.dataKey === 'humidity' ? 'Humidity' : p.dataKey}:{' '}
          <span className="font-bold">{p.value}{unit}</span>
        </p>
      ))}
    </div>
  );
}

interface ZoneDetailPageProps {
  zoneId: string;
  onBack: () => void;
}

export function ZoneDetailPage({ zoneId, onBack }: ZoneDetailPageProps) {
  const { bookings, remainingKg } = useBookings();
  const zone = chennaiFacility.zones.find(z => z.id === zoneId);

  if (!zone) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Layers className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">Zone not found</p>
        <Button variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Zones</Button>
      </div>
    );
  }

  const zoneBookings = bookings.filter(b =>
    b.status === 'active' && b.zoneAssignment.toLowerCase().includes(zone.type)
  );

  const tempOk = zone.temperature.current >= zone.temperature.min && zone.temperature.current <= zone.temperature.max;
  const tempStatus = !tempOk ? 'critical' : Math.abs(zone.temperature.current - zone.temperature.target) > 2 ? 'warning' : 'ok';
  const humOk = zone.humidity.current >= zone.humidity.min && zone.humidity.current <= zone.humidity.max;
  const nh3Warn = zone.safety.nh3Level > 20;
  const co2Warn = zone.safety.co2Level > 600;
  const openDoors = zone.doors.filter(d => d.status === 'open');

  const tempColor = tempStatus === 'critical' ? '#ef4444' : tempStatus === 'warning' ? AMBER : '#22c55e';
  const totalInventoryValue = zone.products.reduce((s, p) => s + p.value, 0);

  const tempChartData = buildTempChartData(
    zone.id,
    zone.temperature.current,
    zone.temperature.target,
    zone.temperature.min,
    zone.temperature.max,
  );

  const humChartData = generateHumidityHistory(
    zone.id,
    zone.humidity.current,
    zone.humidity.min,
    zone.humidity.max,
  );

  const tempDomain: [number, number] = [
    Math.floor(zone.temperature.min - 3),
    Math.ceil(zone.temperature.max + 3),
  ];

  const humDomain: [number, number] = [
    Math.floor(zone.humidity.min - 5),
    Math.ceil(zone.humidity.max + 5),
  ];

  return (
    <div className="space-y-6">

      <div className="flex items-start gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="flex-shrink-0 mt-0.5">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Zones
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-foreground">{zone.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${TYPE_BADGE[zone.type] ?? ''}`}>
              {zone.type}
            </span>
            {zone.alerts.length > 0 && (
              <Badge variant={zone.alerts.some(a => a.severity === 'critical') ? 'destructive' : 'warning'} className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {zone.alerts.length} alert{zone.alerts.length !== 1 ? 's' : ''}
              </Badge>
            )}
            {openDoors.length > 0 && (
              <Badge variant="warning" className="flex items-center gap-1">
                <DoorOpen className="h-3 w-3" />
                {openDoors.length} door{openDoors.length !== 1 ? 's' : ''} open
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {chennaiFacility.name} · {zone.capacity} T capacity · {zone.currentOccupancy} T stored · {zone.products.length} SKUs
          </p>
        </div>
        <div className="flex-shrink-0">
          <ProgressRing
            value={zone.occupancy}
            size={56}
            strokeWidth={5}
            color={zone.occupancy > 90 ? AMBER : TEAL}
            showValue
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <SensorTile
          icon={Thermometer} label="Temperature" value={zone.temperature.current} unit="°C"
          sub={`Target ${zone.temperature.target}°C · ${zone.temperature.min}–${zone.temperature.max}°C`}
          warn={tempStatus !== 'ok'} color={tempColor}
        />
        <SensorTile
          icon={Droplets} label="Humidity" value={zone.humidity.current} unit="%"
          sub={`Target ${zone.humidity.target}% · ${zone.humidity.min}–${zone.humidity.max}%`}
          warn={!humOk} color={humOk ? '#60a5fa' : undefined}
        />
        <SensorTile
          icon={Wind} label="NH₃" value={zone.safety.nh3Level} unit="ppm"
          sub={nh3Warn ? 'Exceeds 20 ppm safe limit' : 'Within safe limit (<25 ppm)'}
          warn={nh3Warn}
        />
        <SensorTile
          icon={Activity} label="CO₂" value={zone.safety.co2Level} unit="ppm"
          sub={co2Warn ? 'Approaching limit (5000 ppm)' : 'Safe levels'}
          warn={co2Warn}
        />
        <SensorTile
          icon={Zap} label="Energy" value={zone.energy.consumption} unit="kWh"
          sub={`₹${zone.energy.cost.toLocaleString()} today`}
          color={TEAL}
        />
        <SensorTile
          icon={DoorOpen} label="Doors" value={`${openDoors.length}/${zone.doors.length}`}
          sub={openDoors.length > 0 ? `${openDoors.map(d => d.name).join(', ')} open` : 'All closed'}
          warn={openDoors.length > 0}
        />
      </div>

      {zone.alerts.length > 0 && (
        <div className="space-y-2">
          {zone.alerts.map(a => (
            <div
              key={a.id}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
                a.severity === 'critical'
                  ? 'bg-destructive/10 border-destructive/30 text-destructive'
                  : a.severity === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}
            >
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{a.message}</p>
                <p className="text-xs opacity-70 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4" style={{ color: tempColor }} />
                  Temperature Trend
                </CardTitle>
                <CardDescription>24-hour history with safe range</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold" style={{ color: tempColor }}>{zone.temperature.current}°C</p>
                <p className="text-[10px] text-muted-foreground">Current</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={tempChartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`tempGrad-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={tempColor} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={tempColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={tempDomain} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}°`} />
                <Tooltip content={<ChartTooltip unit="°C" />} />
                <Legend wrapperStyle={{ fontSize: 10, color: 'var(--muted-foreground)' }} />
                <ReferenceLine y={zone.temperature.target} stroke={TEAL} strokeDasharray="5 3" label={{ value: 'Target', fill: TEAL, fontSize: 9, position: 'insideTopRight' }} />
                <ReferenceLine y={zone.temperature.max} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine y={zone.temperature.min} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Area
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke={tempColor}
                  strokeWidth={2}
                  fill={`url(#tempGrad-${zone.id})`}
                  dot={{ fill: tempColor, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: tempColor }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="inline-block h-px w-4" style={{ background: TEAL }} />Target {zone.temperature.target}°C</span>
              <span className="flex items-center gap-1"><span className="inline-block h-px w-4 bg-blue-500 opacity-60" />Min {zone.temperature.min}°C</span>
              <span className="flex items-center gap-1"><span className="inline-block h-px w-4 bg-red-500 opacity-60" />Max {zone.temperature.max}°C</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  Humidity Trend
                </CardTitle>
                <CardDescription>24-hour history with target range</CardDescription>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${humOk ? 'text-blue-400' : 'text-yellow-400'}`}>{zone.humidity.current}%</p>
                <p className="text-[10px] text-muted-foreground">Current</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={humChartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`humGrad-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={humDomain} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<ChartTooltip unit="%" />} />
                <Legend wrapperStyle={{ fontSize: 10, color: 'var(--muted-foreground)' }} />
                <ReferenceLine y={zone.humidity.target} stroke={TEAL} strokeDasharray="5 3" label={{ value: 'Target', fill: TEAL, fontSize: 9, position: 'insideTopRight' }} />
                <ReferenceLine y={zone.humidity.max} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine y={zone.humidity.min} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill={`url(#humGrad-${zone.id})`}
                  dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#3b82f6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="inline-block h-px w-4" style={{ background: TEAL }} />Target {zone.humidity.target}%</span>
              <span className="flex items-center gap-1"><span className="inline-block h-px w-4 bg-yellow-500 opacity-60" />Range {zone.humidity.min}–{zone.humidity.max}%</span>
            </div>
          </CardContent>
        </Card>

      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory Register</CardTitle>
              <CardDescription>
                {zone.products.length} SKUs · Total value {fmt(totalInventoryValue)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Stored</p>
                <p className="text-sm font-bold text-foreground">{zone.currentOccupancy} T</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Capacity</p>
                <p className="text-sm font-bold text-foreground">{zone.capacity} T</p>
              </div>
              <ProgressRing value={zone.occupancy} size={40} strokeWidth={4} color={zone.occupancy > 90 ? AMBER : TEAL} showValue />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['SKU', 'Product', 'Category', 'Brand / Supplier', 'Batch', 'Qty', 'Storage Temp', 'Humidity', 'Entry', 'Expiry', 'Value'].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zone.products.map(p => {
                  const dl = daysLeft(p.expiryDate);
                  const urgent = dl < 14;
                  const warn = dl < 30 && !urgent;
                  return (
                    <tr key={p.sku} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">{p.sku}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-foreground whitespace-nowrap">{p.name}</p>
                        <p className="text-muted-foreground mt-0.5 capitalize">{p.unitType} · {p.shelfLifeDays}d shelf life</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize whitespace-nowrap ${CATEGORY_STYLE[p.category] ?? CATEGORY_STYLE.other}`}>
                          {p.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground whitespace-nowrap">{p.brand}</p>
                        <p className="text-muted-foreground mt-0.5 whitespace-nowrap">{p.supplier}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-mono text-foreground whitespace-nowrap">{p.batchNumber}</p>
                        <p className="font-mono text-muted-foreground mt-0.5 whitespace-nowrap">{p.lotNumber}</p>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <p className="font-bold text-foreground">{p.quantity}</p>
                        <p className="text-muted-foreground mt-0.5 capitalize">{p.unitType}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-medium text-foreground">{p.storageMinTemp}°C – {p.storageMaxTemp}°C</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-medium text-foreground">{p.humidityMin}% – {p.humidityMax}%</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">{fmtDate(p.entryDate)}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className={`font-medium ${urgent ? 'text-destructive' : warn ? 'text-yellow-400' : 'text-foreground'}`}>
                          {fmtDate(p.expiryDate)}
                        </p>
                        <p className={`mt-0.5 ${urgent ? 'text-destructive font-semibold' : warn ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                          {dl > 0 ? `${dl}d left` : `${Math.abs(dl)}d ago`}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="font-bold text-foreground whitespace-nowrap">{fmt(p.value)}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/30">
                  <td colSpan={10} className="py-3 px-4 text-xs font-semibold text-muted-foreground text-right">Total Inventory Value</td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-foreground whitespace-nowrap">{fmt(totalInventoryValue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings in Zone</CardTitle>
            <CardDescription>Stock currently tracked via bookings system in this zone</CardDescription>
          </CardHeader>
          <CardContent>
            {zoneBookings.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <Package className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">No active bookings for this zone</p>
              </div>
            ) : (
              <div className="space-y-3">
                {zoneBookings.map(b => {
                  const rem = remainingKg(b);
                  const pct = parseFloat(b.quantityWeight) > 0 ? (rem / parseFloat(b.quantityWeight)) * 100 : 100;
                  return (
                    <div key={b.id} className="rounded-xl border border-border bg-card px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-[#02A19E]">{b.bookingNumber}</span>
                        <span className="text-xs font-bold text-foreground">{rem} kg remaining</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{b.productName}</p>
                      <p className="text-xs text-muted-foreground">{b.supplierName} · {b.vehicleNumber}</p>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-[#02A19E] transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{pct.toFixed(0)}% of {b.quantityWeight} kg remaining</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Door Status</CardTitle>
            <CardDescription>{zone.doors.length} doors · {openDoors.length} open</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zone.doors.map(door => (
                <div
                  key={door.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                    door.status === 'open'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : door.status === 'fault'
                      ? 'bg-destructive/10 border-destructive/30'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DoorOpen className={`h-4 w-4 ${door.status === 'open' ? 'text-yellow-400' : door.status === 'fault' ? 'text-destructive' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{door.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        Last event: {new Date(door.lastEvent).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {door.openDuration !== undefined && door.status === 'open' && (
                      <span className="text-xs text-yellow-400 font-medium">{door.openDuration} min open</span>
                    )}
                    <Badge
                      variant={door.status === 'open' ? 'warning' : door.status === 'fault' ? 'destructive' : 'default'}
                      className="text-[10px] capitalize"
                    >
                      {door.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zone Financial Summary</CardTitle>
          <CardDescription>Revenue and cost performance for this zone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: IndianRupee, label: 'Inventory Value',  value: fmt(totalInventoryValue),               color: TEAL   },
              { icon: Zap,          label: 'Energy Cost Today', value: `₹${zone.energy.cost.toLocaleString()}`, color: PURPLE },
              { icon: TrendingUp,   label: 'Occupancy',        value: `${zone.occupancy}%`,                   color: zone.occupancy > 90 ? AMBER : TEAL },
              { icon: TrendingDown, label: 'Energy / kWh',     value: `${zone.energy.consumption} kWh`,       color: '#ec4899' },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-border bg-card px-4 py-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</span>
                </div>
                <p className="text-xl font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
