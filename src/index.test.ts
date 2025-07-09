import assert from "node:assert/strict";
import test from "node:test";
import { tally } from "./index.js";

test("Simple index test", () => {
  const a = tally({
    foo: "bar",
  });

  const iter = 10;
  for (let i = 0; i < iter; i++) {
    a.foo;
  }

  assert.strictEqual(a.__tally.foo.count, iter);
});

test("nested objects", () => {
  const a = tally({
    foo: {
      bar: "baz",
    },
  });

  a.foo.bar;

  assert.deepEqual(a.__tally.foo.inner.bar.count, 1);
});

test("__tally is 'distributive'", () => {
  // We test that calling __tally on the root object and then traversing down to the path gives the same result as traversing down to the path, then asking for __tally
  const a = tally({
    foo: {
      bar: "baz",
    },
  });

  a.foo.bar;

  assert.deepEqual(a.__tally.foo.inner.bar, a.foo.__tally.bar);
});

test("__tally show stats of keys not present in the original object", () => {
  const a = tally({
    foo: "bar",
  });

  // @ts-ignore
  a.baz;

  // @ts-ignore
  assert.strictEqual(a.__tally.baz.count, 1);
});

test("Arrays work", () => {
  const a = tally([1, 2, 3]);

  a[1];

  assert.strictEqual(a.__tally[1]?.count, 1);
});

test("Arrays of objects work", () => {
  const a = tally([{ foo: "bar" }, 1, { b: 2 }]);

  // @ts-ignore
  a[0]?.foo;

  assert.strictEqual(a.__tally[0]?.inner.foo?.count, 1);
});
