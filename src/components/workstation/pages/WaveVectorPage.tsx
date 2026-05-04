import { useState } from 'react';
import type { PointerEvent } from 'react';
import { VectorMixer } from '../../../audio/VectorMixer';
import { useSynthStore } from '../../../store/synthStore';
import type { SynthWaveform } from '../../../types/synth';
import { Knob } from '../../ui/Knob';

const waveforms: SynthWaveform[] = ['sine', 'square', 'sawtooth', 'triangle', 'pulse', 'wavetable'];

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function WaveVectorPage() {
  const [selectedStep, setSelectedStep] = useState(0);
  const vectorMixer = useSynthStore((state) => state.vectorMixer);
  const waveSequencer = useSynthStore((state) => state.waveSequencer);
  const updateVectorPosition = useSynthStore((state) => state.updateVectorPosition);
  const updateWaveSequencer = useSynthStore((state) => state.updateWaveSequencer);
  const updateWaveStep = useSynthStore((state) => state.updateWaveStep);
  const weights = VectorMixer.calculateWeights(vectorMixer.x, vectorMixer.y);
  const step = waveSequencer.steps[selectedStep] ?? waveSequencer.steps[0];
  const activeSteps = waveSequencer.steps.filter((item) => !item.skip).length;

  if (!step) {
    return null;
  }

  const updateVectorFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width);
    const y = clamp(1 - (event.clientY - rect.top) / rect.height);
    updateVectorPosition({ x, y });
  };

  return (
    <div className="workstation-lcd-page workstation-wavevector-page">
      <div className="workstation-page-header">
        <div>
          <span>Wave / Vector</span>
          <strong>Vector XY Pad / Wave Sequence</strong>
        </div>
        <div className="workstation-page-header-metrics">
          <span>X {percent(vectorMixer.x)}</span>
          <span>Y {percent(vectorMixer.y)}</span>
          <span>{activeSteps} active steps</span>
        </div>
      </div>

      <div className="workstation-wavevector-layout">
        <section className="workstation-lcd-panel workstation-vector-section">
          <div className="workstation-sample-list-header">
            <span>Vector XY Pad</span>
            <strong>Four Source Mix</strong>
          </div>

          <div
            className="workstation-vector-pad-lg"
            role="slider"
            tabIndex={0}
            aria-label="Vector XY pad"
            aria-valuetext={`X ${percent(vectorMixer.x)}, Y ${percent(vectorMixer.y)}`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateVectorFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                updateVectorFromPointer(event);
              }
            }}
          >
            <span className="workstation-vector-axis is-x" />
            <span className="workstation-vector-axis is-y" />
            <span className="workstation-vector-corner is-a">OSC A</span>
            <span className="workstation-vector-corner is-b">OSC B</span>
            <span className="workstation-vector-corner is-c">SUB</span>
            <span className="workstation-vector-corner is-d">NOISE</span>
            <span className="workstation-vector-cursor" style={{ left: `${vectorMixer.x * 100}%`, top: `${(1 - vectorMixer.y) * 100}%` }} />
          </div>

          <div className="workstation-vector-weights">
            <span>A {percent(weights.a)}</span>
            <span>B {percent(weights.b)}</span>
            <span>SUB {percent(weights.c)}</span>
            <span>NOISE {percent(weights.d)}</span>
          </div>

          <div className="workstation-editor-knobs workstation-editor-knobs-two">
            <Knob label="Vector X" min={0} max={1} step={0.01} value={vectorMixer.x} onChange={(x) => updateVectorPosition({ x })} displayValue={percent(vectorMixer.x)} tone="cyan" />
            <Knob label="Vector Y" min={0} max={1} step={0.01} value={vectorMixer.y} onChange={(y) => updateVectorPosition({ y })} displayValue={percent(vectorMixer.y)} tone="mint" />
          </div>
        </section>

        <section className="workstation-lcd-panel workstation-wave-lane-panel">
          <div className="workstation-sample-list-header">
            <span>Wave Sequence</span>
            <strong>{waveSequencer.enabled ? 'Running' : 'Standby'}</strong>
          </div>

          <div className="workstation-wave-controls">
            <button
              type="button"
              className={waveSequencer.enabled ? 'workstation-action-button is-primary' : 'workstation-action-button'}
              onClick={() => updateWaveSequencer({ enabled: !waveSequencer.enabled })}
            >
              Run
            </button>
            <button
              type="button"
              className={waveSequencer.tempoSync ? 'workstation-action-button is-primary' : 'workstation-action-button'}
              onClick={() => updateWaveSequencer({ tempoSync: !waveSequencer.tempoSync })}
            >
              Sync
            </button>
          </div>

          <div className="workstation-wave-lane" aria-label="Wave sequence 16 step lane">
            {waveSequencer.steps.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`workstation-wave-step${selectedStep === index ? ' is-selected' : ''}${item.skip ? ' is-muted' : ''}`}
                onClick={() => setSelectedStep(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.waveform.slice(0, 3)}</strong>
                <em style={{ height: `${Math.max(10, item.level * 100)}%` }} />
              </button>
            ))}
          </div>
        </section>

        <section className="workstation-lcd-panel workstation-step-detail">
          <div className="workstation-sample-list-header">
            <span>Step Detail</span>
            <strong>Step {selectedStep + 1}</strong>
          </div>

          <label className="workstation-lcd-control">
            <span>Waveform</span>
            <select className="workstation-lcd-input" value={step.waveform} onChange={(event) => updateWaveStep(selectedStep, { waveform: event.target.value as SynthWaveform })}>
              {waveforms.map((waveform) => (
                <option key={waveform} value={waveform}>
                  {waveform}
                </option>
              ))}
            </select>
          </label>

          <div className="workstation-step-toggles">
            <button type="button" className={step.skip ? 'workstation-action-button is-primary' : 'workstation-action-button'} onClick={() => updateWaveStep(selectedStep, { skip: !step.skip })}>
              Skip
            </button>
            <button type="button" className={step.reverse ? 'workstation-action-button is-primary' : 'workstation-action-button'} onClick={() => updateWaveStep(selectedStep, { reverse: !step.reverse })}>
              Reverse
            </button>
            <button type="button" className={step.repeat ? 'workstation-action-button is-primary' : 'workstation-action-button'} onClick={() => updateWaveStep(selectedStep, { repeat: !step.repeat })}>
              Repeat
            </button>
          </div>

          <div className="workstation-editor-knobs workstation-step-knobs">
            <Knob label="Pitch" min={-24} max={24} step={1} value={step.pitchOffset} onChange={(value) => updateWaveStep(selectedStep, { pitchOffset: value })} tone="violet" />
            <Knob label="Level" min={0} max={1} step={0.01} value={step.level} onChange={(value) => updateWaveStep(selectedStep, { level: value })} displayValue={percent(step.level)} tone="cyan" />
            <Knob label="Pan" min={-1} max={1} step={0.01} value={step.pan} onChange={(value) => updateWaveStep(selectedStep, { pan: value })} displayValue={percent(step.pan)} tone="mint" />
            <Knob label="Time" min={40} max={1200} step={10} value={step.duration} onChange={(value) => updateWaveStep(selectedStep, { duration: value })} displayValue={`${Math.round(step.duration)}ms`} tone="amber" />
            <Knob label="Xfade" min={0} max={400} step={5} value={step.crossfade} onChange={(value) => updateWaveStep(selectedStep, { crossfade: value })} displayValue={`${Math.round(step.crossfade)}ms`} tone="amber" />
          </div>
        </section>
      </div>
    </div>
  );
}
