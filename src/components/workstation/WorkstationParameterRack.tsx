import { Knob } from '../ui/Knob';
import { LedButton } from '../ui/LedButton';
import { useSynthStore } from '../../store/synthStore';
import { useWorkstationNavigation } from './WorkstationShell';

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function time(value: number): string {
  return value >= 1 ? `${value.toFixed(2)}s` : `${Math.round(value * 1000)}ms`;
}

function cutoff(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${Math.round(value)} Hz`;
}

export function WorkstationParameterRack() {
  const { activePageDefinition, activePage } = useWorkstationNavigation();
  const oscA = useSynthStore((state) => state.oscA);
  const oscB = useSynthStore((state) => state.oscB);
  const filter = useSynthStore((state) => state.filter);
  const ampEnv = useSynthStore((state) => state.ampEnv);
  const filterEnv = useSynthStore((state) => state.filterEnv);
  const sampleLayer = useSynthStore((state) => state.sampleLayer);
  const lfo1 = useSynthStore((state) => state.lfo1);
  const vectorMixer = useSynthStore((state) => state.vectorMixer);
  const waveSequencer = useSynthStore((state) => state.waveSequencer);
  const effects = useSynthStore((state) => state.effects);
  const updateOscA = useSynthStore((state) => state.updateOscA);
  const updateOscB = useSynthStore((state) => state.updateOscB);
  const updateFilter = useSynthStore((state) => state.updateFilter);
  const updateEnvelope = useSynthStore((state) => state.updateEnvelope);
  const updateSampleLayer = useSynthStore((state) => state.updateSampleLayer);
  const updateLFO = useSynthStore((state) => state.updateLFO);
  const updateVectorPosition = useSynthStore((state) => state.updateVectorPosition);
  const updateWaveSequencer = useSynthStore((state) => state.updateWaveSequencer);
  const updateEffect = useSynthStore((state) => state.updateEffect);
  const firstEffect = effects[0];

  return (
    <aside className="workstation-parameter-rack" aria-label="Parameter rack">
      <div className="workstation-rack-title">
        <span>Parameter Rack</span>
        <strong>{activePageDefinition.shortLabel}</strong>
      </div>

      {activePage === 'sample' || activePage === 'program' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Sample Layer</div>
          <LedButton active={sampleLayer.enabled} onClick={() => updateSampleLayer({ enabled: !sampleLayer.enabled })}>
            Layer
          </LedButton>
          <div className="workstation-rack-grid">
            <Knob label="Level" min={0} max={1.5} step={0.01} value={sampleLayer.level} onChange={(value) => updateSampleLayer({ level: value })} displayValue={percent(sampleLayer.level)} tone="mint" />
            <Knob label="Attack" min={0.001} max={4} step={0.001} value={sampleLayer.attack} onChange={(value) => updateSampleLayer({ attack: value })} displayValue={time(sampleLayer.attack)} tone="cyan" />
            <Knob label="Release" min={0.001} max={6} step={0.001} value={sampleLayer.release} onChange={(value) => updateSampleLayer({ release: value })} displayValue={time(sampleLayer.release)} tone="cyan" />
            <Knob label="Cutoff" min={24} max={20000} step={1} value={sampleLayer.filterCutoff} onChange={(value) => updateSampleLayer({ filterCutoff: value, filterEnabled: true })} displayValue={cutoff(sampleLayer.filterCutoff)} tone="amber" />
          </div>
        </div>
      ) : null}

      {activePage === 'synth' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Osc Mixer</div>
          <div className="workstation-rack-grid">
            <Knob label="A Level" min={0} max={1} step={0.01} value={oscA.level} onChange={(value) => updateOscA({ level: value })} displayValue={percent(oscA.level)} tone="cyan" />
            <Knob label="B Level" min={0} max={1} step={0.01} value={oscB.level} onChange={(value) => updateOscB({ level: value })} displayValue={percent(oscB.level)} tone="violet" />
            <Knob label="A Semi" min={-12} max={12} step={1} value={oscA.semitone} onChange={(value) => updateOscA({ semitone: value })} tone="cyan" />
            <Knob label="B Semi" min={-12} max={12} step={1} value={oscB.semitone} onChange={(value) => updateOscB({ semitone: value })} tone="violet" />
          </div>
        </div>
      ) : null}

      {activePage === 'filterAmp' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Filter / Amp</div>
          <div className="workstation-rack-grid">
            <Knob label="Cutoff" min={24} max={18000} step={1} value={filter.cutoff} onChange={(value) => updateFilter({ cutoff: value })} displayValue={cutoff(filter.cutoff)} tone="amber" />
            <Knob label="Res" min={0.1} max={24} step={0.1} value={filter.resonance} onChange={(value) => updateFilter({ resonance: value })} tone="amber" />
            <Knob label="Amp A" min={0.001} max={4} step={0.001} value={ampEnv.attack} onChange={(value) => updateEnvelope('ampEnv', { attack: value })} displayValue={time(ampEnv.attack)} tone="mint" />
            <Knob label="Amp R" min={0.001} max={6} step={0.001} value={ampEnv.release} onChange={(value) => updateEnvelope('ampEnv', { release: value })} displayValue={time(ampEnv.release)} tone="mint" />
            <Knob label="Env Amt" min={-1} max={1} step={0.01} value={filter.envelopeAmount} onChange={(value) => updateFilter({ envelopeAmount: value })} displayValue={percent(filter.envelopeAmount)} tone="cyan" />
            <Knob label="Filt R" min={0.001} max={6} step={0.001} value={filterEnv.release} onChange={(value) => updateEnvelope('filterEnv', { release: value })} displayValue={time(filterEnv.release)} tone="cyan" />
          </div>
        </div>
      ) : null}

      {activePage === 'mod' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">LFO Quick Edit</div>
          <div className="workstation-rack-grid">
            <Knob label="Rate" min={0.01} max={30} step={0.01} value={lfo1.rate} onChange={(value) => updateLFO('lfo1', { rate: value })} displayValue={`${lfo1.rate.toFixed(2)}Hz`} tone="violet" />
            <Knob label="Depth" min={0} max={1} step={0.01} value={lfo1.depth} onChange={(value) => updateLFO('lfo1', { depth: value })} displayValue={percent(lfo1.depth)} tone="violet" />
          </div>
        </div>
      ) : null}

      {activePage === 'waveVector' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Motion</div>
          <LedButton active={waveSequencer.enabled} onClick={() => updateWaveSequencer({ enabled: !waveSequencer.enabled })}>
            Seq
          </LedButton>
          <div className="workstation-rack-grid">
            <Knob label="Vector X" min={0} max={1} step={0.01} value={vectorMixer.x} onChange={(value) => updateVectorPosition({ x: value })} displayValue={percent(vectorMixer.x)} tone="cyan" />
            <Knob label="Vector Y" min={0} max={1} step={0.01} value={vectorMixer.y} onChange={(value) => updateVectorPosition({ y: value })} displayValue={percent(vectorMixer.y)} tone="mint" />
          </div>
        </div>
      ) : null}

      {activePage === 'fx' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Insert FX</div>
          {firstEffect ? (
            <div className="workstation-rack-grid">
              <Knob label="Wet" min={0} max={1} step={0.01} value={firstEffect.wet} onChange={(value) => updateEffect(firstEffect.id, { wet: value })} displayValue={percent(firstEffect.wet)} tone="cyan" />
            </div>
          ) : (
            <div className="workstation-rack-empty">No insert loaded</div>
          )}
        </div>
      ) : null}

      {activePage === 'global' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">System</div>
          <div className="workstation-rack-empty">MIDI and global setup are shown on the LCD.</div>
        </div>
      ) : null}
    </aside>
  );
}
