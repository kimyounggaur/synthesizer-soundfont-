import { create } from 'zustand';
import type { SynthPresetCategory } from '../types/synth';

export type WorkstationPageId = 'program' | 'sample' | 'synth' | 'filterAmp' | 'modulation' | 'waveVector' | 'effects' | 'global';
export type ProgramBankId = 'A' | 'B' | 'C';
export type ProgramCategoryFilter = SynthPresetCategory | 'All';

interface UiStore {
  activeWorkstationPage: WorkstationPageId;
  programBankId: ProgramBankId;
  programCategory: ProgramCategoryFilter;
  setActiveWorkstationPage: (page: WorkstationPageId) => void;
  setProgramBankId: (bankId: ProgramBankId) => void;
  setProgramCategory: (category: ProgramCategoryFilter) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  activeWorkstationPage: 'program',
  programBankId: 'A',
  programCategory: 'All',
  setActiveWorkstationPage: (page) => set({ activeWorkstationPage: page }),
  setProgramBankId: (bankId) => set({ programBankId: bankId }),
  setProgramCategory: (category) => set({ programCategory: category }),
}));
