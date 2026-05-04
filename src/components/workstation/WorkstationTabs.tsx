import { useWorkstationNavigation } from './WorkstationShell';

export function WorkstationTabs() {
  const { activePage, pages, setActivePage } = useWorkstationNavigation();

  return (
    <nav className="workstation-tabs" aria-label="LCD pages">
      {pages.map((page) => (
        <button
          key={page.id}
          type="button"
          className={activePage === page.id ? 'workstation-tab is-active' : 'workstation-tab'}
          onClick={() => setActivePage(page.id)}
        >
          <span>{page.shortLabel}</span>
          <small>{page.group}</small>
        </button>
      ))}
    </nav>
  );
}
