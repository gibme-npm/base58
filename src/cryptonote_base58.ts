// Copyright (c) 2018-2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

import { BytePackBigInt } from '@gibme/bytepack';
import Helpers from './helpers';
import { Base58Handler } from './types';

/** @ignore */
const ALPHABET: number[] = (() => {
    const str = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

    return str.split('')
        .map(char => char.charCodeAt(0));
})();

/** @ignore */
const ENCODED_BLOCK_SIZES = [0, 2, 3, 5, 6, 7, 9, 10, 11];

/** @ignore */
const FULL_BLOCK_SIZE = 8;

/** @ignore */
const FULL_ENCODED_BLOCK_SIZE = 11;

/** @ignore */
const UINT64_MAX = BytePackBigInt(2).pow(64);

export default class CryptoNoteBase58 implements Base58Handler {
    /**
     * Decodes the Base58 encoded string into a Buffer
     *
     * @param encoded
     */
    public static decode (encoded: string): Buffer {
        const enc = Helpers.stringToBin(encoded);

        if (enc.length === 0) {
            return Buffer.alloc(0);
        }

        const fullBlockCount = Math.floor(enc.length / FULL_ENCODED_BLOCK_SIZE);

        const lastBlockSize = enc.length % FULL_ENCODED_BLOCK_SIZE;

        const lastBlockDecodedSize = ENCODED_BLOCK_SIZES.indexOf(lastBlockSize);

        if (lastBlockDecodedSize < 0) {
            throw new Error('Invalid encoded length');
        }

        const dataSize = fullBlockCount * FULL_BLOCK_SIZE + lastBlockDecodedSize;

        let result = new Uint8Array(dataSize);

        for (let i = 0; i < fullBlockCount; i++) {
            result = CryptoNoteBase58.decodeBlock(
                enc.subarray(
                    i * FULL_ENCODED_BLOCK_SIZE,
                    i * FULL_ENCODED_BLOCK_SIZE + FULL_ENCODED_BLOCK_SIZE),
                result,
                i * FULL_BLOCK_SIZE);
        }

        if (lastBlockSize > 0) {
            result = CryptoNoteBase58.decodeBlock(
                enc.subarray(
                    fullBlockCount * FULL_ENCODED_BLOCK_SIZE,
                    fullBlockCount * FULL_ENCODED_BLOCK_SIZE + lastBlockSize),
                result,
                fullBlockCount * FULL_BLOCK_SIZE);
        }

        return Buffer.from(result);
    }

    /**
     * Encodes the data into Base58
     *
     * @param data
     */
    public static encode (data: string | Uint8Array | Buffer): string {
        if (data instanceof Buffer) {
            data = data.toString('hex');
        } else if (data instanceof Uint8Array) {
            data = Buffer.from(data).toString('hex');
        }

        const _data = Helpers.hexToBin(data);

        if (_data.length === 0) {
            return '';
        }

        const fullBlockCount = Math.floor(_data.length / FULL_BLOCK_SIZE);

        const lastBlockSize = _data.length % FULL_BLOCK_SIZE;

        const resSize = fullBlockCount * FULL_ENCODED_BLOCK_SIZE + ENCODED_BLOCK_SIZES[lastBlockSize];

        let result = new Uint8Array(resSize);

        let i;

        for (i = 0; i < resSize; ++i) {
            result[i] = ALPHABET[0];
        }

        for (i = 0; i < fullBlockCount; i++) {
            result = CryptoNoteBase58.encodeBlock(
                _data.subarray(
                    i * FULL_BLOCK_SIZE,
                    i * FULL_BLOCK_SIZE + FULL_BLOCK_SIZE),
                result, i *
                FULL_ENCODED_BLOCK_SIZE);
        }

        if (lastBlockSize > 0) {
            result = CryptoNoteBase58.encodeBlock(
                _data.subarray(
                    fullBlockCount * FULL_BLOCK_SIZE,
                    fullBlockCount * FULL_BLOCK_SIZE + lastBlockSize),
                result,
                fullBlockCount * FULL_ENCODED_BLOCK_SIZE);
        }

        return Helpers.binToString(result);
    }

    /**
     * Decodes a Base58 block
     *
     * @param data
     * @param buffer
     * @param index
     * @private
     */
    private static decodeBlock (data: Uint8Array, buffer: Uint8Array, index: number): Uint8Array {
        if (data.length < 1 || data.length > FULL_ENCODED_BLOCK_SIZE) {
            throw new Error('Invalid block length: ' + data.length);
        }

        const resSize = ENCODED_BLOCK_SIZES.indexOf(data.length);

        if (resSize <= 0) {
            throw new Error('Invalid block size');
        }

        let resNum = BytePackBigInt.zero;

        let order = BytePackBigInt.one;

        for (let i = data.length - 1; i >= 0; i--) {
            const digit = ALPHABET.indexOf(data[i]);

            if (digit < 0) {
                throw new Error('Invalid symbol');
            }

            const product = order.multiply(digit).add(resNum);

            if (product.compare(UINT64_MAX) === 1) {
                throw new Error('Overflow');
            }

            resNum = product;

            order = order.multiply(ALPHABET.length);
        }

        if (resSize < FULL_BLOCK_SIZE && (BytePackBigInt(2).pow(8 * resSize).compare(resNum) <= 0)) {
            throw new Error('Overflow 2');
        }

        buffer.set(Helpers.uint64To8be(resNum, resSize), index);

        return buffer;
    }

    /**
     * Encodes the data into a block for Base58
     *
     * @param data
     * @param buffer
     * @param index
     * @private
     */
    private static encodeBlock (data: Uint8Array, buffer: Uint8Array, index: number): Uint8Array {
        if (data.length < 1 || data.length > FULL_ENCODED_BLOCK_SIZE) {
            throw new Error('Invalid block length: ' + data.length);
        }
        let num = Helpers.uint8BeTo64(data);
        let i = ENCODED_BLOCK_SIZES[data.length] - 1;
        while (num.compare(0) === 1) {
            const div = num.divmod(ALPHABET.length);
            const remainder = div.remainder;
            num = div.quotient;
            buffer[index + i] = ALPHABET[remainder.toJSNumber()];
            i--;
        }
        return buffer;
    }

    /**
     * Decodes the Base58 encoded string into a Buffer
     *
     * @param encoded
     */
    public decode (encoded: string): Buffer {
        return CryptoNoteBase58.decode(encoded);
    }

    /**
     * Encodes the data into Base58
     *
     * @param data
     */
    public encode (data: string | Uint8Array | Buffer): string {
        return CryptoNoteBase58.encode(data);
    }
}
