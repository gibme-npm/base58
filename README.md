# @gibme/base58

A lightweight TypeScript Base58 encoding/decoding library with support for both standard Base58 and CryptoNote Base58 formats.

## Installation

```bash
yarn add @gibme/base58
```

or

```bash
npm install @gibme/base58
```

**Requires Node.js >= 22**

## Documentation

Full API documentation is available at [https://gibme-npm.github.io/base58/](https://gibme-npm.github.io/base58/)

## Usage

### Standard Base58

```typescript
import Base58 from '@gibme/base58';

// Encode from hex string
const encoded = Base58.encode('02c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cfeb05f9d2');
console.log(encoded);
// => 6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

// Encode from Buffer or Uint8Array
const encodedFromBuffer = Base58.encode(Buffer.from('deadbeef', 'hex'));
console.log(encodedFromBuffer);

// Decode back to Buffer
const decoded = Base58.decode(encoded);
console.log(decoded.toString('hex'));
```

### CryptoNote Base58

CryptoNote Base58 is a variant used by CryptoNote-based cryptocurrencies that encodes data in fixed-size blocks.

```typescript
import Base58 from '@gibme/base58';

const encoded = Base58.cn_encode(
    '9df6ee01c179d13e2a0c52edd8b821e2d53d707e47ddcaaf696644a45563564c2934bd50' +
    'a8faca00a94c5a4dcc3cf070898c2db6ff5990556d08f5a09c8787900dcecab3b77173c1');
console.log(encoded);
// => TRTLv2RUL7X82vLeXnFmF7cfhKJ6UeiJzJdWQf556DEb7tkVqDAs7FVVKQVqkZqY47Q1PFwne2jZNKEn1gEeTWrb3JxG7HaMU4Q

const decoded = Base58.cn_decode(encoded);
console.log(decoded.toString('hex'));
```

## API

### `Base58.encode(data: string | Uint8Array | Buffer): string`

Encodes the given data into a standard Base58 string. String input is treated as hex-encoded.

### `Base58.decode(encoded: string): Buffer`

Decodes a standard Base58 string back into a Buffer.

### `Base58.cn_encode(data: string | Uint8Array | Buffer): string`

Encodes the given data into a CryptoNote Base58 string. String input is treated as hex-encoded.

### `Base58.cn_decode(encoded: string): Buffer`

Decodes a CryptoNote Base58 string back into a Buffer.

## License

MIT - See [LICENSE](LICENSE) for details.
