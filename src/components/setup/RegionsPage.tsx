import { useState } from 'react';
import { FormSheet, Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, AdvancedSelect } from '@vrushabh-b/oneiot-ui';
import { Separator } from '@vrushabh-b/oneiot-ui';
import {
  Globe, MapPin, Mail, Phone, Plus, ChevronRight,
  ChevronDown, Building2, Calendar, Package, ArrowRight,
} from 'lucide-react';
import { useSetup } from '@/contexts/SetupContext';
import type { Region } from '@/contexts/SetupContext';

const TEAL = '#02A19E';

const FIELD = 'w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#02A19E]';

const USERS = [
  { value: 'u1', label: 'Arjun Mehta', description: 'arjun.mehta@coldguard.in' },
  { value: 'u2', label: 'Priya Nair', description: 'priya.nair@coldguard.in' },
  { value: 'u3', label: 'Suresh Sharma', description: 'suresh.s@coldguard.in' },
  { value: 'u4', label: 'Anita Desai', description: 'anita.d@coldguard.in' },
  { value: 'u5', label: 'Rajesh Kumar', description: 'rajesh.k@coldguard.in' },
  { value: 'u6', label: 'Meena Pillai', description: 'meena.p@coldguard.in' },
];

const emptyRegion = (): Omit<Region, 'id' | 'createdAt'> => ({
  name: '', code: '', states: '', headId: '', headName: '', headEmail: '', headMobile: '',
});

const MOCK_REGIONS: (Region & { facilityCount: number; totalCapacity: number; status: 'active' | 'partial' })[] = [
  {
    id: 'mock-south', name: 'South India', code: 'SOUTH',
    states: 'Tamil Nadu, Karnataka, Kerala, Andhra Pradesh',
    headId: 'u2', headName: 'Priya Nair', headEmail: 'priya.nair@coldguard.in', headMobile: '9876543210',
    createdAt: '2024-01-15T10:00:00',
    facilityCount: 4, totalCapacity: 7800, status: 'active',
  },
  {
    id: 'mock-north', name: 'North India', code: 'NORTH',
    states: 'Delhi, Haryana, Punjab, Uttar Pradesh, Rajasthan',
    headId: 'u3', headName: 'Suresh Sharma', headEmail: 'suresh.s@coldguard.in', headMobile: '9123456780',
    createdAt: '2024-02-01T10:00:00',
    facilityCount: 3, totalCapacity: 6200, status: 'active',
  },
  {
    id: 'mock-west', name: 'West India', code: 'WEST',
    states: 'Maharashtra, Gujarat, Goa',
    headId: 'u4', headName: 'Anita Desai', headEmail: 'anita.d@coldguard.in', headMobile: '9988776655',
    createdAt: '2024-03-10T10:00:00',
    facilityCount: 2, totalCapacity: 4500, status: 'partial',
  },
];

export function RegionsPage({ onSelectRegion }: { onSelectRegion?: (id: string) => void }) {
  const { regions, facilities, addRegion } = useSetup();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(emptyRegion());
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const upd = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { addRegion(form); setSaved(true); };
  const handleClose = () => { setSheetOpen(false); setSaved(false); setForm(emptyRegion()); };

  const allRegions = [
    ...MOCK_REGIONS,
    ...regions.map(r => ({
      ...r,
      facilityCount: facilities.filter(f => f.regionId === r.id).length,
      totalCapacity: facilities.filter(f => f.regionId === r.id).reduce((s, f) => s + (Number(f.totalCapacity) || 0), 0),
      status: 'active' as const,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Regions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{allRegions.length} regions · {allRegions.reduce((s, r) => s + r.facilityCount, 0)} total facilities</p>
        </div>
        <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => setSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Region
        </Button>
      </div>

      <FormSheet
        open={sheetOpen}
        onClose={handleClose}
        title={<span className="flex items-center gap-2"><Globe className="h-4 w-4" /> Create Region</span>}
        description="Define a new geographic region and assign a regional head."
        footer={!saved ? (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={handleSave} disabled={!form.name}>Save Region</Button>
          </div>
        ) : undefined}
      >
        {saved ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <Globe className="h-12 w-12 text-[#02A19E]" />
            <p className="text-lg font-semibold text-foreground">Region Created</p>
            <Badge className="bg-[#02A19E]/15 text-[#02A19E] border-[#02A19E]/30">{form.name}</Badge>
            <Button variant="outline" className="mt-4" onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Region Name</label>
              <input className={FIELD} placeholder="e.g. South India" value={form.name} onChange={e => upd('name', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Region Code</label>
              <input className={FIELD} placeholder="e.g. SOUTH" value={form.code} onChange={e => upd('code', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">States / UTs Covered</label>
              <input className={FIELD} placeholder="e.g. Tamil Nadu, Karnataka, Kerala" value={form.states} onChange={e => upd('states', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Regional Head</label>
              <AdvancedSelect
                placeholder="Select a regional head"
                options={USERS}
                searchable
                value={form.headId}
                onValueChange={v => {
                  const val = (Array.isArray(v) ? v[0] : v) as string;
                  const user = USERS.find(u => u.value === val);
                  setForm(p => ({
                    ...p,
                    headId: val ?? '',
                    headName: user?.label ?? '',
                    headEmail: user?.description ?? '',
                    headMobile: '',
                  }));
                }}
              />
            </div>
          </div>
        )}
      </FormSheet>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${TEAL}20` }}>
                <Globe className="h-5 w-5" style={{ color: TEAL }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{allRegions.length}</p>
                <p className="text-xs text-muted-foreground">Total Regions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <Building2 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{allRegions.reduce((s, r) => s + r.facilityCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Facilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <MapPin className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{(allRegions.reduce((s, r) => s + r.totalCapacity, 0) / 1000).toFixed(1)}K T</p>
                <p className="text-xs text-muted-foreground">Total Capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Regions</CardTitle>
          <CardDescription>Click a region to view details</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {allRegions.map(region => {
              const isExpanded = expandedId === region.id;
              const isMock = region.id.startsWith('mock-');
              return (
                <div key={region.id}>
                  <button
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                    onClick={() => setExpandedId(isExpanded ? null : region.id)}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${TEAL}15` }}>
                      <Globe className="h-4 w-4" style={{ color: TEAL }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{region.name}</p>
                        <Badge variant="secondary" className="text-[10px] font-mono">{region.code}</Badge>
                        {isMock && <Badge variant="outline" className="text-[10px]">Live</Badge>}
                        {!isMock && <Badge className="text-[10px] bg-[#02A19E]/15 text-[#02A19E] border-[#02A19E]/30">Configured</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{region.states || 'No states specified'}</p>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0 text-right">
                      <div>
                        <p className="text-sm font-bold text-foreground">{region.facilityCount}</p>
                        <p className="text-[10px] text-muted-foreground">Facilities</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{region.totalCapacity.toLocaleString()} T</p>
                        <p className="text-[10px] text-muted-foreground">Capacity</p>
                      </div>
                      <div>
                        <Badge variant={region.status === 'active' ? 'success' : 'warning'} className="text-[10px] capitalize">{region.status}</Badge>
                      </div>
                      {isExpanded
                        ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 bg-muted/10 border-t border-border/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">

                        <div className="space-y-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Overview</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="font-mono text-xs">{region.code || '—'}</Badge>
                            <Badge variant={region.status === 'active' ? 'success' : 'warning'} className="text-xs capitalize">{region.status}</Badge>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">States / UTs</p>
                            <div className="flex flex-wrap gap-1.5">
                              {(region.states || '').split(',').map(s => s.trim()).filter(Boolean).map(s => (
                                <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                              ))}
                              {!region.states && <span className="text-xs text-muted-foreground">—</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">Created</span>
                            <span className="text-foreground font-medium ml-auto">
                              {new Date(region.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Capacity & Facilities</p>
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3">
                              <Building2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-lg font-bold text-foreground">{region.facilityCount}</p>
                                <p className="text-[10px] text-muted-foreground">Facilities</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3">
                              <Package className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
                              <div className="flex-1">
                                <p className="text-lg font-bold text-foreground">{region.totalCapacity.toLocaleString()} T</p>
                                <p className="text-[10px] text-muted-foreground">Total Capacity</p>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between text-sm px-1">
                              <span className="text-muted-foreground">Avg per facility</span>
                              <span className="text-foreground font-semibold">
                                {region.facilityCount > 0 ? Math.round(region.totalCapacity / region.facilityCount).toLocaleString() : '—'} T
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Regional Head</p>
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#02A19E]/20 flex-shrink-0">
                              <span className="text-lg font-bold text-[#02A19E]">
                                {(region.headName || '?')[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{region.headName || '—'}</p>
                              <p className="text-xs text-muted-foreground">Regional Head</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {region.headEmail && (
                              <div className="flex items-center gap-2.5 text-sm">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-foreground truncate">{region.headEmail}</span>
                              </div>
                            )}
                            {region.headMobile && (
                              <div className="flex items-center gap-2.5 text-sm">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-foreground">{region.headMobile}</span>
                              </div>
                            )}
                          </div>
                           <Button variant="outline" size="sm" className="w-full">
                             <Mail className="h-3.5 w-3.5 mr-2" />
                             Contact
                           </Button>
                           {onSelectRegion && (
                             <Button
                               size="sm"
                               className="w-full bg-[#02A19E] text-white hover:bg-[#02A19E]/90 mt-1"
                               onClick={e => { e.stopPropagation(); onSelectRegion(region.id); }}
                             >
                               View Dashboard <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                             </Button>
                           )}
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
    </div>
  );
}
