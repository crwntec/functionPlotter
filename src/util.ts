const OPERATORS = [
  {
    op: "+",
    val: 2,
    assoc: "L",
    isFunction: false,
    exec: () => {},
  },
  {
    op: "-",
    val: 2,
    assoc: "L",
    isFunction: false,
    exec: () => {},
  },
  {
    op: "*",
    val: 3,
    assoc: "L",
    isFunction: false,
    exec: () => {},
  },
  {
    op: "/",
    val: 3,
    assoc: "L",
    isFunction: false,
    exec: () => {},
  },
  {
    op: "^",
    val: 4,
    assoc: "R",
    isFunction: false,
    exec: () => {},
  },
  {
    op: "sin",
    val: 5,
    assoc: "R",
    isFunction: true,
    exec: (x: number) => Math.sin(x),
  },
  {
    op: "cos",
    val: 5,
    assoc: "R",
    isFunction: true,
    exec: (x: number) => Math.cos(x),
  },
];

const isOperator = (token: string) => OPERATORS.some((o) => o.op === token);

const getOpVal = (operator: string) => OPERATORS.find((o) => o.op == operator)?.val || 0;
const getOpAssoc = (operator: string) =>
  OPERATORS.find((o) => o.op === operator)?.assoc || "";

const isFunction = (token: string) =>
  OPERATORS.some((o) => o.op === token && o.isFunction);

const getFunction = (token: string) => OPERATORS.find((o) => o.op === token);

export const processExpression = (expression: string) => {
  let output = "";
  const tokens = Array.from(expression);

  tokens.forEach((element, index) => {
    output += element;

    if (index === tokens.length - 1) return;

    const next = tokens[index + 1];

    if (
      (!isNaN(Number(element)) || element === "x") &&
      (next === "(" || next === "x" || isFunction(next))
    ) {
      output += " * ";
    } else if (
      !isOperator(element) &&
      isNaN(Number(next)) &&
      !isFunction(next) &&
      !isOperator(next) &&
      next !== "(" &&
      next !== ")" &&
      next !== "x"
    ) {
      return;
    } else {
      output += " ";
    }
  });

  return output;
};

export const toRPN = (input: string) => {
  const output: string[] = [];
  const operatorStack: string[] = [];

  const handleToken = (token: string) => {
    if (token === "x" || !isNaN(Number(token))) {
      output.push(token);
      return;
    }
    if (isOperator(token)) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        (getOpVal(token) < getOpVal(operatorStack[operatorStack.length - 1]) ||
          (getOpVal(token) ===
            getOpVal(operatorStack[operatorStack.length - 1]) &&
            getOpAssoc(token) === "L"))
      ) {
        output.push(operatorStack.pop() || "");
      }
      operatorStack.push(token);
      return;
    }
    if (token == "(") {
      operatorStack.push(token);
      return;
    }
    if (token == ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        output.push(operatorStack.pop() || "");
      }
      if (operatorStack.length === 0) {
        throw new Error("Mismatched parentheses: No matching '(' found");
      }
      operatorStack.pop();
      return;
    }
  };
  const tokens = input.split(" ");
  for (const token of tokens) {
    if (token.trim() === "") continue;
    handleToken(token);
  }
  while (operatorStack.length > 0) {
    output.push(operatorStack.pop() || "");
  }

  return output;
};

export const RPNEval = (input: string[], x:number): number => {
  const stack: number[] = [];

  const handleToken = (token: string) => {
    if (token === "x") {
      stack.push(Number(x));
      return;
    }
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
      return;
    }
    if (isFunction(token)) {
      stack.push(getFunction(token)?.exec(stack.pop()||0)||0);
      return;
    }
    const right = stack.pop() || 0;
    const left = stack.pop() || 0;
    switch (token) {
      case "+":
        stack.push(left + right);
        break;
      case "-":
        stack.push(left - right);
        break;
      case "*":
        stack.push(left * right);
        break;
      case "/":
        stack.push(left / right);
        break;
      case "^":
        stack.push(left ** right);
        break;
      default:
        throw new Error(`Invalid operator ${token}`);
    }
  };

  for (const token of input) {
    if (token.trim() === "") continue;
    handleToken(token);
  }

  return stack.pop() || 0;
};
