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

import CryptoNoteBase58 from './cryptonote_base58';

/** @ignore */
const { base58_to_binary, binary_to_base58 } = require('base58-js');

export default abstract class Base58 extends CryptoNoteBase58 {
    /**
     * Decodes the Base58 encoded string into a Buffer
     *
     * @param encoded
     */
    public static decode (
        encoded: string
    ): Buffer {
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
}

export { Base58 };
