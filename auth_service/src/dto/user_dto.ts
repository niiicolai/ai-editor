export default (doc) => {
  return {
    _id: doc._id,
    username: doc.username,
    email: doc.email,
    role: doc.role,
    ...(doc.logins?.length > 0 && {
      logins: doc.logins.map((login) => {
        return {
          type: login.type,
          created_at: login.created_at,
          updated_at: login.updated_at,
        };
      }),
    }),
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
