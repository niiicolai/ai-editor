export default (doc) => {
  return {
    _id: doc._id,
    user_product: doc.user_product,
    amount: doc.amount,
    user: doc.user,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
