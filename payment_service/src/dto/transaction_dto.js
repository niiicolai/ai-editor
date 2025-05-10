export default (doc) => {
  return {
    _id: doc._id,
    type: doc.type,
    state: doc.state,
    error: doc.error,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
