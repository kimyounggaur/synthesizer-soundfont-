import { useWorkstationNavigation } from './WorkstationShell';

export function WorkstationSideButtons() {
  const { activePage, pages, setActivePage } = useWorkstationNavigation();

  return (
    <aside className="workstation-side-buttons" aria-label="Hardware page buttons">
      <div className="workstation-side-label">Mode Select</div>
      {pages.map((page, index) => (
        <button
          key={page.id}
          type="button"
          className={activePage === page.id ? 'workstation-hardware-button is-active' : 'workstation-hardware-button'}
          onClick={() => setActivePage(page.id)}
        >
          <span className="workstation-button-code">F{index + 1}</span>
          <span>{page.label}</span>
        </button>
      ))}
    </aside>
  );
}
