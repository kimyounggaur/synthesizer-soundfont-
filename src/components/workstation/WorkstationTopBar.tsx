import { useMemo } from 'react';
import { factoryPresets } from '../../presets/factoryPresets';
import { sampleBankManager } from '../../samples/sampleBankLibrary';
import { usePresetStore } from '../../store/presetStore';
import { selectEngineState, useSynthStore } from '../../store/synthStore';
import type { EngineMode } from '../../types/soundfont';
import type { MeterSnapshot } from '../../types/synth';
import { OutputMeter } from '../OutputMeter';
import { Knob } from '../ui/Knob';
import { LedButton } from '../ui/LedButton';

interface WorkstationTopBarProps {
  meter: MeterSnapshot;
  onPanic: () => void;
  onTestTone: () => void;
}

function modeLabel(mode: EngineMode): string {
  return mode === 'synth' ? 'Synth' : mode === 'sample' ? 'Sample' : 'Hybrid';
}

function formatVoices(value: number): string {
  return String(value).padStart(2, '0');
}

export function WorkstationTopBar({ meter, onPanic, onTestTone }: WorkstationTopBarProps) {
  const masterVolume = useSynthStore((state) => state.masterVolume);
  const bpm = useSynthStore((state) => state.bpm);
  const polyphony = useSynthStore((state) => state.polyphony);
  const currentPreset = useSynthStore((state) => state.currentPreset);
  const engineState = useSynthStore((state) => selectEngineState(state));
  const userPresets = usePresetStore((state) => state.userPresets);
  const setMasterVolume = useSynthStore((state) => state.setMasterVolume);
  const setBpm = useSynthStore((state) => state.setBpm);
  const setPolyphony = useSynthStore((state) => state.setPolyphony);
  const setEngineMode = useSynthStore((state) => state.setEngineMode);
  const selectedPreset = useMemo(
    () => [...factoryPresets, ...userPresets].find((preset) => preset.id === currentPreset),
    [currentPreset, userPresets],
  );
  const selectedSamplePreset = useMemo(
    () => sampleBankManager.getPreset(engineState.sampleLayer.bankId, engineState.sampleLayer.presetId) ?? undefined,
    [engineState.sampleLayer.bankId, engineState.sampleLayer.presetId],
  );
  const selectedSampleBank = useMemo(
    () => sampleBankManager.getBank(engineState.sampleLayer.bankId) ?? undefined,
    [engineState.sampleLayer.bankId],
  );
  const programName = engineState.engineMode === 'sample' && selectedSamplePreset ? selectedSamplePreset.name : selectedPreset?.name ?? selectedSamplePreset?.name ?? 'Init Program';
  const category = engineState.engineMode === 'sample' && selectedSamplePreset ? selectedSamplePreset.category : selectedPreset?.category ?? selectedSamplePreset?.category ?? 'Manual';
  const bankName = selectedSampleBank?.name ?? (selectedPreset ? `${selectedPreset.author} Library` : 'User Edit Buffer');

  return (
    <header className="workstation-top-bar">
      <div className="workstation-brand-plate">
        <div className="workstation-brand-mark">WV</div>
        <div>
          <div className="workstation-brand-name">VECTOR SAMPLE WORKSTATION</div>
          <div className="workstation-brand-subtitle">Hybrid Synth / Sample / FX</div>
        </div>
      </div>

      <section className="workstation-program-lcd" aria-label="Program LCD">
        <div className="workstation-program-lcd-row">
          <div className="workstation-program-field workstation-program-field-wide">
            <span>Program</span>
            <strong>{programName}</strong>
          </div>
          <div className="workstation-program-field">
            <span>Mode</span>
            <strong>{engineState.engineMode.toUpperCase()}</strong>
          </div>
          <div className="workstation-program-field">
            <span>Cat</span>
            <strong>{category}</strong>
          </div>
        </div>
        <div className="workstation-program-lcd-row">
          <div className="workstation-program-field workstation-program-field-wide">
            <span>Bank</span>
            <strong>{bankName}</strong>
          </div>
          <div className="workstation-program-field">
            <span>BPM</span>
            <strong>{bpm}</strong>
          </div>
          <div className="workstation-program-field">
            <span>Voices</span>
            <strong>{formatVoices(polyphony)}</strong>
          </div>
        </div>
      </section>

      <div className="workstation-mode-panel" aria-label="Engine mode">
        {(['synth', 'sample', 'hybrid'] as EngineMode[]).map((mode) => (
          <button key={mode} type="button" className={engineState.engineMode === mode ? 'workstation-mode-button is-active' : 'workstation-mode-button'} onClick={() => setEngineMode(mode)}>
            {modeLabel(mode)}
          </button>
        ))}
      </div>

      <OutputMeter meter={meter} compact onTestTone={onTestTone} />

      <div className="workstation-top-controls">
        <label className="compact-control">
          <span className="control-label">BPM</span>
          <input className="mini-input panel-input" type="number" min={40} max={240} value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />
        </label>
        <label className="compact-control">
          <span className="control-label">Voices</span>
          <input className="mini-input panel-input" type="number" min={1} max={16} value={polyphony} onChange={(event) => setPolyphony(Number(event.target.value))} />
        </label>
        <Knob label="Master" min={0} max={1} step={0.01} value={masterVolume} onChange={setMasterVolume} displayValue={`${Math.round(masterVolume * 100)}%`} tone="mint" />
        <LedButton active={meter.clipping} danger onClick={onPanic}>
          Panic
        </LedButton>
      </div>
    </header>
  );
}
