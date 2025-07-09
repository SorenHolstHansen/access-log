import assert from "node:assert/strict";
import test from "node:test";
import { objectScout } from "./index.js";

test("Simple index test", () => {
  const a = objectScout({
    foo: "bar",
  });

  const iter = 10;
  for (let i = 0; i < iter; i++) {
    a.foo;
  }

  assert.strictEqual(a.__object_scout.foo.count, iter);
});

test("nested objects", () => {
  const a = objectScout({
    foo: {
      bar: "baz",
    },
  });

  a.foo.bar;

  assert.deepEqual(a.__object_scout.foo.inner.bar.count, 1);
});

test("__object_scout is 'distributive'", () => {
  // We test that calling __object_scout on the root object and then traversing down to the path gives the same result as traversing down to the path, then asking for __object_scout
  const a = objectScout({
    foo: {
      bar: "baz",
    },
  });

  a.foo.bar;

  assert.deepEqual(a.__object_scout.foo.inner.bar, a.foo.__object_scout.bar);
});

test("__object_scout show stats of keys not present in the original object", () => {
  const a = objectScout({
    foo: "bar",
  });

  // @ts-ignore
  a.baz;

  // @ts-ignore
  assert.strictEqual(a.__object_scout.baz.count, 1);
});

test("Arrays work", () => {
  const a = objectScout([1, 2, 3]);

  a[1];

  assert.strictEqual(a.__object_scout[1]?.count, 1);
});

test("Arrays of objects work", () => {
  const a = objectScout([{ foo: "bar" }, 1, { b: 2 }]);

  // @ts-ignore
  a[0]?.foo;

  assert.strictEqual(a.__object_scout[0]?.inner.foo?.count, 1);
});
