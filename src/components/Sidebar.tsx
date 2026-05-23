import { useTheme } from '@vrushabh-b/oneiot-ui';
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
import { Sun, Moon, Monitor, Zap, Package, Thermometer, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import brandLogoWhite from '@/assets/brandLogoWhite.png';
import brandLogoBlack from '@/assets/brandLogoBlack.png';
import brandLogoCollapsed from '@/assets/brandLogoCollapsed.png';

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}

interface AppSidebarProps {
  navItems: NavItem[];
  currentPath: string;
  onNavigate: (url: string) => void;
}

function Logo() {
  const { state } = useSidebar();
  const { mode } = useTheme();
  if (state === 'collapsed') {
    return (
      <div className="flex h-14 items-center justify-center px-2">
        <img src={brandLogoCollapsed} alt="OneIoT" className="h-7 w-7 object-contain" />
      </div>
    );
  }
  return (
    <div className="flex h-14 items-center px-4">
      <img
        src={mode === 'dark' ? brandLogoWhite : brandLogoBlack}
        alt="OneIoT"
        className="h-7 object-contain"
      />
    </div>
  );
}

function ThemeToggle() {
  const { state } = useSidebar();
  const { mode, setMode } = useTheme();

  const options: { value: 'light' | 'dark' | 'system'; icon: LucideIcon; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'dark', icon: Moon, label: 'Dark' },
  ];

  if (state === 'collapsed') {
    const CycleIcon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor;
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={() => {
            const next = mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark';
            setMode(next);
          }}
          title={`Theme: ${mode}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <CycleIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 pb-2">
      <div
        role="group"
        aria-label="Theme mode"
        className="inline-flex w-full items-center rounded-lg border border-sidebar-border bg-sidebar-accent p-0.5 gap-0.5"
      >
        {options.map(({ value, icon: Icon, label }) => {
          const isActive = mode === value;
          return (
            <button
              key={value}
              onClick={() => setMode(value)}
              aria-label={label}
              aria-pressed={isActive}
              title={label}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-sidebar-foreground/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FooterStats() {
  const { state } = useSidebar();
  if (state === 'collapsed') {
    return (
      <div className="flex flex-col items-center gap-3 py-3">
        <div title="Energy Today: ₹18,450 ↓12%">
          <Zap className="h-4 w-4 text-[#02A19E]" />
        </div>
        <div title="Avg Occupancy: 86%">
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

export function AppSidebar({ navItems, currentPath, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-0">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => onNavigate(item.url)}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-0">
        <FooterStats />
        <ThemeToggle />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
