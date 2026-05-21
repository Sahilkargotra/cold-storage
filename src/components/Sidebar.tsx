import type { ComponentProps } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@vrushabh-b/oneiot-ui';
import {
  Building2,
  Map,
  Network,
  AlertTriangle,
  FileText,
  Settings,
  Zap,
  Package,
  Thermometer,
  TrendingDown,
} from 'lucide-react';
import brandLogo from '@/assets/brandLogoWhite.png';
import brandLogoCollapsed from '@/assets/brandLogoCollapsed.png';

type ViewType = 'facility' | 'regional' | 'hq';

interface AppSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const WrappedMenuButton = (props: ComponentProps<typeof SidebarMenuButton>) => (
  <SidebarMenuButton {...props} />
);

function Logo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center h-14 px-3">
      {state === 'collapsed' ? (
        <img src={brandLogoCollapsed} alt="OneIoT" className="h-8 w-8 object-contain mx-auto" />
      ) : (
        <img src={brandLogo} alt="OneIoT" className="h-8 object-contain" />
      )}
    </div>
  );
}

function FooterStats() {
  const { state } = useSidebar();
  if (state === 'collapsed') {
    return (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="flex flex-col items-center gap-1" title="Energy Today: ₹18,450 ↓12%">
          <Zap className="h-4 w-4 text-[#02A19E]" />
        </div>
        <div className="flex flex-col items-center gap-1" title="Avg Occupancy: 86%">
          <Package className="h-4 w-4 text-[#6333ff]" />
        </div>
      </div>
    );
  }
  return (
    <div className="px-3 py-3 space-y-2">
      <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#02A19E]/15 flex-shrink-0">
          <Zap className="h-4 w-4 text-[#02A19E]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-sidebar-foreground/60 truncate">Energy Today</p>
          <p className="text-sm font-bold text-sidebar-foreground truncate">₹18,450</p>
          <p className="text-xs text-green-400 flex items-center gap-1 truncate">
            <TrendingDown className="h-3 w-3" />
            12% from yesterday
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#6333ff]/15 flex-shrink-0">
          <Package className="h-4 w-4 text-[#6333ff]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-sidebar-foreground/60 truncate">Avg Occupancy</p>
          <p className="text-sm font-bold text-sidebar-foreground truncate">86%</p>
          <p className="text-xs text-sidebar-foreground/50 truncate">Across all zones</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500/15 flex-shrink-0">
          <Thermometer className="h-4 w-4 text-yellow-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-sidebar-foreground/60 truncate">Avg Temp</p>
          <p className="text-sm font-bold text-sidebar-foreground truncate">3 zones OK</p>
          <p className="text-xs text-sidebar-foreground/50 truncate">1 alert active</p>
        </div>
      </div>
    </div>
  );
}

const operationsItems = [
  { id: 'facility' as const, label: 'Facility Monitor', icon: Building2, description: 'Zone monitoring' },
  { id: 'regional' as const, label: 'Regional View', icon: Map, description: 'Multi-facility' },
  { id: 'hq' as const, label: 'HQ Network', icon: Network, description: 'Pan-India view' },
];

const managementItems = [
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: '2' },
  { id: 'reports', label: 'Reports', icon: FileText, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
] as const;

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <WrappedMenuButton
                      isActive={currentView === item.id}
                      tooltip={item.label}
                      onClick={() => onViewChange(item.id)}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </WrappedMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <WrappedMenuButton tooltip={item.label}>
                      <Icon />
                      <span>{item.label}</span>
                    </WrappedMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <FooterStats />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
