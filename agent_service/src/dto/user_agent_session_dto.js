export default (doc) => {
  return {
    _id: doc._id,
    title: doc.title,
    user: doc.user,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
