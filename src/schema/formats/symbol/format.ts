import type { SymbolTunableCriteria } from "./types";
import type { FormatTemplate } from "../types";

export const SymbolFormat: FormatTemplate<SymbolTunableCriteria> = {
	defaultCriteria: {},
	checking(queue, criteria, value) {
		if (typeof value !== "symbol") {
			return "TYPE_NOT_SYMBOL";
		}
		else if (criteria.symbol !== undefined && criteria.symbol !== value) {
			return "VALUE_INVALID_SYMBOL";
		}

		return (null);
	}
}
