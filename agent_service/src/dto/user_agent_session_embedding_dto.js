export default (doc) => {
  return {
    _id: doc._id,
    embedding: doc.embedding,
    meta: doc.meta,
    user_agent_session: doc.user_agent_session,
    user: doc.user,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
