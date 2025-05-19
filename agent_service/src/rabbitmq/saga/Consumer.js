
export class Consumer {
    constructor(queueName, rabbitMq, options) {
        this.queueName = queueName;
        this.rabbitMq = rabbitMq;
        this.onConsume = options.onConsume;
        this.onCompensate = options.onCompensate;
    }
    
    addListeners() {
        this.rabbitMq.addListener(`${this.queueName}`, this.consume.bind(this));
    }

    async consume(msg) {
        try {
            const message = await this.onConsume(msg);
            this.rabbitMq.sendMessage(`${this.queueName}_success`, message);
        } catch {
            this.rabbitMq.sendMessage(`${this.queueName}_compensate`, msg);
        }
    }
}

export class ConsumerBuilder {
    constructor(queueName, rabbitMq) {
        this.params = { queueName, rabbitMq };
    }

    onConsume(callback) {
        this.params.onConsume = callback;
        return this;
    }

    build() {
        if (!this.params.queueName) throw new Error("A queueName must be specified!");
        if (!this.params.rabbitMq) throw new Error("A rabbitMq must be specified!");
        if (!this.params.onConsume) throw new Error("An onConsume callback must be specified!");
        
        const consumer = new Consumer(this.params.queueName, this.params.rabbitMq, {
            onConsume: this.params.onConsume,
        });

        return consumer;
    }
}
