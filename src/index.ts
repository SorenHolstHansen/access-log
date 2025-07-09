const TALLY_KEY = "__tally";

type TallyObject = Record<string, any> | any[];
type StatsOfType<T> = T extends (infer Inner)[]
  ? { count: number; inner: StatsOfType<Inner> }[]
  : T extends Record<string, any>
    ? {
        [Property in keyof T]: {
          count: number;
          inner: StatsOfType<T[Property]>;
        };
      }
    : never;
export type ObjectWithTally<T> = T extends (infer S)[]
  ? ObjectWithTally<S>[] & { [TALLY_KEY]: StatsOfType<T> }
  : T extends Record<string, any>
    ? { [Property in keyof T]: ObjectWithTally<T[Property]> } & {
        [TALLY_KEY]: StatsOfType<T>;
      }
    : T;

export function tally<T extends TallyObject>(inner: T): ObjectWithTally<T> {
  if (typeof inner !== "object") return inner;
  const counter: Record<string | symbol, number> = {};

  for (const key of Object.keys(inner)) {
    inner[key as keyof T] = tally(inner[key as keyof T] as any);
  }

  const stats = () => {
    const stats: Record<string, { count?: number; inner?: any }> = {};
    for (const key of Object.keys(counter)) {
      stats[key] = { count: counter[key] };
    }
    for (const _key of Object.keys(inner)) {
      const key = _key as keyof T;
      const s = (inner[key] as any)[TALLY_KEY];
      if (stats[_key]) {
        // biome-ignore lint/style/noNonNullAssertion: There by the check above
        stats[_key]!.inner = s;
      } else {
        stats[_key] = {
          inner: s,
        };
      }
    }
    return stats;
  };

  const handler: ProxyHandler<T> = {
    get(target, prop, receiver) {
      if (prop === TALLY_KEY) {
        return stats();
      }
      counter[prop] = (counter[prop] ?? 0) + 1;
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value) {
      counter[prop] = (counter[prop] ?? 0) + 1;
      return Reflect.set(target, prop, value);
    },
  };

  const proxy = new Proxy(inner, handler);

  return proxy as any;
}
