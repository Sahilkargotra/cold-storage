import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@vrushabh-b/oneiot-ui';
import { CheckCircle2, PackagePlus } from 'lucide-react';

interface GateEntryForm {
  entryNumber: string;
  entryDateTime: string;
  supplierName: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  productCategory: string;
  remarks: string;
}

interface InspectionForm {
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
}

const now = () => {
  const d = new Date();
  return d.toISOString().slice(0, 16);
};

const genEntryNumber = () => `GE-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

const FIELD_CLASS =
  'w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#02A19E]';

export function StockEntryPage() {
  const [step, setStep] = useState<1 | 2 | 'success'>(1);
  const [submittedId, setSubmittedId] = useState('');

  const [gate, setGate] = useState<GateEntryForm>({
    entryNumber: genEntryNumber(),
    entryDateTime: now(),
    supplierName: '',
    vehicleNumber: '',
    driverName: '',
    driverMobile: '',
    productCategory: '',
    remarks: '',
  });

  const [inspection, setInspection] = useState<InspectionForm>({
    productName: '',
    batchNumber: '',
    quantityUnits: '',
    quantityWeight: '',
    manufacturingDate: '',
    expiryDate: '',
    arrivalTemperature: '',
    visualCondition: '',
    zoneAssignment: '',
    fssaiLicense: '',
    coldChainContinuity: '',
    inspectionOfficer: '',
    inspectionNotes: '',
  });

  const updateGate = (k: keyof GateEntryForm, v: string) =>
    setGate((p) => ({ ...p, [k]: v }));

  const updateInspection = (k: keyof InspectionForm, v: string) =>
    setInspection((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const id = `SE-${Date.now()}`;
    const record = { id, ...gate, ...inspection, status: 'active', submittedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('stockEntries') ?? '[]') as unknown[];
    existing.push(record);
    localStorage.setItem('stockEntries', JSON.stringify(existing));
    setSubmittedId(id);
    setStep('success');
  };

  const reset = () => {
    setStep(1);
    setSubmittedId('');
    setGate({
      entryNumber: genEntryNumber(),
      entryDateTime: now(),
      supplierName: '',
      vehicleNumber: '',
      driverName: '',
      driverMobile: '',
      productCategory: '',
      remarks: '',
    });
    setInspection({
      productName: '',
      batchNumber: '',
      quantityUnits: '',
      quantityWeight: '',
      manufacturingDate: '',
      expiryDate: '',
      arrivalTemperature: '',
      visualCondition: '',
      zoneAssignment: '',
      fssaiLicense: '',
      coldChainContinuity: '',
      inspectionOfficer: '',
      inspectionNotes: '',
    });
  };

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Stock Entry</h1>
          <p className="text-sm text-muted-foreground mt-1">Gate Entry → Inward Inspection</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center py-16 gap-4">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
            <h2 className="text-xl font-semibold text-foreground">Stock Entry Recorded</h2>
            <p className="text-sm text-muted-foreground">Entry ID</p>
            <Badge className="text-base px-4 py-1 bg-green-500/15 text-green-400 border-green-500/30">
              {submittedId}
            </Badge>
            <Button className="mt-4 bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={reset}>
              <PackagePlus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Stock Entry</h1>
        <p className="text-sm text-muted-foreground mt-1">Gate Entry → Inward Inspection</p>
      </div>

      <div className="flex items-center gap-0 max-w-xs">
        {([1, 2] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-0 flex-1">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold flex-shrink-0"
              style={{
                backgroundColor:
                  step > s ? '#22c55e' : step === s ? '#02A19E' : 'var(--muted)',
                color: step >= s ? '#fff' : 'var(--muted-foreground)',
              }}
            >
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
            <span
              className="ml-2 text-xs font-medium flex-shrink-0"
              style={{ color: step === s ? '#02A19E' : 'var(--muted-foreground)' }}
            >
              {s === 1 ? 'Gate Entry' : 'Inspection'}
            </span>
            {i < 1 && <div className="flex-1 h-px bg-border mx-3" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1 — Gate Entry</CardTitle>
            <CardDescription>Record vehicle and supplier details at the gate</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Gate Entry Number</label>
              <input className={FIELD_CLASS} value={gate.entryNumber} readOnly />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Entry Date & Time</label>
              <input type="datetime-local" className={FIELD_CLASS} value={gate.entryDateTime}
                onChange={(e) => updateGate('entryDateTime', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Supplier / Vendor Name</label>
              <input className={FIELD_CLASS} placeholder="e.g. Sharma Agro Pvt. Ltd." value={gate.supplierName}
                onChange={(e) => updateGate('supplierName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Vehicle Number</label>
              <input className={FIELD_CLASS} placeholder="e.g. TN-01-AB-1234" value={gate.vehicleNumber}
                onChange={(e) => updateGate('vehicleNumber', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Driver Name</label>
              <input className={FIELD_CLASS} placeholder="Full name" value={gate.driverName}
                onChange={(e) => updateGate('driverName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Driver Mobile</label>
              <input type="tel" className={FIELD_CLASS} placeholder="10-digit mobile" value={gate.driverMobile}
                onChange={(e) => updateGate('driverMobile', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Expected Product Category</label>
              <select className={FIELD_CLASS} value={gate.productCategory}
                onChange={(e) => updateGate('productCategory', e.target.value)}>
                <option value="">Select category</option>
                {['Fruits', 'Vegetables', 'Dairy', 'Meat & Seafood', 'Pharmaceuticals', 'Other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Remarks (optional)</label>
              <textarea rows={2} className={FIELD_CLASS} placeholder="Any additional notes..." value={gate.remarks}
                onChange={(e) => updateGate('remarks', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2 — Inward Inspection</CardTitle>
            <CardDescription>FSSAI + WHO cold chain compliance — product and condition details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Product Name</label>
              <input className={FIELD_CLASS} placeholder="e.g. Alphonso Mangoes" value={inspection.productName}
                onChange={(e) => updateInspection('productName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Batch / Lot Number</label>
              <input className={FIELD_CLASS} placeholder="e.g. LOT-2024-0451" value={inspection.batchNumber}
                onChange={(e) => updateInspection('batchNumber', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Quantity — Units</label>
              <input type="number" min="0" className={FIELD_CLASS} placeholder="e.g. 50 crates" value={inspection.quantityUnits}
                onChange={(e) => updateInspection('quantityUnits', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Weight (kg)</label>
              <input type="number" min="0" className={FIELD_CLASS} placeholder="e.g. 2500" value={inspection.quantityWeight}
                onChange={(e) => updateInspection('quantityWeight', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Manufacturing Date</label>
              <input type="date" className={FIELD_CLASS} value={inspection.manufacturingDate}
                onChange={(e) => updateInspection('manufacturingDate', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Expiry Date</label>
              <input type="date" className={FIELD_CLASS} value={inspection.expiryDate}
                onChange={(e) => updateInspection('expiryDate', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Temperature at Arrival (°C)</label>
              <input type="number" className={FIELD_CLASS} placeholder="e.g. 4.2" value={inspection.arrivalTemperature}
                onChange={(e) => updateInspection('arrivalTemperature', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Visual Condition</label>
              <select className={FIELD_CLASS} value={inspection.visualCondition}
                onChange={(e) => updateInspection('visualCondition', e.target.value)}>
                <option value="">Select</option>
                <option>Pass</option>
                <option>Minor Issues</option>
                <option>Fail</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Zone Assignment</label>
              <select className={FIELD_CLASS} value={inspection.zoneAssignment}
                onChange={(e) => updateInspection('zoneAssignment', e.target.value)}>
                <option value="">Select zone</option>
                <option>Ambient Zone</option>
                <option>Chill Zone</option>
                <option>Frozen Zone</option>
                <option>Processing Zone</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">FSSAI License No. (Supplier)</label>
              <input className={FIELD_CLASS} placeholder="14-digit FSSAI number" value={inspection.fssaiLicense}
                onChange={(e) => updateInspection('fssaiLicense', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Cold Chain Continuity</label>
              <select className={FIELD_CLASS} value={inspection.coldChainContinuity}
                onChange={(e) => updateInspection('coldChainContinuity', e.target.value)}>
                <option value="">Select</option>
                <option>Maintained</option>
                <option>Break Reported</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Inspection Officer Name</label>
              <input className={FIELD_CLASS} placeholder="Full name" value={inspection.inspectionOfficer}
                onChange={(e) => updateInspection('inspectionOfficer', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Inspection Notes (optional)</label>
              <textarea rows={2} className={FIELD_CLASS} placeholder="Additional observations..." value={inspection.inspectionNotes}
                onChange={(e) => updateInspection('inspectionNotes', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        {step === 2 ? (
          <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
        ) : (
          <div />
        )}
        {step === 1 && (
          <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={() => setStep(2)}>
            Next — Inward Inspection
          </Button>
        )}
        {step === 2 && (
          <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={handleSubmit}>
            Submit Entry
          </Button>
        )}
      </div>
    </div>
  );
}
