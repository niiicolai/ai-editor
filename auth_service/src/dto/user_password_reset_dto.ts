export default (doc) => {
  return {
    expired_at: doc.expired_at,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
