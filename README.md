# Simple Base58 Library

```typescript
import Base58 from '@gibme/base58';

const encoded = Base58.encode('02c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cfeb05f9d2');

console.log(encoded);

const decoded = Base58.decode(encoded);

console.log(decoded.toString('hex'));
```
