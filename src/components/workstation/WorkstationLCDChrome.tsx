export type WorkstationStatus = 'READY' | 'LOADING SAMPLE' | 'FALLBACK SAMPLE' | 'CLIPPING' | 'AUDIO SUSPENDED';

export type WorkstationSoftKeyId = never;

interface WorkstationBreadcrumbProps {
  items: Array<string | null | undefined>;
}

interface WorkstationSoftKeysProps {
  enabledKeys?: WorkstationSoftKeyId[];
}

interface WorkstationStatusBarProps {
  message: string;
  status?: WorkstationStatus;
}

interface WorkstationPageTabsProps {
  labels: string[];
  ariaLabel: string;
  variant?: 'tabs' | 'subtabs';
}

function statusClassName(status: WorkstationStatus): string {
  return `workstation-status-${status.toLowerCase().replace(/\s+/g, '-')}`;
}

export function WorkstationBreadcrumb({ items }: WorkstationBreadcrumbProps) {
  const visibleItems = items.filter((item): item is string => Boolean(item));

  return (
    <div className="workstation-breadcrumb" aria-label="LCD location">
      {visibleItems.map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </div>
  );
}

export function WorkstationSoftKeys({ enabledKeys = [] }: WorkstationSoftKeysProps) {
  void enabledKeys;
  return null;
}

export function WorkstationPageTabs({ labels, ariaLabel, variant = 'subtabs' }: WorkstationPageTabsProps) {
  void labels;
  void ariaLabel;
  void variant;
  return null;
}

export function WorkstationStatusBar({ message, status = 'READY' }: WorkstationStatusBarProps) {
  return (
    <footer className={`workstation-status-bar ${statusClassName(status)}`}>
      <span>{message}</span>
      <strong className="workstation-status-code">{status}</strong>
    </footer>
  );
}
