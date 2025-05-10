// Copyright (c) 2021, pur3missh
// Copyright (c) 2023-2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

/**
 * This code has been copied over from the base58-js package and translated to typescript
 * as the author of base58-js has no included typings at this time and it is not available
 * via @types/base58-js
 */

/** @ignore */
const base58_chars =
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/** @ignore */
const create_base58_map = () => {
    const base58M = Array(256).fill(-1);

    for (let i = 0; i < base58_chars.length; ++i) {
        base58M[base58_chars.charCodeAt(i)] = i;
    }

    return base58M;
};

/** @ignore */
const base58Map = create_base58_map();

/**
 * Converts a base58 string to the corresponding binary representation
 *
 * @param base58String
 */
export const base58_to_binary = (base58String: string): Uint8Array => {
    if (base58String.match(/[IOl0]/gmu)) {
        throw new Error(
            `Invalid base58 character “${base58String.match(/[IOl0]/gmu)}”`
        );
    }

    const lz = base58String.match(/^1+/gmu);

    const psz = lz ? lz[0].length : 0;

    const size = ((base58String.length - psz) * (Math.log(58) / Math.log(256)) + 1) >>> 0;

    const base58_match = base58String.match(/./gmu);

    const psz_Uint = new Uint8Array(psz);

    let base58_temp: Uint8Array = new Uint8Array();

    if (base58_match) {
        base58_temp = base58_match.map(i => base58_chars.indexOf(i))
            .reduce((acc, i) => {
                acc = acc.map((j) => {
                    const x = j * 58 + i;
                    i = x >> 8;
                    return x;
                });
                return acc;
            }, new Uint8Array(size))
            .reverse()
            .filter((lastValue =>
                value =>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    (lastValue = lastValue || value)
            )(false));
    }

    return new Uint8Array([
        ...psz_Uint,
        ...base58_temp
    ]);
};

/**
 * Converts a Uint8Array into a base58 string
 *
 * @param uint8array
 */
export const binary_to_base58 = (uint8array: Uint8Array): string => {
    const result = [];

    for (const byte of uint8array) {
        let carry = byte;

        for (let j = 0; j < result.length; ++j) {
            const x: number = (base58Map[result[j]] << 8) + carry;

            result[j] = base58_chars.charCodeAt(x % 58);

            carry = (x / 58) | 0;
        }

        while (carry) {
            result.push(base58_chars.charCodeAt(carry % 58));

            carry = (carry / 58) | 0;
        }
    }

    for (const byte of uint8array) {
        if (byte) break;
        else result.push('1'.charCodeAt(0));
    }

    result.reverse();

    return String.fromCharCode(...result);
};

export default {
    binary_to_base58,
    base58_to_binary
};
