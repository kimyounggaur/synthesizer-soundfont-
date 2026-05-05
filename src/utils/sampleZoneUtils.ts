import type { SampleLayerState, SampleZone } from '../types/soundfont';

export function mergeSampleZoneOverride(zone: SampleZone, sampleLayer: SampleLayerState): SampleZone {
  const override = sampleLayer.zoneOverrides?.[zone.id];
  if (!override) {
    return zone;
  }

  return {
    ...zone,
    rootNote: override.rootNote ?? zone.rootNote,
    lowNote: override.lowNote ?? zone.lowNote,
    highNote: override.highNote ?? zone.highNote,
    lowVelocity: override.lowVelocity ?? zone.lowVelocity,
    highVelocity: override.highVelocity ?? zone.highVelocity,
    loop: override.loop ?? zone.loop,
    loopStart: override.loopStart ?? zone.loopStart,
    loopEnd: override.loopEnd ?? zone.loopEnd,
    gain: override.gain ?? zone.gain,
    pan: override.pan ?? zone.pan,
  };
}

export function isNoteInSampleZone(note: number, zone: SampleZone): boolean {
  return note >= zone.lowNote && note <= zone.highNote;
}
