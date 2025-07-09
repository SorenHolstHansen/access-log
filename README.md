# 🔍 object-scout

Track how often each key of an object is accessed — useful for debugging, analytics, or building observability into your code.

## 🚀 Installation

```bash
npm install object-scout
```

## 📦 Usage

```ts
import { objectScout } from 'object-scout';

const tracked = objectScout({ a: 'hello', b: 'world' });

console.log(tracked.a); // "hello"
console.log(tracked.a); // "hello"
console.log(tracked.b); // "world"

console.log(tracked.__object_scout.a.count); // 2
console.log(tracked.__object_scout.b.count); // 1
```
