export type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

export type WindowSizeInitialValue = number | `%${number}`;

export type InitialWindowSize = {
  width: WindowSizeInitialValue;
  height: WindowSizeInitialValue;
};
