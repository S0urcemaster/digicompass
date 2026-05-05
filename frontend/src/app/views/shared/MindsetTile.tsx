import type { Focus } from '../../../types/domain';
import { FocusTile } from './FocusTile';

type MindsetTileProps = {
  focus: Focus;
  name: string;
};

export function MindsetTile({ focus, name }: MindsetTileProps) {
  return (
    <div className="relative">
      <FocusTile focus={focus} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/78 via-black/32 to-transparent px-3 pb-3 pt-10 text-left text-white">
        <p className="text-lg font-semibold tracking-[-0.03em]">{name}</p>
      </div>
    </div>
  );
}
