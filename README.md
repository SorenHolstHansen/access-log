# 🔍 tally

Track how often each key of an object is accessed — useful for debugging, analytics, or building observability into your code.

## 🚀 Installation

```bash
npm install tally
```

## 📦 Usage

```ts
import { tally } from 'tally';

const tracked = tally({ a: 'hello', b: 'world' });

console.log(tracked.a); // "hello"
console.log(tracked.a); // "hello"
console.log(tracked.b); // "world"

console.log(tracked.__tally.a.count); // 2
console.log(tracked.__tally.b.count); // 1
```
