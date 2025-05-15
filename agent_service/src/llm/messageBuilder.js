export class MessageBuilder {
  constructor() {
    this.actAs = "";
    this.context = "";
    this.content = "";
  }

  setAct(instruction) {
    this.actAs = instruction;
    return this;
  }

  addContext(instruction) {
    if (!instruction) return this;

    this.actAs += "\n" + instruction;
    return this;
  }

  setContent(instruction) {
    this.content = instruction;
    return this;
  }

  build() {
    return {
      role: "user",
      content: `${this.actAs}\n${this.context}\n${this.content}`,
    };
  }
}
