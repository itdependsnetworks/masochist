import {invariant, unreachable} from '@masochist/common';

import type {
  Argument,
  DocComment,
  Expression,
  FunctionExpression,
  MethodDefinition,
  Program,
  PropertyDeclaration,
  Statement,
  SwitchCase,
} from './ast';

const TAB_WIDTH = 2;

// TODO: use `walk()` (may require changes to `walk()`)
export default function print(ast: Program) {
  return ast.statements
    .map((statement) => {
      return printStatement(statement, 0);
    })
    .join('');
}

function printArgument(argument: Argument, _indent: number): string {
  return [argument.name, argument.type].filter(Boolean).join(': ');
}

function printClass(
  id: string,
  body: Array<DocComment | MethodDefinition | PropertyDeclaration>,
  indent: number,
): string {
  return (
    `class ${id} {\n` +
    body
      .map((item, i) => {
        const predecessor = body[i - 1]?.kind;
        if (item.kind === 'DocComment') {
          if (i === 0) {
            return printStatement(item, indent + 1);
          } else {
            return '\n' + printStatement(item, indent + 1);
          }
        } else if (item.kind === 'MethodDefinition') {
          if (predecessor === 'DocComment' || i === 0) {
            return printMethodDefinition(item, indent + 1);
          } else {
            return '\n' + printMethodDefinition(item, indent + 1);
          }
        } else if (item.kind === 'PropertyDeclaration') {
          return printPropertyDeclaration(item, indent + 1);
        } else {
          unreachable(item);
        }
      })
      .join('') +
    printIndent(indent) +
    '}'
  );
}

function printExpression(expression: Expression, indent: number): string {
  if (expression.kind === 'ArrayValue') {
    return (
      '[\n' +
      expression.items
        .map((item) => printExpression(item, indent + 1))
        .join(',\n') +
      ']'
    );
  } else if (expression.kind === 'BinaryExpression') {
    return (
      printExpression(expression.lhs, indent + 1) +
      ` ${expression.operator} ` +
      printExpression(expression.rhs, indent + 1)
    );
  } else if (expression.kind === 'BitwiseNotExpression') {
    return '~' + printExpression(expression.operand, indent).trimStart();
  } else if (expression.kind === 'BooleanValue') {
    return expression.value ? 'true' : 'false';
  } else if (expression.kind === 'CallExpression') {
    return (
      printExpression(expression.callee, indent) +
      '(' +
      expression.arguments
        .map((argument) => {
          return printExpression(argument, indent);
        })
        .join(', ') +
      ')'
    );
  } else if (expression.kind === 'ClassExpression') {
    return printClass(expression.id, expression.body, indent);
  } else if (expression.kind === 'DecrementExpression') {
    if (expression.position === 'postfix') {
      return printExpression(expression.operand, indent) + '--';
    } else {
      return '--' + printExpression(expression.operand, indent).trimStart();
    }
  } else if (expression.kind === 'FunctionExpression') {
    return printFunctionExpression(expression, indent, {useKeyword: true});
  } else if (expression.kind === 'Identifier') {
    return expression.name;
  } else if (expression.kind === 'IncrementExpression') {
    if (expression.position === 'postfix') {
      return printExpression(expression.operand, indent) + '++';
    } else {
      return '++' + printExpression(expression.operand, indent).trimStart();
    }
  } else if (expression.kind === 'IndexExpression') {
    return (
      printExpression(expression.indexee, indent) +
      '[' +
      printExpression(expression.index, indent) +
      ']'
    );
  } else if (expression.kind === 'LogicalNotExpression') {
    return '!' + printExpression(expression.operand, indent).trimStart();
  } else if (expression.kind === 'MemberExpression') {
    return (
      printExpression(expression.object, indent + 1) +
      (expression.property.kind === 'Identifier'
        ? `.${expression.property.name}`
        : `[${printExpression(expression.property, indent + 1)}]`)
    );
  } else if (expression.kind === 'NewExpression') {
    // TODO: wrap across multiple lines if too long?
    return (
      'new ' +
      printExpression(expression.object, indent) +
      '(' +
      expression.arguments
        .map((argument) => printExpression(argument, indent))
        .join(', ') +
      ')'
    );
  } else if (expression.kind === 'NullValue') {
    return 'null';
  } else if (expression.kind === 'NumberValue') {
    if (expression.base === 10) {
      return expression.value.toString();
    } else if (expression.base === 16) {
      if (expression.value <= 0xff) {
        return '0x' + expression.value.toString(16).padStart(2, '0');
      } else if (expression.value <= 0xffff) {
        return '0x' + expression.value.toString(16).padStart(4, '0');
      } else {
        return '0x' + expression.value.toString(16).padStart(8, '0');
      }
    } else {
      unreachable(expression.base);
    }
  } else if (expression.kind === 'ObjectValue') {
    return (
      '{\n' +
      expression.properties
        .map((property) => {
          let lhs = printIndent(indent + 1);
          if (property.computed) {
            lhs += `[${printExpression(property.key, indent + 1)}]`;
          } else if (property.shorthand) {
            if (
              property.key.kind !== 'Identifier' ||
              property.value.kind !== 'Identifier' ||
              property.key.name !== property.value.name
            ) {
              throw new Error(
                'print(): can only print shorthand ObjectProperty with ' +
                  'matching key/value identifiers',
              );
            }
            return lhs + `${printExpression(property.key, indent + 1)},`;
          } else if (property.computed && property.shorthand) {
            throw new Error(
              'print(): cannot render computed shorthand ObjectProperty',
            );
          } else {
            // TODO: if it's a NumberValue, have to render values like `1.1` as
            // `['1.1']:`.
            lhs = printExpression(property.key, indent + 1);
          }
          return lhs + `: ${printExpression(property.value, indent + 1)},`;
        })
        .join('\n') +
      '\n' +
      printIndent(indent) +
      '}'
    );
  } else if (expression.kind === 'RawExpression') {
    return expression.expression;
  } else if (expression.kind === 'StringValue') {
    return expression.value;
  } else if (expression.kind === 'TernaryExpression') {
    return (
      // TODO: add smarts to use newlines if needed, and only use parens if
      // needed
      '(' +
      printExpression(expression.condition, indent + 1) +
      ' ? ' +
      printExpression(expression.consequent, indent + 1) +
      ' : ' +
      printExpression(expression.alternate, indent + 1) +
      ')'
    );
  } else if (expression.kind === 'UndefinedValue') {
    return 'undefined';
  } else if (expression.kind === 'YieldExpression') {
    if (expression.expression) {
      return `yield ${printExpression(expression.expression, indent)}`;
    } else {
      return 'yield';
    }
  } else {
    unreachable(expression);
  }
}

function printFunctionExpression(
  expression: FunctionExpression,
  indent: number,
  options: {useKeyword: boolean} = {useKeyword: false},
): string {
  const name = expression.name ?? '';
  return (
    (options.useKeyword ? `function ${name}(` : `${name}(`) +
    expression.arguments
      .map((argument) => printArgument(argument, indent))
      .join(', ') +
    ') {\n' +
    expression.body
      .map((statement) => printStatement(statement, indent + 1))
      .join('') +
    printIndent(indent) +
    '}\n'
  );
}

function printIndent(indent: number): string {
  return ' '.repeat(indent * TAB_WIDTH);
}

function printMethodDefinition(
  definition: MethodDefinition,
  indent: number,
): string {
  return (
    printIndent(indent) +
    printExpression(definition.key, indent) +
    printFunctionExpression(definition.value, indent)
  );
}

function printPropertyDeclaration(
  declaration: PropertyDeclaration,
  indent: number,
): string {
  return printIndent(indent) + `${declaration.name}: ${declaration.type};\n`;
}

function printStatement(statement: Statement, indent: number): string {
  if (statement.kind === 'AssignmentStatement') {
    const binding = statement.binding ? `${statement.binding} ` : '';
    return (
      printIndent(indent) +
      binding +
      printExpression(statement.lhs, indent + 1) +
      ' = ' +
      printExpression(statement.rhs, indent + 1) +
      ';\n'
    );
  } else if (statement.kind === 'BreakStatement') {
    if (statement.label) {
      return printIndent(indent) + `break ${statement.label};\n`;
    } else {
      return printIndent(indent) + 'break;\n';
    }
  } else if (statement.kind === 'ClassDeclaration') {
    return printClass(statement.id, statement.body, indent) + '\n';
  } else if (statement.kind === 'ContinueStatement') {
    if (statement.label) {
      return printIndent(indent) + `continue ${statement.label};\n`;
    } else {
      return printIndent(indent) + 'continue;\n';
    }
  } else if (statement.kind === 'DocComment') {
    return [
      printIndent(indent) + '/**',
      statement.contents.map(
        (line) => printIndent(indent) + [' *', line].filter(Boolean).join(' '),
      ),
      printIndent(indent) + ' */\n',
    ]
      .flat()
      .join('\n');
  } else if (statement.kind === 'EmptyStatement') {
    return printIndent(indent) + '/* Empty. */;\n';
  } else if (statement.kind === 'ExportDefaultDeclaration') {
    return (
      printIndent(indent) +
      'export default ' +
      printStatement(statement.declaration, indent).trimStart()
    );
  } else if (statement.kind === 'ExportNamedDeclaration') {
    return (
      printIndent(indent) +
      'export ' +
      printStatement(statement.declaration, indent).trimStart()
    );
  } else if (statement.kind === 'ExpressionStatement') {
    return (
      printIndent(indent) +
      printExpression(statement.expression, indent) +
      ';\n'
    );
  } else if (statement.kind === 'FunctionDeclaration') {
    return (
      printIndent(indent) +
      'function ' +
      statement.name +
      '(' +
      statement.arguments
        .map((argument) => printArgument(argument, indent))
        .join(', ') +
      ') {\n' +
      statement.body
        .map((statement) => {
          return printStatement(statement, indent + 1);
        })
        .join('') +
      printIndent(indent) +
      '}\n'
    );
  } else if (statement.kind === 'IfStatement') {
    const lines = [];
    for (let i = 0; i < statement.consequents.length; i++) {
      const consequent = statement.consequents[i];
      const condition = printExpression(consequent.condition, indent);
      if (i === 0) {
        lines.push(printIndent(indent) + 'if (' + condition + ') {\n');
      } else {
        lines.push(printIndent(indent) + '} else if (' + condition + ') {\n');
      }
      lines.push(
        ...consequent.block.map((statement) => {
          return printStatement(statement, indent + 1);
        }),
      );
    }
    if (statement.alternate) {
      lines.push(printIndent(indent) + '} else {\n');
      lines.push(
        ...statement.alternate.map((alternate) => {
          return printStatement(alternate, indent + 1);
        }),
      );
    }
    lines.push(printIndent(indent) + '}\n');
    return lines.join('');
  } else if (statement.kind === 'ImportStatement') {
    // Sort default specifier, if any, to front.
    // TODO: don't bother with this because dprint may disagree
    const sorted = [...statement.specifiers].sort((a, b) => {
      invariant(
        a.kind !== 'ImportDefaultSpecifier' ||
          b.kind !== 'ImportDefaultSpecifier',
        'An import can only have one default specifier',
      );
      if (a.kind === 'ImportDefaultSpecifier') {
        return -1;
      } else if (b.kind === 'ImportDefaultSpecifier') {
        return 1;
      } else {
        return a.local.name.localeCompare(b.local.name, 'en');
      }
    });

    let emittedOpeningBrace = false;
    const specifiers = sorted.map((specifier, i) => {
      let isLast = i === sorted.length - 1;
      let openingBrace = emittedOpeningBrace
        ? ''
        : ((emittedOpeningBrace = true), '{');
      let closingBrace = isLast ? '}' : '';
      if (specifier.kind === 'ImportDefaultSpecifier') {
        return specifier.identifier.name;
      } else {
        if (specifier.local.name !== specifier.imported.name) {
          return `${openingBrace}${specifier.imported.name} as ${specifier.local.name}${closingBrace}`;
        } else {
          return `${openingBrace}${specifier.local.name}${closingBrace}`;
        }
      }
    });

    // Indent should always be zero here, but printing it anyway...
    return (
      printIndent(indent) +
      `import ${specifiers.join(', ')} from ${statement.source.value};` +
      '\n'
    );
  } else if (statement.kind === 'LabelStatement') {
    return (
      printIndent(indent) +
      statement.label +
      ': ' +
      printStatement(statement.statement, indent).trimStart()
    );
  } else if (statement.kind === 'LineComment') {
    return printIndent(indent) + '//' + statement.contents + '\n';
  } else if (statement.kind === 'RawStatement') {
    return statement.statement + '\n';
  } else if (statement.kind === 'ReturnStatement') {
    if (statement.expression) {
      return (
        printIndent(indent) +
        'return ' +
        printExpression(statement.expression, indent) +
        ';\n'
      );
    } else {
      return printIndent(indent) + 'return;\n';
    }
  } else if (statement.kind === 'SwitchStatement') {
    return (
      printIndent(indent) +
      'switch (' +
      printExpression(statement.condition, indent) +
      ') {\n' +
      statement.cases
        .map((switchCase) => {
          return printSwitchCase(switchCase, indent + 1);
        })
        .join('') +
      printIndent(indent) +
      '}\n'
    );
  } else if (statement.kind === 'ThrowStatement') {
    return (
      printIndent(indent) +
      'throw ' +
      printExpression(statement.expression, indent) +
      ';\n'
    );
  } else if (statement.kind === 'WhileStatement') {
    return (
      printIndent(indent) +
      'while (' +
      printExpression(statement.condition, indent) +
      ') {\n' +
      statement.block
        .map((statement) => {
          return printStatement(statement, indent + 1);
        })
        .join('') +
      printIndent(indent) +
      '}\n'
    );
  } else {
    unreachable(statement);
  }
}

// TODO: if declares any block-scoped variables, wrap in curlies
function printSwitchCase(switchCase: SwitchCase, indent: number): string {
  return (
    printIndent(indent) +
    (switchCase.determinant === null
      ? 'default'
      : 'case ' + printExpression(switchCase.determinant, indent)) +
    ':\n' +
    switchCase.block
      .map((statement) => {
        return printStatement(statement, indent + 1);
      })
      .join('')
  );
}
