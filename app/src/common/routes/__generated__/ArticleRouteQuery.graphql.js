/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule ArticleRouteQuery.graphql
 * @generated SignedSource<<6ff8c71e72457ebf420cf6dd60553bca>>
 * @relayHash be55f533a7171aca798fcaa04268477b
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';

*/

/* eslint-disable comma-dangle, quotes */

/*
query ArticleRouteQuery(
  $baseHeadingLevel: Int!
  $id: ID!
) {
  node(id: $id) {
    __typename
    ... on Article {
      ...Article
    }
    id
  }
}

fragment Article on Article {
  title
  redirect
  resolvedTitle
  createdAt
  updatedAt
  url
  body {
    html(baseHeadingLevel: $baseHeadingLevel)
  }
  ...Tags
}

fragment Tags on Tagged {
  tags
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "baseHeadingLevel",
        "type": "Int!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "id",
        "type": "ID!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArticleRouteQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "id",
            "variableName": "id",
            "type": "ID!"
          }
        ],
        "concreteType": null,
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "type": "Article",
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "Article",
                "args": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Root"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "ArticleRouteQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "baseHeadingLevel",
        "type": "Int!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "id",
        "type": "ID!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "ArticleRouteQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "id",
            "variableName": "id",
            "type": "ID!"
          }
        ],
        "concreteType": null,
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "__typename",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "type": "Article",
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "title",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "redirect",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "resolvedTitle",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "createdAt",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "updatedAt",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "url",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Markup",
                "name": "body",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "baseHeadingLevel",
                        "variableName": "baseHeadingLevel",
                        "type": "Int"
                      }
                    ],
                    "name": "html",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "tags",
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query ArticleRouteQuery(\n  $baseHeadingLevel: Int!\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on Article {\n      ...Article\n    }\n    id\n  }\n}\n\nfragment Article on Article {\n  title\n  redirect\n  resolvedTitle\n  createdAt\n  updatedAt\n  url\n  body {\n    html(baseHeadingLevel: $baseHeadingLevel)\n  }\n  ...Tags\n}\n\nfragment Tags on Tagged {\n  tags\n}\n"
};

module.exports = batch;
