export class Producer {
  constructor(queueName, rabbitMq, options) {
    this.queueName = queueName;
    this.rabbitMq = rabbitMq;
    this.onProduce = options.onProduce;
    this.onCompensate = options.onCompensate;
    this.onSuccess = options.onSuccess;
  }

  addListeners() {
    this.rabbitMq.addListener(
      `${this.queueName}_success`,
      this.onSuccess.bind(this)
    );
    this.rabbitMq.addListener(
      `${this.queueName}_compensate`,
      this.onCompensate.bind(this)
    );
  }

  async produce(body) {
    const message = await this.onProduce(body);
    if (process.env.NODE_ENV !== 'test')
      this.rabbitMq.sendMessage(this.queueName, message);
    return message;
  }
}

export class ProducerBuilder {
  constructor(queueName, rabbitMq) {
    this.params = {
      queueName,
      rabbitMq,
    };
  }

  onProduce(callback) {
    this.params.onProduce = callback;
    return this;
  }

  onCompensate(callback) {
    this.params.onCompensate = callback;
    return this;
  }

  onSuccess(callback) {
    this.params.onSuccess = callback;
    return this;
  }

  build() {
    if (!this.params.queueName)
      throw new Error("A queueName must be specified!");
    if (!this.params.rabbitMq) throw new Error("A rabbitMq must be specified!");
    if (!this.params.onProduce)
      throw new Error("An onProduce callback must be specified!");
    if (!this.params.onCompensate)
      throw new Error("An onCompensate callback must be specified!");
    if (!this.params.onSuccess)
      throw new Error("An onSuccess callback must be specified!");

    const producer = new Producer(this.params.queueName, this.params.rabbitMq, {
      onProduce: this.params.onProduce,
      onCompensate: this.params.onCompensate,
      onSuccess: this.params.onSuccess,
    });

    return producer;
  }
}
