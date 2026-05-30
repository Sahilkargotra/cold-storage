import { RegionalDashboard } from './RegionalDashboard';

interface RegionalDashboardWithTabsProps {
  regionId?: string;
  onBack?: () => void;
}

export function RegionalDashboardWithTabs({ onBack }: RegionalDashboardWithTabsProps) {
  return (
    <div className="space-y-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Regions
        </button>
      )}
      <RegionalDashboard />
    </div>
  );
}
