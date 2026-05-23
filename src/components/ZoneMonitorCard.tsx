import { Card, CardContent, CardHeader, CardTitle, Badge, Button, LineChart } from '@vrushabh-b/oneiot-ui';
import {
  Thermometer,
  Wind,
  Gauge,
  DoorOpen,
  DoorClosed,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Package,
  ChevronRight,
} from 'lucide-react';

interface ZoneMonitorCardProps {
  zone: {
    id: string;
    name: string;
    type: 'ambient' | 'chill' | 'frozen' | 'processing';
    capacity: number;
    currentOccupancy: number;
    temperature: {
      current: number;
      target: number;
      min: number;
      max: number;
      trend: 'up' | 'down' | 'stable';
    };
    humidity: {
      current: number;
      target: number;
      min: number;
      max: number;
    };
    safety: {
      nh3Level: number;
      co2Level: number;
      lastUpdated: string;
    };
    doors: Array<{
      id: string;
      name: string;
      status: 'open' | 'closed' | 'fault';
      openDuration?: number;
      lastEvent: string;
    }>;
    energy: {
      consumption: number;
      cost: number;
    };
    occupancy: number;
    products: Array<{
      name: string;
      quantity: number;
      expiryDate: string;
      value: number;
    }>;
    alerts: Array<{
      id: string;
      severity: 'critical' | 'warning' | 'info';
      message: string;
      time: string;
    }>;
  };
  temperatureHistory?: Array<{ time: string; temp: number }>;
}

export function ZoneMonitorCard({ zone, temperatureHistory }: ZoneMonitorCardProps) {
  const getZoneColor = (type: string) => {
    switch (type) {
      case 'ambient': return 'bg-orange-500';
      case 'chill': return 'bg-blue-500';
      case 'frozen': return 'bg-cyan-500';
      case 'processing': return 'bg-purple-500';
      default: return 'bg-muted-foreground';
    }
  };

  const getTemperatureClass = (current: number, target: number, min: number, max: number) => {
    if (current < min || current > max) return 'text-destructive bg-destructive/10 border-destructive/30';
    if (Math.abs(current - target) > 2) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-green-400 bg-green-500/10 border-green-500/30';
  };

  const getHumidityColor = (current: number, target: number, min: number, max: number) => {
    if (current < min || current > max) return 'text-destructive';
    if (Math.abs(current - target) > 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSafetyClass = (level: number, type: 'nh3' | 'co2') => {
    const thresholds = type === 'nh3'
      ? { warning: 15, critical: 25 }
      : { warning: 3000, critical: 5000 };

    if (level >= thresholds.critical) return 'text-destructive bg-destructive/10 border-destructive/30';
    if (level >= thresholds.warning) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-green-400 bg-green-500/10 border-green-500/30';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const openDoors = zone.doors.filter(d => d.status === 'open');

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${getZoneColor(zone.type)} rounded-lg flex items-center justify-center`}>
              <Thermometer className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{zone.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {zone.type.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {zone.currentOccupancy} / {zone.capacity} tonnes
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Details <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {zone.alerts.length > 0 && (
          <div className="space-y-2">
            {zone.alerts.map((alert) => (
              <div key={alert.id} className={`p-2 rounded-lg border flex items-start gap-2 ${
                alert.severity === 'critical' ? 'bg-destructive/10 border-destructive/30' :
                alert.severity === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}>
                <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  alert.severity === 'critical' ? 'text-destructive' :
                  alert.severity === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.time).toLocaleTimeString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg border ${getTemperatureClass(
            zone.temperature.current,
            zone.temperature.target,
            zone.temperature.min,
            zone.temperature.max,
          )}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Temperature</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(zone.temperature.trend)}
              </div>
            </div>
            <div className="text-2xl font-bold">{zone.temperature.current}°C</div>
            <div className="text-xs opacity-75">
              Target: {zone.temperature.target}°C
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-muted border-border">
            <div className="text-xs font-medium mb-1">Humidity</div>
            <div className={`text-2xl font-bold ${getHumidityColor(
              zone.humidity.current,
              zone.humidity.target,
              zone.humidity.min,
              zone.humidity.max,
            )}`}>
              {zone.humidity.current}%
            </div>
            <div className="text-xs text-muted-foreground">
              Target: {zone.humidity.target}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg border ${getSafetyClass(zone.safety.nh3Level, 'nh3')}`}>
            <div className="flex items-center gap-1 text-xs font-medium mb-1">
              <Wind className="h-3 w-3" />
              <span>Ammonia (NH₃)</span>
            </div>
            <div className="text-xl font-bold">{zone.safety.nh3Level}</div>
            <div className="text-xs opacity-75">ppm</div>
          </div>

          <div className={`p-3 rounded-lg border ${getSafetyClass(zone.safety.co2Level, 'co2')}`}>
            <div className="flex items-center gap-1 text-xs font-medium mb-1">
              <Gauge className="h-3 w-3" />
              <span>CO₂ Level</span>
            </div>
            <div className="text-xl font-bold">{zone.safety.co2Level}</div>
            <div className="text-xs opacity-75">ppm</div>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Door Status</span>
            {openDoors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {openDoors.length} Open
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {zone.doors.slice(0, 2).map((door) => (
              <div key={door.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{door.name}</span>
                <div className="flex items-center gap-1">
                  {door.status === 'open' ? (
                    <>
                      <DoorOpen className="h-3 w-3 text-orange-400" />
                      <span className="text-orange-400 font-medium">{door.openDuration}m</span>
                    </>
                  ) : door.status === 'fault' ? (
                    <>
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-destructive font-medium">Fault</span>
                    </>
                  ) : (
                    <>
                      <DoorClosed className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">Closed</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {temperatureHistory && temperatureHistory.length > 0 && (
          <div className="min-w-0">
            <LineChart
              data={temperatureHistory}
              xKey="time"
              series={['temp']}
              config={{ temp: { label: 'Temperature', color: '#02A19E' } }}
              className="h-24"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <div>
              <div className="text-xs text-muted-foreground">Energy</div>
              <div className="text-sm font-semibold">{zone.energy.consumption} kWh</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Occupancy</div>
              <div className="text-sm font-semibold">{zone.occupancy}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
