import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@vrushabh-b/oneiot-ui';
import { CheckCircle2, PackageMinus } from 'lucide-react';

interface StockEntry {
  id: string;
  productName: string;
  zoneAssignment: string;
}

interface OutwardRequestForm {
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
}

interface ConfirmationForm {
  dispatchTemperature: string;
  physicalCondition: string;
  coldChainAtDispatch: string;
  sealNumber: string;
  fssaiTransitDoc: string;
  inspectionOfficer: string;
  finalRemarks: string;
  confirmed: boolean;
}

const now = () => new Date().toISOString().slice(0, 16);
const genExitNumber = () => `EX-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

const FIELD_CLASS =
  'w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#02A19E]';

export function StockExitPage() {
  const [step, setStep] = useState<1 | 2 | 'success'>(1);
  const [submittedId, setSubmittedId] = useState('');
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('stockEntries');
    if (raw) {
      const parsed = JSON.parse(raw) as StockEntry[];
      setStockEntries(parsed.filter((e) => (e as unknown as { status: string }).status === 'active'));
    }
  }, []);

  const [request, setRequest] = useState<OutwardRequestForm>({
    exitNumber: genExitNumber(),
    exitDateTime: now(),
    selectedEntryId: '',
    releaseUnits: '',
    releaseWeight: '',
    destinationName: '',
    destinationAddress: '',
    transporterName: '',
    vehicleNumber: '',
    driverName: '',
    driverMobile: '',
    dispatchReason: '',
  });

  const [confirmation, setConfirmation] = useState<ConfirmationForm>({
    dispatchTemperature: '',
    physicalCondition: '',
    coldChainAtDispatch: '',
    sealNumber: '',
    fssaiTransitDoc: '',
    inspectionOfficer: '',
    finalRemarks: '',
    confirmed: false,
  });

  const updateRequest = (k: keyof OutwardRequestForm, v: string) =>
    setRequest((p) => ({ ...p, [k]: v }));

  const updateConfirmation = (k: keyof ConfirmationForm, v: string | boolean) =>
    setConfirmation((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const id = request.exitNumber;
    const record = { id, type: 'exit', ...request, ...confirmation, submittedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('stockExits') ?? '[]') as unknown[];
    existing.push(record);
    localStorage.setItem('stockExits', JSON.stringify(existing));
    setSubmittedId(id);
    setStep('success');
  };

  const reset = () => {
    setStep(1);
    setSubmittedId('');
    setRequest({
      exitNumber: genExitNumber(),
      exitDateTime: now(),
      selectedEntryId: '',
      releaseUnits: '',
      releaseWeight: '',
      destinationName: '',
      destinationAddress: '',
      transporterName: '',
      vehicleNumber: '',
      driverName: '',
      driverMobile: '',
      dispatchReason: '',
    });
    setConfirmation({
      dispatchTemperature: '',
      physicalCondition: '',
      coldChainAtDispatch: '',
      sealNumber: '',
      fssaiTransitDoc: '',
      inspectionOfficer: '',
      finalRemarks: '',
      confirmed: false,
    });
  };

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Stock Exit</h1>
          <p className="text-sm text-muted-foreground mt-1">Outward Request → Dispatch Confirmation</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center py-16 gap-4">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
            <h2 className="text-xl font-semibold text-foreground">Stock Exit Recorded</h2>
            <p className="text-sm text-muted-foreground">Exit Reference</p>
            <Badge className="text-base px-4 py-1 bg-green-500/15 text-green-400 border-green-500/30">
              {submittedId}
            </Badge>
            <Button className="mt-4 bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={reset}>
              <PackageMinus className="h-4 w-4 mr-2" />
              New Exit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Stock Exit</h1>
        <p className="text-sm text-muted-foreground mt-1">Outward Request → Dispatch Confirmation</p>
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
              {s === 1 ? 'Outward Request' : 'Confirmation'}
            </span>
            {i < 1 && <div className="flex-1 h-px bg-border mx-3" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1 — Outward Request</CardTitle>
            <CardDescription>Select stock and provide dispatch details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Exit Reference Number</label>
              <input className={FIELD_CLASS} value={request.exitNumber} readOnly />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Exit Date & Time</label>
              <input type="datetime-local" className={FIELD_CLASS} value={request.exitDateTime}
                onChange={(e) => updateRequest('exitDateTime', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Select Stock Entry to Dispatch</label>
              {stockEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground bg-muted rounded-md px-3 py-2 border border-border">
                  No active stock entries found. Please complete a Stock Entry first.
                </p>
              ) : (
                <select className={FIELD_CLASS} value={request.selectedEntryId}
                  onChange={(e) => updateRequest('selectedEntryId', e.target.value)}>
                  <option value="">Select entry</option>
                  {stockEntries.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.id} — {e.productName} ({e.zoneAssignment})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Quantity to Release — Units</label>
              <input type="number" min="0" className={FIELD_CLASS} placeholder="e.g. 20 crates" value={request.releaseUnits}
                onChange={(e) => updateRequest('releaseUnits', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Weight to Release (kg)</label>
              <input type="number" min="0" className={FIELD_CLASS} placeholder="e.g. 1000" value={request.releaseWeight}
                onChange={(e) => updateRequest('releaseWeight', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Destination / Consignee Name</label>
              <input className={FIELD_CLASS} placeholder="e.g. FreshMart Retail Pvt. Ltd." value={request.destinationName}
                onChange={(e) => updateRequest('destinationName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Reason for Dispatch</label>
              <select className={FIELD_CLASS} value={request.dispatchReason}
                onChange={(e) => updateRequest('dispatchReason', e.target.value)}>
                <option value="">Select reason</option>
                {['Sale', 'Transfer to Another Facility', 'Return to Supplier', 'Recall', 'Other'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Destination Address</label>
              <textarea rows={2} className={FIELD_CLASS} placeholder="Full delivery address" value={request.destinationAddress}
                onChange={(e) => updateRequest('destinationAddress', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Transporter Name</label>
              <input className={FIELD_CLASS} placeholder="Logistics company or individual" value={request.transporterName}
                onChange={(e) => updateRequest('transporterName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Vehicle Number</label>
              <input className={FIELD_CLASS} placeholder="e.g. KA-05-CD-5678" value={request.vehicleNumber}
                onChange={(e) => updateRequest('vehicleNumber', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Driver Name</label>
              <input className={FIELD_CLASS} placeholder="Full name" value={request.driverName}
                onChange={(e) => updateRequest('driverName', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Driver Mobile</label>
              <input type="tel" className={FIELD_CLASS} placeholder="10-digit mobile" value={request.driverMobile}
                onChange={(e) => updateRequest('driverMobile', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2 — Dispatch Confirmation</CardTitle>
            <CardDescription>FSSAI + WHO cold chain sign-off at the time of dispatch</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Temperature at Dispatch (°C)</label>
              <input type="number" className={FIELD_CLASS} placeholder="e.g. 4.5" value={confirmation.dispatchTemperature}
                onChange={(e) => updateConfirmation('dispatchTemperature', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Physical Condition at Dispatch</label>
              <select className={FIELD_CLASS} value={confirmation.physicalCondition}
                onChange={(e) => updateConfirmation('physicalCondition', e.target.value)}>
                <option value="">Select</option>
                <option>Good</option>
                <option>Minor Issues</option>
                <option>Damaged</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Cold Chain at Dispatch</label>
              <select className={FIELD_CLASS} value={confirmation.coldChainAtDispatch}
                onChange={(e) => updateConfirmation('coldChainAtDispatch', e.target.value)}>
                <option value="">Select</option>
                <option>Maintained</option>
                <option>Break Reported</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Seal Number (optional)</label>
              <input className={FIELD_CLASS} placeholder="Vehicle or container seal" value={confirmation.sealNumber}
                onChange={(e) => updateConfirmation('sealNumber', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">FSSAI Transit Document No. (optional)</label>
              <input className={FIELD_CLASS} placeholder="Transit document reference" value={confirmation.fssaiTransitDoc}
                onChange={(e) => updateConfirmation('fssaiTransitDoc', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Inspection Officer Name</label>
              <input className={FIELD_CLASS} placeholder="Full name" value={confirmation.inspectionOfficer}
                onChange={(e) => updateConfirmation('inspectionOfficer', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Final Remarks (optional)</label>
              <textarea rows={2} className={FIELD_CLASS} placeholder="Any dispatch notes..." value={confirmation.finalRemarks}
                onChange={(e) => updateConfirmation('finalRemarks', e.target.value)} />
            </div>
            <div className="flex items-start gap-3 md:col-span-2 bg-muted rounded-lg p-4 border border-border">
              <input
                type="checkbox"
                id="confirm-check"
                className="mt-0.5 h-4 w-4 accent-[#02A19E]"
                checked={confirmation.confirmed}
                onChange={(e) => updateConfirmation('confirmed', e.target.checked)}
              />
              <label htmlFor="confirm-check" className="text-sm text-foreground leading-snug cursor-pointer">
                I confirm all details are correct and stock has been physically verified before dispatch.
              </label>
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
            Next — Dispatch Confirmation
          </Button>
        )}
        {step === 2 && (
          <Button
            className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90 disabled:opacity-50"
            disabled={!confirmation.confirmed}
            onClick={handleSubmit}
          >
            Submit Exit
          </Button>
        )}
      </div>
    </div>
  );
}
