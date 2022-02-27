import {StringScanner, invariant} from '@masochist/common';
import vm from 'vm';

import {RIGHTWARDS_ARROW} from './Grammar';
import getAugmentedGrammar from './getAugmentedGrammar';
import getFollowSets from './getFollowSets';
import groupRulesByLHS from './groupRulesByLHS';

// Goal is to produce an LALR(1) parser from a grammar.

import type {Grammar} from './Grammar';

// TODO: Apart from the augmented rule, could avoid storing `lhs`/`rhs` and instead just store index of rule in original grammar.
type Item = {
  lhs: string;
  rhs: Array<string>;
  dot: number;
};

export type ItemSet = {
  items: Array<Item>;
  transitions: {[symbol: string]: number};
};

const MIDDLE_DOT = '\xb7';

/**
 * Based on: https://spec.graphql.org/October2021/#sec-Document-Syntax
 */
/*
export const grammar: Grammar = {
  tokens: new Set(['CLOSING_BRACE', 'NAME', 'OPENING_BRACE']),
  rules: [
    {lhs: 'Document', rhs: ['DefinitionList']},
    {lhs: 'DefinitionList', rhs: ['Definition']},
    {
      lhs: 'DefinitionList',
      rhs: ['DefinitionList', 'Definition'],
      action: '{ $$ = [...$1, $2] }',
    },
    {lhs: 'Definition', rhs: ['ExecutableDefinition']},
    {lhs: 'ExecutableDefinition', rhs: ['OperationDefinition']},
    {lhs: 'OperationDefinition', rhs: ['SelectionSet']},
    {
      lhs: 'SelectionSet',
      rhs: ['OPENING_BRACE', 'SelectionList', 'CLOSING_BRACE'],
    },
    {lhs: 'SelectionList', rhs: ['Selection']},
    {
      lhs: 'SelectionList',
      rhs: ['SelectionList', 'Selection'],
      action: '{ $$ = [...$1, $2] }',
    },
    {lhs: 'Selection', rhs: ['Field']},
    {lhs: 'Field', rhs: ['NAME']},
  ],
};
*/

/*
export const grammarDeclaration = `
    %token CLOSING_BRACE NAME OPENING_BRACE

    Document → DefinitionList
    DefinitionList → Definition
    DefinitionList → DefinitionList Definition { $$ = [...$1, $2] }
    Definition → ExecutableDefinition
    ExecutableDefinition → OperationDefinition
    OperationDefinition → SelectionSet
    SelectionSet → OPENING_BRACE SelectionList CLOSING_BRACE
    SelectionList → Selection
    SelectionList → SelectionList Selection { $$ = [...$1, $2] }
    Selection → Field
    Field → NAME
`;
*/

export function getItemSets(grammar: Grammar) {
  const tokens = grammar.tokens;
  const rules = groupRulesByLHS(grammar);
  const augmentedGrammar = getAugmentedGrammar(grammar);
  const startRule = augmentedGrammar.rules[0];

  const i0: ItemSet = {
    items: [
      {
        lhs: startRule.lhs,
        rhs: startRule.rhs,
        dot: 0,
      },
    ],
    transitions: {},
  };

  const itemSets: {[key: string]: ItemSet} = {};

  // For each item in `itemSet`, add any non-terminals that appear after dots.
  function close(itemSet: ItemSet) {
    const added = new Set();
    for (const item of itemSet.items) {
      const key = keyForItem(item);
      added.add(key);
    }

    function add(symbol: string) {
      if (!tokens.has(symbol)) {
        for (const rhs of rules[symbol]) {
          const newItem: Item = {
            lhs: symbol,
            rhs,
            dot: 0,
          };
          const key = keyForItem(newItem);
          if (!added.has(key)) {
            added.add(key);
            itemSet.items.push(newItem);
            add(rhs[0]);
          }
        }
      }
    }

    for (let i = 0; i < itemSet.items.length; i++) {
      const item = itemSet.items[i];
      if (item.dot < item.rhs.length) {
        add(item.rhs[item.dot]);
      }
    }
  }

  close(i0);

  itemSets[keyForItemSet(i0)] = i0;

  const processedItemSets = new Set<ItemSet>();

  while (true) {
    let addedSetCount = 0;

    for (const itemSet of Object.values(itemSets)) {
      if (processedItemSets.has(itemSet)) {
        continue;
      }

      processedItemSets.add(itemSet);

      const processedTransitions = new Set<string>();

      for (const item of itemSet.items) {
        const next = item.rhs[item.dot];
        if (next && !processedTransitions.has(next)) {
          processedTransitions.add(next);

          // Create new item set.
          const newItemSet: ItemSet = {
            items: [],
            transitions: {},
          };

          // Get all rules where dot is followed by `next`.
          for (const item of itemSet.items) {
            if (item.rhs[item.dot] === next) {
              newItemSet.items.push({
                lhs: item.lhs,
                rhs: item.rhs,
                dot: item.dot + 1,
              });
            }
          }

          close(newItemSet);

          const key = keyForItemSet(newItemSet);
          let index;

          if (itemSets[key]) {
            // Add transition to existing set.
            index = Object.keys(itemSets).indexOf(key);
          } else {
            // Add new set.
            index = Object.keys(itemSets).length;
            itemSets[key] = newItemSet;
            addedSetCount++;
          }

          itemSet.transitions[next] = index;
        }
      }
    }

    if (!addedSetCount) {
      break;
    }
  }

  return Object.values(itemSets);
}

/**
 * Turns a rule like:
 *
 *     A -> B C
 *
 * into a rule with start and end states annotated:
 *
 *      A   ->   B     C
 *     0 4      0 2   2 7
 *
 * In this example, the rule is in item set 0, and transitions on A to 4, on B
 * to 2, and from C (in item set 2) to 7.
 */
export function extendedGrammarForItemSets(
  itemSets: Array<ItemSet>,
  grammar: Grammar,
): Grammar {
  const rules = [];
  const tokens = new Set<string>();
  const originalTokens = grammar.tokens;
  for (let i = 0; i < itemSets.length; i++) {
    const itemSet = itemSets[i];
    for (const item of itemSet.items) {
      if (item.dot === 0) {
        const target = itemSet.transitions[item.lhs];
        const lhs = `${i}/${item.lhs}/${target ?? '$'}`;

        let current = i;
        const rhs = item.rhs.map((symbol) => {
          const target = itemSets[current].transitions[symbol];
          const annotated = `${current}/${symbol}/${target}`;
          if (originalTokens.has(symbol)) {
            tokens.add(annotated);
          }
          current = target;
          return annotated;
        });

        rules.push({lhs, rhs});
      }
    }
  }

  return {
    rules,
    tokens,
  };
}

type Action =
  | {
      kind: 'Accept';
    }
  | {
      kind: 'Reduce';
      rule: number;
    }
  | {
      kind: 'Shift';
      state: number;
    };

type Actions = {
  [terminal: string]: Action | undefined;
};

type Gotos = {
  [nonTerminal: string]: number | null;
};

type ParseTable = Array<[Actions, Gotos]>;

export function getParseTable(
  itemSets: Array<ItemSet>,
  transitionTable: TransitionTable,
  grammar: Grammar,
): ParseTable {
  const extendedGrammar = extendedGrammarForItemSets(itemSets, grammar);
  const augmentedGrammar = getAugmentedGrammar(grammar);
  const startRule = augmentedGrammar.rules[0];
  const tokens = grammar.tokens;

  const table: ParseTable = [];

  // Add `Accept` action for `$` (EOF) symbol where item set contains start
  // rule with dot at the end.
  let acceptCount = 0;
  for (const itemSet of itemSets) {
    const actions: Actions = {};
    const gotos: Gotos = {};

    for (const {lhs, rhs, dot} of itemSet.items) {
      if (lhs === startRule.lhs && dot === rhs.length) {
        actions['$'] = {kind: 'Accept'};

        // We could break here, but instead we're going to integrity-check that
        // there is only one accept state at the end.
        acceptCount++;
      }
    }

    table.push([actions, gotos]);
  }
  invariant(acceptCount === 1, `acceptCount (${acceptCount}) must be 1`);

  // Copy non-terminals from transition table to gotos.
  transitionTable.forEach((transitions, source) => {
    for (const [symbol, target] of Object.entries(transitions)) {
      invariant(target);
      if (!tokens.has(symbol)) {
        const gotos = table[source][1];
        gotos[symbol] = target;
      }
    }
  });

  // Copy terminals from transition table as shift actions.
  transitionTable.forEach((transitions, source) => {
    for (const [symbol, target] of Object.entries(transitions)) {
      invariant(target);
      if (tokens.has(symbol)) {
        const actions = table[source][0];
        actions[symbol] = {
          kind: 'Shift',
          state: target,
        };
      }
    }
  });

  // Prepare data structure for quick look-up of rule indices.
  const ruleIndices: {[ruleString: string]: number} = {};
  augmentedGrammar.rules.forEach(({lhs, rhs}, i) => {
    ruleIndices[keyForRule(lhs, rhs)] = i;
  });

  // Map follow sets to extended grammar rules.
  const follows = getFollowSets(extendedGrammar);
  for (const rule of extendedGrammar.rules) {
    const [, lhs, end] = rule.lhs.split('/');
    if (end === '$') {
      continue; // "$"/EOF was already handled above.
    }

    const rhs = rule.rhs.map((symbol) => {
      const [, rhs] = symbol.split('/');
      return rhs;
    });

    // Get the item set from the original grammar that corresponds to extended
    // grammar rule.
    const itemSet = rule.rhs[rule.rhs.length - 1].split('/')[2];

    const ruleNumber = ruleIndices[keyForRule(lhs, rhs)];
    const actions = table[parseInt(itemSet, 10)][0];
    for (const follow of follows[rule.lhs]) {
      const [, symbol] = (follow ?? '0/$/0').split('/');
      const action = actions[symbol];
      if (action) {
        if (
          action.kind === 'Accept' ||
          (action.kind === 'Reduce' && action.rule !== ruleNumber) ||
          action.kind === 'Shift'
        ) {
          throw new Error(
            `getParseTable(): ${action.kind}/Reduce conflict - ` +
              `existing ${action.kind} (${
                action.kind === 'Reduce'
                  ? action.rule
                  : action.kind === 'Shift'
                  ? action.state
                  : 'n/a'
              }) for state ${itemSet} ` +
              `processing rule: ${lhs} ${RIGHTWARDS_ARROW} ${rhs.join(' ')}`,
          );
        }
      } else {
        actions[symbol] = {kind: 'Reduce', rule: ruleNumber};
      }
    }
  }

  return table;
}

type ParseTree = {
  kind: string;
  children: Array<ParseTree | Token>;
};

/**
 * For use in tests.
 */
export type Token = {
  name: string;
  contents?: string;
};

function assertParseTreeOrToken(
  node: ParseTree | Token | number | undefined,
): asserts node is ParseTree | Token {
  invariant(node);
  invariant(typeof node !== 'number');
}

function assertParseTree(
  node: ParseTree | Token | number | undefined,
): asserts node is ParseTree {
  invariant(node);
  invariant(typeof node !== 'number');
  invariant(Object.hasOwnProperty.call(node, 'kind'));
}

/**
 * Dynamically parse using supplied parse table.
 *
 * For testing purposes only; for "real" parsers we want to write out a static
 * (generated) parser artifact with proper type info, actions, and so on.
 */
export function parseWithTable(
  table: ParseTable,
  tokens: Array<Token>,
  grammar: Grammar,
): ParseTree {
  const augmentedGrammar = getAugmentedGrammar(grammar);
  const stack: Array<ParseTree | Token | number> = [0];
  let pointer = 0;

  const context = vm.createContext({$$: undefined});

  while (pointer <= tokens.length) {
    const current = stack[stack.length - 1];
    invariant(typeof current === 'number' && current < table.length);

    const [actions] = table[current];
    const token = tokens[pointer] ?? {name: '$'};

    const action = actions[token.name];

    if (!action) {
      throw new Error(
        `parseWithTable(): Syntax error (no action for ${token.name} (token index ${pointer}) in state ${current})`,
      );
    } else if (action.kind === 'Accept') {
      invariant(pointer === tokens.length);

      // Expect initial state (0) + production + accept state
      // (ie. extra because we're using an augmented grammar).
      invariant(stack.length === 3);
      const tree = stack[1];
      assertParseTree(tree);
      return tree;
    } else if (action.kind === 'Shift') {
      stack.push(token, action.state);
      pointer++;
    } else if (action.kind === 'Reduce') {
      const {lhs, rhs, action: code} = augmentedGrammar.rules[action.rule];
      const popped = [];
      for (let i = 0; i < rhs.length; i++) {
        stack.pop(); // State number.
        const node = stack.pop();
        assertParseTreeOrToken(node);
        // TODO: if we have an action, don't set items that aren't used in the action
        popped[rhs.length - i - 1] = node; // Production.
      }
      const next = stack[stack.length - 1];
      invariant(typeof next === 'number' && next < table.length);
      const [, gotos] = table[next];
      const target = gotos[lhs];
      invariant(target);
      if (code) {
        // TODO: in a real implementation of this, would cache this instead of
        // re-scanning it every time.
        const scanner = new StringScanner(code);
        while (!scanner.atEnd) {
          scanner.scan(/[^$]+/);
          if (scanner.scan('$')) {
            const variable = scanner.scan(/\d+/);
            if (variable) {
              context[`$${variable}`] = popped[parseInt(variable, 10) - 1];
            } else if (!scanner.scan(/\$/)) {
              throw new Error(`parseWithTable(): Bad action - ${code}`);
            }
          }
        }
        context.$$ = undefined;
        vm.runInContext(code, context);
        invariant(context.$$, 'production was undefined');
        stack.push(context.$$, target);
      } else {
        stack.push(
          {
            kind: lhs,
            children:
              popped.length === 1 && Array.isArray(popped[0])
                ? popped[0]
                : popped,
          },
          target,
        );
      }
    }
  }

  throw new Error('parseWithTable(): Unreachable');
}

function keyForRule(lhs: string, rhs: Array<string>): string {
  return `${lhs}:${rhs.join('-')}`;
}

function keyForItem(item: Item): string {
  return keyForRule(item.lhs, item.rhs) + `[${item.dot}]`;
}

/**
 * Returns a string that uniquely identifies the core of the supplied `itemSet`.
 *
 * This is used during transition table construction to merge together
 * equivalent sets, preventing an explosion in the number of states.
 */
function keyForItemSet(itemSet: ItemSet): string {
  return itemSet.items.map(keyForItem).sort().join('/');
}

/**
 * Debugging helper.
 */
export function stringifyGrammar(grammar: Grammar): string {
  let output =
    [...grammar.tokens]
      .sort()
      .map((token) => `%token ${token}`)
      .join('\n') + '\n\n';

  output += grammar.rules
    .map(({lhs, rhs, action}, i) => {
      if (action) {
        return `r${i}: ${lhs} ${RIGHTWARDS_ARROW} ${rhs.join(' ')} {${action}}`;
      } else {
        return `r${i}: ${lhs} ${RIGHTWARDS_ARROW} ${rhs.join(' ')}`;
      }
    })
    .join('\n');

  return output + '\n';
}

/**
 * Debugging helper.
 */
export function stringifyItemSets(itemSets: Array<ItemSet>): string {
  let output = '';

  for (let i = 0; i < itemSets.length; i++) {
    const itemSet = itemSets[i];
    output += `I${i}:\n`;

    for (const {lhs, rhs, dot} of itemSet.items) {
      output += `  ${lhs}`;
      output += ` ${RIGHTWARDS_ARROW}`;
      for (let i = 0; i <= rhs.length; i++) {
        if (i === dot) {
          output += ` ${MIDDLE_DOT}`;
        }
        if (i !== rhs.length) {
          output += ` ${rhs[i]}`;
        }
      }
      output += '\n';
    }

    if (i < itemSets.length - 1) {
      output += '\n';
    }
  }

  return output;
}

/**
 * Debugging helper
 */
export function stringifyParseTable(parseTable: ParseTable): string {
  const rows: Array<Array<string>> = [];

  function actionToString(action: Action | null): string {
    if (!action) {
      return ' ';
    } else if (action.kind === 'Accept') {
      return ' accept ';
    } else if (action.kind === 'Shift') {
      return ` s${action.state} `;
    } else if (action.kind === 'Reduce') {
      return ` r${action.rule} `;
    } else {
      throw new Error('actionToString(): Unreachable');
    }
  }

  function gotoToString(target: number | null): string {
    if (typeof target === 'number') {
      return ` ${target.toString()} `;
    } else {
      return ' ';
    }
  }

  const terminals: Array<string> = Array.from(
    parseTable.reduce((acc, [actions]) => {
      for (const action of Object.keys(actions)) {
        acc.add(action);
      }
      return acc;
    }, new Set<string>()),
  ).sort((a, b) => {
    // Make sure "$" goes at the end.
    if (a === '$') {
      return 1;
    } else if (b === '$') {
      return -1;
    } else {
      return a.localeCompare(b, 'en');
    }
  });

  const nonTerminals: Array<string> = Array.from(
    parseTable.reduce((acc, [, gotos]) => {
      for (const goto of Object.keys(gotos)) {
        acc.add(goto);
      }
      return acc;
    }, new Set<string>()),
  ).sort();

  rows.push([
    ' State ',
    ...terminals.map((terminal) => ` ${terminal} `),
    ...nonTerminals.map((nonTerminal) => `${nonTerminal} `),
  ]);

  parseTable.forEach(([actions, gotos], i) => {
    rows.push([
      ` ${i.toString()} `,
      ...terminals.map((key) => actionToString(actions[key] || null)),
      ...nonTerminals.map((key) => gotoToString(gotos[key] || null)),
    ]);
  });

  const widths: Array<number> = new Array(
    1 + terminals.length + nonTerminals.length,
  ).fill(0);

  rows.forEach((row) => {
    widths.forEach((column, i) => {
      widths[i] = Math.max(column, row[i].length);
    });
  });

  const padded = rows.map((columns) => {
    return (
      '|' +
      columns.map((item, i) => item.padStart(widths[i], ' ')).join('|') +
      '|'
    );
  });
  const header = padded.shift();
  const separator =
    '|' + widths.map((width) => '-'.repeat(width)).join('|') + '|';

  return [header, separator, ...padded].join('\n') + '\n';
}
