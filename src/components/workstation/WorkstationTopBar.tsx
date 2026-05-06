import { useMemo } from 'react';
import type { MeterSnapshot } from '../../types/synth';
import { factoryPresets } from '../../presets/factoryPresets';
import { sampleFactoryPresets } from '../../presets/sampleFactoryPresets';
import { getCachedSamplePreset } from '../../samples/sampleBankLibrary';
import { usePresetStore } from '../../store/presetStore';
import { selectEngineState, useSynthStore } from '../../store/synthStore';
import { useUiStore } from '../../store/uiStore';
import type { EngineMode } from '../../types/soundfont';
import type { SynthPreset } from '../../types/synth';
import { DrumPadPanel } from '../DrumPadPanel';
import { OutputMeter } from '../OutputMeter';

const engineModes: EngineMode[] = ['synth', 'sample', 'hybrid'];

interface WorkstationTopBarProps {
  onPanic: () => void;
  onTestTone: () => void;
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
  meter: MeterSnapshot;
}

interface TopBarProgramBank {
  id: 'A' | 'B' | 'C';
  name: string;
  presets: SynthPreset[];
}

export function WorkstationTopBar({ onPanic, onTestTone, onNoteOn, onNoteOff, meter }: WorkstationTopBarProps) {
  const masterVolume = useSynthStore((state) => state.masterVolume);
  const bpm = useSynthStore((state) => state.bpm);
  const polyphony = useSynthStore((state) => state.polyphony);
  const currentPreset = useSynthStore((state) => state.currentPreset);
  const engineState = useSynthStore((state) => selectEngineState(state));
  const userPresets = usePresetStore((state) => state.userPresets);
  const programBankId = useUiStore((state) => state.programBankId);
  const programCategory = useUiStore((state) => state.programCategory);
  const setMasterVolume = useSynthStore((state) => state.setMasterVolume);
  const setBpm = useSynthStore((state) => state.setBpm);
  const setPolyphony = useSynthStore((state) => state.setPolyphony);
  const setEngineMode = useSynthStore((state) => state.setEngineMode);
  const loadPreset = useSynthStore((state) => state.loadPreset);
  const selectedPreset = useMemo(
    () => [...factoryPresets, ...sampleFactoryPresets, ...userPresets].find((preset) => preset.id === currentPreset),
    [currentPreset, userPresets],
  );
  const selectedSamplePreset = useMemo(
    () => getCachedSamplePreset(engineState.sampleLayer.bankId, engineState.sampleLayer.presetId) ?? undefined,
    [engineState.sampleLayer.bankId, engineState.sampleLayer.presetId],
  );
  const status = meter.audioState === 'suspended' ? 'Audio suspended' : meter.clipping ? 'Output clipping' : 'Ready';
  const programBanks = useMemo<TopBarProgramBank[]>(
    () => [
      { id: 'A', name: 'SYNTH', presets: factoryPresets },
      { id: 'B', name: 'SAMPLE', presets: sampleFactoryPresets },
      { id: 'C', name: 'USER', presets: userPresets },
    ],
    [userPresets],
  );
  const selectedProgramBank = programBanks.find((bank) => bank.id === programBankId) ?? programBanks[0];
  const setListPrograms = useMemo(
    () => selectedProgramBank.presets.filter((preset) => programCategory === 'All' || preset.category === programCategory),
    [programCategory, selectedProgramBank.presets],
  );
  const filteredCurrentPreset = setListPrograms.find((preset) => preset.id === currentPreset) ?? setListPrograms[0] ?? null;
  const currentProgramName = filteredCurrentPreset?.name ?? selectedPreset?.name ?? selectedSamplePreset?.name ?? 'Init Program';
  const currentProgramMeta = filteredCurrentPreset
    ? `${filteredCurrentPreset.category} / ${filteredCurrentPreset.author}`
    : selectedPreset
      ? `${selectedPreset.category} / ${selectedPreset.author}`
      : selectedSamplePreset
        ? `${selectedSamplePreset.category} sample / ${selectedSamplePreset.author}`
        : `${selectedProgramBank.name} / ${programCategory}`;
  const currentProgramNumber = filteredCurrentPreset ? String(Math.max(0, setListPrograms.findIndex((preset) => preset.id === filteredCurrentPreset.id))).padStart(2, '0') : '000';

  return (
    <header className="command-panel workstation-topbar nautilus-inspired-top">
      <section className="nautilus-right-controls" aria-label="System controls">
        <div className="nautilus-brand-readout">
          <div className="brand-mark" aria-hidden="true">
            VV
          </div>
          <div>
            <div className="brand-name">VECTOR SAMPLE</div>
            <div className="brand-subtitle">WORKSTATION</div>
            <small>Hybrid Synth / Sample / FX</small>
          </div>
        </div>

        <div className="nautilus-system-strip">
          <label>
            <span>BPM</span>
            <input className="mini-input panel-input" type="number" min={40} max={240} value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />
          </label>
          <label>
            <span>Voices</span>
            <input className="mini-input panel-input" type="number" min={1} max={16} value={polyphony} onChange={(event) => setPolyphony(Number(event.target.value))} />
          </label>
          <button type="button" className="nautilus-panic-button" aria-label="Panic: stop all notes and clear active voices" onClick={onPanic}>
            Panic
          </button>
        </div>

        <nav className="workstation-engine-mode-strip" aria-label="Engine mode">
          {engineModes.map((mode) => {
            const active = engineState.engineMode === mode;
            return (
              <button key={mode} type="button" className={active ? 'engine-mode-button is-active' : 'engine-mode-button'} aria-pressed={active} onClick={() => setEngineMode(mode)}>
                {mode.toUpperCase()}
              </button>
            );
          })}
        </nav>

        <div className="nautilus-meter-wrap">
          <OutputMeter meter={meter} compact onTestTone={onTestTone} />
        </div>
      </section>

      <section className="nautilus-touchview" aria-label="Set list touch screen">
        <div className="nautilus-touchview-top">
          <span>SET LIST</span>
          <strong>{engineState.engineMode.toUpperCase()}</strong>
          <em>{status}</em>
        </div>
        <div className="nautilus-current-program">
          <span>{currentProgramNumber}</span>
          <div>
            <h2>{currentProgramName}</h2>
            <p>{programBankId}: {selectedProgramBank.name} / {programCategory} / {currentProgramMeta}</p>
          </div>
        </div>
        <div className="nautilus-setlist-grid" aria-label="Set list slots">
          {setListPrograms.map((preset, index) => (
            <button key={preset.id} type="button" className={preset.id === currentPreset ? 'nautilus-setlist-slot is-active' : 'nautilus-setlist-slot'} onClick={() => loadPreset(preset)}>
              <span>{String(index).padStart(2, '0')}</span>
              <strong>{preset.name}</strong>
              <em>{preset.category}</em>
            </button>
          ))}
          {setListPrograms.length === 0 ? <div className="nautilus-setlist-empty">No programs in this bank/category.</div> : null}
        </div>
      </section>

      <section className="nautilus-left-controls" aria-label="Performance controls">
        <label className="nautilus-master-fader">
          <span>Master Volume</span>
          <input type="range" min={0} max={1} step={0.01} value={masterVolume} onChange={(event) => setMasterVolume(Number(event.target.value))} aria-label="Master volume" />
          <strong>{Math.round(masterVolume * 100)}%</strong>
        </label>

        <DrumPadPanel onNoteOn={onNoteOn} onNoteOff={onNoteOff} />
      </section>
    </header>
  );
}
