import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Badge, Button, FormSheet, Tabs, TabsList, TabsTrigger, TabsContent,
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@vrushabh-b/oneiot-ui';
import {
  PackagePlus, CheckCircle2, Truck, CalendarClock, ArrowUpRight,
  Package, User, Thermometer, ClipboardList, Clock,
  CalendarDays, History, Layers, ChevronRight, Search,
} from 'lucide-react';
import { useBookings } from '@/contexts/BookingsContext';
import type { NewBookingForm, UpcomingBookingForm, ReleaseEvent, Booking } from '@/contexts/BookingsContext';
import { AvailabilityChecker } from './AvailabilityChecker';

const FIELD = 'w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#02A19E]';

const nowStr = () => new Date().toISOString().slice(0, 16);

const emptyForm = (): NewBookingForm => ({
  entryDateTime: nowStr(),
  expectedArrivalDate: '',
  supplierName: '', vehicleNumber: '', driverName: '', driverMobile: '',
  productCategory: '', productName: '', batchNumber: '',
  quantityUnits: '', quantityWeight: '',
  expiryDate: '', arrivalTemperature: '', visualCondition: '',
  zoneAssignment: '', remarks: '',
});

const emptyUpcoming = (): UpcomingBookingForm => ({
  expectedArrivalDate: '', supplierName: '', vehicleNumber: '',
  productCategory: '', productName: '', quantityWeight: '',
  zoneAssignment: '', remarks: '',
});

const emptyRelease = (): Omit<ReleaseEvent, 'eventId' | 'releasedAt'> => ({
  exitDateTime: nowStr(), vehicleNumber: '', recipientName: '',
  recipientMobile: '', quantityReleased: '', remarks: '',
});

const emptyArrival = () => ({
  entryDateTime: nowStr(), arrivalTemperature: '', visualCondition: '',
  batchNumber: '', quantityUnits: '', expiryDate: '',
  driverName: '', driverMobile: '',
});

function fmtDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDT(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function daysStored(createdAt: string, releasedAt?: string) {
  const end = releasedAt ? new Date(releasedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - new Date(createdAt).getTime()) / 86400000));
}
function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

const ZONE_BADGE: Record<string, string> = {
  'Ambient Zone':    'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'Chill Zone':      'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Frozen Zone':     'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  'Processing Zone': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

function ZonePill({ zone }: { zone: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${ZONE_BADGE[zone] ?? 'bg-muted text-muted-foreground border-border'}`}>
      {zone || '—'}
    </span>
  );
}

function DetailRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground flex-shrink-0">{label}</span>
      <span className={`text-xs font-medium text-right ${accent ? 'text-[#02A19E]' : 'text-foreground'}`}>{value || '—'}</span>
    </div>
  );
}

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
      <Icon className="h-3 w-3" /> {label}
    </p>
  );
}

interface ActiveDetailSheetProps {
  booking: Booking;
  onClose: () => void;
  onRelease: (event: Omit<ReleaseEvent, 'eventId' | 'releasedAt'>) => void;
  remaining: number;
}

function ActiveDetailSheet({ booking, onClose, onRelease, remaining }: ActiveDetailSheetProps) {
  const [view, setView] = useState<'detail' | 'release' | 'done'>('detail');
  const [form, setForm] = useState(emptyRelease);
  const upd = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const qtyNum = parseFloat(form.quantityReleased) || 0;
  const canRelease = form.exitDateTime && form.vehicleNumber && form.recipientName && qtyNum > 0 && qtyNum <= remaining;

  const handleRelease = () => {
    onRelease(form);
    setView('done');
  };

  const footer =
    view === 'detail' ? (
      <div className="flex justify-between w-full">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => setView('release')}>
          <ArrowUpRight className="h-4 w-4 mr-1.5" /> Release Stock
        </Button>
      </div>
    ) : view === 'release' ? (
      <div className="flex justify-between w-full">
        <Button variant="outline" onClick={() => setView('detail')}>Back</Button>
        <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" disabled={!canRelease} onClick={handleRelease}>
          Confirm Release
        </Button>
      </div>
    ) : undefined;

  const title =
    view === 'detail' ? <span className="flex items-center gap-2"><ClipboardList className="h-4 w-4" />{booking.bookingNumber}</span> :
    view === 'release' ? <span className="flex items-center gap-2"><ArrowUpRight className="h-4 w-4" />Release Stock</span> :
    <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Released</span>;

  const description =
    view === 'detail' ? `${booking.productName} · ${booking.zoneAssignment} · ${daysStored(booking.createdAt)} days stored` :
    view === 'release' ? `Remaining: ${remaining} kg of ${booking.quantityWeight} kg` : undefined;

  return (
    <FormSheet open onClose={onClose} title={title} description={description} footer={footer}>
      {view === 'detail' && (
        <div className="space-y-5">
          <div>
            <SectionLabel icon={Truck} label="Inward Details" />
            <DetailRow label="Entry Date & Time" value={fmtDT(booking.entryDateTime)} />
            <DetailRow label="Supplier" value={booking.supplierName} />
            <DetailRow label="Vehicle" value={booking.vehicleNumber} />
            <DetailRow label="Driver" value={booking.driverName} />
            <DetailRow label="Driver Mobile" value={booking.driverMobile} />
          </div>
          <div>
            <SectionLabel icon={Package} label="Product Details" />
            <DetailRow label="Product" value={booking.productName} />
            <DetailRow label="Category" value={booking.productCategory} />
            <DetailRow label="Batch / Lot" value={booking.batchNumber} />
            <DetailRow label="Qty (units)" value={booking.quantityUnits} />
            <DetailRow label="Total Weight" value={`${booking.quantityWeight} kg`} />
            <DetailRow label="Remaining" value={`${remaining} kg`} accent />
            <DetailRow label="Expiry Date" value={fmtDate(booking.expiryDate)} />
            <DetailRow label="Arrival Temp" value={booking.arrivalTemperature ? `${booking.arrivalTemperature}°C` : ''} accent />
            <DetailRow label="Visual Condition" value={booking.visualCondition} />
            <DetailRow label="Zone" value={booking.zoneAssignment} accent />
            {booking.remarks && <DetailRow label="Remarks" value={booking.remarks} />}
          </div>
          {booking.releaseEvents.length > 0 && (
            <div>
              <SectionLabel icon={History} label={`Release History (${booking.releaseEvents.length} events)`} />
              <div className="space-y-2">
                {booking.releaseEvents.map((ev, i) => (
                  <div key={ev.eventId} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Release {i + 1}</span>
                      <span className="text-xs font-bold text-[#02A19E]">{ev.quantityReleased} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><User className="h-2.5 w-2.5" />{ev.recipientName}</span>
                      <span className="text-muted-foreground">{fmtDate(ev.releasedAt)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Truck className="h-2.5 w-2.5" />{ev.vehicleNumber}</div>
                    {ev.remarks && <div className="text-xs text-muted-foreground italic">{ev.remarks}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <SectionLabel icon={CalendarClock} label="Storage Timeline" />
            <DetailRow label="Booked On" value={fmtDT(booking.createdAt)} />
            <DetailRow label="Days Stored" value={`${daysStored(booking.createdAt)} days`} accent />
          </div>
        </div>
      )}

      {view === 'release' && (
        <div className="space-y-4">
          <div className="rounded-lg bg-[#02A19E]/10 border border-[#02A19E]/30 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Remaining Stock</span>
            <span className="text-lg font-bold text-[#02A19E]">{remaining} kg</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Exit Date & Time</label>
            <input type="datetime-local" className={FIELD} value={form.exitDateTime} onChange={e => upd('exitDateTime', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Exit Vehicle Number</label>
            <input className={FIELD} placeholder="e.g. TN-02-XY-5678" value={form.vehicleNumber} onChange={e => upd('vehicleNumber', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Recipient / Consignee</label>
            <input className={FIELD} placeholder="Company or person collecting" value={form.recipientName} onChange={e => upd('recipientName', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Recipient Mobile</label>
            <input type="tel" className={FIELD} placeholder="10-digit number" value={form.recipientMobile} onChange={e => upd('recipientMobile', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Quantity to Release (kg)</label>
            <input
              type="number" min="1" max={remaining} className={FIELD}
              placeholder={`Max ${remaining} kg`}
              value={form.quantityReleased}
              onChange={e => upd('quantityReleased', e.target.value)}
            />
            {qtyNum > remaining && (
              <p className="text-xs text-destructive">Cannot exceed remaining {remaining} kg</p>
            )}
            {qtyNum > 0 && qtyNum <= remaining && (
              <p className="text-xs text-muted-foreground">
                {remaining - qtyNum} kg will remain after this release
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Remarks (optional)</label>
            <textarea rows={2} className={FIELD} placeholder="Condition at exit, special notes..." value={form.remarks} onChange={e => upd('remarks', e.target.value)} />
          </div>
        </div>
      )}

      {view === 'done' && (
        <div className="flex flex-col items-center gap-4 py-12">
          <CheckCircle2 className="h-14 w-14 text-green-500" />
          <p className="text-lg font-semibold text-foreground">Release Recorded</p>
          <p className="text-sm text-muted-foreground text-center">
            {form.quantityReleased} kg released to <span className="text-foreground font-medium">{form.recipientName}</span>
          </p>
          {remaining - (parseFloat(form.quantityReleased) || 0) > 0 && (
            <div className="rounded-lg bg-muted px-4 py-2 text-sm text-center">
              <span className="text-muted-foreground">Remaining in storage: </span>
              <span className="font-bold text-[#02A19E]">{remaining - (parseFloat(form.quantityReleased) || 0)} kg</span>
            </div>
          )}
          <Button variant="outline" className="mt-4" onClick={onClose}>Close</Button>
        </div>
      )}
    </FormSheet>
  );
}

interface MarkArrivedSheetProps {
  booking: Booking;
  onClose: () => void;
  onArrived: (details: ReturnType<typeof emptyArrival>) => void;
}

function MarkArrivedSheet({ booking, onClose, onArrived }: MarkArrivedSheetProps) {
  const [form, setForm] = useState(emptyArrival);
  const [done, setDone] = useState(false);
  const upd = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const canSave = form.entryDateTime && form.visualCondition && form.arrivalTemperature;

  const handleSave = () => { onArrived(form); setDone(true); };

  return (
    <FormSheet
      open onClose={onClose}
      title={<span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Mark Arrived — {booking.bookingNumber}</span>}
      description={`${booking.productName} expected ${fmtDate(booking.expectedArrivalDate ?? '')}`}
      footer={!done ? (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" disabled={!canSave} onClick={handleSave}>
            Confirm Arrival
          </Button>
        </div>
      ) : undefined}
    >
      {done ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <CheckCircle2 className="h-14 w-14 text-green-500" />
          <p className="text-lg font-semibold text-foreground">Arrival Confirmed</p>
          <p className="text-sm text-muted-foreground">{booking.bookingNumber} is now active</p>
          <Button variant="outline" className="mt-4" onClick={onClose}>Close</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Actual Entry Date & Time</label>
              <input type="datetime-local" className={FIELD} value={form.entryDateTime} onChange={e => upd('entryDateTime', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Arrival Temp (°C)</label>
              <input type="number" className={FIELD} placeholder="e.g. 4.2" value={form.arrivalTemperature} onChange={e => upd('arrivalTemperature', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Driver Name</label>
              <input className={FIELD} placeholder="Full name" value={form.driverName} onChange={e => upd('driverName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Driver Mobile</label>
              <input type="tel" className={FIELD} placeholder="10-digit" value={form.driverMobile} onChange={e => upd('driverMobile', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Batch / Lot Number</label>
              <input className={FIELD} placeholder="LOT-2026-xxxx" value={form.batchNumber} onChange={e => upd('batchNumber', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Quantity (units)</label>
              <input type="number" min="0" className={FIELD} placeholder="crates / boxes" value={form.quantityUnits} onChange={e => upd('quantityUnits', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Visual Condition</label>
              <select className={FIELD} value={form.visualCondition} onChange={e => upd('visualCondition', e.target.value)}>
                <option value="">Select</option>
                <option>Pass</option>
                <option>Minor Issues</option>
                <option>Fail</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Expiry Date</label>
              <input type="date" className={FIELD} value={form.expiryDate} onChange={e => upd('expiryDate', e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </FormSheet>
  );
}

interface AddBookingSheetProps {
  onClose: () => void;
  onAdd: (form: NewBookingForm) => string;
}

function AddBookingSheet({ onClose, onAdd }: AddBookingSheetProps) {
  const [form, setForm] = useState(emptyForm);
  const [savedId, setSavedId] = useState('');
  const upd = (k: keyof NewBookingForm, v: string) => setForm(p => ({ ...p, [k]: v }));
  const canSave = form.supplierName && form.vehicleNumber && form.productName && form.zoneAssignment && form.quantityWeight;

  const handleSave = () => { setSavedId(onAdd({ ...form, entryDateTime: form.entryDateTime || nowStr() })); };

  return (
    <FormSheet
      open onClose={() => { setSavedId(''); setForm(emptyForm()); onClose(); }}
      title={<span className="flex items-center gap-2"><PackagePlus className="h-4 w-4" />New Booking</span>}
      description="Record stock inward details and assign to a zone."
      footer={!savedId ? (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" disabled={!canSave} onClick={handleSave}>
            Create Booking
          </Button>
        </div>
      ) : undefined}
    >
      {savedId ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <CheckCircle2 className="h-14 w-14 text-green-500" />
          <p className="text-lg font-semibold text-foreground">Booking Created</p>
          <Badge className="text-sm px-4 py-1 bg-green-500/15 text-green-400 border-green-500/30">{savedId}</Badge>
          <Button variant="outline" className="mt-4" onClick={() => { setSavedId(''); setForm(emptyForm()); }}>
            <PackagePlus className="h-4 w-4 mr-2" /> Add Another
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <SectionLabel icon={Truck} label="Vehicle & Supplier" />
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Entry Date & Time</label>
                  <input type="datetime-local" className={FIELD} value={form.entryDateTime} onChange={e => upd('entryDateTime', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Vehicle Number</label>
                  <input className={FIELD} placeholder="TN-01-AB-1234" value={form.vehicleNumber} onChange={e => upd('vehicleNumber', e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Supplier / Vendor Name</label>
                <input className={FIELD} placeholder="e.g. Sharma Agro Pvt. Ltd." value={form.supplierName} onChange={e => upd('supplierName', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Driver Name</label>
                  <input className={FIELD} placeholder="Full name" value={form.driverName} onChange={e => upd('driverName', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Driver Mobile</label>
                  <input type="tel" className={FIELD} placeholder="10-digit" value={form.driverMobile} onChange={e => upd('driverMobile', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <SectionLabel icon={Package} label="Product Details" />
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Product Name</label>
                  <input className={FIELD} placeholder="e.g. Alphonso Mangoes" value={form.productName} onChange={e => upd('productName', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <select className={FIELD} value={form.productCategory} onChange={e => upd('productCategory', e.target.value)}>
                    <option value="">Select</option>
                    {['Fruits', 'Vegetables', 'Dairy', 'Meat & Seafood', 'Pharmaceuticals', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Batch / Lot</label>
                  <input className={FIELD} placeholder="LOT-2026-0001" value={form.batchNumber} onChange={e => upd('batchNumber', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Expiry Date</label>
                  <input type="date" className={FIELD} value={form.expiryDate} onChange={e => upd('expiryDate', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Qty (units)</label>
                  <input type="number" min="0" className={FIELD} placeholder="e.g. 50 crates" value={form.quantityUnits} onChange={e => upd('quantityUnits', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Weight (kg)</label>
                  <input type="number" min="0" className={FIELD} placeholder="e.g. 2500" value={form.quantityWeight} onChange={e => upd('quantityWeight', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Arrival Temp (°C)</label>
                  <input type="number" className={FIELD} placeholder="e.g. 4.2" value={form.arrivalTemperature} onChange={e => upd('arrivalTemperature', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Visual Condition</label>
                  <select className={FIELD} value={form.visualCondition} onChange={e => upd('visualCondition', e.target.value)}>
                    <option value="">Select</option>
                    <option>Pass</option>
                    <option>Minor Issues</option>
                    <option>Fail</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Zone Assignment</label>
                <select className={FIELD} value={form.zoneAssignment} onChange={e => upd('zoneAssignment', e.target.value)}>
                  <option value="">Select zone</option>
                  {['Ambient Zone', 'Chill Zone', 'Frozen Zone', 'Processing Zone'].map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Remarks (optional)</label>
                <textarea rows={2} className={FIELD} placeholder="Any additional notes..." value={form.remarks} onChange={e => upd('remarks', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </FormSheet>
  );
}

interface AddUpcomingSheetProps {
  onClose: () => void;
  onAdd: (form: UpcomingBookingForm) => string;
}

function AddUpcomingSheet({ onClose, onAdd }: AddUpcomingSheetProps) {
  const [form, setForm] = useState(emptyUpcoming);
  const [savedId, setSavedId] = useState('');
  const upd = (k: keyof UpcomingBookingForm, v: string) => setForm(p => ({ ...p, [k]: v }));
  const canSave = form.expectedArrivalDate && form.supplierName && form.productName && form.zoneAssignment && form.quantityWeight;

  const handleSave = () => { setSavedId(onAdd(form)); };

  return (
    <FormSheet
      open onClose={() => { setSavedId(''); setForm(emptyUpcoming()); onClose(); }}
      title={<span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Schedule Upcoming</span>}
      description="Pre-register an expected stock arrival."
      footer={!savedId ? (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" disabled={!canSave} onClick={handleSave}>
            Schedule Booking
          </Button>
        </div>
      ) : undefined}
    >
      {savedId ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <CalendarDays className="h-14 w-14 text-[#02A19E]" />
          <p className="text-lg font-semibold text-foreground">Booking Scheduled</p>
          <Badge className="text-sm px-4 py-1 bg-[#02A19E]/15 text-[#02A19E] border-[#02A19E]/30">{savedId}</Badge>
          <p className="text-xs text-muted-foreground">Expected: {fmtDate(form.expectedArrivalDate)}</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSavedId(''); setForm(emptyUpcoming()); }}>
            Schedule Another
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Expected Arrival Date</label>
            <input type="date" className={FIELD} value={form.expectedArrivalDate} onChange={e => upd('expectedArrivalDate', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Supplier / Vendor Name</label>
            <input className={FIELD} placeholder="e.g. Sharma Agro Pvt. Ltd." value={form.supplierName} onChange={e => upd('supplierName', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Vehicle Number (approx.)</label>
            <input className={FIELD} placeholder="TN-01-AB-1234" value={form.vehicleNumber} onChange={e => upd('vehicleNumber', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Product Name</label>
              <input className={FIELD} placeholder="e.g. Alphonso Mangoes" value={form.productName} onChange={e => upd('productName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select className={FIELD} value={form.productCategory} onChange={e => upd('productCategory', e.target.value)}>
                <option value="">Select</option>
                {['Fruits', 'Vegetables', 'Dairy', 'Meat & Seafood', 'Pharmaceuticals', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Expected Weight (kg)</label>
              <input type="number" min="0" className={FIELD} placeholder="e.g. 2000" value={form.quantityWeight} onChange={e => upd('quantityWeight', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Zone Assignment</label>
              <select className={FIELD} value={form.zoneAssignment} onChange={e => upd('zoneAssignment', e.target.value)}>
                <option value="">Select zone</option>
                {['Ambient Zone', 'Chill Zone', 'Frozen Zone', 'Processing Zone'].map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Remarks (optional)</label>
            <textarea rows={2} className={FIELD} placeholder="Any notes..." value={form.remarks} onChange={e => upd('remarks', e.target.value)} />
          </div>
        </div>
      )}
    </FormSheet>
  );
}

function HistoryDetailSheet({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <FormSheet
      open onClose={onClose}
      title={<span className="flex items-center gap-2"><ClipboardList className="h-4 w-4" />{booking.bookingNumber}</span>}
      description={`${booking.productName} · Fully released`}
      footer={<Button variant="outline" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-5">
        <div>
          <SectionLabel icon={Truck} label="Inward Details" />
          <DetailRow label="Entry Date & Time" value={fmtDT(booking.entryDateTime)} />
          <DetailRow label="Supplier" value={booking.supplierName} />
          <DetailRow label="Vehicle" value={booking.vehicleNumber} />
          <DetailRow label="Product" value={booking.productName} />
          <DetailRow label="Zone" value={booking.zoneAssignment} accent />
          <DetailRow label="Total Weight" value={`${booking.quantityWeight} kg`} />
        </div>
        <div>
          <SectionLabel icon={History} label={`Release Events (${booking.releaseEvents.length})`} />
          <div className="space-y-2">
            {booking.releaseEvents.map((ev, i) => (
              <div key={ev.eventId} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Release {i + 1}</span>
                  <span className="text-xs font-bold text-[#02A19E]">{ev.quantityReleased} kg</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><User className="h-2.5 w-2.5" />{ev.recipientName}</span>
                  <span className="text-muted-foreground">{fmtDT(ev.exitDateTime)}</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Truck className="h-2.5 w-2.5" />{ev.vehicleNumber}</div>
                {ev.remarks && <div className="text-xs text-muted-foreground italic">{ev.remarks}</div>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel icon={CalendarClock} label="Storage Summary" />
          <DetailRow label="Booked On" value={fmtDT(booking.createdAt)} />
          <DetailRow label="Last Release" value={booking.releaseEvents.length > 0 ? fmtDT(booking.releaseEvents[booking.releaseEvents.length - 1].releasedAt) : ''} />
          <DetailRow label="Total Days Stored" value={`${daysStored(booking.createdAt, booking.releaseEvents[booking.releaseEvents.length - 1]?.releasedAt)} days`} accent />
        </div>
      </div>
    </FormSheet>
  );
}

export function BookingsPage() {
  const { bookings, addBooking, addUpcoming, markArrived, addReleaseEvent, remainingKg } = useBookings();
  const [addOpen, setAddOpen] = useState(false);
  const [addUpcomingOpen, setAddUpcomingOpen] = useState(false);
  const [availOpen, setAvailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [arrivedId, setArrivedId] = useState<string | null>(null);

  const upcoming = bookings.filter(b => b.status === 'upcoming');
  const active = bookings.filter(b => b.status === 'active');
  const released = bookings.filter(b => b.status === 'released');

  const selected = bookings.find(b => b.id === selectedId) ?? null;
  const arrivedBooking = bookings.find(b => b.id === arrivedId) ?? null;

  const TH = (h: string) => (
    <th key={h} className="text-left py-2.5 px-4 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap text-xs">{h}</th>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {upcoming.length} upcoming · {active.length} active · {released.length} released
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setAvailOpen(true)}>
            <Search className="h-4 w-4 mr-2" />
            Check Availability
          </Button>
          <Button variant="outline" onClick={() => setAddUpcomingOpen(true)}>
            <CalendarDays className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => setAddOpen(true)}>
            <PackagePlus className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
        </div>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming
            {upcoming.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 min-w-[18px]">
                {upcoming.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="current">
            Current
            {active.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#02A19E]/20 text-[#02A19E] text-[10px] font-bold px-1.5 py-0.5 min-w-[18px]">
                {active.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            History
            {released.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-1.5 py-0.5 min-w-[18px]">
                {released.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16 gap-3">
                <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">No upcoming bookings scheduled</p>
                <Button size="sm" className="mt-2 bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => setAddUpcomingOpen(true)}>
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" /> Schedule Arrival
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Arrivals</CardTitle>
                <CardDescription>Pre-registered stock expected at facility — click Mark Arrived once stock reaches gate</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {['Booking #', 'Product', 'Supplier', 'Zone', 'Exp. Weight', 'Expected On', 'In', ''].map(TH)}
                      </tr>
                    </thead>
                    <tbody>
                      {upcoming.map(b => {
                        const days = daysUntil(b.expectedArrivalDate ?? '');
                        const overdue = days !== null && days < 0;
                        const today = days !== null && days === 0;
                        return (
                          <tr key={b.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono text-amber-400 font-semibold">{b.bookingNumber}</span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-foreground whitespace-nowrap">{b.productName}</p>
                              <p className="text-muted-foreground mt-0.5">{b.productCategory}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-foreground whitespace-nowrap">{b.supplierName}</p>
                              <p className="text-muted-foreground mt-0.5 flex items-center gap-1"><Truck className="h-2.5 w-2.5" />{b.vehicleNumber}</p>
                            </td>
                            <td className="py-3 px-4"><ZonePill zone={b.zoneAssignment} /></td>
                            <td className="py-3 px-4 font-semibold text-foreground">{b.quantityWeight ? `${b.quantityWeight} kg` : '—'}</td>
                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{fmtDate(b.expectedArrivalDate ?? '')}</td>
                            <td className="py-3 px-4">
                              {days !== null && (
                                <Badge
                                  variant={overdue ? 'destructive' : today ? 'warning' : 'default'}
                                  className="text-[10px] whitespace-nowrap"
                                >
                                  {overdue ? `${Math.abs(days)}d overdue` : today ? 'Today' : `${days}d`}
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                size="sm"
                                className="text-xs h-7 bg-[#02A19E] text-white hover:bg-[#02A19E]/90"
                                onClick={() => setArrivedId(b.id)}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Arrived
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="current" className="mt-4">
          {active.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16 gap-3">
                <Package className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">No active bookings</p>
                <Button size="sm" className="mt-2 bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => setAddOpen(true)}>
                  <PackagePlus className="h-3.5 w-3.5 mr-1.5" /> Add First Booking
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Active Stock</CardTitle>
                <CardDescription>Click a row to view details or release stock — partial releases are supported</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {['Booking #', 'Product', 'Supplier', 'Zone', 'Remaining', 'Arrival Temp', 'Entry Date', 'Days Stored', ''].map(TH)}
                      </tr>
                    </thead>
                    <tbody>
                      {active.map(b => {
                        const remaining = remainingKg(b);
                        const pctRemaining = parseFloat(b.quantityWeight) > 0 ? (remaining / parseFloat(b.quantityWeight)) * 100 : 100;
                        const days = daysStored(b.createdAt);
                        const tempNum = parseFloat(b.arrivalTemperature);
                        const tempWarn = !isNaN(tempNum) && tempNum > 8;
                        return (
                          <tr
                            key={b.id}
                            className="border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => setSelectedId(b.id)}
                          >
                            <td className="py-3 px-4">
                              <span className="font-mono text-[#02A19E] font-semibold">{b.bookingNumber}</span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-foreground whitespace-nowrap">{b.productName}</p>
                              <p className="text-muted-foreground mt-0.5">{b.productCategory}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-foreground whitespace-nowrap">{b.supplierName}</p>
                              <p className="text-muted-foreground mt-0.5 flex items-center gap-1"><Truck className="h-2.5 w-2.5" />{b.vehicleNumber}</p>
                            </td>
                            <td className="py-3 px-4"><ZonePill zone={b.zoneAssignment} /></td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-foreground">{remaining} kg</p>
                              <div className="mt-1 h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-[#02A19E] transition-all" style={{ width: `${pctRemaining}%` }} />
                              </div>
                              <p className="text-muted-foreground mt-0.5">{pctRemaining.toFixed(0)}% left</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-semibold flex items-center gap-1 ${tempWarn ? 'text-yellow-400' : 'text-foreground'}`}>
                                <Thermometer className="h-3 w-3" />
                                {b.arrivalTemperature ? `${b.arrivalTemperature}°C` : '—'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{fmtDate(b.createdAt)}</td>
                            <td className="py-3 px-4">
                              <Badge variant={days > 30 ? 'destructive' : days > 14 ? 'warning' : 'default'} className="text-[10px] whitespace-nowrap">
                                {days}d
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button size="sm" variant="outline" className="text-xs h-7 flex items-center gap-1"
                                onClick={e => { e.stopPropagation(); setSelectedId(b.id); }}>
                                View <ChevronRight className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {released.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-16 gap-3">
                <Clock className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">No released bookings yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Released Stock</CardTitle>
                <CardDescription>All bookings that have been fully released from the facility</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {['Booking #', 'Product', 'Supplier', 'Zone', 'Total Weight', 'Releases', 'Entry', 'Last Exit', 'Duration', ''].map(TH)}
                      </tr>
                    </thead>
                    <tbody>
                      {released.map(b => {
                        const lastRelease = b.releaseEvents[b.releaseEvents.length - 1];
                        const days = daysStored(b.createdAt, lastRelease?.releasedAt);
                        return (
                          <tr key={b.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => setSelectedId(b.id)}>
                            <td className="py-3 px-4">
                              <span className="font-mono text-muted-foreground font-semibold">{b.bookingNumber}</span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-foreground whitespace-nowrap">{b.productName}</p>
                              <p className="text-muted-foreground mt-0.5">{b.productCategory}</p>
                            </td>
                            <td className="py-3 px-4 text-foreground whitespace-nowrap">{b.supplierName}</td>
                            <td className="py-3 px-4"><ZonePill zone={b.zoneAssignment} /></td>
                            <td className="py-3 px-4 font-semibold text-foreground">{b.quantityWeight ? `${b.quantityWeight} kg` : '—'}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border text-[10px] font-semibold">
                                <History className="h-2.5 w-2.5" />{b.releaseEvents.length}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{fmtDate(b.createdAt)}</td>
                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{lastRelease ? fmtDate(lastRelease.releasedAt) : '—'}</td>
                            <td className="py-3 px-4">
                              <Badge variant="default" className="text-[10px] whitespace-nowrap bg-muted text-muted-foreground border-border">{days}d</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button size="sm" variant="outline" className="text-xs h-7 flex items-center gap-1"
                                onClick={e => { e.stopPropagation(); setSelectedId(b.id); }}>
                                View <ChevronRight className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Sheet open={availOpen} onOpenChange={setAvailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              Check Availability
            </SheetTitle>
          </SheetHeader>
          <AvailabilityChecker />
        </SheetContent>
      </Sheet>

      {addOpen && <AddBookingSheet onClose={() => setAddOpen(false)} onAdd={addBooking} />}
      {addUpcomingOpen && <AddUpcomingSheet onClose={() => setAddUpcomingOpen(false)} onAdd={addUpcoming} />}

      {arrivedBooking && (
        <MarkArrivedSheet
          booking={arrivedBooking}
          onClose={() => setArrivedId(null)}
          onArrived={details => {
            markArrived(arrivedBooking.id, details);
            setArrivedId(null);
          }}
        />
      )}

      {selected && selected.status === 'active' && (
        <ActiveDetailSheet
          booking={selected}
          remaining={remainingKg(selected)}
          onClose={() => setSelectedId(null)}
          onRelease={event => {
            addReleaseEvent(selected.id, event);
            setSelectedId(null);
          }}
        />
      )}

      {selected && selected.status === 'released' && (
        <HistoryDetailSheet booking={selected} onClose={() => setSelectedId(null)} />
      )}

      {selected && selected.status === 'upcoming' && (
        <FormSheet
          open onClose={() => setSelectedId(null)}
          title={<span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{selected.bookingNumber}</span>}
          description={`Expected ${fmtDate(selected.expectedArrivalDate ?? '')}`}
          footer={
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setSelectedId(null)}>Close</Button>
              <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => { setSelectedId(null); setArrivedId(selected.id); }}>
                <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark Arrived
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            <div>
              <SectionLabel icon={Layers} label="Booking Details" />
              <DetailRow label="Expected Arrival" value={fmtDate(selected.expectedArrivalDate ?? '')} accent />
              <DetailRow label="Supplier" value={selected.supplierName} />
              <DetailRow label="Vehicle" value={selected.vehicleNumber} />
              <DetailRow label="Product" value={selected.productName} />
              <DetailRow label="Category" value={selected.productCategory} />
              <DetailRow label="Expected Weight" value={selected.quantityWeight ? `${selected.quantityWeight} kg` : ''} />
              <DetailRow label="Zone" value={selected.zoneAssignment} accent />
              {selected.remarks && <DetailRow label="Remarks" value={selected.remarks} />}
            </div>
          </div>
        </FormSheet>
      )}
    </div>
  );
}
