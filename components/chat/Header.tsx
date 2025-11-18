import { Model } from './Model';
import { Theme } from './Theme';

export function Header() {
  return (
    <div className="flex justify-between flex-wrap items-center py-3 sticky gap-2 top-0 bg-inherit z-10">
      <Model />
      <Theme />
    </div>
  );
}
