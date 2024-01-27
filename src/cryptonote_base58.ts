// Copyright (c) 2018-2022, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { BigInteger, Reader, Writer } from '@gibme/bytepack';

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
const UINT64_MAX = BigInteger(2).pow(64);

export default abstract class CryptoNoteBase58 {
    /**
     * Decodes the CryptoNote Base58 encoded string into a Buffer
     *
     * @param encoded
     */
    public static cn_decode (
        encoded: string
    ): Buffer {
        const enc = Buffer.from(encoded).valueOf();

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
                i * FULL_BLOCK_SIZE
            );
        }

        if (lastBlockSize > 0) {
            result = CryptoNoteBase58.decodeBlock(
                enc.subarray(
                    fullBlockCount * FULL_ENCODED_BLOCK_SIZE,
                    fullBlockCount * FULL_ENCODED_BLOCK_SIZE + lastBlockSize),
                result,
                fullBlockCount * FULL_BLOCK_SIZE
            );
        }

        return Buffer.from(result);
    }

    /**
     * Encodes the data into CryptoNote Base58 string
     *
     * @param data
     */
    public static cn_encode (
        data: string | Uint8Array | Buffer
    ): string {
        if (data instanceof Buffer) {
            data = data.toString('hex');
        } else if (data instanceof Uint8Array) {
            data = Buffer.from(data).toString('hex');
        }

        const _data = Buffer.from(data, 'hex').valueOf();

        if (_data.length === 0) {
            return '';
        }

        const fullBlockCount = Math.floor(_data.length / FULL_BLOCK_SIZE);

        const lastBlockSize = _data.length % FULL_BLOCK_SIZE;

        const resSize = fullBlockCount * FULL_ENCODED_BLOCK_SIZE + ENCODED_BLOCK_SIZES[lastBlockSize];

        let result = new Uint8Array(resSize);

        for (let i = 0; i < resSize; ++i) {
            result[i] = ALPHABET[0];
        }

        for (let i = 0; i < fullBlockCount; i++) {
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

        return Buffer.from(result).toString();
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

        let resNum = BigInteger.zero;

        let order = BigInteger.one;

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

        if (resSize < FULL_BLOCK_SIZE && (BigInteger(2).pow(8 * resSize).compare(resNum) <= 0)) {
            throw new Error('Overflow 2');
        }

        const value = new Writer()
            .uint64_t(resNum, true)
            .buffer
            .valueOf();

        buffer.set(value, index);

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

        let num = new Reader(data).uint64_t(true);

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
}

export { CryptoNoteBase58 };
