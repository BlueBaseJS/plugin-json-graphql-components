import { FetchMoreOptions } from '@apollo/client';

import { GraphqlListProps } from './types';

/**
 * Returns an update query function based on the pagination type
 *
 * @param props
 */
export function getUpdateQuery({
	pagination,
	updateQuery,
	updateQueryInfinitePagination,
	updateQueryNextPreviousPagination,
	updateQueryNumberedPagination,
}: GraphqlListProps): FetchMoreOptions['updateQuery'] {
	if (pagination === 'infinite' && !!updateQueryInfinitePagination) {
		return updateQueryInfinitePagination;
	} else if (pagination === 'next-previous' && !!updateQueryNextPreviousPagination) {
		return updateQueryNextPreviousPagination;
	} else if (pagination === 'numbered' && !!updateQueryNumberedPagination) {
		return updateQueryNumberedPagination;
	}

	return updateQuery || defaultPaginationUpdateQuery;
}

function defaultPaginationUpdateQuery(previousResult: any, { fetchMoreResult }: any) {
	return fetchMoreResult ? fetchMoreResult : previousResult;
}
