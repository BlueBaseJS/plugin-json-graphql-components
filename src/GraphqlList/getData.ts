import { QueryResult } from '@apollo/client';

import { isLoading } from './isLoading';
import { GraphqlListProps } from './types';

/**
 * Extract meaningful data from graphql result
 *
 * @param props
 * @param result
 */
export function getData(props: GraphqlListProps, result: QueryResult): any[] {
	const { pagination, mapQueryResultToListData, itemsPerPage } = props;

	const { loading, fetchMore } = isLoading(props.loading, result);
	const data = mapQueryResultToListData(result);

	// If we are not loading anything right now, return current data
	if (!loading) {
		return data;
	}
	// If we are in process of fetchMore operation, append a loading item in front of
	// existing data
	else if (fetchMore) {
		return pagination === 'infinite'
			? // If infinite mode, just append one loading item to existing data
			  [...data, { loading: true }]
			: // Otherwise, just fill the grid will loading data to replace existing page
			  new Array(itemsPerPage).fill({ loading: true });
	}
	// Show loading state
	else {
		return new Array(itemsPerPage).fill({ loading: true });
	}
}
