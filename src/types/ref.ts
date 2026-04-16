export type WindowRefType = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
  bringToFront: () => void;
};
