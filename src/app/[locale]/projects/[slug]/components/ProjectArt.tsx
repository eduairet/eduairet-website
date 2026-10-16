import type { ProjectsCopy } from '@/models';
import type { ProjectArt as Art } from '@/utils/constants';
import AsciiNameArt from '@/components/art/ProjectArt/AsciiNameArt';
import LetrasticaArt from '@/components/art/ProjectArt/LetrasticaArt';
import TorusArt from '@/components/art/ProjectArt/TorusArt';
import WavesArt from '@/components/art/ProjectArt/WavesArt';

interface IProps {
  art: Art;
  copy: ProjectsCopy['art'];
}

export default function ProjectArt({ art, copy }: IProps) {
  switch (art) {
    case 'letrastica':
      return <LetrasticaArt {...copy.letrastica} />;
    case 'torus':
      return <TorusArt {...copy.torus} />;
    case 'waves':
      return <WavesArt {...copy.waves} />;
    case 'ascii':
      return <AsciiNameArt {...copy.ascii} />;
  }
}
