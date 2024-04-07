export interface FixerResponse {
    success: boolean;
    query: Query;
    info: Info;
    date: Date;
    historical: boolean;
    result: number;
}

export interface Info {
    timestamp: number;
    rate: number;
}

export interface Query {
    from: string;
    to: string;
    amount: number;
}
