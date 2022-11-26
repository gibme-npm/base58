# Simple Base58 Library

## Documentation

[https://gibme-npm.github.io/base58/](https://gibme-npm.github.io/base58/)

## Base58 Sample Code

```typescript
import Base58 from '@gibme/base58';

const encoded = Base58.encode('02c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cfeb05f9d2');

console.log(encoded);

const decoded = Base58.decode(encoded);

console.log(decoded.toString('hex'));
```

## CryptoNote Base58 Sample Code

```typescript
import Base58 from '@gibme/base58';

const encoded = Base58.cn_encode(
    '9df6ee01c179d13e2a0c52edd8b821e2d53d707e47ddcaaf696644a45563564c2934bd50' +
    'a8faca00a94c5a4dcc3cf070898c2db6ff5990556d08f5a09c8787900dcecab3b77173c1');

console.log(encoded);

const decoded = Base58.cn_decode(encoded);

console.log(decoded.toString('hex'));
```
