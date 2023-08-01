import { Provider } from "../common/providers";
import { AccountBalance } from "./balance";
export declare class Account {
    balance: AccountBalance;
    constructor(provider: Provider, address: string);
}
