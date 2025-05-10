export default (doc) => {
  return {
    _id: doc._id,
    username: doc.username,
    email: doc.email,
    credit: doc.credit,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
