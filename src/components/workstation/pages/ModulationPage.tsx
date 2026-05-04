import { useSynthStore } from '../../../store/synthStore';
import type { LfoState, LfoTarget, SynthWaveform, TempoSyncValue } from '../../../types/synth';
import { Knob } from '../../ui/Knob';

const waveforms: SynthWaveform[] = ['sine', 'triangle', 'square', 'sawtooth', 'pulse', 'wavetable'];
const targets: LfoTarget[] = ['filterCutoff', 'pitch', 'ampLevel', 'pan', 'oscMix', 'wavePosition'];
const syncValues: TempoSyncValue[] = ['1/1', '1/2', '1/4', '1/8', '1/16', '1/32'];

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function targetLabel(target: LfoTarget): string {
  const labels: Record<LfoTarget, string> = {
    filterCutoff: 'Filter Cutoff',
    pitch: 'Pitch',
    ampLevel: 'Amp Level',
    pan: 'Pan',
    oscMix: 'Osc Mix',
    wavePosition: 'Wave Position',
  };
  return labels[target];
}

function SelectControl<T extends string>({
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

function LfoCard({ title, lfo, onChange }: { title: string; lfo: LfoState; onChange: (partial: Partial<LfoState>) => void }) {
  const active = lfo.depth > 0.001;

  return (
    <section className="workstation-lcd-panel workstation-lfo-card">
      <div className="workstation-lfo-header">
        <div className={active ? 'workstation-lfo-led is-active' : 'workstation-lfo-led'} />
        <div>
          <span>{title}</span>
          <strong>{targetLabel(lfo.target)}</strong>
        </div>
        <em>{lfo.sync === 'tempo' ? lfo.syncValue : `${lfo.rate.toFixed(2)} Hz`}</em>
      </div>

      <div className="workstation-lfo-control-grid">
        <SelectControl label="Waveform" value={lfo.waveform} options={waveforms} onChange={(waveform) => onChange({ waveform })} />
        <SelectControl label="Target" value={lfo.target} options={targets} onChange={(target) => onChange({ target })} />
        <SelectControl label="Sync" value={lfo.sync} options={['free', 'tempo']} onChange={(sync) => onChange({ sync })} />
        <SelectControl label="Division" value={lfo.syncValue} options={syncValues} onChange={(syncValue) => onChange({ syncValue })} />
      </div>

      <div className="workstation-editor-knobs workstation-editor-knobs-two">
        <Knob label="Rate" min={0.01} max={30} step={0.01} value={lfo.rate} onChange={(value) => onChange({ rate: value })} displayValue={`${lfo.rate.toFixed(2)}Hz`} tone="violet" />
        <Knob label="Depth" min={0} max={1} step={0.01} value={lfo.depth} onChange={(value) => onChange({ depth: value })} displayValue={percent(lfo.depth)} tone="cyan" />
      </div>
    </section>
  );
}

export function ModulationPage() {
  const lfo1 = useSynthStore((state) => state.lfo1);
  const lfo2 = useSynthStore((state) => state.lfo2);
  const bpm = useSynthStore((state) => state.bpm);
  const updateLFO = useSynthStore((state) => state.updateLFO);

  return (
    <div className="workstation-lcd-page workstation-mod-page">
      <div className="workstation-page-header">
        <div>
          <span>Modulation</span>
          <strong>LFO Routing Matrix</strong>
        </div>
        <div className="workstation-page-header-metrics">
          <span>BPM {bpm}</span>
          <span>LFO1 {lfo1.depth > 0 ? 'On' : 'Off'}</span>
          <span>LFO2 {lfo2.depth > 0 ? 'On' : 'Off'}</span>
        </div>
      </div>

      <div className="workstation-mod-grid">
        <LfoCard title="LFO 1" lfo={lfo1} onChange={(partial) => updateLFO('lfo1', partial)} />
        <LfoCard title="LFO 2" lfo={lfo2} onChange={(partial) => updateLFO('lfo2', partial)} />

        <section className="workstation-lcd-panel workstation-routing-panel">
          <div className="workstation-sample-list-header">
            <span>Target Routing</span>
            <strong>LCD Matrix</strong>
          </div>
          <div className="workstation-routing-list">
            {targets.map((target) => {
              const lfo1Active = lfo1.target === target && lfo1.depth > 0.001;
              const lfo2Active = lfo2.target === target && lfo2.depth > 0.001;
              return (
                <div key={target} className={lfo1Active || lfo2Active ? 'workstation-routing-row is-active' : 'workstation-routing-row'}>
                  <span>{targetLabel(target)}</span>
                  <div>
                    <em className={lfo1Active ? 'workstation-route-chip is-active' : 'workstation-route-chip'}>LFO1 {lfo1.target === target ? percent(lfo1.depth) : '--'}</em>
                    <em className={lfo2Active ? 'workstation-route-chip is-active' : 'workstation-route-chip'}>LFO2 {lfo2.target === target ? percent(lfo2.depth) : '--'}</em>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="workstation-lcd-panel workstation-sync-panel">
          <div className="workstation-sample-list-header">
            <span>Tempo Sync</span>
            <strong>{bpm} BPM</strong>
          </div>
          <div className="workstation-sync-readouts">
            <div className={lfo1.sync === 'tempo' ? 'workstation-sync-readout is-active' : 'workstation-sync-readout'}>
              <span>LFO 1</span>
              <strong>{lfo1.sync === 'tempo' ? lfo1.syncValue : `${lfo1.rate.toFixed(2)} Hz`}</strong>
            </div>
            <div className={lfo2.sync === 'tempo' ? 'workstation-sync-readout is-active' : 'workstation-sync-readout'}>
              <span>LFO 2</span>
              <strong>{lfo2.sync === 'tempo' ? lfo2.syncValue : `${lfo2.rate.toFixed(2)} Hz`}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
