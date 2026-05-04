import { useEffect, useMemo, useState } from 'react';
import { loadPublicSampleBanks, sampleBankManager } from '../../../samples/sampleBankLibrary';
import { useSynthStore } from '../../../store/synthStore';
import type { SampleBankManifest, SampleCategory, SamplePresetDefinition, SampleZone } from '../../../types/soundfont';
import { Knob } from '../../ui/Knob';

type SampleFilter = SampleCategory | 'All';
type BankFilter = string | 'All';

interface BrowserSamplePreset {
  bankId: string;
  bankName: string;
  bankLicense: string;
  preset: SamplePresetDefinition;
}

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

const lowKey = 21;
const highKey = 108;

function formatTime(value: number): string {
  return value >= 1 ? `${value.toFixed(2)}s` : `${Math.round(value * 1000)}ms`;
}

function formatCutoff(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${Math.round(value)} Hz`;
}

function noteName(note: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(note / 12) - 1;
  return `${names[note % 12]}${octave}`;
}

function zoneStyle(zone: SampleZone): { left: string; width: string } {
  const span = highKey - lowKey;
  const low = Math.max(lowKey, zone.lowNote);
  const high = Math.min(highKey, zone.highNote);
  const left = ((low - lowKey) / span) * 100;
  const width = Math.max(2, ((high - low + 1) / span) * 100);
  return {
    left: `${left}%`,
    width: `${Math.min(width, 100 - left)}%`,
  };
}

function SampleInfoField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="workstation-info-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function SamplePage() {
  const engineMode = useSynthStore((state) => state.engineMode);
  const sampleLayer = useSynthStore((state) => state.sampleLayer);
  const setEngineMode = useSynthStore((state) => state.setEngineMode);
  const updateSampleLayer = useSynthStore((state) => state.updateSampleLayer);
  const loadSamplePreset = useSynthStore((state) => state.loadSamplePreset);
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<SampleFilter>('All');
  const [selectedBankId, setSelectedBankId] = useState<BankFilter>(sampleLayer.bankId ?? 'All');
  const [banks, setBanks] = useState<SampleBankManifest[]>(() => sampleBankManager.getBankManifests());
  const [sampleBankLoadError, setSampleBankLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadPublicSampleBanks()
      .then(() => {
        if (mounted) {
          setBanks(sampleBankManager.getBankManifests());
          setSampleBankLoadError(null);
        }
      })
      .catch((error) => {
        if (mounted) {
          setSampleBankLoadError(error instanceof Error ? error.message : 'Sample bank manifest failed to load.');
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
      sampleCategoryOrder.map((category) => ({
        category,
        count: presets.filter((item) => item.preset.category === category).length,
      })),
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

  const activePreset = sampleBankManager.getPreset(sampleLayer.bankId, sampleLayer.presetId);
  const activeBank = sampleBankManager.getBank(sampleLayer.bankId);
  const activeBrowserPreset =
    presets.find((item) => item.bankId === sampleLayer.bankId && item.preset.id === sampleLayer.presetId) ?? visiblePresets[0] ?? presets[0];
  const displayPreset = activePreset ?? activeBrowserPreset?.preset ?? null;
  const displayBank = activeBank ?? banks.find((bank) => bank.id === activeBrowserPreset?.bankId) ?? null;
  const bankOptions = banks.map((bank) => ({ id: bank.id, name: bank.name }));

  const handleLoadSamplePreset = (item: BrowserSamplePreset) => {
    loadSamplePreset(item.bankId, item.preset.id);
    setEngineMode('sample');
    setSelectedBankId(item.bankId);
  };

  return (
    <div className="workstation-lcd-page workstation-sample-page">
      <div className="workstation-page-header">
        <div>
          <span>Sample Bank / Multisample</span>
          <strong>{displayPreset?.name ?? 'No Sample Loaded'}</strong>
        </div>
        <div className="workstation-page-header-metrics">
          <span>Mode {engineMode.toUpperCase()}</span>
          <span>{sampleLayer.enabled ? 'Layer On' : 'Layer Off'}</span>
          <span>{visiblePresets.length} presets</span>
        </div>
      </div>

      <div className="workstation-sample-toolbar">
        <label className="workstation-lcd-control">
          <span>Bank</span>
          <select className="workstation-lcd-input" value={selectedBankId} onChange={(event) => setSelectedBankId(event.target.value)}>
            <option value="All">All banks</option>
            {bankOptions.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
        </label>

        <label className="workstation-lcd-control">
          <span>Category</span>
          <select className="workstation-lcd-input" value={selectedFilter} onChange={(event) => setSelectedFilter(event.target.value as SampleFilter)}>
            <option value="All">All samples</option>
            {categoryCounts.map(({ category, count }) => (
              <option key={category} value={category}>
                {category} ({count})
              </option>
            ))}
          </select>
        </label>

        <label className="workstation-lcd-control workstation-lcd-control-wide">
          <span>Search</span>
          <input className="workstation-lcd-input" value={query} placeholder="Search sample presets" onChange={(event) => setQuery(event.target.value)} />
        </label>

        <label className="workstation-sample-switch">
          <input type="checkbox" checked={sampleLayer.enabled} onChange={(event) => updateSampleLayer({ enabled: event.target.checked })} />
          <span>Layer</span>
        </label>
      </div>

      <div className="workstation-sample-layout">
        <section className="workstation-lcd-panel workstation-sample-list" aria-label="Sample preset list">
          <div className="workstation-sample-list-header">
            <span>Preset List</span>
            <strong>{visiblePresets.length}</strong>
          </div>
          <div className="workstation-sample-rows">
            {visiblePresets.map((item) => {
              const active = item.bankId === sampleLayer.bankId && item.preset.id === sampleLayer.presetId;
              return (
                <button
                  key={`${item.bankId}:${item.preset.id}`}
                  type="button"
                  className={active ? 'workstation-sample-row is-active' : 'workstation-sample-row'}
                  onClick={() => handleLoadSamplePreset(item)}
                >
                  <span>
                    <strong>{item.preset.name}</strong>
                    <small>
                      {item.preset.category} / {item.bankName}
                    </small>
                  </span>
                  <em>{item.preset.zones.length} zones</em>
                </button>
              );
            })}
            {visiblePresets.length === 0 ? <div className="workstation-empty-state">No sample presets found.</div> : null}
          </div>
        </section>

        <section className="workstation-lcd-panel workstation-zone-panel" aria-label="Zone map">
          <div className="workstation-zone-header">
            <div>
              <span>Zone Map</span>
              <strong>{displayPreset ? `${displayPreset.zones.length} zones` : 'No zones'}</strong>
            </div>
            <div>
              <span>Bank</span>
              <strong>{displayBank?.name ?? 'Select bank'}</strong>
            </div>
          </div>

          <div className="workstation-zone-map">
            <div className="workstation-zone-key-labels">
              {['A0', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="workstation-zone-track">
              {displayPreset?.zones.map((zone) => (
                <div key={zone.id} className={zone.loop ? 'workstation-zone-segment is-looped' : 'workstation-zone-segment'} style={zoneStyle(zone)}>
                  <strong>{zone.id}</strong>
                  <span>
                    {noteName(zone.lowNote)}-{noteName(zone.highNote)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="workstation-zone-detail">
            <SampleInfoField label="Preset" value={displayPreset?.name ?? 'None'} />
            <SampleInfoField label="Category" value={displayPreset?.category ?? 'All'} />
            <SampleInfoField label="Author" value={displayPreset?.author ?? 'Project'} />
            <SampleInfoField label="License" value={displayPreset?.license ?? displayBank?.license ?? 'Generated demo'} />
          </div>

          <div className="workstation-sample-toggles">
            <label>
              <input type="checkbox" checked={sampleLayer.oneShot} onChange={(event) => updateSampleLayer({ oneShot: event.target.checked })} />
              <span>One Shot</span>
            </label>
            <label>
              <input type="checkbox" checked={sampleLayer.preload} onChange={(event) => updateSampleLayer({ preload: event.target.checked })} />
              <span>Preload</span>
            </label>
            <label>
              <input type="checkbox" checked={sampleLayer.filterEnabled} onChange={(event) => updateSampleLayer({ filterEnabled: event.target.checked })} />
              <span>Filter</span>
            </label>
          </div>

          {sampleBankLoadError ? <div className="workstation-lcd-alert">{sampleBankLoadError}</div> : null}
        </section>

        <section className="workstation-lcd-panel workstation-sample-controls" aria-label="Sample layer controls">
          <div className="workstation-sample-list-header">
            <span>Sample Layer</span>
            <strong>{sampleLayer.enabled ? 'Enabled' : 'Muted'}</strong>
          </div>
          <div className="workstation-sample-knobs">
            <Knob label="Level" min={0} max={1.5} step={0.01} value={sampleLayer.level} onChange={(value) => updateSampleLayer({ level: value })} displayValue={`${Math.round(sampleLayer.level * 100)}%`} tone="mint" />
            <Knob label="Attack" min={0.001} max={4} step={0.001} value={sampleLayer.attack} onChange={(value) => updateSampleLayer({ attack: value })} displayValue={formatTime(sampleLayer.attack)} tone="cyan" />
            <Knob label="Decay" min={0.001} max={4} step={0.001} value={sampleLayer.decay} onChange={(value) => updateSampleLayer({ decay: value })} displayValue={formatTime(sampleLayer.decay)} tone="cyan" />
            <Knob label="Sustain" min={0} max={1} step={0.01} value={sampleLayer.sustain} onChange={(value) => updateSampleLayer({ sustain: value })} displayValue={`${Math.round(sampleLayer.sustain * 100)}%`} tone="amber" />
            <Knob label="Release" min={0.001} max={6} step={0.001} value={sampleLayer.release} onChange={(value) => updateSampleLayer({ release: value })} displayValue={formatTime(sampleLayer.release)} tone="cyan" />
            <Knob label="Cutoff" min={24} max={20000} step={1} value={sampleLayer.filterCutoff} onChange={(value) => updateSampleLayer({ filterCutoff: value, filterEnabled: true })} displayValue={formatCutoff(sampleLayer.filterCutoff)} tone="amber" />
            <Knob label="Res" min={0.1} max={24} step={0.1} value={sampleLayer.filterResonance} onChange={(value) => updateSampleLayer({ filterResonance: value, filterEnabled: true })} tone="amber" />
          </div>
        </section>
      </div>
    </div>
  );
}
