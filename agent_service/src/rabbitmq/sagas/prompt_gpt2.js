import rabbitMq from "../index.js";

const queueName = "gpt2_queue";

export const promptGPT2 = async (input) => {
  rabbitMq.sendMessage(queueName, {
    input,
    options: {
      max_length: 128,
      num_return_sequences: 1,
      top_k: 50,
      top_p: 0.9,
      temperature: 0.8,
    },
  });
};

export default async () => {
  rabbitMq.addListener(`${queueName}_error`, async (message) => {
    console.log("Error in prompt gpt2:", message.error);
  });

  rabbitMq.addListener(`${queueName}_success`, async (message) => {
    console.log("Success in prompt gpt2:", message.response);
  });
};
