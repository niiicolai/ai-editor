export default (doc) => {
    return {
        _id: doc._id,
        user: doc.user,
        state: doc.state,
        products: doc.products ? doc.products.map(p => {
            return {
                product: typeof p.product === "object" ? {
                    _id: p.product._id,
                    title: p.product.title,
                    description: p.product.description,
                    category: p.product.category,  
                    price: p.product.price,          
                } : p.product,
                quantity: p.quantity
            }
        }) : [],
        created_at: doc.created_at,
        updated_at: doc.updated_at,
    };
};
