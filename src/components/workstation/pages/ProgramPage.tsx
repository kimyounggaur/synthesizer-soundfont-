import { PresetBrowser } from '../../PresetBrowser';
import type { MeterSnapshot } from '../../../types/synth';

export function ProgramPage({ meter }: { meter: MeterSnapshot }) {
  return (
    <div className="workstation-lcd-page workstation-lcd-page-program">
      <PresetBrowser meter={meter} />
    </div>
  );
}
