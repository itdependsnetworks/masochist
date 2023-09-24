import {describe, expect, it} from 'bun:test';

import compileRegExp from '../../compileRegExp';
import {ACCEPT, NONE, START} from '../NFA';
import regExpToNFA from '../regExpToNFA';

import type {Flags, NFA} from '../NFA';

describe('regExpToNFA()', () => {
  it('creates an NFA from an atom', () => {
    expect(regExpToNFA(compileRegExp(/a/))).toEqual({
      id: 0,
      flags: START,
      edges: [{
        on: {kind: 'Atom', value: 'a'},
        to: {
          id: 1,
          flags: ACCEPT,
          edges: [],
        },
      }],
    });
  });

  it('creates an NFA from an "anything" dot', () => {
    expect(regExpToNFA(compileRegExp(/./))).toEqual({
      id: 0,
      flags: START,
      edges: [{
        on: {kind: 'Anything'},
        to: {
          id: 1,
          flags: ACCEPT,
          edges: [],
        },
      }],
    });
  });

  it('creates an NFA from a sequence', () => {
    expect(regExpToNFA(compileRegExp(/foo/))).toEqual({
      id: 0,
      flags: START,
      edges: [{
        on: {kind: 'Atom', value: 'f'},
        to: {
          id: 1,
          flags: NONE,
          edges: [{
            on: null,
            to: {
              id: 2,
              flags: NONE,
              edges: [{
                on: {kind: 'Atom', value: 'o'},
                to: {
                  id: 3,
                  flags: NONE,
                  edges: [{
                    on: null,
                    to: {
                      id: 4,
                      flags: NONE,
                      edges: [{
                        on: {kind: 'Atom', value: 'o'},
                        to: {
                          id: 5,
                          flags: ACCEPT,
                          edges: [],
                        },
                      }],
                    },
                  }],
                },
              }],
            },
          }],
        },
      }],
    });
  });

  it('creates an NFA from an alternate', () => {
    expect(regExpToNFA(compileRegExp(/a|b|c/))).toEqual({
      id: 6,
      flags: START,
      edges: [{
        on: null,
        to: {
          id: 0,
          flags: NONE,
          edges: [{
            on: {kind: 'Atom', value: 'a'},
            to: {
              id: 1,
              flags: ACCEPT,
              edges: [],
            },
          }],
        },
      }, {
        on: null,
        to: {
          id: 2,
          flags: NONE,
          edges: [{
            on: {kind: 'Atom', value: 'b'},
            to: {
              id: 3,
              flags: ACCEPT,
              edges: [],
            },
          }],
        },
      }, {
        on: null,
        to: {
          id: 4,
          flags: NONE,
          edges: [{
            on: {kind: 'Atom', value: 'c'},
            to: {
              id: 5,
              flags: ACCEPT,
              edges: [],
            },
          }],
        },
      }],
    });
  });

  it('creates an NFA from a character class', () => {
    expect(regExpToNFA(compileRegExp(/[a-z0]/))).toEqual({
      id: 4,
      flags: START,
      edges: [{
        on: null,
        to: {
          id: 0,
          flags: NONE,
          edges: [{
            on: {kind: 'Atom', value: '0'},
            to: {
              id: 1,
              flags: ACCEPT,
              edges: [],
            },
          }],
        },
      }, {
        on: null,
        to: {
          id: 2,
          flags: NONE,
          edges: [{
            on: {kind: 'Range', from: 'a', to: 'z'},
            to: {
              id: 3,
              flags: ACCEPT,
              edges: [],
            },
          }],
        },
      }],
    });
  });

  it('creates an NFA with a "?" quantifier', () => {
    expect(regExpToNFA(compileRegExp(/a?/))).toEqual({
      id: 0,
      flags: START | ACCEPT,
      edges: [{
        on: {kind: 'Atom', value: 'a'},
        to: {
          id: 1,
          flags: ACCEPT,
          edges: [],
        },
      }],
    });
  });

  it('creates an NFA with a "*" quantifier', () => {
    const start: NFA = {
      id: 2,
      flags: (START | ACCEPT) as Flags,
      edges: [{
        on: null,
        to: {
          id: 0,
          flags: NONE,
          edges: [{
            on: {kind: 'Atom', value: 'a'},
            to: {
              id: 1,
              flags: ACCEPT,
              edges: [],
            },
          }],
        },
      }],
    };
    start.edges[0].to.edges[0].to.edges.push({on: null, to: start});
    expect(regExpToNFA(compileRegExp(/a*/))).toEqual(start);
  });

  it('creates an NFA with a "+" quantifier', () => {
    const start: NFA = {
      id: 0,
      flags: START,
      edges: [{
        on: {kind: 'Atom', value: 'a'},
        to: {
          id: 1,
          flags: ACCEPT,
          edges: [],
        },
      }],
    };
    start.edges[0].to.edges.push({on: null, to: start});
    expect(regExpToNFA(compileRegExp(/a+/))).toEqual(start);
  });

  it('creates an NFA with a "{3}" quantifier', () => {
    expect(regExpToNFA(compileRegExp(/a{3}/))).toEqual({
      id: 0,
      flags: START,
      edges: [{
        on: {kind: 'Atom', value: 'a'},
        to: {
          id: 1,
          flags: NONE,
          edges: [{
            on: null,
            to: {
              id: 2,
              flags: NONE,
              edges: [{
                on: {kind: 'Atom', value: 'a'},
                to: {
                  id: 3,
                  flags: NONE,
                  edges: [{
                    on: null,
                    to: {
                      id: 4,
                      flags: NONE,
                      edges: [{
                        on: {kind: 'Atom', value: 'a'},
                        to: {
                          id: 5,
                          flags: ACCEPT,
                          edges: [],
                        },
                      }],
                    },
                  }],
                },
              }],
            },
          }],
        },
      }],
    });
  });

  it('creates an NFA with a "{2,4}" quantifier', () => {
    expect(regExpToNFA(compileRegExp(/a{2,4}/))).toEqual({
      id: 0,
      flags: START,
      edges: [{
        on: {kind: 'Atom', value: 'a'},
        to: {
          id: 1,
          flags: NONE,
          edges: [{
            on: null,
            to: {
              id: 2,
              flags: NONE,
              edges: [{
                on: {kind: 'Atom', value: 'a'},
                to: {
                  id: 3,
                  flags: ACCEPT,
                  edges: [{
                    on: null,
                    to: {
                      id: 4,
                      flags: NONE,
                      edges: [{
                        on: {kind: 'Atom', value: 'a'},
                        to: {
                          id: 5,
                          flags: ACCEPT,
                          edges: [{
                            on: null,
                            to: {
                              id: 6,
                              flags: NONE,
                              edges: [{
                                on: {kind: 'Atom', value: 'a'},
                                to: {
                                  id: 7,
                                  flags: ACCEPT,
                                  edges: [],
                                },
                              }],
                            },
                          }],
                        },
                      }],
                    },
                  }],
                },
              }],
            },
          }],
        },
      }],
    });
  });

  describe('regressions', () => {
    it('creates an NFA with a "?" quantifier in a sequence', () => {
      const start: NFA = {
        id: 0,
        flags: START,
        edges: [{
          on: {kind: 'Atom', value: 'a'},
          to: {
            id: 1,
            flags: NONE,
            edges: [{
              on: null,
              to: {
                id: 2,
                flags: NONE,
                edges: [{
                  on: {kind: 'Atom', value: 'b'},
                  to: {
                    id: 3,
                    flags: ACCEPT,
                    edges: [],
                  },
                }],
              },
            }],
          },
        }],
      };
      start.edges.push({
        on: null,
        to: start.edges[0].to.edges[0].to,
      });
      expect(regExpToNFA(compileRegExp(/a?b/))).toEqual(start);
    });
  });

  // See also: GraphQL-based tests in `@masochist/graphql`, specifically in
  // the file `src/__tests__/regExpToNFA.test.ts`.
});
