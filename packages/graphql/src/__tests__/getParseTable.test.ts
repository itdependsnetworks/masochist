// These tests used to live in `@masochist/parser`, where `getParseTable` is
// defined, but they depend on artifacts produced by `@masochist/graphql`, so
// we've moved them in here to avoid a circular dependency.

import {stringifyParseTable} from '@masochist/parser/src/internal';
import {describe, expect, it} from 'bun:test';

import {table} from '../document';

describe('getParseTable()', () => {
  it('returns a ParseTable for the GraphQL grammar', () => {
    expect(stringifyParseTable(table)).toMatchSnapshot();
  });
});
