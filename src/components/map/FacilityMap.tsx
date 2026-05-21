import React from 'react';
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls
} from '@/components/ui/map';
import { Badge } from '@/components/ui/badge';
import type { Facility } from '@/data/mockData';

interface FacilityMapProps {
  facilities: Facility[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function FacilityMap({
  facilities,
  center = [78.9629, 20.5937],
  zoom = 4,
  height = '300px'
}: FacilityMapProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Facility Map</h4>
          <p className="text-xs text-gray-500">{facilities.length} facilities across India</p>
        </div>
      </div>

      <div style={{ height, width: '100%' }}>
      <Map
        center={center}
        zoom={zoom}
        className="rounded-lg shadow-sm"
        styles={{
          light: "https://tiles.openfreemap.org/styles/bright",
          dark: "https://tiles.openfreemap.org/styles/dark"
        }}
      >
        <MapControls position="bottom-right" showZoom showCompass />

        {facilities.map((facility) => (
          <MapMarker
            key={facility.id}
            longitude={facility.longitude}
            latitude={facility.latitude}
          >
            <MarkerContent>
              <div
                className={`relative w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                  facility.status === 'critical' ? 'animate-pulse' : ''
                }`}
                style={{
                  backgroundColor:
                    facility.status === 'operational'
                      ? '#22c55e'
                      : facility.status === 'maintenance'
                      ? '#eab308'
                      : '#ef4444'
                }}
              />
            </MarkerContent>

            <MarkerPopup
              offset={{
                top: [0, 0],
                'top-left': [0, 0],
                'top-right': [0, 0],
                bottom: [0, -10],
                'bottom-left': [0, -10],
                'bottom-right': [0, -10],
                left: [10, 0],
                right: [-10, 0]
              }}
            >
              <div className="bg-white rounded-lg p-3 shadow-lg border border-gray-200 min-w-[200px]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900">
                      {facility.name}
                    </h5>
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

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Occupancy:</span>{' '}
                    <span className="font-medium">{facility.occupancy}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Capacity:</span>{' '}
                    <span className="font-medium">{facility.totalCapacity}T</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Energy:</span>{' '}
                    <span className="font-medium">{facility.energyConsumption} kWh</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Alerts:</span>{' '}
                    <span
                      className={`font-medium ${
                        facility.alerts > 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {facility.alerts}
                    </span>
                  </div>
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
      </div>
    </div>
  );
}
