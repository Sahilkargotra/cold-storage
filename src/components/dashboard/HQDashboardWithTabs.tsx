import { Tabs, TabsList, TabsTrigger, TabsContent } from '@vrushabh-b/oneiot-ui';
import { HQDashboard } from './HQDashboard';
import { networkMetrics, regionalFacilities } from '@/data/mockData';

export function HQDashboardWithTabs() {
  return (
    <Tabs defaultValue="operations" className="w-full">
      <div className="flex items-center justify-end mb-6">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="operations" className="space-y-6">
        <HQDashboard />
      </TabsContent>

      <TabsContent value="revenue" className="space-y-6">
        <HQRevenueDashboard />
      </TabsContent>
    </Tabs>
  );
}

function HQRevenueDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = networkMetrics.totalRevenueMonth;
  const totalEnergy = regionalFacilities.reduce((sum, f) => sum + f.energy.today, 0) * 30;

  const regionalRevenue = [
    { region: 'North', revenue: 8500000, growth: 12.3, target: 9200000 },
    { region: 'South', revenue: 7200000, growth: 8.7, target: 7500000 },
    { region: 'West', revenue: 6800000, growth: 15.2, target: 7000000 },
    { region: 'East', revenue: 6000000, growth: 6.5, target: 6500000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-green-400 mt-1">+12.4% vs last month</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Revenue/Facility</p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(totalRevenue / networkMetrics.totalFacilities)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Average per facility</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Costs</p>
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalEnergy + totalRevenue * 0.4)}</p>
          <p className="text-xs text-muted-foreground mt-1">Energy + Operations</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Network Margin</p>
          <p className="text-2xl font-semibold text-foreground">28.5%</p>
          <p className="text-xs text-green-400 mt-1">+3.2% improvement</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Regional Revenue Performance</h3>
          <p className="text-sm text-muted-foreground mt-1">Monthly revenue by geographic region</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regionalRevenue.map((region) => (
              <div key={region.region} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{region.region} Region</h4>
                  <span className={`text-sm font-semibold ${region.growth >= 0 ? 'text-green-400' : 'text-destructive'}`}>
                    {region.growth >= 0 ? '+' : ''}{region.growth}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Achieved</span>
                      <span className="font-medium text-foreground">{formatCurrency(region.revenue)}</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-primary rounded-full"
                        style={{ width: `${(region.revenue / region.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {formatCurrency(region.target)}</span>
                    <span>{((region.revenue / region.target) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Facilities by ROI</h3>
          <div className="space-y-3">
            {networkMetrics.topPerformers.map((facility, index) => (
              <div key={facility.facility} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{facility.facility}</div>
                    <div className="text-xs text-muted-foreground">{facility.margin}% profit margin</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">{facility.roi}%</div>
                  <div className="text-xs text-muted-foreground">ROI</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Growth Opportunities</h3>
          <div className="space-y-4">
            {networkMetrics.growthRegions
              .filter(r => r.recommendation === 'expand')
              .map((region) => {
                const potentialRevenue = (region.projected - region.current) * 50000;
                return (
                  <div key={region.region} className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{region.region} Region</h4>
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">EXPAND</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Additional Capacity Needed</span>
                        <span className="font-medium text-foreground">{(region.projected - region.current).toLocaleString()} tonnes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Potential Revenue Increase</span>
                        <span className="font-semibold text-green-400">{formatCurrency(potentialRevenue)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
