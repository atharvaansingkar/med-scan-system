import { create } from 'zustand';
import { supabase } from './supabase';

export const useDashboardStore = create((set, get) => ({
  isScanning: false,
  capturedImage: null,
  scanResults: [],
  totalScansToday: 0,
  expiredItemsCount: 0,
  systemAccuracy: 100,
  processFrame: null,

  startScan: () => set({ isScanning: true }),
  stopScan:  () => set({ isScanning: false }),

  addCapturedImage: (img) => set({ capturedImage: img }),

  setProcessFrameFunction: (fn) => set({ processFrame: fn }),

  processFrameOnce: async () => {
    const capture = get().processFrame;
    if (capture) await capture();
  },

  addScanResult: (r) => set(state => ({ scanResults: [r, ...state.scanResults] })),

  fetchStats: async () => {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);

    const { data: scans, error } = await supabase
      .from('scans')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (!error) {
      const total = scans.length;
      const expired = scans.filter(s => s.status === 'expired').length;
      const avgAcc = total ? Math.round(scans.reduce((sum, s) => sum + (s.accuracy || 0), 0) / total) : 100;

      set({
        totalScansToday: total,
        expiredItemsCount: expired,
        systemAccuracy: avgAcc
      });
    }
  },

  loadScanResults: async () => {
    const { data, error } = await supabase.from('scans').select('*').order('created_at', { ascending: false });
    if (!error) set({ scanResults: data });
  }
}));
