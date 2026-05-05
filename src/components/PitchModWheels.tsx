import { useRef } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, WheelEvent } from 'react';
import { useSynthStore } from '../store/synthStore';

type WheelKind = 'pitch' | 'mod';

interface WheelControlProps {
  kind: WheelKind;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatPitch(value: number): string {
  const semitones = value * 2;
  if (Math.abs(semitones) < 0.01) {
    return '0 st';
  }
  return `${semitones > 0 ? '+' : ''}${semitones.toFixed(2)} st`;
}

function formatMod(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function valueFromPointer(event: PointerEvent<HTMLDivElement>, kind: WheelKind): number {
  const rect = event.currentTarget.getBoundingClientRect();
  const normalizedY = clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
  return kind === 'pitch' ? clamp(1 - normalizedY * 2, -1, 1) : clamp(1 - normalizedY, 0, 1);
}

function WheelControl({ kind, label, value, onChange }: WheelControlProps) {
  const wheelResetTimer = useRef<number | null>(null);
  const isPitch = kind === 'pitch';
  const position = isPitch ? `${(1 - (value + 1) / 2) * 100}%` : `${(1 - value) * 100}%`;
  const displayValue = isPitch ? formatPitch(value) : formatMod(value);

  const clearWheelReset = () => {
    if (wheelResetTimer.current !== null) {
      window.clearTimeout(wheelResetTimer.current);
      wheelResetTimer.current = null;
    }
  };

  const resetPitchSoon = () => {
    if (!isPitch) {
      return;
    }
    clearWheelReset();
    wheelResetTimer.current = window.setTimeout(() => {
      onChange(0);
      wheelResetTimer.current = null;
    }, 650);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = -event.deltaY * (isPitch ? 0.002 : 0.0015);
    onChange(clamp(value + delta, isPitch ? -1 : 0, 1));
    resetPitchSoon();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.01 : 0.04;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault();
      onChange(clamp(value + step, isPitch ? -1 : 0, 1));
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      onChange(clamp(value - step, isPitch ? -1 : 0, 1));
    }
    if (event.key === 'Home' || event.key === '0') {
      event.preventDefault();
      onChange(0);
    }
    if (!isPitch && event.key === 'End') {
      event.preventDefault();
      onChange(1);
    }
  };

  return (
    <div className={`performance-wheel performance-wheel-${kind}`} style={{ '--wheel-position': position } as CSSProperties}>
      <div className="performance-wheel-label">
        <span>{label}</span>
        <strong>{displayValue}</strong>
      </div>
      <div
        className="performance-wheel-rail"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={isPitch ? -1 : 0}
        aria-valuemax={1}
        aria-valuenow={Number(value.toFixed(3))}
        aria-valuetext={displayValue}
        onPointerDown={(event) => {
          clearWheelReset();
          event.currentTarget.setPointerCapture(event.pointerId);
          onChange(valueFromPointer(event, kind));
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            onChange(valueFromPointer(event, kind));
          }
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          if (isPitch) {
            onChange(0);
          }
        }}
        onPointerCancel={() => {
          if (isPitch) {
            onChange(0);
          }
        }}
        onWheel={handleWheel}
        onDoubleClick={() => onChange(0)}
        onKeyDown={handleKeyDown}
      >
        <span className="performance-wheel-track" />
        <span className="performance-wheel-center" />
        <span className="performance-wheel-thumb" />
      </div>
      <div className="performance-wheel-help">{isPitch ? 'Drag / wheel / springs' : 'Drag / wheel / holds'}</div>
    </div>
  );
}

export function PitchModWheels() {
  const pitchBend = useSynthStore((state) => state.pitchBend);
  const modWheel = useSynthStore((state) => state.modWheel);
  const setPitchBend = useSynthStore((state) => state.setPitchBend);
  const setModWheel = useSynthStore((state) => state.setModWheel);

  return (
    <section className="pitch-mod-wheels" aria-label="Pitch and modulation wheels">
      <WheelControl kind="pitch" label="Pitch Bend" value={pitchBend} onChange={setPitchBend} />
      <WheelControl kind="mod" label="Modulation" value={modWheel} onChange={setModWheel} />
    </section>
  );
}
