import { FetchMoreOptions, QueryHookOptions, QueryResult, useQuery } from '@apollo/client';
import { ErrorObserver, Table } from '@bluebase/components';
import { DocumentNode } from 'graphql';
import get from 'lodash.get';
import React from 'react';

import { GraphqlConnection, QueryVariables } from '../GraphqlList';
import { getQueryVariables } from '../GraphqlList/getQueryVariables';
import { isLoading } from '../GraphqlList/isLoading';
import { loadMore } from '../GraphqlList/loadMore';

export interface GraphqlTableProps<ItemProps = any, QueryData = any> extends QueryVariables {
	loading?: boolean;

	/**
	 * Page Number to display. Used for "numbered" and "next-previous" pagination types.
	 * Starts from 1.
	 */
	page?: number;

	/** Callback when page number is changed. Used for "numbered" and "next-previous" pagination types */
	onPageChange?: (page: number) => void;

	/**
	 * Graphql Query
	 */
	query: DocumentNode;

	/**
	 * Graphql Query options
	 */
	queryOptions?: QueryHookOptions<QueryData>;

	/**
	 * Number of pages to fetch for each query
	 */
	itemsPerPage: number;

	/**
	 * Convert query result to ItemComponent props
	 */
	mapQueryResultToTableData: (result: QueryResult<QueryData>) => ItemProps[];

	/**
	 * Extract connection from query result
	 */
	mapQueryResultToConnection: (result: QueryResult<QueryData>) => GraphqlConnection;

	/**
	 * Function called by GraphQL's fetchMore function
	 */
	updateQuery?: FetchMoreOptions['updateQuery'];

	renderHeader: (info: { result: QueryResult<QueryData> }) => React.ReactElement | null;

	renderRow: (info: {
		index: number;
		item: ItemProps;
		result: QueryResult<QueryData>;
	}) => React.ReactElement | null;

	renderLoadingRow: () => React.ReactElement | null;
}

export const GraphqlTable = (props: GraphqlTableProps) => {
	const {
		page,
		onPageChange,
		loading,
		filter,
		query,
		queryOptions,
		itemsPerPage,
		renderHeader,
		renderLoadingRow,
		renderRow,
		mapQueryResultToTableData,
		mapQueryResultToConnection,
	} = props;

	const result: QueryResult = useQuery(query, {
		...queryOptions,
		notifyOnNetworkStatusChange: true,
		skip: loading,
		variables: getQueryVariables({ filter }, get(queryOptions, 'variables'), {
			itemsPerPage,
			page,
			pagination: 'numbered',
		}),
	});

	if (isLoading(loading).loading) {
		return (
			<Table>
				{renderHeader({ result })}
				<Table.Body>
					{new Array(itemsPerPage).fill({ loading: true }).map((_o: any, index: number) => (
						<React.Fragment key={`loading-${index}`}>{renderLoadingRow()}</React.Fragment>
					))}
				</Table.Body>
			</Table>
		);
	}

	const connection = mapQueryResultToConnection(result);
	const totalCount = get(connection, 'totalCount', 0);

	const onChange = async (pageNum: number) => {
		const prevPage = page!;

		if (onPageChange) {
			onPageChange(pageNum + 1);
		}

		const done = await loadMore(result, {
			...props,
			page: pageNum + 1,
			pagination: 'numbered',
		} as any);

		if (!done && onPageChange) {
			onPageChange(prevPage);
		}
	};

	const data = mapQueryResultToTableData(result);

	// Render List
	return (
		<ErrorObserver error={result.error} retry={result.refetch}>
			<Table>
				{renderHeader({ result })}
				<Table.Body>
					{data.map((item: any, i: number) => {
						const index = page! * itemsPerPage + i;
						return (
							<React.Fragment key={get(item, 'id', index.toString())}>
								{renderRow({ index, item, result })}
							</React.Fragment>
						);
					})}
				</Table.Body>
				<Table.Pagination
					page={page! - 1}
					count={totalCount}
					rowsPerPage={itemsPerPage}
					onPageChange={onChange as any}
				/>
			</Table>
		</ErrorObserver>
	);
};

GraphqlTable.displayName = 'GraphqlTable';

GraphqlTable.defaultProps = {
	itemsPerPage: 10,
	loading: false,
	page: 1,
};
