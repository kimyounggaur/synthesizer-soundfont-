import { create } from 'zustand';

export type WorkstationPageId =
  | 'program'
  | 'sample'
  | 'synth'
  | 'filterAmp'
  | 'mod'
  | 'waveVector'
  | 'fx'
  | 'global';

interface UiStore {
  activePage: WorkstationPageId;
  setActivePage: (page: WorkstationPageId) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  activePage: 'program',
  setActivePage: (page) => set({ activePage: page }),
}));
