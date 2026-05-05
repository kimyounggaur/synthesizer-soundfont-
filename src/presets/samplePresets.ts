export interface AvailableSampleBank {
  id: string;
  name: string;
  description: string;
  license: string;
}

export const availableSampleBanks: AvailableSampleBank[] = [
  {
    id: 'demo-lite',
    name: 'Demo Lite',
    description: 'Small generated/fallback sample bank for testing.',
    license: 'Generated demo only',
  },
  {
    id: 'gen-keys',
    name: 'Generated Keys',
    description: 'Generated piano, electric piano, organ, and bell sample bank.',
    license: 'Generated demo only',
  },
  {
    id: 'gen-orchestral',
    name: 'Generated Orchestral',
    description: 'Generated strings, choir, brass, and woodwind sample bank.',
    license: 'Generated demo only',
  },
  {
    id: 'gen-bass-guitar',
    name: 'Generated Bass & Guitar',
    description: 'Generated bass and guitar sample-style tones.',
    license: 'Generated demo only',
  },
  {
    id: 'gen-pluck-bell',
    name: 'Generated Plucks & Bells',
    description: 'Generated mallet, bell, and plucked sample colors.',
    license: 'Generated demo only',
  },
  {
    id: 'gen-drums-fx',
    name: 'Generated Drums & FX',
    description: 'Generated drum hit and sound effect sample bank.',
    license: 'Generated demo only',
  },
  {
    id: 'gen-ambient',
    name: 'Generated Ambient',
    description: 'Generated sustained texture and atmosphere sample bank.',
    license: 'Generated demo only',
  },
  {
    id: 'gen-sequence',
    name: 'Generated Sequence',
    description: 'Generated rhythmic starter sounds for hybrid sequence programs.',
    license: 'Generated demo only',
  },
  {
    id: 'gen-experimental',
    name: 'Generated Experimental',
    description: 'Generated experimental soundfont bank for unusual textures.',
    license: 'Generated demo only',
  },
];
