export default (doc) => {
  return {
    _id: doc._id,
    name: doc.name,
    description: doc.description,
    hashCode: doc.hashCode,
    lines: doc.lines,
    language: doc.language,
    //embedding: doc.embedding,
    project_index: doc.project_index,
    user: doc.user,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};