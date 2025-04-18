export default (doc) => {
  return {
    _id: doc._id,
    title: doc.title,
    url: doc.url,
    fileName: doc.filename,
    user: doc.user,
    category: doc.category,
    mimeType: doc.mimetype,
    bytes: doc.bytes,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
