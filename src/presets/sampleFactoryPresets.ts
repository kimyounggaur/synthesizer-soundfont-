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

interface GeneratedSampleProgram {
  bankId: string;
  presetId: string;
  name: string;
  category: SynthPreset['category'];
}

const generatedSamplePrograms: GeneratedSampleProgram[] = [
  { bankId: 'gen-keys', presetId: 'studio-grand-generated', name: 'Studio Grand Generated', category: 'Piano' },
  { bankId: 'gen-keys', presetId: 'felt-upright-generated', name: 'Felt Upright Generated', category: 'Piano' },
  { bankId: 'gen-keys', presetId: 'bright-house-piano', name: 'Bright House Piano', category: 'Piano' },
  { bankId: 'gen-keys', presetId: 'tine-ep-generated', name: 'Tine EP Generated', category: 'E-Piano' },
  { bankId: 'gen-keys', presetId: 'reed-ep-generated', name: 'Reed EP Generated', category: 'E-Piano' },
  { bankId: 'gen-keys', presetId: 'fm-ep-bell-generated', name: 'FM EP Bell Generated', category: 'E-Piano' },
  { bankId: 'gen-keys', presetId: 'tonewheel-organ-generated', name: 'Tonewheel Organ Generated', category: 'Organ' },
  { bankId: 'gen-keys', presetId: 'chapel-organ-generated', name: 'Chapel Organ Generated', category: 'Organ' },
  { bankId: 'gen-keys', presetId: 'transistor-organ-generated', name: 'Transistor Organ Generated', category: 'Organ' },
  { bankId: 'gen-keys', presetId: 'celeste-bell-generated', name: 'Celeste Bell Generated', category: 'Bell' },
  { bankId: 'gen-keys', presetId: 'music-box-bell-generated', name: 'Music Box Bell Generated', category: 'Bell' },
  { bankId: 'gen-keys', presetId: 'glass-bell-generated', name: 'Glass Bell Generated', category: 'Bell' },
  { bankId: 'gen-orchestral', presetId: 'slow-string-section', name: 'Slow String Section', category: 'Strings' },
  { bankId: 'gen-orchestral', presetId: 'bright-string-ensemble', name: 'Bright String Ensemble', category: 'Strings' },
  { bankId: 'gen-orchestral', presetId: 'dark-cinematic-strings', name: 'Dark Cinematic Strings', category: 'Strings' },
  { bankId: 'gen-orchestral', presetId: 'soft-choir-ahh', name: 'Soft Choir Ahh', category: 'Choir' },
  { bankId: 'gen-orchestral', presetId: 'wide-choir-ooh', name: 'Wide Choir Ooh', category: 'Choir' },
  { bankId: 'gen-orchestral', presetId: 'glass-choir-pad', name: 'Glass Choir Pad', category: 'Choir' },
  { bankId: 'gen-orchestral', presetId: 'classic-brass-section', name: 'Classic Brass Section', category: 'Brass' },
  { bankId: 'gen-orchestral', presetId: 'soft-french-horn', name: 'Soft French Horn', category: 'Brass' },
  { bankId: 'gen-orchestral', presetId: 'bright-trumpet-stack', name: 'Bright Trumpet Stack', category: 'Brass' },
  { bankId: 'gen-orchestral', presetId: 'breathy-flute-generated', name: 'Breathy Flute Generated', category: 'Woodwind' },
  { bankId: 'gen-orchestral', presetId: 'warm-clarinet-generated', name: 'Warm Clarinet Generated', category: 'Woodwind' },
  { bankId: 'gen-orchestral', presetId: 'reed-oboe-generated', name: 'Reed Oboe Generated', category: 'Woodwind' },
  { bankId: 'gen-bass-guitar', presetId: 'finger-bass-generated', name: 'Finger Bass Generated', category: 'Bass' },
  { bankId: 'gen-bass-guitar', presetId: 'picked-bass-generated', name: 'Picked Bass Generated', category: 'Bass' },
  { bankId: 'gen-bass-guitar', presetId: 'sub-bass-generated', name: 'Sub Bass Generated', category: 'Bass' },
  { bankId: 'gen-bass-guitar', presetId: 'rubber-bass-generated', name: 'Rubber Bass Generated', category: 'Bass' },
  { bankId: 'gen-bass-guitar', presetId: 'synth-upright-bass', name: 'Synth Upright Bass', category: 'Bass' },
  { bankId: 'gen-bass-guitar', presetId: 'round-bass-generated', name: 'Round Bass Generated', category: 'Bass' },
  { bankId: 'gen-bass-guitar', presetId: 'nylon-guitar-generated', name: 'Nylon Guitar Generated', category: 'Guitar' },
  { bankId: 'gen-bass-guitar', presetId: 'steel-guitar-generated', name: 'Steel Guitar Generated', category: 'Guitar' },
  { bankId: 'gen-bass-guitar', presetId: 'muted-guitar-generated', name: 'Muted Guitar Generated', category: 'Guitar' },
  { bankId: 'gen-bass-guitar', presetId: 'chorus-guitar-generated', name: 'Chorus Guitar Generated', category: 'Guitar' },
  { bankId: 'gen-bass-guitar', presetId: 'harmonic-guitar-generated', name: 'Harmonic Guitar Generated', category: 'Guitar' },
  { bankId: 'gen-bass-guitar', presetId: 'wide-guitar-pad', name: 'Wide Guitar Pad', category: 'Pad' },
  { bankId: 'gen-pluck-bell', presetId: 'soft-vibes-generated', name: 'Soft Vibes Generated', category: 'Mallet' },
  { bankId: 'gen-pluck-bell', presetId: 'wood-marimba-generated', name: 'Wood Marimba Generated', category: 'Mallet' },
  { bankId: 'gen-pluck-bell', presetId: 'kalimba-generated', name: 'Kalimba Generated', category: 'Mallet' },
  { bankId: 'gen-pluck-bell', presetId: 'rubber-mallet-generated', name: 'Rubber Mallet Generated', category: 'Mallet' },
  { bankId: 'gen-pluck-bell', presetId: 'ice-chime-generated', name: 'Ice Chime Generated', category: 'Bell' },
  { bankId: 'gen-pluck-bell', presetId: 'temple-bell-generated', name: 'Temple Bell Generated', category: 'Bell' },
  { bankId: 'gen-pluck-bell', presetId: 'digital-glock-generated', name: 'Digital Glock Generated', category: 'Bell' },
  { bankId: 'gen-pluck-bell', presetId: 'moon-bell-generated', name: 'Moon Bell Generated', category: 'Bell' },
  { bankId: 'gen-pluck-bell', presetId: 'harp-pluck-generated', name: 'Harp Pluck Generated', category: 'Pluck' },
  { bankId: 'gen-pluck-bell', presetId: 'muted-pluck-generated', name: 'Muted Pluck Generated', category: 'Pluck' },
  { bankId: 'gen-pluck-bell', presetId: 'rubber-pluck-generated', name: 'Rubber Pluck Generated', category: 'Pluck' },
  { bankId: 'gen-pluck-bell', presetId: 'crystal-pluck-generated', name: 'Crystal Pluck Generated', category: 'Pluck' },
  { bankId: 'gen-drums-fx', presetId: 'tight-kick-generated', name: 'Tight Kick Generated', category: 'Drum' },
  { bankId: 'gen-drums-fx', presetId: 'deep-kick-generated', name: 'Deep Kick Generated', category: 'Drum' },
  { bankId: 'gen-drums-fx', presetId: 'noise-snare-generated', name: 'Noise Snare Generated', category: 'Drum' },
  { bankId: 'gen-drums-fx', presetId: 'rim-tap-generated', name: 'Rim Tap Generated', category: 'Drum' },
  { bankId: 'gen-drums-fx', presetId: 'closed-hat-generated', name: 'Closed Hat Generated', category: 'Drum' },
  { bankId: 'gen-drums-fx', presetId: 'open-hat-generated', name: 'Open Hat Generated', category: 'Drum' },
  { bankId: 'gen-drums-fx', presetId: 'electro-tom-generated', name: 'Electro Tom Generated', category: 'Drum' },
  { bankId: 'gen-drums-fx', presetId: 'metal-clave-generated', name: 'Metal Clave Generated', category: 'Drum' },
  { bankId: 'gen-drums-fx', presetId: 'sub-drop-generated', name: 'Sub Drop Generated', category: 'FX' },
  { bankId: 'gen-drums-fx', presetId: 'noise-riser-generated', name: 'Noise Riser Generated', category: 'FX' },
  { bankId: 'gen-drums-fx', presetId: 'laser-zap-generated', name: 'Laser Zap Generated', category: 'FX' },
  { bankId: 'gen-drums-fx', presetId: 'digital-burst-generated', name: 'Digital Burst Generated', category: 'FX' },
  { bankId: 'gen-ambient', presetId: 'warm-pad-cloud', name: 'Warm Pad Cloud', category: 'Pad' },
  { bankId: 'gen-ambient', presetId: 'icy-pad-wash', name: 'Icy Pad Wash', category: 'Pad' },
  { bankId: 'gen-ambient', presetId: 'tape-drone', name: 'Tape Drone', category: 'Ambient' },
  { bankId: 'gen-ambient', presetId: 'deep-space-bed', name: 'Deep Space Bed', category: 'Ambient' },
  { bankId: 'gen-ambient', presetId: 'choir-air-pad', name: 'Choir Air Pad', category: 'Choir' },
  { bankId: 'gen-ambient', presetId: 'string-orbit-pad', name: 'String Orbit Pad', category: 'Strings' },
  { bankId: 'gen-ambient', presetId: 'glass-shimmer-pad', name: 'Glass Shimmer Pad', category: 'Bell' },
  { bankId: 'gen-ambient', presetId: 'rain-window-texture', name: 'Rain Window Texture', category: 'FX' },
  { bankId: 'gen-ambient', presetId: 'dust-halo-texture', name: 'Dust Halo Texture', category: 'FX' },
  { bankId: 'gen-ambient', presetId: 'frozen-lake-drone', name: 'Frozen Lake Drone', category: 'Ambient' },
  { bankId: 'gen-ambient', presetId: 'aurora-field', name: 'Aurora Field', category: 'Ambient' },
  { bankId: 'gen-ambient', presetId: 'ocean-memory-wash', name: 'Ocean Memory Wash', category: 'Ambient' },
  { bankId: 'gen-sequence', presetId: 'pulse-seq-bass', name: 'Pulse Seq Bass', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'rubber-seq-bass', name: 'Rubber Seq Bass', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'clock-pluck-seq', name: 'Clock Pluck Seq', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'glass-step-seq', name: 'Glass Step Seq', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'fm-step-keys', name: 'FM Step Keys', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'organ-stepper', name: 'Organ Stepper', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'metro-click-drum', name: 'Metro Click Drum', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'ratchet-tom-drum', name: 'Ratchet Tom Drum', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'data-seq-fx', name: 'Data Seq FX', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'riser-step-fx', name: 'Riser Step FX', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'motion-pad-seq', name: 'Motion Pad Seq', category: 'Sequence' },
  { bankId: 'gen-sequence', presetId: 'vector-grid-seq', name: 'Vector Grid Seq', category: 'Sequence' },
  { bankId: 'gen-experimental', presetId: 'granular-shard-generated', name: 'Granular Shard Generated', category: 'Experimental' },
  { bankId: 'gen-experimental', presetId: 'folded-metal-generated', name: 'Folded Metal Generated', category: 'Experimental' },
  { bankId: 'gen-experimental', presetId: 'bitrot-voice-generated', name: 'Bitrot Voice Generated', category: 'Experimental' },
  { bankId: 'gen-experimental', presetId: 'circuit-breath-generated', name: 'Circuit Breath Generated', category: 'Experimental' },
  { bankId: 'gen-experimental', presetId: 'number-station-generated', name: 'Number Station Generated', category: 'Experimental' },
  { bankId: 'gen-experimental', presetId: 'unstable-pad-generated', name: 'Unstable Pad Generated', category: 'Experimental' },
  { bankId: 'gen-experimental', presetId: 'alien-sweep-generated', name: 'Alien Sweep Generated', category: 'FX' },
  { bankId: 'gen-experimental', presetId: 'servo-door-generated', name: 'Servo Door Generated', category: 'FX' },
  { bankId: 'gen-experimental', presetId: 'reverse-glass-generated', name: 'Reverse Glass Generated', category: 'FX' },
  { bankId: 'gen-experimental', presetId: 'magnetic-error-generated', name: 'Magnetic Error Generated', category: 'FX' },
  { bankId: 'gen-experimental', presetId: 'chaos-mallet-generated', name: 'Chaos Mallet Generated', category: 'Mallet' },
  { bankId: 'gen-experimental', presetId: 'fractal-bell-generated', name: 'Fractal Bell Generated', category: 'Bell' },
];

function generatedSampleOptions(category: SynthPreset['category'], index: number): SamplePresetOptions {
  const filterCutoff = 3200 + (index % 9) * 760;
  const filterResonance = 0.55 + (index % 5) * 0.2;

  if (category === 'Pad' || category === 'Ambient' || category === 'Strings' || category === 'Choir') {
    return {
      engineMode: category === 'Pad' || category === 'Ambient' ? 'hybrid' : 'sample',
      sampleLayer: { level: 0.72, attack: 0.38 + (index % 5) * 0.16, release: 1.8 + (index % 5) * 0.24, filterEnabled: true, filterCutoff, filterResonance },
    };
  }

  if (category === 'Drum' || category === 'FX') {
    return {
      sampleLayer: { level: category === 'Drum' ? 0.92 : 0.78, attack: 0.001, decay: 0.18 + (index % 4) * 0.08, sustain: 0.08, release: 0.24 + (index % 4) * 0.08, oneShot: true, filterEnabled: category === 'FX', filterCutoff, filterResonance },
    };
  }

  if (category === 'Bell' || category === 'Mallet' || category === 'Pluck') {
    return {
      sampleLayer: { level: 0.8, attack: 0.001, decay: 0.42 + (index % 5) * 0.08, sustain: 0.12, release: 0.72 + (index % 5) * 0.12, oneShot: true, filterEnabled: true, filterCutoff: filterCutoff + 1600, filterResonance },
    };
  }

  if (category === 'Sequence') {
    return {
      engineMode: 'hybrid',
      sampleLayer: { level: 0.76, attack: 0.002, decay: 0.24, sustain: 0.32, release: 0.36, filterEnabled: true, filterCutoff, filterResonance },
    };
  }

  return {
    sampleLayer: { level: 0.84, attack: 0.004 + (index % 4) * 0.004, release: 0.54 + (index % 5) * 0.12, filterEnabled: true, filterCutoff, filterResonance },
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
  ...generatedSamplePrograms.map((program, index) =>
    samplePreset(`${program.bankId}-${program.presetId}`, program.name, program.category, program.bankId, program.presetId, generatedSampleOptions(program.category, index)),
  ),
];
