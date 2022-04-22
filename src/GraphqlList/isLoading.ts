import { NetworkStatus, QueryResult } from '@apollo/client';
import get from 'lodash.get';

/**
 * Checks if the query is currently in loading state. Moreover also, returns
 * a fetchMore flag, which identifies if the loading is due to a fetchMore op.
 *
 * @param props
 * @param result
 */
export function isLoading(
	loading?: boolean,
	result?: QueryResult
): { loading: boolean; fetchMore: boolean } {
	if (loading) {
		return { loading: true, fetchMore: false };
	}

	const networkStatus = get(result, 'networkStatus');

	// If there is no data, show multiple to fill the screen
	if (networkStatus === NetworkStatus.loading) {
		return { loading: true, fetchMore: false };
	}

	// If there is already content, and we're fetching next page
	else if (
		networkStatus === NetworkStatus.setVariables ||
		networkStatus === NetworkStatus.fetchMore
	) {
		return { loading: true, fetchMore: true };
	}

	return { loading: false, fetchMore: false };
}
