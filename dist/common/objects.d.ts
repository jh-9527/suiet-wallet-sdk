import { SuiMoveObject } from "@mysten/sui.js";
export type CoinObjectDto = {
    objectId: string;
    symbol: string;
    balance: bigint;
    typeArg: string;
};
export declare class CoinObject {
    private _objectId;
    private _typeArg;
    private _balance;
    private _symbol;
    constructor(objectId: string, typeArg: string, balance: bigint);
    get objectId(): string;
    get typeArg(): string;
    get balance(): bigint;
    get symbol(): string;
    static fromDto(obj: CoinObjectDto): CoinObject;
    toDto(): CoinObjectDto;
    toString(): string;
}
export declare class Coin {
    static isCoin(obj: SuiMoveObject): boolean;
    static isSUI(obj: SuiMoveObject): boolean;
    static getCoinObject(obj: SuiMoveObject): CoinObject;
    static getBalance(obj: SuiMoveObject): bigint;
    static getCoinTypeArg(obj: SuiMoveObject): string | null;
    static getCoinSymbol(coinTypeArg: string): string;
    static getCoinTypeFromArg(coinTypeArg: string): string;
}
export type NftObject = {
    objectId: string;
    name: string;
    description: string;
    url: string;
    previousTransaction?: string;
    objectType: string;
};
export declare class Nft {
    static isNft(obj: SuiMoveObject): boolean;
    static getNftObject(obj: SuiMoveObject, previousTransaction?: string): NftObject;
}
