// Copyright (c) 2018-2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

/** @ignore */
export interface Base58Handler {
    decode: (encoded: string) => Buffer;
    encode: (decoded: string | Uint8Array | Buffer) => string;
}
