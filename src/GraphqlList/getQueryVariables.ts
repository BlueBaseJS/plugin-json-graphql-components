
import { PaginationType, QueryVariables } from './types';

/**
 * Generates query variables, based on pagination setting & other filter optionss
 *
 * @param input
 * @param variables
 * @param options
 */
export function getQueryVariables(
	input: QueryVariables,
	variables: {[key: string]: any} | any,
	options: {
		itemsPerPage: number;
		pagination?: PaginationType;
		page?: number;
	}
) {
	const { itemsPerPage, pagination } = options;

	const vars: QueryVariables = { ...variables, ...input };

	if (pagination === 'numbered') {
		const page = options.page !== undefined ? options.page : 1;

		vars.limit = itemsPerPage;
		vars.offset = (page - 1) * itemsPerPage;

		vars.before = undefined;
		vars.after = undefined;
		vars.first = undefined;
		vars.last = undefined;
	} else {
		if (!vars.first && !vars.last) {
			vars.first = itemsPerPage;
		}

		vars.limit = undefined;
		vars.offset = undefined;
	}

	// remove properties which have undefined values
	Object.keys(vars).forEach(
		(key: string) => (vars as any)[key] === undefined && delete (vars as any)[key]
	);

	return vars;
}
