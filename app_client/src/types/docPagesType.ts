export interface DocOrderedPagesType {
    data: DocOrderedPageType[];
}

export interface DocOrderedPageType {
    category_name: string;
    pages: DocPageType[];
}

export interface DocPageType {
    _id: string;
    name: string;
    content: string;
    category: {
        name: string;
    }
    created_at: string;
    updated_at: string;
}