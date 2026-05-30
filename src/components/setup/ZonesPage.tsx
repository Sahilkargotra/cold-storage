import { useState } from 'react';
import { FormSheet, Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, ProgressRing } from '@vrushabh-b/oneiot-ui';
import {
  Layers, Thermometer, Droplets, Package, AlertTriangle,
  Plus, ChevronRight, DoorOpen,
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
                const tempOk = zone.temperature.current >= zone.temperature.min && zone.temperature.current <= zone.temperature.max;
                const critAlerts = zone.alerts.filter(a => a.severity === 'critical').length;
                const openDoors = zone.doors.filter(d => d.status === 'open').length;
                const typeStyle = TYPE_STYLE[zone.type] ?? 'bg-muted text-muted-foreground border-border';
                const isClickable = !!onSelectZone;
                return (
                  <div
                    key={zone.id}
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onClick={isClickable ? () => onSelectZone(zone.id) : undefined}
                    onKeyDown={isClickable ? e => e.key === 'Enter' && onSelectZone(zone.id) : undefined}
                    className={`w-full px-5 py-4 flex items-center gap-4 transition-colors text-left ${isClickable ? 'cursor-pointer hover:bg-muted/30' : ''}`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${TEAL}15` }}>
                      <Layers className="h-4 w-4" style={{ color: TEAL }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{zone.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${typeStyle}`}>{zone.type}</span>
                        {critAlerts > 0 && <Badge variant="destructive" className="text-[10px]">{critAlerts} Alert</Badge>}
                        {openDoors > 0 && <Badge variant="warning" className="text-[10px] flex items-center gap-1"><DoorOpen className="h-2.5 w-2.5" />{openDoors} Open</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{zone.facilityName}</p>
                    </div>
                    <div className="flex items-center gap-5 flex-shrink-0">
                      <div className="text-right">
                        <p className={`text-sm font-bold ${tempOk ? 'text-foreground' : 'text-destructive'}`}>
                          <Thermometer className="h-3 w-3 inline mr-0.5 opacity-60" />{zone.temperature.current}°C
                        </p>
                        <p className="text-[10px] text-muted-foreground">{zone.temperature.min}–{zone.temperature.max}°C</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          <Droplets className="h-3 w-3 inline mr-0.5 opacity-60" />{zone.humidity.current}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">Humidity</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{zone.capacity} T</p>
                        <p className="text-[10px] text-muted-foreground">Capacity</p>
                      </div>
                      <ProgressRing value={zone.occupancy} size={34} strokeWidth={3} color={zone.occupancy > 90 ? '#f59e0b' : TEAL} showValue />
                      {isClickable && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
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
                const typeStyle = TYPE_STYLE[zone.type] ?? 'bg-muted text-muted-foreground border-border';
                return (
                  <div key={zone.id} className="px-5 py-4 flex items-center gap-4">
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
                    <div className="flex items-center gap-5 flex-shrink-0">
                      {zone.tempTarget && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{zone.tempTarget}°C</p>
                          <p className="text-[10px] text-muted-foreground">Target</p>
                        </div>
                      )}
                      {zone.capacity && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{Number(zone.capacity).toLocaleString()} T</p>
                          <p className="text-[10px] text-muted-foreground">Capacity</p>
                        </div>
                      )}
                      {zone.ratePerTonnePerDay && (
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: TEAL }}>₹{zone.ratePerTonnePerDay}/T/day</p>
                          <p className="text-[10px] text-muted-foreground">Rate</p>
                        </div>
                      )}
                    </div>
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
