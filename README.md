# 🔍 access-log

Track how often each key of an object is accessed — useful for debugging, analytics, or building observability into your code.

## 🚀 Installation

```bash
npm install access-log
```

## 📦 Usage

```ts
import { accessLog } from 'access-log';

const tracked = accessLog({ a: 'hello', b: 'world' });

console.log(tracked.a); // "hello"
console.log(tracked.a); // "hello"
console.log(tracked.b); // "world"

console.log(tracked.__access_log.a.count); // 2
console.log(tracked.__access_log.b.count); // 1
```
