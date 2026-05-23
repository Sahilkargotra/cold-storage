import { useState } from 'react';
import { ThemeProvider, SidebarProvider, SidebarInset, SidebarTrigger, Sheet } from '@vrushabh-b/oneiot-ui';
import {
  Building2, Map, Network, AlertTriangle, Settings,
  PackagePlus, PackageMinus, ClipboardCheck, BarChart2,
  ChevronDown, Globe, Warehouse, Layers,
} from 'lucide-react';
import { AppSidebar } from './components/Sidebar';
import { FacilityDashboardWithTabs, FacilityTabBar, FacilityAlertsButton, FacilityAlertsSheetContent } from './components/dashboard/FacilityDashboardWithTabs';
import { RegionalDashboardWithTabs } from './components/dashboard/RegionalDashboardWithTabs';
import { HQDashboardWithTabs } from './components/dashboard/HQDashboardWithTabs';
import { StockEntryPage } from './components/stock/StockEntryPage';
import { StockExitPage } from './components/stock/StockExitPage';
import { InspectionPage } from './components/stock/InspectionPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { AlertsPage } from './components/alerts/AlertsPage';
import { RegionsPage } from './components/setup/RegionsPage';
import { FacilitiesPage } from './components/setup/FacilitiesPage';
import { ZonesPage } from './components/setup/ZonesPage';
import { SetupProvider } from './contexts/SetupContext';
import { WorkflowProvider } from './contexts/WorkflowContext';

import './index.css';

type ViewType =
  | 'facility' | 'regional' | 'hq'
  | 'stock-entry' | 'stock-exit' | 'inspection'
  | 'reports' | 'alerts'
  | 'regions' | 'facilities' | 'zones';

type Role = 'facility' | 'regional' | 'hq';

const VIEW_LABELS: Record<ViewType, string> = {
  facility: 'Facility Monitor',
  regional: 'Regional View',
  hq: 'HQ Network',
  'stock-entry': 'Stock Entry',
  'stock-exit': 'Stock Exit',
  inspection: 'Periodic Inspection',
  alerts: 'Alerts',
  reports: 'Reports',
  regions: 'Regions',
  facilities: 'Facilities',
  zones: 'Zones',
};

const VIEW_PATHS: Record<ViewType, string> = {
  facility: '/facility',
  regional: '/regional',
  hq: '/hq',
  'stock-entry': '/stock-entry',
  'stock-exit': '/stock-exit',
  inspection: '/inspection',
  alerts: '/alerts',
  reports: '/reports',
  regions: '/regions',
  facilities: '/facilities',
  zones: '/zones',
};

const ROLE_META: Record<Role, { label: string; sublabel: string; name: string; email: string }> = {
  facility: {
    label: 'Facility Manager',
    sublabel: 'Chennai Cold Storage',
    name: 'Rajesh Kumar',
    email: 'rajesh@coldguard.in',
  },
  regional: {
    label: 'Regional Manager',
    sublabel: 'South India Region',
    name: 'Priya Nair',
    email: 'priya.nair@coldguard.in',
  },
  hq: {
    label: 'HQ / COO',
    sublabel: 'Pan-India Network',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@coldguard.in',
  },
};

const ROLE_DEFAULT_VIEW: Record<Role, ViewType> = {
  facility: 'facility',
  regional: 'regional',
  hq: 'hq',
};

const ALL_NAV_ITEMS = [
  { title: 'Facility Monitor', url: '/facility',    icon: Building2,     roles: ['facility', 'regional', 'hq'] as Role[] },
  { title: 'Regional View',    url: '/regional',    icon: Map,           roles: ['regional', 'hq'] as Role[] },
  { title: 'HQ Network',       url: '/hq',          icon: Network,       roles: ['hq'] as Role[] },
  { title: 'Stock Entry',      url: '/stock-entry', icon: PackagePlus,    roles: ['facility'] as Role[] },
  { title: 'Stock Exit',       url: '/stock-exit',  icon: PackageMinus,   roles: ['facility'] as Role[] },
  { title: 'Inspection',       url: '/inspection',  icon: ClipboardCheck, roles: ['facility'] as Role[] },
  { title: 'Regions',          url: '/regions',     icon: Globe,          roles: ['regional', 'hq'] as Role[] },
  { title: 'Facilities',       url: '/facilities',  icon: Warehouse,      roles: ['regional', 'hq'] as Role[] },
  { title: 'Zones',            url: '/zones',       icon: Layers,         roles: ['facility', 'regional', 'hq'] as Role[] },
  { title: 'Alerts',           url: '/alerts',      icon: AlertTriangle,  roles: ['facility', 'regional', 'hq'] as Role[] },
  { title: 'Reports',          url: '/reports',     icon: BarChart2,      roles: ['facility', 'regional', 'hq'] as Role[] },
  { title: 'Settings',         url: '/settings',    icon: Settings,       roles: ['facility', 'regional', 'hq'] as Role[] },
];

function RoleSwitcher({ role, onRoleChange }: { role: Role; onRoleChange: (r: Role) => void }) {
  const meta = ROLE_META[role];
  return (
    <div className="relative flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm cursor-pointer hover:bg-muted/80 transition-colors">
        <span className="font-medium text-foreground">{meta.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
          value={role}
          onChange={e => onRoleChange(e.target.value as Role)}
          aria-label="Switch role"
        >
          <option value="facility">Facility Manager — {ROLE_META.facility.sublabel}</option>
          <option value="regional">Regional Manager — {ROLE_META.regional.sublabel}</option>
          <option value="hq">HQ / COO — {ROLE_META.hq.sublabel}</option>
        </select>
      </div>
      <span className="hidden sm:block text-xs text-muted-foreground">{meta.sublabel}</span>
    </div>
  );
}

function App() {
  const [role, setRole] = useState<Role>('facility');
  const [currentView, setCurrentView] = useState<ViewType>('facility');
  const [facilityTab, setFacilityTab] = useState('operations');

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setCurrentView(ROLE_DEFAULT_VIEW[newRole]);
  };

  const navItems = ALL_NAV_ITEMS.filter(item => item.roles.includes(role));

  const currentPath = VIEW_PATHS[currentView];

  const handleNavigate = (url: string) => {
    const view = (Object.entries(VIEW_PATHS) as [ViewType, string][]).find(([, path]) => path === url)?.[0];
    if (view) setCurrentView(view);
  };

  const renderDashboard = () => {
    switch (currentView) {
      case 'facility':    return <FacilityDashboardWithTabs tab={facilityTab} setTab={setFacilityTab} />;
      case 'regional':    return <RegionalDashboardWithTabs />;
      case 'hq':          return <HQDashboardWithTabs />;
      case 'stock-entry': return <StockEntryPage />;
      case 'stock-exit':  return <StockExitPage />;
      case 'inspection':  return <InspectionPage />;
      case 'reports':     return <ReportsPage />;
      case 'alerts':      return <AlertsPage />;
      case 'regions':     return <RegionsPage />;
      case 'facilities':  return <FacilitiesPage />;
      case 'zones':       return <ZonesPage />;
    }
  };

  const renderHeaderExtras = () => {
    if (currentView === 'facility') {
      return (
        <>
          <div className="flex-1" />
          <FacilityAlertsButton />
          <FacilityTabBar tab={facilityTab} setTab={setFacilityTab} />
        </>
      );
    }
    return <div className="flex-1" />;
  };

  return (
    <ThemeProvider defaultMode="dark" applyToDocument>
    <div className="ui-v2 bg-background text-foreground min-h-screen">
      <SetupProvider>
        <WorkflowProvider>
        <Sheet>
        <SidebarProvider>
          <AppSidebar
            navItems={navItems}
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-border" />
              <span className="text-sm font-medium text-foreground">{VIEW_LABELS[currentView]}</span>
              {renderHeaderExtras()}
              <RoleSwitcher role={role} onRoleChange={handleRoleChange} />
            </header>
            <main className="p-6">
              {renderDashboard()}
            </main>
          </SidebarInset>
        </SidebarProvider>
        {currentView === 'facility' && <FacilityAlertsSheetContent />}
        </Sheet>
        </WorkflowProvider>
      </SetupProvider>
    </div>
    </ThemeProvider>
  );
}

export default App;
