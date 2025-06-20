export default (doc) => {
    return {
        _id: doc._id,
        expires_at: doc.expires_at,
        user: doc.user,
        credit: doc.credit ? {
            noOfCredits: doc.credit.noOfCredits,
        } : null,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
    };
};
