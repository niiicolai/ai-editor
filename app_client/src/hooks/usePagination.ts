import { useState } from "react";


export const usePagination = (defaultLimit:number = 10) => {
    const [limit, setLimit] = useState(defaultLimit);
    const [page, setPage] = useState(1);

    const nextPage = (pages:number) => { if (page < (pages || 0)) setPage(page + 1); }
    const prevPage = () => { if (page > 1) setPage(page - 1); }

    return {
        limit,
        setLimit,
        page,
        setPage,
        nextPage,
        prevPage
    }
}