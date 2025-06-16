export type DrawerPosition = 'right' | 'left' | 'top' | 'bottom';
export type DrawerMode = 'over' | 'push' | 'persistent';

export interface DrawerConfig {
  position?: DrawerPosition;
  mode?: DrawerMode;
  backdropClose?: boolean;
  width?: string;
  height?: string;
  inputs?: any;
}
