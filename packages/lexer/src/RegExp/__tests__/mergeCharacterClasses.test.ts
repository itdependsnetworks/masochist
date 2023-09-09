import {describe, expect, it} from 'bun:test';

import RegExpParser from '../RegExpParser';
import mergeCharacterClasses from '../mergeCharacterClasses';

describe('mergeCharacterClasses()', () => {
  it('merges character classes within an alternate', () => {
    expect(merge(/[aj1]|[5wz]/)).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: '1'},
        {kind: 'Atom', value: '5'},
        {kind: 'Atom', value: 'a'},
        {kind: 'Atom', value: 'j'},
        {kind: 'Atom', value: 'w'},
        {kind: 'Atom', value: 'z'},
      ],
      negated: false,
    });
  });

  it('merges alternates with heterogenous children', () => {
    expect(merge(/[aj1]|foo|[5wz]/)).toEqual({
      kind: 'Alternate',
      children: [
        {
          kind: 'Sequence',
          children: [
            {kind: 'Atom', value: 'f'},
            {kind: 'Atom', value: 'o'},
            {kind: 'Atom', value: 'o'},
          ],
        },
        {
          kind: 'CharacterClass',
          children: [
            {kind: 'Atom', value: '1'},
            {kind: 'Atom', value: '5'},
            {kind: 'Atom', value: 'a'},
            {kind: 'Atom', value: 'j'},
            {kind: 'Atom', value: 'w'},
            {kind: 'Atom', value: 'z'},
          ],
          negated: false,
        },
      ],
    });
  });

  it('does not merge if a character class has a quantifier', () => {
    expect(merge(/[aj1]|[5wz]+/)).toEqual({
      kind: 'Alternate',
      children: [
        {
          kind: 'CharacterClass',
          children: [
            {kind: 'Atom', value: '1'},
            {kind: 'Atom', value: 'a'},
            {kind: 'Atom', value: 'j'},
          ],
          negated: false,
        },
        {
          kind: 'Repeat',
          child: {
            kind: 'CharacterClass',
            children: [
              {kind: 'Atom', value: '5'},
              {kind: 'Atom', value: 'w'},
              {kind: 'Atom', value: 'z'},
            ],
            negated: false,
          },
          minimum: 1,
          maximum: Infinity,
        },
      ],
    });
  });
});

function merge(regExp: RegExp) {
  const node = new RegExpParser(regExp).parse();
  return mergeCharacterClasses(node);
}
