import type { MeterSnapshot } from '../../types/synth';
import { useSynthStore } from '../../store/synthStore';
import { LedButton } from '../ui/LedButton';

interface WorkstationPerformanceStripProps {
  meter: MeterSnapshot;
  onPanic: () => void;
  onTestTone: () => void;
}

export function WorkstationPerformanceStrip({ meter, onPanic, onTestTone }: WorkstationPerformanceStripProps) {
  const keyboardOctave = useSynthStore((state) => state.keyboardOctave);
  const defaultVelocity = useSynthStore((state) => state.defaultVelocity);
  const setKeyboardOctave = useSynthStore((state) => state.setKeyboardOctave);
  const setDefaultVelocity = useSynthStore((state) => state.setDefaultVelocity);
  const signalState = meter.clipping ? 'CLIP' : meter.peak > 0.006 ? 'SIGNAL' : 'READY';

  return (
    <section className="workstation-performance-strip" aria-label="Performance controls">
      <div className="workstation-strip-cluster">
        <button className="workstation-small-button" type="button" onClick={() => setKeyboardOctave(keyboardOctave - 1)}>
          Oct -
        </button>
        <div className="workstation-strip-lcd">OCT {keyboardOctave}</div>
        <button className="workstation-small-button" type="button" onClick={() => setKeyboardOctave(keyboardOctave + 1)}>
          Oct +
        </button>
      </div>

      <label className="workstation-velocity-control">
        <span>Velocity</span>
        <input className="range" type="range" min={0.05} max={1} step={0.01} value={defaultVelocity} onChange={(event) => setDefaultVelocity(Number(event.target.value))} />
        <strong>{Math.round(defaultVelocity * 100)}%</strong>
      </label>

      <div className="workstation-strip-cluster">
        <button className="workstation-small-button" type="button" onClick={onTestTone}>
          Test
        </button>
        <LedButton active={meter.clipping} danger onClick={onPanic}>
          Panic
        </LedButton>
      </div>

      <div className={meter.clipping ? 'workstation-strip-status is-hot' : 'workstation-strip-status'}>
        <span>{signalState}</span>
        <strong>{meter.activeVoices} voices</strong>
      </div>
    </section>
  );
}
