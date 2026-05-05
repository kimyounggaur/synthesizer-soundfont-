import { createDefaultEngineState } from '../store/synthStore';
import type { EffectState, EffectType, FilterKind, LfoTarget, SynthEngineState, SynthPreset, SynthWaveform } from '../types/synth';

type PresetCategory = SynthPreset['category'];

type EngineOverrides = Omit<
  Partial<SynthEngineState>,
  'oscA' | 'oscB' | 'subOsc' | 'noise' | 'filter' | 'ampEnv' | 'filterEnv' | 'lfo1' | 'lfo2' | 'waveSequencer' | 'vectorMixer' | 'sampleLayer'
> & {
  oscA?: Partial<SynthEngineState['oscA']>;
  oscB?: Partial<SynthEngineState['oscB']>;
  subOsc?: Partial<SynthEngineState['subOsc']>;
  noise?: Partial<SynthEngineState['noise']>;
  filter?: Partial<SynthEngineState['filter']>;
  ampEnv?: Partial<SynthEngineState['ampEnv']>;
  filterEnv?: Partial<SynthEngineState['filterEnv']>;
  lfo1?: Partial<SynthEngineState['lfo1']>;
  lfo2?: Partial<SynthEngineState['lfo2']>;
  waveSequencer?: Partial<SynthEngineState['waveSequencer']>;
  vectorMixer?: Partial<SynthEngineState['vectorMixer']>;
  sampleLayer?: Partial<SynthEngineState['sampleLayer']>;
};

const createdAt = '2026-05-05T00:00:00.000Z';

const expansionGroups = [
  {
    category: 'Bass',
    names: ['Midnight Sub Drive', 'Chrome Mono Bass', 'Velvet Low End', 'Pulse Basement', 'Analog Kick Bass', 'Roundhouse Sub', 'Filter Funk Bass', 'Deep Sync Bass', 'Dark Motion Bass', 'Wide Reese Lite'],
  },
  {
    category: 'Lead',
    names: ['Solar Sync Lead', 'Neon Square Lead', 'Bright Fifth Solo', 'Velvet Mono Lead', 'Laser Pulse Lead', 'Glass Ribbon Lead', 'Drift Saw Lead', 'Twin Edge Lead', 'FMish Wire Lead', 'Skyline Solo'],
  },
  {
    category: 'Pad',
    names: ['Lunar Silk Pad', 'Warm Cloud Pad', 'Analog Horizon Pad', 'Velvet Mist Pad', 'Slow Motion Pad', 'Choir Glass Pad', 'Cyan Drift Pad', 'Tape Memory Pad', 'Blooming Vector Pad', 'Quiet Dawn Pad'],
  },
  {
    category: 'Pluck',
    names: ['Bamboo Pluck', 'Digital Harp Pluck', 'Muted Circuit Pluck', 'Soft Clock Pluck', 'Resonant Twig', 'Crystal Pop Pluck', 'Palm Mute Synth', 'Tiny String Pluck', 'Sequence Dot Pluck', 'Rubber Key Pluck'],
  },
  {
    category: 'Keys',
    names: ['Classic Poly Keys', 'Dusty Synth Keys', 'Wide PWM Keys', 'Mellow House Keys', 'Glass Stack Keys', 'Soft Chorus Keys', 'FM Bell Keys', 'Compact Stage Keys', 'Late Night Keys', 'Warm Digital Keys'],
  },
  {
    category: 'Piano',
    names: ['Synth Grand Layer', 'Felt Analog Piano', 'Bright Toy Piano', 'Soft Sine Piano', 'Hybrid Piano Pad', 'Paper Upright', 'Loft Room Piano', 'Dream Piano Stack', 'Mono Piano Bell', 'Velvet Piano Tone'],
  },
  {
    category: 'E-Piano',
    names: ['Warm Tine EP', 'Dyno Bell EP', 'Reed Suitcase EP', 'Soft Tremolo EP', 'Glass Tine EP', 'Mellow FM EP', 'Chorus Stage EP', 'Velvet Reed EP', 'Late Night EP', 'Bright Road EP'],
  },
  {
    category: 'Organ',
    names: ['Drawbar Soft Organ', 'Rotary Square Organ', 'Hollow Chapel Organ', 'Jazz Combo Organ', 'Pulse Tonewheel', 'Cathedral Air Organ', 'Warm Transistor Organ', 'Clicky House Organ', 'Glass Pipe Organ', 'Overdrive Organ'],
  },
  {
    category: 'Strings',
    names: ['Analog String Ensemble', 'Tape Chamber Strings', 'Soft Solina Stack', 'Warm Section Strings', 'Slow Bow Strings', 'Bright Octave Strings', 'Hybrid String Pad', 'Chamber Motion Strings', 'Dark Film Strings', 'String Machine Lite'],
  },
  {
    category: 'Choir',
    names: ['Air Choir', 'Velvet Vox', 'Digital Ahh Choir', 'Warm Ooh Pad', 'Breath Choir Stack', 'Satellite Voices', 'Soft Formant Choir', 'Glass Human Pad', 'Chapel Vox', 'Wide Choir Drift'],
  },
  {
    category: 'Brass',
    names: ['Classic Synth Brass', 'Punchy Poly Brass', 'Warm Horn Stack', 'Bright Stab Brass', 'Soft Brass Pad', 'Analog Trumpet Lead', 'PWM Brass Ensemble', 'Motion Brass Sweep', 'Big Fifth Brass', 'Velvet Brass Bed'],
  },
  {
    category: 'Woodwind',
    names: ['Reed Ensemble', 'Soft Flute Synth', 'Breathy Pipe Lead', 'Clarinet Square', 'Bamboo Air Lead', 'Oboe Pulse', 'Hollow Wind Pad', 'Panpipe Glass', 'Wind Controller Lite', 'Wooden Whistle'],
  },
  {
    category: 'Guitar',
    names: ['Plucked Synth Guitar', 'Chorus Clean Guitar', 'Muted Electro Guitar', 'Glass Nylon Synth', 'Overdrive Pulse Guitar', 'Harmonic String Pad', 'Tremolo Bar Guitar', 'Soft Pick Lead', 'Resonator Synth', 'Air Guitar Texture'],
  },
  {
    category: 'Bell',
    names: ['Morning Bell', 'Digital Church Bell', 'Frost Chime', 'Glass Clockwork', 'Lunar Music Box', 'Soft Mallet Bell', 'Silver Triangle Bell', 'Bell Choir Stack', 'Ice Crystal Bell', 'Hollow Metal Bell'],
  },
  {
    category: 'Mallet',
    names: ['Marimba Synth', 'Soft Vibe Keys', 'Wooden Mallet Pad', 'Glassy Kalimba', 'Rubber Mallet', 'Bright Xylo Synth', 'Bell Mallet Stack', 'Velvet Vibraphone', 'Plucked Mbira', 'Toy Mallet Lead'],
  },
  {
    category: 'Drum',
    names: ['Synth Kick Tight', 'Noise Snare Soft', 'Electro Tom Low', 'Click Hat Closed', 'Analog Rim Tap', 'Deep Boom Hit', 'Laser Zap Drum', 'FM Perc Pop', 'Metallic Clave', 'Dusty Kick Snap'],
  },
  {
    category: 'Sequence',
    names: ['Night Runner Seq', 'Metro Pulse Seq', 'Binary Bassline', 'Cascade Steps', 'Arp Glass Grid', 'Syncopated Saw Seq', 'Minor City Sequence', 'Clockwork Motion', 'Velvet Stepper', 'Wide Vector Seq'],
  },
  {
    category: 'Ambient',
    names: ['Frozen Lake Drone', 'Deep Space Bed', 'Dust Halo Pad', 'Rainroom Texture', 'Slow Signal Wash', 'Aurora Field', 'Oceanic Memory', 'Warm Static Cloud', 'Cathedral Orbit', 'Dream Tape Loop'],
  },
  {
    category: 'FX',
    names: ['Downlifter Sweep', 'Bright Riser Noise', 'Sub Drop Impact', 'Alien Data Burst', 'Servo Door Hit', 'Reverse Glass FX', 'Static Radio Sweep', 'Laser Charge', 'Air Brake Noise', 'Digital Debris'],
  },
  {
    category: 'Experimental',
    names: ['Broken Algorithm', 'Folded Phase Lab', 'Granular Alloy', 'Wobble Numbers', 'Magnetic Error Pad', 'Circuit Ritual', 'Bitcrush Choir', 'Random Access Tone', 'Vector Disorder', 'Fractal Pluck Lab'],
  },
] satisfies Array<{ category: PresetCategory; names: string[] }>;

const brightWaves: SynthWaveform[] = ['sawtooth', 'pulse', 'square', 'wavetable'];
const softWaves: SynthWaveform[] = ['sine', 'triangle', 'wavetable', 'pulse'];
const filterSweep: FilterKind[] = ['lowpass', 'ladder', 'bandpass', 'notch', 'highpass'];
const lfoTargets: LfoTarget[] = ['filterCutoff', 'pan', 'oscMix', 'wavePosition', 'pitch', 'ampLevel'];

function pick<T>(items: readonly T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function engine(overrides: EngineOverrides): SynthEngineState {
  const defaults = createDefaultEngineState();
  return {
    ...defaults,
    ...overrides,
    oscA: { ...defaults.oscA, ...overrides.oscA },
    oscB: { ...defaults.oscB, ...overrides.oscB },
    subOsc: { ...defaults.subOsc, ...overrides.subOsc },
    noise: { ...defaults.noise, ...overrides.noise },
    filter: { ...defaults.filter, ...overrides.filter },
    ampEnv: { ...defaults.ampEnv, ...overrides.ampEnv },
    filterEnv: { ...defaults.filterEnv, ...overrides.filterEnv },
    lfo1: { ...defaults.lfo1, ...overrides.lfo1 },
    lfo2: { ...defaults.lfo2, ...overrides.lfo2 },
    waveSequencer: { ...defaults.waveSequencer, ...overrides.waveSequencer },
    vectorMixer: { ...defaults.vectorMixer, ...overrides.vectorMixer },
    sampleLayer: { ...defaults.sampleLayer, ...overrides.sampleLayer },
    effects: overrides.effects ?? defaults.effects,
  };
}

function fx(id: string, type: EffectType, wet: number, params: Record<string, number> = {}): EffectState {
  return {
    id: `expanded-fx-${id}-${type}`,
    type,
    enabled: true,
    wet,
    params,
  };
}

function modBlock(seed: number): Pick<EngineOverrides, 'lfo1' | 'lfo2' | 'vectorMixer'> {
  return {
    lfo1: {
      waveform: pick(['sine', 'triangle', 'square', 'sawtooth'] satisfies SynthWaveform[], seed),
      rate: 0.08 + (seed % 9) * 0.18,
      depth: clamp(0.08 + (seed % 7) * 0.05, 0.08, 0.48),
      target: pick(lfoTargets, seed),
      sync: seed % 3 === 0 ? 'tempo' : 'free',
      syncValue: pick(['1/1', '1/2', '1/4', '1/8', '1/16'] as const, seed),
    },
    lfo2: {
      waveform: pick(['sine', 'triangle', 'pulse', 'wavetable'] satisfies SynthWaveform[], seed + 3),
      rate: 0.12 + (seed % 8) * 0.11,
      depth: clamp(0.05 + (seed % 6) * 0.04, 0.05, 0.34),
      target: pick(lfoTargets, seed + 2),
      sync: seed % 4 === 0 ? 'tempo' : 'free',
      syncValue: pick(['1/2', '1/4', '1/8', '1/16', '1/32'] as const, seed),
    },
    vectorMixer: {
      x: clamp(0.18 + (seed % 9) * 0.08, 0.08, 0.86),
      y: clamp(0.04 + (seed % 7) * 0.09, 0, 0.72),
    },
  };
}

function makeEngine(category: PresetCategory, name: string, index: number): SynthEngineState {
  const seed = index + 1;
  const id = slug(name);
  const drift = ((seed % 9) - 4) * 2;
  const octaveLift = seed % 5 === 0 ? 1 : 0;

  if (category === 'Bass') {
    return engine({
      bpm: 86 + (seed % 52),
      oscA: { waveform: pick(['sawtooth', 'pulse', 'square'] satisfies SynthWaveform[], seed), octave: -1, fine: -Math.abs(drift), level: 0.78 },
      oscB: { waveform: pick(['square', 'sawtooth', 'triangle'] satisfies SynthWaveform[], seed + 2), octave: -1, fine: Math.abs(drift) + 2, level: 0.42 + (seed % 4) * 0.04 },
      subOsc: { enabled: true, waveform: pick(['sine', 'square', 'triangle'] satisfies SynthWaveform[], seed), octave: -2, level: 0.28 + (seed % 5) * 0.05 },
      filter: { type: pick(['lowpass', 'ladder'] satisfies FilterKind[], seed), cutoff: 420 + (seed % 10) * 120, resonance: 2.4 + (seed % 8) * 1.2, drive: 0.16 + (seed % 6) * 0.04, keyTracking: 0.12 + (seed % 4) * 0.05, envelopeAmount: 0.18 + (seed % 5) * 0.08 },
      ampEnv: { attack: 0.002 + (seed % 4) * 0.002, decay: 0.12 + (seed % 5) * 0.04, sustain: 0.48 + (seed % 5) * 0.08, release: 0.08 + (seed % 4) * 0.04 },
      filterEnv: { attack: 0.002, decay: 0.18 + (seed % 5) * 0.04, sustain: 0.1 + (seed % 4) * 0.06, release: 0.08 + (seed % 4) * 0.03 },
      vectorMixer: { x: 0.24 + (seed % 6) * 0.08, y: 0.06 + (seed % 4) * 0.04 },
      effects: seed % 3 === 0 ? [fx(id, 'compressor', 0.56, { threshold: -24, ratio: 5 })] : [],
    });
  }

  if (category === 'Lead') {
    return engine({
      bpm: 108 + (seed % 44),
      oscA: { waveform: pick(brightWaves, seed), octave: octaveLift, fine: -drift, level: 0.74 },
      oscB: { waveform: pick(['sawtooth', 'pulse', 'wavetable'] satisfies SynthWaveform[], seed + 1), octave: 0, semitone: seed % 3 === 0 ? 7 : 0, fine: drift + 3, level: 0.48 + (seed % 5) * 0.05 },
      subOsc: { enabled: seed % 4 === 0, waveform: 'triangle', octave: -1, level: 0.08 + (seed % 3) * 0.03 },
      filter: { type: pick(['lowpass', 'ladder', 'bandpass'] satisfies FilterKind[], seed), cutoff: 2200 + (seed % 8) * 420, resonance: 2.2 + (seed % 7) * 0.9, drive: 0.08 + (seed % 5) * 0.04, keyTracking: 0.28 + (seed % 5) * 0.06, envelopeAmount: 0.08 + (seed % 4) * 0.05 },
      ampEnv: { attack: 0.004 + (seed % 4) * 0.003, decay: 0.08 + (seed % 4) * 0.04, sustain: 0.58 + (seed % 5) * 0.06, release: 0.16 + (seed % 5) * 0.04 },
      filterEnv: { attack: 0.004, decay: 0.12 + (seed % 5) * 0.04, sustain: 0.32 + (seed % 5) * 0.06, release: 0.14 + (seed % 5) * 0.03 },
      ...modBlock(seed),
      effects: [fx(id, seed % 2 === 0 ? 'delay' : 'chorus', seed % 2 === 0 ? 0.18 : 0.14, seed % 2 === 0 ? { time: 0.18 + (seed % 5) * 0.04, feedback: 0.22 } : { time: 0.024, feedback: 0.1 })],
    });
  }

  if (category === 'Pad' || category === 'Strings' || category === 'Choir' || category === 'Ambient') {
    const isAmbient = category === 'Ambient';
    const isChoir = category === 'Choir';
    return engine({
      bpm: isAmbient ? 74 + (seed % 30) : 92 + (seed % 38),
      oscA: { waveform: pick(isChoir ? ['wavetable', 'triangle', 'sine'] : softWaves, seed), octave: isAmbient ? -1 : 0, fine: -drift, level: isAmbient ? 0.46 : 0.62 },
      oscB: { waveform: pick(['wavetable', 'sawtooth', 'triangle', 'sine'] satisfies SynthWaveform[], seed + 2), octave: 0, semitone: seed % 4 === 0 ? 12 : 7, fine: drift, level: isAmbient ? 0.34 : 0.48 },
      subOsc: { enabled: seed % 2 === 0, waveform: 'sine', octave: -1, level: isAmbient ? 0.12 : 0.08 },
      noise: { enabled: seed % 3 !== 0, kind: 'pink', level: isAmbient ? 0.08 + (seed % 5) * 0.03 : 0.03 + (seed % 4) * 0.02 },
      filter: { type: pick(['lowpass', 'bandpass', 'notch'] satisfies FilterKind[], seed), cutoff: isAmbient ? 900 + (seed % 8) * 220 : 1450 + (seed % 9) * 260, resonance: 0.8 + (seed % 6) * 0.7, drive: 0.02 + (seed % 4) * 0.02, keyTracking: 0.06 + (seed % 4) * 0.04, envelopeAmount: isChoir ? 0.02 : 0.04 + (seed % 5) * 0.02 },
      ampEnv: { attack: isAmbient ? 1.4 + (seed % 7) * 0.28 : 0.42 + (seed % 7) * 0.14, decay: 0.9 + (seed % 6) * 0.18, sustain: 0.66 + (seed % 4) * 0.05, release: isAmbient ? 2.4 + (seed % 6) * 0.28 : 1.1 + (seed % 6) * 0.18 },
      filterEnv: { attack: isAmbient ? 1.8 + (seed % 6) * 0.24 : 0.55 + (seed % 5) * 0.16, decay: 1.0 + (seed % 6) * 0.16, sustain: 0.42 + (seed % 5) * 0.05, release: isAmbient ? 1.8 + (seed % 5) * 0.22 : 0.8 + (seed % 5) * 0.16 },
      ...modBlock(seed),
      effects: [fx(id, 'chorus', isAmbient ? 0.18 : 0.24, { time: 0.028 + (seed % 4) * 0.003, feedback: 0.08 + (seed % 4) * 0.04 }), fx(id, 'reverb', isAmbient ? 0.46 : 0.34, { decay: isAmbient ? 3.4 : 2.4 })],
    });
  }

  if (category === 'Pluck' || category === 'Guitar' || category === 'Mallet' || category === 'Bell' || category === 'Piano' || category === 'E-Piano' || category === 'Keys') {
    const isBell = category === 'Bell' || category === 'Mallet';
    const isPiano = category === 'Piano' || category === 'E-Piano' || category === 'Keys';
    return engine({
      bpm: 94 + (seed % 52),
      oscA: { waveform: pick(isBell ? softWaves : ['triangle', 'pulse', 'square', 'sawtooth'] satisfies SynthWaveform[], seed), octave: isBell ? 1 : 0, fine: -drift, level: isPiano ? 0.56 : 0.62 },
      oscB: { waveform: pick(['sine', 'triangle', 'wavetable', 'pulse'] satisfies SynthWaveform[], seed + 3), octave: isBell ? 2 : seed % 4 === 0 ? 1 : 0, semitone: seed % 3 === 0 ? 12 : seed % 4 === 0 ? 7 : 0, fine: drift, level: isBell ? 0.34 : 0.4 },
      subOsc: { enabled: isPiano && seed % 4 === 0, waveform: 'sine', octave: -1, level: 0.06 },
      noise: { enabled: category === 'Guitar' && seed % 3 === 0, kind: 'pink', level: 0.035 },
      filter: { type: pick(['lowpass', 'highpass', 'bandpass'] satisfies FilterKind[], seed), cutoff: isBell ? 2100 + (seed % 8) * 420 : 1250 + (seed % 9) * 240, resonance: isBell ? 2 + (seed % 7) * 1.0 : 1.4 + (seed % 6) * 0.7, drive: category === 'Guitar' ? 0.05 + (seed % 5) * 0.04 : 0.01 + (seed % 4) * 0.02, keyTracking: 0.18 + (seed % 5) * 0.04, envelopeAmount: isBell ? 0.06 + (seed % 4) * 0.04 : 0.1 + (seed % 5) * 0.04 },
      ampEnv: { attack: isPiano ? 0.006 + (seed % 4) * 0.004 : 0.001 + (seed % 3) * 0.002, decay: isBell ? 0.72 + (seed % 8) * 0.12 : 0.18 + (seed % 6) * 0.06, sustain: isPiano ? 0.18 + (seed % 5) * 0.08 : 0.02 + (seed % 4) * 0.03, release: isBell ? 0.7 + (seed % 6) * 0.12 : 0.16 + (seed % 5) * 0.05 },
      filterEnv: { attack: 0.002, decay: isBell ? 0.5 + (seed % 6) * 0.08 : 0.18 + (seed % 5) * 0.05, sustain: 0.05 + (seed % 5) * 0.04, release: 0.12 + (seed % 5) * 0.04 },
      ...modBlock(seed),
      effects: isPiano ? [fx(id, 'chorus', 0.18, { time: 0.026, feedback: 0.12 })] : seed % 2 === 0 ? [fx(id, 'delay', 0.2, { time: 0.24, feedback: 0.24 })] : [],
    });
  }

  if (category === 'Organ' || category === 'Brass' || category === 'Woodwind') {
    const isBrass = category === 'Brass';
    return engine({
      bpm: 92 + (seed % 46),
      oscA: { waveform: pick(isBrass ? ['sawtooth', 'pulse', 'square'] : ['sine', 'triangle', 'square', 'pulse'] satisfies SynthWaveform[], seed), octave: 0, fine: -drift, level: 0.64 },
      oscB: { waveform: pick(isBrass ? ['sawtooth', 'pulse', 'triangle'] : ['triangle', 'pulse', 'wavetable'] satisfies SynthWaveform[], seed + 2), octave: seed % 4 === 0 ? 1 : 0, semitone: isBrass && seed % 3 === 0 ? 7 : 0, fine: drift, level: 0.46 },
      subOsc: { enabled: category === 'Organ' || seed % 5 === 0, waveform: 'sine', octave: -1, level: category === 'Organ' ? 0.16 : 0.08 },
      noise: { enabled: category === 'Woodwind' && seed % 2 === 0, kind: 'pink', level: 0.04 },
      filter: { type: pick(isBrass ? ['lowpass', 'ladder', 'bandpass'] : ['bandpass', 'lowpass', 'highpass'] satisfies FilterKind[], seed), cutoff: isBrass ? 1100 + (seed % 8) * 330 : 1450 + (seed % 8) * 260, resonance: isBrass ? 2.2 + (seed % 6) * 0.9 : 3 + (seed % 7) * 0.8, drive: isBrass ? 0.08 + (seed % 5) * 0.04 : 0.02 + (seed % 4) * 0.02, keyTracking: 0.18 + (seed % 5) * 0.05, envelopeAmount: isBrass ? 0.18 + (seed % 5) * 0.06 : 0.04 + (seed % 4) * 0.04 },
      ampEnv: { attack: isBrass ? 0.08 + (seed % 5) * 0.04 : 0.03 + (seed % 5) * 0.02, decay: 0.25 + (seed % 5) * 0.08, sustain: category === 'Organ' ? 0.9 : 0.58 + (seed % 5) * 0.06, release: 0.28 + (seed % 6) * 0.08 },
      filterEnv: { attack: isBrass ? 0.06 : 0.02, decay: 0.28 + (seed % 5) * 0.08, sustain: 0.28 + (seed % 5) * 0.06, release: 0.22 + (seed % 5) * 0.06 },
      ...modBlock(seed),
      effects: category === 'Organ' ? [fx(id, 'chorus', 0.22, { time: 0.03, feedback: 0.16 })] : [],
    });
  }

  if (category === 'Drum') {
    const noiseLevel = name.toLowerCase().includes('hat') || name.toLowerCase().includes('snare') ? 0.62 : 0.22;
    return engine({
      bpm: 112 + (seed % 50),
      oscA: { waveform: pick(['sine', 'triangle', 'square', 'pulse'] satisfies SynthWaveform[], seed), octave: name.toLowerCase().includes('kick') || name.toLowerCase().includes('boom') ? -2 : -1, fine: -drift, level: 0.5 },
      oscB: { waveform: pick(['sine', 'pulse', 'wavetable'] satisfies SynthWaveform[], seed + 4), octave: -1, semitone: seed % 4 === 0 ? 7 : 0, fine: drift, level: 0.24 },
      subOsc: { enabled: name.toLowerCase().includes('kick') || name.toLowerCase().includes('boom'), waveform: 'sine', octave: -2, level: 0.38 },
      noise: { enabled: true, kind: seed % 2 === 0 ? 'white' : 'pink', level: noiseLevel },
      filter: { type: pick(['lowpass', 'highpass', 'bandpass'] satisfies FilterKind[], seed), cutoff: 520 + (seed % 12) * 420, resonance: 1.2 + (seed % 8) * 0.8, drive: 0.18 + (seed % 7) * 0.06, keyTracking: 0.02, envelopeAmount: seed % 2 === 0 ? 0.24 : -0.14 },
      ampEnv: { attack: 0.001, decay: 0.08 + (seed % 8) * 0.05, sustain: 0.01, release: 0.04 + (seed % 5) * 0.04 },
      filterEnv: { attack: 0.001, decay: 0.06 + (seed % 7) * 0.04, sustain: 0.02, release: 0.04 + (seed % 4) * 0.03 },
      vectorMixer: { x: 0.28 + (seed % 6) * 0.08, y: 0.08 + (seed % 5) * 0.06 },
      effects: seed % 3 === 0 ? [fx(id, 'distortion', 0.2, { drive: 0.32 })] : [],
    });
  }

  if (category === 'Sequence') {
    return engine({
      bpm: 104 + (seed % 58),
      oscA: { waveform: pick(brightWaves, seed), octave: seed % 4 === 0 ? -1 : 0, fine: -drift, level: 0.58 },
      oscB: { waveform: pick(['pulse', 'wavetable', 'square'] satisfies SynthWaveform[], seed + 1), octave: 0, semitone: pick([0, 3, 5, 7, 12], seed), fine: drift, level: 0.42 },
      subOsc: { enabled: seed % 2 === 0, waveform: 'square', octave: -1, level: 0.12 },
      filter: { type: pick(filterSweep, seed), cutoff: 780 + (seed % 10) * 260, resonance: 3 + (seed % 8) * 1.0, drive: 0.06 + (seed % 5) * 0.04, keyTracking: 0.14 + (seed % 4) * 0.04, envelopeAmount: 0.16 + (seed % 6) * 0.06 },
      ampEnv: { attack: 0.001, decay: 0.12 + (seed % 6) * 0.04, sustain: 0.08 + (seed % 5) * 0.04, release: 0.08 + (seed % 4) * 0.03 },
      filterEnv: { attack: 0.001, decay: 0.16 + (seed % 5) * 0.05, sustain: 0.06 + (seed % 5) * 0.04, release: 0.06 + (seed % 4) * 0.03 },
      lfo1: { waveform: pick(['square', 'sawtooth', 'triangle'] satisfies SynthWaveform[], seed), rate: 2 + (seed % 8), depth: 0.16 + (seed % 5) * 0.04, target: pick(['filterCutoff', 'wavePosition', 'ampLevel'] satisfies LfoTarget[], seed), sync: 'tempo', syncValue: pick(['1/8', '1/16', '1/4', '1/2'] as const, seed) },
      waveSequencer: { enabled: true, tempoSync: true },
      vectorMixer: { x: 0.36 + (seed % 7) * 0.06, y: 0.02 + (seed % 5) * 0.05 },
      effects: [fx(id, 'delay', 0.22, { time: 0.16 + (seed % 6) * 0.04, feedback: 0.24 + (seed % 4) * 0.04 })],
    });
  }

  return engine({
    bpm: 80 + (seed % 74),
    oscA: { waveform: pick(['wavetable', 'pulse', 'sawtooth', 'triangle'] satisfies SynthWaveform[], seed), octave: seed % 3 === 0 ? 1 : 0, fine: -18 + (seed % 13) * 3, level: 0.42 + (seed % 5) * 0.04 },
    oscB: { waveform: pick(['pulse', 'square', 'sine', 'wavetable'] satisfies SynthWaveform[], seed + 4), octave: seed % 2 === 0 ? 1 : 0, semitone: pick([-11, -7, 0, 4, 7, 11], seed), fine: 18 - (seed % 13) * 3, level: 0.34 + (seed % 4) * 0.05 },
    noise: { enabled: true, kind: seed % 2 === 0 ? 'white' : 'pink', level: category === 'FX' ? 0.28 + (seed % 5) * 0.08 : 0.1 + (seed % 5) * 0.04 },
    filter: { type: pick(filterSweep, seed), cutoff: 720 + (seed % 14) * 310, resonance: 5 + (seed % 11) * 1.1, drive: 0.06 + (seed % 8) * 0.05, keyTracking: 0.02 + (seed % 5) * 0.03, envelopeAmount: seed % 2 === 0 ? 0.28 : -0.16 },
    ampEnv: { attack: category === 'FX' ? 0.04 + (seed % 7) * 0.18 : 0.006 + (seed % 6) * 0.01, decay: 0.22 + (seed % 8) * 0.08, sustain: category === 'FX' ? 0.18 + (seed % 5) * 0.08 : 0.08 + (seed % 5) * 0.04, release: category === 'FX' ? 0.6 + (seed % 8) * 0.18 : 0.16 + (seed % 6) * 0.06 },
    filterEnv: { attack: 0.01 + (seed % 5) * 0.02, decay: 0.18 + (seed % 7) * 0.06, sustain: 0.04 + (seed % 6) * 0.04, release: 0.12 + (seed % 7) * 0.05 },
    ...modBlock(seed),
    effects: [fx(id, category === 'FX' ? 'reverb' : 'bitcrusher', category === 'FX' ? 0.32 : 0.24, category === 'FX' ? { decay: 2.6 } : { drive: 0.42 })],
  });
}

function preset(name: string, category: PresetCategory, index: number): SynthPreset {
  return {
    id: `expanded-${slug(name)}`,
    name,
    category,
    author: 'Factory',
    createdAt,
    engine: makeEngine(category, name, index),
  };
}

export const expandedFactoryPresets: SynthPreset[] = expansionGroups.flatMap((group, groupIndex) =>
  group.names.map((name, presetIndex) => preset(name, group.category, groupIndex * 10 + presetIndex)),
);
