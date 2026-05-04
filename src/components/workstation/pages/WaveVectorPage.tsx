import { VectorMixerPanel } from '../../VectorMixerPanel';
import { WaveSequencerPanel } from '../../WaveSequencerPanel';

export function WaveVectorPage() {
  return (
    <div className="workstation-lcd-page workstation-page-stack">
      <VectorMixerPanel />
      <WaveSequencerPanel />
    </div>
  );
}
