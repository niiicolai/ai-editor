import { client } from "../index.js";

const collection_name = "project_index_item_collection";

export const createCollection = async () => {
  await client.createCollection(collection_name, {
    vectors: { size: 384, distance: "Dot" },
  });
};

export const upsert = async (points) => {
  const operationInfo = await client.upsert(collection_name, {
    wait: true,
    points,
  });

  return { operationInfo, points };
};

export const deleteMany = async (ids) => {
  const operationInfo = await client.delete(collection_name, {
    points: ids,
    wait: true,
  });

  return operationInfo;
};

export const query = async (vector, limit=3, filter={}) => {
  const searchResult = await client.query(collection_name, {
    ...(vector && { query: vector }),
    with_payload: true,
    limit,
    filter,
  });

  return searchResult;
};
