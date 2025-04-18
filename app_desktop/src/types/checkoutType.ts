export interface CheckoutType {
    _id: string;
    user: string;
    state: string;
    products: CheckoutProductType[];
    created_at: string;
    updated_at: string;
}

export interface CheckoutsType {
    checkouts: CheckoutType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}

export interface CheckoutProductType {
    product: {
        _id: string;
        title: string;
        description: string;
        category: string;
        price: number;
    };
    quantity: number;
}