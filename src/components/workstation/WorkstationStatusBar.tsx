import { sampleBankManager } from '../../samples/sampleBankLibrary';
import { useSynthStore } from '../../store/synthStore';
import { useUiStore } from '../../store/uiStore';
import type { MeterSnapshot } from '../../types/synth';
import { workstationPages } from './WorkstationShell';

function meterState(meter: MeterSnapshot): string {
  if (meter.clipping) {
    return 'CLIP';
  }
  if (meter.peak > 0.006) {
    return 'SIGNAL';
  }
  return meter.audioState === 'suspended' ? 'SLEEP' : 'READY';
}

export function WorkstationStatusBar({ meter }: { meter: MeterSnapshot }) {
  const activePage = useUiStore((state) => state.activePage);
  const activePageDefinition = workstationPages.find((page) => page.id === activePage) ?? workstationPages[0];
  const engineMode = useSynthStore((state) => state.engineMode);
  const sampleLayer = useSynthStore((state) => state.sampleLayer);
  const samplePreset = sampleBankManager.getPreset(sampleLayer.bankId, sampleLayer.presetId);

  return (
    <footer className="workstation-status-bar">
      <span>{activePageDefinition.label}</span>
      <span>{engineMode.toUpperCase()}</span>
      <span>{samplePreset?.name ?? 'No sample program'}</span>
      <span>{meter.activeVoices} voices</span>
      <span className={meter.clipping ? 'is-hot' : ''}>{meterState(meter)}</span>
    </footer>
  );
}
