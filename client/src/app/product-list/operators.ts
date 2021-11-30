
export type operator<T> = (argA: T, argB: T) => boolean;

export type operators = { [key: string]: Function}

export const contains: operator<string> = function (argA: string, argB: string) {
  return argA.toLowerCase().includes(argB.toLowerCase());
};

export const greater: operator<number> = function (argA: number, argB: number) {
  return argA > argB;
};

export const equals: operator<any> = function (argA: any, argB: any) {
  return argA == argB;
};
