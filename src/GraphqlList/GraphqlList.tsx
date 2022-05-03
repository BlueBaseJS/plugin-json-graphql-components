import { QueryResult, useQuery } from '@apollo/client';
import { ErrorObserver, FlatList } from '@bluebase/components';
import React, { useCallback, useEffect } from 'react';
import { ListRenderItemInfo } from 'react-native';

import { getData } from './getData';
import { getQueryVariables } from './getQueryVariables';
import { GraphqlListFooter } from './GraphqlListFooter';
import { isLoading } from './isLoading';
import { keyExtractor } from './keyExtractor';
import { loadMore } from './loadMore';
import { GraphqlListProps } from './types';

export const GraphqlList = (props: GraphqlListProps) => {
	const {
		pagination,
		page,
		onPageChange,
		query,
		queryOptions,
		itemsPerPage,
		mapQueryResultToConnection,
		mapQueryResultToListData,
		ListComponent = FlatList,
		ListFooterComponent,
		ListFooterComponentStyle,
		subscribeToMoreOptions,
		...flatListProps
	} = props;

	if (props.loading) {
		return (
			<ListComponent
				testID="loading-list"
				data={new Array(itemsPerPage).fill({ loading: true })}
				keyExtractor={keyExtractor}
				scrollEnabled={false}
				{...flatListProps}
				renderItem={renderItem}
			/>
		);
	}

	// Run Query
	const result: QueryResult = useQuery(query, {
		...queryOptions,
		notifyOnNetworkStatusChange: true,
		variables: getQueryVariables({
			after: props.after,
			before: props.before,
			first: props.first,
			last: props.last,
			filter: props.filter,
			orderBy: props.orderBy,
		},
		queryOptions?.variables,
		{
			itemsPerPage,
			page,
			pagination,
		}),
	});

	useEffect(() => {
		let unsubscribe;
		if (subscribeToMoreOptions) {
			unsubscribe = result.subscribeToMore(subscribeToMoreOptions);
		}

		return unsubscribe;
	}, [subscribeToMoreOptions]);

	// Used during infinite scroll to auto load more data
	const onEndReached = useCallback(() => {
		if (pagination === 'infinite') {
			loadMore(result, { ...props, page });
		}
	}, [pagination, result, props, page]);

	// Render list items
	function renderItem(info: ListRenderItemInfo<any>) {
		// Backwards compatibility
		const renderLoadingItem = props.renderLoadingItem || props.renderItem;

		const isLoading = info.item.loading === true;

		return isLoading
			? renderLoadingItem({ ...info, result })
			: props.renderItem({ ...info, result });
	}

	function renderFooter() {
		if (!ListFooterComponent) {
			return null;
		}

		return (
			<ListFooterComponent
				style={ListFooterComponentStyle}
				result={result}
				{...props}
				loading={isLoading(props.loading!, result).loading}
			/>
		);
	}

	const onRetry = useCallback(() => {
		result.refetch();
	}, [result]);

	// Render List
	return (
		<ErrorObserver error={result.error} retry={onRetry}>
			<ListComponent
				data={getData(props, result)}
				onEndReached={onEndReached}
				onRefresh={result.refetch}
				refreshing={result.networkStatus === 4}
				keyExtractor={keyExtractor}
				{...flatListProps}
				ListFooterComponent={renderFooter}
				renderItem={renderItem}
			/>
		</ErrorObserver>
	);
};

GraphqlList.displayName = 'GraphqlList';

GraphqlList.defaultProps = {
	itemsPerPage: 10,
	loading: false,
	page: 1,
	pagination: 'infinite',

	ListFooterComponent: GraphqlListFooter,
};
