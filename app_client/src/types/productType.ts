export interface ProductType {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    noOfCredits: number;
    created_at: string;
    updated_at: string;
}

export interface ProductsType {
    products: ProductType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
