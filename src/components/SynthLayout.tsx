import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioEngine } from '../audio/AudioEngine';
import type { MeterSnapshot } from '../types/synth';
import { selectEngineState, useSynthStore } from '../store/synthStore';
import { useUiStore } from '../store/uiStore';
import { Keyboard } from './Keyboard';
import { MidiPanel } from './MidiPanel';
import { WorkstationLcd } from './workstation/WorkstationLcd';
import { WorkstationParameterRack } from './workstation/WorkstationParameterRack';
import { WorkstationPerformanceStrip } from './workstation/WorkstationPerformanceStrip';
import { WorkstationShell } from './workstation/WorkstationShell';
import { WorkstationSliderRack } from './workstation/WorkstationSliderRack';
import { WorkstationTabs } from './workstation/WorkstationTabs';
import { WorkstationTopBar } from './workstation/WorkstationTopBar';
import { EffectsPage } from './workstation/pages/EffectsPage';
import { FilterAmpPage } from './workstation/pages/FilterAmpPage';
import { GlobalPage } from './workstation/pages/GlobalPage';
import { ModulationPage } from './workstation/pages/ModulationPage';
import { ProgramPage } from './workstation/pages/ProgramPage';
import { SamplePage } from './workstation/pages/SamplePage';
import { SynthPage } from './workstation/pages/SynthPage';
import { WaveVectorPage } from './workstation/pages/WaveVectorPage';

const silentMeter: MeterSnapshot = { peak: 0, rms: 0, clipping: false, audioState: 'unavailable', activeVoices: 0 };

export function SynthLayout() {
  const engineRef = useRef<AudioEngine | null>(null);
  const testToneTimerRef = useRef<number | null>(null);
  const auditionTimerRef = useRef<number | null>(null);
  const auditionNoteRef = useRef<number | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [meter, setMeter] = useState<MeterSnapshot>(silentMeter);
  const activeWorkstationPage = useUiStore((state) => state.activeWorkstationPage);
  const setActiveNote = useSynthStore((state) => state.setActiveNote);
  const clearActiveNote = useSynthStore((state) => state.clearActiveNote);
  const clearActiveNotes = useSynthStore((state) => state.clearActiveNotes);

  useEffect(() => {
    try {
      const engine = new AudioEngine(selectEngineState(useSynthStore.getState()));
      engineRef.current = engine;
      const unsubscribe = useSynthStore.subscribe((state) => {
        engine.setState(selectEngineState(state));
      });

      return () => {
        unsubscribe();
        if (testToneTimerRef.current !== null) {
          window.clearTimeout(testToneTimerRef.current);
          testToneTimerRef.current = null;
        }
        if (auditionTimerRef.current !== null) {
          window.clearTimeout(auditionTimerRef.current);
          auditionTimerRef.current = null;
        }
        if (auditionNoteRef.current !== null) {
          engine.noteOff(auditionNoteRef.current);
          auditionNoteRef.current = null;
        }
        engine.close();
        engineRef.current = null;
      };
    } catch (error) {
      setEngineError(error instanceof Error ? error.message : 'Audio engine failed to start.');
      return undefined;
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMeter(engineRef.current?.getAnalyserData() ?? silentMeter);
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  const handleNoteOn = useCallback(
    (note: number, velocity: number) => {
      setActiveNote(note, velocity);
      void engineRef.current?.noteOn(note, velocity);
    },
    [setActiveNote],
  );

  const handleNoteOff = useCallback(
    (note: number) => {
      clearActiveNote(note);
      engineRef.current?.noteOff(note);
    },
    [clearActiveNote],
  );

  const handlePanic = useCallback(() => {
    if (testToneTimerRef.current !== null) {
      window.clearTimeout(testToneTimerRef.current);
      testToneTimerRef.current = null;
    }
    engineRef.current?.panic();
    clearActiveNotes();
    auditionNoteRef.current = null;
  }, [clearActiveNotes]);

  const handleTestTone = useCallback(() => {
    const note = 72;
    const velocity = 0.82;

    if (testToneTimerRef.current !== null) {
      window.clearTimeout(testToneTimerRef.current);
      clearActiveNote(note);
    }

    setActiveNote(note, velocity);
    void engineRef.current?.noteOn(note, velocity);

    testToneTimerRef.current = window.setTimeout(() => {
      engineRef.current?.noteOff(note);
      clearActiveNote(note);
      testToneTimerRef.current = null;
    }, 650);
  }, [clearActiveNote, setActiveNote]);

  const handleAuditionNote = useCallback(
    (note: number, velocity: number, durationMs = 720) => {
      if (auditionTimerRef.current !== null) {
        window.clearTimeout(auditionTimerRef.current);
        auditionTimerRef.current = null;
      }

      if (auditionNoteRef.current !== null) {
        engineRef.current?.noteOff(auditionNoteRef.current);
        clearActiveNote(auditionNoteRef.current);
      }

      auditionNoteRef.current = note;
      setActiveNote(note, velocity);
      void engineRef.current?.noteOn(note, velocity);

      auditionTimerRef.current = window.setTimeout(() => {
        engineRef.current?.noteOff(note);
        clearActiveNote(note);
        auditionTimerRef.current = null;
        auditionNoteRef.current = null;
      }, durationMs);
    },
    [clearActiveNote, setActiveNote],
  );

  const renderPage = () => {
    if (activeWorkstationPage === 'program') {
      return <ProgramPage />;
    }
    if (activeWorkstationPage === 'sample') {
      return <SamplePage onAuditionNote={handleAuditionNote} />;
    }
    if (activeWorkstationPage === 'synth') {
      return <SynthPage />;
    }
    if (activeWorkstationPage === 'filterAmp') {
      return <FilterAmpPage />;
    }
    if (activeWorkstationPage === 'modulation') {
      return <ModulationPage />;
    }
    if (activeWorkstationPage === 'waveVector') {
      return <WaveVectorPage />;
    }
    if (activeWorkstationPage === 'effects') {
      return <EffectsPage />;
    }
    return <GlobalPage onPanic={handlePanic} />;
  };

  return (
    <WorkstationShell
      topBar={<WorkstationTopBar onPanic={handlePanic} onTestTone={handleTestTone} onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} meter={meter} />}
      tabs={<WorkstationTabs />}
      lcd={<WorkstationLcd activePageId={activeWorkstationPage}>{renderPage()}</WorkstationLcd>}
      parameterRack={<WorkstationParameterRack meter={meter} onPanic={handlePanic} onTestTone={handleTestTone} />}
      sliderRack={<WorkstationSliderRack />}
      performanceStrip={<WorkstationPerformanceStrip onPanic={handlePanic} onTestTone={handleTestTone} />}
      keybed={
        <>
          <MidiPanel onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} onPanic={handlePanic} />
          <Keyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
        </>
      }
      engineError={engineError}
    />
  );
}
