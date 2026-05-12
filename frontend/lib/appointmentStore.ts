import { create } from 'zustand';
import apiClient from './apiClient';

export interface Appointment {
  id: string;
  date: string;
  duration: number;
  service: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  customer?: { id: string; name: string; email: string };
  barber?: { id: string; name: string; email: string };
}

export interface Barber {
  id: string;
  name: string;
  email: string;
  specialty?: string;
  bio?: string;
  photoUrl?: string;
  rating?: number;
  ratingCount?: number;
}

interface AppointmentStore {
  appointments: Appointment[];
  barbers: Barber[];
  availableSlots: string[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  fetchBarbers: () => Promise<void>;
  fetchAvailableSlots: (barberId: string, date: string) => Promise<void>;
  createAppointment: (barberId: string, date: string, service: string, notes?: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  confirmAppointment: (appointmentId: string) => Promise<void>;
  completeAppointment: (appointmentId: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  barbers: [],
  availableSlots: [],
  isLoading: false,
  error: null,

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/appointments');
      set({ appointments: response.data.appointments, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch appointments', isLoading: false });
    }
  },

  fetchBarbers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/barbers');
      if (!response.ok) throw new Error('Failed to fetch barbers');
      const data = await response.json();
      set({ barbers: data.barbers, isLoading: false });
    } catch (error: any) {
      console.error('Barbers fetch error:', error);
      set({ error: error.message || 'Failed to fetch barbers', isLoading: false });
    }
  },

  fetchAvailableSlots: async (barberId, date) => {
    set({ isLoading: true, availableSlots: [], error: null });
    try {
      const response = await apiClient.get('/appointments/available-slots', {
        params: { barberId, date },
      });
      set({ availableSlots: response.data.slots, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch slots', isLoading: false });
    }
  },

  createAppointment: async (barberId, date, service, notes) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/appointments', {
        barberId,
        date,
        service,
        notes,
        duration: 30,
      });
      const { appointment } = response.data;
      set((state) => ({
        appointments: [...state.appointments, appointment],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create appointment', isLoading: false });
      throw error;
    }
  },

  cancelAppointment: async (appointmentId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/appointments/${appointmentId}`);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'CANCELLED' } : apt
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to cancel appointment', isLoading: false });
      throw error;
    }
  },

  confirmAppointment: async (appointmentId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.patch(`/appointments/${appointmentId}/confirm`);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'CONFIRMED' } : apt
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to confirm appointment', isLoading: false });
      throw error;
    }
  },

  completeAppointment: async (appointmentId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.patch(`/appointments/${appointmentId}/complete`);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'COMPLETED' } : apt
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to complete appointment', isLoading: false });
      throw error;
    }
  },
}));
