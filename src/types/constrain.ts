export type WindowConstrainValue = number | `%${number}` | `${number}%`;

export type WindowConstrain = {
  minX?: WindowConstrainValue;
  minY?: WindowConstrainValue;
  maxX?: WindowConstrainValue;
  maxY?: WindowConstrainValue;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  snap?: {
    edges?: boolean;
    gridSize?: number;
    threshold?: number;
  };
};
