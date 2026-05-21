import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FacilityDashboard } from './FacilityDashboard';
import { RevenueDashboard } from '@/components/revenue/RevenueDashboard';

export function FacilityDashboardWithTabs() {
  return (
    <Tabs defaultValue="operations" className="w-full">
      <div className="flex items-center justify-end mb-6">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="operations" className="space-y-6">
        <FacilityDashboard />
      </TabsContent>

      <TabsContent value="revenue" className="space-y-6">
        <RevenueDashboard />
      </TabsContent>
    </Tabs>
  );
}
