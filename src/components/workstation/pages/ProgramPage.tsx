import { useEffect, useMemo, useState } from 'react';
import { factoryPresets, presetCategoryOrder } from '../../../presets/factoryPresets';
import { loadPublicSampleBanks, sampleBankManager } from '../../../samples/sampleBankLibrary';
import { usePresetStore } from '../../../store/presetStore';
import { selectEngineState, useSynthStore } from '../../../store/synthStore';
import type { SampleBankManifest, SamplePresetDefinition } from '../../../types/soundfont';
import type { MeterSnapshot, SynthPreset } from '../../../types/synth';
import { createUserPreset, exportPresets, parsePresetImport } from '../../../utils/presetStorage';

type ProgramKind = 'synth' | 'sample';
type ProgramCategoryFilter = 'All' | 'User' | string;

interface ProgramItem {
  key: string;
  kind: ProgramKind;
  name: string;
  category: string;
  bank: string;
  author: string;
  createdAt: string;
  engineMode: 'Synth' | 'Sample';
  effectsCount: number;
  sampleLayerStatus: string;
  description: string;
  preset?: SynthPreset;
  sample?: SamplePresetDefinition;
  bankId?: string;
  bankLicense?: string;
}

function formatDate(value?: string): string {
  if (!value) {
    return 'Runtime';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().slice(0, 10);
}

function modeFromKind(kind: ProgramKind): 'Synth' | 'Sample' {
  return kind === 'synth' ? 'Synth' : 'Sample';
}

function programKeyForSynth(id: string): string {
  return `synth:${id}`;
}

function programKeyForSample(bankId: string, presetId: string): string {
  return `sample:${bankId}:${presetId}`;
}

function ProgramInfoField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="workstation-info-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function ProgramPage({ meter }: { meter: MeterSnapshot }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategoryFilter>('All');
  const [selectedProgramKey, setSelectedProgramKey] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [banks, setBanks] = useState<SampleBankManifest[]>(() => sampleBankManager.getBankManifests());
  const [sampleBankLoadError, setSampleBankLoadError] = useState<string | null>(null);
  const loadPreset = useSynthStore((state) => state.loadPreset);
  const loadSamplePreset = useSynthStore((state) => state.loadSamplePreset);
  const setEngineMode = useSynthStore((state) => state.setEngineMode);
  const savePresetMarker = useSynthStore((state) => state.savePreset);
  const currentPreset = useSynthStore((state) => state.currentPreset);
  const engineMode = useSynthStore((state) => state.engineMode);
  const sampleLayer = useSynthStore((state) => state.sampleLayer);
  const polyphony = useSynthStore((state) => state.polyphony);
  const effects = useSynthStore((state) => state.effects);
  const userPresets = usePresetStore((state) => state.userPresets);
  const loadUserPresets = usePresetStore((state) => state.loadUserPresets);
  const saveUserPreset = usePresetStore((state) => state.saveUserPreset);
  const deleteUserPreset = usePresetStore((state) => state.deleteUserPreset);
  const importUserPresets = usePresetStore((state) => state.importUserPresets);

  useEffect(() => {
    loadUserPresets();
  }, [loadUserPresets]);

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

  const synthPrograms = useMemo<ProgramItem[]>(
    () =>
      [...factoryPresets, ...userPresets].map((preset) => ({
        key: programKeyForSynth(preset.id),
        kind: 'synth',
        name: preset.name,
        category: preset.category,
        bank: preset.author === 'User' ? 'User Presets' : 'Factory Library',
        author: preset.author,
        createdAt: preset.createdAt,
        engineMode: 'Synth',
        effectsCount: preset.engine.effects.length,
        sampleLayerStatus: preset.engine.sampleLayer.enabled ? 'Stored On' : 'Off',
        description: `${preset.engine.oscA.waveform.toUpperCase()} + ${preset.engine.oscB.waveform.toUpperCase()}`,
        preset,
      })),
    [userPresets],
  );

  const samplePrograms = useMemo<ProgramItem[]>(
    () =>
      banks.flatMap((bank) =>
        bank.presets.map((preset) => ({
          key: programKeyForSample(bank.id, preset.id),
          kind: 'sample',
          name: preset.name,
          category: preset.category,
          bank: bank.name,
          author: preset.author,
          createdAt: 'Runtime',
          engineMode: 'Sample',
          effectsCount: 0,
          sampleLayerStatus: `${preset.zones.length} zones`,
          description: preset.description ?? bank.description ?? 'Sample preset',
          sample: preset,
          bankId: bank.id,
          bankLicense: preset.license ?? bank.license,
        })),
      ),
    [banks],
  );

  const programs = useMemo(() => [...synthPrograms, ...samplePrograms], [samplePrograms, synthPrograms]);

  const currentProgramKey = currentPreset?.startsWith('sample:')
    ? currentPreset
    : currentPreset
      ? programKeyForSynth(currentPreset)
      : sampleLayer.bankId && sampleLayer.presetId
        ? programKeyForSample(sampleLayer.bankId, sampleLayer.presetId)
        : null;

  const categories = useMemo(() => {
    const knownCategories = [...presetCategoryOrder, 'Piano', 'E-Piano', 'Organ', 'Strings', 'Choir', 'Brass', 'Woodwind', 'Guitar', 'Mallet', 'Drum'];
    const ordered = Array.from(new Set(knownCategories)).filter((category) => programs.some((program) => program.category === category));
    const extra = Array.from(new Set(programs.map((program) => program.category))).filter((category) => !ordered.includes(category)).sort();

    return [
      { id: 'All', label: 'All Programs', count: programs.length },
      ...ordered.concat(extra).map((category) => ({
        id: category,
        label: category,
        count: programs.filter((program) => program.category === category).length,
      })),
      { id: 'User', label: 'User Presets', count: userPresets.length },
    ];
  }, [programs, userPresets.length]);

  const visiblePrograms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return programs.filter((program) => {
      const matchesCategory =
        selectedCategory === 'All' || (selectedCategory === 'User' ? program.author === 'User' : program.category === selectedCategory);
      const searchable = `${program.name} ${program.category} ${program.author} ${program.bank} ${program.engineMode}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [programs, query, selectedCategory]);

  const selectedProgram =
    programs.find((program) => program.key === selectedProgramKey) ??
    programs.find((program) => program.key === currentProgramKey) ??
    visiblePrograms[0] ??
    programs[0];

  const handleLoadProgram = (program: ProgramItem | undefined) => {
    if (!program) {
      return;
    }

    if (program.kind === 'synth' && program.preset) {
      loadPreset(program.preset);
      setSelectedProgramKey(program.key);
      return;
    }

    if (program.kind === 'sample' && program.bankId && program.sample) {
      loadSamplePreset(program.bankId, program.sample.id);
      setEngineMode('sample');
      setSelectedProgramKey(program.key);
    }
  };

  const handleSave = () => {
    const name = window.prompt('Preset name');
    if (!name?.trim()) {
      return;
    }

    const preset = createUserPreset(name.trim(), selectEngineState(useSynthStore.getState()));
    saveUserPreset(preset);
    savePresetMarker(preset.id);
    setSelectedProgramKey(programKeyForSynth(preset.id));
    setSelectedCategory('User');
  };

  const handleExport = async () => {
    const exported = exportPresets(userPresets);
    setImportText(exported);
    try {
      await navigator.clipboard.writeText(exported);
    } catch {
      window.alert('Clipboard permission was blocked. Export JSON has been placed in the preset text box.');
    }
  };

  const handleImport = () => {
    try {
      importUserPresets(parsePresetImport(importText));
      setImportText('');
      setSelectedCategory('User');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Preset import failed.');
    }
  };

  const loadedProgramName = programs.find((program) => program.key === currentProgramKey)?.name ?? 'Init Program';
  const activeSampleStatus = sampleLayer.enabled ? `${sampleLayer.bankId ?? 'Sample'} / ${sampleLayer.presetId ?? 'Preset'}` : 'Off';

  return (
    <div className="workstation-lcd-page workstation-program-page">
      <div className="workstation-page-header">
        <div>
          <span>Program Select</span>
          <strong>{loadedProgramName}</strong>
        </div>
        <div className="workstation-page-header-metrics">
          <span>Mode {engineMode.toUpperCase()}</span>
          <span>Poly {polyphony}</span>
          <span>Active {meter.activeVoices}</span>
        </div>
      </div>

      <div className="workstation-program-layout">
        <aside className="workstation-lcd-panel workstation-category-list" aria-label="Program categories">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={selectedCategory === category.id ? 'workstation-category-button is-active' : 'workstation-category-button'}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span>{category.label}</span>
              <strong>{category.count}</strong>
            </button>
          ))}
          {sampleBankLoadError ? <div className="workstation-lcd-alert">{sampleBankLoadError}</div> : null}
        </aside>

        <section className="workstation-lcd-panel workstation-program-list" aria-label="Program list">
          <div className="workstation-program-search">
            <input className="workstation-lcd-input" value={query} placeholder="Search programs" onChange={(event) => setQuery(event.target.value)} />
            <span>{visiblePrograms.length} sounds</span>
          </div>
          <div className="workstation-program-rows">
            {visiblePrograms.map((program) => {
              const loaded = program.key === currentProgramKey;
              const selected = program.key === selectedProgram?.key;
              return (
                <button
                  key={program.key}
                  type="button"
                  className={`workstation-program-row${loaded ? ' is-loaded' : ''}${selected ? ' is-selected' : ''}`}
                  onClick={() => setSelectedProgramKey(program.key)}
                  onDoubleClick={() => handleLoadProgram(program)}
                >
                  <span className="workstation-row-index">{program.kind === 'sample' ? 'SMP' : 'PRG'}</span>
                  <span>
                    <strong>{program.name}</strong>
                    <small>
                      {program.category} / {program.bank}
                    </small>
                  </span>
                  <em>{loaded ? 'Loaded' : modeFromKind(program.kind)}</em>
                </button>
              );
            })}
            {visiblePrograms.length === 0 ? <div className="workstation-empty-state">No programs found.</div> : null}
          </div>
        </section>

        <aside className="workstation-lcd-panel workstation-program-info" aria-label="Program information">
          <div className="workstation-info-title">
            <span>{selectedProgram?.engineMode ?? 'Program'}</span>
            <strong>{selectedProgram?.name ?? 'Init Program'}</strong>
          </div>

          <div className="workstation-info-grid">
            <ProgramInfoField label="Category" value={selectedProgram?.category ?? 'Manual'} />
            <ProgramInfoField label="Mode" value={selectedProgram?.engineMode ?? 'Synth'} />
            <ProgramInfoField label="Bank" value={selectedProgram?.bank ?? 'Edit Buffer'} />
            <ProgramInfoField label="Author" value={selectedProgram?.author ?? 'User'} />
            <ProgramInfoField label="Created" value={formatDate(selectedProgram?.createdAt)} />
            <ProgramInfoField label="Voices" value={`${meter.activeVoices}/${polyphony}`} />
            <ProgramInfoField label="FX" value={selectedProgram?.effectsCount ?? effects.length} />
            <ProgramInfoField label="Sample" value={selectedProgram?.sampleLayerStatus ?? activeSampleStatus} />
          </div>

          <div className="workstation-program-description">{selectedProgram?.description ?? 'Manual edit buffer'}</div>
          {selectedProgram?.bankLicense ? <div className="workstation-license-line">License: {selectedProgram.bankLicense}</div> : null}

          <div className="workstation-quick-actions">
            <button type="button" className="workstation-action-button is-primary" onClick={() => handleLoadProgram(selectedProgram)}>
              Load
            </button>
            <button type="button" className="workstation-action-button" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="workstation-action-button" onClick={handleExport}>
              Export
            </button>
            <button type="button" className="workstation-action-button" onClick={handleImport}>
              Import
            </button>
            {selectedProgram?.preset?.author === 'User' ? (
              <button type="button" className="workstation-action-button is-danger" onClick={() => deleteUserPreset(selectedProgram.preset?.id ?? '')}>
                Delete
              </button>
            ) : null}
          </div>

          <textarea
            className="workstation-lcd-input workstation-import-textarea"
            value={importText}
            placeholder="Preset JSON"
            onChange={(event) => setImportText(event.target.value)}
          />
        </aside>
      </div>
    </div>
  );
}
