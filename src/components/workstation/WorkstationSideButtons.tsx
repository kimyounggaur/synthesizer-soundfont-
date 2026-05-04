import { useSynthStore } from '../../store/synthStore';
import { useUiStore, type WorkstationPageId } from '../../store/uiStore';

interface SideButtonDefinition {
  id: string;
  label: string;
  page: WorkstationPageId;
  engineMode?: 'hybrid';
  activePage?: WorkstationPageId;
}

const sideButtons: SideButtonDefinition[] = [
  { id: 'program', label: 'PROGRAM', page: 'program', activePage: 'program' },
  { id: 'sample', label: 'SAMPLE', page: 'sample', activePage: 'sample' },
  { id: 'hybrid', label: 'HYBRID', page: 'sample', engineMode: 'hybrid' },
  { id: 'seq', label: 'SEQ', page: 'waveVector', activePage: 'waveVector' },
  { id: 'global', label: 'GLOBAL', page: 'global', activePage: 'global' },
  { id: 'utility', label: 'UTILITY', page: 'global' },
  { id: 'browser', label: 'BROWSER', page: 'program' },
  { id: 'exit', label: 'EXIT', page: 'program' },
];

export function WorkstationSideButtons() {
  const activePage = useUiStore((state) => state.activePage);
  const setActivePage = useUiStore((state) => state.setActivePage);
  const engineMode = useSynthStore((state) => state.engineMode);
  const setEngineMode = useSynthStore((state) => state.setEngineMode);

  return (
    <aside className="workstation-side-buttons" aria-label="Hardware page buttons">
      <div className="workstation-side-label">Mode Select</div>
      {sideButtons.map((button) => {
        const active = button.id === 'hybrid' ? activePage === 'sample' && engineMode === 'hybrid' : button.activePage === activePage;
        return (
          <button
            key={button.id}
            type="button"
            className={active ? 'workstation-hardware-button is-active' : 'workstation-hardware-button'}
            onClick={() => {
              if (button.engineMode) {
                setEngineMode(button.engineMode);
              }
              setActivePage(button.page);
            }}
          >
            <span className="workstation-button-led" aria-hidden="true" />
            <span>{button.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
