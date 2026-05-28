import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ReleaseEvent {
  eventId: string;
  exitDateTime: string;
  vehicleNumber: string;
  recipientName: string;
  recipientMobile: string;
  quantityReleased: string;
  remarks: string;
  releasedAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  status: 'upcoming' | 'active' | 'released';
  entryDateTime: string;
  expectedArrivalDate?: string;
  supplierName: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  productCategory: string;
  productName: string;
  batchNumber: string;
  quantityUnits: string;
  quantityWeight: string;
  expiryDate: string;
  arrivalTemperature: string;
  visualCondition: string;
  zoneAssignment: string;
  remarks: string;
  createdAt: string;
  releaseEvents: ReleaseEvent[];
}

export type NewBookingForm = Omit<Booking, 'id' | 'bookingNumber' | 'status' | 'createdAt' | 'releaseEvents'>;

export interface UpcomingBookingForm {
  expectedArrivalDate: string;
  supplierName: string;
  vehicleNumber: string;
  productCategory: string;
  productName: string;
  quantityWeight: string;
  zoneAssignment: string;
  remarks: string;
}

interface BookingsContextValue {
  bookings: Booking[];
  addBooking: (form: NewBookingForm) => string;
  addUpcoming: (form: UpcomingBookingForm) => string;
  markArrived: (id: string, arrivalDetails: Pick<NewBookingForm, 'entryDateTime' | 'arrivalTemperature' | 'visualCondition' | 'batchNumber' | 'quantityUnits' | 'expiryDate' | 'driverName' | 'driverMobile'>) => void;
  addReleaseEvent: (id: string, event: Omit<ReleaseEvent, 'eventId' | 'releasedAt'>) => void;
  remainingKg: (booking: Booking) => number;
}

const BookingsContext = createContext<BookingsContextValue | null>(null);

const STORAGE_KEY = 'coldStorage_bookings_v2';

const SEED_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    bookingNumber: 'BK-2026-001',
    status: 'active',
    entryDateTime: '2026-05-10T09:30',
    supplierName: 'Sharma Agro Pvt. Ltd.',
    vehicleNumber: 'TN-01-AB-1234',
    driverName: 'Ravi Kumar',
    driverMobile: '9876543210',
    productCategory: 'Fruits',
    productName: 'Alphonso Mangoes',
    batchNumber: 'LOT-2026-0451',
    quantityUnits: '80',
    quantityWeight: '3200',
    expiryDate: '2026-06-10',
    arrivalTemperature: '4.2',
    visualCondition: 'Pass',
    zoneAssignment: 'Chill Zone',
    remarks: 'Premium export quality',
    createdAt: '2026-05-10T09:30:00.000Z',
    releaseEvents: [
      {
        eventId: 'RE-001-1',
        exitDateTime: '2026-05-20T10:00',
        vehicleNumber: 'TN-03-BC-2211',
        recipientName: 'Freshmart Exports',
        recipientMobile: '9001234567',
        quantityReleased: '1000',
        remarks: 'First partial dispatch',
        releasedAt: '2026-05-20T10:00:00.000Z',
      },
    ],
  },
  {
    id: 'BK-002',
    bookingNumber: 'BK-2026-002',
    status: 'active',
    entryDateTime: '2026-05-12T11:00',
    supplierName: 'Kerala Seafoods Ltd.',
    vehicleNumber: 'KL-07-CD-5678',
    driverName: 'Suresh Nair',
    driverMobile: '9123456780',
    productCategory: 'Meat & Seafood',
    productName: 'Tiger Prawns',
    batchNumber: 'LOT-2026-0512',
    quantityUnits: '40',
    quantityWeight: '1800',
    expiryDate: '2026-07-01',
    arrivalTemperature: '-18',
    visualCondition: 'Pass',
    zoneAssignment: 'Frozen Zone',
    remarks: '',
    createdAt: '2026-05-12T11:00:00.000Z',
    releaseEvents: [],
  },
  {
    id: 'BK-003',
    bookingNumber: 'BK-2026-003',
    status: 'released',
    entryDateTime: '2026-04-20T08:00',
    supplierName: 'Tamil Nadu Dairy',
    vehicleNumber: 'TN-09-EF-9012',
    driverName: 'Murugan S.',
    driverMobile: '9988776655',
    productCategory: 'Dairy',
    productName: 'Paneer Blocks',
    batchNumber: 'LOT-2026-0420',
    quantityUnits: '120',
    quantityWeight: '2400',
    expiryDate: '2026-05-20',
    arrivalTemperature: '2.0',
    visualCondition: 'Pass',
    zoneAssignment: 'Chill Zone',
    remarks: 'FSSAI certified batch',
    createdAt: '2026-04-20T08:00:00.000Z',
    releaseEvents: [
      {
        eventId: 'RE-003-1',
        exitDateTime: '2026-05-18T14:00',
        vehicleNumber: 'TN-11-GH-3344',
        recipientName: 'Chennai Retail Hub',
        recipientMobile: '9001122334',
        quantityReleased: '2400',
        remarks: 'Full consignment collected',
        releasedAt: '2026-05-18T14:00:00.000Z',
      },
    ],
  },
  {
    id: 'BK-004',
    bookingNumber: 'BK-2026-004',
    status: 'upcoming',
    expectedArrivalDate: '2026-05-28',
    entryDateTime: '',
    supplierName: 'Bangalore Organics',
    vehicleNumber: 'KA-05-MN-7890',
    driverName: '',
    driverMobile: '',
    productCategory: 'Vegetables',
    productName: 'Baby Spinach',
    batchNumber: '',
    quantityUnits: '',
    quantityWeight: '600',
    expiryDate: '',
    arrivalTemperature: '',
    visualCondition: '',
    zoneAssignment: 'Chill Zone',
    remarks: 'Organic certified',
    createdAt: '2026-05-24T08:00:00.000Z',
    releaseEvents: [],
  },
  {
    id: 'BK-005',
    bookingNumber: 'BK-2026-005',
    status: 'upcoming',
    expectedArrivalDate: '2026-05-30',
    entryDateTime: '',
    supplierName: 'Himachal Apple Co.',
    vehicleNumber: 'HP-02-PQ-3344',
    driverName: '',
    driverMobile: '',
    productCategory: 'Fruits',
    productName: 'Shimla Apples',
    batchNumber: '',
    quantityUnits: '',
    quantityWeight: '2000',
    expiryDate: '',
    arrivalTemperature: '',
    visualCondition: '',
    zoneAssignment: 'Chill Zone',
    remarks: 'Grade-A export lot',
    createdAt: '2026-05-24T09:00:00.000Z',
    releaseEvents: [],
  },
];

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Booking[];
    } catch {
    }
    return SEED_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const remainingKg = (booking: Booking): number => {
    const total = parseFloat(booking.quantityWeight) || 0;
    const released = booking.releaseEvents.reduce((sum, e) => sum + (parseFloat(e.quantityReleased) || 0), 0);
    return Math.max(0, total - released);
  };

  const nextNumber = (all: Booking[]) =>
    `BK-${new Date().getFullYear()}-${String(all.length + 1).padStart(3, '0')}`;

  const addBooking = (form: NewBookingForm): string => {
    const id = `BK-${Date.now()}`;
    const bookingNumber = nextNumber(bookings);
    const booking: Booking = { ...form, id, bookingNumber, status: 'active', createdAt: new Date().toISOString(), releaseEvents: [] };
    setBookings(prev => [booking, ...prev]);
    return bookingNumber;
  };

  const addUpcoming = (form: UpcomingBookingForm): string => {
    const id = `BK-${Date.now()}`;
    const bookingNumber = nextNumber(bookings);
    const booking: Booking = {
      id,
      bookingNumber,
      status: 'upcoming',
      expectedArrivalDate: form.expectedArrivalDate,
      entryDateTime: '',
      supplierName: form.supplierName,
      vehicleNumber: form.vehicleNumber,
      driverName: '',
      driverMobile: '',
      productCategory: form.productCategory,
      productName: form.productName,
      batchNumber: '',
      quantityUnits: '',
      quantityWeight: form.quantityWeight,
      expiryDate: '',
      arrivalTemperature: '',
      visualCondition: '',
      zoneAssignment: form.zoneAssignment,
      remarks: form.remarks,
      createdAt: new Date().toISOString(),
      releaseEvents: [],
    };
    setBookings(prev => [booking, ...prev]);
    return bookingNumber;
  };

  const markArrived = (id: string, details: Pick<NewBookingForm, 'entryDateTime' | 'arrivalTemperature' | 'visualCondition' | 'batchNumber' | 'quantityUnits' | 'expiryDate' | 'driverName' | 'driverMobile'>) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id ? { ...b, ...details, status: 'active' } : b,
      ),
    );
  };

  const addReleaseEvent = (id: string, event: Omit<ReleaseEvent, 'eventId' | 'releasedAt'>) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const newEvent: ReleaseEvent = { ...event, eventId: `RE-${Date.now()}`, releasedAt: new Date().toISOString() };
        const updatedEvents = [...b.releaseEvents, newEvent];
        const total = parseFloat(b.quantityWeight) || 0;
        const released = updatedEvents.reduce((sum, e) => sum + (parseFloat(e.quantityReleased) || 0), 0);
        const fullyReleased = released >= total;
        return { ...b, releaseEvents: updatedEvents, status: fullyReleased ? 'released' : b.status };
      }),
    );
  };

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, addUpcoming, markArrived, addReleaseEvent, remainingKg }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings(): BookingsContextValue {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used within BookingsProvider');
  return ctx;
}
