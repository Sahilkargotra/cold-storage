import { Tabs, TabsContent } from '@vrushabh-b/oneiot-ui';
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  AlertFeed,
} from '@vrushabh-b/oneiot-ui';
import type { AlertFeedItem } from '@vrushabh-b/oneiot-ui';
import { Bell } from 'lucide-react';
import { FacilityDashboard } from './FacilityDashboard';
import { chennaiFacility } from '@/data/mockData';

function buildAlertFeedItems(): AlertFeedItem[] {
  return chennaiFacility.zones.flatMap(z =>
    z.alerts.map(a => ({
      id: a.id,
      severity: (a.severity === 'critical' ? 'destructive' : a.severity === 'warning' ? 'warning' : 'info') as AlertFeedItem['severity'],
      title: a.message,
      timestamp: a.time,
      device: z.name,
    })),
  );
}

const alertFeedItems = buildAlertFeedItems();
const criticalCount = alertFeedItems.filter(a => a.severity === 'destructive').length;

export function FacilityAlertsSheetContent() {
  return (
    <SheetContent side="right" className="w-[420px] sm:w-[480px] flex flex-col gap-0 p-0">
      <SheetHeader className="px-5 py-4 border-b border-border">
        <SheetTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Active Alerts
          {criticalCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold px-2 py-0.5">
              {criticalCount} critical
            </span>
          )}
        </SheetTitle>
        <SheetDescription>
          {alertFeedItems.length} alert{alertFeedItems.length !== 1 ? 's' : ''} across all zones
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-4">
        {alertFeedItems.length > 0 ? (
          <AlertFeed items={alertFeedItems} showHeader={false} maxHeight="100%" />
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
            <Bell className="h-8 w-8 opacity-30" />
            No active alerts
          </div>
        )}
      </div>
    </SheetContent>
  );
}

export function FacilityAlertsButton() {
  return (
    <SheetTrigger asChild>
      <button className="relative inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
        <Bell className="h-4 w-4" />
        Alerts
        {criticalCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {criticalCount}
          </span>
        )}
      </button>
    </SheetTrigger>
  );
}

interface FacilityTabBarProps {
  tab: string;
  setTab: (t: string) => void;
}

export function FacilityTabBar({ tab, setTab }: FacilityTabBarProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted p-1 gap-1">
      {(['operations'] as const).map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            tab === t
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Operations
        </button>
      ))}
    </div>
  );
}

interface FacilityDashboardWithTabsProps {
  tab: string;
  setTab: (t: string) => void;
}

export function FacilityDashboardWithTabs({ tab, setTab }: FacilityDashboardWithTabsProps) {
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsContent value="operations" className="space-y-6">
        <FacilityDashboard />
      </TabsContent>
    </Tabs>
  );
}
