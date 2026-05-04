import { EnvelopePanel } from '../../EnvelopePanel';
import { FilterPanel } from '../../FilterPanel';

export function FilterAmpPage() {
  return (
    <div className="workstation-lcd-page workstation-page-stack">
      <FilterPanel />
      <EnvelopePanel />
    </div>
  );
}
