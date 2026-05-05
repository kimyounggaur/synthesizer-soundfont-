import { createDefaultEngineState } from '../store/synthStore';
import type { EngineMode, SampleLayerState } from '../types/soundfont';
import type { SynthPreset } from '../types/synth';

const createdAt = '2026-05-03T00:00:00.000Z';

interface SamplePresetOptions {
  engineMode?: EngineMode;
  sampleLayer?: Partial<SampleLayerState>;
}

function samplePreset(id: string, name: string, category: SynthPreset['category'], bankId: string, presetId: string, options: SamplePresetOptions = {}): SynthPreset {
  const engine = createDefaultEngineState();

  return {
    id: `sample-${id}`,
    name,
    category,
    author: 'Factory',
    createdAt,
    engine: {
      ...engine,
      engineMode: options.engineMode ?? 'sample',
      sampleLayer: {
        ...engine.sampleLayer,
        enabled: true,
        bankId,
        presetId,
        level: 0.85,
        ...options.sampleLayer,
      },
    },
  };
}

export const sampleFactoryPresets: SynthPreset[] = [
  samplePreset('soft-piano-lite', 'Soft Piano Lite', 'Piano', 'demo-lite', 'soft-piano-lite'),
  samplePreset('bright-piano-lite', 'Bright Piano Lite', 'Piano', 'demo-lite', 'soft-piano-lite', {
    sampleLayer: { level: 0.9, attack: 0.002, release: 0.38, filterEnabled: true, filterCutoff: 9800, filterResonance: 0.6 },
  }),
  samplePreset('felt-piano-lite', 'Felt Piano Lite', 'Piano', 'demo-lite', 'soft-piano-lite', {
    sampleLayer: { level: 0.78, attack: 0.012, release: 0.9, filterEnabled: true, filterCutoff: 3600, filterResonance: 0.9 },
  }),
  samplePreset('piano-pad-lite', 'Piano Pad Lite', 'Pad', 'demo-lite', 'soft-piano-lite', {
    engineMode: 'hybrid',
    sampleLayer: { level: 0.72, attack: 0.08, release: 1.8, filterEnabled: true, filterCutoff: 5200, filterResonance: 0.7 },
  }),
  samplePreset('piano-bell-lite', 'Piano Bell Lite', 'Bell', 'demo-lite', 'soft-piano-lite', {
    sampleLayer: { level: 0.82, attack: 0.001, decay: 0.52, sustain: 0.24, release: 1.1, filterEnabled: true, filterCutoff: 8200, filterResonance: 1.4 },
  }),
  samplePreset('short-piano-lite', 'Short Piano Lite', 'Pluck', 'demo-lite', 'soft-piano-lite', {
    sampleLayer: { level: 0.84, attack: 0.001, decay: 0.18, sustain: 0.1, release: 0.22, oneShot: true, filterEnabled: true, filterCutoff: 6500, filterResonance: 0.7 },
  }),
  samplePreset('dark-piano-lite', 'Dark Piano Lite', 'Piano', 'demo-lite', 'soft-piano-lite', {
    sampleLayer: { level: 0.82, attack: 0.01, release: 0.72, filterEnabled: true, filterCutoff: 2400, filterResonance: 1.1 },
  }),
  samplePreset('wide-piano-lite', 'Wide Piano Lite', 'E-Piano', 'demo-lite', 'soft-piano-lite', {
    engineMode: 'hybrid',
    sampleLayer: { level: 0.76, attack: 0.006, release: 1.2, filterEnabled: true, filterCutoff: 7200, filterResonance: 0.8 },
  }),
  samplePreset('warm-strings-lite', 'Warm Strings Lite', 'Strings', 'demo-lite', 'warm-strings-lite'),
  samplePreset('slow-strings-lite', 'Slow Strings Lite', 'Strings', 'demo-lite', 'warm-strings-lite', {
    sampleLayer: { level: 0.82, attack: 0.45, release: 1.9, filterEnabled: true, filterCutoff: 4800, filterResonance: 0.8 },
  }),
  samplePreset('bright-strings-lite', 'Bright Strings Lite', 'Strings', 'demo-lite', 'warm-strings-lite', {
    sampleLayer: { level: 0.88, attack: 0.08, release: 0.95, filterEnabled: true, filterCutoff: 9200, filterResonance: 0.6 },
  }),
  samplePreset('dark-strings-lite', 'Dark Strings Lite', 'Strings', 'demo-lite', 'warm-strings-lite', {
    sampleLayer: { level: 0.8, attack: 0.22, release: 1.4, filterEnabled: true, filterCutoff: 2600, filterResonance: 0.9 },
  }),
  samplePreset('string-pad-lite', 'String Pad Lite', 'Pad', 'demo-lite', 'warm-strings-lite', {
    engineMode: 'hybrid',
    sampleLayer: { level: 0.74, attack: 0.8, release: 2.6, filterEnabled: true, filterCutoff: 4200, filterResonance: 0.7 },
  }),
  samplePreset('cinematic-strings-lite', 'Cinematic Strings Lite', 'Strings', 'demo-lite', 'warm-strings-lite', {
    sampleLayer: { level: 0.86, attack: 0.32, release: 2.2, filterEnabled: true, filterCutoff: 5600, filterResonance: 1.0 },
  }),
  samplePreset('string-swell-lite', 'String Swell Lite', 'Ambient', 'demo-lite', 'warm-strings-lite', {
    sampleLayer: { level: 0.78, attack: 1.2, release: 3.2, filterEnabled: true, filterCutoff: 3900, filterResonance: 0.7 },
  }),
  samplePreset('hybrid-string-wash-lite', 'Hybrid String Wash Lite', 'Pad', 'demo-lite', 'warm-strings-lite', {
    engineMode: 'hybrid',
    sampleLayer: { level: 0.7, attack: 0.6, release: 2.8, filterEnabled: true, filterCutoff: 5000, filterResonance: 0.8 },
  }),
];
