import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@vrushabh-b/oneiot-ui';
import { FileText, PackagePlus, PackageMinus, ClipboardCheck, ShieldCheck, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';

type ReportTab = 'stock-entry' | 'stock-exit' | 'inspection' | 'compliance';

interface StockEntryRecord {
  entryNumber: string;
  entryDateTime: string;
  supplierName: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  productCategory: string;
  productName: string;
  batchNumber: string;
  quantityUnits: string;
  quantityWeight: string;
  manufacturingDate: string;
  expiryDate: string;
  arrivalTemperature: string;
  visualCondition: string;
  zoneAssignment: string;
  fssaiLicense: string;
  coldChainContinuity: string;
  inspectionOfficer: string;
  inspectionNotes: string;
  submittedAt: string;
}

interface StockExitRecord {
  exitNumber: string;
  exitDateTime: string;
  selectedEntryId: string;
  releaseUnits: string;
  releaseWeight: string;
  destinationName: string;
  destinationAddress: string;
  transporterName: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  dispatchReason: string;
  dispatchTemperature: string;
  physicalCondition: string;
  coldChainAtDispatch: string;
  sealNumber: string;
  fssaiTransitDoc: string;
  inspectionOfficer: string;
  finalRemarks: string;
  submittedAt: string;
}

interface InspectionRecord {
  inspectionRef: string;
  inspectionDate: string;
  stockEntryId: string;
  productName: string;
  zoneId: string;
  currentTemperature: string;
  targetTemperature: string;
  currentHumidity: string;
  temperatureExcursion: string;
  productCondition: string;
  anyDamage: string;
  fssaiComplianceStatus: string;
  whoComplianceStatus: string;
  pestHygieneCheck: string;
  coldChainStatus: string;
  doorStatus: string;
  inspectionOfficer: string;
  nextInspectionDate: string;
  notes: string;
  submittedAt: string;
}

const SAMPLE_ENTRY: StockEntryRecord = {
  entryNumber: 'GE-2025-4821',
  entryDateTime: '2025-05-20T08:30',
  supplierName: 'Sharma Agro Pvt. Ltd.',
  vehicleNumber: 'TN-01-AB-1234',
  driverName: 'Ravi Kumar',
  driverMobile: '9876543210',
  productCategory: 'Fruits',
  productName: 'Alphonso Mangoes',
  batchNumber: 'LOT-2025-0451',
  quantityUnits: '60',
  quantityWeight: '2400',
  manufacturingDate: '2025-05-18',
  expiryDate: '2025-05-30',
  arrivalTemperature: '5.2',
  visualCondition: 'Pass',
  zoneAssignment: 'Chill Zone',
  fssaiLicense: '10016011000246',
  coldChainContinuity: 'Maintained',
  inspectionOfficer: 'Priya Nair',
  inspectionNotes: 'All crates sealed. No damage observed.',
  submittedAt: '2025-05-20T08:45:00.000Z',
};

const SAMPLE_EXIT: StockExitRecord = {
  exitNumber: 'EX-2025-3301',
  exitDateTime: '2025-05-22T14:00',
  selectedEntryId: 'SE-1716201900000',
  releaseUnits: '30',
  releaseWeight: '1200',
  destinationName: 'FreshMart Retail Pvt. Ltd.',
  destinationAddress: '12, Anna Salai, Chennai — 600002',
  transporterName: 'BlueDart Cold Chain',
  vehicleNumber: 'TN-09-XY-8821',
  driverName: 'Suresh Babu',
  driverMobile: '9123456780',
  dispatchReason: 'Sale',
  dispatchTemperature: '4.8',
  physicalCondition: 'Good',
  coldChainAtDispatch: 'Maintained',
  sealNumber: 'SEAL-20250522-007',
  fssaiTransitDoc: 'TRN-FSSAI-2025-0814',
  inspectionOfficer: 'Anand Krishnan',
  finalRemarks: 'Reefer truck pre-cooled to 4°C. Stock handed over in good condition.',
  submittedAt: '2025-05-22T14:15:00.000Z',
};

const SAMPLE_INSPECTION: InspectionRecord = {
  inspectionRef: 'INS-2025-7741',
  inspectionDate: '2025-05-21T10:00',
  stockEntryId: 'SE-1716201900000',
  productName: 'Alphonso Mangoes',
  zoneId: 'Chill Zone',
  currentTemperature: '4.3',
  targetTemperature: '4.0',
  currentHumidity: '87',
  temperatureExcursion: 'No Excursion',
  productCondition: 'Good — No Issues',
  anyDamage: 'None',
  fssaiComplianceStatus: 'Compliant',
  whoComplianceStatus: 'Compliant',
  pestHygieneCheck: 'Pass — No Issues',
  coldChainStatus: 'Maintained',
  doorStatus: 'All Closed',
  inspectionOfficer: 'Priya Nair',
  nextInspectionDate: '2025-05-24',
  notes: 'Stock in excellent condition. Humidity slightly above target — monitoring.',
  submittedAt: '2025-05-21T10:20:00.000Z',
};

function isPass(val: string) {
  return ['Compliant', 'Maintained', 'Pass — No Issues', 'No Excursion', 'Good — No Issues', 'Pass', 'Good'].includes(val);
}
function isWarn(val: string) {
  return val.toLowerCase().includes('minor') || val.toLowerCase().includes('advisory');
}
function isFail(val: string) {
  return !!val && !isPass(val) && !isWarn(val);
}

function complianceBadge(val: string) {
  if (!val) return <Badge variant="outline" className="text-muted-foreground">—</Badge>;
  if (isPass(val)) return <Badge className="bg-green-500/15 text-green-400 border-green-500/30">{val}</Badge>;
  if (isWarn(val)) return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30">{val}</Badge>;
  return <Badge className="bg-red-500/15 text-red-400 border-red-500/30">{val}</Badge>;
}

function fmt(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function pct(num: number, den: number) {
  if (den === 0) return '—';
  return `${Math.round((num / den) * 100)}%`;
}

interface ComplianceRow {
  ref: string;
  date: string;
  workflow: string;
  entity: string;
  check: string;
  status: string;
  officer: string;
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground font-medium">{value || '—'}</p>
    </div>
  );
}

function SampleBanner({ children, open, onToggle }: { children: React.ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-[#02A19E]/50 bg-[#02A19E]/5">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#02A19E] hover:bg-[#02A19E]/5 transition-colors rounded-xl"
      >
        <FlaskConical className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left">Sample Record — see what a completed report looks like</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('stock-entry');
  const [sampleOpen, setSampleOpen] = useState<ReportTab | null>(null);

  const toggleSample = (t: ReportTab) => setSampleOpen(p => p === t ? null : t);

  const entries: StockEntryRecord[] = JSON.parse(localStorage.getItem('stockEntries') ?? '[]') as StockEntryRecord[];
  const exits: StockExitRecord[] = JSON.parse(localStorage.getItem('stockExits') ?? '[]') as StockExitRecord[];
  const inspections: InspectionRecord[] = JSON.parse(localStorage.getItem('inspections') ?? '[]') as InspectionRecord[];

  const complianceRows: ComplianceRow[] = [
    ...entries.flatMap(e => [
      { ref: e.entryNumber, date: e.entryDateTime, workflow: 'Stock Entry', entity: e.productName || e.supplierName, check: 'Cold Chain on Arrival', status: e.coldChainContinuity, officer: e.inspectionOfficer },
      { ref: e.entryNumber, date: e.entryDateTime, workflow: 'Stock Entry', entity: e.productName || e.supplierName, check: 'Visual Condition', status: e.visualCondition, officer: e.inspectionOfficer },
    ]),
    ...exits.flatMap(e => [
      { ref: e.exitNumber, date: e.exitDateTime, workflow: 'Stock Exit', entity: e.destinationName, check: 'Cold Chain at Dispatch', status: e.coldChainAtDispatch, officer: e.inspectionOfficer },
      { ref: e.exitNumber, date: e.exitDateTime, workflow: 'Stock Exit', entity: e.destinationName, check: 'Physical Condition', status: e.physicalCondition, officer: e.inspectionOfficer },
    ]),
    ...inspections.flatMap(i => [
      { ref: i.inspectionRef, date: i.inspectionDate, workflow: 'Inspection', entity: i.productName, check: 'FSSAI', status: i.fssaiComplianceStatus, officer: i.inspectionOfficer },
      { ref: i.inspectionRef, date: i.inspectionDate, workflow: 'Inspection', entity: i.productName, check: 'WHO Cold Chain', status: i.whoComplianceStatus, officer: i.inspectionOfficer },
      { ref: i.inspectionRef, date: i.inspectionDate, workflow: 'Inspection', entity: i.productName, check: 'Temp Excursion', status: i.temperatureExcursion, officer: i.inspectionOfficer },
      { ref: i.inspectionRef, date: i.inspectionDate, workflow: 'Inspection', entity: i.productName, check: 'Pest / Hygiene', status: i.pestHygieneCheck, officer: i.inspectionOfficer },
      { ref: i.inspectionRef, date: i.inspectionDate, workflow: 'Inspection', entity: i.productName, check: 'Product Condition', status: i.productCondition, officer: i.inspectionOfficer },
    ]),
  ].filter(r => r.status);

  const totalChecks = complianceRows.length;
  const passed = complianceRows.filter(r => isPass(r.status)).length;
  const warned = complianceRows.filter(r => isWarn(r.status)).length;
  const failed = complianceRows.filter(r => isFail(r.status)).length;
  const failedRows = complianceRows.filter(r => isFail(r.status));
  const warnRows = complianceRows.filter(r => isWarn(r.status));

  const SAMPLE_COMPLIANCE_ROWS: ComplianceRow[] = [
    { ref: SAMPLE_ENTRY.entryNumber, date: SAMPLE_ENTRY.entryDateTime, workflow: 'Stock Entry', entity: SAMPLE_ENTRY.productName, check: 'Cold Chain on Arrival', status: SAMPLE_ENTRY.coldChainContinuity, officer: SAMPLE_ENTRY.inspectionOfficer },
    { ref: SAMPLE_ENTRY.entryNumber, date: SAMPLE_ENTRY.entryDateTime, workflow: 'Stock Entry', entity: SAMPLE_ENTRY.productName, check: 'Visual Condition', status: SAMPLE_ENTRY.visualCondition, officer: SAMPLE_ENTRY.inspectionOfficer },
    { ref: SAMPLE_EXIT.exitNumber, date: SAMPLE_EXIT.exitDateTime, workflow: 'Stock Exit', entity: SAMPLE_EXIT.destinationName, check: 'Cold Chain at Dispatch', status: SAMPLE_EXIT.coldChainAtDispatch, officer: SAMPLE_EXIT.inspectionOfficer },
    { ref: SAMPLE_EXIT.exitNumber, date: SAMPLE_EXIT.exitDateTime, workflow: 'Stock Exit', entity: SAMPLE_EXIT.destinationName, check: 'Physical Condition', status: SAMPLE_EXIT.physicalCondition, officer: SAMPLE_EXIT.inspectionOfficer },
    { ref: SAMPLE_INSPECTION.inspectionRef, date: SAMPLE_INSPECTION.inspectionDate, workflow: 'Inspection', entity: SAMPLE_INSPECTION.productName, check: 'FSSAI', status: SAMPLE_INSPECTION.fssaiComplianceStatus, officer: SAMPLE_INSPECTION.inspectionOfficer },
    { ref: SAMPLE_INSPECTION.inspectionRef, date: SAMPLE_INSPECTION.inspectionDate, workflow: 'Inspection', entity: SAMPLE_INSPECTION.productName, check: 'WHO Cold Chain', status: SAMPLE_INSPECTION.whoComplianceStatus, officer: SAMPLE_INSPECTION.inspectionOfficer },
    { ref: SAMPLE_INSPECTION.inspectionRef, date: SAMPLE_INSPECTION.inspectionDate, workflow: 'Inspection', entity: SAMPLE_INSPECTION.productName, check: 'Temp Excursion', status: SAMPLE_INSPECTION.temperatureExcursion, officer: SAMPLE_INSPECTION.inspectionOfficer },
    { ref: SAMPLE_INSPECTION.inspectionRef, date: SAMPLE_INSPECTION.inspectionDate, workflow: 'Inspection', entity: SAMPLE_INSPECTION.productName, check: 'Pest / Hygiene', status: SAMPLE_INSPECTION.pestHygieneCheck, officer: SAMPLE_INSPECTION.inspectionOfficer },
    { ref: SAMPLE_INSPECTION.inspectionRef, date: SAMPLE_INSPECTION.inspectionDate, workflow: 'Inspection', entity: SAMPLE_INSPECTION.productName, check: 'Product Condition', status: SAMPLE_INSPECTION.productCondition, officer: SAMPLE_INSPECTION.inspectionOfficer },
  ];

  const tabs: { id: ReportTab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'stock-entry', label: 'Stock Entry', icon: <PackagePlus className="h-4 w-4" />, count: entries.length },
    { id: 'stock-exit', label: 'Stock Exit', icon: <PackageMinus className="h-4 w-4" />, count: exits.length },
    { id: 'inspection', label: 'Inspections', icon: <ClipboardCheck className="h-4 w-4" />, count: inspections.length },
    { id: 'compliance', label: 'Compliance', icon: <ShieldCheck className="h-4 w-4" />, count: failed + warned },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">FSSAI + WHO compliance records across all workflows</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
          <FileText className="h-4 w-4" />
          Print / Export
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors',
              tab === t.id
                ? 'bg-[#02A19E] text-white border-[#02A19E]'
                : 'bg-muted text-muted-foreground border-border hover:text-foreground',
            ].join(' ')}
          >
            {t.icon}
            {t.label}
            <span className={[
              'ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold',
              tab === t.id
                ? 'bg-white/20 text-white'
                : t.id === 'compliance' && t.count > 0
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-border text-foreground',
            ].join(' ')}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === 'stock-entry' && (
        <div className="space-y-4">
          <SampleBanner open={sampleOpen === 'stock-entry'} onToggle={() => toggleSample('stock-entry')}>
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Step 1 — Gate Entry</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Field label="Gate Entry Number" value={SAMPLE_ENTRY.entryNumber} />
                  <Field label="Entry Date & Time" value={fmt(SAMPLE_ENTRY.entryDateTime)} />
                  <Field label="Supplier / Vendor" value={SAMPLE_ENTRY.supplierName} />
                  <Field label="Vehicle Number" value={SAMPLE_ENTRY.vehicleNumber} />
                  <Field label="Driver Name" value={SAMPLE_ENTRY.driverName} />
                  <Field label="Driver Mobile" value={SAMPLE_ENTRY.driverMobile} />
                  <Field label="Product Category" value={SAMPLE_ENTRY.productCategory} />
                  <Field label="Remarks" value={SAMPLE_ENTRY.inspectionNotes} />
                </div>
              </div>
              <div className="border-t border-border/50 pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Step 2 — Inward Inspection</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Field label="Product Name" value={SAMPLE_ENTRY.productName} />
                  <Field label="Batch / Lot Number" value={SAMPLE_ENTRY.batchNumber} />
                  <Field label="Quantity (units)" value={SAMPLE_ENTRY.quantityUnits} />
                  <Field label="Weight (kg)" value={SAMPLE_ENTRY.quantityWeight} />
                  <Field label="Mfg Date" value={fmtDate(SAMPLE_ENTRY.manufacturingDate)} />
                  <Field label="Expiry Date" value={fmtDate(SAMPLE_ENTRY.expiryDate)} />
                  <Field label="Arrival Temperature" value={`${SAMPLE_ENTRY.arrivalTemperature}°C`} />
                  <Field label="Zone Assignment" value={SAMPLE_ENTRY.zoneAssignment} />
                  <Field label="FSSAI License" value={SAMPLE_ENTRY.fssaiLicense} />
                  <Field label="Inspection Officer" value={SAMPLE_ENTRY.inspectionOfficer} />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Cold Chain</p>
                    {complianceBadge(SAMPLE_ENTRY.coldChainContinuity)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Visual Condition</p>
                    {complianceBadge(SAMPLE_ENTRY.visualCondition)}
                  </div>
                </div>
              </div>
            </div>
          </SampleBanner>

          <Card>
            <CardHeader>
              <CardTitle>Stock Entry Records</CardTitle>
              <CardDescription>Inward gate entry and FSSAI inspection log</CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                  <PackagePlus className="h-10 w-10 opacity-30" />
                  <p className="text-sm">No stock entry records yet. Complete a Stock Entry to see data here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                        <th className="text-left py-2 pr-4 font-medium">Entry #</th>
                        <th className="text-left py-2 pr-4 font-medium">Date</th>
                        <th className="text-left py-2 pr-4 font-medium">Supplier</th>
                        <th className="text-left py-2 pr-4 font-medium">Product</th>
                        <th className="text-left py-2 pr-4 font-medium">Batch</th>
                        <th className="text-left py-2 pr-4 font-medium">Weight (kg)</th>
                        <th className="text-left py-2 pr-4 font-medium">Zone</th>
                        <th className="text-left py-2 pr-4 font-medium">Arrival Temp</th>
                        <th className="text-left py-2 pr-4 font-medium">Cold Chain</th>
                        <th className="text-left py-2 pr-4 font-medium">FSSAI Lic.</th>
                        <th className="text-left py-2 pr-4 font-medium">Condition</th>
                        <th className="text-left py-2 pr-4 font-medium">Officer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...entries].reverse().map((e, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                          <td className="py-2 pr-4 font-mono text-xs text-[#02A19E]">{e.entryNumber || '—'}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">{fmt(e.entryDateTime)}</td>
                          <td className="py-2 pr-4">{e.supplierName || '—'}</td>
                          <td className="py-2 pr-4">{e.productName || '—'}</td>
                          <td className="py-2 pr-4 font-mono text-xs">{e.batchNumber || '—'}</td>
                          <td className="py-2 pr-4">{e.quantityWeight || '—'}</td>
                          <td className="py-2 pr-4">{e.zoneAssignment || '—'}</td>
                          <td className="py-2 pr-4">{e.arrivalTemperature ? `${e.arrivalTemperature}°C` : '—'}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.coldChainContinuity)}</td>
                          <td className="py-2 pr-4 font-mono text-xs">{e.fssaiLicense || '—'}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.visualCondition)}</td>
                          <td className="py-2 pr-4">{e.inspectionOfficer || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'stock-exit' && (
        <div className="space-y-4">
          <SampleBanner open={sampleOpen === 'stock-exit'} onToggle={() => toggleSample('stock-exit')}>
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Step 1 — Outward Request</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Field label="Exit Reference" value={SAMPLE_EXIT.exitNumber} />
                  <Field label="Exit Date & Time" value={fmt(SAMPLE_EXIT.exitDateTime)} />
                  <Field label="Linked Entry ID" value={SAMPLE_EXIT.selectedEntryId} />
                  <Field label="Dispatch Reason" value={SAMPLE_EXIT.dispatchReason} />
                  <Field label="Release Units" value={SAMPLE_EXIT.releaseUnits} />
                  <Field label="Release Weight (kg)" value={SAMPLE_EXIT.releaseWeight} />
                  <Field label="Destination / Consignee" value={SAMPLE_EXIT.destinationName} />
                  <Field label="Transporter" value={SAMPLE_EXIT.transporterName} />
                  <Field label="Vehicle Number" value={SAMPLE_EXIT.vehicleNumber} />
                  <Field label="Driver" value={SAMPLE_EXIT.driverName} />
                  <Field label="Driver Mobile" value={SAMPLE_EXIT.driverMobile} />
                  <Field label="Destination Address" value={SAMPLE_EXIT.destinationAddress} />
                </div>
              </div>
              <div className="border-t border-border/50 pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Step 2 — Dispatch Confirmation</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Field label="Dispatch Temperature" value={`${SAMPLE_EXIT.dispatchTemperature}°C`} />
                  <Field label="Seal Number" value={SAMPLE_EXIT.sealNumber} />
                  <Field label="FSSAI Transit Doc" value={SAMPLE_EXIT.fssaiTransitDoc} />
                  <Field label="Inspection Officer" value={SAMPLE_EXIT.inspectionOfficer} />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Physical Condition</p>
                    {complianceBadge(SAMPLE_EXIT.physicalCondition)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Cold Chain at Dispatch</p>
                    {complianceBadge(SAMPLE_EXIT.coldChainAtDispatch)}
                  </div>
                  <Field label="Final Remarks" value={SAMPLE_EXIT.finalRemarks} />
                </div>
              </div>
            </div>
          </SampleBanner>

          <Card>
            <CardHeader>
              <CardTitle>Stock Exit Records</CardTitle>
              <CardDescription>Outward dispatch and cold chain handover log</CardDescription>
            </CardHeader>
            <CardContent>
              {exits.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                  <PackageMinus className="h-10 w-10 opacity-30" />
                  <p className="text-sm">No stock exit records yet. Complete a Stock Exit to see data here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                        <th className="text-left py-2 pr-4 font-medium">Exit Ref</th>
                        <th className="text-left py-2 pr-4 font-medium">Dispatched At</th>
                        <th className="text-left py-2 pr-4 font-medium">Entry ID</th>
                        <th className="text-left py-2 pr-4 font-medium">Destination</th>
                        <th className="text-left py-2 pr-4 font-medium">Transporter</th>
                        <th className="text-left py-2 pr-4 font-medium">Vehicle</th>
                        <th className="text-left py-2 pr-4 font-medium">Qty (kg)</th>
                        <th className="text-left py-2 pr-4 font-medium">Dispatch Temp</th>
                        <th className="text-left py-2 pr-4 font-medium">Cold Chain</th>
                        <th className="text-left py-2 pr-4 font-medium">Condition</th>
                        <th className="text-left py-2 pr-4 font-medium">Reason</th>
                        <th className="text-left py-2 pr-4 font-medium">Officer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...exits].reverse().map((e, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                          <td className="py-2 pr-4 font-mono text-xs text-[#02A19E]">{e.exitNumber || '—'}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">{fmt(e.exitDateTime ?? e.submittedAt)}</td>
                          <td className="py-2 pr-4 font-mono text-xs">{e.selectedEntryId || '—'}</td>
                          <td className="py-2 pr-4">{e.destinationName || '—'}</td>
                          <td className="py-2 pr-4">{e.transporterName || '—'}</td>
                          <td className="py-2 pr-4">{e.vehicleNumber || '—'}</td>
                          <td className="py-2 pr-4">{e.releaseWeight || '—'}</td>
                          <td className="py-2 pr-4">{e.dispatchTemperature ? `${e.dispatchTemperature}°C` : '—'}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.coldChainAtDispatch)}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.physicalCondition)}</td>
                          <td className="py-2 pr-4">{e.dispatchReason || '—'}</td>
                          <td className="py-2 pr-4">{e.inspectionOfficer || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'inspection' && (
        <div className="space-y-4">
          <SampleBanner open={sampleOpen === 'inspection'} onToggle={() => toggleSample('inspection')}>
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Inspection Details</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Field label="Inspection Reference" value={SAMPLE_INSPECTION.inspectionRef} />
                  <Field label="Inspection Date" value={fmt(SAMPLE_INSPECTION.inspectionDate)} />
                  <Field label="Linked Entry ID" value={SAMPLE_INSPECTION.stockEntryId} />
                  <Field label="Product Name" value={SAMPLE_INSPECTION.productName} />
                  <Field label="Zone" value={SAMPLE_INSPECTION.zoneId} />
                  <Field label="Current Temp (°C)" value={SAMPLE_INSPECTION.currentTemperature} />
                  <Field label="Target Temp (°C)" value={SAMPLE_INSPECTION.targetTemperature} />
                  <Field label="Humidity (%)" value={SAMPLE_INSPECTION.currentHumidity} />
                  <Field label="Door Status" value={SAMPLE_INSPECTION.doorStatus} />
                  <Field label="Cold Chain" value={SAMPLE_INSPECTION.coldChainStatus} />
                  <Field label="Inspection Officer" value={SAMPLE_INSPECTION.inspectionOfficer} />
                  <Field label="Next Inspection" value={fmtDate(SAMPLE_INSPECTION.nextInspectionDate)} />
                </div>
              </div>
              <div className="border-t border-border/50 pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Compliance Checks</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Temp Excursion</p>
                    {complianceBadge(SAMPLE_INSPECTION.temperatureExcursion)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Product Condition</p>
                    {complianceBadge(SAMPLE_INSPECTION.productCondition)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">FSSAI</p>
                    {complianceBadge(SAMPLE_INSPECTION.fssaiComplianceStatus)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">WHO Cold Chain</p>
                    {complianceBadge(SAMPLE_INSPECTION.whoComplianceStatus)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">Pest / Hygiene</p>
                    {complianceBadge(SAMPLE_INSPECTION.pestHygieneCheck)}
                  </div>
                </div>
                {SAMPLE_INSPECTION.notes && (
                  <div className="mt-3">
                    <Field label="Notes" value={SAMPLE_INSPECTION.notes} />
                  </div>
                )}
              </div>
            </div>
          </SampleBanner>

          <Card>
            <CardHeader>
              <CardTitle>Periodic Inspection Records</CardTitle>
              <CardDescription>FSSAI + WHO cold chain compliance checks during storage</CardDescription>
            </CardHeader>
            <CardContent>
              {inspections.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                  <ClipboardCheck className="h-10 w-10 opacity-30" />
                  <p className="text-sm">No inspection records yet. Complete a Periodic Inspection to see data here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                        <th className="text-left py-2 pr-4 font-medium">Ref</th>
                        <th className="text-left py-2 pr-4 font-medium">Inspected</th>
                        <th className="text-left py-2 pr-4 font-medium">Entry ID</th>
                        <th className="text-left py-2 pr-4 font-medium">Product</th>
                        <th className="text-left py-2 pr-4 font-medium">Zone</th>
                        <th className="text-left py-2 pr-4 font-medium">Temp (°C)</th>
                        <th className="text-left py-2 pr-4 font-medium">Humidity (%)</th>
                        <th className="text-left py-2 pr-4 font-medium">Excursion</th>
                        <th className="text-left py-2 pr-4 font-medium">Condition</th>
                        <th className="text-left py-2 pr-4 font-medium">FSSAI</th>
                        <th className="text-left py-2 pr-4 font-medium">WHO</th>
                        <th className="text-left py-2 pr-4 font-medium">Pest</th>
                        <th className="text-left py-2 pr-4 font-medium">Next</th>
                        <th className="text-left py-2 pr-4 font-medium">Officer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...inspections].reverse().map((e, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                          <td className="py-2 pr-4 font-mono text-xs text-[#02A19E]">{e.inspectionRef || '—'}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">{fmt(e.inspectionDate)}</td>
                          <td className="py-2 pr-4 font-mono text-xs">{e.stockEntryId || '—'}</td>
                          <td className="py-2 pr-4">{e.productName || '—'}</td>
                          <td className="py-2 pr-4">{e.zoneId || '—'}</td>
                          <td className="py-2 pr-4">{e.currentTemperature ? `${e.currentTemperature} / ${e.targetTemperature}` : '—'}</td>
                          <td className="py-2 pr-4">{e.currentHumidity || '—'}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.temperatureExcursion)}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.productCondition)}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.fssaiComplianceStatus)}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.whoComplianceStatus)}</td>
                          <td className="py-2 pr-4">{complianceBadge(e.pestHygieneCheck)}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">{fmtDate(e.nextInspectionDate)}</td>
                          <td className="py-2 pr-4">{e.inspectionOfficer || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'compliance' && (
        <div className="space-y-6">
          <SampleBanner open={sampleOpen === 'compliance'} onToggle={() => toggleSample('compliance')}>
            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                What gets checked — one record expands into multiple compliance checks
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                      <th className="text-left py-2 pr-4 font-medium">Ref</th>
                      <th className="text-left py-2 pr-4 font-medium">Date</th>
                      <th className="text-left py-2 pr-4 font-medium">Workflow</th>
                      <th className="text-left py-2 pr-4 font-medium">Product / Entity</th>
                      <th className="text-left py-2 pr-4 font-medium">Check</th>
                      <th className="text-left py-2 pr-4 font-medium">Status</th>
                      <th className="text-left py-2 pr-4 font-medium">Officer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_COMPLIANCE_ROWS.map((r, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                        <td className="py-2 pr-4 font-mono text-xs text-[#02A19E]">{r.ref}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{fmt(r.date)}</td>
                        <td className="py-2 pr-4"><Badge variant="outline" className="text-xs">{r.workflow}</Badge></td>
                        <td className="py-2 pr-4">{r.entity}</td>
                        <td className="py-2 pr-4 font-medium">{r.check}</td>
                        <td className="py-2 pr-4">{complianceBadge(r.status)}</td>
                        <td className="py-2 pr-4">{r.officer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SampleBanner>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Checks" value={String(totalChecks)} sub="across all workflows" color="text-foreground" />
            <StatCard label="Passed" value={String(passed)} sub={pct(passed, totalChecks)} color="text-green-400" />
            <StatCard label="Advisory / Minor" value={String(warned)} sub={pct(warned, totalChecks)} color="text-amber-400" />
            <StatCard label="Failed / Non-Compliant" value={String(failed)} sub={pct(failed, totalChecks)} color="text-red-400" />
          </div>

          {totalChecks === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                <ShieldCheck className="h-10 w-10 opacity-30" />
                <p className="text-sm">No compliance data yet. Complete workflows to see results here.</p>
              </CardContent>
            </Card>
          )}

          {failedRows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <ShieldCheck className="h-4 w-4" />
                  Non-Compliant Checks ({failedRows.length})
                </CardTitle>
                <CardDescription>These checks require immediate attention or corrective action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                        <th className="text-left py-2 pr-4 font-medium">Ref</th>
                        <th className="text-left py-2 pr-4 font-medium">Date</th>
                        <th className="text-left py-2 pr-4 font-medium">Workflow</th>
                        <th className="text-left py-2 pr-4 font-medium">Product / Entity</th>
                        <th className="text-left py-2 pr-4 font-medium">Check</th>
                        <th className="text-left py-2 pr-4 font-medium">Status</th>
                        <th className="text-left py-2 pr-4 font-medium">Officer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedRows.map((r, i) => (
                        <tr key={i} className="border-b border-border/50 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                          <td className="py-2 pr-4 font-mono text-xs text-[#02A19E]">{r.ref || '—'}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">{fmt(r.date)}</td>
                          <td className="py-2 pr-4"><Badge variant="outline" className="text-xs">{r.workflow}</Badge></td>
                          <td className="py-2 pr-4">{r.entity || '—'}</td>
                          <td className="py-2 pr-4 font-medium">{r.check}</td>
                          <td className="py-2 pr-4">{complianceBadge(r.status)}</td>
                          <td className="py-2 pr-4">{r.officer || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {warnRows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <ShieldCheck className="h-4 w-4" />
                  Advisory / Minor Issues ({warnRows.length})
                </CardTitle>
                <CardDescription>These checks have minor deviations that should be monitored</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                        <th className="text-left py-2 pr-4 font-medium">Ref</th>
                        <th className="text-left py-2 pr-4 font-medium">Date</th>
                        <th className="text-left py-2 pr-4 font-medium">Workflow</th>
                        <th className="text-left py-2 pr-4 font-medium">Product / Entity</th>
                        <th className="text-left py-2 pr-4 font-medium">Check</th>
                        <th className="text-left py-2 pr-4 font-medium">Status</th>
                        <th className="text-left py-2 pr-4 font-medium">Officer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warnRows.map((r, i) => (
                        <tr key={i} className="border-b border-border/50 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                          <td className="py-2 pr-4 font-mono text-xs text-[#02A19E]">{r.ref || '—'}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">{fmt(r.date)}</td>
                          <td className="py-2 pr-4"><Badge variant="outline" className="text-xs">{r.workflow}</Badge></td>
                          <td className="py-2 pr-4">{r.entity || '—'}</td>
                          <td className="py-2 pr-4 font-medium">{r.check}</td>
                          <td className="py-2 pr-4">{complianceBadge(r.status)}</td>
                          <td className="py-2 pr-4">{r.officer || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {totalChecks > 0 && failedRows.length === 0 && warnRows.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center py-12 gap-3">
                <ShieldCheck className="h-12 w-12 text-green-500" />
                <p className="text-base font-semibold text-foreground">All checks passed</p>
                <p className="text-sm text-muted-foreground">{totalChecks} compliance checks across all workflows — no issues found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
