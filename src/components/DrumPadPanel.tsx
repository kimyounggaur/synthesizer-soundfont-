import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSynthStore } from '../store/synthStore';

interface DrumPadPanelProps {
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}

type PadTone = 'orange' | 'blue' | 'green' | 'pink';

interface DrumPadDefinition {
  id: string;
  index: number;
  code: string;
  keyLabel: string;
  shift?: boolean;
  alternateCodes?: string[];
  note: number;
  name: string;
  shortName: string;
  velocity: number;
  tone: PadTone;
}

const drumBankId = 'gen-drums-fx';
const drumPresetId = 'generated-drum-map';

const drumPads: DrumPadDefinition[] = [
  { id: 'pad-1', index: 1, code: 'Digit1', alternateCodes: ['Numpad1'], keyLabel: '1', note: 36, name: 'Kick', shortName: 'KICK', velocity: 1, tone: 'orange' },
  { id: 'pad-2', index: 2, code: 'Digit2', alternateCodes: ['Numpad2'], keyLabel: '2', note: 38, name: 'Snare', shortName: 'SNARE', velocity: 0.96, tone: 'blue' },
  { id: 'pad-3', index: 3, code: 'Digit3', alternateCodes: ['Numpad3'], keyLabel: '3', note: 39, name: 'Clap', shortName: 'CLAP', velocity: 0.92, tone: 'blue' },
  { id: 'pad-4', index: 4, code: 'Digit4', alternateCodes: ['Numpad4'], keyLabel: '4', note: 42, name: 'Closed Hat', shortName: 'CHH', velocity: 0.82, tone: 'blue' },
  { id: 'pad-5', index: 5, code: 'Digit5', alternateCodes: ['Numpad5'], keyLabel: '5', note: 45, name: 'Low Tom', shortName: 'LO TOM', velocity: 0.95, tone: 'green' },
  { id: 'pad-6', index: 6, code: 'Digit6', alternateCodes: ['Numpad6'], keyLabel: '6', note: 47, name: 'Mid Tom', shortName: 'MID TOM', velocity: 0.92, tone: 'green' },
  { id: 'pad-7', index: 7, code: 'Digit7', alternateCodes: ['Numpad7'], keyLabel: '7', note: 46, name: 'Open Hat', shortName: 'OHH', velocity: 0.82, tone: 'pink' },
  { id: 'pad-8', index: 8, code: 'Digit8', alternateCodes: ['Numpad8'], keyLabel: '8', note: 49, name: 'Crash', shortName: 'CRASH', velocity: 0.88, tone: 'orange' },
  { id: 'pad-9', index: 9, code: 'Digit9', alternateCodes: ['Numpad9'], keyLabel: '9', note: 51, name: 'Ride', shortName: 'RIDE', velocity: 0.84, tone: 'blue' },
  { id: 'pad-10', index: 10, code: 'Digit0', alternateCodes: ['Numpad0'], keyLabel: '0', note: 37, name: 'Rim', shortName: 'RIM', velocity: 0.84, tone: 'blue' },
  { id: 'pad-11', index: 11, code: 'Digit1', keyLabel: 'S+1', shift: true, note: 56, name: 'Cowbell', shortName: 'COW', velocity: 0.82, tone: 'pink' },
  { id: 'pad-12', index: 12, code: 'Digit2', keyLabel: 'S+2', shift: true, note: 70, name: 'Shaker', shortName: 'SHAKE', velocity: 0.76, tone: 'orange' },
  { id: 'pad-13', index: 13, code: 'Digit3', keyLabel: 'S+3', shift: true, note: 54, name: 'Tambourine', shortName: 'TAMB', velocity: 0.8, tone: 'green' },
  { id: 'pad-14', index: 14, code: 'Digit4', keyLabel: 'S+4', shift: true, note: 64, name: 'Low Conga', shortName: 'LO CONG', velocity: 0.86, tone: 'orange' },
  { id: 'pad-15', index: 15, code: 'Digit5', keyLabel: 'S+5', shift: true, note: 63, name: 'High Conga', shortName: 'HI CONG', velocity: 0.84, tone: 'green' },
  { id: 'pad-16', index: 16, code: 'Digit6', keyLabel: 'S+6', shift: true, note: 55, name: 'Splash', shortName: 'SPLASH', velocity: 0.82, tone: 'blue' },
];

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function findPadForKey(event: KeyboardEvent): DrumPadDefinition | undefined {
  return drumPads.find((pad) => {
    const matchesCode = pad.code === event.code || pad.alternateCodes?.includes(event.code);
    if (!matchesCode) {
      return false;
    }

    return Boolean(pad.shift) === event.shiftKey;
  });
}

export function DrumPadPanel({ onNoteOn, onNoteOff }: DrumPadPanelProps) {
  const defaultVelocity = useSynthStore((state) => state.defaultVelocity);
  const sampleLayer = useSynthStore((state) => state.sampleLayer);
  const engineMode = useSynthStore((state) => state.engineMode);
  const [activePads, setActivePads] = useState<Set<string>>(() => new Set());
  const releaseTimers = useRef(new Map<string, number>());
  const armed = engineMode === 'sample' && sampleLayer.bankId === drumBankId && sampleLayer.presetId === drumPresetId && sampleLayer.enabled;
  const keyHelp = useMemo(() => drumPads.map((pad) => `${pad.index}:${pad.keyLabel}`).join('  '), []);

  const armDrumMap = useCallback(() => {
    const store = useSynthStore.getState();
    const alreadyArmed =
      store.engineMode === 'sample' &&
      store.sampleLayer.enabled &&
      store.sampleLayer.bankId === drumBankId &&
      store.sampleLayer.presetId === drumPresetId;

    if (!alreadyArmed) {
      store.selectSamplePreset(drumBankId, drumPresetId);
      store.setEngineMode('sample');
    }

    store.updateSampleLayer({
      enabled: true,
      oneShot: true,
      preload: true,
      attack: 0.001,
      decay: 0.08,
      sustain: 0.35,
      release: 0.18,
    });
  }, []);

  const triggerPad = useCallback(
    (pad: DrumPadDefinition) => {
      armDrumMap();

      const timer = releaseTimers.current.get(pad.id);
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }

      const velocity = Math.min(1, Math.max(0.08, defaultVelocity * pad.velocity));
      setActivePads((current) => new Set(current).add(pad.id));
      onNoteOn(pad.note, velocity);

      const nextTimer = window.setTimeout(() => {
        onNoteOff(pad.note);
        releaseTimers.current.delete(pad.id);
        setActivePads((current) => {
          const next = new Set(current);
          next.delete(pad.id);
          return next;
        });
      }, 520);

      releaseTimers.current.set(pad.id, nextTimer);
    },
    [armDrumMap, defaultVelocity, onNoteOff, onNoteOn],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || isEditableTarget(event.target)) {
        return;
      }

      const pad = findPadForKey(event);
      if (!pad) {
        return;
      }

      event.preventDefault();
      triggerPad(pad);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      releaseTimers.current.forEach((timer) => window.clearTimeout(timer));
      releaseTimers.current.clear();
    };
  }, [triggerPad]);

  return (
    <section className="drum-pad-panel" aria-label="Code-style drum pad panel">
      <div className="drum-pad-header">
        <div>
          <span>Drum Pad Bank</span>
          <strong>Generated Drum Map</strong>
        </div>
        <div className={armed ? 'drum-pad-status is-armed' : 'drum-pad-status'}>
          <span />
          {armed ? 'Armed' : 'Auto Arm'}
        </div>
      </div>

      <div className="drum-pad-body">
        <div className="drum-pad-grid">
          {drumPads.map((pad) => (
            <button
              key={pad.id}
              type="button"
              className={`drum-pad drum-pad-${pad.tone}${activePads.has(pad.id) ? ' is-active' : ''}`}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                triggerPad(pad);
              }}
              title={`${pad.name} / MIDI ${pad.note} / key ${pad.keyLabel}`}
            >
              <span className="drum-pad-corner" />
              <span className="drum-pad-number">{pad.keyLabel}</span>
              <strong>{pad.shortName}</strong>
              <em>{pad.note}</em>
            </button>
          ))}
        </div>

        <div className="drum-pad-map">
          <div className="drum-pad-map-title">Number Key Map</div>
          <div className="drum-pad-map-line">{keyHelp}</div>
          <div className="drum-pad-map-note">Pads 11-16 use Shift + number row.</div>
        </div>
      </div>
    </section>
  );
}
