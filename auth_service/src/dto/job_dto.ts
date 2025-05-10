export default (doc) => {
  return {
    _id: doc._id,
    type: doc.type,
    state: doc.state,
    message: doc.message,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
