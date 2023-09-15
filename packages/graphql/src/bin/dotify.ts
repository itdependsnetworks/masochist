/**
 * Generate "interesting" state machine images for DFAs used in the lexer.
 *
 * This script is responsible for generating the ".dot" source files and a
 * README.md that includes the images.
 *
 * The `make diagrams` target runs this script, and then invokes `dot` in
 * parallel to actually generate the actual images.
 */

import {escapeForRegExp} from '@masochist/common';
import {ignore} from '@masochist/lexer';
import {
  compileRegExp,
  NFAToDFA,
  dotifyTransitionTable,
  minimizeDFA,
  regExpToNFA,
  removeEpsilons,
  sortEdges,
  toTransitionTable,
} from '@masochist/lexer/src/internal';
import Bun from 'bun';
import {promises as fs} from 'fs';
import path from 'path';

import {
  default as lexer,
  AMPERSAND,
  AT,
  BANG,
  BAR,
  BLOCK_STRING_VALUE,
  CLOSING_BRACE,
  CLOSING_BRACKET,
  CLOSING_PAREN,
  COLON,
  COMMA,
  COMMENT,
  DOLLAR,
  ELLIPSIS,
  EQUALS,
  ESCAPED_CHARACTER,
  ESCAPED_UNICODE,
  EXPONENT_PART,
  FRACTIONAL_PART,
  INTEGER_PART,
  LINE_TERMINATOR,
  NAME,
  NUMBER,
  OPENING_BRACE,
  OPENING_BRACKET,
  OPENING_PAREN,
  SOURCE_CHARACTER,
  STRING_CHARACTER,
  STRING_VALUE,
  UNICODE_BOM,
  WHITESPACE,
} from '../lexer';

import type {TransitionTable} from '@masochist/lexer';

/**
 * A single (combined) machine that recognizes (and discards) any ignored token.
 */
function ignoredTokens() {
  return ignore(COMMA, COMMENT, LINE_TERMINATOR, UNICODE_BOM, WHITESPACE);
}

function machine(pattern: TransitionTable | RegExp | string) {
  if (typeof pattern === 'string' || pattern instanceof RegExp) {
    const regExp =
      typeof pattern === 'string'
        ? new RegExp(escapeForRegExp(pattern))
        : pattern;

    let nfa = regExpToNFA(compileRegExp(regExp));
    nfa = removeEpsilons(nfa);
    nfa = NFAToDFA(nfa);
    nfa = sortEdges(nfa);
    nfa = minimizeDFA(nfa);
    return toTransitionTable(nfa);
  } else {
    return pattern;
  }
}

async function main() {
  const diagrams = {
    // Composite machines.
    lexer,
    ignored: ignoredTokens(),

    // Individual machines.
    AMPERSAND: machine(AMPERSAND),
    AT: machine(AT),
    BANG: machine(BANG),
    BAR: machine(BAR),
    BLOCK_STRING_VALUE: machine(BLOCK_STRING_VALUE),
    CLOSING_BRACE: machine(CLOSING_BRACE),
    CLOSING_BRACKET: machine(CLOSING_BRACKET),
    CLOSING_PAREN: machine(CLOSING_PAREN),
    COLON: machine(COLON),
    COMMA: machine(COMMA),
    COMMENT: machine(COMMENT),
    DOLLAR: machine(DOLLAR),
    ELLIPSIS: machine(ELLIPSIS),
    EQUALS: machine(EQUALS),
    ESCAPED_CHARACTER: machine(ESCAPED_CHARACTER),
    ESCAPED_UNICODE: machine(ESCAPED_UNICODE),
    EXPONENT_PART: machine(EXPONENT_PART),
    FRACTIONAL_PART: machine(FRACTIONAL_PART),
    INTEGER_PART: machine(INTEGER_PART),
    LINE_TERMINATOR: machine(LINE_TERMINATOR),
    NAME: machine(NAME),
    NUMBER: machine(NUMBER),
    OPENING_BRACE: machine(OPENING_BRACE),
    OPENING_BRACKET: machine(OPENING_BRACKET),
    OPENING_PAREN: machine(OPENING_PAREN),
    SOURCE_CHARACTER: machine(SOURCE_CHARACTER),
    STRING_CHARACTER: machine(STRING_CHARACTER),
    STRING_VALUE: machine(STRING_VALUE),
    UNICODE_BOM: machine(UNICODE_BOM),
    WHITESPACE: machine(WHITESPACE),
  };

  let README = '# `@masochist/graphql` state machine diagrams\n';

  const directory = path.join(
    path.dirname(import.meta.path),
    '..',
    '..',
    'lexer',
    'diagrams',
  );
  await fs.mkdir(directory, {recursive: true});
  for (const [name, table] of Object.entries(diagrams)) {
    for (const dark of [true, false]) {
      const contents = dotifyTransitionTable(table, dark);
      const dot = path.join(
        directory,
        `${name}-${dark ? 'dark' : 'light'}.dot`,
      );
      let current;
      try {
        current = await Bun.file(dot).text();
      } catch {
        // Doesn't exist.
      }
      if (current !== contents) {
        await Bun.write(dot, contents);
      }
    }

    README += '\n';
    README += `## ${name}\n\n`;
    README += `![${name}](./${name}-dark.svg#gh-dark-mode-only)\n`;
    README += `![${name}](./${name}-light.svg#gh-light-mode-only)\n`;
  }

  await Bun.write(path.join(directory, 'README.md'), README);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
