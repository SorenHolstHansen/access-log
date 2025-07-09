import assert from "node:assert/strict";
import test from "node:test";
import { accessLog } from "./index.js";

test("Simple index test", () => {
  const a = accessLog({
    foo: "bar",
  });

  const iter = 10;
  for (let i = 0; i < iter; i++) {
    a.foo;
  }

  assert.strictEqual(a.__access_log.foo.count, iter);
});

test("nested objects", () => {
  const a = accessLog({
    foo: {
      bar: "baz",
    },
  });

  a.foo.bar;

  assert.deepEqual(a.__access_log.foo.inner.bar.count, 1);
});

test("__access_log is 'distributive'", () => {
  // We test that calling __access_log on the root object and then traversing down to the path gives the same result as traversing down to the path, then asking for __access_log
  const a = accessLog({
    foo: {
      bar: "baz",
    },
  });

  a.foo.bar;

  assert.deepEqual(a.__access_log.foo.inner.bar, a.foo.__access_log.bar);
});

test("__access_log show stats of keys not present in the original object", () => {
  const a = accessLog({
    foo: "bar",
  });

  // @ts-ignore
  a.baz;

  // @ts-ignore
  assert.strictEqual(a.__access_log.baz.count, 1);
});

test("Arrays work", () => {
  const a = accessLog([1, 2, 3]);

  a[1];

  assert.strictEqual(a.__access_log[1]?.count, 1);
});

test("Arrays of objects work", () => {
  const a = accessLog([{ foo: "bar" }, 1, { b: 2 }]);

  // @ts-ignore
  a[0]?.foo;

  assert.strictEqual(a.__access_log[0]?.inner.foo?.count, 1);
});
