export default (doc) => {
  return {
    _id: doc._id,
    content: doc.content,
    code: doc.code,
    role: doc.role,
    state: doc.state,
    user_files: doc.user_files,
    user_agent_session: doc.user_agent_session,
    user: doc.user,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
