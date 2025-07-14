"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const index_js_1 = require("./index.js");
(0, node_test_1.default)("Simple index test", () => {
    const a = (0, index_js_1.objectScout)({
        foo: "bar",
    });
    const iter = 10;
    for (let i = 0; i < iter; i++) {
        a.foo;
    }
    strict_1.default.strictEqual(a.__object_scout.foo.count, iter);
});
(0, node_test_1.default)("nested objects", () => {
    const a = (0, index_js_1.objectScout)({
        foo: {
            bar: "baz",
        },
    });
    a.foo.bar;
    strict_1.default.deepEqual(a.__object_scout.foo.inner.bar.count, 1);
});
(0, node_test_1.default)("__object_scout is 'distributive'", () => {
    // We test that calling __object_scout on the root object and then traversing down to the path gives the same result as traversing down to the path, then asking for __object_scout
    const a = (0, index_js_1.objectScout)({
        foo: {
            bar: "baz",
        },
    });
    a.foo.bar;
    strict_1.default.deepEqual(a.__object_scout.foo.inner.bar, a.foo.__object_scout.bar);
});
(0, node_test_1.default)("__object_scout show stats of keys not present in the original object", () => {
    const a = (0, index_js_1.objectScout)({
        foo: "bar",
    });
    // @ts-ignore
    a.baz;
    // @ts-ignore
    strict_1.default.strictEqual(a.__object_scout.baz.count, 1);
});
(0, node_test_1.default)("Arrays work", () => {
    const a = (0, index_js_1.objectScout)([1, 2, 3]);
    a[1];
    strict_1.default.strictEqual(a.__object_scout[1]?.count, 1);
});
(0, node_test_1.default)("Arrays of objects work", () => {
    const a = (0, index_js_1.objectScout)([{ foo: "bar" }, 1, { b: 2 }]);
    // @ts-ignore
    a[0]?.foo;
    strict_1.default.strictEqual(a.__object_scout[0]?.inner.foo?.count, 1);
});
