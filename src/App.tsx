import { useState } from 'react';
import { ThemeProvider, SidebarProvider, SidebarInset, SidebarTrigger, Sheet } from '@vrushabh-b/oneiot-ui';
import {
  AlertTriangle, Settings,
  ClipboardCheck, BarChart2,
  ChevronDown, Globe, Warehouse, Layers, BookOpen, Home,
} from 'lucide-react';
import { AppSidebar } from './components/Sidebar';
import { FacilityDashboardWithTabs, FacilityTabBar, FacilityAlertsButton, FacilityAlertsSheetContent } from './components/dashboard/FacilityDashboardWithTabs';
import { RegionalDashboardWithTabs } from './components/dashboard/RegionalDashboardWithTabs';
import { HQDashboardWithTabs } from './components/dashboard/HQDashboardWithTabs';
import { InspectionPage } from './components/stock/InspectionPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { AlertsPage } from './components/alerts/AlertsPage';
import { RegionsPage } from './components/setup/RegionsPage';
import { FacilitiesPage } from './components/setup/FacilitiesPage';
import { ZonesPage } from './components/setup/ZonesPage';
import { BookingsPage } from './components/bookings/BookingsPage';
import { ZoneDetailPage } from './components/zones/ZoneDetailPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { SetupProvider } from './contexts/SetupContext';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { BookingsProvider } from './contexts/BookingsContext';

import './index.css';

type ViewType =
  | 'facility' | 'regional' | 'hq'
  | 'bookings' | 'inspection'
  | 'reports' | 'alerts'
  | 'regions' | 'facilities' | 'zones' | 'zone-detail'
  | 'settings'
  | 'facility-detail' | 'regional-detail';

type Role = 'facility' | 'regional' | 'hq';

const VIEW_LABELS: Record<ViewType, string> = {
  facility: 'Home',
  regional: 'Home',
  hq: 'Home',
  bookings: 'Bookings',
  inspection: 'Periodic Inspection',
  alerts: 'Alerts',
  reports: 'Reports',
  regions: 'Regions',
  facilities: 'Facilities',
  zones: 'Zones',
  'zone-detail': 'Zone Detail',
  settings: 'Settings',
  'facility-detail': 'Facility Dashboard',
  'regional-detail': 'Regional Dashboard',
};

const VIEW_PATHS: Record<ViewType, string> = {
  facility: '/home',
  regional: '/home',
  hq: '/home',
  bookings: '/bookings',
  inspection: '/inspection',
  alerts: '/alerts',
  reports: '/reports',
  regions: '/regions',
  facilities: '/facilities',
  zones: '/zones',
  'zone-detail': '/zones',
  settings: '/settings',
  'facility-detail': '/facilities',
  'regional-detail': '/regions',
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

const ROLE_HOME_VIEW: Record<Role, ViewType> = {
  facility: 'facility',
  regional: 'regional',
  hq: 'hq',
};

const ROLE_NAV_ITEMS: Record<Role, { title: string; url: string; icon: typeof Home }[]> = {
  facility: [
    { title: 'Home',       url: '/home',       icon: Home },
    { title: 'Zones',      url: '/zones',       icon: Layers },
    { title: 'Bookings',   url: '/bookings',    icon: BookOpen },
    { title: 'Inspection', url: '/inspection',  icon: ClipboardCheck },
    { title: 'Alerts',     url: '/alerts',      icon: AlertTriangle },
    { title: 'Reports',    url: '/reports',     icon: BarChart2 },
    { title: 'Settings',   url: '/settings',    icon: Settings },
  ],
  regional: [
    { title: 'Home',         url: '/home',        icon: Home },
    { title: 'Facilities',   url: '/facilities',  icon: Warehouse },
    { title: 'Alerts',       url: '/alerts',      icon: AlertTriangle },
    { title: 'Reports',      url: '/reports',     icon: BarChart2 },
    { title: 'Settings',     url: '/settings',    icon: Settings },
  ],
  hq: [
    { title: 'Home',         url: '/home',        icon: Home },
    { title: 'Regions',      url: '/regions',     icon: Globe },
    { title: 'Facilities',   url: '/facilities',  icon: Warehouse },
    { title: 'Alerts',       url: '/alerts',      icon: AlertTriangle },
    { title: 'Reports',      url: '/reports',     icon: BarChart2 },
    { title: 'Settings',     url: '/settings',    icon: Settings },
  ],
};

function resolveView(url: string, role: Role): ViewType {
  if (url === '/home') return ROLE_HOME_VIEW[role];
  const map: Record<string, ViewType> = {
    '/bookings': 'bookings',
    '/inspection': 'inspection',
    '/alerts': 'alerts',
    '/reports': 'reports',
    '/regions': 'regions',
    '/facilities': 'facilities',
    '/zones': 'zones',
    '/settings': 'settings',
  };
  return map[url] ?? ROLE_HOME_VIEW[role];
}

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
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setCurrentView(ROLE_DEFAULT_VIEW[newRole]);
    setSelectedFacilityId(null);
    setSelectedRegionId(null);
  };

  const navItems = ROLE_NAV_ITEMS[role];

  const homeViews: ViewType[] = ['facility', 'regional', 'hq'];
  const currentPath = homeViews.includes(currentView) ? '/home' : VIEW_PATHS[currentView];

  const handleNavigate = (url: string) => {
    const view = resolveView(url, role);
    setCurrentView(view);
    if (url !== '/facilities') setSelectedFacilityId(null);
    if (url !== '/regions') setSelectedRegionId(null);
  };

  const renderDashboard = () => {
    switch (currentView) {
      case 'facility':    return <FacilityDashboardWithTabs tab={facilityTab} setTab={setFacilityTab} />;
      case 'regional':    return <RegionalDashboardWithTabs />;
      case 'hq':          return <HQDashboardWithTabs />;
      case 'bookings':    return <BookingsPage />;
      case 'inspection':  return <InspectionPage />;
      case 'reports':     return <ReportsPage />;
      case 'alerts':      return <AlertsPage />;
      case 'regions':     return (
        <RegionsPage
          onSelectRegion={id => { setSelectedRegionId(id); setCurrentView('regional-detail'); }}
        />
      );
      case 'facilities':  return (
        <FacilitiesPage
          onSelectFacility={role === 'regional' || role === 'hq'
            ? (id => { setSelectedFacilityId(id); setCurrentView('facility-detail'); })
            : undefined}
        />
      );
      case 'zones':       return (
        <ZonesPage
          onSelectZone={id => { setSelectedZoneId(id); setCurrentView('zone-detail'); }}
        />
      );
      case 'zone-detail': return selectedZoneId ? (
        <ZoneDetailPage
          zoneId={selectedZoneId}
          onBack={() => { setSelectedZoneId(null); setCurrentView('zones'); }}
        />
      ) : null;
      case 'facility-detail': return (
        <FacilityDashboardWithTabs
          tab={facilityTab}
          setTab={setFacilityTab}
          facilityId={selectedFacilityId ?? undefined}
          onBack={() => { setSelectedFacilityId(null); setCurrentView('facilities'); }}
        />
      );
      case 'regional-detail': return (
        <RegionalDashboardWithTabs
          regionId={selectedRegionId ?? undefined}
          onBack={() => { setSelectedRegionId(null); setCurrentView('regions'); }}
        />
      );
      case 'settings':    return <SettingsPage />;
    }
  };

  const renderHeaderExtras = () => {
    if (currentView === 'facility' || currentView === 'facility-detail') {
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

  const headerLabel = (() => {
    if (currentView === 'facility-detail' && selectedFacilityId) return `Facility: ${selectedFacilityId}`;
    if (currentView === 'regional-detail' && selectedRegionId) return `Region: ${selectedRegionId}`;
    return VIEW_LABELS[currentView];
  })();

  return (
    <ThemeProvider defaultMode="dark" applyToDocument>
    <div className="ui-v2 bg-background text-foreground min-h-screen">
      <SetupProvider>
        <WorkflowProvider>
        <BookingsProvider>
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
              <span className="text-sm font-medium text-foreground">{headerLabel}</span>
              {renderHeaderExtras()}
              <RoleSwitcher role={role} onRoleChange={handleRoleChange} />
            </header>
            <main className="p-6">
              {renderDashboard()}
            </main>
          </SidebarInset>
        </SidebarProvider>
        {(currentView === 'facility' || currentView === 'facility-detail') && <FacilityAlertsSheetContent />}
        </Sheet>
        </BookingsProvider>
        </WorkflowProvider>
      </SetupProvider>
    </div>
    </ThemeProvider>
  );
}

export default App;
