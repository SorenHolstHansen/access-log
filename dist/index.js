"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectScout = objectScout;
const OBJECT_SCOUT_KEY = "__object_scout";
function objectScout(inner) {
    if (typeof inner !== "object")
        return inner;
    const counter = {};
    for (const key of Object.keys(inner)) {
        inner[key] = objectScout(inner[key]);
    }
    const stats = () => {
        const stats = {};
        for (const key of Object.keys(counter)) {
            stats[key] = { count: counter[key] };
        }
        for (const _key of Object.keys(inner)) {
            const key = _key;
            const s = inner[key][OBJECT_SCOUT_KEY];
            if (stats[_key]) {
                // biome-ignore lint/style/noNonNullAssertion: There by the check above
                stats[_key].inner = s;
            }
            else {
                stats[_key] = {
                    inner: s,
                };
            }
        }
        return stats;
    };
    const handler = {
        get(target, prop, receiver) {
            if (prop === OBJECT_SCOUT_KEY) {
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
    return proxy;
}
