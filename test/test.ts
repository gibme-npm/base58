// Copyright (c) 2018-2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

import assert from 'assert';
import { describe, it } from 'mocha';
import Base58 from '../src/base58';

describe('Base58 Test', () => {
    const expectedRaw = Buffer.from(
        '02c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cfeb05f9d2',
        'hex');

    const expectedEncoded = '6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';

    it('Encoding', () => {
        const encoded = Base58.encode(expectedRaw);

        assert.equal(encoded, expectedEncoded);
    });

    it('Decoding', () => {
        const decoded = Base58.decode(expectedEncoded);

        assert.deepEqual(decoded, expectedRaw);
    });
});

describe('CryptoNote Base58 Test', () => {
    const expectedRaw = Buffer.from(
        '9df6ee01c179d13e2a0c52edd8b821e2d53d707e47ddcaaf696644a45563564c2934bd50' +
        'a8faca00a94c5a4dcc3cf070898c2db6ff5990556d08f5a09c8787900dcecab3b77173c1', 'hex');

    const expectedEncoded =
        'TRTLv2RUL7X82vLeXnFmF7cfhKJ6UeiJzJdWQf556DEb7tkVqDAs7FVVKQVqkZqY47Q1PFwne2jZNKEn1gEeTWrb3JxG7HaMU4Q';

    it('Encoding', () => {
        const encoded = Base58.cn_encode(expectedRaw);

        assert.equal(encoded, expectedEncoded);
    });

    it('Decoding', () => {
        const decoded = Base58.cn_decode(expectedEncoded);

        assert.deepEqual(decoded, expectedRaw);
    });
});
