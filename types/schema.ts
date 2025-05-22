export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg';

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  licensePlate: string;
  fuelType: FuelType;
  currentMileage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  type: string;
  dueDate: Date;
  dueMileage: number;
  notified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  vehicleId: string;
  date: Date;
  category: 'fuel' | 'maintenance' | 'taxes' | 'accessories';
  amount: number;
  notes?: string;
  createdAt: Date;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: Date;
  mileage: number;
  description: string;
  cost: number;
  createdAt: Date;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: Date;
  mileage: number;
  liters: number;
  price: number;
  createdAt: Date;
}