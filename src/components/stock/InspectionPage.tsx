import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@vrushabh-b/oneiot-ui';
import { CheckCircle2, ClipboardCheck } from 'lucide-react';

interface InspectionForm {
  inspectionRef: string;
  inspectionDate: string;
  stockEntryId: string;
  productName: string;
  zoneId: string;
  currentTemperature: string;
  targetTemperature: string;
  currentHumidity: string;
  doorStatus: string;
  coldChainStatus: string;
  pestHygieneCheck: string;
  productCondition: string;
  stockWeight: string;
  anyDamage: string;
  damageNotes: string;
  fssaiComplianceStatus: string;
  whoComplianceStatus: string;
  temperatureExcursion: string;
  excursionDetails: string;
  nextInspectionDate: string;
  inspectionOfficer: string;
  notes: string;
}

const now = () => new Date().toISOString().slice(0, 16);
const genRef = () => `INS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

const FIELD = 'w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#02A19E]';

const empty = (): InspectionForm => ({
  inspectionRef: genRef(),
  inspectionDate: now(),
  stockEntryId: '',
  productName: '',
  zoneId: '',
  currentTemperature: '',
  targetTemperature: '',
  currentHumidity: '',
  doorStatus: '',
  coldChainStatus: '',
  pestHygieneCheck: '',
  productCondition: '',
  stockWeight: '',
  anyDamage: '',
  damageNotes: '',
  fssaiComplianceStatus: '',
  whoComplianceStatus: '',
  temperatureExcursion: '',
  excursionDetails: '',
  nextInspectionDate: '',
  inspectionOfficer: '',
  notes: '',
});

export function InspectionPage() {
  const [form, setForm] = useState<InspectionForm>(empty());
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');

  const upd = (k: keyof InspectionForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const record = { ...form, submittedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('inspections') ?? '[]') as unknown[];
    existing.push(record);
    localStorage.setItem('inspections', JSON.stringify(existing));
    setSubmittedRef(form.inspectionRef);
    setSubmitted(true);
  };

  const reset = () => {
    setForm(empty());
    setSubmitted(false);
    setSubmittedRef('');
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Periodic Inspection</h1>
          <p className="text-sm text-muted-foreground mt-1">FSSAI + WHO cold chain compliance check</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center py-16 gap-4">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
            <h2 className="text-xl font-semibold text-foreground">Inspection Recorded</h2>
            <p className="text-sm text-muted-foreground">Reference ID</p>
            <Badge className="text-base px-4 py-1 bg-green-500/15 text-green-400 border-green-500/30">
              {submittedRef}
            </Badge>
            <Button className="mt-4 bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={reset}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Periodic Inspection</h1>
        <p className="text-sm text-muted-foreground mt-1">FSSAI + WHO cold chain compliance check during storage</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Details</CardTitle>
          <CardDescription>Identify the stock batch and inspection context</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Inspection Reference</label>
            <input className={FIELD} value={form.inspectionRef} readOnly />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Inspection Date & Time</label>
            <input type="datetime-local" className={FIELD} value={form.inspectionDate}
              onChange={e => upd('inspectionDate', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Stock Entry ID</label>
            <input className={FIELD} placeholder="e.g. SE-1234567890" value={form.stockEntryId}
              onChange={e => upd('stockEntryId', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Product Name</label>
            <input className={FIELD} placeholder="e.g. Alphonso Mangoes" value={form.productName}
              onChange={e => upd('productName', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Zone</label>
            <select className={FIELD} value={form.zoneId} onChange={e => upd('zoneId', e.target.value)}>
              <option value="">Select zone</option>
              <option>Ambient Zone</option>
              <option>Chill Zone</option>
              <option>Frozen Zone</option>
              <option>Processing Zone</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Current Stock Weight (kg)</label>
            <input type="number" min="0" className={FIELD} placeholder="Remaining weight" value={form.stockWeight}
              onChange={e => upd('stockWeight', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Temperature & Environment</CardTitle>
          <CardDescription>Cold chain and environmental readings at time of inspection</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Current Temperature (°C)</label>
            <input type="number" className={FIELD} placeholder="e.g. 4.2" value={form.currentTemperature}
              onChange={e => upd('currentTemperature', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Target Temperature (°C)</label>
            <input type="number" className={FIELD} placeholder="e.g. 4.0" value={form.targetTemperature}
              onChange={e => upd('targetTemperature', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Current Humidity (%)</label>
            <input type="number" min="0" max="100" className={FIELD} placeholder="e.g. 85" value={form.currentHumidity}
              onChange={e => upd('currentHumidity', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Door Status</label>
            <select className={FIELD} value={form.doorStatus} onChange={e => upd('doorStatus', e.target.value)}>
              <option value="">Select</option>
              <option>All Closed</option>
              <option>One Open</option>
              <option>Multiple Open</option>
              <option>Seal Broken</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Temperature Excursion?</label>
            <select className={FIELD} value={form.temperatureExcursion} onChange={e => upd('temperatureExcursion', e.target.value)}>
              <option value="">Select</option>
              <option>No Excursion</option>
              <option>Minor Excursion (&lt;2°C breach)</option>
              <option>Major Excursion (≥2°C breach)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Excursion Details (if any)</label>
            <input className={FIELD} placeholder="Duration, max temp reached..." value={form.excursionDetails}
              onChange={e => upd('excursionDetails', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Cold Chain Continuity</label>
            <select className={FIELD} value={form.coldChainStatus} onChange={e => upd('coldChainStatus', e.target.value)}>
              <option value="">Select</option>
              <option>Maintained</option>
              <option>Break Reported</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product & Compliance Check</CardTitle>
          <CardDescription>Physical product condition and regulatory compliance status</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Product Condition</label>
            <select className={FIELD} value={form.productCondition} onChange={e => upd('productCondition', e.target.value)}>
              <option value="">Select</option>
              <option>Good — No Issues</option>
              <option>Minor Deterioration</option>
              <option>Significant Deterioration</option>
              <option>Spoilage Detected</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Physical Damage?</label>
            <select className={FIELD} value={form.anyDamage} onChange={e => upd('anyDamage', e.target.value)}>
              <option value="">Select</option>
              <option>None</option>
              <option>Minor Packaging Damage</option>
              <option>Product Damage</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Damage Notes (if any)</label>
            <input className={FIELD} placeholder="Describe damage observed" value={form.damageNotes}
              onChange={e => upd('damageNotes', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Pest / Hygiene Check</label>
            <select className={FIELD} value={form.pestHygieneCheck} onChange={e => upd('pestHygieneCheck', e.target.value)}>
              <option value="">Select</option>
              <option>Pass — No Issues</option>
              <option>Minor Issue Found</option>
              <option>Pest Activity Detected</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">FSSAI Compliance Status</label>
            <select className={FIELD} value={form.fssaiComplianceStatus} onChange={e => upd('fssaiComplianceStatus', e.target.value)}>
              <option value="">Select</option>
              <option>Compliant</option>
              <option>Non-Compliant — Minor</option>
              <option>Non-Compliant — Major</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">WHO Cold Chain Status</label>
            <select className={FIELD} value={form.whoComplianceStatus} onChange={e => upd('whoComplianceStatus', e.target.value)}>
              <option value="">Select</option>
              <option>Compliant</option>
              <option>Advisory Issued</option>
              <option>Breach Reported</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Next Inspection Date</label>
            <input type="date" className={FIELD} value={form.nextInspectionDate}
              onChange={e => upd('nextInspectionDate', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Inspection Officer Name</label>
            <input className={FIELD} placeholder="Full name" value={form.inspectionOfficer}
              onChange={e => upd('inspectionOfficer', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Additional Notes (optional)</label>
            <textarea rows={2} className={FIELD} placeholder="Any other observations..." value={form.notes}
              onChange={e => upd('notes', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-[#02A19E] text-white hover:bg-[#02A19E]/90" onClick={handleSubmit}>
          Submit Inspection
        </Button>
      </div>
    </div>
  );
}
