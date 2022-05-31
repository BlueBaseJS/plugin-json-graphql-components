import { FetchMoreOptions, QueryHookOptions, QueryResult, SubscribeToMoreOptions } from '@apollo/client';
import { DocumentNode } from 'graphql';
import React from 'react';
import { FlatListProps, ListRenderItemInfo } from 'react-native';

export interface QueryVariables {
		// Cursor Pagination
		after?: string;
		before?: string;
		first?: number;
		last?: number;

		// Offset Pagination
		offset?: number;
		limit?: number;

		orderBy?: any;
		filter?: any;
}

export interface GraphqlConnectionEdge<T = any> {
	cursor: string;
	node: T;
}

export interface GraphqlConnectionPageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string;
	endCursor: string;
}

export interface GraphqlConnection<T = any> {
	__typename: string;
	edges: Array<GraphqlConnectionEdge<T>>;
	pageInfo: GraphqlConnectionPageInfo;
	totalCount?: number;
}

export type PaginationType = 'infinite' | 'numbered' | 'next-previous';

export type GraphqlListRenderItemInfo<ItemProps = any, QueryData = any> =
ListRenderItemInfo<ItemProps> & { result: QueryResult<QueryData> };

export interface GraphqlListProps<ItemProps = any, QueryData = any>
	extends QueryVariables,
		Omit<FlatListProps<ItemProps>, 'data' | 'renderItem'> {
	loading?: boolean;

	/** Page Number to display */
	pagination?: PaginationType;

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
	mapQueryResultToListData?: (result: QueryResult<QueryData>) => ItemProps[];

	/**
	 * Extract connection from query result
	 */
	mapQueryResultToConnection: (result: QueryResult<QueryData>) => GraphqlConnection | undefined | null;

	/**
	 * Function called by GraphQL's fetchMore function
	 */
	updateQuery?: FetchMoreOptions['updateQuery'];

	/**
	 * Function called by GraphQL's fetchMore function when pagination mode is "infinite".
	 * "updateQuery" prop will be ignore when this function is provided.
	 */
	updateQueryInfinitePagination?: FetchMoreOptions['updateQuery'];

	/**
	 * Function called by GraphQL's fetchMore function when pagination mode is "numbered".
	 * "updateQuery" prop will be ignore when this function is provided.
	 */
	updateQueryNumberedPagination?: FetchMoreOptions['updateQuery'];

	/**
	 * Function called by GraphQL's fetchMore function when pagination mode is "next-previous".
	 * "updateQuery" prop will be ignore when this function is provided.
	 */
	updateQueryNextPreviousPagination?: FetchMoreOptions['updateQuery'];

	subscribeToMoreOptions?: SubscribeToMoreOptions<QueryData>;

	renderItem: (
		info: GraphqlListRenderItemInfo<ItemProps, QueryData>
	) => React.ReactElement | null;

	renderLoadingItem?: (
		info: GraphqlListRenderItemInfo<ItemProps, QueryData>
	) => React.ReactElement | null;

	/**
	 * List component. Defaults to FlatList
	 */
	ListComponent?: React.ComponentType<FlatListProps<any> & any>;

	ListFooterComponent?: React.ComponentType<any>;
}
