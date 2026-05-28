import { useState } from 'react';
import { FormSheet, Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Separator, ProgressRing } from '@vrushabh-b/oneiot-ui';
import {
  Layers, Thermometer, Droplets, Zap, Package, AlertTriangle,
  Plus, ChevronRight, ChevronDown, DoorOpen, Wind, Activity, ExternalLink,
} from 'lucide-react';
import { useSetup } from '@/contexts/SetupContext';
import type { ZoneSetup } from '@/contexts/SetupContext';
import { chennaiFacility, regionalFacilities } from '@/data/mockData';

const TEAL = '#02A19E';
const FIELD = 'w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#02A19E]';

const emptyZone = (): Omit<ZoneSetup, 'id' | 'createdAt'> => ({
  facilityId: 'FAC-001', name: '', type: '', capacity: '',
  tempMin: '', tempMax: '', tempTarget: '', humidityTarget: '',
  ratePerTonnePerDay: '', minimumChargeableTonnes: '', billingCycle: '',
  handlingChargePerEntry: '', coldChainSurcharge: '',
});

const TYPE_STYLE: Record<string, string> = {
  frozen: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  chill: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  ambient: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  processing: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
};

export function ZonesPage({ onSelectZone }: { onSelectZone?: (id: string) => void }) {
  const { zones, addZone } = useSetup();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(emptyZone());
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const updZone = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleZoneSave = () => { addZone(form); setSaved(true); };
  const handleZoneClose = () => { setSheetOpen(false); setSaved(false); setForm(emptyZone()); };

  const liveZones = regionalFacilities.flatMap(f =>
    f.zones.map(z => ({ ...z, facilityName: f.name, facilityId: f.id }))
  );

  const filteredLive = filterType === 'all' ? liveZones : liveZones.filter(z => z.type === filterType);
  const filteredConfig = filterType === 'all' ? zones : zones.filter(z => z.type === filterType);

  const totalLiveCapacity = liveZones.reduce((s, z) => s + z.capacity, 0);
  const totalConfigCapacity = zones.reduce((s, z) => s + (Number(z.capacity) || 0), 0);

  const typeOptions = ['all', 'ambient', 'chill', 'frozen', 'processing'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Zones</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {liveZones.length + zones.length} zones · {(totalLiveCapacity + totalConfigCapacity).toLocaleString()} T total capacity
          </p>
        </div>
        <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => setSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      <FormSheet
        open={sheetOpen}
        onClose={handleZoneClose}
        title={<span className="flex items-center gap-2"><Layers className="h-4 w-4" /> Create Zone</span>}
        description="Add a temperature-controlled zone to a facility."
        footer={!saved ? (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleZoneClose}>Cancel</Button>
            <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={handleZoneSave} disabled={!form.name || !form.type}>Save Zone</Button>
          </div>
        ) : undefined}
      >
        {saved ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <Layers className="h-12 w-12 text-[#02A19E]" />
            <p className="text-lg font-semibold text-foreground">Zone Created</p>
            <Badge className="bg-[#02A19E]/15 text-[#02A19E] border-[#02A19E]/30">{form.name}</Badge>
            <Button variant="outline" className="mt-4" onClick={handleZoneClose}>Close</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Zone Name</label>
              <input className={FIELD} placeholder="e.g. Chill Zone A" value={form.name} onChange={e => updZone('name', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Zone Type</label>
              <select className={FIELD} value={form.type} onChange={e => updZone('type', e.target.value)}>
                <option value="">Select type</option>
                <option value="ambient">Ambient (10–25°C)</option>
                <option value="chill">Chill (0–8°C)</option>
                <option value="frozen">Frozen (−25 to −18°C)</option>
                <option value="processing">Processing</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Capacity (tonnes)</label>
              <input type="number" min="0" className={FIELD} placeholder="e.g. 500" value={form.capacity} onChange={e => updZone('capacity', e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Temp Min (°C)</label>
                <input type="number" className={FIELD} placeholder="-25" value={form.tempMin} onChange={e => updZone('tempMin', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Temp Max (°C)</label>
                <input type="number" className={FIELD} placeholder="8" value={form.tempMax} onChange={e => updZone('tempMax', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Target (°C)</label>
                <input type="number" className={FIELD} placeholder="4" value={form.tempTarget} onChange={e => updZone('tempTarget', e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Humidity Target (%)</label>
              <input type="number" min="0" max="100" className={FIELD} placeholder="e.g. 85" value={form.humidityTarget} onChange={e => updZone('humidityTarget', e.target.value)} />
            </div>
            <div className="border-t border-border pt-4 mt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pricing</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Rate / Tonne / Day (₹)</label>
                  <input type="number" min="0" className={FIELD} placeholder="e.g. 12" value={form.ratePerTonnePerDay} onChange={e => updZone('ratePerTonnePerDay', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Min Chargeable (T)</label>
                  <input type="number" min="0" className={FIELD} placeholder="e.g. 10" value={form.minimumChargeableTonnes} onChange={e => updZone('minimumChargeableTonnes', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Handling / Entry (₹)</label>
                  <input type="number" min="0" className={FIELD} placeholder="e.g. 500" value={form.handlingChargePerEntry} onChange={e => updZone('handlingChargePerEntry', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Cold Chain Surcharge (%)</label>
                  <input type="number" min="0" max="100" className={FIELD} placeholder="e.g. 5" value={form.coldChainSurcharge} onChange={e => updZone('coldChainSurcharge', e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 mt-3">
                <label className="text-xs font-medium text-muted-foreground">Billing Cycle</label>
                <select className={FIELD} value={form.billingCycle} onChange={e => updZone('billingCycle', e.target.value)}>
                  <option value="">Select cycle</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </FormSheet>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Zones', value: String(liveZones.length + zones.length), icon: Layers, color: TEAL },
          { label: 'Total Capacity', value: `${(totalLiveCapacity + totalConfigCapacity).toLocaleString()} T`, icon: Package, color: '#6333ff' },
          { label: 'Active Alerts', value: String(liveZones.reduce((s, z) => s + z.alerts.length, 0)), icon: AlertTriangle, color: '#ef4444' },
          { label: 'Avg Temp', value: `${(liveZones.reduce((s, z) => s + z.temperature.current, 0) / Math.max(liveZones.length, 1)).toFixed(1)}°C`, icon: Thermometer, color: '#f59e0b' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${color}20` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {typeOptions.map(t => (
          <button
            key={t}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
              filterType === t
                ? 'bg-[#02A19E] text-white border-[#02A19E]'
                : 'bg-muted text-muted-foreground border-border hover:text-foreground'
            }`}
            onClick={() => setFilterType(t)}
          >
            {t === 'all' ? 'All Types' : t}
          </button>
        ))}
      </div>

      {filteredLive.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Live</Badge>
              Network Zones
            </CardTitle>
            <CardDescription>Real-time monitored zones across all facilities</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredLive.map(zone => {
                const isExpanded = expandedId === zone.id;
                const tempOk = zone.temperature.current >= zone.temperature.min && zone.temperature.current <= zone.temperature.max;
                const critAlerts = zone.alerts.filter(a => a.severity === 'critical').length;
                const openDoors = zone.doors.filter(d => d.status === 'open').length;
                const typeStyle = TYPE_STYLE[zone.type] ?? 'bg-muted text-muted-foreground border-border';
                return (
                  <div key={zone.id}>
                    <button
                      className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                      onClick={() => setExpandedId(isExpanded ? null : zone.id)}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${TEAL}15` }}>
                        <Layers className="h-4 w-4" style={{ color: TEAL }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{zone.name}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${typeStyle}`}>{zone.type}</span>
                          {critAlerts > 0 && <Badge variant="destructive" className="text-[10px]">{critAlerts} Alert</Badge>}
                          {openDoors > 0 && <Badge variant="warning" className="text-[10px]">{openDoors} Open</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{zone.facilityName}</p>
                      </div>
                      <div className="flex items-center gap-5 flex-shrink-0 text-right">
                        <div>
                          <p className={`text-sm font-bold ${tempOk ? 'text-foreground' : 'text-destructive'}`}>{zone.temperature.current}°C</p>
                          <p className="text-[10px] text-muted-foreground">Temp</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{zone.occupancy}%</p>
                          <p className="text-[10px] text-muted-foreground">Occupancy</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{zone.capacity} T</p>
                          <p className="text-[10px] text-muted-foreground">Capacity</p>
                        </div>
                        {onSelectZone && (
                          <button
                            className="flex items-center gap-1 text-[10px] font-semibold text-[#02A19E] hover:underline flex-shrink-0"
                            onClick={e => { e.stopPropagation(); onSelectZone(zone.id); }}
                          >
                            <ExternalLink className="h-3 w-3" /> Details
                          </button>
                        )}
                        {isExpanded
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 bg-muted/10 border-t border-border/50 pt-4">

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                          {(() => {
                            const tempOkKpi = zone.temperature.current >= zone.temperature.min && zone.temperature.current <= zone.temperature.max;
                            const tempColor = !tempOkKpi ? '#ef4444' : Math.abs(zone.temperature.current - zone.temperature.target) > 2 ? '#f59e0b' : '#22c55e';
                            const humOkKpi = zone.humidity.current >= zone.humidity.min && zone.humidity.current <= zone.humidity.max;
                            return [
                              { icon: Thermometer, label: 'Temperature', value: `${zone.temperature.current}°C`, color: tempColor },
                              { icon: Droplets, label: 'Humidity', value: `${zone.humidity.current}%`, color: humOkKpi ? '#3b82f6' : '#f59e0b' },
                              { icon: Package, label: 'Occupancy', value: `${zone.occupancy}%`, color: zone.occupancy > 90 ? '#f59e0b' : TEAL, isOccupancy: true },
                              { icon: AlertTriangle, label: 'Active Alerts', value: String(zone.alerts.length), color: zone.alerts.length > 0 ? '#ef4444' : '#22c55e' },
                            ];
                          })().map(({ icon: Icon, label, value, color, isOccupancy }) => (
                            <div key={label} className="bg-muted rounded-xl px-4 py-3 flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${color}20` }}>
                                {isOccupancy
                                  ? <ProgressRing value={zone.occupancy} size={28} strokeWidth={3} color={color} />
                                  : <Icon className="h-4 w-4" style={{ color }} />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{value}</p>
                                <p className="text-[10px] text-muted-foreground">{label}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Environment</p>
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="flex items-center gap-1 text-muted-foreground"><Thermometer className="h-3 w-3" /> Temperature</span>
                                  <span className="font-semibold text-foreground">{zone.temperature.current}°C</span>
                                </div>
                                <div className="relative h-1.5 w-full rounded-full bg-muted overflow-visible">
                                  <div
                                    className="absolute top-0 h-full rounded-full bg-green-500/30"
                                    style={{
                                      left: `${Math.max(0, ((zone.temperature.min - (zone.temperature.min - 5)) / ((zone.temperature.max + 5) - (zone.temperature.min - 5))) * 100)}%`,
                                      width: `${((zone.temperature.max - zone.temperature.min) / ((zone.temperature.max + 5) - (zone.temperature.min - 5))) * 100}%`,
                                    }}
                                  />
                                  <div
                                    className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-background"
                                    style={{
                                      left: `${Math.min(100, Math.max(0, ((zone.temperature.current - (zone.temperature.min - 5)) / ((zone.temperature.max + 5) - (zone.temperature.min - 5))) * 100))}%`,
                                      background: zone.temperature.current < zone.temperature.min || zone.temperature.current > zone.temperature.max ? '#ef4444' : '#22c55e',
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                  <span>{zone.temperature.min}°C</span>
                                  <span>target {zone.temperature.target}°C</span>
                                  <span>{zone.temperature.max}°C</span>
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="flex items-center gap-1 text-muted-foreground"><Droplets className="h-3 w-3" /> Humidity</span>
                                  <span className="font-semibold text-foreground">{zone.humidity.current}%</span>
                                </div>
                                <div className="relative h-1.5 w-full rounded-full bg-muted overflow-visible">
                                  <div
                                    className="absolute top-0 h-full rounded-full bg-blue-500/30"
                                    style={{
                                      left: `${(zone.humidity.min / 100) * 100}%`,
                                      width: `${((zone.humidity.max - zone.humidity.min) / 100) * 100}%`,
                                    }}
                                  />
                                  <div
                                    className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-background"
                                    style={{
                                      left: `${Math.min(98, (zone.humidity.current / 100) * 100)}%`,
                                      background: zone.humidity.current < zone.humidity.min || zone.humidity.current > zone.humidity.max ? '#f59e0b' : '#3b82f6',
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                  <span>{zone.humidity.min}%</span>
                                  <span>target {zone.humidity.target}%</span>
                                  <span>{zone.humidity.max}%</span>
                                </div>
                              </div>
                              <Separator />
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-1.5 text-muted-foreground"><Wind className="h-3.5 w-3.5" /> NH₃</span>
                                  <span className={`font-semibold ${zone.safety.nh3Level > 50 ? 'text-destructive' : zone.safety.nh3Level > 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                                    {zone.safety.nh3Level} ppm
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-1.5 text-muted-foreground"><Activity className="h-3.5 w-3.5" /> CO₂</span>
                                  <span className={`font-semibold ${zone.safety.co2Level > 1000 ? 'text-destructive' : zone.safety.co2Level > 600 ? 'text-yellow-400' : 'text-green-400'}`}>
                                    {zone.safety.co2Level} ppm
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-1.5 text-muted-foreground"><Zap className="h-3.5 w-3.5" /> Energy</span>
                                  <span className="text-foreground font-semibold">{zone.energy.consumption} kWh</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Doors & Safety</p>
                            <div className="space-y-1.5">
                              {zone.doors.map(door => (
                                <div key={door.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                                  door.status === 'open' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-muted/50 border-border/50'
                                }`}>
                                  <div className="flex items-center gap-2">
                                    <DoorOpen className={`h-3.5 w-3.5 ${door.status === 'open' ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                                    <span className="text-foreground font-medium">{door.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={door.status === 'open' ? 'warning' : 'secondary'} className="text-[10px] capitalize">{door.status}</Badge>
                                    {door.openDuration && <span className="text-yellow-400">{door.openDuration}m</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Separator />
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Safety Summary</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">NH₃ Level</span>
                                <Badge variant={zone.safety.nh3Level > 50 ? 'destructive' : zone.safety.nh3Level > 20 ? 'warning' : 'success'} className="text-[10px]">
                                  {zone.safety.nh3Level > 50 ? 'Danger' : zone.safety.nh3Level > 20 ? 'Elevated' : 'Normal'}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">CO₂ Level</span>
                                <Badge variant={zone.safety.co2Level > 1000 ? 'destructive' : zone.safety.co2Level > 600 ? 'warning' : 'success'} className="text-[10px]">
                                  {zone.safety.co2Level > 1000 ? 'Danger' : zone.safety.co2Level > 600 ? 'Elevated' : 'Normal'}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Last Updated</span>
                                <span className="text-xs text-muted-foreground">{new Date(zone.safety.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alerts ({zone.alerts.length})</p>
                            {zone.alerts.length === 0 ? (
                              <p className="text-xs text-green-400 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                All systems normal
                              </p>
                            ) : (
                              <div className="space-y-1.5">
                                {zone.alerts.map(alert => (
                                  <div key={alert.id} className={`px-3 py-2 rounded-lg border text-xs ${
                                    alert.severity === 'critical' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                                    alert.severity === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                                    'bg-muted/50 border-border/50 text-muted-foreground'
                                  }`}>
                                    <div className="flex items-start gap-2">
                                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                                      <span>{alert.message}</span>
                                    </div>
                                    <p className="mt-1 opacity-70">{alert.time}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            <Separator />
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Inventory ({zone.products.length} SKUs)
                            </p>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Total Value</span>
                              <span className="text-foreground font-semibold">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
                                  zone.products.reduce((s, p) => s + p.value, 0)
                                )}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {[...zone.products].sort((a, b) => b.value - a.value).slice(0, 3).map(p => {
                                const daysLeft = Math.ceil((new Date(p.expiryDate).getTime() - Date.now()) / 86400000);
                                return (
                                  <div key={p.sku} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-xs">
                                    <span className="text-foreground font-medium truncate flex-1">{p.name}</span>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                      <span className="text-muted-foreground font-mono text-[10px]">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0, notation: 'compact' }).format(p.value)}
                                      </span>
                                      <Badge variant={daysLeft < 14 ? 'destructive' : daysLeft < 30 ? 'warning' : 'secondary'} className="text-[10px]">
                                        {daysLeft > 0 ? `${daysLeft}d` : 'exp'}
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredConfig.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="text-xs bg-[#02A19E]/15 text-[#02A19E] border-[#02A19E]/30">Configured</Badge>
              Custom Zones
            </CardTitle>
            <CardDescription>Zones registered via setup</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredConfig.map(zone => {
                const isExpanded = expandedId === zone.id;
                const typeStyle = TYPE_STYLE[zone.type] ?? 'bg-muted text-muted-foreground border-border';
                return (
                  <div key={zone.id}>
                    <button
                      className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                      onClick={() => setExpandedId(isExpanded ? null : zone.id)}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 flex-shrink-0">
                        <Layers className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{zone.name}</p>
                          {zone.type && <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${typeStyle}`}>{zone.type}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{zone.facilityId}</p>
                      </div>
                      <div className="flex items-center gap-5 flex-shrink-0 text-right">
                        {zone.tempTarget && (
                          <div>
                            <p className="text-sm font-bold text-foreground">{zone.tempTarget}°C</p>
                            <p className="text-[10px] text-muted-foreground">Target</p>
                          </div>
                        )}
                        {zone.capacity && (
                          <div>
                            <p className="text-sm font-bold text-foreground">{Number(zone.capacity).toLocaleString()} T</p>
                            <p className="text-[10px] text-muted-foreground">Capacity</p>
                          </div>
                        )}
                        {zone.ratePerTonnePerDay && (
                          <div>
                            <p className="text-sm font-bold" style={{ color: TEAL }}>₹{zone.ratePerTonnePerDay}/T/day</p>
                            <p className="text-[10px] text-muted-foreground">Rate</p>
                          </div>
                        )}
                        {isExpanded
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 bg-muted/10 border-t border-border/50 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Zone Settings</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3">
                                <Thermometer className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-[10px] text-muted-foreground">Temp Range / Target</p>
                                  <p className="text-sm font-semibold text-foreground">
                                    {zone.tempMin || '—'}°C – {zone.tempMax || '—'}°C
                                    {zone.tempTarget ? <span className="text-muted-foreground font-normal"> · target {zone.tempTarget}°C</span> : null}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3">
                                <Droplets className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-[10px] text-muted-foreground">Humidity Target</p>
                                  <p className="text-sm font-semibold text-foreground">{zone.humidityTarget ? `${zone.humidityTarget}%` : '—'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3">
                                <Package className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
                                <div className="flex-1">
                                  <p className="text-[10px] text-muted-foreground">Capacity</p>
                                  <p className="text-sm font-semibold text-foreground">{zone.capacity ? `${Number(zone.capacity).toLocaleString()} T` : '—'}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pricing</p>
                            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 space-y-2.5">
                              {[
                                { label: 'Rate / Tonne / Day', value: zone.ratePerTonnePerDay ? `₹${zone.ratePerTonnePerDay}` : '—', money: true },
                                { label: 'Min Chargeable', value: zone.minimumChargeableTonnes ? `${zone.minimumChargeableTonnes} T` : '—', money: false },
                                { label: 'Handling / Entry', value: zone.handlingChargePerEntry ? `₹${zone.handlingChargePerEntry}` : '—', money: true },
                                { label: 'Cold Chain Surcharge', value: zone.coldChainSurcharge ? `${zone.coldChainSurcharge}%` : '—', money: false },
                                { label: 'Billing Cycle', value: zone.billingCycle || '—', money: false },
                              ].map(({ label, value, money }) => (
                                <div key={label} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{label}</span>
                                  <span className={`font-semibold ${money && value !== '—' ? 'text-[#02A19E]' : 'text-foreground'}`}>{value}</span>
                                </div>
                              ))}
                              {zone.ratePerTonnePerDay && zone.minimumChargeableTonnes && (
                                <>
                                  <Separator />
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Est. Monthly Revenue</span>
                                    <span className="text-lg font-bold" style={{ color: TEAL }}>
                                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
                                        Number(zone.ratePerTonnePerDay) * Number(zone.minimumChargeableTonnes) * 30
                                      )}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredLive.length === 0 && filteredConfig.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Layers className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No zones found for the selected type</p>
        </div>
      )}
    </div>
  );
}

void chennaiFacility;
