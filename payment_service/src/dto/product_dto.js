export default (doc) => {
  return {
    _id: doc._id,
    title: doc.title,
    price: doc.price,
    category: doc.category,
    description: doc.description,
    noOfCredits: doc.noOfCredits,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
