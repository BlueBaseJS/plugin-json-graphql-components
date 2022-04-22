/* istanbul ignore file */

import { QueryResult } from '@apollo/client';
import { ActivityIndicator, Table } from '@bluebase/components';
import get from 'lodash.get';
import React from 'react';

import { ProductListQuery } from '../../GraphqlList/__artifacts__/ProductListQuery.graphql';
import { GraphqlTable, GraphqlTableProps } from '../GraphqlTable';

export const ProductTable = (props: Partial<GraphqlTableProps> & { [key: string]: any }) => {
	const { queryOptions, loading } = props;

	/**
	 * Maps Query result to data. This data is then send to the FlatList and
	 * its items to use for UI rendering
	 */
	function mapQueryResultToTableData(result: any) {
		// Extract Data
		const edges: any[] = get(result, 'data.products.edges', []);
		return edges.map((edge) => ({
			...edge.node,

			avatar: get(edge, 'node.avatar') ? { uri: get(edge, 'node.avatar') } : undefined,
			thumbnail: get(edge, 'node.thumbnail') ? { uri: get(edge, 'node.thumbnail') } : undefined,
		}));
	}

	function mapQueryResultToConnection(result: QueryResult<any>) {
		return get(result, 'data.products');
	}

	function renderHeader() {
		return (
			<Table.Head>
				<Table.Title>Brand</Table.Title>
				<Table.Title>Name</Table.Title>
			</Table.Head>
		);
	}

	function renderRow({ item }: any) {
		return (
			<Table.Row>
				<Table.Cell>{item.brand.name}</Table.Cell>
				<Table.Cell>{item.name}</Table.Cell>
			</Table.Row>
		);
	}

	function renderLoadingRow() {
		return (
			<Table.Row>
				<Table.Cell>
					<ActivityIndicator />
				</Table.Cell>
			</Table.Row>
		);
	}

	return (
		<GraphqlTable
			loading={loading}
			query={ProductListQuery}
			queryOptions={{
				...queryOptions,
				variables: {
					avatarSize: Math.ceil(142),
					...get(queryOptions, 'variables'),
				},
			}}
			mapQueryResultToTableData={mapQueryResultToTableData}
			mapQueryResultToConnection={mapQueryResultToConnection}
			renderHeader={renderHeader}
			renderRow={renderRow}
			renderLoadingRow={renderLoadingRow}
			// tslint:disable-next-line: jsx-no-lambda
			// eslint-disable-next-line react/jsx-no-bind
			onPageChange={(p: number) => console.log(`Page changed: ${p}`)}
			// itemsPerPage={sizes.numColumns * 3}
			{...props}
		/>
	);
};
