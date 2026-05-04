import type { MeterSnapshot } from '../../types/synth';
import { WorkstationStatusBar } from './WorkstationStatusBar';
import { WorkstationTabs } from './WorkstationTabs';
import { useWorkstationNavigation } from './WorkstationShell';
import { EffectsPage } from './pages/EffectsPage';
import { FilterAmpPage } from './pages/FilterAmpPage';
import { GlobalPage } from './pages/GlobalPage';
import { ModulationPage } from './pages/ModulationPage';
import { ProgramPage } from './pages/ProgramPage';
import { SamplePage } from './pages/SamplePage';
import { SynthPage } from './pages/SynthPage';
import { WaveVectorPage } from './pages/WaveVectorPage';

export function WorkstationLcd({ meter }: { meter: MeterSnapshot }) {
  const { activePageDefinition, activePage } = useWorkstationNavigation();

  const page = (() => {
    if (activePage === 'program') {
      return <ProgramPage meter={meter} />;
    }
    if (activePage === 'sample') {
      return <SamplePage />;
    }
    if (activePage === 'synth') {
      return <SynthPage />;
    }
    if (activePage === 'filterAmp') {
      return <FilterAmpPage />;
    }
    if (activePage === 'modulation') {
      return <ModulationPage />;
    }
    if (activePage === 'waveVector') {
      return <WaveVectorPage />;
    }
    if (activePage === 'effects') {
      return <EffectsPage />;
    }
    return <GlobalPage meter={meter} />;
  })();

  return (
    <section className="workstation-lcd" aria-label="Central LCD workstation screen">
      <div className="workstation-lcd-bezel">
        <div className="workstation-lcd-toolbar">
          <div>
            <span>Touch LCD</span>
            <strong>{activePageDefinition.label}</strong>
          </div>
          <WorkstationTabs />
        </div>
        <div className="workstation-lcd-screen">{page}</div>
        <WorkstationStatusBar meter={meter} />
      </div>
    </section>
  );
}
