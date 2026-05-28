import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@vrushabh-b/oneiot-ui';
import {
  Thermometer, Package, Calendar, CheckCircle2, AlertTriangle,
  XCircle, Info,
} from 'lucide-react';
import { useBookings } from '@/contexts/BookingsContext';
import type { Booking } from '@/contexts/BookingsContext';

interface ZoneDef {
  name: string;
  totalCapacityKg: number;
  tempRange: string;
  color: string;
  pillClass: string;
  categories: string[];
}

const ZONES: ZoneDef[] = [
  {
    name: 'Ambient Zone',
    totalCapacityKg: 400_000,
    tempRange: '10–25°C',
    color: 'bg-orange-500/10 border-orange-500/30',
    pillClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    categories: ['Grains', 'Pulses', 'Dry Goods', 'Other'],
  },
  {
    name: 'Chill Zone',
    totalCapacityKg: 600_000,
    tempRange: '2–8°C',
    color: 'bg-blue-500/10 border-blue-500/30',
    pillClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    categories: ['Fruits', 'Vegetables', 'Dairy', 'Beverages'],
  },
  {
    name: 'Frozen Zone',
    totalCapacityKg: 1_000_000,
    tempRange: '−25 to −18°C',
    color: 'bg-indigo-500/10 border-indigo-500/30',
    pillClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    categories: ['Meat & Seafood', 'Frozen Foods', 'Ice Cream'],
  },
  {
    name: 'Processing Zone',
    totalCapacityKg: 200_000,
    tempRange: 'Variable',
    color: 'bg-purple-500/10 border-purple-500/30',
    pillClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    categories: ['All'],
  },
];

function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function isoToDate(s: string): Date {
  return new Date(s.includes('T') ? s : `${s}T00:00:00`);
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function fmtLong(d: Date): string {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

function occupiedKgOnDate(bookings: Booking[], zoneName: string, date: Date, remainingKg: (b: Booking) => number): number {
  const ymd = toYMD(date);
  return bookings.reduce((sum, b) => {
    if (b.zoneAssignment !== zoneName) return sum;
    if (b.status === 'released') return sum;
    if (b.status === 'active') {
      const expiryYmd = b.expiryDate ? toYMD(isoToDate(b.expiryDate)) : '9999-12-31';
      if (ymd <= expiryYmd) return sum + remainingKg(b);
    }
    if (b.status === 'upcoming' && b.expectedArrivalDate) {
      const arrivalYmd = toYMD(isoToDate(b.expectedArrivalDate));
      if (ymd >= arrivalYmd) return sum + (parseFloat(b.quantityWeight) || 0);
    }
    return sum;
  }, 0);
}

type SlotStatus = 'available' | 'partial' | 'full';

function slotStatus(occupiedKg: number, totalKg: number): SlotStatus {
  const pct = occupiedKg / totalKg;
  if (pct >= 0.95) return 'full';
  if (pct >= 0.65) return 'partial';
  return 'available';
}

const STATUS_CELL: Record<SlotStatus, string> = {
  available: 'bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/25',
  partial:   'bg-yellow-500/15 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/25',
  full:      'bg-destructive/15 border-destructive/30 text-destructive cursor-not-allowed',
};

const STATUS_LABEL: Record<SlotStatus, string> = {
  available: 'Available',
  partial:   'Limited',
  full:      'Full',
};

function PctBar({ pct, status }: { pct: number; status: SlotStatus }) {
  const barColor =
    status === 'available' ? 'bg-green-500' :
    status === 'partial'   ? 'bg-yellow-400' : 'bg-destructive';
  return (
    <div className="h-1 w-full rounded-full bg-muted overflow-hidden mt-1">
      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(100, pct * 100).toFixed(0)}%` }} />
    </div>
  );
}

interface CalendarCellProps {
  date: Date;
  zone: ZoneDef;
  occupiedKg: number;
  isToday: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

function CalendarCell({ date, zone, occupiedKg, isToday, isSelected, onSelect }: CalendarCellProps) {
  const status = slotStatus(occupiedKg, zone.totalCapacityKg);
  const pct = occupiedKg / zone.totalCapacityKg;
  const freeKg = Math.max(0, zone.totalCapacityKg - occupiedKg);
  const freeTonne = (freeKg / 1000).toFixed(0);
  const isFull = status === 'full';

  return (
    <button
      onClick={isFull ? undefined : onSelect}
      className={`w-full rounded-lg border px-2 py-2 text-left transition-all
        ${STATUS_CELL[status]}
        ${isSelected ? 'ring-2 ring-[#02A19E] ring-offset-1 ring-offset-background' : ''}
        ${isToday ? 'font-bold' : ''}`}
    >
      <p className="text-[10px] leading-none mb-1 font-medium">
        {isToday ? 'Today' : fmtShort(date)}
      </p>
      <p className="text-xs font-bold leading-none">{freeTonne}T</p>
      <p className="text-[9px] leading-none opacity-70 mt-0.5">free</p>
      <PctBar pct={pct} status={status} />
    </button>
  );
}

interface CellDetailProps {
  date: Date;
  zone: ZoneDef;
  occupiedKg: number;
  bookingsOnDate: Booking[];
  remainingKg: (b: Booking) => number;
}

function CellDetail({ date, zone, occupiedKg, bookingsOnDate, remainingKg }: CellDetailProps) {
  const freeKg = Math.max(0, zone.totalCapacityKg - occupiedKg);
  const status = slotStatus(occupiedKg, zone.totalCapacityKg);
  const pct = (occupiedKg / zone.totalCapacityKg) * 100;
  const relevantBookings = bookingsOnDate.filter(b => b.zoneAssignment === zone.name && b.status !== 'released');

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${zone.pillClass}`}>
              {zone.name}
            </span>
            <Badge
              variant={status === 'available' ? 'success' : status === 'partial' ? 'warning' : 'destructive'}
              className="text-[10px]"
            >
              {STATUS_LABEL[status]}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-foreground">{fmtLong(date)}</p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <Thermometer className="h-3 w-3" />{zone.tempRange}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{(freeKg / 1000).toFixed(1)}<span className="text-sm font-normal text-muted-foreground ml-1">T free</span></p>
          <p className="text-xs text-muted-foreground">{pct.toFixed(1)}% occupied</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Occupied: {(occupiedKg / 1000).toFixed(1)} T</span>
          <span>Total: {(zone.totalCapacityKg / 1000).toFixed(0)} T</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${status === 'available' ? 'bg-green-500' : status === 'partial' ? 'bg-yellow-400' : 'bg-destructive'}`}
            style={{ width: `${Math.min(100, pct).toFixed(1)}%` }}
          />
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Suitable for</p>
        <div className="flex flex-wrap gap-1.5">
          {zone.categories.map(c => (
            <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
              {c}
            </span>
          ))}
        </div>
      </div>

      {relevantBookings.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Occupying bookings ({relevantBookings.length})
          </p>
          <div className="space-y-1.5">
            {relevantBookings.map(b => {
              const kg = b.status === 'active' ? remainingKg(b) : parseFloat(b.quantityWeight) || 0;
              return (
                <div key={b.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{b.productName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{b.supplierName} · {b.bookingNumber}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-xs font-bold text-foreground">{(kg / 1000).toFixed(1)} T</p>
                    <span className={`text-[9px] font-medium ${b.status === 'upcoming' ? 'text-amber-400' : 'text-[#02A19E]'}`}>
                      {b.status === 'upcoming' ? 'upcoming' : 'active'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {status !== 'full' ? (
        <div className="flex items-start gap-2.5 rounded-lg bg-[#02A19E]/10 border border-[#02A19E]/30 px-3 py-2.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#02A19E] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#02A19E]">
            <span className="font-semibold">{(freeKg / 1000).toFixed(1)} T available</span> in {zone.name} on this date. You can schedule a booking.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5">
          <XCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-xs text-destructive font-medium">This zone is at full capacity on the selected date.</p>
        </div>
      )}
    </div>
  );
}

export function AvailabilityChecker() {
  const { bookings, remainingKg } = useBookings();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayYmd = toYMD(today);
  const maxEndYmd = toYMD(addDays(today, 89));

  const [startYmd, setStartYmd] = useState(todayYmd);
  const [endYmd, setEndYmd] = useState(toYMD(addDays(today, 6)));
  const [selectedCell, setSelectedCell] = useState<{ zone: string; dateYmd: string } | null>(null);
  const [filterZone, setFilterZone] = useState<string>('all');

  const days = useMemo(() => {
    const start = isoToDate(startYmd);
    const end = isoToDate(endYmd);
    const diffDays = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
    const count = Math.min(diffDays + 1, 14);
    return Array.from({ length: count }, (_, i) => addDays(start, i));
  }, [startYmd, endYmd]);

  const visibleZones = filterZone === 'all' ? ZONES : ZONES.filter(z => z.name === filterZone);

  const occupancy = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const zone of ZONES) {
      map[zone.name] = {};
      for (const day of days) {
        map[zone.name][toYMD(day)] = occupiedKgOnDate(bookings, zone.name, day, remainingKg);
      }
    }
    return map;
  }, [bookings, days, remainingKg]);

  const selectedZoneDef = selectedCell ? ZONES.find(z => z.name === selectedCell.zone) : null;
  const selectedDate = selectedCell ? isoToDate(selectedCell.dateYmd) : null;
  const selectedOccupied = selectedCell ? (occupancy[selectedCell.zone]?.[selectedCell.dateYmd] ?? 0) : 0;

  const todaySummary = ZONES.map(z => {
    const occ = occupancy[z.name]?.[todayYmd] ?? 0;
    return { zone: z, freeKg: z.totalCapacityKg - occ, status: slotStatus(occ, z.totalCapacityKg) };
  });

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {todaySummary.map(({ zone, freeKg, status }) => {
          const pct = ((zone.totalCapacityKg - freeKg) / zone.totalCapacityKg) * 100;
          return (
            <button
              key={zone.name}
              onClick={() => {
                setFilterZone(zone.name);
                setSelectedCell({ zone: zone.name, dateYmd: todayYmd });
              }}
              className={`rounded-xl border px-4 py-3.5 text-left transition-all hover:opacity-90 ${zone.color}
                ${filterZone === zone.name ? 'ring-2 ring-[#02A19E] ring-offset-1 ring-offset-background' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-foreground">{zone.name}</p>
                <Badge
                  variant={status === 'available' ? 'success' : status === 'partial' ? 'warning' : 'destructive'}
                  className="text-[9px]"
                >
                  {STATUS_LABEL[status]}
                </Badge>
              </div>
              <p className="text-xl font-bold text-foreground">{(freeKg / 1000).toFixed(0)}<span className="text-xs font-normal text-muted-foreground ml-1">T free</span></p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                <Thermometer className="h-2.5 w-2.5" />
                {zone.tempRange}
              </div>
              <div className="h-1 w-full rounded-full bg-muted/60 overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full ${status === 'available' ? 'bg-green-500' : status === 'partial' ? 'bg-yellow-400' : 'bg-destructive'}`}
                  style={{ width: `${Math.min(100, pct).toFixed(0)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterZone('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
              ${filterZone === 'all'
                ? 'bg-[#02A19E] text-white border-[#02A19E]'
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/60'}`}
          >
            All Zones
          </button>
          {ZONES.map(z => (
            <button
              key={z.name}
              onClick={() => setFilterZone(z.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                ${filterZone === z.name
                  ? 'bg-[#02A19E] text-white border-[#02A19E]'
                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/60'}`}
            >
              {z.name.replace(' Zone', '')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <input
              type="date"
              value={startYmd}
              min={todayYmd}
              max={endYmd}
              onChange={e => {
                setStartYmd(e.target.value);
                setSelectedCell(null);
              }}
              className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">–</span>
            <input
              type="date"
              value={endYmd}
              min={startYmd}
              max={maxEndYmd}
              onChange={e => {
                setEndYmd(e.target.value);
                setSelectedCell(null);
              }}
              className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
            />
          </div>
          <button
            onClick={() => {
              setStartYmd(todayYmd);
              setEndYmd(toYMD(addDays(today, 6)));
              setSelectedCell(null);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-muted text-muted-foreground border-border hover:bg-muted/60 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Availability Calendar
              </CardTitle>
              <CardDescription>Click a cell to view details · Showing {visibleZones.length} zone{visibleZones.length > 1 ? 's' : ''} · {days.length}-day range</CardDescription>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-green-500/50 border border-green-500/70" />Available</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-yellow-400/50 border border-yellow-400/70" />Limited (&gt;65%)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-destructive/50 border border-destructive/70" />Full (&gt;95%)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-36">Zone</th>
                {days.map(d => {
                  const ymd = toYMD(d);
                  const isToday = ymd === todayYmd;
                  return (
                    <th key={ymd} className={`py-2.5 px-2 text-center text-xs font-medium ${isToday ? 'text-[#02A19E] font-bold' : 'text-muted-foreground'}`}>
                      <span className="block">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                      <span className={`block text-sm ${isToday ? 'text-[#02A19E]' : 'text-foreground'}`}>
                        {d.getDate()}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visibleZones.map(zone => (
                <tr key={zone.name} className="border-b border-border/50 last:border-0">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${zone.pillClass}`}>
                      {zone.name}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-0.5">
                      <Thermometer className="h-2.5 w-2.5" />{zone.tempRange}
                    </p>
                  </td>
                  {days.map(d => {
                    const ymd = toYMD(d);
                    const occ = occupancy[zone.name]?.[ymd] ?? 0;
                    const isSelected = selectedCell?.zone === zone.name && selectedCell.dateYmd === ymd;
                    return (
                      <td key={ymd} className="py-2 px-1.5">
                        <CalendarCell
                          date={d}
                          zone={zone}
                          occupiedKg={occ}
                          isToday={ymd === todayYmd}
                          isSelected={isSelected}
                          onSelect={() => setSelectedCell({ zone: zone.name, dateYmd: ymd })}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedCell && selectedZoneDef && selectedDate ? (
        <CellDetail
          date={selectedDate}
          zone={selectedZoneDef}
          occupiedKg={selectedOccupied}
          bookingsOnDate={bookings}
          remainingKg={remainingKg}
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
          <Info className="h-4 w-4 flex-shrink-0 text-[#02A19E]" />
          Select any cell in the calendar above to view detailed availability, occupied capacity, and which bookings are using the zone on that day.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              Today's Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ZONES.map(zone => {
                const occ = occupancy[zone.name]?.[todayYmd] ?? 0;
                const freePct = ((zone.totalCapacityKg - occ) / zone.totalCapacityKg) * 100;
                const st = slotStatus(occ, zone.totalCapacityKg);
                return (
                  <div key={zone.name} className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium w-24 flex-shrink-0 ${zone.pillClass.split(' ')[1]}`}>
                      {zone.name.replace(' Zone', '')}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${st === 'available' ? 'bg-green-500' : st === 'partial' ? 'bg-yellow-400' : 'bg-destructive'}`}
                        style={{ width: `${Math.min(100, (occ / zone.totalCapacityKg) * 100).toFixed(0)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-12 text-right flex-shrink-0">{freePct.toFixed(0)}% free</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                Best Days in Range
              </CardTitle>
              <CardDescription className="text-xs">Highest total free capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {days
                .map(d => {
                  const totalFree = ZONES.reduce((sum, z) => {
                    const occ = occupancy[z.name]?.[toYMD(d)] ?? 0;
                    return sum + Math.max(0, z.totalCapacityKg - occ);
                  }, 0);
                  return { d, totalFree };
                })
                .sort((a, b) => b.totalFree - a.totalFree)
                .slice(0, 3)
                .map(({ d, totalFree }, i) => (
                  <div key={toYMD(d)} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        i === 0 ? 'bg-green-500/20 text-green-400' :
                        i === 1 ? 'bg-[#02A19E]/20 text-[#02A19E]' :
                        'bg-muted text-muted-foreground'
                      }`}>{i + 1}</span>
                      <span className="text-xs text-foreground">{fmtLong(d)}</span>
                    </div>
                    <span className="text-xs font-semibold text-green-400">{(totalFree / 1000).toFixed(0)} T free</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Capacity Alerts
            </CardTitle>
            <CardDescription className="text-xs">Zones nearing capacity in selected range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {(() => {
                const alerts: Array<{ zone: ZoneDef; day: Date; pct: number }> = [];
                for (const zone of ZONES) {
                  for (const d of days) {
                    const occ = occupancy[zone.name]?.[toYMD(d)] ?? 0;
                    const pct = occ / zone.totalCapacityKg;
                    if (pct >= 0.65) alerts.push({ zone, day: d, pct });
                  }
                }
                if (alerts.length === 0) {
                  return (
                    <div className="flex items-center gap-2 py-2 text-xs text-green-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      No capacity alerts this week
                    </div>
                  );
                }
                return alerts.slice(0, 4).map(({ zone, day, pct }, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-[10px] font-medium flex-shrink-0 ${zone.pillClass.split(' ')[1]}`}>
                        {zone.name.replace(' Zone', '')}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">{fmtShort(day)}</span>
                    </div>
                    <Badge variant={pct >= 0.95 ? 'destructive' : 'warning'} className="text-[9px] flex-shrink-0">
                      {(pct * 100).toFixed(0)}%
                    </Badge>
                  </div>
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
