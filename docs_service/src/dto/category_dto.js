export default (doc) => {
    return {
        _id: doc._id,
        name: doc.name,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
    };
};
