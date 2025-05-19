
export class ConsumerChain {
    constructor(queueNameIn, queueNameOut, rabbitMq, options) {
        this.queueNameIn = queueNameIn;
        this.queueNameOut = queueNameOut;
        this.rabbitMq = rabbitMq;
        this.onConsumeIn = options.onConsumeIn;
        this.onCompensateIn = options.onCompensateIn;
        this.onCompensateOut = options.onCompensateOut;
        this.onSuccessOut = options.onSuccessOut;
    }
    
    addListeners() {
        this.rabbitMq.addListener(`${this.queueNameIn}`, this.consumeIn.bind(this));
        this.rabbitMq.addListener(`${this.queueNameOut}_success`, this.successOut.bind(this));
        this.rabbitMq.addListener(`${this.queueNameOut}_compensate`, this.compensateOut.bind(this));
    }

    async consumeIn(msg) {
        try {
            const message = await this.onConsumeIn(msg);
            this.rabbitMq.sendMessage(`${this.queueNameOut}`, message);
        } catch {
            const message = await this.onCompensateIn(msg);
            this.rabbitMq.sendMessage(`${this.queueNameIn}_compensate`, message);
        }
    }

    async successOut(msg) {
        try {
            const message = await this.onSuccessOut(msg);
            this.rabbitMq.sendMessage(`${this.queueNameIn}_success`, message);
        } catch {
            const message = await this.onCompensateOut(msg);
            this.rabbitMq.sendMessage(`${this.queueNameIn}_compensate`, message);
        }
    }

    async compensateOut(msg) {
        try {
            const message = await this.onCompensateOut(msg);
            this.rabbitMq.sendMessage(`${this.queueNameIn}_compensate`, message);
        } catch {
            this.rabbitMq.sendMessage(`${this.queueNameIn}_compensate`, msg);
        }
    }
}

export class ConsumerChainBuilder {
    constructor(queueNameIn, queueNameOut, rabbitMq) {
        this.params = { queueNameIn, queueNameOut, rabbitMq };
    }

    onConsumeIn(callback) {
        this.params.onConsumeIn = callback;
        return this;
    }

    onCompensateIn(callback) {
        this.params.onCompensateIn = callback;
        return this;
    }

    onCompensateOut(callback) {
        this.params.onCompensateOut = callback;
        return this;
    }

    onSuccessOut(callback) {
        this.params.onSuccessOut = callback;
        return this;
    }

    build() {
        if (!this.params.queueNameIn) throw new Error("A queueNameIn must be specified!");
        if (!this.params.queueNameOut) throw new Error("A queueNameOut must be specified!");
        if (!this.params.rabbitMq) throw new Error("A rabbitMq must be specified!");
        if (!this.params.onConsumeIn) throw new Error("An onConsumeIn callback must be specified!");
        if (!this.params.onCompensateIn) throw new Error("An onCompensateIn callback must be specified!");
        if (!this.params.onCompensateOut) throw new Error("An onCompensateOut callback must be specified!");
        if (!this.params.onSuccessOut) throw new Error("An onSuccessOut callback must be specified!");

        const chain = new ConsumerChain(this.params.queueNameIn, this.params.queueNameOut, this.params.rabbitMq, {
            onConsumeIn: this.params.onConsumeIn,
            onCompensateIn: this.params.onCompensateIn,
            onCompensateIn: this.params.onCompensateIn,
            onCompensateOut: this.params.onCompensateOut,
            onSuccessOut: this.params.onSuccessOut,
        });

        return chain;
    }
}
