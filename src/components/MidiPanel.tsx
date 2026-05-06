import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MidiManager, type MidiCallbacks, type MidiDeviceInfo } from '../audio/MidiManager';
import { useSynthStore } from '../store/synthStore';

interface MidiPanelProps {
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
  onPanic?: () => void;
}

type MidiConnectionStatus = 'idle' | 'requesting' | 'connected' | 'unsupported' | 'error';

function hasMidiSupport(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.requestMIDIAccess === 'function';
}

function isMidiSecureContext(): boolean {
  return typeof window === 'undefined' || window.isSecureContext;
}

function noteName(note: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return `${names[note % 12]}${Math.floor(note / 12) - 1}`;
}

function deviceLabel(device: MidiDeviceInfo): string {
  const maker = device.manufacturer && device.manufacturer !== 'Unknown' ? `${device.manufacturer} ` : '';
  return `${maker}${device.name}`;
}

export function MidiPanel({ onNoteOn, onNoteOff, onPanic }: MidiPanelProps) {
  const managerRef = useRef<MidiManager | null>(null);
  const heldNotesRef = useRef(new Set<number>());
  const sustainedNotesRef = useRef(new Set<number>());
  const sustainRef = useRef(false);
  const setPitchBend = useSynthStore((state) => state.setPitchBend);
  const setModWheel = useSynthStore((state) => state.setModWheel);
  const [devices, setDevices] = useState<MidiDeviceInfo[]>([]);
  const [status, setStatus] = useState<MidiConnectionStatus>(() => {
    if (!hasMidiSupport() || !isMidiSecureContext()) {
      return 'unsupported';
    }
    return 'idle';
  });
  const [message, setMessage] = useState(() => {
    if (!isMidiSecureContext()) {
      return 'HTTPS REQUIRED';
    }
    if (!hasMidiSupport()) {
      return 'WEB MIDI UNAVAILABLE';
    }
    return 'USB MIDI READY';
  });
  const [lastEvent, setLastEvent] = useState('NO INPUT');

  const manager = useMemo(() => {
    const instance = new MidiManager();
    managerRef.current = instance;
    return instance;
  }, []);

  const releaseAllMidiNotes = useCallback(() => {
    const notes = new Set([...heldNotesRef.current, ...sustainedNotesRef.current]);
    notes.forEach((note) => onNoteOff(note));
    heldNotesRef.current.clear();
    sustainedNotesRef.current.clear();
    sustainRef.current = false;
    setPitchBend(0);
    setModWheel(0);
  }, [onNoteOff, setModWheel, setPitchBend]);

  const callbacks = useMemo<MidiCallbacks>(
    () => ({
      noteOn: (note, velocity) => {
        heldNotesRef.current.add(note);
        sustainedNotesRef.current.delete(note);
        setLastEvent(`NOTE ${noteName(note)}  VEL ${Math.round(velocity * 127)}`);
        onNoteOn(note, velocity);
      },
      noteOff: (note) => {
        heldNotesRef.current.delete(note);
        setLastEvent(`OFF ${noteName(note)}`);
        if (sustainRef.current) {
          sustainedNotesRef.current.add(note);
          return;
        }
        onNoteOff(note);
      },
      pitchBend: (value) => {
        setPitchBend(value);
        setLastEvent(`BEND ${Math.round(value * 100)}%`);
      },
      modWheel: (value) => {
        setModWheel(value);
        setLastEvent(`MOD ${Math.round(value * 100)}%`);
      },
      sustain: (enabled) => {
        sustainRef.current = enabled;
        setLastEvent(enabled ? 'SUSTAIN ON' : 'SUSTAIN OFF');
        if (enabled) {
          return;
        }

        sustainedNotesRef.current.forEach((note) => {
          if (!heldNotesRef.current.has(note)) {
            onNoteOff(note);
          }
        });
        sustainedNotesRef.current.clear();
      },
    }),
    [onNoteOff, onNoteOn, setModWheel, setPitchBend],
  );

  const connectMidi = useCallback(async () => {
    if (!isMidiSecureContext()) {
      setStatus('unsupported');
      setMessage('HTTPS REQUIRED');
      return;
    }

    if (!manager.supported) {
      setStatus('unsupported');
      setMessage('WEB MIDI UNAVAILABLE');
      return;
    }

    try {
      setStatus('requesting');
      setMessage('PERMISSION REQUEST');
      manager.setDeviceChangeHandler((nextDevices) => {
        setDevices(nextDevices);
        setMessage(nextDevices.length > 0 ? 'DEVICE CHANGE' : 'NO MIDI INPUT');
      });
      const nextDevices = await manager.requestAccess(callbacks);
      setDevices(nextDevices);
      setStatus('connected');
      setMessage(nextDevices.length > 0 ? 'CONNECTED' : 'NO MIDI INPUT');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message.toUpperCase() : 'MIDI CONNECT FAILED');
    }
  }, [callbacks, manager]);

  const disconnectMidi = useCallback(() => {
    manager.disconnect();
    releaseAllMidiNotes();
    setDevices([]);
    setStatus(hasMidiSupport() && isMidiSecureContext() ? 'idle' : 'unsupported');
    setMessage(hasMidiSupport() && isMidiSecureContext() ? 'DISCONNECTED' : 'WEB MIDI UNAVAILABLE');
    setLastEvent('NO INPUT');
  }, [manager, releaseAllMidiNotes]);

  useEffect(() => {
    return () => {
      managerRef.current?.disconnect();
      releaseAllMidiNotes();
    };
  }, [releaseAllMidiNotes]);

  const connected = status === 'connected';
  const deviceCountLabel = devices.length === 1 ? '1 INPUT' : `${devices.length} INPUTS`;

  return (
    <section className="midi-panel" aria-label="USB MIDI keyboard connection">
      <div className="midi-panel-header">
        <div>
          <span>USB MIDI</span>
          <strong>Master Keyboard</strong>
        </div>
        <div className={`midi-status-pill midi-status-${status}`}>
          <span />
          {status === 'requesting' ? 'Waiting' : connected ? 'Online' : status === 'idle' ? 'Standby' : 'Offline'}
        </div>
      </div>

      <div className="midi-panel-readout">
        <div>
          <span>Status</span>
          <strong>{message}</strong>
        </div>
        <div>
          <span>Last MIDI</span>
          <strong>{lastEvent}</strong>
        </div>
        <div>
          <span>Detected</span>
          <strong>{deviceCountLabel}</strong>
        </div>
      </div>

      <div className="midi-device-list" aria-label="Detected MIDI input devices">
        {devices.length > 0 ? (
          devices.map((device) => (
            <div key={device.id} className={device.state === 'connected' ? 'midi-device is-connected' : 'midi-device'}>
              <span className="workstation-led-dot is-small" />
              <span>{deviceLabel(device)}</span>
              <em>{device.state}</em>
            </div>
          ))
        ) : (
          <div className="midi-device">
            <span className="workstation-led-dot is-small" />
            <span>No MIDI input</span>
            <em>{status}</em>
          </div>
        )}
      </div>

      <div className="midi-panel-actions">
        <button type="button" className="performance-button" onClick={connectMidi} disabled={status === 'requesting' || status === 'unsupported'}>
          CONNECT
        </button>
        <button type="button" className="performance-button" onClick={disconnectMidi} disabled={!connected && devices.length === 0}>
          DISCONNECT
        </button>
        <button
          type="button"
          className="performance-button is-danger"
          onClick={() => {
            releaseAllMidiNotes();
            onPanic?.();
          }}
        >
          MIDI PANIC
        </button>
      </div>
    </section>
  );
}
