export interface UserProductType {
    _id: string;
    user: string;
    expires_at: string;
    credit: {
        noOfCredits: number;
        usedCredits: number;
    };
    created_at: string;
    updated_at: string;
}

export interface UserProductsType {
    products: UserProductType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}

export interface CreditInfoType {
    totalMaxCredits: number;
    totalUsedCredits: number;
    creditsLeft: number;
}
