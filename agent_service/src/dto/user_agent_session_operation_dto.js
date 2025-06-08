
export default (doc) => {
    return {
      _id: doc._id,
      name: doc.name,
      max_iterations: doc.max_iterations,
      state: doc.state,
      iterations: doc.iterations,
      user_agent_session: doc.user_agent_session,
      user: doc.user,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    };
  };
  
