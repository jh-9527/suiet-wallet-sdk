import { Provider } from "../common/providers";
export declare class AccountBalance {
    private provider;
    private address;
    constructor(provider: Provider, address: string);
    /**
     * Get the account balance of one specific token type
     * @param tokenTypeArg SUI by default
     */
    get(tokenTypeArg?: string): Promise<bigint>;
    /**
     * Get owned coins list with balance of all types
     */
    getAllCoins(): Promise<Array<{
        typeArg: string;
        balance: bigint;
    }>>;
}
