import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, AreaChart } from '@vrushabh-b/oneiot-ui';
import { TrendingUp, TrendingDown, IndianRupee, Zap } from 'lucide-react';
import { RegionalDashboard } from './RegionalDashboard';
import { regionalFacilities } from '@/data/mockData';

const TEAL = '#02A19E';
const PURPLE = '#6333ff';
const AMBER = '#f59e0b';

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
  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const totalRevenue = regionalFacilities.reduce((s, f) => s + f.revenue.today, 0);
  const totalEnergy = regionalFacilities.reduce((s, f) => s + f.energy.today, 0);
  const totalCapacity = regionalFacilities.reduce((s, f) => s + f.totalCapacity, 0);
  const avgOccupancy = regionalFacilities.reduce((s, f) => s + f.occupancy, 0) / regionalFacilities.length;

  const energyCost = totalEnergy * 7;
  const laborCost = totalRevenue * 0.35;
  const maintenanceCost = totalRevenue * 0.08;
  const totalCost = energyCost + laborCost + maintenanceCost;
  const netProfit = totalRevenue - totalCost;
  const profitMargin = (netProfit / totalRevenue) * 100;

  const facilityRevenue = regionalFacilities.map(f => ({
    name: f.name.split(' ')[0],
    today: Math.round(f.revenue.today / 1000),
    week: Math.round(f.revenue.thisWeek / 1000),
    month: Math.round(f.revenue.thisMonth / 1000),
    target: Math.round(f.revenue.today * 1.1 / 1000),
    achievement: Math.round((f.revenue.today / (f.revenue.today * 1.1)) * 100),
  }));

  const weeklyTrend = [
    { day: 'Mon', revenue: Math.round(totalRevenue * 0.88 / 1000), cost: Math.round(totalCost * 0.90 / 1000) },
    { day: 'Tue', revenue: Math.round(totalRevenue * 0.91 / 1000), cost: Math.round(totalCost * 0.91 / 1000) },
    { day: 'Wed', revenue: Math.round(totalRevenue * 0.94 / 1000), cost: Math.round(totalCost * 0.92 / 1000) },
    { day: 'Thu', revenue: Math.round(totalRevenue * 0.96 / 1000), cost: Math.round(totalCost * 0.93 / 1000) },
    { day: 'Fri', revenue: Math.round(totalRevenue * 0.98 / 1000), cost: Math.round(totalCost * 0.94 / 1000) },
    { day: 'Sat', revenue: Math.round(totalRevenue * 0.99 / 1000), cost: Math.round(totalCost * 0.95 / 1000) },
    { day: 'Sun', revenue: Math.round(totalRevenue / 1000), cost: Math.round(totalCost / 1000) },
  ];

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue', value: fmt(totalRevenue), sub: '+7.3% vs last week',
            positive: true, icon: IndianRupee,
          },
          {
            label: 'Revenue / Tonne', value: fmt(totalRevenue / (totalCapacity * avgOccupancy / 100)),
            sub: 'Network average', positive: true, icon: TrendingUp,
          },
          {
            label: 'Total Costs', value: fmt(totalCost),
            sub: 'Energy + Ops + Maintenance', positive: false, icon: Zap,
          },
          {
            label: 'Net Profit Margin', value: `${profitMargin.toFixed(1)}%`,
            sub: '+2.1% improvement', positive: true, icon: TrendingUp,
          },
        ].map(({ label, value, sub, positive, icon: Icon }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className={`text-xs mt-1.5 ${positive ? 'text-green-400' : 'text-muted-foreground'}`}>{sub}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Target by Facility</CardTitle>
          <CardDescription>Daily performance against 110% target</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {facilityRevenue.map(f => (
            <div key={f.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{f.name}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${f.achievement >= 100 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {f.achievement}% of target
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Target: {fmt(f.target * 1000)}</span>
                  {f.achievement >= 100
                    ? <span className="flex items-center gap-1 text-green-400 font-semibold"><TrendingUp className="h-3 w-3" />On track</span>
                    : <span className="flex items-center gap-1 text-yellow-400 font-semibold"><TrendingDown className="h-3 w-3" />Below target</span>
                  }
                </div>
              </div>
              <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute h-full rounded-full transition-all ${f.achievement >= 100 ? 'bg-teal-400' : 'bg-yellow-400'}`}
                  style={{ width: `${Math.min(f.achievement, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{fmt(f.today * 1000)} achieved</span>
                <span>Week: {fmt(f.week * 1000)} · Month: {fmt(f.month * 1000)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Cost Trend</CardTitle>
            <CardDescription>This week (₹K)</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={weeklyTrend}
              xKey="day"
              series={['revenue', 'cost']}
              config={{
                revenue: { label: 'Revenue (₹K)', color: TEAL },
                cost: { label: 'Cost (₹K)', color: PURPLE },
              }}
              gradient
              className="h-56"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facility Revenue Breakdown</CardTitle>
            <CardDescription>Today in ₹K</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={facilityRevenue}
              xKey="name"
              series={['today', 'target']}
              config={{
                today: { label: 'Actual (₹K)', color: TEAL },
                target: { label: 'Target (₹K)', color: AMBER },
              }}
              className="h-56"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Distribution</CardTitle>
            <CardDescription>Breakdown of total operational costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Energy Costs', value: energyCost, pct: energyCost / totalCost * 100, color: 'bg-purple-400' },
                { label: 'Labor & Operations', value: laborCost, pct: laborCost / totalCost * 100, color: 'bg-blue-400' },
                { label: 'Maintenance', value: maintenanceCost, pct: maintenanceCost / totalCost * 100, color: 'bg-amber-400' },
              ].map(({ label, value, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-foreground">{fmt(value)} <span className="text-muted-foreground font-normal">({pct.toFixed(1)}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Net Profit</span>
                <span className="text-lg font-bold text-green-400">{fmt(netProfit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Ranking</CardTitle>
            <CardDescription>By revenue per tonne efficiency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[...regionalFacilities]
              .sort((a, b) => b.revenue.today / b.totalCapacity - a.revenue.today / a.totalCapacity)
              .map((facility, index) => {
                const rpt = facility.revenue.today / facility.totalCapacity;
                const medalColors = ['bg-yellow-500/20 text-yellow-400', 'bg-slate-400/20 text-slate-400', 'bg-orange-500/20 text-orange-400'];
                return (
                  <div key={facility.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0 ${medalColors[index] ?? 'bg-muted-foreground/10 text-muted-foreground'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{facility.name}</p>
                      <p className="text-xs text-muted-foreground">{facility.location}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground">{fmt(facility.revenue.today)}</p>
                      <p className="text-xs text-muted-foreground">₹{rpt.toFixed(0)}/T</p>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
