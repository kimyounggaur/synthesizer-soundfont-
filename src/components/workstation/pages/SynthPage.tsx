import { useSynthStore } from '../../../store/synthStore';
import type { NoiseKind, OscillatorState, SynthWaveform } from '../../../types/synth';
import { Knob } from '../../ui/Knob';

const waveforms: SynthWaveform[] = ['sine', 'square', 'sawtooth', 'triangle', 'pulse', 'wavetable'];
const noiseKinds: NoiseKind[] = ['white', 'pink'];

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function WaveSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="workstation-lcd-control">
      <span>{label}</span>
      <select className="workstation-lcd-input" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function OscillatorCard({
  title,
  osc,
  tone,
  onChange,
}: {
  title: string;
  osc: OscillatorState;
  tone: 'cyan' | 'violet';
  onChange: (partial: Partial<OscillatorState>) => void;
}) {
  return (
    <section className="workstation-lcd-panel workstation-editor-card">
      <div className="workstation-editor-card-header">
        <div>
          <span>{title}</span>
          <strong>{osc.waveform}</strong>
        </div>
        <em>
          Oct {osc.octave} / Semi {osc.semitone}
        </em>
      </div>

      <WaveSelect label="Waveform" value={osc.waveform} options={waveforms} onChange={(waveform) => onChange({ waveform })} />

      <div className="workstation-editor-knobs workstation-editor-knobs-four">
        <Knob label="Octave" min={-2} max={2} step={1} value={osc.octave} onChange={(value) => onChange({ octave: value })} tone={tone} />
        <Knob label="Semi" min={-12} max={12} step={1} value={osc.semitone} onChange={(value) => onChange({ semitone: value })} tone={tone} />
        <Knob label="Fine" min={-50} max={50} step={1} value={osc.fine} onChange={(value) => onChange({ fine: value })} tone={tone} />
        <Knob label="Level" min={0} max={1} step={0.01} value={osc.level} onChange={(value) => onChange({ level: value })} displayValue={percent(osc.level)} tone={tone} />
      </div>
    </section>
  );
}

export function SynthPage() {
  const oscA = useSynthStore((state) => state.oscA);
  const oscB = useSynthStore((state) => state.oscB);
  const subOsc = useSynthStore((state) => state.subOsc);
  const noise = useSynthStore((state) => state.noise);
  const updateOscA = useSynthStore((state) => state.updateOscA);
  const updateOscB = useSynthStore((state) => state.updateOscB);
  const updateSubOsc = useSynthStore((state) => state.updateSubOsc);
  const updateNoise = useSynthStore((state) => state.updateNoise);
  const sourceTotal = oscA.level + oscB.level + (subOsc.enabled ? subOsc.level : 0) + (noise.enabled ? noise.level : 0);

  return (
    <div className="workstation-lcd-page workstation-synth-page">
      <div className="workstation-page-header">
        <div>
          <span>Oscillator Edit</span>
          <strong>OSC Basic / Sub Noise / Mix</strong>
        </div>
        <div className="workstation-page-header-metrics">
          <span>OSC A {percent(oscA.level)}</span>
          <span>OSC B {percent(oscB.level)}</span>
          <span>Mix {percent(Math.min(1, sourceTotal / 2.6))}</span>
        </div>
      </div>

      <div className="workstation-subtabs" aria-label="Synth edit sections">
        <span className="is-active">OSC Basic</span>
        <span>Sub / Noise</span>
        <span>Mix</span>
      </div>

      <div className="workstation-synth-grid">
        <OscillatorCard title="OSC A" osc={oscA} tone="cyan" onChange={updateOscA} />
        <OscillatorCard title="OSC B" osc={oscB} tone="violet" onChange={updateOscB} />

        <section className="workstation-lcd-panel workstation-editor-card">
          <div className="workstation-editor-card-header">
            <div>
              <span>Sub</span>
              <strong>{subOsc.enabled ? 'Online' : 'Muted'}</strong>
            </div>
            <button
              type="button"
              className={subOsc.enabled ? 'workstation-action-button is-primary' : 'workstation-action-button'}
              onClick={() => updateSubOsc({ enabled: !subOsc.enabled })}
            >
              Sub
            </button>
          </div>

          <WaveSelect label="Waveform" value={subOsc.waveform} options={waveforms} onChange={(waveform) => updateSubOsc({ waveform })} />

          <div className="workstation-editor-knobs workstation-editor-knobs-two">
            <Knob label="Octave" min={-3} max={0} step={1} value={subOsc.octave} onChange={(value) => updateSubOsc({ octave: value })} tone="mint" />
            <Knob label="Level" min={0} max={1} step={0.01} value={subOsc.level} onChange={(value) => updateSubOsc({ level: value })} displayValue={percent(subOsc.level)} tone="mint" />
          </div>
        </section>

        <section className="workstation-lcd-panel workstation-editor-card">
          <div className="workstation-editor-card-header">
            <div>
              <span>Noise</span>
              <strong>{noise.enabled ? 'Online' : 'Muted'}</strong>
            </div>
            <button
              type="button"
              className={noise.enabled ? 'workstation-action-button is-primary' : 'workstation-action-button'}
              onClick={() => updateNoise({ enabled: !noise.enabled })}
            >
              Noise
            </button>
          </div>

          <WaveSelect label="Type" value={noise.kind} options={noiseKinds} onChange={(kind) => updateNoise({ kind })} />

          <div className="workstation-editor-knobs workstation-editor-knobs-two">
            <Knob label="Level" min={0} max={1} step={0.01} value={noise.level} onChange={(value) => updateNoise({ level: value })} displayValue={percent(noise.level)} tone="amber" />
          </div>
        </section>
      </div>

      <section className="workstation-lcd-panel workstation-mix-panel">
        <div className="workstation-sample-list-header">
          <span>Source Mix</span>
          <strong>Osc / Sub / Noise</strong>
        </div>
        <div className="workstation-mix-bars">
          {[
            ['OSC A', oscA.level, '#5ee8ff'],
            ['OSC B', oscB.level, '#a674ff'],
            ['SUB', subOsc.enabled ? subOsc.level : 0, '#51f5c6'],
            ['NOISE', noise.enabled ? noise.level : 0, '#f2b84b'],
          ].map(([label, value, color]) => (
            <div key={label} className="workstation-mix-bar">
              <span>{label}</span>
              <div>
                <i style={{ width: `${Number(value) * 100}%`, background: String(color) }} />
              </div>
              <strong>{percent(Number(value))}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
