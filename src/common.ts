import axios from "axios";
import fs from "fs";
import util from "util";

const pkg = require("../package.json");

export const APP_NAME = pkg.name;

export const APP_VERSION = pkg.version;

export const ENV_INFO = process.env.ENV_INFO;

export enum Encoding {
    base64 = "base64",
    utf8 = "utf8"
};

/**
 * Encodes string to base64
 * @param str string to encode to base64
 */
export function toBase64(str: string): string;
/**
 * Serializes object to JSON and then encodes result to base64
 * @param obj Object to serialize to JSON and encode to base64
 */
export function toBase64(obj: object): string;
export function toBase64(val: string | object): string {
    const value = typeof val === "object"
        ? JSON.stringify(val)
        : val;
    
    return Buffer.from(value).toString(Encoding.base64);
}

/**
 * Decodes string from base64
 * @param str base64 encoded string
 */
export function fromBase64(str: string): string
/**
 * Decodes string from base64 and parses result JSON to `T`
 * @param str base64 encoded JSON
 */
export function fromBase64<T>(str: string): T
export function fromBase64<T>(str: string): string | T {
    const value = Buffer.from(str, Encoding.base64).toString(Encoding.utf8);
    try {
        return JSON.parse(value) as T;    
    } catch (e) {
        return value;
    }
}

/**
 * Application settings.
 * Defined as `class` instead of `interface` to make DI easier (no need of Token<Service>)
 */
export class Settings {
    CardanoSignService: {
        network: {
            protocolMagic: number;
            name: string;
        }
    };
}

/**
 * Loads application settings from file or URL as specified in `SettingsUrl` environment variable.
 */
export async function loadSettings(): Promise<Settings> {
    if (process.env.SettingsUrl.startsWith("http")) {
        return (await axios.get<Settings>(process.env.SettingsUrl)).data;
    } else {
        return JSON.parse(await util.promisify(fs.readFile)(process.env.SettingsUrl, Encoding.utf8)) as Settings;
    }
}