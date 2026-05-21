import React from 'react';
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls
} from '@/components/ui/map';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Facility } from '@/data/mockData';

interface FacilitiesMapProps {
  facilities: Facility[];
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  height?: string;
  showNetworkStats?: boolean;
}

export function FacilitiesMap({
  facilities,
  center = [78.9629, 20.5937], // Center of India [lng, lat]
  zoom = 5,
  height = '500px',
  showNetworkStats = false
}: FacilitiesMapProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate metrics for network view
  const totalAlerts = facilities.reduce((sum, f) =>
    sum + f.zones.reduce((zSum, z) => zSum + z.alerts.length, 0), 0
  );

  const criticalFacilities = facilities.filter(f => f.status === 'critical').length;
  const avgOccupancy = facilities.reduce((sum, f) => sum + f.occupancy, 0) / facilities.length;

  // Get status color
  const getStatusColor = (status: Facility['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full">
      {showNetworkStats && (
        <div className="flex gap-3 text-xs px-4 py-2 border-b border-border">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">{criticalFacilities} Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-yellow-500" />
            <span className="text-muted-foreground">{totalAlerts} Alerts</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">{avgOccupancy.toFixed(0)}% Avg Occupancy</span>
          </div>
        </div>
      )}
      <div style={{ height, width: '100%' }}>
        <Map
          center={center}
          zoom={zoom}
          className="rounded-lg"
        >
          <MapControls position="bottom-right" showZoom showCompass />

          {facilities.map((facility) => {
            const facilityAlerts = facility.zones.reduce(
              (acc, zone) => acc + zone.alerts.length,
              0
            );
            const facilityCritical = facility.zones.reduce(
              (acc, zone) =>
                acc + zone.alerts.filter(a => a.severity === 'critical').length,
              0
            );

            return (
              <MapMarker
                key={facility.id}
                longitude={facility.longitude}
                latitude={facility.latitude}
              >
                <MarkerContent>
                  <div
                    className={`relative w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      facility.status === 'critical' ? 'animate-pulse' : ''
                    }`}
                    style={{
                      backgroundColor:
                        facility.status === 'operational' ? '#22c55e' :
                        facility.status === 'maintenance' ? '#eab308' :
                        '#ef4444'
                    }}
                  />
                </MarkerContent>

                <MarkerPopup>
                  <div className="p-3 min-w-[280px]">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">
                          {facility.name}
                        </h3>
                        <p className="text-xs text-gray-500">{facility.location}</p>
                      </div>
                      <Badge
                        variant={
                          facility.status === 'operational'
                            ? 'default'
                            : facility.status === 'maintenance'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className="text-xs"
                      >
                        {facility.status}
                      </Badge>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-[10px] text-gray-500 mb-1">Occupancy</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {facility.occupancy}%
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-[10px] text-gray-500 mb-1">Capacity</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {facility.totalCapacity}T
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-[10px] text-gray-500 mb-1">Revenue</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(facility.revenue.today)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-[10px] text-gray-500 mb-1">Energy</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(facility.energy.today * 7)}
                        </p>
                      </div>
                    </div>

                    {/* Alerts */}
                    {facilityAlerts > 0 && (
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-gray-700">
                            Active Alerts
                          </p>
                          {facilityCritical > 0 && (
                            <span className="text-xs text-red-600 font-semibold">
                              {facilityCritical} Critical
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {facility.zones.map((zone) =>
                            zone.alerts.map((alert) => (
                              <Badge
                                key={alert.id}
                                variant={
                                  alert.severity === 'critical'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                                className="text-[10px]"
                              >
                                {alert.severity}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cost Efficiency Indicator */}
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Cost Efficiency</span>
                        <div className="flex items-center gap-1">
                          {facility.energy.costPerTonne < 2000 ? (
                            <>
                              <TrendingDown className="w-3 h-3 text-green-600" />
                              <span className="font-semibold text-green-600">
                                ₹{facility.energy.costPerTonne}/T
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-3 h-3 text-red-600" />
                              <span className="font-semibold text-red-600">
                                ₹{facility.energy.costPerTonne}/T
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </MarkerPopup>
              </MapMarker>
            );
          })}
        </Map>
      </div>
    </div>
  );
}
