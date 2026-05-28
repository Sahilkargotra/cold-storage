import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Button, Input, Label, Badge, Switch,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Avatar, AvatarFallback,
} from '@vrushabh-b/oneiot-ui';
import {
  TrendingUp, Users, Shield, Palette, Cpu, Package,
  Plus, Edit2, Trash2, Check, Wifi, WifiOff, Wrench,
  CheckCircle2,
} from 'lucide-react';
import { RevenueDashboard } from '@/components/revenue/RevenueDashboard';

type SettingsTab = 'revenue' | 'users' | 'user-management' | 'white-labelling' | 'devices' | 'products';

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'revenue',          label: 'Revenue',          icon: TrendingUp },
  { id: 'users',            label: 'Users',             icon: Users },
  { id: 'user-management',  label: 'User Management',   icon: Shield },
  { id: 'white-labelling',  label: 'White Labelling',   icon: Palette },
  { id: 'devices',          label: 'Devices',           icon: Cpu },
  { id: 'products',         label: 'Products',          icon: Package },
];

const MOCK_USERS = [
  { id: '1', name: 'Arjun Mehta',   email: 'arjun.mehta@coldguard.in',   role: 'Admin',    status: 'online',  lastActive: 'Just now' },
  { id: '2', name: 'Priya Nair',    email: 'priya.nair@coldguard.in',    role: 'Manager',  status: 'online',  lastActive: '5 min ago' },
  { id: '3', name: 'Rajesh Kumar',  email: 'rajesh@coldguard.in',        role: 'Operator', status: 'offline', lastActive: '2 hrs ago' },
  { id: '4', name: 'Sunita Rao',    email: 'sunita.rao@coldguard.in',    role: 'Viewer',   status: 'online',  lastActive: '1 hr ago' },
  { id: '5', name: 'Vikram Singh',  email: 'vikram.singh@coldguard.in',  role: 'Operator', status: 'offline', lastActive: 'Yesterday' },
  { id: '6', name: 'Meena Pillai',  email: 'meena.pillai@coldguard.in', role: 'Manager',  status: 'online',  lastActive: '20 min ago' },
];

const PENDING_INVITES = [
  { email: 'anand.kumar@coldguard.in', role: 'Operator', sent: '2 days ago' },
  { email: 'deepa.s@coldguard.in',     role: 'Viewer',   sent: '1 day ago' },
];

const ROLE_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'warning' | 'info'> = {
  Admin: 'default', Manager: 'info', Operator: 'warning', Viewer: 'secondary',
};

function UsersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage who has access to your organisation.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="teal" size="sm"><Plus className="h-4 w-4 mr-1.5" />Invite User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription>Send an invitation link to add someone to your organisation.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="invite-name">Full Name</Label>
                <Input id="invite-name" placeholder="e.g. Rohit Sharma" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input id="invite-email" type="email" placeholder="rohit@coldguard.in" />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="teal">Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_USERS.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{u.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={ROLE_BADGE_VARIANT[u.role]}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${u.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      <span className="text-sm capitalize text-muted-foreground">{u.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon"><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Pending Invitations</CardTitle>
          <CardDescription>These users have been invited but haven't joined yet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {PENDING_INVITES.map((inv) => (
            <div key={inv.email} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{inv.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Invited as <span className="font-medium">{inv.role}</span> · {inv.sent}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Resend</Button>
                <Button variant="ghost" size="icon"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


const ROLES_DATA = [
  {
    name: 'Admin',
    description: 'Full access to all features and settings.',
    count: 1,
    color: '#02A19E',
    permissions: ['Manage users & roles', 'Configure settings', 'View all dashboards', 'Export reports', 'Manage devices'],
  },
  {
    name: 'Manager',
    description: 'Operational oversight with limited settings access.',
    count: 2,
    color: '#6333ff',
    permissions: ['View all dashboards', 'Manage bookings', 'Approve transfers', 'Generate reports'],
  },
  {
    name: 'Operator',
    description: 'Day-to-day operations and monitoring.',
    count: 2,
    color: '#f59e0b',
    permissions: ['View facility dashboard', 'Manage zones', 'Acknowledge alerts'],
  },
  {
    name: 'Viewer',
    description: 'Read-only access to dashboards and reports.',
    count: 1,
    color: '#8888a0',
    permissions: ['View dashboards', 'View reports'],
  },
];

const ACCESS_TOGGLES = [
  { label: 'Two-Factor Authentication', description: 'Require 2FA for all users on sign-in.', defaultOn: true },
  { label: 'SSO (Single Sign-On)',       description: 'Allow login via your identity provider.',  defaultOn: false },
  { label: 'IP Allowlisting',            description: 'Restrict access to specific IP ranges.',   defaultOn: false },
  { label: 'Audit Logging',              description: 'Log all user actions for compliance.',      defaultOn: true },
];

function UserManagementTab() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(ACCESS_TOGGLES.map(t => [t.label, t.defaultOn]))
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Roles &amp; Permissions</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Define what each role can see and do.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES_DATA.map((role) => (
          <Card key={role.name}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                    {role.name}
                    <Badge variant="secondary" className="text-xs">{role.count} user{role.count !== 1 ? 's' : ''}</Badge>
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs">{role.description}</CardDescription>
                </div>
                {role.name === 'Admin' && (
                  <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5 pt-0">
              {role.permissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#02A19E] shrink-0" />
                  {perm}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground">Access Control</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Organisation-wide security settings.</p>
      </div>

      <Card>
        <CardContent className="divide-y divide-border p-0">
          {ACCESS_TOGGLES.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <Switch
                checked={toggles[item.label]}
                onCheckedChange={(v) => setToggles(prev => ({ ...prev, [item.label]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


function WhiteLabellingTab() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">White Labelling</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Customise the platform to match your brand.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Brand Identity</CardTitle>
          <CardDescription>Set your organisation's name, colours, and logo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input id="brand-name" defaultValue="ColdGuard" />
          </div>

          <div className="space-y-1.5">
            <Label>Primary Colour</Label>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md border border-border" style={{ backgroundColor: '#02A19E' }} />
              <Input defaultValue="#02A19E" className="w-36 font-mono" />
              <span className="text-xs text-muted-foreground">Used for buttons, active states, and highlights.</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Logo</Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border h-24 cursor-pointer hover:border-[#02A19E] transition-colors">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Upload Logo</p>
                <p className="text-xs text-muted-foreground mt-1">PNG or SVG · Max 2 MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Favicon</Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border h-16 cursor-pointer hover:border-[#02A19E] transition-colors">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Upload Favicon</p>
                <p className="text-xs text-muted-foreground mt-1">ICO or PNG 32×32</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Theme</CardTitle>
          <CardDescription>Default colour mode for the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="inline-flex rounded-lg border border-border bg-muted p-1 gap-1">
            {(['Light', 'Dark', 'System'] as const).map((mode) => (
              <button
                key={mode}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === 'Dark'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Custom Domain</CardTitle>
          <CardDescription>Serve the platform from your own domain.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="custom-domain">Domain</Label>
            <Input id="custom-domain" defaultValue="app.coldguard.in" />
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <Badge variant="success">SSL Active</Badge>
            <span className="text-xs text-muted-foreground">Certificate auto-renews on 15 Aug 2026</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="teal">Save Changes</Button>
      </div>
    </div>
  );
}


const MOCK_DEVICES = [
  { id: 'd1', name: 'TEMP-Z1-01', type: 'Temperature Sensor', zone: 'Zone A – Chilled',    status: 'online',      lastPing: '2s ago' },
  { id: 'd2', name: 'TEMP-Z1-02', type: 'Temperature Sensor', zone: 'Zone A – Chilled',    status: 'online',      lastPing: '3s ago' },
  { id: 'd3', name: 'DOOR-Z2-01', type: 'Door Sensor',        zone: 'Zone B – Frozen',     status: 'online',      lastPing: '1s ago' },
  { id: 'd4', name: 'COMP-Z2-01', type: 'Compressor Monitor', zone: 'Zone B – Frozen',     status: 'maintenance', lastPing: '10 min ago' },
  { id: 'd5', name: 'ENRG-MAIN',  type: 'Energy Meter',       zone: 'Main Panel',          status: 'online',      lastPing: '5s ago' },
  { id: 'd6', name: 'TEMP-Z3-01', type: 'Temperature Sensor', zone: 'Zone C – Processing', status: 'offline',     lastPing: '3 hrs ago' },
];

const DEVICE_STATUS_ICON: Record<string, React.ReactNode> = {
  online:      <Wifi className="h-3.5 w-3.5 text-green-500" />,
  offline:     <WifiOff className="h-3.5 w-3.5 text-destructive" />,
  maintenance: <Wrench className="h-3.5 w-3.5 text-yellow-400" />,
};

const DEVICE_STATUS_BADGE: Record<string, 'success' | 'destructive' | 'warning'> = {
  online: 'success', offline: 'destructive', maintenance: 'warning',
};

function DevicesTab() {
  const counts = { total: 24, online: 18, offline: 4, maintenance: 2 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Connected Devices</h2>
          <p className="text-sm text-muted-foreground mt-0.5">IoT sensors and monitors across all zones.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="teal" size="sm"><Plus className="h-4 w-4 mr-1.5" />Add Device</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new device</DialogTitle>
              <DialogDescription>Register a new IoT device to start monitoring.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="device-id">Device ID</Label>
                <Input id="device-id" placeholder="e.g. TEMP-Z4-01" className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label>Device Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temp">Temperature Sensor</SelectItem>
                    <SelectItem value="door">Door Sensor</SelectItem>
                    <SelectItem value="compressor">Compressor Monitor</SelectItem>
                    <SelectItem value="energy">Energy Meter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Zone</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Assign to zone" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="z1">Zone A – Chilled</SelectItem>
                    <SelectItem value="z2">Zone B – Frozen</SelectItem>
                    <SelectItem value="z3">Zone C – Processing</SelectItem>
                    <SelectItem value="main">Main Panel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="teal">Register Device</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Devices', value: counts.total,       color: 'text-foreground' },
          { label: 'Online',        value: counts.online,      color: 'text-green-500' },
          { label: 'Offline',       value: counts.offline,     color: 'text-destructive' },
          { label: 'Maintenance',   value: counts.maintenance, color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Ping</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DEVICES.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono font-medium text-foreground">{d.name}</TableCell>
                  <TableCell className="text-muted-foreground">{d.type}</TableCell>
                  <TableCell className="text-muted-foreground">{d.zone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {DEVICE_STATUS_ICON[d.status]}
                      <Badge variant={DEVICE_STATUS_BADGE[d.status]} className="capitalize">{d.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{d.lastPing}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon"><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


const MOCK_PRODUCTS = [
  { sku: 'FRT-001', name: 'Alphonso Mangoes',   category: 'Fruits',        tempRange: '10–13 °C', shelfLife: '14 days',  unit: 'Tonne' },
  { sku: 'VEG-001', name: 'Potato (Kufri)',      category: 'Vegetables',    tempRange: '3–5 °C',   shelfLife: '90 days',  unit: 'Tonne' },
  { sku: 'DAI-001', name: 'Fresh Toned Milk',    category: 'Dairy',         tempRange: '0–4 °C',   shelfLife: '3 days',   unit: 'Litre' },
  { sku: 'DAI-002', name: 'Paneer Block',        category: 'Dairy',         tempRange: '0–4 °C',   shelfLife: '7 days',   unit: 'Kg' },
  { sku: 'PHR-001', name: 'Insulin Vials',       category: 'Pharma',        tempRange: '2–8 °C',   shelfLife: '730 days', unit: 'Box' },
  { sku: 'FRZ-001', name: 'Frozen Peas',         category: 'Frozen Foods',  tempRange: '−18 °C',   shelfLife: '365 days', unit: 'Kg' },
  { sku: 'FRT-002', name: 'Pomegranate',         category: 'Fruits',        tempRange: '5–7 °C',   shelfLife: '60 days',  unit: 'Crate' },
  { sku: 'VEG-002', name: 'Green Chilli',        category: 'Vegetables',    tempRange: '7–10 °C',  shelfLife: '10 days',  unit: 'Kg' },
];

const CATEGORY_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'info' | 'warning'> = {
  Fruits: 'success', Vegetables: 'info', Dairy: 'default', Pharma: 'warning', 'Frozen Foods': 'secondary',
};

function ProductsTab() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Product Catalog</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage SKUs and storage requirements.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="teal" size="sm"><Plus className="h-4 w-4 mr-1.5" />Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new product</DialogTitle>
              <DialogDescription>Define a new SKU and its storage requirements.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="e.g. FRT-003" className="font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="pharma">Pharma</SelectItem>
                      <SelectItem value="frozen">Frozen Foods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prod-name">Product Name</Label>
                <Input id="prod-name" placeholder="e.g. Kesar Mango" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="temp-range">Temp Range</Label>
                  <Input id="temp-range" placeholder="e.g. 0–4 °C" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shelf-life">Shelf Life</Label>
                  <Input id="shelf-life" placeholder="e.g. 14 days" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="teal">Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search by name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Dairy">Dairy</SelectItem>
            <SelectItem value="Pharma">Pharma</SelectItem>
            <SelectItem value="Frozen Foods">Frozen Foods</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Storage Temp</TableHead>
                <TableHead>Shelf Life</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.sku}>
                  <TableCell className="font-mono text-sm text-muted-foreground">{p.sku}</TableCell>
                  <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant={CATEGORY_BADGE_VARIANT[p.category]}>{p.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.tempRange}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.shelfLife}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.unit}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon"><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No products found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('revenue');

  const renderContent = () => {
    switch (activeTab) {
      case 'revenue':         return <RevenueDashboard />;
      case 'users':           return <UsersTab />;
      case 'user-management': return <UserManagementTab />;
      case 'white-labelling': return <WhiteLabellingTab />;
      case 'devices':         return <DevicesTab />;
      case 'products':        return <ProductsTab />;
    }
  };

  return (
    <div className="flex gap-6 min-h-full">
      <aside className="w-52 shrink-0">
        <Card className="sticky top-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <nav className="space-y-0.5">
              {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-[#02A19E]/15 text-[#02A19E]'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      </aside>

      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}
