import { useState } from 'react';
import { AppSidebar, useTheme, SidebarProvider, SidebarInset, SidebarTrigger } from '@vrushabh-b/oneiot-ui';
import { Building2, Map, Network, AlertTriangle, FileText, Settings } from 'lucide-react';
import { FacilityDashboardWithTabs } from './components/dashboard/FacilityDashboardWithTabs';
import { RegionalDashboardWithTabs } from './components/dashboard/RegionalDashboardWithTabs';
import { HQDashboardWithTabs } from './components/dashboard/HQDashboardWithTabs';
import brandLogoWhite from '@/assets/brandLogoWhite.png';
import brandLogoBlack from '@/assets/brandLogoBlack.png';
import brandLogoCollapsed from '@/assets/brandLogoCollapsed.png';
import './index.css';

type ViewType = 'facility' | 'regional' | 'hq';

const VIEW_LABELS: Record<ViewType, string> = {
  facility: 'Facility Monitor',
  regional: 'Regional View',
  hq: 'HQ Network',
};

const VIEW_PATHS: Record<ViewType, string> = {
  facility: '/facility',
  regional: '/regional',
  hq: '/hq',
};

function LogoExpanded() {
  const { mode } = useTheme();
  return (
    <img
      src={mode === 'dark' ? brandLogoWhite : brandLogoBlack}
      alt="OneIoT"
      className="h-8 object-contain"
    />
  );
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('facility');

  const currentPath = VIEW_PATHS[currentView];

  const navItems = [
    {
      title: 'Facility Monitor',
      url: '/facility',
      icon: Building2,
    },
    {
      title: 'Regional View',
      url: '/regional',
      icon: Map,
    },
    {
      title: 'HQ Network',
      url: '/hq',
      icon: Network,
    },
    {
      title: 'Alerts',
      url: '/alerts',
      icon: AlertTriangle,
    },
    {
      title: 'Reports',
      url: '/reports',
      icon: FileText,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ];

  const user = {
    name: 'Facility Manager',
    email: 'manager@coldguard.in',
  };

  const renderLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <button
      className={className}
      onClick={() => {
        const view = (Object.entries(VIEW_PATHS) as [ViewType, string][]).find(([, path]) => path === href)?.[0];
        if (view) setCurrentView(view);
      }}
    >
      {children}
    </button>
  );

  const renderDashboard = () => {
    switch (currentView) {
      case 'facility': return <FacilityDashboardWithTabs />;
      case 'regional': return <RegionalDashboardWithTabs />;
      case 'hq': return <HQDashboardWithTabs />;
    }
  };

  return (
    <div className="ui-v2 bg-background text-foreground min-h-screen">
      <SidebarProvider>
        <AppSidebar
          navItems={navItems}
          user={user}
          currentPath={currentPath}
          logoExpanded={<LogoExpanded />}
          logoCollapsed={<img src={brandLogoCollapsed} alt="OneIoT" className="h-7 w-7 object-contain" />}
          showThemeToggle
          renderLink={renderLink}
        />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border" />
            {/* <span className="text-sm font-medium text-foreground">{VIEW_LABELS[currentView]}</span> */}
          </header>
          <main className="p-6">
            {renderDashboard()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default App;
