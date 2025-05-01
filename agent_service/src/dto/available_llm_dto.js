export default (doc) => {
  return {
    _id: doc._id,
    name: doc.name,
    description: doc.description,
    //currency: doc.currency,
    //cost_per_input_token: doc.cost_per_input_token,
    //cost_per_output_token: doc.cost_per_output_token,
    //cost_per_cached_input_token: doc.cost_per_cached_input_token,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
