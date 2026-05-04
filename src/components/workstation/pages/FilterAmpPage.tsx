import { useSynthStore } from '../../../store/synthStore';
import type { EnvelopeState, FilterKind } from '../../../types/synth';
import { Knob } from '../../ui/Knob';

const filterTypes: FilterKind[] = ['lowpass', 'highpass', 'bandpass', 'notch', 'ladder'];
const envelopeKeys: Array<keyof EnvelopeState> = ['attack', 'decay', 'sustain', 'release'];

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function cutoff(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${Math.round(value)} Hz`;
}

function time(value: number): string {
  return value >= 1 ? `${value.toFixed(2)}s` : `${Math.round(value * 1000)}ms`;
}

function envelopeValue(key: keyof EnvelopeState, value: number): string {
  return key === 'sustain' ? percent(value) : time(value);
}

function labelFor(key: keyof EnvelopeState): string {
  return key === 'attack' ? 'Attack' : key === 'decay' ? 'Decay' : key === 'sustain' ? 'Sustain' : 'Release';
}

function filterPosition(value: number): number {
  return Math.min(92, Math.max(8, ((Math.log10(value) - Math.log10(24)) / (Math.log10(18000) - Math.log10(24))) * 84 + 8));
}

function envelopePath(env: EnvelopeState): string {
  const attackX = 8 + Math.min(24, env.attack * 8);
  const decayX = attackX + Math.min(24, env.decay * 8) + 12;
  const sustainY = 86 - env.sustain * 62;
  const releaseX = Math.max(84, 96 - Math.min(10, env.release * 1.4));
  return `M 4 88 L ${attackX.toFixed(1)} 14 L ${decayX.toFixed(1)} ${sustainY.toFixed(1)} L ${releaseX.toFixed(1)} ${sustainY.toFixed(1)} L 98 88`;
}

function EnvelopeGraph({ title, env }: { title: string; env: EnvelopeState }) {
  return (
    <div className="workstation-adsr-graph">
      <div className="workstation-sample-list-header">
        <span>{title} EG</span>
        <strong>
          A {time(env.attack)} / R {time(env.release)}
        </strong>
      </div>
      <svg viewBox="0 0 100 100" role="img" aria-label={`${title} envelope graph`}>
        <path d="M 4 88 H 98" className="workstation-adsr-base" />
        <path d={envelopePath(env)} className="workstation-adsr-line" />
      </svg>
    </div>
  );
}

function EnvelopeBank({ title, env, onChange }: { title: string; env: EnvelopeState; onChange: (partial: Partial<EnvelopeState>) => void }) {
  return (
    <section className="workstation-lcd-panel workstation-envelope-bank">
      <div className="workstation-sample-list-header">
        <span>{title} EG</span>
        <strong>ADSR</strong>
      </div>
      <div className="workstation-editor-knobs workstation-editor-knobs-four">
        {envelopeKeys.map((key) => (
          <Knob
            key={key}
            label={labelFor(key)}
            min={key === 'sustain' ? 0 : 0.001}
            max={key === 'sustain' ? 1 : 4}
            step={key === 'sustain' ? 0.01 : 0.001}
            value={env[key]}
            onChange={(value) => onChange({ [key]: value })}
            displayValue={envelopeValue(key, env[key])}
            tone={key === 'sustain' ? 'amber' : 'violet'}
          />
        ))}
      </div>
    </section>
  );
}

export function FilterAmpPage() {
  const filter = useSynthStore((state) => state.filter);
  const ampEnv = useSynthStore((state) => state.ampEnv);
  const filterEnv = useSynthStore((state) => state.filterEnv);
  const updateFilter = useSynthStore((state) => state.updateFilter);
  const updateEnvelope = useSynthStore((state) => state.updateEnvelope);

  return (
    <div className="workstation-lcd-page workstation-filteramp-page">
      <div className="workstation-page-header">
        <div>
          <span>Filter / Amp</span>
          <strong>{filter.type} / Amp EG / Filter EG</strong>
        </div>
        <div className="workstation-page-header-metrics">
          <span>Cutoff {cutoff(filter.cutoff)}</span>
          <span>Res {filter.resonance.toFixed(1)}</span>
          <span>Env {percent(filter.envelopeAmount)}</span>
        </div>
      </div>

      <div className="workstation-filteramp-layout">
        <section className="workstation-lcd-panel workstation-filter-display">
          <div className="workstation-sample-list-header">
            <span>Filter</span>
            <strong>{filter.type}</strong>
          </div>
          <label className="workstation-lcd-control">
            <span>Type</span>
            <select className="workstation-lcd-input" value={filter.type} onChange={(event) => updateFilter({ type: event.target.value as FilterKind })}>
              {filterTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <div className="workstation-filter-curve" aria-label="Filter curve">
            <span className="workstation-filter-curve-line" />
            <span className="workstation-filter-curve-dot" style={{ left: `${filterPosition(filter.cutoff)}%` }} />
          </div>
        </section>

        <section className="workstation-envelope-graphs">
          <EnvelopeGraph title="Amp" env={ampEnv} />
          <EnvelopeGraph title="Filter" env={filterEnv} />
        </section>
      </div>

      <section className="workstation-lcd-panel workstation-filter-knob-panel">
        <div className="workstation-sample-list-header">
          <span>Filter Controls</span>
          <strong>VCF</strong>
        </div>
        <div className="workstation-editor-knobs workstation-filteramp-knobs">
          <Knob label="Cutoff" min={24} max={18000} step={1} value={filter.cutoff} onChange={(value) => updateFilter({ cutoff: value })} displayValue={cutoff(filter.cutoff)} tone="amber" />
          <Knob label="Res" min={0.1} max={24} step={0.1} value={filter.resonance} onChange={(value) => updateFilter({ resonance: value })} tone="amber" />
          <Knob label="Drive" min={0} max={1} step={0.01} value={filter.drive} onChange={(value) => updateFilter({ drive: value })} displayValue={percent(filter.drive)} tone="amber" />
          <Knob label="Key Track" min={0} max={1} step={0.01} value={filter.keyTracking} onChange={(value) => updateFilter({ keyTracking: value })} displayValue={percent(filter.keyTracking)} tone="cyan" />
          <Knob label="Env Amt" min={-1} max={1} step={0.01} value={filter.envelopeAmount} onChange={(value) => updateFilter({ envelopeAmount: value })} displayValue={percent(filter.envelopeAmount)} tone="cyan" />
        </div>
      </section>

      <div className="workstation-envelope-edit-grid">
        <EnvelopeBank title="Amp" env={ampEnv} onChange={(partial) => updateEnvelope('ampEnv', partial)} />
        <EnvelopeBank title="Filter" env={filterEnv} onChange={(partial) => updateEnvelope('filterEnv', partial)} />
      </div>
    </div>
  );
}
