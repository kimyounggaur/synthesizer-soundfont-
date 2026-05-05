import type { CSSProperties } from 'react';
import { useSynthStore } from '../../store/synthStore';
import type { PartMixerPartId, PartMixerPartState } from '../../types/synth';

interface SliderBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  detail?: string;
  onChange: (value: number) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sliderStyle(value: number, min: number, max: number): CSSProperties {
  const fill = ((clamp(value, min, max) - min) / Math.max(0.0001, max - min)) * 100;
  return { '--slider-fill': `${fill}%` } as CSSProperties;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatHz(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 1 : 2)}k` : `${Math.round(value)}Hz`;
}

function formatSeconds(value: number): string {
  return value < 1 ? `${Math.round(value * 1000)}ms` : `${value.toFixed(2)}s`;
}

function formatPan(value: number): string {
  if (Math.abs(value) < 0.01) {
    return 'C';
  }

  return value < 0 ? `L${Math.round(Math.abs(value) * 100)}` : `R${Math.round(value * 100)}`;
}

function SliderBar({ label, value, min, max, step, displayValue, detail, onChange }: SliderBarProps) {
  return (
    <label className="workstation-slider-row">
      <span className="workstation-slider-copy">
        <strong>{label}</strong>
        {detail ? <em>{detail}</em> : null}
      </span>
      <input
        className="workstation-slider-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={sliderStyle(value, min, max)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="workstation-slider-value">{displayValue}</span>
    </label>
  );
}

const mixerPartLabels: Record<PartMixerPartId, { label: string; detail: string }> = {
  synth: { label: 'Synth', detail: 'Synth bus' },
  sample: { label: 'Sample', detail: 'Sample bus' },
  drum: { label: 'Drum', detail: 'Drum bus' },
  fxReturn: { label: 'FX Ret', detail: 'FX output' },
};

function getMixerPart(parts: PartMixerPartState[], partId: PartMixerPartId): PartMixerPartState {
  return (
    parts.find((part) => part.id === partId) ?? {
      id: partId,
      name: mixerPartLabels[partId].label,
      enabled: true,
      level: 1,
      pan: 0,
    }
  );
}

export function WorkstationSliderRack() {
  const masterVolume = useSynthStore((state) => state.masterVolume);
  const sampleLayer = useSynthStore((state) => state.sampleLayer);
  const mixerParts = useSynthStore((state) => state.partMixer.parts);
  const filter = useSynthStore((state) => state.filter);
  const ampEnv = useSynthStore((state) => state.ampEnv);
  const lfo1 = useSynthStore((state) => state.lfo1);
  const vectorMixer = useSynthStore((state) => state.vectorMixer);
  const modWheel = useSynthStore((state) => state.modWheel);
  const effects = useSynthStore((state) => state.effects);
  const setMasterVolume = useSynthStore((state) => state.setMasterVolume);
  const updateNoise = useSynthStore((state) => state.updateNoise);
  const updatePartMixerPart = useSynthStore((state) => state.updatePartMixerPart);
  const updateSampleLayer = useSynthStore((state) => state.updateSampleLayer);
  const updateFilter = useSynthStore((state) => state.updateFilter);
  const updateEnvelope = useSynthStore((state) => state.updateEnvelope);
  const updateLFO = useSynthStore((state) => state.updateLFO);
  const updateVectorPosition = useSynthStore((state) => state.updateVectorPosition);
  const updateEffect = useSynthStore((state) => state.updateEffect);
  const setModWheel = useSynthStore((state) => state.setModWheel);

  const mixerPartIds: PartMixerPartId[] = ['synth', 'sample', 'drum', 'fxReturn'];
  const fxWet = effects.length > 0 ? effects.reduce((sum, effect) => sum + effect.wet, 0) / effects.length : 0;
  const brightness = clamp(filter.cutoff, 80, 16000);
  const motion = clamp(lfo1.depth, 0, 1);
  const space = clamp((ampEnv.release - 0.05) / 2.2, 0, 1);
  const dirt = clamp(filter.drive / 0.85, 0, 1);
  const morph = clamp(vectorMixer.x, 0, 1);

  const setBrightness = (value: number) => {
    const normalized = (value - 80) / (16000 - 80);
    updateFilter({ cutoff: value, resonance: 0.8 + normalized * 3.2 });
    updateSampleLayer({ filterEnabled: true, filterCutoff: value });
  };

  const setMotion = (value: number) => {
    updateLFO('lfo1', {
      depth: value,
      rate: 0.2 + value * 7.8,
      target: 'filterCutoff',
    });
    updateVectorPosition({ y: value });
  };

  const setSpace = (value: number) => {
    updateEnvelope('ampEnv', { release: 0.05 + value * 2.2 });
    updateEnvelope('filterEnv', { release: 0.04 + value * 1.4 });
    updateSampleLayer({ release: 0.08 + value * 2.8 });
  };

  const setDirt = (value: number) => {
    updateFilter({ drive: value * 0.85 });
    updateNoise({ enabled: value > 0.03, level: value * 0.16 });
  };

  const setMorph = (value: number) => {
    updateVectorPosition({ x: value, y: 1 - value });
  };

  const setFxWet = (value: number) => {
    effects.forEach((effect) => updateEffect(effect.id, { wet: value }));
  };

  const setPartLevel = (partId: PartMixerPartId, value: number) => {
    updatePartMixerPart(partId, {
      enabled: value > 0.001,
      level: value,
    });
  };

  const setPartPan = (partId: PartMixerPartId, value: number) => {
    updatePartMixerPart(partId, { pan: value });
  };

  return (
    <aside className="workstation-slider-rack nautilus-slider-rack" aria-label="Performance slider rack">
      <div className="nautilus-rack-header">
        <span>Slider Control</span>
        <strong>LIVE</strong>
      </div>

      <section className="workstation-slider-section">
        <h3>Mixer Sliders</h3>
        <SliderBar label="Master" value={masterVolume} min={0} max={1} step={0.01} displayValue={formatPercent(masterVolume)} detail="Main out" onChange={setMasterVolume} />
        {mixerPartIds.map((partId) => {
          const part = getMixerPart(mixerParts, partId);
          const label = mixerPartLabels[partId];
          const level = part.enabled ? part.level : 0;
          return <SliderBar key={`${partId}-level`} label={label.label} value={level} min={0} max={1.5} step={0.01} displayValue={formatPercent(level)} detail={label.detail} onChange={(value) => setPartLevel(partId, value)} />;
        })}
        {mixerPartIds.map((partId) => {
          const part = getMixerPart(mixerParts, partId);
          const label = mixerPartLabels[partId];
          return <SliderBar key={`${partId}-pan`} label={`${label.label} Pan`} value={part.pan} min={-1} max={1} step={0.01} displayValue={formatPan(part.pan)} detail="Stereo" onChange={(value) => setPartPan(partId, value)} />;
        })}
      </section>

      <section className="workstation-slider-section">
        <h3>Sample Sliders</h3>
        <SliderBar label="Level" value={sampleLayer.level} min={0} max={1.2} step={0.01} displayValue={formatPercent(sampleLayer.level)} detail="Layer gain" onChange={(value) => updateSampleLayer({ level: value })} />
        <SliderBar label="Attack" value={sampleLayer.attack} min={0.001} max={2} step={0.001} displayValue={formatSeconds(sampleLayer.attack)} detail="Sample EG" onChange={(value) => updateSampleLayer({ attack: value })} />
        <SliderBar label="Release" value={sampleLayer.release} min={0.01} max={4} step={0.01} displayValue={formatSeconds(sampleLayer.release)} detail="Sample EG" onChange={(value) => updateSampleLayer({ release: value })} />
        <SliderBar label="Cutoff" value={sampleLayer.filterCutoff} min={80} max={16000} step={1} displayValue={formatHz(sampleLayer.filterCutoff)} detail="Enables filter" onChange={(value) => updateSampleLayer({ filterEnabled: true, filterCutoff: value })} />
        <SliderBar label="Reso" value={sampleLayer.filterResonance} min={0.1} max={12} step={0.1} displayValue={sampleLayer.filterResonance.toFixed(1)} detail="Sample filter" onChange={(value) => updateSampleLayer({ filterEnabled: true, filterResonance: value })} />
      </section>

      <section className="workstation-slider-section">
        <h3>Macro Sliders</h3>
        <SliderBar label="Brightness" value={brightness} min={80} max={16000} step={1} displayValue={formatHz(brightness)} detail="Cutoff + sample" onChange={setBrightness} />
        <SliderBar label="Motion" value={motion} min={0} max={1} step={0.01} displayValue={formatPercent(motion)} detail="LFO + vector" onChange={setMotion} />
        <SliderBar label="Space" value={space} min={0} max={1} step={0.01} displayValue={formatPercent(space)} detail="Releases" onChange={setSpace} />
        <SliderBar label="Dirt" value={dirt} min={0} max={1} step={0.01} displayValue={formatPercent(dirt)} detail="Drive + noise" onChange={setDirt} />
        <SliderBar label="Morph" value={morph} min={0} max={1} step={0.01} displayValue={formatPercent(morph)} detail="Vector X/Y" onChange={setMorph} />
        {effects.length > 0 ? <SliderBar label="FX Mix" value={fxWet} min={0} max={1} step={0.01} displayValue={formatPercent(fxWet)} detail="All wet" onChange={setFxWet} /> : null}
      </section>

      <section className="workstation-slider-section workstation-ribbon-section">
        <h3>Ribbon Slider</h3>
        <SliderBar label="Ribbon" value={modWheel} min={0} max={1} step={0.01} displayValue={formatPercent(modWheel)} detail="Mod wheel" onChange={setModWheel} />
      </section>
    </aside>
  );
}
