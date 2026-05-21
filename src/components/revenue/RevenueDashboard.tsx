import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { chennaiFacility } from '@/data/mockData';

const DARK_TOOLTIP_STYLE = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  color: 'var(--foreground)',
  borderRadius: '8px',
};

const COLORS = ['#02A19E', '#6333ff', '#f59e0b', '#ec4899'];

interface RevenueDashboardProps {
  facility?: typeof chennaiFacility;
}

export function RevenueDashboard({ facility = chennaiFacility }: RevenueDashboardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const revenuePerTonne = facility.revenue.today / (facility.totalCapacity * facility.occupancy / 100);
  const profitMargin = ((facility.revenue.today - facility.energy.today * 7) / facility.revenue.today * 100);

  const revenueByZone = facility.zones.map(zone => ({
    name: zone.name.split(' ')[1] || zone.name,
    value: zone.products.reduce((sum, p) => sum + p.value, 0),
    occupancy: zone.occupancy
  }));

  const weeklyProjection = [
    { day: 'Mon', revenue: facility.revenue.today * 0.95, target: facility.revenue.today * 1.1 },
    { day: 'Tue', revenue: facility.revenue.today * 0.98, target: facility.revenue.today * 1.1 },
    { day: 'Wed', revenue: facility.revenue.today, target: facility.revenue.today * 1.1 },
    { day: 'Thu', revenue: facility.revenue.today * 1.02, target: facility.revenue.today * 1.1 },
    { day: 'Fri', revenue: facility.revenue.today * 1.05, target: facility.revenue.today * 1.1 },
    { day: 'Sat', revenue: facility.revenue.today * 0.92, target: facility.revenue.today * 1.1 },
    { day: 'Sun', revenue: facility.revenue.today * 0.88, target: facility.revenue.today * 1.1 },
  ];

  const costBreakdown = [
    { name: 'Energy', value: facility.energy.today * 7, color: COLORS[0] },
    { name: 'Labor', value: facility.revenue.today * 0.15, color: COLORS[1] },
    { name: 'Maintenance', value: facility.revenue.today * 0.08, color: COLORS[2] },
    { name: 'Operations', value: facility.revenue.today * 0.12, color: COLORS[3] },
  ];

  const totalCosts = costBreakdown.reduce((sum, item) => sum + item.value, 0);
  const netProfit = facility.revenue.today - totalCosts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Revenue Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">Financial performance overview for {facility.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            This Month
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: formatCurrency(facility.revenue.today), sub: '+8.2% vs yesterday' },
          { label: 'Revenue/Tonne', value: formatCurrency(revenuePerTonne), sub: '+3.1% efficiency' },
          { label: 'Net Profit', value: formatCurrency(netProfit), sub: `${profitMargin.toFixed(1)}% margin` },
          { label: 'Monthly Revenue', value: formatCurrency(facility.revenue.thisMonth), sub: 'On Track' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-5">
              <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-2">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Weekly Revenue vs Target</CardTitle>
            <CardDescription>Daily performance against weekly targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyProjection}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), '']}
                  contentStyle={DARK_TOOLTIP_STYLE}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#02A19E" name="Actual" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#6333ff" name="Target" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Cost Breakdown</CardTitle>
            <CardDescription>Daily operational costs distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={DARK_TOOLTIP_STYLE} formatter={(v) => formatCurrency(v as number)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3 ml-6">
                {costBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Revenue by Zone</CardTitle>
            <CardDescription>Inventory value distribution across zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByZone.map((zone) => (
                <div key={zone.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{zone.name}</span>
                    <span className="font-semibold text-foreground">{formatCurrency(zone.value)}</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute h-full rounded-full transition-all"
                      style={{ width: `${zone.occupancy}%`, backgroundColor: '#02A19E' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{zone.occupancy}% occupied</span>
                    <span>{((zone.value / facility.revenue.today) * 100).toFixed(1)}% of revenue</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Profit &amp; Loss Summary</CardTitle>
            <CardDescription>Daily financial performance snapshot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#02A19E]" />
                  <span className="text-sm font-medium text-foreground">Total Revenue</span>
                </div>
                <span className="text-base font-semibold text-foreground">{formatCurrency(facility.revenue.today)}</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Energy Cost', value: facility.energy.today * 7 },
                  { label: 'Labor Cost', value: facility.revenue.today * 0.15 },
                  { label: 'Maintenance', value: facility.revenue.today * 0.08 },
                  { label: 'Operations', value: facility.revenue.today * 0.12 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between p-2 text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="text-foreground font-medium">-{formatCurrency(row.value)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Net Profit</span>
                  <span className="text-lg font-bold text-foreground">{formatCurrency(netProfit)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>Profit Margin</span>
                  <span>{profitMargin.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Revenue Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators for financial health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '📦',
                label: 'Occupancy Rate',
                value: `${facility.occupancy}%`,
                sub: `${facility.totalCapacity * facility.occupancy / 100} tonnes utilized`,
              },
              {
                icon: '⚡',
                label: 'Cost Efficiency',
                value: `₹${facility.energy.costPerTonne}`,
                sub: 'per tonne',
              },
              {
                icon: '📊',
                label: 'Daily Target',
                value: `${((facility.revenue.today / (facility.revenue.today * 1.1)) * 100).toFixed(0)}%`,
                sub: 'of daily target achieved',
              },
            ].map((m) => (
              <div key={m.label} className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{m.icon}</span>
                  <span className="text-sm font-medium text-muted-foreground">{m.label}</span>
                </div>
                <div className="text-2xl font-semibold text-foreground">{m.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.sub}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
