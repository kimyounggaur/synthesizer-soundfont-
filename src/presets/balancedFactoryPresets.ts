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

const createdAt = '2026-05-05T08:45:00.000Z';

const balancedGroups = [
  { category: 'Bass', names: ['Obsidian Mono Bass', 'Soft Ladder Bass', 'PWM Pocket Bass', 'Deep House Sub', 'Acid Rubber Line', 'Cinema Low Pulse', 'Liquid Reese Bass', 'Square Root Bass'] },
  { category: 'Lead', names: ['Laser Brass Lead', 'Mono Ribbon Saw', 'Arcade Sync Lead', 'Velvet Square Solo', 'Neon Portamento', 'Crystal Fifth Lead', 'PWM Hero Lead', 'Thin Circuit Lead'] },
  { category: 'Pad', names: ['Solaris Pad', 'Warm VHS Pad', 'Blue Vector Pad', 'Silk Motion Pad', 'Slow Glass Pad', 'Wide Analog Wash', 'Nocturne Pad', 'Cloudform Pad'] },
  { category: 'Pluck', names: ['Clockwork Pluck', 'Soft Nylon Pluck', 'Digital Koto Pop', 'Palm Synth Pluck', 'Glass Pin Pluck', 'Rubber Marimba Pluck', 'Tiny Echo Pluck', 'Mute Wire Pluck'] },
  { category: 'Keys', names: ['Modern Poly Keys', 'Warm House Chords', 'Clean Digital Keys', 'Soft PWM Comp', 'Lo-Fi Tape Keys', 'Glass Layer Keys', 'Compact Fusion Keys', 'Dream Stack Keys'] },
  { category: 'Piano', names: ['Analog Grand Layer', 'Soft Loft Piano', 'Bright Sine Piano', 'Dream Upright Synth', 'Paper Piano Pad', 'Mono Felt Tone', 'Cinematic Piano Wash', 'Bell Grand Hybrid'] },
  { category: 'E-Piano', names: ['Velvet Tine EP', 'Bright FM Suitcase', 'Warm Reed Tremolo', 'Dyno Chorus EP', 'Soft Bell Road', 'Mellow Stage EP', 'Glass Reed EP', 'Late Night Tines'] },
  { category: 'Organ', names: ['Smooth Drawbar Organ', 'Click Tonewheel Organ', 'Rotary Pulse Organ', 'Warm Chapel Organ', 'Transistor House Organ', 'Jazz Soft Organ', 'Glass Pipe Stack', 'Overtone Combo Organ'] },
  { category: 'Strings', names: ['Solina Air Strings', 'Dark Chamber Strings', 'Bright Tape Strings', 'Soft Bow Ensemble', 'Octave String Bed', 'Motion String Cloud', 'Classic String Machine', 'Hybrid Film Strings'] },
  { category: 'Choir', names: ['Dream Ahh Choir', 'Wide Ooh Voices', 'Glass Formant Pad', 'Soft Human Stack', 'Cathedral Vox Layer', 'Digital Choir Mist', 'Satellite Ahh Pad', 'Warm Voice Cloud'] },
  { category: 'Brass', names: ['Big Analog Brass', 'Soft Horn Ensemble', 'Bright Brass Stab', 'PWM Trumpet Stack', 'Velvet Poly Brass', 'Motion Brass Pad', 'Fifth Brass Lead', 'Warm Synth Horns'] },
  { category: 'Woodwind', names: ['Breathy Flute Lead', 'Soft Reed Synth', 'Glass Clarinet Pad', 'Bamboo Pipe Voice', 'Warm Oboe Pulse', 'Air Panpipe Layer', 'Hollow Wind Lead', 'Wood Flute Stack'] },
  { category: 'Guitar', names: ['Clean Chorus Guitar', 'Muted Pulse Guitar', 'Nylon Synth Guitar', 'Steel String Layer', 'Tremolo Dream Guitar', 'Harmonic Air Guitar', 'Overdrive Pick Synth', 'Resonant Bar Guitar'] },
  { category: 'Bell', names: ['Frosted Bell Tree', 'Glass Tower Bell', 'Soft Church Chime', 'Moon Music Box', 'Silver Clock Bell', 'Digital Ice Chime', 'Warm EP Bell', 'Hollow Temple Bell'] },
  { category: 'Mallet', names: ['Soft Marimba Synth', 'Rubber Vibe Keys', 'Wood Kalimba Stack', 'Bright Xylo Pop', 'Velvet Mallet Pad', 'Glass Mbira Tone', 'Toy Celeste Mallet', 'Deep Resonant Vibes'] },
  { category: 'Drum', names: ['Punch Kick Synth', 'Dust Snare Snap', 'Electro Low Tom', 'Closed Noise Hat', 'Analog Rim Click', 'Metal Perc Tick', 'FM Kick Knock', 'Sub Boom Drum'] },
  { category: 'Sequence', names: ['Vector Pulse Grid', 'Night Drive Arp', 'Metro Bass Steps', 'Glass Clock Seq', 'Cyan Motion Run', 'Rubber Ratchet Seq', 'Minor Neon Pattern', 'Wide Orbit Seq'] },
  { category: 'Ambient', names: ['Northern Drone', 'Dust Light Texture', 'Ocean Fog Bed', 'Deep Space Choir', 'Slow Radio Halo', 'Frozen Tape Loop', 'Warm Static Horizon', 'Cathedral Signal'] },
  { category: 'FX', names: ['Analog Riser Sweep', 'Deep Impact Drop', 'Laser Door Open', 'Digital Static Burst', 'Reverse Metal Hit', 'Air Pressure Vent', 'Robot Servo Sweep', 'Subquake Trailer FX'] },
  { category: 'Experimental', names: ['Fractal Wire Tone', 'Broken Tape Lab', 'Magnetic Choir Error', 'Random Phase Alloy', 'Granular Toy Engine', 'Circuit Drift Organ', 'Folded Glass Noise', 'Unstable Data Pad'] },
] satisfies Array<{ category: PresetCategory; names: string[] }>;

const brightWaves: SynthWaveform[] = ['sawtooth', 'pulse', 'square', 'wavetable'];
const softWaves: SynthWaveform[] = ['sine', 'triangle', 'wavetable', 'pulse'];
const filters: FilterKind[] = ['lowpass', 'ladder', 'bandpass', 'notch', 'highpass'];
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

function fx(id: string, type: EffectType, wet: number, params: Record<string, number> = {}): EffectState {
  return {
    id: `balanced-fx-${id}-${type}`,
    type,
    enabled: true,
    wet,
    params,
  };
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
    partMixer: { ...defaults.partMixer, ...overrides.partMixer, parts: overrides.partMixer?.parts ?? defaults.partMixer.parts },
    sampleLayer: { ...defaults.sampleLayer, ...overrides.sampleLayer },
    effects: overrides.effects ?? defaults.effects,
  };
}

function modulation(seed: number): Pick<EngineOverrides, 'lfo1' | 'lfo2' | 'vectorMixer'> {
  return {
    lfo1: {
      waveform: pick(['sine', 'triangle', 'square', 'sawtooth'] satisfies SynthWaveform[], seed),
      rate: 0.08 + (seed % 9) * 0.21,
      depth: clamp(0.06 + (seed % 7) * 0.055, 0.06, 0.5),
      target: pick(lfoTargets, seed),
      sync: seed % 3 === 0 ? 'tempo' : 'free',
      syncValue: pick(['1/1', '1/2', '1/4', '1/8', '1/16'] as const, seed),
    },
    lfo2: {
      waveform: pick(['sine', 'triangle', 'pulse', 'wavetable'] satisfies SynthWaveform[], seed + 3),
      rate: 0.1 + (seed % 8) * 0.13,
      depth: clamp(0.04 + (seed % 6) * 0.045, 0.04, 0.36),
      target: pick(lfoTargets, seed + 2),
      sync: seed % 4 === 0 ? 'tempo' : 'free',
      syncValue: pick(['1/2', '1/4', '1/8', '1/16', '1/32'] as const, seed),
    },
    vectorMixer: {
      x: clamp(0.16 + (seed % 9) * 0.08, 0.08, 0.88),
      y: clamp(0.04 + (seed % 7) * 0.09, 0, 0.74),
    },
  };
}

function isSlowCategory(category: PresetCategory): boolean {
  return ['Pad', 'Strings', 'Choir', 'Ambient'].includes(category);
}

function isPercussiveCategory(category: PresetCategory): boolean {
  return ['Pluck', 'Bell', 'Mallet', 'Piano', 'E-Piano', 'Keys', 'Guitar'].includes(category);
}

function isEnsembleCategory(category: PresetCategory): boolean {
  return ['Organ', 'Brass', 'Woodwind'].includes(category);
}

function makeEngine(category: PresetCategory, name: string, index: number): SynthEngineState {
  const seed = index + 11;
  const id = slug(name);
  const drift = ((seed % 9) - 4) * 2;

  if (category === 'Bass') {
    return engine({
      bpm: 84 + (seed % 58),
      oscA: { waveform: pick(['sawtooth', 'pulse', 'square'] satisfies SynthWaveform[], seed), octave: -1, fine: -Math.abs(drift), level: 0.8 },
      oscB: { waveform: pick(['square', 'sawtooth', 'triangle'] satisfies SynthWaveform[], seed + 2), octave: -1, fine: Math.abs(drift) + 2, level: 0.44 },
      subOsc: { enabled: true, waveform: pick(['sine', 'square', 'triangle'] satisfies SynthWaveform[], seed), octave: -2, level: 0.3 + (seed % 5) * 0.045 },
      filter: { type: pick(['lowpass', 'ladder'] satisfies FilterKind[], seed), cutoff: 380 + (seed % 10) * 125, resonance: 2.2 + (seed % 8) * 1.15, drive: 0.16 + (seed % 6) * 0.045, keyTracking: 0.1 + (seed % 4) * 0.05, envelopeAmount: 0.2 + (seed % 5) * 0.08 },
      ampEnv: { attack: 0.002 + (seed % 4) * 0.002, decay: 0.12 + (seed % 5) * 0.04, sustain: 0.48 + (seed % 5) * 0.08, release: 0.08 + (seed % 4) * 0.04 },
      filterEnv: { attack: 0.002, decay: 0.18 + (seed % 5) * 0.04, sustain: 0.1 + (seed % 4) * 0.06, release: 0.08 + (seed % 4) * 0.03 },
      vectorMixer: { x: 0.22 + (seed % 6) * 0.08, y: 0.05 + (seed % 4) * 0.04 },
      effects: seed % 3 === 0 ? [fx(id, 'compressor', 0.56, { threshold: -24, ratio: 5 })] : [],
    });
  }

  if (category === 'Lead') {
    return engine({
      bpm: 106 + (seed % 48),
      oscA: { waveform: pick(brightWaves, seed), octave: seed % 5 === 0 ? 1 : 0, fine: -drift, level: 0.74 },
      oscB: { waveform: pick(['sawtooth', 'pulse', 'wavetable'] satisfies SynthWaveform[], seed + 1), octave: 0, semitone: seed % 3 === 0 ? 7 : 0, fine: drift + 3, level: 0.48 + (seed % 5) * 0.05 },
      subOsc: { enabled: seed % 4 === 0, waveform: 'triangle', octave: -1, level: 0.08 + (seed % 3) * 0.03 },
      filter: { type: pick(['lowpass', 'ladder', 'bandpass'] satisfies FilterKind[], seed), cutoff: 2200 + (seed % 8) * 430, resonance: 2.2 + (seed % 7) * 0.9, drive: 0.08 + (seed % 5) * 0.04, keyTracking: 0.28 + (seed % 5) * 0.06, envelopeAmount: 0.08 + (seed % 4) * 0.05 },
      ampEnv: { attack: 0.004 + (seed % 4) * 0.003, decay: 0.08 + (seed % 4) * 0.04, sustain: 0.58 + (seed % 5) * 0.06, release: 0.16 + (seed % 5) * 0.04 },
      filterEnv: { attack: 0.004, decay: 0.12 + (seed % 5) * 0.04, sustain: 0.32 + (seed % 5) * 0.06, release: 0.14 + (seed % 5) * 0.03 },
      ...modulation(seed),
      effects: [fx(id, seed % 2 === 0 ? 'delay' : 'chorus', seed % 2 === 0 ? 0.18 : 0.14, seed % 2 === 0 ? { time: 0.18 + (seed % 5) * 0.04, feedback: 0.22 } : { time: 0.024, feedback: 0.1 })],
    });
  }

  if (isSlowCategory(category)) {
    const ambient = category === 'Ambient';
    return engine({
      bpm: ambient ? 72 + (seed % 34) : 92 + (seed % 42),
      oscA: { waveform: pick(softWaves, seed), octave: ambient ? -1 : 0, fine: -drift, level: ambient ? 0.44 : 0.62 },
      oscB: { waveform: pick(['wavetable', 'sawtooth', 'triangle', 'sine'] satisfies SynthWaveform[], seed + 2), octave: 0, semitone: seed % 4 === 0 ? 12 : 7, fine: drift, level: ambient ? 0.34 : 0.48 },
      subOsc: { enabled: seed % 2 === 0, waveform: 'sine', octave: -1, level: ambient ? 0.12 : 0.08 },
      noise: { enabled: seed % 3 !== 0, kind: 'pink', level: ambient ? 0.08 + (seed % 5) * 0.03 : 0.03 + (seed % 4) * 0.02 },
      filter: { type: pick(['lowpass', 'bandpass', 'notch'] satisfies FilterKind[], seed), cutoff: ambient ? 860 + (seed % 8) * 230 : 1450 + (seed % 9) * 260, resonance: 0.8 + (seed % 6) * 0.7, drive: 0.02 + (seed % 4) * 0.02, keyTracking: 0.06 + (seed % 4) * 0.04, envelopeAmount: category === 'Choir' ? 0.02 : 0.04 + (seed % 5) * 0.02 },
      ampEnv: { attack: ambient ? 1.4 + (seed % 7) * 0.28 : 0.42 + (seed % 7) * 0.14, decay: 0.9 + (seed % 6) * 0.18, sustain: 0.66 + (seed % 4) * 0.05, release: ambient ? 2.4 + (seed % 6) * 0.28 : 1.1 + (seed % 6) * 0.18 },
      filterEnv: { attack: ambient ? 1.8 + (seed % 6) * 0.24 : 0.55 + (seed % 5) * 0.16, decay: 1.0 + (seed % 6) * 0.16, sustain: 0.42 + (seed % 5) * 0.05, release: ambient ? 1.8 + (seed % 5) * 0.22 : 0.8 + (seed % 5) * 0.16 },
      ...modulation(seed),
      effects: [fx(id, 'chorus', ambient ? 0.18 : 0.24, { time: 0.028 + (seed % 4) * 0.003, feedback: 0.08 + (seed % 4) * 0.04 }), fx(id, 'reverb', ambient ? 0.46 : 0.34, { decay: ambient ? 3.4 : 2.4 })],
    });
  }

  if (isPercussiveCategory(category)) {
    const bellLike = category === 'Bell' || category === 'Mallet';
    const keyLike = category === 'Piano' || category === 'E-Piano' || category === 'Keys';
    return engine({
      bpm: 94 + (seed % 54),
      oscA: { waveform: pick(bellLike ? softWaves : ['triangle', 'pulse', 'square', 'sawtooth'] satisfies SynthWaveform[], seed), octave: bellLike ? 1 : 0, fine: -drift, level: keyLike ? 0.56 : 0.62 },
      oscB: { waveform: pick(['sine', 'triangle', 'wavetable', 'pulse'] satisfies SynthWaveform[], seed + 3), octave: bellLike ? 2 : seed % 4 === 0 ? 1 : 0, semitone: seed % 3 === 0 ? 12 : seed % 4 === 0 ? 7 : 0, fine: drift, level: bellLike ? 0.34 : 0.4 },
      subOsc: { enabled: keyLike && seed % 4 === 0, waveform: 'sine', octave: -1, level: 0.06 },
      noise: { enabled: category === 'Guitar' && seed % 3 === 0, kind: 'pink', level: 0.035 },
      filter: { type: pick(['lowpass', 'highpass', 'bandpass'] satisfies FilterKind[], seed), cutoff: bellLike ? 2100 + (seed % 8) * 420 : 1250 + (seed % 9) * 240, resonance: bellLike ? 2 + (seed % 7) * 1.0 : 1.4 + (seed % 6) * 0.7, drive: category === 'Guitar' ? 0.05 + (seed % 5) * 0.04 : 0.01 + (seed % 4) * 0.02, keyTracking: 0.18 + (seed % 5) * 0.04, envelopeAmount: bellLike ? 0.06 + (seed % 4) * 0.04 : 0.1 + (seed % 5) * 0.04 },
      ampEnv: { attack: keyLike ? 0.006 + (seed % 4) * 0.004 : 0.001 + (seed % 3) * 0.002, decay: bellLike ? 0.72 + (seed % 8) * 0.12 : 0.18 + (seed % 6) * 0.06, sustain: keyLike ? 0.18 + (seed % 5) * 0.08 : 0.02 + (seed % 4) * 0.03, release: bellLike ? 0.7 + (seed % 6) * 0.12 : 0.16 + (seed % 5) * 0.05 },
      filterEnv: { attack: 0.002, decay: bellLike ? 0.5 + (seed % 6) * 0.08 : 0.18 + (seed % 5) * 0.05, sustain: 0.05 + (seed % 5) * 0.04, release: 0.12 + (seed % 5) * 0.04 },
      ...modulation(seed),
      effects: keyLike ? [fx(id, 'chorus', 0.18, { time: 0.026, feedback: 0.12 })] : seed % 2 === 0 ? [fx(id, 'delay', 0.2, { time: 0.24, feedback: 0.24 })] : [],
    });
  }

  if (isEnsembleCategory(category)) {
    const brass = category === 'Brass';
    return engine({
      bpm: 92 + (seed % 48),
      oscA: { waveform: pick(brass ? ['sawtooth', 'pulse', 'square'] : ['sine', 'triangle', 'square', 'pulse'] satisfies SynthWaveform[], seed), octave: 0, fine: -drift, level: 0.64 },
      oscB: { waveform: pick(brass ? ['sawtooth', 'pulse', 'triangle'] : ['triangle', 'pulse', 'wavetable'] satisfies SynthWaveform[], seed + 2), octave: seed % 4 === 0 ? 1 : 0, semitone: brass && seed % 3 === 0 ? 7 : 0, fine: drift, level: 0.46 },
      subOsc: { enabled: category === 'Organ' || seed % 5 === 0, waveform: 'sine', octave: -1, level: category === 'Organ' ? 0.16 : 0.08 },
      noise: { enabled: category === 'Woodwind' && seed % 2 === 0, kind: 'pink', level: 0.04 },
      filter: { type: pick(brass ? ['lowpass', 'ladder', 'bandpass'] : ['bandpass', 'lowpass', 'highpass'] satisfies FilterKind[], seed), cutoff: brass ? 1100 + (seed % 8) * 330 : 1450 + (seed % 8) * 260, resonance: brass ? 2.2 + (seed % 6) * 0.9 : 3 + (seed % 7) * 0.8, drive: brass ? 0.08 + (seed % 5) * 0.04 : 0.02 + (seed % 4) * 0.02, keyTracking: 0.18 + (seed % 5) * 0.05, envelopeAmount: brass ? 0.18 + (seed % 5) * 0.06 : 0.04 + (seed % 4) * 0.04 },
      ampEnv: { attack: brass ? 0.08 + (seed % 5) * 0.04 : 0.03 + (seed % 5) * 0.02, decay: 0.25 + (seed % 5) * 0.08, sustain: category === 'Organ' ? 0.9 : 0.58 + (seed % 5) * 0.06, release: 0.28 + (seed % 6) * 0.08 },
      filterEnv: { attack: brass ? 0.06 : 0.02, decay: 0.28 + (seed % 5) * 0.08, sustain: 0.28 + (seed % 5) * 0.06, release: 0.22 + (seed % 5) * 0.06 },
      ...modulation(seed),
      effects: category === 'Organ' ? [fx(id, 'chorus', 0.22, { time: 0.03, feedback: 0.16 })] : [],
    });
  }

  if (category === 'Drum') {
    const kickLike = name.toLowerCase().includes('kick') || name.toLowerCase().includes('boom');
    return engine({
      bpm: 112 + (seed % 52),
      oscA: { waveform: pick(['sine', 'triangle', 'square', 'pulse'] satisfies SynthWaveform[], seed), octave: kickLike ? -2 : -1, fine: -drift, level: 0.5 },
      oscB: { waveform: pick(['sine', 'pulse', 'wavetable'] satisfies SynthWaveform[], seed + 4), octave: -1, semitone: seed % 4 === 0 ? 7 : 0, fine: drift, level: 0.24 },
      subOsc: { enabled: kickLike, waveform: 'sine', octave: -2, level: 0.38 },
      noise: { enabled: true, kind: seed % 2 === 0 ? 'white' : 'pink', level: kickLike ? 0.22 : 0.58 },
      filter: { type: pick(['lowpass', 'highpass', 'bandpass'] satisfies FilterKind[], seed), cutoff: 520 + (seed % 12) * 420, resonance: 1.2 + (seed % 8) * 0.8, drive: 0.18 + (seed % 7) * 0.06, keyTracking: 0.02, envelopeAmount: seed % 2 === 0 ? 0.24 : -0.14 },
      ampEnv: { attack: 0.001, decay: 0.08 + (seed % 8) * 0.05, sustain: 0.01, release: 0.04 + (seed % 5) * 0.04 },
      filterEnv: { attack: 0.001, decay: 0.06 + (seed % 7) * 0.04, sustain: 0.02, release: 0.04 + (seed % 4) * 0.03 },
      vectorMixer: { x: 0.28 + (seed % 6) * 0.08, y: 0.08 + (seed % 5) * 0.06 },
      effects: seed % 3 === 0 ? [fx(id, 'distortion', 0.2, { drive: 0.32 })] : [],
    });
  }

  if (category === 'Sequence') {
    return engine({
      bpm: 104 + (seed % 60),
      oscA: { waveform: pick(brightWaves, seed), octave: seed % 4 === 0 ? -1 : 0, fine: -drift, level: 0.58 },
      oscB: { waveform: pick(['pulse', 'wavetable', 'square'] satisfies SynthWaveform[], seed + 1), octave: 0, semitone: pick([0, 3, 5, 7, 12], seed), fine: drift, level: 0.42 },
      subOsc: { enabled: seed % 2 === 0, waveform: 'square', octave: -1, level: 0.12 },
      filter: { type: pick(filters, seed), cutoff: 780 + (seed % 10) * 260, resonance: 3 + (seed % 8) * 1.0, drive: 0.06 + (seed % 5) * 0.04, keyTracking: 0.14 + (seed % 4) * 0.04, envelopeAmount: 0.16 + (seed % 6) * 0.06 },
      ampEnv: { attack: 0.001, decay: 0.12 + (seed % 6) * 0.04, sustain: 0.08 + (seed % 5) * 0.04, release: 0.08 + (seed % 4) * 0.03 },
      filterEnv: { attack: 0.001, decay: 0.16 + (seed % 5) * 0.05, sustain: 0.06 + (seed % 5) * 0.04, release: 0.06 + (seed % 4) * 0.03 },
      lfo1: { waveform: pick(['square', 'sawtooth', 'triangle'] satisfies SynthWaveform[], seed), rate: 2 + (seed % 8), depth: 0.16 + (seed % 5) * 0.04, target: pick(['filterCutoff', 'wavePosition', 'ampLevel'] satisfies LfoTarget[], seed), sync: 'tempo', syncValue: pick(['1/8', '1/16', '1/4', '1/2'] as const, seed) },
      waveSequencer: { enabled: true, tempoSync: true },
      vectorMixer: { x: 0.36 + (seed % 7) * 0.06, y: 0.02 + (seed % 5) * 0.05 },
      effects: [fx(id, 'delay', 0.22, { time: 0.16 + (seed % 6) * 0.04, feedback: 0.24 + (seed % 4) * 0.04 })],
    });
  }

  return engine({
    bpm: 80 + (seed % 76),
    oscA: { waveform: pick(['wavetable', 'pulse', 'sawtooth', 'triangle'] satisfies SynthWaveform[], seed), octave: seed % 3 === 0 ? 1 : 0, fine: -18 + (seed % 13) * 3, level: 0.42 + (seed % 5) * 0.04 },
    oscB: { waveform: pick(['pulse', 'square', 'sine', 'wavetable'] satisfies SynthWaveform[], seed + 4), octave: seed % 2 === 0 ? 1 : 0, semitone: pick([-11, -7, 0, 4, 7, 11], seed), fine: 18 - (seed % 13) * 3, level: 0.34 + (seed % 4) * 0.05 },
    noise: { enabled: true, kind: seed % 2 === 0 ? 'white' : 'pink', level: category === 'FX' ? 0.28 + (seed % 5) * 0.08 : 0.1 + (seed % 5) * 0.04 },
    filter: { type: pick(filters, seed), cutoff: 720 + (seed % 14) * 310, resonance: 5 + (seed % 11) * 1.1, drive: 0.06 + (seed % 8) * 0.05, keyTracking: 0.02 + (seed % 5) * 0.03, envelopeAmount: seed % 2 === 0 ? 0.28 : -0.16 },
    ampEnv: { attack: category === 'FX' ? 0.04 + (seed % 7) * 0.18 : 0.006 + (seed % 6) * 0.01, decay: 0.22 + (seed % 8) * 0.08, sustain: category === 'FX' ? 0.18 + (seed % 5) * 0.08 : 0.08 + (seed % 5) * 0.04, release: category === 'FX' ? 0.6 + (seed % 8) * 0.18 : 0.16 + (seed % 6) * 0.06 },
    filterEnv: { attack: 0.01 + (seed % 5) * 0.02, decay: 0.18 + (seed % 7) * 0.06, sustain: 0.04 + (seed % 6) * 0.04, release: 0.12 + (seed % 7) * 0.05 },
    ...modulation(seed),
    effects: [fx(id, category === 'FX' ? 'reverb' : 'bitcrusher', category === 'FX' ? 0.32 : 0.24, category === 'FX' ? { decay: 2.6 } : { drive: 0.42 })],
  });
}

function preset(name: string, category: PresetCategory, index: number): SynthPreset {
  return {
    id: `balanced-${slug(name)}`,
    name,
    category,
    author: 'Factory',
    createdAt,
    engine: makeEngine(category, name, index),
  };
}

export const balancedFactoryPresets: SynthPreset[] = balancedGroups.flatMap((group, groupIndex) =>
  group.names.map((name, presetIndex) => preset(name, group.category, groupIndex * 8 + presetIndex)),
);
