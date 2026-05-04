import { Knob } from '../ui/Knob';
import { useSynthStore } from '../../store/synthStore';
import { useUiStore } from '../../store/uiStore';
import type { EffectState } from '../../types/synth';
import { workstationPages } from './WorkstationShell';

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function time(value: number): string {
  return value >= 1 ? `${value.toFixed(2)}s` : `${Math.round(value * 1000)}ms`;
}

function cutoff(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${Math.round(value)} Hz`;
}

function effectParam(effect: EffectState | undefined, name: string, fallback: number): number {
  return effect?.params[name] ?? fallback;
}

export function WorkstationParameterRack() {
  const activePage = useUiStore((state) => state.activePage);
  const activePageDefinition = workstationPages.find((page) => page.id === activePage) ?? workstationPages[0];
  const masterVolume = useSynthStore((state) => state.masterVolume);
  const bpm = useSynthStore((state) => state.bpm);
  const polyphony = useSynthStore((state) => state.polyphony);
  const defaultVelocity = useSynthStore((state) => state.defaultVelocity);
  const oscA = useSynthStore((state) => state.oscA);
  const oscB = useSynthStore((state) => state.oscB);
  const subOsc = useSynthStore((state) => state.subOsc);
  const noise = useSynthStore((state) => state.noise);
  const filter = useSynthStore((state) => state.filter);
  const sampleLayer = useSynthStore((state) => state.sampleLayer);
  const lfo1 = useSynthStore((state) => state.lfo1);
  const vectorMixer = useSynthStore((state) => state.vectorMixer);
  const waveSequencer = useSynthStore((state) => state.waveSequencer);
  const effects = useSynthStore((state) => state.effects);
  const setMasterVolume = useSynthStore((state) => state.setMasterVolume);
  const setBpm = useSynthStore((state) => state.setBpm);
  const setPolyphony = useSynthStore((state) => state.setPolyphony);
  const setDefaultVelocity = useSynthStore((state) => state.setDefaultVelocity);
  const updateOscA = useSynthStore((state) => state.updateOscA);
  const updateOscB = useSynthStore((state) => state.updateOscB);
  const updateSubOsc = useSynthStore((state) => state.updateSubOsc);
  const updateNoise = useSynthStore((state) => state.updateNoise);
  const updateFilter = useSynthStore((state) => state.updateFilter);
  const updateSampleLayer = useSynthStore((state) => state.updateSampleLayer);
  const updateLFO = useSynthStore((state) => state.updateLFO);
  const updateVectorPosition = useSynthStore((state) => state.updateVectorPosition);
  const updateWaveSequencer = useSynthStore((state) => state.updateWaveSequencer);
  const updateEffect = useSynthStore((state) => state.updateEffect);
  const firstEffect = effects[0];
  const delayEffect = effects.find((effect) => effect.type === 'delay');
  const reverbEffect = effects.find((effect) => effect.type === 'reverb');

  return (
    <aside className="workstation-parameter-rack" aria-label="Parameter rack">
      <div className="workstation-rack-title">
        <span>Parameter Rack</span>
        <strong>{activePageDefinition.shortLabel}</strong>
      </div>

      {activePage === 'program' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Program Control</div>
          <div className="workstation-rack-grid">
            <Knob label="Master" min={0} max={1} step={0.01} value={masterVolume} onChange={setMasterVolume} displayValue={percent(masterVolume)} tone="mint" />
            <Knob label="BPM" min={40} max={240} step={1} value={bpm} onChange={setBpm} tone="cyan" />
            <Knob label="Voices" min={1} max={16} step={1} value={polyphony} onChange={setPolyphony} tone="violet" />
            <Knob label="Velocity" min={0.05} max={1} step={0.01} value={defaultVelocity} onChange={setDefaultVelocity} displayValue={percent(defaultVelocity)} tone="amber" />
          </div>
        </div>
      ) : null}

      {activePage === 'sample' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Sample Layer</div>
          <div className="workstation-rack-grid">
            <Knob label="Samp Lvl" min={0} max={1.5} step={0.01} value={sampleLayer.level} onChange={(value) => updateSampleLayer({ level: value })} displayValue={percent(sampleLayer.level)} tone="mint" />
            <Knob label="Attack" min={0.001} max={4} step={0.001} value={sampleLayer.attack} onChange={(value) => updateSampleLayer({ attack: value })} displayValue={time(sampleLayer.attack)} tone="cyan" />
            <Knob label="Decay" min={0.001} max={4} step={0.001} value={sampleLayer.decay} onChange={(value) => updateSampleLayer({ decay: value })} displayValue={time(sampleLayer.decay)} tone="cyan" />
            <Knob label="Sustain" min={0} max={1} step={0.01} value={sampleLayer.sustain} onChange={(value) => updateSampleLayer({ sustain: value })} displayValue={percent(sampleLayer.sustain)} tone="amber" />
            <Knob label="Release" min={0.001} max={6} step={0.001} value={sampleLayer.release} onChange={(value) => updateSampleLayer({ release: value })} displayValue={time(sampleLayer.release)} tone="cyan" />
            <Knob label="Cutoff" min={24} max={20000} step={1} value={sampleLayer.filterCutoff} onChange={(value) => updateSampleLayer({ filterCutoff: value, filterEnabled: true })} displayValue={cutoff(sampleLayer.filterCutoff)} tone="amber" />
            <Knob label="Res" min={0.1} max={24} step={0.1} value={sampleLayer.filterResonance} onChange={(value) => updateSampleLayer({ filterResonance: value, filterEnabled: true })} tone="amber" />
          </div>
        </div>
      ) : null}

      {activePage === 'synth' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Source Mixer</div>
          <div className="workstation-rack-grid">
            <Knob label="Osc A" min={0} max={1} step={0.01} value={oscA.level} onChange={(value) => updateOscA({ level: value })} displayValue={percent(oscA.level)} tone="cyan" />
            <Knob label="Osc B" min={0} max={1} step={0.01} value={oscB.level} onChange={(value) => updateOscB({ level: value })} displayValue={percent(oscB.level)} tone="violet" />
            <Knob label="Sub" min={0} max={1} step={0.01} value={subOsc.level} onChange={(value) => updateSubOsc({ level: value, enabled: value > 0.001 })} displayValue={percent(subOsc.level)} tone="mint" />
            <Knob label="Noise" min={0} max={1} step={0.01} value={noise.level} onChange={(value) => updateNoise({ level: value, enabled: value > 0.001 })} displayValue={percent(noise.level)} tone="amber" />
          </div>
        </div>
      ) : null}

      {activePage === 'filterAmp' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Filter / Amp</div>
          <div className="workstation-rack-grid">
            <Knob label="Cutoff" min={24} max={18000} step={1} value={filter.cutoff} onChange={(value) => updateFilter({ cutoff: value })} displayValue={cutoff(filter.cutoff)} tone="amber" />
            <Knob label="Res" min={0.1} max={24} step={0.1} value={filter.resonance} onChange={(value) => updateFilter({ resonance: value })} tone="amber" />
            <Knob label="Drive" min={0} max={1} step={0.01} value={filter.drive} onChange={(value) => updateFilter({ drive: value })} displayValue={percent(filter.drive)} tone="amber" />
            <Knob label="Key" min={0} max={1} step={0.01} value={filter.keyTracking} onChange={(value) => updateFilter({ keyTracking: value })} displayValue={percent(filter.keyTracking)} tone="cyan" />
            <Knob label="Env Amt" min={-1} max={1} step={0.01} value={filter.envelopeAmount} onChange={(value) => updateFilter({ envelopeAmount: value })} displayValue={percent(filter.envelopeAmount)} tone="cyan" />
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
          <div className="workstation-rack-grid">
            <Knob label="Vector X" min={0} max={1} step={0.01} value={vectorMixer.x} onChange={(value) => updateVectorPosition({ x: value })} displayValue={percent(vectorMixer.x)} tone="cyan" />
            <Knob label="Vector Y" min={0} max={1} step={0.01} value={vectorMixer.y} onChange={(value) => updateVectorPosition({ y: value })} displayValue={percent(vectorMixer.y)} tone="mint" />
            <Knob label="Steps" min={0} max={1} step={1} value={waveSequencer.enabled ? 1 : 0} onChange={(value) => updateWaveSequencer({ enabled: value >= 1 })} displayValue={waveSequencer.enabled ? 'On' : 'Off'} tone="amber" />
          </div>
        </div>
      ) : null}

      {activePage === 'fx' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">FX Send / Insert</div>
          <div className="workstation-rack-grid">
            <Knob label="Wet" min={0} max={1} step={0.01} value={firstEffect?.wet ?? 0} onChange={(value) => firstEffect && updateEffect(firstEffect.id, { wet: value })} displayValue={firstEffect ? percent(firstEffect.wet) : 'No FX'} tone="cyan" />
            <Knob label="Delay" min={0.002} max={1.2} step={0.001} value={effectParam(delayEffect, 'time', 0.28)} onChange={(value) => delayEffect && updateEffect(delayEffect.id, { params: { ...delayEffect.params, time: value } })} displayValue={delayEffect ? time(effectParam(delayEffect, 'time', 0.28)) : 'No Delay'} tone="violet" />
            <Knob label="Feed" min={0} max={0.86} step={0.01} value={effectParam(delayEffect, 'feedback', 0.32)} onChange={(value) => delayEffect && updateEffect(delayEffect.id, { params: { ...delayEffect.params, feedback: value } })} displayValue={delayEffect ? percent(effectParam(delayEffect, 'feedback', 0.32)) : 'No Delay'} tone="violet" />
            <Knob label="Reverb" min={0.2} max={5} step={0.01} value={effectParam(reverbEffect, 'decay', 1.7)} onChange={(value) => reverbEffect && updateEffect(reverbEffect.id, { params: { ...reverbEffect.params, decay: value } })} displayValue={reverbEffect ? time(effectParam(reverbEffect, 'decay', 1.7)) : 'No Rev'} tone="mint" />
          </div>
        </div>
      ) : null}

      {activePage === 'global' ? (
        <div className="workstation-rack-section">
          <div className="workstation-rack-section-title">Global</div>
          <div className="workstation-rack-grid">
            <Knob label="Master" min={0} max={1} step={0.01} value={masterVolume} onChange={setMasterVolume} displayValue={percent(masterVolume)} tone="mint" />
            <Knob label="BPM" min={40} max={240} step={1} value={bpm} onChange={setBpm} tone="cyan" />
          </div>
        </div>
      ) : null}
    </aside>
  );
}
