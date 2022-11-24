// Copyright (c) 2018-2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

import { BigInteger, BytePackBigInt } from '@gibme/bytepack';

/** @ignore */
export default class Helpers {
    /** @ignore */
    public static binToString (binary: Uint8Array): string {
        const result: string[] = [];

        binary.forEach(bit => {
            result.push(String.fromCharCode(bit));
        });

        return result.join('');
    }

    /** @ignore */
    public static hexToBin (hex: string): Uint8Array {
        if (hex.length % 2 !== 0) {
            throw new Error('hex string has invalid length!');
        }

        const result = new Uint8Array(hex.length / 2);

        for (let i = 0; i < hex.length / 2; ++i) {
            result[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        }

        return result;
    }

    /** @ignore */
    public static stringToBin (str: string): Uint8Array {
        const result = new Uint8Array(str.length);

        for (let i = 0; i < str.length; i++) {
            result[i] = str.charCodeAt(i);
        }

        return result;
    }

    /** @ignore */
    public static uint8BeTo64 (data: Uint8Array): BigInteger {
        if (data.length < 1 || data.length > 8) {
            throw new Error('Invalid input length');
        }

        let res: BigInteger = BytePackBigInt.zero;

        const twoPow8 = BytePackBigInt(2).pow(8);

        let i = 0;

        switch (9 - data.length) {
            case 1:
                res = res.add(data[i++]);
            /* falls through */
            case 2:
                res = res.multiply(twoPow8).add(data[i++]);
            /* falls through */
            case 3:
                res = res.multiply(twoPow8).add(data[i++]);
            /* falls through */
            case 4:
                res = res.multiply(twoPow8).add(data[i++]);
            /* falls through */
            case 5:
                res = res.multiply(twoPow8).add(data[i++]);
            /* falls through */
            case 6:
                res = res.multiply(twoPow8).add(data[i++]);
            /* falls through */
            case 7:
                res = res.multiply(twoPow8).add(data[i++]);
            /* falls through */
            case 8:
                res = res.multiply(twoPow8).add(data[i++]);
                break;
            default:
                throw new Error('Impossible condition');
        }

        return res;
    }

    /** @ignore */
    public static uint64To8be (num: BigInteger, size: number): Uint8Array {
        const res = new Uint8Array(size);

        if (size < 1 || size > 8) {
            throw new Error('Invalid input length');
        }

        const twopow8: BigInteger = BytePackBigInt(2).pow(8);

        for (let i = size - 1; i >= 0; i--) {
            res[i] = num.remainder(twopow8).toJSNumber();

            num = num.divide(twopow8);
        }

        return res;
    }
}
