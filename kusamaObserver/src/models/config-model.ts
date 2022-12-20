export interface Account {
    name?: string;
    accountID: string;
}

export interface Config {
    port: number
    wss: string;
    minFunds: number;
    accounts: Account[]
}