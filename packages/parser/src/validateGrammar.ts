import {invariant} from '@masochist/common';

import type {Grammar} from './types';

/**
 * Checks `grammar` for validity, ensuring that it:
 *
 * - Has at least 1 rule.
 * - Uses all declared tokens.
 * - Does not use any undeclared tokens.
 * - Has no unreachable productions (in practice, indistinguishable from
 *   using an undeclared token).
 * - Has no duplicate productions (ie. multiple copies of the same RHS for a
 *   given LHS).
 * - May use epsilon productions, but only as an alternative for other rule(s)
 *   with the same LHS.
 */
export default function validateGrammar(grammar: Grammar) {
  invariant(grammar.rules.length, 'grammar must have at least 1 rule');
  // TODO more...
}
