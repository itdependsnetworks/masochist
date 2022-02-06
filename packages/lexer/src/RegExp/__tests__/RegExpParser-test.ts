import {
  ESCAPED_CHARACTER,
  ESCAPED_UNICODE,
  EXPONENT_PART,
  FRACTIONAL_PART,
  INTEGER_PART,
  LINE_TERMINATOR,
  NAME,
  SOURCE_CHARACTER,
  WHITESPACE,
} from '../../definition';
import RegExpParser from '../RegExpParser';

describe('RegExpParser', () => {
  it('parses a single atom', () => {
    expect(new RegExpParser(/a/).parse()).toEqual({
      kind: 'Atom',
      value: 'a',
    });
  });

  it('parses a sequence of atoms', () => {
    expect(new RegExpParser(/foobar/).parse()).toEqual({
      kind: 'Sequence',
      children: [
        {kind: 'Atom', value: 'f'},
        {kind: 'Atom', value: 'o'},
        {kind: 'Atom', value: 'o'},
        {kind: 'Atom', value: 'b'},
        {kind: 'Atom', value: 'a'},
        {kind: 'Atom', value: 'r'},
      ],
    });
  });

  it('parses a sequence with the "i" flag', () => {
    expect(new RegExpParser(/abc/i).parse()).toEqual({
      kind: 'Sequence',
      children: [
        {
          kind: 'CharacterClass',
          children: [
            {kind: 'Atom', value: 'A'},
            {kind: 'Atom', value: 'a'},
          ],
          negated: false,
        },
        {
          kind: 'CharacterClass',
          children: [
            {kind: 'Atom', value: 'B'},
            {kind: 'Atom', value: 'b'},
          ],
          negated: false,
        },
        {
          kind: 'CharacterClass',
          children: [
            {kind: 'Atom', value: 'C'},
            {kind: 'Atom', value: 'c'},
          ],
          negated: false,
        },
      ],
    });
  });

  it('parses a character class with the "i" flag', () => {
    const expected = {
      kind: 'CharacterClass',
      children: [
        {kind: 'Range', from: 'A', to: 'Z'},
        {kind: 'Range', from: 'a', to: 'z'},
      ],
      negated: false,
    };

    // Note how many different ways of writing a RegExp produce the same
    // result.
    expect(new RegExpParser(/[A-Z]/i).parse()).toEqual(expected);
    expect(new RegExpParser(/[a-z]/i).parse()).toEqual(expected);
    expect(new RegExpParser(/[A-Za-z]/i).parse()).toEqual(expected);
    expect(new RegExpParser(/[a-zA-Z]/i).parse()).toEqual(expected);
    expect(new RegExpParser(/[A-Za-z]/).parse()).toEqual(expected);
    expect(new RegExpParser(/[a-zA-Z]/).parse()).toEqual(expected);
  });

  it('parses alternates', () => {
    expect(new RegExpParser(/a|b/).parse()).toEqual({
      kind: 'Alternate',
      children: [
        {
          kind: 'Atom',
          value: 'a',
        },
        {
          kind: 'Atom',
          value: 'b',
        },
      ],
    });

    expect(new RegExpParser(/foo|bar/).parse()).toEqual({
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
          kind: 'Sequence',
          children: [
            {kind: 'Atom', value: 'b'},
            {kind: 'Atom', value: 'a'},
            {kind: 'Atom', value: 'r'},
          ],
        },
      ],
    });
  });

  it('parses a simple group', () => {
    expect(new RegExpParser(/(a)/).parse()).toEqual({
      kind: 'Atom',
      value: 'a',
    });
  });

  it('parses a group containing a sequence of atoms', () => {
    expect(new RegExpParser(/(foobar)/).parse()).toEqual({
      kind: 'Sequence',
      children: [
        {kind: 'Atom', value: 'f'},
        {kind: 'Atom', value: 'o'},
        {kind: 'Atom', value: 'o'},
        {kind: 'Atom', value: 'b'},
        {kind: 'Atom', value: 'a'},
        {kind: 'Atom', value: 'r'},
      ],
    });
  });

  it('parses a group with repetition', () => {
    expect(new RegExpParser(/(foo)+/).parse()).toEqual({
      kind: 'Repeat',
      minimum: 1,
      maximum: Infinity,
      child: {
        kind: 'Sequence',
        children: [
          {kind: 'Atom', value: 'f'},
          {kind: 'Atom', value: 'o'},
          {kind: 'Atom', value: 'o'},
        ],
      },
    });
  });

  it('simplifies nested groups', () => {
    expect(new RegExpParser(/((a))/).parse()).toEqual({
      kind: 'Atom',
      value: 'a',
    });
    expect(new RegExpParser(/((((((a))))))/).parse()).toEqual({
      kind: 'Atom',
      value: 'a',
    });
  });

  it('parses "."', () => {
    expect(new RegExpParser(/./).parse()).toEqual({
      kind: 'Anything',
    });
  });

  it('parses ".+"', () => {
    expect(new RegExpParser(/.+/).parse()).toEqual({
      kind: 'Repeat',
      minimum: 1,
      maximum: Infinity,
      child: {kind: 'Anything'},
    });
  });

  it('parses ".*"', () => {
    expect(new RegExpParser(/.*/).parse()).toEqual({
      kind: 'Repeat',
      minimum: 0,
      maximum: Infinity,
      child: {kind: 'Anything'},
    });
  });

  it('parses ".?"', () => {
    expect(new RegExpParser(/.?/).parse()).toEqual({
      kind: 'Repeat',
      minimum: 0,
      maximum: 1,
      child: {kind: 'Anything'},
    });
  });

  it('parses ".{3}"', () => {
    expect(new RegExpParser(/.{3}/).parse()).toEqual({
      kind: 'Repeat',
      minimum: 3,
      maximum: 3,
      child: {kind: 'Anything'},
    });
  });

  it('parses ".{2,}"', () => {
    expect(new RegExpParser(/.{2,}/).parse()).toEqual({
      kind: 'Repeat',
      minimum: 2,
      maximum: Infinity,
      child: {kind: 'Anything'},
    });
  });

  it('parses ".{2,7}"', () => {
    expect(new RegExpParser(/.{2,7}/).parse()).toEqual({
      kind: 'Repeat',
      minimum: 2,
      maximum: 7,
      child: {kind: 'Anything'},
    });
  });

  it('parses "\\w"', () => {
    expect(new RegExpParser(/\w/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Range', from: 'A', to: 'Z'},
        {kind: 'Range', from: 'a', to: 'z'},
        {kind: 'Range', from: '0', to: '9'},
        {kind: 'Atom', value: '_'},
      ],
      negated: false,
    });
  });

  it('parses "\\W"', () => {
    expect(new RegExpParser(/\W/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Range', from: 'A', to: 'Z'},
        {kind: 'Range', from: 'a', to: 'z'},
        {kind: 'Range', from: '0', to: '9'},
        {kind: 'Atom', value: '_'},
      ],
      negated: true,
    });
  });

  it('parses "\\n"', () => {
    expect(new RegExpParser(/\n/).parse()).toEqual({
      kind: 'Atom',
      value: '\n',
    });
  });

  it('parses "\\."', () => {
    expect(new RegExpParser(/\./).parse()).toEqual({
      kind: 'Atom',
      value: '.',
    });
  });

  it('parses a simple character class', () => {
    expect(new RegExpParser(/[ajz]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: 'a'},
        {kind: 'Atom', value: 'j'},
        {kind: 'Atom', value: 'z'},
      ],
      negated: false,
    });
  });

  // TODO: probably want an optimizing function that instead expresses this
  // using negation; eg:
  //
  //  {
  //    kind: 'CharacterClass',
  //    children: [
  //      {kind: 'Atom', value: 'a'},
  //      {kind: 'Atom', value: 'j'},
  //      {kind: 'Atom', value: 'z'},
  //    ],
  //    negated: true,
  //  }
  //
  // if it is more economical to do so.
  it('parses a negated simple character class', () => {
    expect(new RegExpParser(/[^ajz]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        // {kind: 'Atom', value: 'a'},
        // {kind: 'Atom', value: 'j'},
        // {kind: 'Atom', value: 'z'},
        {kind: 'Range', from: '\u0000', to: '`'},
        {kind: 'Range', from: 'b', to: 'i'},
        {kind: 'Range', from: 'k', to: 'y'},
        {kind: 'Range', from: '{', to: '\uffff'},
      ],
      negated: false,
    });
  });

  it('parses a character class containing a range', () => {
    expect(new RegExpParser(/[adft-z]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: 'a'},
        {kind: 'Atom', value: 'd'},
        {kind: 'Atom', value: 'f'},
        {kind: 'Range', from: 't', to: 'z'},
      ],
      negated: false,
    });
  });

  it('parses a negated character class containing a range', () => {
    expect(new RegExpParser(/[^adft-z]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Range', from: '\u0000', to: '`'},
        {kind: 'Range', from: 'b', to: 'c'},
        {kind: 'Atom', value: 'e'},
        {kind: 'Range', from: 'g', to: 's'},
        {kind: 'Range', from: '{', to: '\uffff'},
      ],
      negated: false,
    });
  });

  it('treats "^" as a literal "^" when not the first thing in a character class', () => {
    expect(new RegExpParser(/[a^1]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: '1'},
        {kind: 'Atom', value: '^'},
        {kind: 'Atom', value: 'a'},
      ],
      negated: false,
    });
  });

  it('treats "." as a literal "." when inside a character class', () => {
    expect(new RegExpParser(/[a1.]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: '.'},
        {kind: 'Atom', value: '1'},
        {kind: 'Atom', value: 'a'},
      ],
      negated: false,
    });
  });

  it('treats "-" as a literal "-" at the start of a character class', () => {
    expect(new RegExpParser(/[-a5]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: '-'},
        {kind: 'Atom', value: '5'},
        {kind: 'Atom', value: 'a'},
      ],
      negated: false,
    });
  });

  it('treats "-" as a literal "-" at the end of a character class', () => {
    expect(new RegExpParser(/[a5-]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: '-'},
        {kind: 'Atom', value: '5'},
        {kind: 'Atom', value: 'a'},
      ],
      negated: false,
    });
  });

  it('simplifies a character class containing only one atom', () => {
    expect(new RegExpParser(/[x]/).parse()).toEqual({
      kind: 'Atom',
      value: 'x',
    });
  });

  it('simplifies a character class containing only one range', () => {
    expect(new RegExpParser(/[d-m]/).parse()).toEqual({
      kind: 'Range',
      from: 'd',
      to: 'm',
    });
  });

  it('simplifies a character class with a range containing one atom', () => {
    expect(new RegExpParser(/[b-b]/).parse()).toEqual({
      kind: 'Atom',
      value: 'b',
    });
  });

  it('parses a range with the "i" flag', () => {
    expect(new RegExpParser(/[X-c]/i).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Range', from: 'A', to: 'C'},
        {kind: 'Range', from: 'X', to: 'c'},
        {kind: 'Range', from: 'x', to: 'z'},
      ],
      negated: false,
    });
  });

  it('parses an atom followed by "+"', () => {
    expect(new RegExpParser(/foo+/).parse()).toEqual({
      kind: 'Sequence',
      children: [
        {kind: 'Atom', value: 'f'},
        {kind: 'Atom', value: 'o'},
        {
          kind: 'Repeat',
          minimum: 1,
          maximum: Infinity,
          child: {kind: 'Atom', value: 'o'},
        },
      ],
    });
  });

  it('complains if a "^" boundary assertion is used', () => {
    expect(() => new RegExpParser(/^foo/).parse()).toThrow(
      /boundary assertions are not supported/,
    );

    // Note that assertions are prohibited anywhere in the pattern.
    expect(() => new RegExpParser(/foo^bar/).parse()).toThrow(
      /boundary assertions are not supported/,
    );

    // But escaped versions are fine.
    expect(new RegExpParser(/\^foo/).parse()).toEqual({
      kind: 'Sequence',
      children: [
        {kind: 'Atom', value: '^'},
        {kind: 'Atom', value: 'f'},
        {kind: 'Atom', value: 'o'},
        {kind: 'Atom', value: 'o'},
      ],
    });

    // And it's ok inside character classes.
    expect(new RegExpParser(/[a^]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: '^'},
        {kind: 'Atom', value: 'a'},
      ],
      negated: false,
    });
  });

  it('complains if a "$" boundary assertion is used', () => {
    expect(() => new RegExpParser(/foo$/).parse()).toThrow(
      /boundary assertions are not supported/,
    );

    // Note that assertions are prohibited anywhere in the pattern.
    expect(() => new RegExpParser(/foo$bar/).parse()).toThrow(
      /boundary assertions are not supported/,
    );

    // But escaped versions are fine.
    expect(new RegExpParser(/foo\$/).parse()).toEqual({
      kind: 'Sequence',
      children: [
        {kind: 'Atom', value: 'f'},
        {kind: 'Atom', value: 'o'},
        {kind: 'Atom', value: 'o'},
        {kind: 'Atom', value: '$'},
      ],
    });

    // And it's ok inside character classes.
    expect(new RegExpParser(/[$abc]/).parse()).toEqual({
      kind: 'CharacterClass',
      children: [
        {kind: 'Atom', value: '$'},
        {kind: 'Range', from: 'a', to: 'c'},
      ],
      negated: false,
    });
  });

  describe('real-world examples', () => {
    it('matches ESCAPED_CHARACTER RegExp', () => {
      expect(new RegExpParser(ESCAPED_CHARACTER).parse())
        .toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "kind": "Atom",
              "value": "\\\\",
            },
            Object {
              "children": Array [
                Object {
                  "kind": "Atom",
                  "value": "\\"",
                },
                Object {
                  "kind": "Atom",
                  "value": "/",
                },
                Object {
                  "kind": "Atom",
                  "value": "\\\\",
                },
                Object {
                  "kind": "Atom",
                  "value": "b",
                },
                Object {
                  "kind": "Atom",
                  "value": "f",
                },
                Object {
                  "kind": "Atom",
                  "value": "n",
                },
                Object {
                  "kind": "Atom",
                  "value": "r",
                },
                Object {
                  "kind": "Atom",
                  "value": "t",
                },
              ],
              "kind": "CharacterClass",
              "negated": false,
            },
          ],
          "kind": "Sequence",
        }
      `);
    });

    it('matches ESCAPED_UNICODE RegExp', () => {
      expect(new RegExpParser(ESCAPED_UNICODE).parse()).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "kind": "Atom",
              "value": "\\\\",
            },
            Object {
              "kind": "Atom",
              "value": "u",
            },
            Object {
              "child": Object {
                "children": Array [
                  Object {
                    "from": "0",
                    "kind": "Range",
                    "to": "9",
                  },
                  Object {
                    "from": "A",
                    "kind": "Range",
                    "to": "F",
                  },
                  Object {
                    "from": "a",
                    "kind": "Range",
                    "to": "f",
                  },
                ],
                "kind": "CharacterClass",
                "negated": false,
              },
              "kind": "Repeat",
              "maximum": 4,
              "minimum": 4,
            },
          ],
          "kind": "Sequence",
        }
      `);
    });

    it('matches EXPONENT_PART RegExp', () => {
      expect(new RegExpParser(EXPONENT_PART).parse()).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "kind": "Atom",
                  "value": "E",
                },
                Object {
                  "kind": "Atom",
                  "value": "e",
                },
              ],
              "kind": "CharacterClass",
              "negated": false,
            },
            Object {
              "child": Object {
                "children": Array [
                  Object {
                    "kind": "Atom",
                    "value": "+",
                  },
                  Object {
                    "kind": "Atom",
                    "value": "-",
                  },
                ],
                "kind": "CharacterClass",
                "negated": false,
              },
              "kind": "Repeat",
              "maximum": 1,
              "minimum": 0,
            },
            Object {
              "child": Object {
                "from": "0",
                "kind": "Range",
                "to": "9",
              },
              "kind": "Repeat",
              "maximum": Infinity,
              "minimum": 1,
            },
          ],
          "kind": "Sequence",
        }
      `);
    });

    it('matches FRACTIONAL_PART RegExp', () => {
      expect(new RegExpParser(FRACTIONAL_PART).parse()).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "kind": "Atom",
              "value": ".",
            },
            Object {
              "child": Object {
                "from": "0",
                "kind": "Range",
                "to": "9",
              },
              "kind": "Repeat",
              "maximum": Infinity,
              "minimum": 1,
            },
          ],
          "kind": "Sequence",
        }
      `);
    });

    it('matches INTEGER_PART RegExp', () => {
      expect(new RegExpParser(INTEGER_PART).parse()).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "child": Object {
                "kind": "Atom",
                "value": "-",
              },
              "kind": "Repeat",
              "maximum": 1,
              "minimum": 0,
            },
            Object {
              "children": Array [
                Object {
                  "kind": "Atom",
                  "value": "0",
                },
                Object {
                  "children": Array [
                    Object {
                      "from": "1",
                      "kind": "Range",
                      "to": "9",
                    },
                    Object {
                      "child": Object {
                        "from": "0",
                        "kind": "Range",
                        "to": "9",
                      },
                      "kind": "Repeat",
                      "maximum": Infinity,
                      "minimum": 0,
                    },
                  ],
                  "kind": "Sequence",
                },
              ],
              "kind": "Alternate",
            },
          ],
          "kind": "Sequence",
        }
      `);
    });

    it('matches LINE_TERMINATOR RegExp', () => {
      expect(new RegExpParser(LINE_TERMINATOR).parse()).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "kind": "Atom",
              "value": "
        ",
            },
            Object {
              "children": Array [
                Object {
                  "kind": "Atom",
                  "value": "
        ",
                },
                Object {
                  "kind": "Atom",
                  "value": "
        ",
                },
              ],
              "kind": "Sequence",
            },
            Object {
              "kind": "Atom",
              "value": "
        ",
            },
          ],
          "kind": "Alternate",
        }
      `);
    });

    it('matches NAME RegExp', () => {
      expect(new RegExpParser(NAME).parse()).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "from": "A",
                  "kind": "Range",
                  "to": "Z",
                },
                Object {
                  "kind": "Atom",
                  "value": "_",
                },
                Object {
                  "from": "a",
                  "kind": "Range",
                  "to": "z",
                },
              ],
              "kind": "CharacterClass",
              "negated": false,
            },
            Object {
              "child": Object {
                "children": Array [
                  Object {
                    "from": "0",
                    "kind": "Range",
                    "to": "9",
                  },
                  Object {
                    "from": "A",
                    "kind": "Range",
                    "to": "Z",
                  },
                  Object {
                    "kind": "Atom",
                    "value": "_",
                  },
                  Object {
                    "from": "a",
                    "kind": "Range",
                    "to": "z",
                  },
                ],
                "kind": "CharacterClass",
                "negated": false,
              },
              "kind": "Repeat",
              "maximum": Infinity,
              "minimum": 0,
            },
          ],
          "kind": "Sequence",
        }
      `);
    });

    it('matches SOURCE_CHARACTER RegExp', () => {
      expect(new RegExpParser(SOURCE_CHARACTER).parse()).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "from": "	",
              "kind": "Range",
              "to": "
        ",
            },
            Object {
              "kind": "Atom",
              "value": "
        ",
            },
            Object {
              "from": " ",
              "kind": "Range",
              "to": "￿",
            },
          ],
          "kind": "CharacterClass",
          "negated": false,
        }
      `);
    });

    it('matches WHITESPACE RegExp', () => {
      expect(new RegExpParser(WHITESPACE).parse()).toMatchInlineSnapshot(`
        Object {
          "child": Object {
            "children": Array [
              Object {
                "kind": "Atom",
                "value": "	",
              },
              Object {
                "kind": "Atom",
                "value": " ",
              },
            ],
            "kind": "CharacterClass",
            "negated": false,
          },
          "kind": "Repeat",
          "maximum": Infinity,
          "minimum": 1,
        }
      `);
    });
  });

  describe('regression tests', () => {
    it('handles Unicode escapes inside ranges inside character classes', () => {
      expect(new RegExpParser(/[\u0020-\uffff]/).parse()).toEqual({
        kind: 'Range',
        from: '\u0020',
        to: '\uffff',
      });
    });
  });
});
