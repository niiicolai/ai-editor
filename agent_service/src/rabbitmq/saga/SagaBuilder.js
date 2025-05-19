import { ProducerBuilder } from "./Producer.js";
import { ConsumerBuilder } from "./Consumer.js";
import { ConsumerChainBuilder } from "./ConsumerChain.js";

export default class SagaBuilder {
    static producer(queueName, rabbitMq) {
        return new ProducerBuilder(queueName, rabbitMq)
    }

    static consumer(queueName, rabbitMq) {
        return new ConsumerBuilder(queueName, rabbitMq)
    }

    static chain(queueNameIn, queueNameOut, rabbitMq) {
        return new ConsumerChainBuilder(queueNameIn, queueNameOut, rabbitMq)
    }
}

