import { QueryResult } from '@apollo/client';
import get from 'lodash.get';

import { getQueryVariables } from './getQueryVariables';
import { getUpdateQuery } from './getUpdateQuery';
import { GraphqlListProps, QueryVariables } from './types';

/**
 * Load more data aka load next page
 */
export async function loadMore(result: QueryResult, props: GraphqlListProps) {
	if (!result) {
		return false;
	}

	const { mapQueryResultToConnection, itemsPerPage, page, pagination, queryOptions } = props;
	const connection = mapQueryResultToConnection(result);
	const pageInfo = get(connection, 'pageInfo', undefined);
	const endCursor = get(connection, 'pageInfo.endCursor');

	// Abort if
	if (
		// If we don't have pageInfo
		!pageInfo ||
		// If there are no more pages in infinite scroll mode
		(props.pagination !== 'numbered' && !pageInfo.hasNextPage) ||
		// If we are already in processing a query
		result.networkStatus < 7
	) {
		return false;
	}

	// const dataEdges: GraphqlConnectionEdge[] = get(connection, 'edges', []);

	const filter: QueryVariables['filter'] = { ...props.filter };

	if (!filter.after && !filter.before) {
		filter.after = endCursor;
	}

	// load more queries starting from the cursor of the last (oldest) message
	const variables = getQueryVariables({ filter }, get(queryOptions, 'variables'), {
		itemsPerPage,
		page,
		pagination,
	});

	try {
		await result.fetchMore({ updateQuery: getUpdateQuery(props), variables });
		return true;
	} catch (error) {
		return false;
	}
}
