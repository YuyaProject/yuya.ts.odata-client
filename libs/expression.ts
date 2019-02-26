export class Expression {
  public text: string;
  constructor(t: string) {
    this.text = t;
  }

  public toString() {
    return this.text;
  }
}

export function isExpression(val: any): val is Expression {
  const vexpression = val as Expression;
  return !!vexpression && vexpression.text !== undefined;
}
