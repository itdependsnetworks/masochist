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
        0/S'/$      : {null}
        5/FooList/6 : {6/CLOSE_BRACKET/8, 6/FOO/9}
        0/BarOpt/3  : {3/OPEN_BRACKET/5}
        0/S/1       : {null}
        0/Program/2 : {null}
      `,
    );
  });

  it('produces follow sets for the GraphQL grammar', () => {
    expect('\n' + stringifySymbolSets(getFollowSets(grammar)))
      .toMatchInlineSnapshot(`
      "
      Document               : {null}
      DefinitionList         : {NAME, OPENING_BRACE, null}
      DirectivesOpt          : {OPENING_BRACE}
      VariableDefinitionsOpt : {AT, OPENING_BRACE}
      OperationNameOpt       : {AT, OPENING_BRACE, OPENING_PAREN}
      OperationType          : {AT, NAME, OPENING_BRACE, OPENING_PAREN}
      VariableDefinitionList : {CLOSING_PAREN, DOLLAR}
      Type                   : {CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, EQUALS}
      Variable               : {CLOSING_PAREN, COLON, NAME}
      ListType               : {BANG, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, EQUALS}
      NamedType              : {BANG, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, EQUALS}
      ListValueConstList     : {CLOSING_BRACKET, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET}
      ObjectFieldConstList   : {CLOSING_BRACE, NAME}
      DirectiveList          : {AT, OPENING_BRACE}
      SelectionList          : {CLOSING_BRACE, NAME}
      ArgumentsOpt           : {CLOSING_BRACE, NAME, OPENING_BRACE}
      Alias                  : {NAME}
      ArgumentList           : {CLOSING_PAREN, NAME}
      Definition             : {NAME, OPENING_BRACE, null}
      ExecutableDefinition   : {NAME, OPENING_BRACE, null}
      OperationDefinition    : {NAME, OPENING_BRACE, null}
      SelectionSet           : {CLOSING_BRACE, NAME, OPENING_BRACE, null}
      VariableDefinition     : {CLOSING_PAREN, DOLLAR}
      DefaultValueOpt        : {CLOSING_PAREN, DOLLAR}
      NonNullType            : {CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, EQUALS}
      ValueConst             : {CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET}
      NumberValue            : {CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET}
      NamedValue             : {CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET}
      ListValueConst         : {CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET}
      ObjectValueConst       : {CLOSING_BRACE, CLOSING_BRACKET, CLOSING_PAREN, DOLLAR, NAME, NUMBER, OPENING_BRACE, OPENING_BRACKET}
      ObjectFieldConst       : {CLOSING_BRACE, NAME}
      Directive              : {AT, OPENING_BRACE}
      SelectionSetOpt        : {CLOSING_BRACE, NAME}
      Selection              : {CLOSING_BRACE, NAME}
      Field                  : {CLOSING_BRACE, NAME}
      Argument               : {CLOSING_PAREN, NAME}
      Value                  : {CLOSING_PAREN, NAME}"
    `);
  });

  it('produces follow sets for the extended GraphQL grammar', () => {
    const itemSets = getItemSets(grammar);
    const extendedGrammar = extendedGrammarForItemSets(itemSets, grammar);
    expect('\n' + stringifySymbolSets(getFollowSets(extendedGrammar)))
      .toMatchInlineSnapshot(`
      "
      0/Document'/$                : {null}
      18/DirectivesOpt/26          : {26/OPENING_BRACE/9}
      11/VariableDefinitionsOpt/18 : {18/AT/29, 26/OPENING_BRACE/9}
      6/OperationNameOpt/11        : {11/OPENING_PAREN/19, 18/AT/29, 26/OPENING_BRACE/9}
      0/OperationType/6            : {11/OPENING_PAREN/19, 18/AT/29, 26/OPENING_BRACE/9, 6/NAME/12}
      9/SelectionList/13           : {13/CLOSING_BRACE/20, 13/NAME/16}
      0/DefinitionList/2           : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/OperationType/6            : {11/OPENING_PAREN/19, 18/AT/29, 26/OPENING_BRACE/9, 6/NAME/12}
      16/ArgumentsOpt/22           : {13/CLOSING_BRACE/20, 13/NAME/16, 22/OPENING_BRACE/9}
      25/ArgumentsOpt/39           : {13/CLOSING_BRACE/20, 13/NAME/16, 39/OPENING_BRACE/9}
      9/Alias/17                   : {17/NAME/25}
      19/VariableDefinitionList/30 : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      13/Alias/17                  : {17/NAME/25}
      24/ArgumentList/36           : {36/CLOSING_PAREN/47, 36/NAME/38}
      18/DirectiveList/27          : {26/OPENING_BRACE/9, 27/AT/29}
      45/Type/51                   : {30/CLOSING_PAREN/43, 30/DOLLAR/33, 51/EQUALS/64}
      19/Variable/32               : {32/COLON/45}
      30/Variable/32               : {32/COLON/45}
      55/Type/67                   : {67/CLOSING_BRACKET/75}
      45/ListType/54               : {30/CLOSING_PAREN/43, 30/DOLLAR/33, 51/EQUALS/64, 54/BANG/66}
      45/NamedType/52              : {30/CLOSING_PAREN/43, 30/DOLLAR/33, 51/EQUALS/64, 52/BANG/65}
      55/ListType/54               : {54/BANG/66, 67/CLOSING_BRACKET/75}
      55/NamedType/52              : {52/BANG/65, 67/CLOSING_BRACKET/75}
      72/ListValueConstList/77     : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      74/ObjectFieldConstList/80   : {80/CLOSING_BRACE/85, 80/NAME/82}
      0/Document/1                 : {null}
      0/Definition/3               : {2/NAME/7, 2/OPENING_BRACE/9, null}
      0/ExecutableDefinition/4     : {2/NAME/7, 2/OPENING_BRACE/9, null}
      0/OperationDefinition/5      : {2/NAME/7, 2/OPENING_BRACE/9, null}
      26/SelectionSet/40           : {2/NAME/7, 2/OPENING_BRACE/9, null}
      0/SelectionSet/8             : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/Definition/10              : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/ExecutableDefinition/4     : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/OperationDefinition/5      : {2/NAME/7, 2/OPENING_BRACE/9, null}
      2/SelectionSet/8             : {2/NAME/7, 2/OPENING_BRACE/9, null}
      9/Selection/14               : {13/CLOSING_BRACE/20, 13/NAME/16}
      9/Field/15                   : {13/CLOSING_BRACE/20, 13/NAME/16}
      22/SelectionSetOpt/34        : {13/CLOSING_BRACE/20, 13/NAME/16}
      39/SelectionSetOpt/50        : {13/CLOSING_BRACE/20, 13/NAME/16}
      13/Selection/21              : {13/CLOSING_BRACE/20, 13/NAME/16}
      13/Field/15                  : {13/CLOSING_BRACE/20, 13/NAME/16}
      18/Directive/28              : {26/OPENING_BRACE/9, 27/AT/29}
      27/Directive/41              : {26/OPENING_BRACE/9, 27/AT/29}
      19/VariableDefinition/31     : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      51/DefaultValueOpt/63        : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      30/VariableDefinition/44     : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      22/SelectionSet/35           : {13/CLOSING_BRACE/20, 13/NAME/16}
      24/Argument/37               : {36/CLOSING_PAREN/47, 36/NAME/38}
      49/Value/57                  : {36/CLOSING_PAREN/47, 36/NAME/38}
      36/Argument/48               : {36/CLOSING_PAREN/47, 36/NAME/38}
      39/SelectionSet/35           : {13/CLOSING_BRACE/20, 13/NAME/16}
      45/NonNullType/56            : {30/CLOSING_PAREN/43, 30/DOLLAR/33, 51/EQUALS/64}
      49/Variable/58               : {36/CLOSING_PAREN/47, 36/NAME/38}
      49/NumberValue/59            : {36/CLOSING_PAREN/47, 36/NAME/38}
      49/NamedValue/61             : {36/CLOSING_PAREN/47, 36/NAME/38}
      64/ValueConst/68             : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      55/NonNullType/56            : {67/CLOSING_BRACKET/75}
      64/NumberValue/69            : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      64/NamedValue/70             : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      64/ListValueConst/71         : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      64/ObjectValueConst/73       : {30/CLOSING_PAREN/43, 30/DOLLAR/33}
      72/ValueConst/78             : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      72/NumberValue/69            : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      72/NamedValue/70             : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      72/ListValueConst/71         : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      72/ObjectValueConst/73       : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      77/ValueConst/84             : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      74/ObjectFieldConst/81       : {80/CLOSING_BRACE/85, 80/NAME/82}
      87/ValueConst/88             : {80/CLOSING_BRACE/85, 80/NAME/82}
      80/ObjectFieldConst/86       : {80/CLOSING_BRACE/85, 80/NAME/82}
      77/NumberValue/69            : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      77/NamedValue/70             : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      77/ListValueConst/71         : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      77/ObjectValueConst/73       : {77/CLOSING_BRACKET/83, 77/NAME/62, 77/NUMBER/60, 77/OPENING_BRACE/74, 77/OPENING_BRACKET/72}
      87/NumberValue/69            : {80/CLOSING_BRACE/85, 80/NAME/82}
      87/NamedValue/70             : {80/CLOSING_BRACE/85, 80/NAME/82}
      87/ListValueConst/71         : {80/CLOSING_BRACE/85, 80/NAME/82}
      87/ObjectValueConst/73       : {80/CLOSING_BRACE/85, 80/NAME/82}"
    `);
  });
});
