import { JsonRpcProvider, SuiObjectData } from "@mysten/sui.js";
import { CoinObject, NftObject } from "./objects";
export declare const SUI_SYSTEM_STATE_OBJECT_ID = "0x0000000000000000000000000000000000000005";
export declare class Provider {
    query: QueryProvider;
    constructor(endpoint: string);
}
declare class QueryProvider {
    provider: JsonRpcProvider;
    constructor(endpoint: string);
    getOwnedObjects(address: string): Promise<SuiObjectData[]>;
    getOwnedCoins(address: string): Promise<CoinObject[]>;
    getOwnedNfts(address: string): Promise<NftObject[]>;
}
export {};
