export default {
  responseHeaders: {
    ratelimit: {
      type: "string",
      description: "Rate limit state",
    },
    "ratelimit-policy": {
      type: "string",
      description: "Rate limit policy",
    },
    "content-length": {
      type: "string",
      description: "Content length",
    },
    "content-type": {
      type: "string",
      description: "Content type",
    },
  },
};
