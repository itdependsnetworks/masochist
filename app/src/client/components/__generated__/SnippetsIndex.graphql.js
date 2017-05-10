/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule SnippetsIndex.graphql
 * @generated SignedSource<<b92232bf33c6ff63435823d8fa448fb9>>
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type SnippetsIndex = {
  snippets?: ?SnippetsIndex_snippets;
};

export type SnippetsIndex_snippets_edges_node = {
  id: string;
};

export type SnippetsIndex_snippets_edges = {
  node?: ?SnippetsIndex_snippets_edges_node;
};

export type SnippetsIndex_snippets_pageInfo = {
  endCursor?: ?string;
  hasNextPage: boolean;
};

export type SnippetsIndex_snippets = {
  edges?: ?Array<?SnippetsIndex_snippets_edges>;
  pageInfo: SnippetsIndex_snippets_pageInfo;
};
*/

/* eslint-disable comma-dangle, quotes */

const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "count",
      "type": "Int"
    },
    {
      "kind": "RootArgument",
      "name": "cursor",
      "type": "String"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "snippets"
        ]
      }
    ]
  },
  "name": "SnippetsIndex",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "snippets",
      "args": null,
      "concreteType": "SnippetConnection",
      "name": "__SnippetsIndex_snippets_connection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "SnippetEdge",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "Snippet",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "id",
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "Snippet",
                  "args": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "args": null,
              "name": "endCursor",
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "args": null,
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Root"
};

module.exports = fragment;
