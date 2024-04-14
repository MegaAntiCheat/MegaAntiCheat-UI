export const SteamID2Regex = /^STEAM_[0-5]:[01]:\d+$/;
export const SteamID2RegexGlobal = /STEAM_[0-5]:[01]:\d+/g;
export const steamID3Regex = /^\[[IUMGAPCgTLCa]:1:\d+]$/;
export const steamID3RegexGlobal = /\[[IUMGAPCgTLCa]:1:\d+]/g;
export const steamID64Regex = /^\d{17}$/;
export const steamID64RegexGlobal = /\d{17}/g;
export const steamCustomURLRegex = /^(?:https?:\/\/)?steamcommunity\.com\/id\/[a-zA-Z0-9_\\-]+\/?$/;
export const steamCustomURLRegexGlobal = /(?:https?:\/\/)?steamcommunity\.com\/id\/[a-zA-Z0-9_\\-]+\/?/g;
export const steamFixedURLRegex = /^(?:https?:\/\/)?steamcommunity\.com\/profiles\/[0-9]{17}\/?$/;
export const steamFixedURLRegexGlobal = /(?:https?:\/\/)?steamcommunity\.com\/profiles\/[0-9]{17}\/?/g;

const steamID64Base = 0x0110000100000000n;

export enum SteamIDType {
    SteamID2,
    SteamID3,
    SteamID64,
    Invalid
}

// Get a SteamID64 from a permalink profile url or from the other forms of Steam ID
// Returns undefined if invalid.
export async function getSteamID64(input: string): Promise<string | undefined> {
    const type = getSteamIDType(input);
    switch (type) {
    case SteamIDType.SteamID2:
        return convertSteamID2toSteamID64(input);
    case SteamIDType.SteamID3:
        return convertSteamID3toSteamID64(input);
    case SteamIDType.SteamID64:
        return input;
    case SteamIDType.Invalid:
        if(input.match(steamFixedURLRegex)) {
            const splitInput = input.split("/");
            return splitInput[splitInput.length - 1] || splitInput[splitInput.length - 2];
        }
    }
    return undefined;
}

export function getSteamIDType(input: string): SteamIDType {
    if(input.match(SteamID2Regex)) {
        return SteamIDType.SteamID2;
    } else if (input.match(steamID3Regex)) {
        return SteamIDType.SteamID3;
    } else if (input.match(steamID64Regex) && BigInt(input) >= steamID64Base) {
        return SteamIDType.SteamID64;
    }
    return SteamIDType.Invalid;
}

const steamID3LetterTable = new Map<bigint, string>([
    [0n, "I"], [1n, "U"], [2n, "M"], [3n, "G"], [4n, "A"], [5n, "P"], [6n, "C"], [7n, "g"], [8n, "T"], [10n, "a"]
]);

// Converts STEAM_0:0:1 type to 76561197960265728 type
function convertSteamID2toSteamID64(steamID: string): string {
    // eslint-disable-next-line prefer-const
    let [strX, strY, strZ]: string[] = steamID.split(":");
    strX = strX.substring(6); // Remove STEAM_ from X
    const [x, y, z]: bigint[] = [BigInt(strX), BigInt(strY), BigInt(strZ)];
    return (z + z + y + steamID64Base).toString(); 
}
// Converts [U:1:1234] type to 76561197960265728 type
function convertSteamID3toSteamID64(steamID: string): string {
    // eslint-disable-next-line prefer-const
    let [, strY, strZ]: string[] = steamID.split(":");
    strZ = strZ.substring(0, strZ.length - 1); // Remove brackets from Z
    const [y, z]: bigint[] = [BigInt(strY), BigInt(strZ)];
    return (z + steamID64Base).toString(); 
}
// Converts 76561197960265728 type to [U:1:1234] type
export function convertSteamID64toSteamID3(steamID64: string) {
    const original = BigInt(steamID64);
    //const universe = original >> 56n;
    const type = (original >> 52n) % 16n;
    const y = original % 2n;
    const accountNumber = (original % 4294967296n) >> 1n; // Get account number
    const output = "[" + steamID3LetterTable.get(type) + ":1:" + (accountNumber * 2n + y).toString() + "]";
    return output;
}
// Converts 76561197960265728 type to STEAM_0:0:1 type
export function convertSteamID64toSteamID2(steamID64: string) {
    const original = BigInt(steamID64);
    //const universe = original >> 56n;
    //const type = (original >> 52n) % 16n;
    const y = original % 2n;
    const accountNumber = (original % 4294967296n) >> 1n; // Get account number
    const output = "STEAM_0:" + y + ":" + accountNumber;
    return output;
}