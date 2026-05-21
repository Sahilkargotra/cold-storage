# @vrushabh-b/oneiot-ui

Private design system for the OneIoT platform. Brand-aligned components, design tokens, charts, and IoT-specific primitives — all in one package.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Design Tokens](#design-tokens)
- [Theming](#theming)
- [Components](#components)
  - [Primitives](#primitives)
  - [Forms](#forms)
  - [Advanced Forms](#advanced-forms)
  - [Data Display](#data-display)
  - [Data Tables](#data-tables)
  - [Overlays](#overlays)
  - [Feedback](#feedback)
  - [Navigation](#navigation)
  - [Composed](#composed)
  - [Advanced & IoT](#advanced--iot)
  - [Asset Tracking](#asset-tracking)
  - [Charts](#charts)
  - [Layout](#layout)
- [TypeScript](#typescript)
- [Publishing](#publishing)

---

## Installation

### 1. Add `.npmrc` to your project root

```ini
@vrushabh-b:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

Generate a PAT at **GitHub → Settings → Developer settings → Personal access tokens** with `read:packages` scope.

### 2. Install the package

```bash
pnpm add @vrushabh-b/oneiot-ui
```

### 3. Install peer dependencies

```bash
pnpm add react react-dom lucide-react
pnpm add -D tailwindcss
```

Peer dependency versions: `react ^18` · `react-dom ^18` · `tailwindcss ^3` · `lucide-react ^0.469`

---

## Quick Start

### 1. Import styles in your entry file

```ts
// main.tsx or index.tsx
import "@vrushabh-b/oneiot-ui/styles/tokens.css";
```

### 2. Add the `ui-v2` class to your root element

```tsx
// App.tsx
export default function App() {
  return (
    <div className="ui-v2 bg-background text-foreground min-h-screen">
      <YourApp />
    </div>
  );
}
```

### 3. Use components

```tsx
import { Button, Badge, DeviceCard, StatCard } from "@vrushabh-b/oneiot-ui";

export function Dashboard() {
  return (
    <div>
      <StatCard label="Active Devices" value="1,284" delta="+8%" deltaPositive />
      <Badge variant="success">Online</Badge>
      <Button variant="teal">Add Device</Button>
    </div>
  );
}
```

---

## Design Tokens

All tokens are CSS custom properties scoped under `.ui-v2`. Import `tokens.css` once and they are available globally.

| Token | Value | Usage |
|---|---|---|
| `--color-teal` | `#02A19E` | Brand primary |
| `--background` | `#050508` (dark) | Page background |
| `--foreground` | `#f8f8f8` (dark) | Primary text |
| `--muted` | `#1a1a2e` | Subtle backgrounds |
| `--muted-foreground` | `#8888a0` | Secondary text |
| `--border` | `#2a2a3e` | Borders |
| `--card` | `#0d0d1a` | Card backgrounds |
| `--destructive` | `#ef4444` | Error / danger |
| `--radius` | `8px` | Base border radius |

```css
.my-element {
  color: var(--color-teal);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
```

---

## Theming

```tsx
import { readPrefs, writePrefs, resolveMode, usePrefs } from "@vrushabh-b/oneiot-ui";
import type { V2Theme, V2Mode, V2Prefs } from "@vrushabh-b/oneiot-ui";

// V2Theme: "system" | "light" | "dark"

// Write user preference
writePrefs({ theme: "dark" });

// Read stored preference
const prefs = readPrefs(); // V2Prefs

// Resolve to actual mode
const mode = resolveMode(prefs); // "light" | "dark"

// Reactive hook
function ThemeToggle() {
  const { prefs, setTheme } = usePrefs();
  return <button onClick={() => setTheme("dark")}>Dark Mode</button>;
}
```

---

## Components

### Primitives

#### Button

```tsx
import { Button } from "@vrushabh-b/oneiot-ui";
import { Plus, ArrowRight } from "lucide-react";

// Variants
<Button variant="default">Default</Button>
<Button variant="teal">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Save</Button>
<Button variant="warning">Warning</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="link">Link</Button>
<Button variant="outline-destructive">Outline Destructive</Button>
<Button variant="outline-success">Outline Success</Button>
<Button variant="outline-warning">Outline Warning</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-sm"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>

// Icons & loading
<Button leadingIcon={Plus}>Add Device</Button>
<Button trailingIcon={ArrowRight}>Continue</Button>
<Button loading>Saving...</Button>
```

| Prop | Type | Default |
|---|---|---|
| `variant` | `"default" \| "teal" \| "outline" \| "ghost" \| "destructive" \| "success" \| "warning" \| "secondary" \| "link" \| "outline-destructive" \| "outline-success" \| "outline-warning"` | `"default"` |
| `size` | `"sm" \| "default" \| "lg" \| "icon" \| "icon-sm" \| "icon-lg"` | `"default"` |
| `leadingIcon` | `LucideIcon` | — |
| `trailingIcon` | `LucideIcon` | — |
| `loading` | `boolean` | `false` |

---

#### Badge

```tsx
import { Badge } from "@vrushabh-b/oneiot-ui";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
```

---

#### Pill

```tsx
import { Pill } from "@vrushabh-b/oneiot-ui";

<Pill status="online">Connected</Pill>
<Pill status="offline">Offline</Pill>
<Pill status="inactive">Inactive</Pill>
<Pill status="warning">Degraded</Pill>
<Pill status="info">Syncing</Pill>
```

---

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@vrushabh-b/oneiot-ui";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction><Button size="sm">Action</Button></CardAction>
  </CardHeader>
  <CardContent>
    <p>Content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
  </CardFooter>
</Card>
```

---

#### Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@vrushabh-b/oneiot-ui";

<Avatar>
  <AvatarImage src="https://example.com/photo.jpg" alt="Jane Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

#### Separator

```tsx
import { Separator } from "@vrushabh-b/oneiot-ui";

<Separator />
<Separator orientation="vertical" className="h-6" />
```

---

#### Skeleton

```tsx
import { Skeleton } from "@vrushabh-b/oneiot-ui";

<Skeleton className="h-4 w-40" />
<Skeleton className="h-32 w-full rounded-xl" />
```

---

#### Sparkline

```tsx
import { Sparkline } from "@vrushabh-b/oneiot-ui";

<Sparkline data={[10, 24, 18, 32, 27, 41, 38]} />
<Sparkline data={[10, 24, 18, 32]} color="#02A19E" fill strokeWidth={2} />
```

| Prop | Type | Default |
|---|---|---|
| `data` | `number[]` | required |
| `color` | `string` | `"#02A19E"` |
| `fill` | `boolean` | `false` |
| `strokeWidth` | `number` | `1.5` |

---

### Forms

#### Input

```tsx
import { Input, Label } from "@vrushabh-b/oneiot-ui";

<div className="space-y-1">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

---

#### Textarea

```tsx
import { Textarea } from "@vrushabh-b/oneiot-ui";

<Textarea placeholder="Write something..." rows={4} />
```

---

#### Checkbox

```tsx
import { Checkbox, Label } from "@vrushabh-b/oneiot-ui";

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
```

---

#### Switch

```tsx
import { Switch, Label } from "@vrushabh-b/oneiot-ui";

<div className="flex items-center gap-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>
```

---

#### Slider

```tsx
import { Slider } from "@vrushabh-b/oneiot-ui";

<Slider defaultValue={[50]} min={0} max={100} step={1} />
```

---

#### Select

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@vrushabh-b/oneiot-ui";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="online">Online</SelectItem>
    <SelectItem value="offline">Offline</SelectItem>
    <SelectItem value="maintenance">Maintenance</SelectItem>
  </SelectContent>
</Select>
```

---

#### Radio Group

```tsx
import { RadioGroup, RadioGroupItem, Label } from "@vrushabh-b/oneiot-ui";

<RadioGroup defaultValue="dark">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="light" id="light" />
    <Label htmlFor="light">Light</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="dark" id="dark" />
    <Label htmlFor="dark">Dark</Label>
  </div>
</RadioGroup>
```

---

#### Progress

```tsx
import { Progress } from "@vrushabh-b/oneiot-ui";

<Progress value={72} />
```

---

### Advanced Forms

#### AdvancedInput

```tsx
import { AdvancedInput } from "@vrushabh-b/oneiot-ui";
import { Search } from "lucide-react";

<AdvancedInput
  label="Search"
  placeholder="Search devices..."
  leadingIcon={Search}
  description="Search by name or ID"
  error="Required"
  clearable
/>
```

---

#### AdvancedSelect

```tsx
import { AdvancedSelect } from "@vrushabh-b/oneiot-ui";

<AdvancedSelect
  label="Assign to"
  placeholder="Select a driver"
  options={[
    { value: "d1", label: "James Whitfield" },
    { value: "d2", label: "Sarah O'Brien" },
  ]}
  searchable
/>
```

---

#### NumberInput

```tsx
import { NumberInput } from "@vrushabh-b/oneiot-ui";

<NumberInput
  label="Speed limit"
  value={80}
  min={0}
  max={200}
  step={5}
  unit="km/h"
  onChange={(v) => console.log(v)}
/>
```

---

#### MultiSelect

```tsx
import { MultiSelect } from "@vrushabh-b/oneiot-ui";

<MultiSelect
  label="Tags"
  options={[
    { value: "fleet",      label: "Fleet" },
    { value: "cold-chain", label: "Cold Chain" },
    { value: "heavy",      label: "Heavy" },
  ]}
  value={["fleet"]}
  onChange={(vals) => console.log(vals)}
  placeholder="Select tags..."
/>
```

---

#### DropZone

```tsx
import { DropZone } from "@vrushabh-b/oneiot-ui";

<DropZone
  accept={{ "image/*": [".png", ".jpg"], "application/pdf": [".pdf"] }}
  maxSize={5 * 1024 * 1024}
  onDrop={(files) => console.log(files)}
  description="PNG, JPG, PDF up to 5 MB"
/>
```

---

#### OtpInput

```tsx
import { OtpInput } from "@vrushabh-b/oneiot-ui";

<OtpInput
  length={6}
  onComplete={(code) => verify(code)}
  masked={false}
/>
```

| Prop | Type | Default |
|---|---|---|
| `length` | `number` | `6` |
| `masked` | `boolean` | `false` |
| `onComplete` | `(value: string) => void` | — |

---

#### TagInput

```tsx
import { TagInput } from "@vrushabh-b/oneiot-ui";

<TagInput
  label="Asset tags"
  value={["fleet", "refrigerated"]}
  onChange={(tags) => setTags(tags)}
  suggestions={["fleet", "heavy", "cold-chain", "export", "warehouse"]}
  maxTags={10}
  placeholder="Add a tag..."
/>
```

---

#### IpInput

```tsx
import { IpInput } from "@vrushabh-b/oneiot-ui";

<IpInput
  label="Device IP address"
  value="192.168.1.100"
  onChange={(ip) => console.log(ip)}
  error="Invalid IP"
/>
```

---

### Data Display

#### StatCard

```tsx
import { StatCard } from "@vrushabh-b/oneiot-ui";
import { Cpu } from "lucide-react";

<StatCard
  label="Active Devices"
  value="1,284"
  delta="+8%"
  deltaPositive
  sublabel="vs last week"
  icon={Cpu}
  trend={[40, 52, 48, 61, 55, 70, 68]}
/>
```

---

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@vrushabh-b/oneiot-ui";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trips">Trips</TabsTrigger>
    <TabsTrigger value="alerts">Alerts</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="trips">Trips content</TabsContent>
  <TabsContent value="alerts">Alerts content</TabsContent>
</Tabs>
```

---

#### ProgressRing

```tsx
import { ProgressRing } from "@vrushabh-b/oneiot-ui";

<ProgressRing value={72} size={80} strokeWidth={6} label="CPU" />
<ProgressRing value={45} size={60} color="#f59e0b" />
```

| Prop | Type | Default |
|---|---|---|
| `value` | `number` (0–100) | required |
| `size` | `number` | `64` |
| `strokeWidth` | `number` | `5` |
| `color` | `string` | `"#02A19E"` |
| `label` | `string` | — |

---

#### MetricGauge

```tsx
import { MetricGauge } from "@vrushabh-b/oneiot-ui";

<MetricGauge
  label="Fuel Level"
  value={64}
  unit="%"
  min={0}
  max={100}
  thresholds={[
    { at: 20, color: "#ef4444" },
    { at: 50, color: "#f59e0b" },
  ]}
/>
```

---

#### KpiGrid

```tsx
import { KpiGrid } from "@vrushabh-b/oneiot-ui";
import type { KpiGridItem } from "@vrushabh-b/oneiot-ui";
import { Truck, Zap, AlertTriangle } from "lucide-react";

const items: KpiGridItem[] = [
  { label: "Fleet Size", value: "24", icon: Truck,         delta: "+2", deltaPositive: true },
  { label: "Active Now", value: "18", icon: Zap },
  { label: "Alerts",     value: "3",  icon: AlertTriangle, delta: "+1", deltaPositive: false },
];

<KpiGrid items={items} columns={3} />
```

---

#### CounterCard

```tsx
import { CounterCard } from "@vrushabh-b/oneiot-ui";

<CounterCard label="Total Trips" value={4821} duration={1500} suffix="+" />
```

---

### Data Tables

#### Table

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@vrushabh-b/oneiot-ui";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Asset</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Location</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Truck Fleet-07</TableCell>
      <TableCell>Moving</TableCell>
      <TableCell>M25, London</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

#### DataGrid

```tsx
import { DataGrid } from "@vrushabh-b/oneiot-ui";

const columns = [
  { accessorKey: "name",     header: "Asset" },
  { accessorKey: "status",   header: "Status" },
  { accessorKey: "location", header: "Location" },
];

<DataGrid
  data={assets}
  columns={columns}
  searchable
  pageSize={10}
/>
```

---

### Overlays

#### Dialog

```tsx
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@vrushabh-b/oneiot-ui";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

#### AlertDialog

```tsx
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@vrushabh-b/oneiot-ui";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This will permanently delete the asset.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

#### Sheet

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@vrushabh-b/oneiot-ui";

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Panel</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Asset Details</SheetTitle>
      <SheetDescription>View and edit asset information.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

---

#### DropdownMenu

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@vrushabh-b/oneiot-ui";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>View</DropdownMenuItem>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

#### Tooltip

```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@vrushabh-b/oneiot-ui";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon" variant="ghost"><Info /></Button>
    </TooltipTrigger>
    <TooltipContent>Last synced 2 minutes ago</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

#### Popover

```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@vrushabh-b/oneiot-ui";

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Filter</Button>
  </PopoverTrigger>
  <PopoverContent className="w-72">
    <p className="text-sm font-medium">Filter options</p>
  </PopoverContent>
</Popover>
```

---

#### ConfirmPrompt

```tsx
import { ConfirmPrompt } from "@vrushabh-b/oneiot-ui";

<ConfirmPrompt
  title="Remove asset?"
  description="This will remove the asset from the fleet permanently."
  onConfirm={() => deleteAsset(id)}
  trigger={<Button variant="destructive">Remove</Button>}
/>
```

---

#### Command

```tsx
import {
  Command, CommandInput, CommandList,
  CommandEmpty, CommandGroup, CommandItem,
} from "@vrushabh-b/oneiot-ui";

<Command>
  <CommandInput placeholder="Search assets..." />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Vehicles">
      <CommandItem>Truck Fleet-07</CommandItem>
      <CommandItem>Van DLV-11</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

---

#### Collapsible

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@vrushabh-b/oneiot-ui";

<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">Show details</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <p className="text-sm text-muted-foreground">Hidden content revealed here.</p>
  </CollapsibleContent>
</Collapsible>
```

---

### Feedback

#### LogViewer

```tsx
import { LogViewer } from "@vrushabh-b/oneiot-ui";
import type { LogEntry } from "@vrushabh-b/oneiot-ui";

// level: "debug" | "info" | "warning" | "error" | "critical"

const logs: LogEntry[] = [
  { id: "1", timestamp: "10:42:01", level: "info",    message: "Device connected",   source: "gateway" },
  { id: "2", timestamp: "10:42:15", level: "warning", message: "Signal strength low",source: "sensor-04" },
  { id: "3", timestamp: "10:43:02", level: "error",   message: "Connection timeout", source: "sensor-04" },
];

<LogViewer logs={logs} maxHeight={400} autoScroll searchable filterable />
```

---

#### ActivityHeatmap

```tsx
import { ActivityHeatmap } from "@vrushabh-b/oneiot-ui";

// value 0–4: 0 = none, 4 = highest activity
const data = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.now() - (364 - i) * 86400000).toISOString().slice(0, 10),
  value: Math.floor(Math.random() * 5),
}));

<ActivityHeatmap data={data} title="Trip Activity" />
```

---

#### Skeletons

Pre-built loading placeholders for common layouts.

```tsx
import {
  KpiCardSkeleton, KpiStripSkeleton, ChartSkeleton, DonutSkeleton,
  MapSkeleton, TableSkeleton, TableRowsSkeleton, FormSkeleton,
  ListItemSkeleton, AlertRowSkeleton, CardSkeleton, FieldSkeleton,
} from "@vrushabh-b/oneiot-ui";

<KpiCardSkeleton />
<KpiStripSkeleton count={4} />
<ChartSkeleton height={300} />
<TableSkeleton rows={5} cols={4} />
<FormSkeleton fields={3} />
<CardSkeleton />
<AlertRowSkeleton count={3} />
```

---

### Navigation

#### Breadcrumb

```tsx
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@vrushabh-b/oneiot-ui";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/fleet">Fleet</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Truck Fleet-07</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

#### Stepper

```tsx
import { Stepper } from "@vrushabh-b/oneiot-ui";

<Stepper
  steps={[
    { label: "Asset Info",    description: "Name, type, ID" },
    { label: "Assign Driver", description: "Select a driver" },
    { label: "Geofences",     description: "Set zones" },
    { label: "Review",        description: "Confirm details" },
  ]}
  currentStep={1}
  onStepClick={(i) => setStep(i)}
/>
```

---

### Composed

#### AlertCard

```tsx
import { AlertCard } from "@vrushabh-b/oneiot-ui";

// variant: "info" | "success" | "warning" | "error"

<AlertCard
  variant="warning"
  title="Battery Low"
  description="Container CTR-19 battery is at 17%. Charge before next dispatch."
  onDismiss={() => dismiss(id)}
  action={{ label: "View Asset", onClick: () => navigate("/assets/a3") }}
/>
```

---

#### EmptyState

```tsx
import { EmptyState } from "@vrushabh-b/oneiot-ui";
import { Truck } from "lucide-react";

<EmptyState
  icon={Truck}
  title="No assets found"
  description="Add your first asset to start tracking."
  action={{ label: "Add Asset", onClick: () => navigate("/assets/new") }}
/>
```

---

#### DeviceCard

```tsx
import { DeviceCard } from "@vrushabh-b/oneiot-ui";

// status: "online" | "offline" | "warning" | "maintenance" | "inactive"

<DeviceCard
  name="Sensor Node A-04"
  type="Temperature Sensor"
  status="online"
  lastSeen="just now"
  meta={[
    { label: "Firmware", value: "v2.4.1" },
    { label: "Signal",   value: "-62 dBm" },
  ]}
  onView={() => navigate(`/devices/${id}`)}
  onEdit={() => openEditDialog(id)}
/>
```

---

#### InfoBanner

```tsx
import { InfoBanner } from "@vrushabh-b/oneiot-ui";

// variant: "info" | "success" | "warning" | "error"

<InfoBanner
  variant="warning"
  title="Maintenance window tonight"
  description="Scheduled downtime 23:00–01:00 UTC."
  dismissible
/>
```

---

#### AlertFeed

```tsx
import { AlertFeed } from "@vrushabh-b/oneiot-ui";
import type { AlertFeedItem } from "@vrushabh-b/oneiot-ui";

// severity: "critical" | "high" | "medium" | "low" | "info"

const alerts: AlertFeedItem[] = [
  { id: "1", title: "Speeding Alert",   description: "Fleet-07 exceeded 90 km/h", severity: "high",     timestamp: "08:45", asset: "Truck Fleet-07" },
  { id: "2", title: "Geofence Exit",    description: "CTR-19 exited Zone A",      severity: "medium",   timestamp: "09:12", asset: "Container CTR-19" },
  { id: "3", title: "Battery Critical", description: "Van DLV-11 battery at 5%", severity: "critical", timestamp: "09:31", asset: "Van DLV-11" },
];

<AlertFeed
  alerts={alerts}
  maxHeight={400}
  onAlertClick={(alert) => navigate(`/alerts/${alert.id}`)}
  onDismiss={(id) => dismissAlert(id)}
/>
```

---

#### Timeline

```tsx
import { Timeline } from "@vrushabh-b/oneiot-ui";
import type { TimelineItem } from "@vrushabh-b/oneiot-ui";

const items: TimelineItem[] = [
  { id: "1", title: "Departed depot",    description: "Heathrow Depot", timestamp: "08:14", status: "completed" },
  { id: "2", title: "Delivery complete", description: "Tesco DC",       timestamp: "09:05", status: "completed" },
  { id: "3", title: "En route",          description: "Est. 40 min",    timestamp: "09:27", status: "active" },
  { id: "4", title: "Delivery pending",  description: "Sainsbury's DC", timestamp: "—",     status: "pending" },
];

<Timeline items={items} />
```

---

#### ActionsMenu

```tsx
import { ActionsMenu } from "@vrushabh-b/oneiot-ui";
import type { ActionsMenuItem } from "@vrushabh-b/oneiot-ui";
import { Eye, Pencil, Trash2 } from "lucide-react";

const actions: ActionsMenuItem[] = [
  { label: "View",   icon: Eye,    onClick: () => navigate(`/assets/${id}`) },
  { label: "Edit",   icon: Pencil, onClick: () => openEdit(id) },
  { label: "Delete", icon: Trash2, onClick: () => confirmDelete(id), destructive: true },
];

<ActionsMenu items={actions} />
```

---

### Advanced & IoT

#### DeviceMap

```tsx
import { DeviceMap } from "@vrushabh-b/oneiot-ui";
import type { DeviceMapPin } from "@vrushabh-b/oneiot-ui";

const pins: DeviceMapPin[] = [
  { id: "1", lat: 51.5074, lng: -0.1278, label: "Gateway London",    status: "online" },
  { id: "2", lat: 53.4808, lng: -2.2426, label: "Gateway Manchester", status: "warning" },
  { id: "3", lat: 55.8642, lng: -4.2518, label: "Gateway Glasgow",   status: "offline" },
];

// variant: "default" | "mini"
<DeviceMap
  pins={pins}
  variant="default"
  onPinSelect={(pin) => setSelected(pin)}
/>
```

---

#### StatTrend

```tsx
import { StatTrend } from "@vrushabh-b/oneiot-ui";

<StatTrend
  label="Fuel Consumption"
  value="8.2 L/100km"
  trend="down"
  trendValue="-0.4"
  trendLabel="vs last week"
  positive={true}
  sparkline={[9.1, 8.8, 8.6, 8.4, 8.3, 8.2]}
/>
```

---

#### CommandBar

```tsx
import { CommandBar } from "@vrushabh-b/oneiot-ui";
import type { CommandBarAction } from "@vrushabh-b/oneiot-ui";
import { Truck, AlertTriangle, Map } from "lucide-react";

// Opens on Cmd+K
const actions: CommandBarAction[] = [
  { id: "fleet",  label: "View Fleet",  icon: Truck,         shortcut: "F", onSelect: () => navigate("/fleet") },
  { id: "alerts", label: "Open Alerts", icon: AlertTriangle, shortcut: "A", onSelect: () => navigate("/alerts") },
  { id: "map",    label: "Open Map",    icon: Map,           shortcut: "M", onSelect: () => navigate("/map") },
];

<CommandBar actions={actions} placeholder="Search or run a command..." />
```

---

#### NotificationBell

```tsx
import { NotificationBell } from "@vrushabh-b/oneiot-ui";
import type { Notification } from "@vrushabh-b/oneiot-ui";

const notifications: Notification[] = [
  { id: "1", title: "Battery Critical", body: "Van DLV-11 is at 5%",     timestamp: "2 min ago",  read: false, severity: "critical" },
  { id: "2", title: "Geofence Alert",   body: "CTR-19 exited Zone A",     timestamp: "14 min ago", read: false, severity: "warning" },
  { id: "3", title: "Service Complete", body: "GEN-02 service finished",  timestamp: "1 h ago",    read: true,  severity: "info" },
];

<NotificationBell
  notifications={notifications}
  onMarkRead={(id) => markRead(id)}
  onMarkAllRead={() => markAllRead()}
  onNotificationClick={(n) => navigate(`/alerts/${n.id}`)}
/>
```

---

### Asset Tracking

#### FleetSummary

```tsx
import { FleetSummary } from "@vrushabh-b/oneiot-ui";

// Full dashboard card with utilization meter
<FleetSummary
  assets={assets}
  title="Fleet Summary"
  showUtilization
  activeFilter={statusFilter}
  onStatusFilter={(status) => setStatusFilter(status)}
/>

// Compact inline filter pills
<FleetSummary assets={assets} compact />
```

| Prop | Type | Default |
|---|---|---|
| `assets` | `Asset[]` | required |
| `title` | `string` | `"Fleet Summary"` |
| `showUtilization` | `boolean` | `true` |
| `compact` | `boolean` | `false` |
| `activeFilter` | `AssetStatus \| null` | — |
| `onStatusFilter` | `(status: AssetStatus \| null) => void` | — |

---

#### AssetCard

```tsx
import { AssetCard } from "@vrushabh-b/oneiot-ui";
import type { Asset } from "@vrushabh-b/oneiot-ui";

// status: "moving" | "idle" | "stopped" | "offline" | "maintenance"

const asset: Asset = {
  id: "a1",
  name: "Truck Fleet-07",
  type: "Vehicle",
  status: "moving",
  location: "M25, Junction 12, London",
  lastSeen: "just now",
  battery: 88,
  speed: 72,
  driver: "James Whitfield",
  tags: ["fleet", "refrigerated"],
  meta: [
    { label: "VIN",  value: "WBA3A5G59DNP26082" },
    { label: "Fuel", value: "64%" },
  ],
  recentEvents: [
    { label: "Departed depot", timestamp: "08:14", location: "Heathrow Depot" },
    { label: "Entered Zone A", timestamp: "08:31" },
  ],
};

<AssetCard
  asset={asset}
  selected={selectedId === asset.id}
  onView={() => setSelectedId(asset.id)}
  onTrack={() => openMap(asset.id)}
  onEdit={() => openEditDialog(asset.id)}
/>
```

---

#### AssetList

```tsx
import { AssetList } from "@vrushabh-b/oneiot-ui";

<AssetList
  assets={assets}
  selectedId={selectedId}
  onSelect={(asset) => setSelectedId(asset.id)}
/>
```

---

#### AssetTimeline

Gantt-style horizontal status bars across multiple assets. Segments are percentages (0–100) of the given time range.

```tsx
import { AssetTimeline } from "@vrushabh-b/oneiot-ui";
import type { AssetTimelineEntry } from "@vrushabh-b/oneiot-ui";

const entries: AssetTimelineEntry[] = [
  {
    assetId: "a1",
    assetName: "Truck Fleet-07",
    assetType: "Vehicle",
    utilization: 78,
    segments: [
      { status: "idle",    startPercent: 0,  endPercent: 8  },
      { status: "moving",  startPercent: 8,  endPercent: 34, duration: "6h 12m" },
      { status: "stopped", startPercent: 34, endPercent: 41, duration: "1h 40m" },
      { status: "moving",  startPercent: 41, endPercent: 70 },
      { status: "idle",    startPercent: 70, endPercent: 100 },
    ],
  },
];

<AssetTimeline
  entries={entries}
  timeStart="00:00"
  timeEnd="23:59"
  ticks={["00:00", "06:00", "12:00", "18:00", "24:00"]}
  showUtilization
  showLegend
  onAssetClick={(assetId) => navigate(`/assets/${assetId}`)}
/>
```

---

#### SensorPanel

```tsx
import { SensorPanel } from "@vrushabh-b/oneiot-ui";
import type { SensorReading } from "@vrushabh-b/oneiot-ui";
import { Thermometer, Gauge, Zap, Droplets } from "lucide-react";

// status: "ok" | "warning" | "critical" | "unknown"
// trend:  "up" | "down" | "stable"

const sensors: SensorReading[] = [
  {
    id: "s1",
    label: "Cargo Temp",
    value: -4,
    unit: "°C",
    status: "ok",
    trend: "stable",
    trendValue: "±0.2°",
    sparkline: [-3.8, -4, -4.1, -4, -3.9, -4.1, -4],
    min: -10,
    max: 5,
    icon: Thermometer,
    description: "Cold-chain active",
  },
  {
    id: "s2",
    label: "Fuel Level",
    value: 64,
    unit: "%",
    status: "ok",
    trend: "down",
    trendValue: "-2%",
    sparkline: [72, 70, 69, 67, 66, 65, 64],
    min: 0,
    max: 100,
    icon: Gauge,
  },
];

// columns: 2 | 3 | 4
<SensorPanel
  sensors={sensors}
  title="Live Sensor Readings"
  columns={3}
  showSparklines
/>
```

---

#### RouteMap

```tsx
import { RouteMap } from "@vrushabh-b/oneiot-ui";
import type { RouteStop } from "@vrushabh-b/oneiot-ui";

// type: "start" | "end" | "stop" | "waypoint" | "alert"

const stops: RouteStop[] = [
  { id: "r1", type: "start",    label: "Heathrow Depot",     sublabel: "London TW6",     timestamp: "08:14" },
  { id: "r2", type: "waypoint", label: "M25 Junction 12",                                timestamp: "08:31", distance: "18.4 km" },
  { id: "r3", type: "stop",     label: "Tesco DC, Cheshunt", sublabel: "Unload – 22 min",timestamp: "09:05", distance: "31.2 km", duration: "22 min" },
  { id: "r4", type: "alert",    label: "A10 Hertford",       sublabel: "Hard braking",   timestamp: "09:44", note: "Hard braking detected" },
  { id: "r5", type: "end",      label: "Milton Keynes Hub",                              timestamp: "11:32", distance: "30.2 km" },
];

// orientation: "vertical" | "horizontal"
<RouteMap
  stops={stops}
  totalDistance="142.6 km"
  totalDuration="3h 18m"
  orientation="vertical"
  animated
  onStopClick={(stop) => setActiveStop(stop)}
/>
```

---

#### MaintenanceCard

```tsx
import { MaintenanceCard } from "@vrushabh-b/oneiot-ui";
import type { MaintenanceRecord, MaintenanceTask } from "@vrushabh-b/oneiot-ui";

// record status: "completed" | "in-progress" | "scheduled" | "overdue"
// task priority: "low" | "medium" | "high" | "critical"

const records: MaintenanceRecord[] = [
  { id: "m1", date: "12 Apr 2026", type: "Full Service",  status: "completed",   technician: "Dave Singh", cost: "£380", mileage: "84,200 km" },
  { id: "m2", date: "22 May 2026", type: "Coolant Flush", status: "in-progress", technician: "A. Kumar" },
];

const upcoming: MaintenanceTask[] = [
  { id: "t1", type: "Annual MOT",            dueDate: "15 Jun 2026", dueKm: "90,000 km", priority: "high" },
  { id: "t2", type: "Brake Pad Replacement", dueDate: "Overdue",                         priority: "critical", notes: "Front pads at 12%" },
];

<MaintenanceCard
  assetName="Truck Fleet-07"
  records={records}
  upcoming={upcoming}
  nextServiceDate="15 Jun 2026"
  nextServiceKm="90,000 km"
  odometer="86,240 km"
  lastServiceDate="12 Apr 2026"
  onSchedule={() => openScheduleDialog()}
/>
```

---

#### DriverCard

```tsx
import { DriverCard } from "@vrushabh-b/oneiot-ui";
import type { DriverProfile } from "@vrushabh-b/oneiot-ui";

// status: "driving" | "available" | "off-duty" | "break"

const driver: DriverProfile = {
  id: "d1",
  name: "James Whitfield",
  initials: "JW",
  licenseNumber: "WHITF801127JM9AB",
  licenseClass: "Class C",
  licenseExpiry: "Aug 2029",
  phone: "+44 7700 900 142",
  email: "j.whitfield@fleetco.com",
  status: "driving",
  currentAsset: "Truck Fleet-07",
  currentLocation: "M25, Junction 12",
  shiftStart: "07:00",
  shiftEnd: "16:00",
  tags: ["HGV", "refrigerated"],
  stats: {
    totalTrips: 214,
    totalDistance: "28,400 km",
    hoursThisWeek: "32h",
    safetyScore: 91,
    avgSpeed: "64 km/h",
    fuelEfficiency: "8.2 L/100km",
    incidentCount: 1,
  },
};

// Full card with stats and contact actions
<DriverCard
  driver={driver}
  showStats
  showContact
  onContact={() => call(driver.phone)}
  onViewTrips={() => navigate(`/trips?driver=${driver.id}`)}
/>

// Compact single-row for lists and tables
<DriverCard driver={driver} compact />
```

---

#### TripLog

```tsx
import { TripLog } from "@vrushabh-b/oneiot-ui";
import type { Trip } from "@vrushabh-b/oneiot-ui";

// stop type: "departure" | "arrival" | "waypoint" | "stop" | "alert"

const trip: Trip = {
  id: "t1",
  assetName: "Truck Fleet-07",
  date: "21 May 2026",
  totalDistance: "142.6 km",
  totalDuration: "3h 18m",
  stops: [
    { id: "s1", type: "departure", location: "Heathrow Depot",     timestamp: "08:14" },
    { id: "s2", type: "stop",      location: "Tesco DC, Cheshunt", timestamp: "09:05", duration: "22 min", distance: "31.2 km", speed: 64 },
    { id: "s3", type: "alert",     location: "A10 Hertford",       timestamp: "09:44", note: "Hard braking detected" },
    { id: "s4", type: "arrival",   location: "Milton Keynes Hub",  timestamp: "11:32", distance: "30.2 km" },
  ],
};

<TripLog trip={trip} />
```

---

#### GeofenceBadge

```tsx
import { GeofenceBadge } from "@vrushabh-b/oneiot-ui";
import type { Geofence } from "@vrushabh-b/oneiot-ui";

// status: "inside" | "outside" | "entering" | "exiting" | "unknown"
// type:   "circle" | "polygon" | "corridor"

const geofences: Geofence[] = [
  { id: "g1", name: "Heathrow Depot",    type: "circle",   status: "outside",  exitedAt: "08:14",  distance: "47.3 km away" },
  { id: "g2", name: "M25 Corridor",      type: "corridor", status: "inside",   enteredAt: "08:28", dwellTime: "14 min" },
  { id: "g3", name: "Zone A — London",   type: "polygon",  status: "exiting",  enteredAt: "08:31", dwellTime: "22 min" },
  { id: "g4", name: "Milton Keynes Hub", type: "circle",   status: "entering", distance: "2.1 km away" },
];

// Full card view
<GeofenceBadge assetName="Truck Fleet-07" geofences={geofences} />

// Compact inline pills
<GeofenceBadge assetName="Truck Fleet-07" geofences={geofences} compact />
```

---

### Charts

All charts are built on [recharts](https://recharts.org). No extra config needed.

#### AreaChart

```tsx
import { AreaChart } from "@vrushabh-b/oneiot-ui";

<AreaChart
  data={[
    { time: "Mon", temp: 22, humidity: 61 },
    { time: "Tue", temp: 24, humidity: 58 },
  ]}
  xKey="time"
  series={[
    { key: "temp",     label: "Temperature", color: "#02A19E" },
    { key: "humidity", label: "Humidity",    color: "#6333ff" },
  ]}
  height={240}
/>
```

#### BarChart

```tsx
import { BarChart } from "@vrushabh-b/oneiot-ui";

<BarChart data={data} xKey="time" series={[{ key: "trips", label: "Trips", color: "#02A19E" }]} height={240} />
```

#### LineChart

```tsx
import { LineChart } from "@vrushabh-b/oneiot-ui";

<LineChart data={data} xKey="time" series={[{ key: "speed", label: "Avg Speed", color: "#02A19E" }]} height={240} />
```

#### PieChart

```tsx
import { PieChart } from "@vrushabh-b/oneiot-ui";
import type { PieDatum } from "@vrushabh-b/oneiot-ui";

const slices: PieDatum[] = [
  { name: "Moving",      value: 12, color: "#02A19E" },
  { name: "Idle",        value: 5,  color: "#f59e0b" },
  { name: "Offline",     value: 2,  color: "#ef4444" },
];

<PieChart data={slices} height={260} donut />
```

#### RadarChart

```tsx
import { RadarChart } from "@vrushabh-b/oneiot-ui";

<RadarChart
  data={[
    { metric: "Safety",      score: 91 },
    { metric: "Fuel Eff.",   score: 78 },
    { metric: "Punctuality", score: 85 },
  ]}
  angleKey="metric"
  series={[{ key: "score", label: "Driver Score", color: "#02A19E" }]}
/>
```

#### RadialChart

```tsx
import { RadialChart } from "@vrushabh-b/oneiot-ui";

<RadialChart value={78} max={100} label="Utilization" color="#02A19E" />
```

#### ScatterChart

```tsx
import { ScatterChart } from "@vrushabh-b/oneiot-ui";

<ScatterChart
  data={[{ speed: 62, fuel: 8.1 }, { speed: 71, fuel: 9.4 }]}
  xKey="speed"
  yKey="fuel"
  xLabel="Speed (km/h)"
  yLabel="Fuel (L/100km)"
  color="#02A19E"
/>
```

#### SparklineChart

```tsx
import { SparklineChart } from "@vrushabh-b/oneiot-ui";

<SparklineChart data={[40, 52, 48, 61, 55, 70, 68]} color="#02A19E" height={40} />
```

---

### Layout

#### Shell

```tsx
import { Shell } from "@vrushabh-b/oneiot-ui";
import type { BreadcrumbEntry } from "@vrushabh-b/oneiot-ui";

<Shell breadcrumbs={[{ label: "Fleet", href: "/fleet" }, { label: "Truck Fleet-07" }]}>
  <YourPageContent />
</Shell>
```

#### AppSidebar + NavMain + NavUser

```tsx
import { AppSidebar, NavMain, NavUser, BrandLogo } from "@vrushabh-b/oneiot-ui";
import type { NavMainItem, NavUserData } from "@vrushabh-b/oneiot-ui";
import { LayoutDashboard, Truck, Map, Bell } from "lucide-react";

const navItems: NavMainItem[] = [
  { title: "Dashboard", url: "/",       icon: LayoutDashboard },
  { title: "Fleet",     url: "/fleet",  icon: Truck },
  { title: "Map",       url: "/map",    icon: Map },
  { title: "Alerts",    url: "/alerts", icon: Bell, badge: 3 },
];

const user: NavUserData = {
  name: "James Whitfield",
  email: "j.whitfield@oneiot.io",
  avatar: "/avatar.jpg",
};

<AppSidebar>
  <BrandLogo />
  <NavMain items={navItems} />
  <NavUser user={user} />
</AppSidebar>
```

#### PageHeader

```tsx
import { PageHeader, PageHeaderHeading, PageHeaderDescription, PageActions } from "@vrushabh-b/oneiot-ui";

<PageHeader>
  <PageHeaderHeading>Fleet Management</PageHeaderHeading>
  <PageHeaderDescription>Monitor and manage all your assets in real time.</PageHeaderDescription>
  <PageActions>
    <Button variant="outline">Export</Button>
    <Button variant="teal" leadingIcon={Plus}>Add Asset</Button>
  </PageActions>
</PageHeader>
```

#### FormDialog / FormSheet

```tsx
import { FormDialog, FormSheet } from "@vrushabh-b/oneiot-ui";

<FormDialog
  title="Add Asset"
  description="Fill in the details to register a new asset."
  trigger={<Button>Add Asset</Button>}
  onSubmit={(e) => { e.preventDefault(); saveAsset(); }}
  submitLabel="Save Asset"
>
  <Input placeholder="Asset name" />
</FormDialog>

<FormSheet
  title="Edit Asset"
  trigger={<Button variant="outline">Edit</Button>}
  onSubmit={(e) => { e.preventDefault(); updateAsset(); }}
>
  <Input defaultValue={asset.name} />
</FormSheet>
```

---

## TypeScript

All props and data types are exported:

```tsx
import type {
  // Primitives
  ButtonProps, BadgeProps, PillProps, SparklineProps, InputProps,

  // Asset tracking
  Asset, AssetStatus, AssetEvent, AssetCardProps, AssetListProps,
  AssetTimelineEntry, AssetTimelineProps, TimelineSegment,
  SensorReading, SensorStatus, SensorPanelProps,
  RouteStop, RouteStopType, RouteMapProps,
  MaintenanceRecord, MaintenanceTask, MaintenancePriority, MaintenanceStatus, MaintenanceCardProps,
  DriverProfile, DriverStatus, DriverStats, DriverCardProps,
  Trip, TripStop, TripLogProps,
  Geofence, GeofenceStatus, GeofenceBadgeProps,
  FleetSummaryProps,

  // Devices & IoT
  DeviceMapPin, DeviceMapProps, DeviceStatus, DeviceCardProps,
  AlertFeedItem, AlertFeedProps, AlertSeverity,
  Notification, NotificationBellProps,
  CommandBarAction, CommandBarProps,
  LogEntry, LogLevel, LogViewerProps,

  // Charts
  PieDatum, ChartConfig,

  // Theme
  V2Theme, V2Mode, V2Prefs,

  // Layout
  BreadcrumbEntry, NavMainItem, NavUserData,
  KpiGridItem, KpiGridProps, CounterCardProps,
  TimelineItem, TimelineProps,
  StatCardProps, StatTrendProps,
  EmptyStateProps, AlertCardProps, InfoBannerProps,
  StepperProps, NumberInputProps, MultiSelectProps,
  DropZoneProps, ProgressRingProps, MetricGaugeProps,
  OtpInputProps, TagInputProps, IpInputProps,
  ActivityHeatmapProps,
} from "@vrushabh-b/oneiot-ui";
```

---

## Publishing

### New version via GitHub Actions (recommended)

1. Go to `github.com/vrushabh-b/oneiot-ui` → **Actions** → **Publish Package** → **Run workflow**
2. Choose `patch`, `minor`, or `major`
3. The workflow bumps the version, commits, tags, and publishes automatically

### New version via GitHub Release

1. Go to **Releases** → **Draft a new release**
2. Create a tag like `v0.2.0` and publish
3. The workflow triggers automatically

### Manual publish

```bash
npm version patch   # or minor / major
NODE_AUTH_TOKEN=YOUR_PAT pnpm publish --no-git-checks
git push origin main --tags
```

---

## License

Private — for internal OneIoT platform use only.
