/**
 * Fleet Intelligence Smart AI - Safe Mathematical Expression Parser
 * PROMPT 36 - Safe Expression Engine for Custom KPIs (No arbitrary eval/Function execution)
 */

export class SafeKpiExpressionEngine {
  /**
   * Extracts identifier variable names from formula expression
   */
  public static extractVariables(expression: string): string[] {
    const tokens = this.tokenize(expression);
    const vars: string[] = [];
    for (const tok of tokens) {
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tok) && !['+', '-', '*', '/', '(', ')'].includes(tok)) {
        if (!vars.includes(tok)) {
          vars.push(tok);
        }
      }
    }
    return vars;
  }

  /**
   * Evaluates formula expression with provided variables and returns numeric value
   */
  public static evaluateFormula(expression: string, context: Record<string, number> = {}): number {
    const evalRes = this.evaluate(expression, context);
    if (!evalRes.success) {
      throw new Error(evalRes.error || 'Gagal mengevaluasi formula');
    }
    return evalRes.result;
  }

  /**
   * Safely evaluates an arithmetic expression with supported variables.
   * Supported tokens: +, -, *, /, (, ), numbers, identifiers
   */
  public static evaluate(
    expression: string,
    variables: Record<string, number> = {}
  ): { success: boolean; result: number; error?: string } {
    try {
      const sanitized = expression.trim();
      if (!sanitized) {
        return { success: false, result: 0, error: 'Ekspresi formula kosong' };
      }

      const tokens = this.tokenize(sanitized);
      const postfix = this.infixToPostfix(tokens);
      const result = this.evaluatePostfix(postfix, variables);

      if (!isFinite(result) || isNaN(result)) {
        return { success: false, result: 0, error: 'Hasil formula tidak terhingga (div by 0) atau tidak valid' };
      }

      return { success: true, result: Math.round(result * 100) / 100 };
    } catch (err: any) {
      return { success: false, result: 0, error: err.message || 'Gagal mengevaluasi formula' };
    }
  }

  private static tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let i = 0;

    while (i < expr.length) {
      const char = expr[i];

      if (/\s/.test(char)) {
        i++;
        continue;
      }

      if (['+', '-', '*', '/', '(', ')'].includes(char)) {
        tokens.push(char);
        i++;
        continue;
      }

      // Numbers (integers or decimals)
      if (/[0-9]/.test(char)) {
        let numStr = '';
        while (i < expr.length && /[0-9.]/.test(expr[i])) {
          numStr += expr[i];
          i++;
        }
        tokens.push(numStr);
        continue;
      }

      // Identifiers (variable names like totalMileageKm)
      if (/[a-zA-Z_]/.test(char)) {
        let idStr = '';
        while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
          idStr += expr[i];
          i++;
        }
        tokens.push(idStr);
        continue;
      }

      throw new Error(`Karakter tidak valid dalam formula: '${char}'`);
    }

    return tokens;
  }

  private static precedence(op: string): number {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
  }

  private static infixToPostfix(tokens: string[]): string[] {
    const output: string[] = [];
    const stack: string[] = [];

    for (const token of tokens) {
      if (['+', '-', '*', '/'].includes(token)) {
        while (
          stack.length > 0 &&
          stack[stack.length - 1] !== '(' &&
          this.precedence(stack[stack.length - 1]) >= this.precedence(token)
        ) {
          output.push(stack.pop()!);
        }
        stack.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          output.push(stack.pop()!);
        }
        if (stack.length === 0) {
          throw new Error('Tanda kurung tidak seimbang ()');
        }
        stack.pop(); // Pop '('
      } else {
        // Operand (Number or Identifier)
        output.push(token);
      }
    }

    while (stack.length > 0) {
      const top = stack.pop()!;
      if (top === '(' || top === ')') {
        throw new Error('Tanda kurung tidak seimbang ()');
      }
      output.push(top);
    }

    return output;
  }

  private static evaluatePostfix(postfix: string[], vars: Record<string, number>): number {
    const stack: number[] = [];

    for (const token of postfix) {
      if (['+', '-', '*', '/'].includes(token)) {
        if (stack.length < 2) {
          throw new Error('Operan tidak cukup untuk operator');
        }
        const b = stack.pop()!;
        const a = stack.pop()!;

        switch (token) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            if (b === 0) throw new Error('Pembagian dengan nol');
            stack.push(a / b);
            break;
        }
      } else {
        // Number or Variable
        if (/^[0-9.]+$/.test(token)) {
          stack.push(parseFloat(token));
        } else {
          if (token in vars) {
            stack.push(vars[token]);
          } else {
            // Default 0 if unknown variable
            stack.push(0);
          }
        }
      }
    }

    if (stack.length !== 1) {
      throw new Error('Ekspresi matematika tidak valid');
    }

    return stack[0];
  }
}
