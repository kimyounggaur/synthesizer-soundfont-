import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useUiStore, type WorkstationPageId } from '../../store/uiStore';

export interface WorkstationPageDefinition {
  id: WorkstationPageId;
  label: string;
  shortLabel: string;
  group: string;
}

export const workstationPages: WorkstationPageDefinition[] = [
  { id: 'program', label: 'Program', shortLabel: 'Prog', group: 'Library' },
  { id: 'sample', label: 'Sample', shortLabel: 'Samp', group: 'Library' },
  { id: 'synth', label: 'Synth', shortLabel: 'Synth', group: 'Edit' },
  { id: 'filterAmp', label: 'Filter/Amp', shortLabel: 'Filt', group: 'Edit' },
  { id: 'mod', label: 'Modulation', shortLabel: 'Mod', group: 'Edit' },
  { id: 'waveVector', label: 'Wave/Vector', shortLabel: 'Wave', group: 'Motion' },
  { id: 'fx', label: 'Effects', shortLabel: 'FX', group: 'Output' },
  { id: 'global', label: 'Global', shortLabel: 'Global', group: 'System' },
];

interface WorkstationNavigationContextValue {
  activePage: WorkstationPageId;
  activePageDefinition: WorkstationPageDefinition;
  pages: WorkstationPageDefinition[];
  setActivePage: (page: WorkstationPageId) => void;
}

const WorkstationNavigationContext = createContext<WorkstationNavigationContextValue | null>(null);

export function useWorkstationNavigation(): WorkstationNavigationContextValue {
  const context = useContext(WorkstationNavigationContext);
  if (!context) {
    throw new Error('useWorkstationNavigation must be used inside WorkstationShell.');
  }
  return context;
}

export function WorkstationShell({ children }: { children: ReactNode }) {
  const activePage = useUiStore((state) => state.activePage);
  const setActivePage = useUiStore((state) => state.setActivePage);
  const activePageDefinition = workstationPages.find((page) => page.id === activePage) ?? workstationPages[0];
  const value = useMemo(
    () => ({
      activePage,
      activePageDefinition,
      pages: workstationPages,
      setActivePage,
    }),
    [activePage, activePageDefinition],
  );

  return (
    <WorkstationNavigationContext.Provider value={value}>
      <div className="workstation-shell">{children}</div>
    </WorkstationNavigationContext.Provider>
  );
}
