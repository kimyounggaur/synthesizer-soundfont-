import { MidiPanel } from '../../MidiPanel';
import { OutputMeter } from '../../OutputMeter';
import type { MeterSnapshot } from '../../../types/synth';

export function GlobalPage({ meter }: { meter: MeterSnapshot }) {
  return (
    <div className="workstation-lcd-page workstation-page-stack">
      <MidiPanel />
      <OutputMeter meter={meter} />
    </div>
  );
}
