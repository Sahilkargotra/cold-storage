import { useState } from 'react';
import { FormSheet, Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Separator, ProgressRing } from '@vrushabh-b/oneiot-ui';
import {
  Warehouse, MapPin, Mail, Phone, Plus, ChevronRight,
  ChevronDown, Thermometer, Zap, Package, Calendar,
  DoorOpen, Activity,
} from 'lucide-react';
import { useSetup } from '@/contexts/SetupContext';
import type { FacilitySetup } from '@/contexts/SetupContext';
import { regionalFacilities } from '@/data/mockData';

const TEAL = '#02A19E';
const FIELD = 'w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#02A19E]';

const emptyFacility = (): Omit<FacilitySetup, 'id' | 'createdAt'> => ({
  regionId: '', name: '', location: '', address: '', latitude: '', longitude: '',
  totalCapacity: '', licenseNumber: '', fssaiLicense: '', managerName: '', managerEmail: '', managerMobile: '',
});

const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export function FacilitiesPage() {
  const { regions, facilities, addFacility } = useSetup();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(emptyFacility());
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const upd = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { addFacility(form); setSaved(true); };
  const handleClose = () => { setSheetOpen(false); setSaved(false); setForm(emptyFacility()); };

  const totalMockCapacity = regionalFacilities.reduce((s, f) => s + f.totalCapacity, 0);
  const totalConfigCapacity = facilities.reduce((s, f) => s + (Number(f.totalCapacity) || 0), 0);

  const filteredMock = regionalFacilities.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase())
  );
  const filteredConfig = facilities.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Facilities</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {regionalFacilities.length + facilities.length} facilities · {(totalMockCapacity + totalConfigCapacity).toLocaleString()} T total capacity
          </p>
        </div>
        <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => setSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      </div>

      <FormSheet
        open={sheetOpen}
        onClose={handleClose}
        title={<span className="flex items-center gap-2"><Warehouse className="h-4 w-4" /> Create Facility</span>}
        description="Register a new cold storage facility under a region."
        footer={!saved ? (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={handleSave} disabled={!form.name}>Save Facility</Button>
          </div>
        ) : undefined}
      >
        {saved ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <Warehouse className="h-12 w-12 text-[#02A19E]" />
            <p className="text-lg font-semibold text-foreground">Facility Created</p>
            <Badge className="bg-[#02A19E]/15 text-[#02A19E] border-[#02A19E]/30">{form.name}</Badge>
            <Button variant="outline" className="mt-4" onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Parent Region</label>
              <select className={FIELD} value={form.regionId} onChange={e => upd('regionId', e.target.value)}>
                <option value="">Select region</option>
                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                <option value="mock-south">South India (Mock)</option>
                <option value="mock-north">North India (Mock)</option>
                <option value="mock-west">West India (Mock)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Facility Name</label>
              <input className={FIELD} placeholder="e.g. Mysore Cold Storage" value={form.name} onChange={e => upd('name', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">City, State</label>
              <input className={FIELD} placeholder="e.g. Mysore, Karnataka" value={form.location} onChange={e => upd('location', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Full Address</label>
              <textarea rows={2} className={FIELD} placeholder="Street address" value={form.address} onChange={e => upd('address', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Latitude</label>
                <input type="number" className={FIELD} placeholder="e.g. 12.31" value={form.latitude} onChange={e => upd('latitude', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Longitude</label>
                <input type="number" className={FIELD} placeholder="e.g. 76.65" value={form.longitude} onChange={e => upd('longitude', e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Total Capacity (tonnes)</label>
              <input type="number" min="0" className={FIELD} placeholder="e.g. 2000" value={form.totalCapacity} onChange={e => upd('totalCapacity', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">FSSAI License Number</label>
              <input className={FIELD} placeholder="14-digit FSSAI" value={form.fssaiLicense} onChange={e => upd('fssaiLicense', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Facility Manager Name</label>
              <input className={FIELD} placeholder="Full name" value={form.managerName} onChange={e => upd('managerName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Manager Email</label>
              <input type="email" className={FIELD} placeholder="email@company.in" value={form.managerEmail} onChange={e => upd('managerEmail', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Manager Mobile</label>
              <input type="tel" className={FIELD} placeholder="10-digit mobile" value={form.managerMobile} onChange={e => upd('managerMobile', e.target.value)} />
            </div>
          </div>
        )}
      </FormSheet>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Facilities', value: String(regionalFacilities.length + facilities.length), icon: Warehouse, color: TEAL },
          { label: 'Total Capacity', value: `${(totalMockCapacity + totalConfigCapacity).toLocaleString()} T`, icon: Package, color: '#6333ff' },
          { label: 'Operational', value: String(regionalFacilities.filter(f => f.status === 'operational').length), icon: Activity, color: '#22c55e' },
          { label: 'Total Zones', value: String(regionalFacilities.reduce((s, f) => s + f.zones.length, 0)), icon: Thermometer, color: '#f59e0b' },
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

      <div className="flex items-center gap-3">
        <input
          className={FIELD + ' max-w-xs'}
          placeholder="Search facilities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setSearch('')}>Clear</button>
        )}
      </div>

      {filteredMock.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Live</Badge>
              Network Facilities
            </CardTitle>
            <CardDescription>Active facilities with real-time monitoring data</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredMock.map(facility => {
                const isExpanded = expandedId === facility.id;
                const criticalCount = facility.zones.reduce((a, z) => a + z.alerts.filter(al => al.severity === 'critical').length, 0);
                const openDoors = facility.zones.reduce((a, z) => a + z.doors.filter(d => d.status === 'open').length, 0);
                return (
                  <div key={facility.id}>
                    <button
                      className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                      onClick={() => setExpandedId(isExpanded ? null : facility.id)}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${TEAL}15` }}>
                        <Warehouse className="h-4 w-4" style={{ color: TEAL }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{facility.name}</p>
                          <Badge variant={facility.status === 'operational' ? 'success' : 'destructive'} className="text-[10px] capitalize">{facility.status}</Badge>
                          {criticalCount > 0 && <Badge variant="destructive" className="text-[10px]">{criticalCount} Critical</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{facility.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 flex-shrink-0 text-right">
                        <div>
                          <p className="text-sm font-bold text-foreground">{facility.occupancy}%</p>
                          <p className="text-[10px] text-muted-foreground">Occupancy</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{facility.totalCapacity.toLocaleString()} T</p>
                          <p className="text-[10px] text-muted-foreground">Capacity</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{fmt(facility.revenue.today)}</p>
                          <p className="text-[10px] text-muted-foreground">Today</p>
                        </div>
                        {isExpanded
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 bg-muted/10 border-t border-border/50 pt-4">

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                          {[
                            {
                              icon: Package, label: 'Occupancy',
                              value: `${facility.occupancy}%`,
                              color: facility.occupancy > 90 ? '#ef4444' : facility.occupancy > 80 ? '#f59e0b' : '#22c55e',
                            },
                            {
                              icon: Activity, label: "Today's Revenue",
                              value: fmt(facility.revenue.today),
                              color: TEAL,
                            },
                            {
                              icon: Zap, label: 'Energy Today',
                              value: `${facility.energy.today.toLocaleString()} kWh`,
                              color: '#6333ff',
                            },
                            {
                              icon: DoorOpen, label: 'Open Doors',
                              value: String(openDoors),
                              color: openDoors > 0 ? '#f59e0b' : '#22c55e',
                            },
                          ].map(({ icon: Icon, label, value, color }) => (
                            <div key={label} className="bg-muted rounded-xl px-4 py-3 flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${color}20` }}>
                                <Icon className="h-4 w-4" style={{ color }} />
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
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Facility Info</p>
                            <div className="space-y-2">
                              {[
                                { icon: MapPin, label: 'Location', value: facility.location },
                                { icon: Package, label: 'Capacity', value: `${facility.totalCapacity.toLocaleString()} T` },
                                { icon: Activity, label: 'Zones', value: String(facility.zones.length) },
                                { icon: DoorOpen, label: 'Open Doors', value: String(openDoors) },
                              ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-2 text-sm">
                                  <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-muted-foreground">{label}</span>
                                  <span className="text-foreground font-medium ml-auto">{value}</span>
                                </div>
                              ))}
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">Coordinates</span>
                                <span className="text-foreground font-medium ml-auto font-mono text-xs">{facility.latitude}°N, {facility.longitude}°E</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Financial Performance</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Today's Revenue</span>
                                <span className="text-foreground font-semibold">{fmt(facility.revenue.today)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Weekly Revenue</span>
                                <span className="text-foreground font-semibold">{fmt(facility.revenue.thisWeek)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Monthly Revenue</span>
                                <span className="text-foreground font-semibold">{fmt(facility.revenue.thisMonth)}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Energy Today</span>
                                <span className="text-foreground font-semibold">{facility.energy.today.toLocaleString()} kWh</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">vs Yesterday</span>
                                <span className={`font-semibold text-sm ${facility.energy.today < facility.energy.yesterday ? 'text-green-400' : 'text-destructive'}`}>
                                  {facility.energy.today < facility.energy.yesterday ? '↓' : '↑'} {Math.abs(Math.round((facility.energy.today - facility.energy.yesterday) / facility.energy.yesterday * 100))}%
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Cost / Tonne</span>
                                <span className={`font-semibold ${facility.energy.costPerTonne < 2000 ? 'text-green-400' : 'text-destructive'}`}>
                                  ₹{facility.energy.costPerTonne.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Zone Health ({facility.zones.length})</p>
                            <div className="space-y-2">
                              {facility.zones.map(zone => {
                                const zoneAlerts = zone.alerts.filter(a => a.severity === 'critical').length;
                                const tempOk = zone.temperature.current >= zone.temperature.min && zone.temperature.current <= zone.temperature.max;
                                const typeBadgeVariant = zone.type === 'frozen' ? 'secondary' : zone.type === 'chill' ? 'info' : 'success';
                                return (
                                  <div key={zone.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                                    <Badge variant={typeBadgeVariant} className="text-[10px] capitalize flex-shrink-0">{zone.type}</Badge>
                                    <span className="text-xs text-foreground font-medium flex-1 truncate">{zone.name}</span>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span className={`text-xs font-bold ${tempOk ? 'text-green-400' : 'text-destructive'}`}>{zone.temperature.current}°C</span>
                                      <ProgressRing value={zone.occupancy} size={28} strokeWidth={3} color={zone.occupancy > 90 ? '#f59e0b' : TEAL} showValue />
                                      {zoneAlerts > 0 && <Badge variant="destructive" className="text-[10px]">{zoneAlerts}</Badge>}
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
              Custom Facilities
            </CardTitle>
            <CardDescription>Facilities registered via the setup form</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredConfig.map(facility => {
                const isExpanded = expandedId === facility.id;
                const regionName = regions.find(r => r.id === facility.regionId)?.name ?? facility.regionId.replace('mock-', '').replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div key={facility.id}>
                    <button
                      className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                      onClick={() => setExpandedId(isExpanded ? null : facility.id)}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 flex-shrink-0">
                        <Warehouse className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{facility.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{facility.location || '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 flex-shrink-0 text-right">
                        {facility.totalCapacity && (
                          <div>
                            <p className="text-sm font-bold text-foreground">{Number(facility.totalCapacity).toLocaleString()} T</p>
                            <p className="text-[10px] text-muted-foreground">Capacity</p>
                          </div>
                        )}
                        <Badge variant="secondary" className="text-[10px]">{regionName || '—'}</Badge>
                        {isExpanded
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 bg-muted/10 border-t border-border/50 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="secondary" className="text-xs">Configured</Badge>
                          <Badge variant="outline" className="text-xs text-muted-foreground">No live monitoring data</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Facility Details</p>
                            <div className="space-y-2">
                              {[
                                { icon: MapPin, label: 'Location', value: facility.location || '—' },
                                { icon: Warehouse, label: 'Capacity', value: facility.totalCapacity ? `${Number(facility.totalCapacity).toLocaleString()} T` : '—' },
                                { icon: Zap, label: 'FSSAI License', value: facility.fssaiLicense || '—' },
                                { icon: MapPin, label: 'Region', value: regionName || '—' },
                                { icon: Calendar, label: 'Created', value: new Date(facility.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                              ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-2 text-sm">
                                  <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-muted-foreground">{label}</span>
                                  <span className="text-foreground font-medium ml-auto">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Facility Manager</p>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 flex-shrink-0">
                                <span className="text-sm font-bold text-purple-400">
                                  {(facility.managerName || '?')[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{facility.managerName || '—'}</p>
                                <p className="text-xs text-muted-foreground">Facility Manager</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {[
                                { icon: Mail, value: facility.managerEmail || '—' },
                                { icon: Phone, value: facility.managerMobile || '—' },
                              ].map(({ icon: Icon, value }) => (
                                <div key={value} className="flex items-center gap-2 text-sm">
                                  <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-foreground">{value}</span>
                                </div>
                              ))}
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

      {filteredMock.length === 0 && filteredConfig.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Warehouse className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No facilities found{search ? ` matching "${search}"` : ''}</p>
        </div>
      )}
    </div>
  );
}
