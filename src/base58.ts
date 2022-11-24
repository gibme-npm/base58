// Copyright (c) 2018-2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

import { Base58Handler } from './types';
import CryptoNoteBase58 from './cryptonote_base58';

/** @ignore */
const { base58_to_binary, binary_to_base58 } = require('base58-js');

export default class Base58 implements Base58Handler {
    public static get CryptoNote (): CryptoNoteBase58 {
        return new CryptoNoteBase58();
    }

    /**
     * Decodes the Base58 encoded string into a Buffer
     *
     * @param encoded
     */
    public static decode (encoded: string): Buffer {
        return Buffer.from(base58_to_binary(encoded));
    }

    /**
     * Encodes the data into Base58
     *
     * @param data
     */
    public static encode (data: string | Uint8Array | Buffer): string {
        if (data instanceof Buffer) {
            data = data.valueOf();
        } else if (typeof data === 'string') {
            data = Buffer.from(data, 'hex').valueOf();
        }

        return binary_to_base58(data);
    }

    /**
     * Decodes the Base58 encoded string into a Buffer
     *
     * @param encoded
     */
    public decode (encoded: string): Buffer {
        return Base58.decode(encoded);
    }

    /**
     * Encodes the data into Base58
     *
     * @param data
     */
    public encode (data: string | Uint8Array | Buffer): string {
        return Base58.encode(data);
    }
}
