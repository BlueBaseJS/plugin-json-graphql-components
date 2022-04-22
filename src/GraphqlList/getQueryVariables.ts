import get from 'lodash.get';

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
	variables: any,
	options: {
		itemsPerPage: number;
		pagination?: PaginationType;
		page?: number;
	}
) {
	const { itemsPerPage, pagination } = options;

	const filter: QueryVariables['filter'] = {
		after: get(variables, 'filter.after', undefined),
		before: get(variables, 'filter.before', undefined),
		first: get(variables, 'filter.first', undefined),
		last: get(variables, 'filter.last', undefined),
		order: get(variables, 'filter.order', undefined),
		where: get(variables, 'filter.where', undefined),

		...get(input, 'filter', undefined),
	};

	if (pagination === 'numbered') {
		filter.limit = itemsPerPage;
		filter.offset = (get(options, 'page', 1) - 1) * itemsPerPage;

		filter.before = undefined;
		filter.after = undefined;
		filter.first = undefined;
		filter.last = undefined;
	} else {
		if (!filter.first && !filter.last) {
			filter.first = itemsPerPage;
		}

		filter.limit = undefined;
		filter.offset = undefined;
	}

	// remove properties which have undefined values
	Object.keys(filter).forEach(
		(key: string) => (filter as any)[key] === undefined && delete (filter as any)[key]
	);

	return { ...variables, filter };
}
