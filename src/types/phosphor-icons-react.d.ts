// The published @phosphor-icons/react 2.1.10 package exposes a missing
// dist/index.d.ts entrypoint. Keep named imports typed until upstream fixes it.
declare module "@phosphor-icons/react" {
  import type { ComponentType, SVGProps } from "react";
  type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; weight?: string }>;
  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const ArrowUDownLeft: Icon;
  export const BellSimple: Icon;
  export const Camera: Icon;
  export const CheckCircle: Icon;
  export const Desktop: Icon;
  export const HandArrowDown: Icon;
  export const Info: Icon;
  export const Laptop: Icon;
  export const ListChecks: Icon;
  export const MagnifyingGlass: Icon;
  export const Package: Icon;
  export const Plus: Icon;
  export const PlusSquare: Icon;
  export const ProjectorScreen: Icon;
  export const SquaresFour: Icon;
  export const Usb: Icon;
}
