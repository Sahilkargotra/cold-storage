import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Region {
  id: string;
  name: string;
  code: string;
  states: string;
  headName: string;
  headEmail: string;
  headMobile: string;
  createdAt: string;
}

export interface FacilitySetup {
  id: string;
  regionId: string;
  name: string;
  location: string;
  address: string;
  latitude: string;
  longitude: string;
  totalCapacity: string;
  licenseNumber: string;
  fssaiLicense: string;
  managerName: string;
  managerEmail: string;
  managerMobile: string;
  createdAt: string;
}

export interface ZoneSetup {
  id: string;
  facilityId: string;
  name: string;
  type: string;
  capacity: string;
  tempMin: string;
  tempMax: string;
  tempTarget: string;
  humidityTarget: string;
  ratePerTonnePerDay: string;
  minimumChargeableTonnes: string;
  billingCycle: string;
  handlingChargePerEntry: string;
  coldChainSurcharge: string;
  createdAt: string;
}

interface SetupState {
  regions: Region[];
  facilities: FacilitySetup[];
  zones: ZoneSetup[];
  addRegion: (r: Omit<Region, 'id' | 'createdAt'>) => void;
  addFacility: (f: Omit<FacilitySetup, 'id' | 'createdAt'>) => void;
  addZone: (z: Omit<ZoneSetup, 'id' | 'createdAt'>) => void;
}

const load = <T,>(key: string): T[] => {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as T[]; } catch { return []; }
};

const save = <T,>(key: string, data: T[]) => localStorage.setItem(key, JSON.stringify(data));

const SetupContext = createContext<SetupState | null>(null);

export function SetupProvider({ children }: { children: ReactNode }) {
  const [regions, setRegions] = useState<Region[]>(() => load<Region>('setup_regions'));
  const [facilities, setFacilities] = useState<FacilitySetup[]>(() => load<FacilitySetup>('setup_facilities'));
  const [zones, setZones] = useState<ZoneSetup[]>(() => load<ZoneSetup>('setup_zones'));

  const addRegion = (r: Omit<Region, 'id' | 'createdAt'>) => {
    const record: Region = { id: `RGN-${Date.now()}`, createdAt: new Date().toISOString(), ...r };
    const next = [...regions, record];
    setRegions(next);
    save('setup_regions', next);
  };

  const addFacility = (f: Omit<FacilitySetup, 'id' | 'createdAt'>) => {
    const record: FacilitySetup = { id: `FAC-${Date.now()}`, createdAt: new Date().toISOString(), ...f };
    const next = [...facilities, record];
    setFacilities(next);
    save('setup_facilities', next);
  };

  const addZone = (z: Omit<ZoneSetup, 'id' | 'createdAt'>) => {
    const record: ZoneSetup = { id: `ZNE-${Date.now()}`, createdAt: new Date().toISOString(), ...z };
    const next = [...zones, record];
    setZones(next);
    save('setup_zones', next);
  };

  return (
    <SetupContext.Provider value={{ regions, facilities, zones, addRegion, addFacility, addZone }}>
      {children}
    </SetupContext.Provider>
  );
}

export function useSetup() {
  const ctx = useContext(SetupContext);
  if (!ctx) throw new Error('useSetup must be used within SetupProvider');
  return ctx;
}
