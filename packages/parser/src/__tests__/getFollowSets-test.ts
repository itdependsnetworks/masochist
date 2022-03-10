import {dedent} from '@masochist/common';

import {grammar} from '..';
import extendedGrammarForItemSets from '../extendedGrammarForItemSets';
import getFollowSets from '../getFollowSets';
import getItemSets from '../getItemSets';
import stringifySymbolSets from '../stringifySymbolSets';
import {epsilonGrammar, subsetGrammar, toyGrammar} from './grammars';

describe('getFollowSets()', () => {
  it('produces follow sets for the toy grammar', () => {
    expect(getFollowSets(toyGrammar)).toEqual({
      E: new Set(['eq', null]),
      N: new Set([null]),
      S: new Set([null]),
      V: new Set(['eq', null]),
    });
  });

  it('produces follow sets for the extended toy grammar', () => {
    const itemSets = getItemSets(toyGrammar);
    const extendedGrammar = extendedGrammarForItemSets(itemSets, toyGrammar);
    expect(getFollowSets(extendedGrammar)).toEqual({
      "0/S'/$": new Set([null]),
      '0/V/3': new Set(['3/eq/7', null]),
      '0/S/1': new Set([null]),
      '0/N/2': new Set([null]),
      '7/E/10': new Set([null]),
      '5/E/8': new Set(['3/eq/7', null]),
      '0/E/6': new Set([null]),
      '5/V/9': new Set(['3/eq/7', null]),
      '7/V/9': new Set([null]),
    });
  });

  it('produces follow sets for the subset grammar', () => {
    expect(getFollowSets(subsetGrammar)).toEqual({
      Document: new Set([null]),
      DefinitionList: new Set(['OPENING_BRACE', null]),
      SelectionList: new Set(['CLOSING_BRACE', 'NAME']),
      Definition: new Set(['OPENING_BRACE', null]),
      ExecutableDefinition: new Set(['OPENING_BRACE', null]),
      OperationDefinition: new Set(['OPENING_BRACE', null]),
      SelectionSet: new Set(['OPENING_BRACE', null]),
      Selection: new Set(['CLOSING_BRACE', 'NAME']),
      Field: new Set(['CLOSING_BRACE', 'NAME']),
    });
  });

  it('produces follow sets for the extended subset grammar', () => {
    const itemSets = getItemSets(subsetGrammar);
    const extendedGrammar = extendedGrammarForItemSets(itemSets, subsetGrammar);
    expect(getFollowSets(extendedGrammar)).toEqual({
      "0/Document'/$": new Set([null]),
      '0/Document/1': new Set([null]),
      '0/DefinitionList/2': new Set(['2/OPENING_BRACE/7', null]),
      '7/SelectionList/9': new Set(['9/CLOSING_BRACE/13', '9/NAME/12']),
      '0/Definition/3': new Set(['2/OPENING_BRACE/7', null]),
      '2/Definition/8': new Set(['2/OPENING_BRACE/7', null]),
      '0/ExecutableDefinition/4': new Set(['2/OPENING_BRACE/7', null]),
      '0/OperationDefinition/5': new Set(['2/OPENING_BRACE/7', null]),
      '0/SelectionSet/6': new Set(['2/OPENING_BRACE/7', null]),
      '2/ExecutableDefinition/4': new Set(['2/OPENING_BRACE/7', null]),
      '2/OperationDefinition/5': new Set(['2/OPENING_BRACE/7', null]),
      '2/SelectionSet/6': new Set(['2/OPENING_BRACE/7', null]),
      '7/Selection/10': new Set(['9/CLOSING_BRACE/13', '9/NAME/12']),
      '9/Selection/14': new Set(['9/CLOSING_BRACE/13', '9/NAME/12']),
      '7/Field/11': new Set(['9/CLOSING_BRACE/13', '9/NAME/12']),
      '9/Field/11': new Set(['9/CLOSING_BRACE/13', '9/NAME/12']),
    });
  });

  it('produces follow sets when the grammar has epsilon productions', () => {
    expect(getFollowSets(epsilonGrammar)).toEqual({
      S: new Set([null]),
      Program: new Set([null]),
      FooList: new Set(['CLOSE_BRACKET', 'FOO']),
      BarOpt: new Set(['OPEN_BRACKET']),
    });
  });

  it('produces follow sets for an extended grammar with an epsilon productions', () => {
    const itemSets = getItemSets(epsilonGrammar);
    const extendedGrammar = extendedGrammarForItemSets(
      itemSets,
      epsilonGrammar,
    );
    expect(stringifySymbolSets(getFollowSets(extendedGrammar))).toEqual(
      dedent`
        0/BarOpt/3  : {3/OPEN_BRACKET/5}
        0/Program/2 : {null}
        0/S'/$      : {null}
        0/S/1       : {null}
        5/FooList/6 : {6/CLOSE_BRACKET/8, 6/FOO/9}
      `,
    );
  });

  it('produces follow sets for the GraphQL grammar', () => {
    expect('\n' + stringifySymbolSets(getFollowSets(grammar)))
      .toMatchInlineSnapshot(`
      "
      Alias                  : {NAME}
      Argument               : {CLOSING_PAREN, NAME}
      ArgumentList           : {CLOSING_PAREN, NAME}
      ArgumentsOpt           : {AT, CLOSING_BRACE, NAME, OPENING_BRACE}
      DefaultValueOpt        : {CLOSING_PAREN, DOLLAR}
      Definition             : {NAME, OPENING_BRACE, null}
      DefinitionList         : {NAME, OPENING_BRACE, null}
      Directive              : {AT, CLOSING_BRACE, NAME, OPENING_BRACE}
      DirectiveList          : {AT, CLOSING_BRACE, NAME, OPENING_BRACE}
      DirectivesOpt          : {CLOSING_BRACE, NAME, OPENING_BRACE}
      Document               : {null}
      ExecutableDefinition   : {NAME, OPENING_BRACE, null}
      Field                  : {CLOSING_BRACE, NAME}
      ListType               : {BANG, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, EQUALS}
      ListValue              : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      ListValueConst         : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      ListValueConstList     : {BLOCK_STRING_VALUE, CLOSING_BRACKET, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      ListValueList          : {BLOCK_STRING_VALUE, CLOSING_BRACKET, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      NamedType              : {BANG, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, EQUALS}
      NamedValue             : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      NonNullType            : {CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, EQUALS}
      NumberValue            : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      ObjectField            : {CLOSING_BRACE, NAME}
      ObjectFieldConst       : {CLOSING_BRACE, NAME}
      ObjectFieldConstList   : {CLOSING_BRACE, NAME}
      ObjectFieldList        : {CLOSING_BRACE, NAME}
      ObjectValue            : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      ObjectValueConst       : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      OperationDefinition    : {NAME, OPENING_BRACE, null}
      OperationNameOpt       : {AT, OPENING_BRACE, OPENING_PAREN}
      OperationType          : {AT, NAME, OPENING_BRACE, OPENING_PAREN}
      Selection              : {CLOSING_BRACE, NAME}
      SelectionList          : {CLOSING_BRACE, NAME}
      SelectionSet           : {CLOSING_BRACE, NAME, OPENING_BRACE, null}
      SelectionSetOpt        : {CLOSING_BRACE, NAME}
      StringValue            : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      Type                   : {CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, EQUALS}
      Value                  : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      ValueConst             : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      Variable               : {BLOCK_STRING_VALUE, CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, COLON, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET, STRING_VALUE}
      VariableDefinition     : {CLOSING_PAREN, DOLLAR}
      VariableDefinitionList : {CLOSING_PAREN, DOLLAR}
      VariableDefinitionsOpt : {AT, OPENING_BRACE}"
    `);
  });

  it('produces follow sets for the extended GraphQL grammar', () => {
    const itemSets = getItemSets(grammar);
    const extendedGrammar = extendedGrammarForItemSets(itemSets, grammar);
    expect('\n' + stringifySymbolSets(getFollowSets(extendedGrammar)))
      .toMatchInlineSnapshot(`
      "
      0/Definition/3               : {2/NAME/7, 2/OPENING_BRACE/9, null}
      0/DefinitionList/2           : {2/NAME/7, 2/OPENING_BRACE/9, null}
      0/Document'/$                : {null}
      0/Document/1                 : {null}
      0/ExecutableDefinition/4     : {2/NAME/7, 2/OPENING_BRACE/9, null}
      0/OperationDefinition/5      : {2/NAME/7, 2/OPENING_BRACE/9, null}
      0/OperationType/6            : {11/OPENING_PAREN/19, 18/AT/29, 26/OPENING_BRACE/9, 6/NAME/12}
      0/SelectionSet/8             : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/Definition/10              : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/ExecutableDefinition/4     : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/OperationDefinition/5      : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/OperationType/6            : {11/OPENING_PAREN/19, 18/AT/29, 26/OPENING_BRACE/9, 6/NAME/12}
      2/SelectionSet/8             : {2/NAME/7, 2/OPENING_BRACE/9, null}
      6/OperationNameOpt/11        : {11/OPENING_PAREN/19, 18/AT/29, 26/OPENING_BRACE/9}
      9/Alias/17                   : {17/NAME/25}
      9/Field/15                   : {13/CLOSING_BRACE/20, 13/NAME/16}
      9/Selection/14               : {13/CLOSING_BRACE/20, 13/NAME/16}
      9/SelectionList/13           : {13/CLOSING_BRACE/20, 13/NAME/16}
      11/VariableDefinitionsOpt/18 : {18/AT/29, 26/OPENING_BRACE/9}
      13/Alias/17                  : {17/NAME/25}
      13/Field/15                  : {13/CLOSING_BRACE/20, 13/NAME/16}
      13/Selection/21              : {13/CLOSING_BRACE/20, 13/NAME/16}
      16/ArgumentsOpt/22           : {13/CLOSING_BRACE/20, 13/NAME/16, 22/AT/29, 34/OPENING_BRACE/9}
      18/Directive/28              : {26/OPENING_BRACE/9, 27/AT/29}
      18/DirectiveList/27          : {26/OPENING_BRACE/9, 27/AT/29}
      18/DirectivesOpt/26          : {26/OPENING_BRACE/9}
      19/Variable/32               : {32/COLON/44}
      19/VariableDefinition/31     : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      19/VariableDefinitionList/30 : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      22/Directive/28              : {13/CLOSING_BRACE/20, 13/NAME/16, 27/AT/29, 34/OPENING_BRACE/9}
      22/DirectiveList/27          : {13/CLOSING_BRACE/20, 13/NAME/16, 27/AT/29, 34/OPENING_BRACE/9}
      22/DirectivesOpt/34          : {13/CLOSING_BRACE/20, 13/NAME/16, 34/OPENING_BRACE/9}
      24/Argument/36               : {35/CLOSING_PAREN/48, 35/NAME/37}
      24/ArgumentList/35           : {35/CLOSING_PAREN/48, 35/NAME/37}
      25/ArgumentsOpt/38           : {13/CLOSING_BRACE/20, 13/NAME/16, 38/AT/29, 51/OPENING_BRACE/9}
      26/SelectionSet/39           : {2/NAME/7, 2/OPENING_BRACE/9, null}
      27/Directive/40              : {13/CLOSING_BRACE/20, 13/NAME/16, 26/OPENING_BRACE/9, 27/AT/29, 34/OPENING_BRACE/9, 51/OPENING_BRACE/9}
      30/Variable/32               : {32/COLON/44}
      30/VariableDefinition/43     : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      34/SelectionSet/47           : {13/CLOSING_BRACE/20, 13/NAME/16}
      34/SelectionSetOpt/46        : {13/CLOSING_BRACE/20, 13/NAME/16}
      35/Argument/49               : {35/CLOSING_PAREN/48, 35/NAME/37}
      38/Directive/28              : {13/CLOSING_BRACE/20, 13/NAME/16, 27/AT/29, 51/OPENING_BRACE/9}
      38/DirectiveList/27          : {13/CLOSING_BRACE/20, 13/NAME/16, 27/AT/29, 51/OPENING_BRACE/9}
      38/DirectivesOpt/51          : {13/CLOSING_BRACE/20, 13/NAME/16, 51/OPENING_BRACE/9}
      41/ArgumentsOpt/52           : {13/CLOSING_BRACE/20, 13/NAME/16, 26/OPENING_BRACE/9, 27/AT/29, 34/OPENING_BRACE/9, 51/OPENING_BRACE/9}
      44/ListType/56               : {30/CLOSING_PAREN/42, 30/DOLLAR/33, 53/EQUALS/74, 56/BANG/76}
      44/NamedType/54              : {30/CLOSING_PAREN/42, 30/DOLLAR/33, 53/EQUALS/74, 54/BANG/75}
      44/NonNullType/58            : {30/CLOSING_PAREN/42, 30/DOLLAR/33, 53/EQUALS/74}
      44/Type/53                   : {30/CLOSING_PAREN/42, 30/DOLLAR/33, 53/EQUALS/74}
      50/ListValue/68              : {35/CLOSING_PAREN/48, 35/NAME/37}
      50/NamedValue/66             : {35/CLOSING_PAREN/48, 35/NAME/37}
      50/NumberValue/61            : {35/CLOSING_PAREN/48, 35/NAME/37}
      50/ObjectValue/70            : {35/CLOSING_PAREN/48, 35/NAME/37}
      50/StringValue/63            : {35/CLOSING_PAREN/48, 35/NAME/37}
      50/Value/59                  : {35/CLOSING_PAREN/48, 35/NAME/37}
      50/Variable/60               : {35/CLOSING_PAREN/48, 35/NAME/37}
      51/SelectionSet/47           : {13/CLOSING_BRACE/20, 13/NAME/16}
      51/SelectionSetOpt/72        : {13/CLOSING_BRACE/20, 13/NAME/16}
      53/DefaultValueOpt/73        : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      57/ListType/56               : {56/BANG/76, 77/CLOSING_BRACKET/93}
      57/NamedType/54              : {54/BANG/75, 77/CLOSING_BRACKET/93}
      57/NonNullType/58            : {77/CLOSING_BRACKET/93}
      57/Type/77                   : {77/CLOSING_BRACKET/93}
      69/ListValue/68              : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      69/ListValueList/79          : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      69/NamedValue/66             : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      69/NumberValue/61            : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      69/ObjectValue/70            : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      69/StringValue/63            : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      69/Value/80                  : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      69/Variable/60               : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      71/ObjectField/83            : {82/CLOSING_BRACE/96, 82/NAME/84}
      71/ObjectFieldList/82        : {82/CLOSING_BRACE/96, 82/NAME/84}
      74/ListValueConst/89         : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      74/NamedValue/88             : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      74/NumberValue/86            : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      74/ObjectValueConst/91       : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      74/StringValue/87            : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      74/ValueConst/85             : {30/CLOSING_PAREN/42, 30/DOLLAR/33}
      79/ListValue/68              : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      79/NamedValue/66             : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      79/NumberValue/61            : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      79/ObjectValue/70            : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      79/StringValue/63            : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      79/Value/95                  : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      79/Variable/60               : {79/BLOCK_STRING_VALUE/65, 79/CLOSING_BRACKET/94, 79/DOLLAR/33, 79/NAME/67, 79/NUMBER/62, 79/OPENING_BRACE/71, 79/OPENING_BRACKET/69, 79/STRING_VALUE/64}
      82/ObjectField/97            : {82/CLOSING_BRACE/96, 82/NAME/84}
      90/ListValueConst/89         : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      90/ListValueConstList/100    : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      90/NamedValue/88             : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      90/NumberValue/86            : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      90/ObjectValueConst/91       : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      90/StringValue/87            : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      90/ValueConst/101            : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      92/ObjectFieldConst/104      : {103/CLOSING_BRACE/109, 103/NAME/105}
      92/ObjectFieldConstList/103  : {103/CLOSING_BRACE/109, 103/NAME/105}
      98/ListValue/68              : {82/CLOSING_BRACE/96, 82/NAME/84}
      98/NamedValue/66             : {82/CLOSING_BRACE/96, 82/NAME/84}
      98/NumberValue/61            : {82/CLOSING_BRACE/96, 82/NAME/84}
      98/ObjectValue/70            : {82/CLOSING_BRACE/96, 82/NAME/84}
      98/StringValue/63            : {82/CLOSING_BRACE/96, 82/NAME/84}
      98/Value/106                 : {82/CLOSING_BRACE/96, 82/NAME/84}
      98/Variable/60               : {82/CLOSING_BRACE/96, 82/NAME/84}
      100/ListValueConst/89        : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      100/NamedValue/88            : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      100/NumberValue/86           : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      100/ObjectValueConst/91      : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      100/StringValue/87           : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      100/ValueConst/108           : {100/BLOCK_STRING_VALUE/65, 100/CLOSING_BRACKET/107, 100/NAME/67, 100/NUMBER/62, 100/OPENING_BRACE/92, 100/OPENING_BRACKET/90, 100/STRING_VALUE/64}
      103/ObjectFieldConst/110     : {103/CLOSING_BRACE/109, 103/NAME/105}
      111/ListValueConst/89        : {103/CLOSING_BRACE/109, 103/NAME/105}
      111/NamedValue/88            : {103/CLOSING_BRACE/109, 103/NAME/105}
      111/NumberValue/86           : {103/CLOSING_BRACE/109, 103/NAME/105}
      111/ObjectValueConst/91      : {103/CLOSING_BRACE/109, 103/NAME/105}
      111/StringValue/87           : {103/CLOSING_BRACE/109, 103/NAME/105}
      111/ValueConst/112           : {103/CLOSING_BRACE/109, 103/NAME/105}"
    `);
  });
});
