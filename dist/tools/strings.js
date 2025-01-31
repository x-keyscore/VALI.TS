"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base16ToBase64 = base16ToBase64;
exports.base16ToBase64Url = base16ToBase64Url;
exports.base16ToBase32 = base16ToBase32;
exports.base16ToBase32Hex = base16ToBase32Hex;
exports.convertBase64ToBase16 = convertBase64ToBase16;
exports.convertBase32ToBase16 = convertBase32ToBase16;
exports.base64ToBase16 = base64ToBase16;
function convertBase16ToBase64(input, base64, padding) {
    const totalChunksLength = Math.floor(input.length / 6) * 6;
    let output = "";
    let i = 0;
    while (i < totalChunksLength) {
        const dec = parseInt(input.slice(i, i + 6), 16);
        output += (base64[((dec >> 18) & 63)]
            + base64[((dec >> 12) & 63)]
            + base64[((dec >> 6) & 63)]
            + base64[(dec & 63)]);
        i += 6;
    }
    if (i < input.length) {
        const restChunk = input.slice(i, i + 6);
        // 4469248 = 00100 01000 01100 10000 10100 00000 = 4 8 12 16 20 0
        const leftShift = (143016576 >> (restChunk.length * 5)) & 31;
        const dec = parseInt(restChunk, 16) << leftShift;
        output += base64[((dec >> 18) & 63)]
            + base64[((dec >> 12) & 63)];
        if (leftShift < 12)
            output += base64[((dec >> 6) & 63)];
        if (leftShift < 8)
            output += base64[(dec & 63)];
    }
    while (padding && output.length % 4 !== 0) {
        output += '=';
    }
    return (output);
}
// 100 01000 01100 10000 00000 4 8 12 16
function convertBase16ToBase32(input, base32, padding = true) {
    const totalChunksLength = Math.floor(input.length / 10) * 10;
    let output = "";
    let i = 0;
    while (i < totalChunksLength) {
        const decHigh = parseInt(input.slice(i, i + 5), 16);
        const decLow = parseInt(input.slice(i + 5, i + 10), 16);
        output += base32[((decHigh >> 15) & 31)]
            + base32[((decHigh >> 10) & 31)]
            + base32[((decHigh >> 5) & 31)]
            + base32[(decHigh & 31)];
        +base32[((decLow >> 15) & 31)]
            + base32[((decLow >> 10) & 31)]
            + base32[((decLow >> 5) & 31)]
            + base32[(decLow & 31)];
        i += 10;
    }
    if (i < input.length) {
        const restChunk = input.slice(i, i + 5);
        // 4469248 = 00100 01000 01100 10000 00000 = 4 8 12 16
        const leftShift = (4469248 >> (restChunk.length * 5)) & 31;
        const decHigh = parseInt(restChunk, 16) << leftShift;
        output += base32[((decHigh >> 15) & 31)]
            + base32[((decHigh >> 10) & 31)];
        if (leftShift < 12)
            output += base32[((decHigh >> 5) & 31)];
        if (leftShift < 8)
            output += base32[(decHigh & 31)];
    }
    if (i + 5 < input.length) {
        const restChunk = input.slice(i + 5, i + 10);
        // 4469248 = 00100 01000 01100 10000 00000 = 4 8 12 16
        const leftShift = (4469248 >> (restChunk.length * 5)) & 31;
        const decLow = parseInt(restChunk, 16) << leftShift;
        output += base32[((decLow >> 15) & 31)];
        if (leftShift < 16)
            output += base32[((decLow >> 10) & 31)];
        if (leftShift < 12)
            output += base32[((decLow >> 5) & 31)];
        if (leftShift < 8)
            output += base32[(decLow & 31)];
    }
    while (padding && output.length % 8 !== 0) {
        output += '=';
    }
    return (output);
}
function base16ToBase64(input, padding = true) {
    const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return (convertBase16ToBase64(input, base64, padding));
}
function base16ToBase64Url(input, padding = true) {
    const base64Url = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    return (convertBase16ToBase64(input, base64Url, padding));
}
function base16ToBase32(input, padding = true) {
    const base32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    return (convertBase16ToBase32(input, base32, padding));
}
function base16ToBase32Hex(input, padding = true) {
    const base32Hex = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
    return (convertBase16ToBase32(input, base32Hex, padding));
}
function convertBase64ToBase16(input, base64) {
    if (input.indexOf("=") !== -1)
        input = input.slice(0, input.indexOf("="));
    const totalChunksLength = Math.floor(input.length / 4) * 4;
    const base16 = "0123456789ABCDEF";
    let output = "";
    let i = 0;
    while (i < totalChunksLength) {
        const dec = (base64.indexOf(input[i]) << 18)
            | (base64.indexOf(input[i + 1]) << 12)
            | (base64.indexOf(input[i + 2]) << 6)
            | base64.indexOf(input[i + 3]);
        output += base16[((dec >> 20) & 15)]
            + base16[((dec >> 16) & 15)]
            + base16[((dec >> 12) & 15)]
            + base16[((dec >> 8) & 15)]
            + base16[((dec >> 4) & 15)]
            + base16[(dec & 15)];
        i += 4;
    }
    console.log(input.length);
    if (i < input.length) {
        const rest = input.slice(i);
        // 209472 = 00110 01100 10010 00000 = 6 12 18 0
        const leftShift = (209472 >> (rest.length * 5)) & 31;
        const dec = ((base64.indexOf(rest[0]) << 18)
            | (rest[1] ? base64.indexOf(rest[1]) << 12 : 0)
            | (rest[2] ? base64.indexOf(rest[2]) << 6 : 0)
            | (rest[3] ? base64.indexOf(rest[3]) : 0)) << leftShift;
        output += base16[((dec >> 20) & 15)]
            + base16[((dec >> 16) & 15)];
        if (leftShift < 18) {
            output += base16[((dec >> 12) & 15)]
                + base16[((dec >> 8) & 15)];
        }
        if (leftShift < 12) {
            output += base16[((dec >> 4) & 15)]
                + base16[(dec & 15)];
        }
    }
    return (output);
}
function convertBase32ToBase16(input, base32) {
    if (input.indexOf("=") !== -1)
        input = input.slice(0, input.indexOf("="));
    const totalChunksLength = Math.floor(input.length / 8) * 8;
    const base16 = "0123456789ABCDEF";
    let output = "";
    let i = 0;
    while (i < totalChunksLength) {
        const dec = (base32.indexOf(input[i]) << 15)
            | (base32.indexOf(input[i + 1]) << 10)
            | (base32.indexOf(input[i + 2]) << 5)
            | base32.indexOf(input[i + 3]);
        output += base16[((dec >> 16) & 15)]
            + base16[((dec >> 12) & 15)]
            + base16[((dec >> 8) & 15)]
            + base16[((dec >> 4) & 15)]
            + base16[(dec & 15)];
        i += 4;
    }
    if (i < input.length) {
        const rest = input.slice(i).padEnd(4, base32[0]);
        const dec = (base32.indexOf(rest[0]) << 18)
            | (base32.indexOf(rest[1]) << 12)
            | (base32.indexOf(rest[2]) << 6)
            | base32.indexOf(rest[3]);
        output += base16[((dec >> 20) & 15)]
            + base16[((dec >> 16) & 15)];
        if (dec & 262143) {
            output += base16[((dec >> 12) & 15)];
        }
        if (dec & 4095) {
            output += base16[((dec >> 8) & 15)]
                + base16[((dec >> 4) & 15)];
        }
    }
    return (output);
}
function base64ToBase16(input) {
    const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return (convertBase64ToBase16(input, base64));
}
/*
export function stringToUTF16UnitArray(str: string) {
    const utf16UnitArray = new Uint16Array(str.length);
    let i = 0;

    while (i < str.length) {
        const codePoint = str.codePointAt(i)!;

        if (codePoint > 0xFFFF) {
            // ADD HIGH SURROGATE
            utf16UnitArray[i++] = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
            // ADD LOW SURROGATE
            utf16UnitArray[i++] = (codePoint - 0x10000) % 0x400 + 0xDC00;
        } else {
            utf16UnitArray[i++] = codePoint;
        }
    }

    return (utf16UnitArray);
}

export function getUTF8ByteLengthByCodePoint(codePoint: number): number {
    if (codePoint <= 0x7F) {
        return (1);
    } else if (codePoint <= 0x7FF) {
        return (2);
    } else if (codePoint <= 0xFFFF) {
        return (3);
    } else if (codePoint <= 0x10FFFF) {
        return (4);
    }
    return (0);
}

export function getUTF8ByteLengthByUTF16UnitArray(utf16UnitArray: Uint16Array): number {
    let byteLength = 0;
    let i = 0;

    while (i < utf16UnitArray.length) {
        const unit = utf16UnitArray[i];

        // CHECK HIGH SURROGATE
        if (unit >= 0xD800 && unit <= 0xDBFF) {
            byteLength += getUTF8ByteLengthByCodePoint(((unit - 0xD800) << 10)
                + (utf16UnitArray[i + 1] - 0xDC00) + 0x10000);
            i += 2;
        } else {
            byteLength += getUTF8ByteLengthByCodePoint(unit);
            i++;
        }
    }

    return (byteLength);
}*/ 
