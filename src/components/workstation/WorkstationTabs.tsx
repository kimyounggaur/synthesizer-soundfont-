import { useUiStore, type WorkstationPageId } from '../../store/uiStore';

const tabs: Array<{ id: WorkstationPageId; label: string }> = [
  { id: 'program', label: 'PROGRAM' },
  { id: 'sample', label: 'SAMPLE' },
  { id: 'synth', label: 'SYNTH' },
  { id: 'filterAmp', label: 'FILTER/AMP' },
  { id: 'mod', label: 'MOD' },
  { id: 'waveVector', label: 'WAVE/VECTOR' },
  { id: 'fx', label: 'FX' },
  { id: 'global', label: 'GLOBAL' },
];

export function WorkstationTabs() {
  const activePage = useUiStore((state) => state.activePage);
  const setActivePage = useUiStore((state) => state.setActivePage);

  return (
    <nav className="workstation-tabs" aria-label="LCD pages">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activePage === tab.id ? 'workstation-tab is-active' : 'workstation-tab'}
          onClick={() => setActivePage(tab.id)}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
