export type WindowConstrainValue = number | `%${number}` | `${number}%`;

export type WindowConstrain = {
  minX?: WindowConstrainValue;
  minY?: WindowConstrainValue;
  maxX?: WindowConstrainValue;
  maxY?: WindowConstrainValue;
};
