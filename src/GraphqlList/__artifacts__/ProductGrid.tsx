/* istanbul ignore file */
import { QueryResult } from '@apollo/client';
import { View } from '@bluebase/components';
import get from 'lodash.get';
import React, { useCallback } from 'react';
import { ListRenderItemInfo } from 'react-native';

import { useResponsiveListSizes } from '../../../hooks';
import { GraphqlList } from '../GraphqlList';
import { GraphqlListProps } from '../types';
import { ProductCard } from './ProductCard';
import { ProductListQuery, ProductListQueryUpdateQueryFn } from './ProductListQuery.graphql';

export const ProductGrid = (props: Partial<GraphqlListProps> & { [key: string]: any }) => {
	const { contentContainerStyle, queryOptions, loading, onPress, columnMap } = props;
	const { sizes, onLayout } = useResponsiveListSizes(columnMap);

	/**
	 * Maps Query result to data. This data is then send to the FlatList and
	 * its items to use for UI rendering
	 */
	function mapQueryResultToListData(result: any) {
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

	function renderItem({ item }: ListRenderItemInfo<any>) {
		const onPressFn = onPress ? useCallback(() => onPress(item), []) : undefined;
		return (
			<View testID="list-item" style={{ padding: sizes.itemPadding }}>
				<ProductCard onPress={onPressFn} link={!onPress} {...item} />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }} onLayout={onLayout} testID="product-grid-root">
			{sizes.itemWidth > 0 ? (
				<GraphqlList
					loading={loading}
					query={ProductListQuery}
					queryOptions={{
						...queryOptions,
						variables: {
							avatarSize: Math.ceil(sizes.itemWidth),
							...get(queryOptions, 'variables'),
						},
					}}
					updateQueryInfinitePagination={ProductListQueryUpdateQueryFn}
					contentContainerStyle={[
						{
							alignSelf: 'center',
							backgroundColor: 'white',
							paddingHorizontal: sizes.containerPadding,
							paddingTop: sizes.containerPadding,
							width: sizes.containerWidth,
						},
						contentContainerStyle as any,
					]}
					ListFooterComponentStyle={{ marginTop: sizes.containerPadding }}
					numColumns={props.horizontal ? undefined : sizes.numColumns}
					mapQueryResultToListData={mapQueryResultToListData}
					mapQueryResultToConnection={mapQueryResultToConnection}
					renderItem={renderItem}
					key={`${sizes.numColumns}-columns`}
					// tslint:disable-next-line: jsx-no-lambda
					// eslint-disable-next-line react/jsx-no-bind
					onPageChange={(p: number) => console.log(`Page changed: ${p}`)}
					// itemsPerPage={sizes.numColumns * 3}
					{...props}
				/>
			) : null}
		</View>
	);
};
