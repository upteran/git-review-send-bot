export type Record<T extends number | string, U> = {
  [key in T]: U;
};
