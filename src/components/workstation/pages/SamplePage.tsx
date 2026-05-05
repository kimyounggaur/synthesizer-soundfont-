import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { getCachedSampleBank, getCachedSamplePreset, loadPublicSampleBanks } from '../../../samples/sampleBankLibrary';
import { useSynthStore } from '../../../store/synthStore';
import { useUiStore } from '../../../store/uiStore';
import type { EngineMode, SampleBankManifest, SampleCategory, SamplePresetDefinition } from '../../../types/soundfont';
import { mergeSampleZoneOverride } from '../../../utils/sampleZoneUtils';
import { Knob } from '../../ui/Knob';
import { LedButton } from '../../ui/LedButton';
import { MiniDisplay } from '../../ui/MiniDisplay';
import { WorkstationBreadcrumb, WorkstationPageTabs, WorkstationSoftKeys, WorkstationStatusBar, type WorkstationStatus } from '../WorkstationLCDChrome';

type SampleFilter = SampleCategory | 'All';

interface BrowserSamplePreset {
  bankId: string;
  bankName: string;
  bankLicense: string;
  preset: SamplePresetDefinition;
}

interface SamplePageProps {
  onAuditionNote?: (note: number, velocity: number, durationMs?: number) => void;
}

const engineModes: EngineMode[] = ['synth', 'sample', 'hybrid'];
const sampleCategoryOrder: SampleCategory[] = [
  'Piano',
  'E-Piano',
  'Organ',
  'Strings',
  'Choir',
  'Brass',
  'Woodwind',
  'Guitar',
  'Bass',
  'Bell',
  'Mallet',
  'Drum',
  'FX',
  'Experimental',
];

function modeLabel(mode: EngineMode): string {
  return mode === 'synth' ? 'Synth' : mode === 'sample' ? 'Sample' : 'Hybrid';
}

function formatTime(value: number): string {
  return value >= 1 ? `${value.toFixed(2)}s` : `${Math.round(value * 1000)}ms`;
}

function formatCutoff(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${Math.round(value)} Hz`;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatNote(note: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return `${noteNames[note % 12]}${Math.floor(note / 12) - 1}`;
}

function formatPan(value: number): string {
  if (Math.abs(value) < 0.01) {
    return 'C';
  }

  return value < 0 ? `L${Math.round(Math.abs(value) * 100)}` : `R${Math.round(value * 100)}`;
}

function formatVelocity(value: number): string {
  return `${Math.round(value * 127)}`;
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function ratioFromPointer(track: HTMLElement, clientX: number): number {
  const rect = track.getBoundingClientRect();
  if (rect.width <= 0) {
    return 0;
  }

  return clampNumber((clientX - rect.left) / rect.width, 0, 1);
}

function isGeneratedSampleUrl(url: string): boolean {
  return url.startsWith('generated://') || url.startsWith('data:');
}

function sampleZoneUrlForUi(bankId: string, zoneUrl: string): string {
  if (isGeneratedSampleUrl(zoneUrl) || /^https?:\/\//i.test(zoneUrl)) {
    return zoneUrl;
  }

  return `${import.meta.env.BASE_URL}soundfonts/${bankId}/${zoneUrl}`;
}

async function presetWillUseFallbackForUi(bankId: string, preset: SamplePresetDefinition): Promise<boolean> {
  const probeZone = preset.zones.find((zone) => !isGeneratedSampleUrl(zone.url));
  if (!probeZone) {
    return false;
  }

  try {
    const response = await fetch(sampleZoneUrlForUi(bankId, probeZone.url), { method: 'HEAD' });
    return !response.ok;
  } catch {
    return true;
  }
}

export function SamplePage({ onAuditionNote }: SamplePageProps) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<SampleFilter>('All');
  const [selectedBankId, setSelectedBankId] = useState<string>('All');
  const [banks, setBanks] = useState<SampleBankManifest[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [sampleStatus, setSampleStatus] = useState<WorkstationStatus>('LOADING SAMPLE');
  const sampleSelectionRequestId = useRef(0);
  const selectedZoneId = useUiStore((state) => state.selectedSampleZoneId);
  const setSelectedSampleZoneId = useUiStore((state) => state.setSelectedSampleZoneId);
  const currentPresetId = useSynthStore((state) => state.currentPreset);
  const engineMode = useSynthStore((state) => state.engineMode);
  const defaultVelocity = useSynthStore((state) => state.defaultVelocity);
  const sampleLayer = useSynthStore((state) => state.sampleLayer);
  const setEngineMode = useSynthStore((state) => state.setEngineMode);
  const updateSampleLayer = useSynthStore((state) => state.updateSampleLayer);
  const updateSampleZoneOverride = useSynthStore((state) => state.updateSampleZoneOverride);
  const clearSampleZoneOverride = useSynthStore((state) => state.clearSampleZoneOverride);
  const clearAllSampleZoneOverrides = useSynthStore((state) => state.clearAllSampleZoneOverrides);
  const selectSamplePreset = useSynthStore((state) => state.selectSamplePreset);

  useEffect(() => {
    let mounted = true;
    setSampleStatus('LOADING SAMPLE');
    setMessage('Loading bank...');
    loadPublicSampleBanks()
      .then((manifests) => {
        if (mounted) {
          setBanks(manifests);
          setSampleStatus('READY');
          setMessage(null);
        }
      })
      .catch((error) => {
        if (mounted) {
          setSampleStatus('READY');
          setMessage(error instanceof Error ? error.message : 'Sample bank manifest failed to load.');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const presets = useMemo<BrowserSamplePreset[]>(
    () =>
      banks.flatMap((bank) =>
        bank.presets.map((preset) => ({
          bankId: bank.id,
          bankName: bank.name,
          bankLicense: bank.license,
          preset,
        })),
      ),
    [banks],
  );

  const categoryCounts = useMemo(
    () =>
      sampleCategoryOrder
        .map((category) => ({
          category,
          count: presets.filter((item) => item.preset.category === category).length,
        }))
        .filter(({ count }) => count > 0),
    [presets],
  );

  const visiblePresets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return presets.filter((item) => {
      const matchesBank = selectedBankId === 'All' || item.bankId === selectedBankId;
      const matchesCategory = selectedFilter === 'All' || item.preset.category === selectedFilter;
      const searchable = `${item.preset.name} ${item.preset.category} ${item.preset.author} ${item.bankName}`.toLowerCase();
      return matchesBank && matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [presets, query, selectedBankId, selectedFilter]);

  const activePreset = getCachedSamplePreset(sampleLayer.bankId, sampleLayer.presetId);
  const activeBank = getCachedSampleBank(sampleLayer.bankId);
  const selectedZone = activePreset?.zones.find((zone) => zone.id === selectedZoneId) ?? activePreset?.zones[0] ?? null;
  const selectedZoneOverride = selectedZone ? sampleLayer.zoneOverrides?.[selectedZone.id] : undefined;
  const currentZone = selectedZone ? mergeSampleZoneOverride(selectedZone, sampleLayer) : null;
  const editedZoneCount = activePreset?.zones.filter((zone) => Boolean(sampleLayer.zoneOverrides?.[zone.id])).length ?? 0;
  const totalZoneOverrideCount = Object.keys(sampleLayer.zoneOverrides).length;
  const zoneRoundtripLabel =
    !sampleLayer.bankId || !sampleLayer.presetId
      ? 'NO SAMPLE PRESET'
      : totalZoneOverrideCount === 0
        ? 'NO ZONE EDITS'
        : currentPresetId?.startsWith('user-preset')
          ? `${totalZoneOverrideCount} EDITS RESTORED`
          : 'READY TO SAVE';
  const zoneRoundtripDetail =
    totalZoneOverrideCount > 0
      ? `${sampleLayer.bankId ?? 'no-bank'} / ${sampleLayer.presetId ?? 'no-preset'}`
      : 'Zone edits save with user presets';
  const currentZoneLowVelocity = currentZone?.lowVelocity ?? 0;
  const currentZoneHighVelocity = currentZone?.highVelocity ?? 1;
  const defaultVelocityInZone = Boolean(currentZone && defaultVelocity >= currentZoneLowVelocity && defaultVelocity <= currentZoneHighVelocity);
  const auditionVelocity = currentZone ? clampNumber(defaultVelocity, currentZoneLowVelocity, currentZoneHighVelocity) : defaultVelocity;

  useEffect(() => {
    if (!activePreset) {
      setSelectedSampleZoneId(null);
      return;
    }

    if (activePreset.zones.some((zone) => zone.id === selectedZoneId)) {
      return;
    }

    setSelectedSampleZoneId(activePreset.zones[0]?.id ?? null);
  }, [activePreset, selectedZoneId, setSelectedSampleZoneId]);

  const handlePreload = () => {
    if (!sampleLayer.bankId || !sampleLayer.presetId || !activePreset) {
      setMessage('Select a sample preset before preloading.');
      return;
    }

    const requestId = sampleSelectionRequestId.current + 1;
    sampleSelectionRequestId.current = requestId;
    setSampleStatus('LOADING SAMPLE');
    setMessage('Loading bank...');
    updateSampleLayer({ preload: true });
    void presetWillUseFallbackForUi(sampleLayer.bankId, activePreset).then((usesFallback) => {
      if (sampleSelectionRequestId.current !== requestId) {
        return;
      }
      setSampleStatus(usesFallback ? 'FALLBACK SAMPLE' : 'READY');
      setMessage(usesFallback ? 'Using fallback buffer' : 'Preset ready');
    });
  };

  const handleSelectSamplePreset = async (item: BrowserSamplePreset) => {
    const requestId = sampleSelectionRequestId.current + 1;
    sampleSelectionRequestId.current = requestId;
    setSampleStatus('LOADING SAMPLE');
    setMessage('Loading bank...');
    selectSamplePreset(item.bankId, item.preset.id);

    const usesFallback = await presetWillUseFallbackForUi(item.bankId, item.preset);
    if (sampleSelectionRequestId.current !== requestId) {
      return;
    }

    setSampleStatus(usesFallback ? 'FALLBACK SAMPLE' : 'READY');
    setMessage(usesFallback ? 'Using fallback buffer' : 'Preset ready');
  };

  const handleUpdateZone = (partial: Parameters<typeof updateSampleZoneOverride>[1]) => {
    if (!selectedZone) {
      return;
    }

    updateSampleZoneOverride(selectedZone.id, partial);
  };

  const handleUpdateRootNote = (value: number) => {
    if (!currentZone) {
      return;
    }

    handleUpdateZone({ rootNote: Math.round(clampNumber(value, currentZone.lowNote, currentZone.highNote)) });
  };

  const handleUpdateLowNote = (value: number) => {
    if (!currentZone) {
      return;
    }

    const lowNote = Math.round(clampNumber(value, 0, currentZone.highNote));
    handleUpdateZone({
      lowNote,
      rootNote: Math.round(clampNumber(currentZone.rootNote, lowNote, currentZone.highNote)),
    });
  };

  const handleUpdateHighNote = (value: number) => {
    if (!currentZone) {
      return;
    }

    const highNote = Math.round(clampNumber(value, currentZone.lowNote, 127));
    handleUpdateZone({
      highNote,
      rootNote: Math.round(clampNumber(currentZone.rootNote, currentZone.lowNote, highNote)),
    });
  };

  const handleUpdateLowVelocity = (value: number) => {
    if (!currentZone) {
      return;
    }

    handleUpdateZone({ lowVelocity: clampNumber(value, 0, currentZone.highVelocity ?? 1) });
  };

  const handleUpdateHighVelocity = (value: number) => {
    if (!currentZone) {
      return;
    }

    handleUpdateZone({ highVelocity: clampNumber(value, currentZone.lowVelocity ?? 0, 1) });
  };

  const handleUpdateLoopStart = (value: number) => {
    if (!currentZone) {
      return;
    }

    handleUpdateZone({ loop: true, loopStart: clampNumber(value, 0, currentZone.loopEnd ?? 4) });
  };

  const handleUpdateLoopEnd = (value: number) => {
    if (!currentZone) {
      return;
    }

    handleUpdateZone({ loop: true, loopEnd: clampNumber(value, currentZone.loopStart ?? 0, 4) });
  };

  const handleZoneRangePointerDown = (range: 'key' | 'velocity', event: ReactPointerEvent<HTMLDivElement>) => {
    if (!currentZone) {
      return;
    }

    event.preventDefault();
    const track = event.currentTarget;
    const pointerId = event.pointerId;
    track.setPointerCapture(pointerId);

    if (range === 'key') {
      let lowNote = currentZone.lowNote;
      let highNote = currentZone.highNote;
      let rootNote = currentZone.rootNote;
      const firstNote = Math.round(ratioFromPointer(track, event.clientX) * 127);
      const handle = Math.abs(firstNote - lowNote) <= Math.abs(firstNote - highNote) ? 'low' : 'high';

      const applyKeyDrag = (clientX: number) => {
        const note = Math.round(ratioFromPointer(track, clientX) * 127);
        if (handle === 'low') {
          lowNote = Math.min(note, highNote);
        } else {
          highNote = Math.max(note, lowNote);
        }
        rootNote = Math.round(clampNumber(rootNote, lowNote, highNote));
        handleUpdateZone({ lowNote, highNote, rootNote });
      };

      const handleMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId === pointerId) {
          applyKeyDrag(moveEvent.clientX);
        }
      };

      const handleEnd = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleEnd);
        window.removeEventListener('pointercancel', handleEnd);
        if (track.hasPointerCapture(pointerId)) {
          track.releasePointerCapture(pointerId);
        }
      };

      applyKeyDrag(event.clientX);
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleEnd);
      window.addEventListener('pointercancel', handleEnd);
      return;
    }

    let lowVelocity = currentZone.lowVelocity ?? 0;
    let highVelocity = currentZone.highVelocity ?? 1;
    const firstVelocity = ratioFromPointer(track, event.clientX);
    const handle = Math.abs(firstVelocity - lowVelocity) <= Math.abs(firstVelocity - highVelocity) ? 'low' : 'high';

    const applyVelocityDrag = (clientX: number) => {
      const velocity = ratioFromPointer(track, clientX);
      if (handle === 'low') {
        lowVelocity = Math.min(velocity, highVelocity);
      } else {
        highVelocity = Math.max(velocity, lowVelocity);
      }
      handleUpdateZone({ lowVelocity, highVelocity });
    };

    const handleMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId === pointerId) {
        applyVelocityDrag(moveEvent.clientX);
      }
    };

    const handleEnd = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('pointercancel', handleEnd);
      if (track.hasPointerCapture(pointerId)) {
        track.releasePointerCapture(pointerId);
      }
    };

    applyVelocityDrag(event.clientX);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('pointercancel', handleEnd);
  };

  const handleResetZone = () => {
    if (!selectedZone) {
      return;
    }

    clearSampleZoneOverride(selectedZone.id);
    setSampleStatus('READY');
    setMessage('Zone reset.');
  };

  const handleResetAllZones = () => {
    clearAllSampleZoneOverrides();
    setSampleStatus('READY');
    setMessage('All zone edits reset.');
  };

  const handleAuditionZone = () => {
    if (!currentZone || !activePreset) {
      setMessage('Select a sample zone before auditioning.');
      return;
    }

    setEngineMode('sample');
    updateSampleLayer({ enabled: true });
    onAuditionNote?.(currentZone.rootNote, auditionVelocity, 720);
    setSampleStatus('READY');
    setMessage(`Auditioning ${currentZone.id} at ${formatNote(currentZone.rootNote)} / velocity ${formatVelocity(auditionVelocity)}${defaultVelocityInZone ? '' : ' (adjusted into zone range)'}`);
  };

  return (
    <div className="workstation-page workstation-lcd-page sample-page">
      <header className="workstation-page-header">
        <MiniDisplay eyebrow="SAMPLE" value={activePreset?.name.toUpperCase() ?? 'NO SAMPLE'} detail={activeBank?.name ?? `${visiblePresets.length} presets`} tone="mint" />
        <WorkstationPageTabs labels={['BROWSER', 'LAYER', 'FILTER']} ariaLabel="Sample sections" variant="tabs" />
      </header>

      <WorkstationBreadcrumb items={['SAMPLE', activeBank?.name ?? (selectedBankId === 'All' ? 'ALL BANKS' : selectedBankId), selectedFilter === 'All' ? 'All' : selectedFilter, activePreset?.name ?? 'No Sample']} />

      <div className="sample-page-layout">
        <aside className="workstation-side-buttons sample-page-sidebar" aria-label="Sample bank and category filters">
          <label className="compact-control workstation-select-control">
            <span className="control-label">Bank</span>
            <select className="mini-select panel-select" value={selectedBankId} onChange={(event) => setSelectedBankId(event.target.value)}>
              <option value="All">All banks</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className={selectedFilter === 'All' ? 'workstation-side-button is-active' : 'workstation-side-button'} onClick={() => setSelectedFilter('All')}>
            <span>All Samples</span>
            <strong>{presets.length}</strong>
          </button>
          {categoryCounts.map(({ category, count }) => (
            <button key={category} type="button" className={selectedFilter === category ? 'workstation-side-button is-active' : 'workstation-side-button'} onClick={() => setSelectedFilter(category)}>
              <span>{category}</span>
              <strong>{count}</strong>
            </button>
          ))}
        </aside>

        <section className="workstation-lcd-frame sample-page-browser">
          <div className="workstation-lcd-bezel">
            <div className="workstation-lcd-screen">
              <div className="sample-page-search">
                <MiniDisplay eyebrow="Sample Browser" value={`${visiblePresets.length} SOUNDS`} detail={selectedFilter === 'All' ? 'All categories' : selectedFilter} tone="cyan" />
                <input className="mini-input panel-input" value={query} placeholder="Search sample presets" onChange={(event) => setQuery(event.target.value)} />
              </div>

              <div className="sample-page-list" aria-label="Sample presets">
                {visiblePresets.map((item) => {
                  const active = item.bankId === sampleLayer.bankId && item.preset.id === sampleLayer.presetId;
                  return (
                    <button key={`${item.bankId}:${item.preset.id}`} type="button" className={active ? 'sample-page-row is-active' : 'sample-page-row'} onClick={() => void handleSelectSamplePreset(item)}>
                      <span className="workstation-led-dot is-small" />
                      <span>
                        <strong>{item.preset.name}</strong>
                        <em>
                          {item.preset.category} / {item.bankName}
                        </em>
                      </span>
                      <small>{item.preset.zones.length} zones</small>
                    </button>
                  );
                })}
                {visiblePresets.length === 0 ? <div className="effects-empty workstation-effects-empty">No sample presets found.</div> : null}
              </div>
            </div>
          </div>
        </section>

        <aside className="workstation-parameter-rack sample-page-rack">
          <section className="module-block module-block-mint workstation-card">
            <MiniDisplay eyebrow="Layer" value={sampleLayer.enabled ? 'ON' : 'OFF'} detail={activePreset?.license ?? activeBank?.license ?? 'Select preset'} tone="mint" />
            <div className="sample-page-toggle-grid">
              <LedButton active={sampleLayer.enabled} onClick={() => updateSampleLayer({ enabled: !sampleLayer.enabled })}>
                Layer
              </LedButton>
              <LedButton active={sampleLayer.preload} onClick={handlePreload}>
                Preload
              </LedButton>
              <LedButton active={sampleLayer.oneShot} onClick={() => updateSampleLayer({ oneShot: !sampleLayer.oneShot })}>
                One Shot
              </LedButton>
            </div>
            <div className="workstation-knob-grid sample-page-knobs">
              <Knob label="Level" min={0} max={1.5} step={0.01} value={sampleLayer.level} onChange={(value) => updateSampleLayer({ level: value })} displayValue={formatPercent(sampleLayer.level)} tone="mint" />
              <Knob label="Attack" min={0.001} max={4} step={0.001} value={sampleLayer.attack} onChange={(value) => updateSampleLayer({ attack: value })} displayValue={formatTime(sampleLayer.attack)} tone="violet" />
              <Knob label="Decay" min={0.001} max={4} step={0.001} value={sampleLayer.decay} onChange={(value) => updateSampleLayer({ decay: value })} displayValue={formatTime(sampleLayer.decay)} tone="violet" />
              <Knob label="Sustain" min={0} max={1} step={0.01} value={sampleLayer.sustain} onChange={(value) => updateSampleLayer({ sustain: value })} displayValue={formatPercent(sampleLayer.sustain)} tone="amber" />
              <Knob label="Release" min={0.001} max={6} step={0.001} value={sampleLayer.release} onChange={(value) => updateSampleLayer({ release: value })} displayValue={formatTime(sampleLayer.release)} tone="violet" />
            </div>
          </section>

          <section className="module-block module-block-amber workstation-card">
            <MiniDisplay eyebrow="Sample Filter" value={sampleLayer.filterEnabled ? 'ON' : 'OFF'} detail={formatCutoff(sampleLayer.filterCutoff)} tone="amber" />
            <LedButton active={sampleLayer.filterEnabled} onClick={() => updateSampleLayer({ filterEnabled: !sampleLayer.filterEnabled })}>
              Filter
            </LedButton>
            <div className="workstation-knob-grid sample-page-knobs">
              <Knob label="Cutoff" min={24} max={20000} step={1} value={sampleLayer.filterCutoff} onChange={(value) => updateSampleLayer({ filterCutoff: value })} displayValue={formatCutoff(sampleLayer.filterCutoff)} tone="amber" />
              <Knob label="Res" min={0.1} max={24} step={0.1} value={sampleLayer.filterResonance} onChange={(value) => updateSampleLayer({ filterResonance: value })} tone="amber" />
            </div>
          </section>

          <section className="module-block module-block-cyan workstation-card">
            <MiniDisplay eyebrow="Engine" value={modeLabel(engineMode).toUpperCase()} detail="Sample playback mode" tone="cyan" />
            <div className="sample-page-engine-grid">
              {engineModes.map((mode) => (
                <button key={mode} type="button" className={engineMode === mode ? 'performance-button is-active' : 'performance-button'} onClick={() => setEngineMode(mode)}>
                  <span className="workstation-led-dot is-small" />
                  {modeLabel(mode)}
                </button>
              ))}
            </div>
          </section>

          <section className="module-block module-block-violet workstation-card sample-zone-editor">
            <MiniDisplay eyebrow="Zone Editor" value={currentZone?.id.toUpperCase() ?? 'NO ZONE'} detail={currentZone ? `${formatNote(currentZone.lowNote)}-${formatNote(currentZone.highNote)} / ${editedZoneCount} edited` : 'Select sample preset'} tone="cyan" />
            {activePreset ? (
              <>
                <div className="sample-zone-save-status" aria-label="Sample zone save status">
                  <strong>{zoneRoundtripLabel}</strong>
                  <span>{zoneRoundtripDetail}</span>
                </div>
                <div className="sample-zone-list" aria-label="Sample zones">
                  {activePreset.zones.map((zone) => {
                    const zoneOverride = sampleLayer.zoneOverrides?.[zone.id];
                    const zoneValue = mergeSampleZoneOverride(zone, sampleLayer);
                    const active = zone.id === currentZone?.id;
                    return (
                      <button key={zone.id} type="button" className={active ? 'sample-zone-button is-active' : 'sample-zone-button'} aria-pressed={active} onClick={() => setSelectedSampleZoneId(zone.id)}>
                        <span>{zone.id}</span>
                        <small>
                          {formatNote(zoneValue.lowNote)}-{formatNote(zoneValue.highNote)}
                          {' / '}
                          V{formatVelocity(zoneValue.lowVelocity ?? 0)}-{formatVelocity(zoneValue.highVelocity ?? 1)}
                          {zoneOverride ? ' / edited' : ''}
                        </small>
                      </button>
                    );
                  })}
                </div>

                {currentZone ? (
                  <>
                    <div className="sample-zone-readout">
                      <span>KEY {formatNote(currentZone.lowNote)}-{formatNote(currentZone.highNote)}</span>
                      <span>VEL {formatVelocity(currentZoneLowVelocity)}-{formatVelocity(currentZoneHighVelocity)}</span>
                      <span className={defaultVelocityInZone ? 'is-ready' : 'is-warning'}>{defaultVelocityInZone ? 'VEL READY' : 'VEL OUT'}</span>
                      <span>{selectedZoneOverride ? 'EDITED' : 'ORIGINAL'}</span>
                    </div>

                    <div className="sample-zone-map is-draggable" aria-label="Selected sample zone range. Drag near the left or right edge to edit the key range." onPointerDown={(event) => handleZoneRangePointerDown('key', event)}>
                      <span
                        className="sample-zone-map-range"
                        style={{
                          left: `${(currentZone.lowNote / 127) * 100}%`,
                          width: `${Math.max(4, ((currentZone.highNote - currentZone.lowNote + 1) / 128) * 100)}%`,
                        }}
                      />
                      <span className="sample-zone-map-handle is-low" style={{ left: `${(currentZone.lowNote / 127) * 100}%` }} />
                      <span className="sample-zone-map-handle is-high" style={{ left: `${(currentZone.highNote / 127) * 100}%` }} />
                    </div>
                    <div className="sample-zone-map sample-zone-velocity-map is-draggable" aria-label="Selected sample velocity range. Drag near the left or right edge to edit the velocity range." onPointerDown={(event) => handleZoneRangePointerDown('velocity', event)}>
                      <span
                        className="sample-zone-map-range sample-zone-velocity-range"
                        style={{
                          left: `${((currentZone.lowVelocity ?? 0) * 100)}%`,
                          width: `${Math.max(4, (((currentZone.highVelocity ?? 1) - (currentZone.lowVelocity ?? 0)) * 100))}%`,
                        }}
                      />
                      <span className="sample-zone-map-handle is-low" style={{ left: `${(currentZone.lowVelocity ?? 0) * 100}%` }} />
                      <span className="sample-zone-map-handle is-high" style={{ left: `${(currentZone.highVelocity ?? 1) * 100}%` }} />
                    </div>

                    <div className="workstation-knob-grid sample-page-knobs sample-zone-knobs">
                      <Knob label="Root" min={0} max={127} step={1} value={currentZone.rootNote} onChange={handleUpdateRootNote} displayValue={formatNote(currentZone.rootNote)} tone="cyan" />
                      <Knob label="Low" min={0} max={127} step={1} value={currentZone.lowNote} onChange={handleUpdateLowNote} displayValue={formatNote(currentZone.lowNote)} tone="mint" />
                      <Knob label="High" min={0} max={127} step={1} value={currentZone.highNote} onChange={handleUpdateHighNote} displayValue={formatNote(currentZone.highNote)} tone="mint" />
                      <Knob label="V Low" min={0} max={1} step={0.01} value={currentZone.lowVelocity ?? 0} onChange={handleUpdateLowVelocity} displayValue={formatVelocity(currentZone.lowVelocity ?? 0)} tone="amber" />
                      <Knob label="V High" min={0} max={1} step={0.01} value={currentZone.highVelocity ?? 1} onChange={handleUpdateHighVelocity} displayValue={formatVelocity(currentZone.highVelocity ?? 1)} tone="amber" />
                      <Knob label="Gain" min={0} max={1.5} step={0.01} value={currentZone.gain ?? 1} onChange={(value) => handleUpdateZone({ gain: value })} displayValue={formatPercent(currentZone.gain ?? 1)} tone="mint" />
                      <Knob label="Pan" min={-1} max={1} step={0.01} value={currentZone.pan ?? 0} onChange={(value) => handleUpdateZone({ pan: value })} displayValue={formatPan(currentZone.pan ?? 0)} tone="violet" />
                      <Knob label="Loop S" min={0} max={4} step={0.01} value={currentZone.loopStart ?? 0} onChange={handleUpdateLoopStart} displayValue={formatTime(currentZone.loopStart ?? 0)} tone="cyan" />
                      <Knob label="Loop E" min={0} max={4} step={0.01} value={currentZone.loopEnd ?? 1} onChange={handleUpdateLoopEnd} displayValue={formatTime(currentZone.loopEnd ?? 1)} tone="cyan" />
                    </div>

                    <div className="sample-page-toggle-grid">
                      <button type="button" className="performance-button is-accent" onClick={handleAuditionZone} disabled={!onAuditionNote}>
                        Audition Zone
                      </button>
                      <LedButton active={Boolean(currentZone.loop)} onClick={() => handleUpdateZone({ loop: !currentZone.loop })}>
                        Loop
                      </LedButton>
                      <button type="button" className="performance-button" onClick={handleResetZone} disabled={!selectedZoneOverride}>
                        Reset Zone
                      </button>
                      <button type="button" className="performance-button" onClick={handleResetAllZones} disabled={editedZoneCount === 0}>
                        Reset All
                      </button>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="effects-empty workstation-effects-empty">Select a sample preset to edit zones.</div>
            )}
          </section>

          {message ? <div className={sampleStatus === 'FALLBACK SAMPLE' ? 'sample-bank-message is-warning' : 'sample-bank-message'}>{message}</div> : null}
        </aside>
      </div>

      <WorkstationSoftKeys />
      <WorkstationStatusBar message={message ?? (activePreset ? `${activePreset.name} ready / ${zoneRoundtripLabel}` : 'No sample loaded')} status={sampleStatus} />
    </div>
  );
}
