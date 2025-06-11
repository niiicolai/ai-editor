
export class ConsumerChain {
    constructor(queueNameIn, queueNameOut, rabbitMq, options) {
        this.queueNameIn = queueNameIn;
        this.queueNameOut = queueNameOut;
        this.rabbitMq = rabbitMq;
        this.onConsume = options.onConsume;
        this.onCompensate = options.onCompensate;
        this.onSuccess = options.onSuccess;
    }
    
    addListeners() {
        this.rabbitMq.addListener(`${this.queueNameIn}`, this.consume.bind(this));
        this.rabbitMq.addListener(`${this.queueNameOut}_success`, this.success.bind(this));
        this.rabbitMq.addListener(`${this.queueNameOut}_compensate`, this.compensate.bind(this));
    }

    async consume(msg) {
        try {
            const message = await this.onConsume(msg);
            this.rabbitMq.sendMessage(`${this.queueNameOut}`, message);
        } catch (error) {
            this.rabbitMq.sendMessage(`${this.queueNameIn}_compensate`, {
                ...msg,
                error: error.message,
            });
        }
    }

    async success(msg) {
        try {
            const message = await this.onSuccess(msg);
            this.rabbitMq.sendMessage(`${this.queueNameIn}_success`, message);
        } catch (error) {
            this.rabbitMq.sendMessage(`${this.queueNameIn}_compensate`, {
                ...msg,
                error: error.message,
            });
        }
    }

    async compensate(msg) {
        try {
            const message = await this.onCompensate(msg);
            this.rabbitMq.sendMessage(`${this.queueNameIn}_compensate`, message);
        } catch (error) {
            this.rabbitMq.sendMessage(`${this.queueNameIn}_compensate`, {
                ...msg,
                error: error.message,
            });
        }
    }
}

export class ConsumerChainBuilder {
    constructor(queueNameIn, queueNameOut, rabbitMq) {
        this.params = { queueNameIn, queueNameOut, rabbitMq };
    }

    onConsume(callback) {
        this.params.onConsume = callback;
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
        if (!this.params.queueNameIn) throw new Error("A queueNameIn must be specified!");
        if (!this.params.queueNameOut) throw new Error("A queueNameOut must be specified!");
        if (!this.params.rabbitMq) throw new Error("A rabbitMq must be specified!");
        if (!this.params.onConsume) throw new Error("An onConsume callback must be specified!");
        if (!this.params.onCompensate) throw new Error("An onCompensate callback must be specified!");
        if (!this.params.onSuccess) throw new Error("An onSuccess callback must be specified!");

        const chain = new ConsumerChain(this.params.queueNameIn, this.params.queueNameOut, this.params.rabbitMq, {
            onConsume: this.params.onConsume,
            onCompensate: this.params.onCompensate,
            onSuccess: this.params.onSuccess,
        });

        return chain;
    }
}
