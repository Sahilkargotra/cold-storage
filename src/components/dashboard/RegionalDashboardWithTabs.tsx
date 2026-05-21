import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RegionalDashboard } from './RegionalDashboard';
import { regionalFacilities } from '@/data/mockData';

export function RegionalDashboardWithTabs() {
  return (
    <Tabs defaultValue="operations" className="w-full">
      <div className="flex items-center justify-end mb-6">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="operations" className="space-y-6">
        <RegionalDashboard />
      </TabsContent>

      <TabsContent value="revenue" className="space-y-6">
        <RegionalRevenueDashboard />
      </TabsContent>
    </Tabs>
  );
}

function RegionalRevenueDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = regionalFacilities.reduce((sum, f) => sum + f.revenue.today, 0);
  const totalEnergy = regionalFacilities.reduce((sum, f) => sum + f.energy.today, 0);
  const totalCapacity = regionalFacilities.reduce((sum, f) => sum + f.totalCapacity, 0);

  const facilityRevenue = regionalFacilities.map(f => ({
    name: f.name.split(' ')[0],
    revenue: f.revenue.today,
    target: f.revenue.today * 1.1,
    growth: Math.random() * 20 - 5
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-green-400 mt-1">+7.3% vs last week</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Revenue/Tonne</p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(totalRevenue / (totalCapacity * 0.86))}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Average efficiency</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Costs</p>
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalEnergy * 7 + totalRevenue * 0.35)}</p>
          <p className="text-xs text-muted-foreground mt-1">Energy + Operations</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Net Profit Margin</p>
          <p className="text-2xl font-semibold text-foreground">24.8%</p>
          <p className="text-xs text-green-400 mt-1">+2.1% improvement</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Revenue by Facility</h3>
          <p className="text-sm text-muted-foreground mt-1">Daily revenue performance and targets</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {facilityRevenue.map((facility) => (
              <div key={facility.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{facility.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Target: {formatCurrency(facility.target)}</span>
                    <span className={`text-sm font-semibold ${facility.growth >= 0 ? 'text-green-400' : 'text-destructive'}`}>
                      {facility.growth >= 0 ? '+' : ''}{facility.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(facility.revenue / facility.target) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(facility.revenue)} achieved</span>
                  <span>{((facility.revenue / facility.target) * 100).toFixed(1)}% of target</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cost Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Energy Costs</span>
              <span className="font-semibold text-foreground">{formatCurrency(totalEnergy * 7)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Labor & Operations</span>
              <span className="font-semibold text-foreground">{formatCurrency(totalRevenue * 0.35)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Maintenance</span>
              <span className="font-semibold text-foreground">{formatCurrency(totalRevenue * 0.08)}</span>
            </div>
            <div className="border-t border-border pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Net Profit</span>
                <span className="text-lg font-bold text-green-400">
                  {formatCurrency(totalRevenue - (totalEnergy * 7 + totalRevenue * 0.43))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Ranking</h3>
          <div className="space-y-3">
            {regionalFacilities
              .sort((a, b) => (b.revenue.today / b.totalCapacity) - (a.revenue.today / a.totalCapacity))
              .map((facility, index) => (
                <div key={facility.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{facility.name}</div>
                      <div className="text-xs text-muted-foreground">{facility.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">
                      {formatCurrency(facility.revenue.today)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ₹{(facility.revenue.today / facility.totalCapacity).toFixed(0)}/tonne
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
