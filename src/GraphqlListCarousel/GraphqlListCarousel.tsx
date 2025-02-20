import { Noop, View } from '@bluebase/components';
import { Theme } from '@bluebase/core';
import get from 'lodash.get';
import React, { useCallback, useRef } from 'react';
import { FlatList, FlatListProps, ViewStyle } from 'react-native';

import { GraphqlListProps } from '../GraphqlList';
import { GraphqlListCarouselToolbar, GraphqlListCarouselToolbarProps } from './GraphqlListCarouselToolbar';

export interface GraphqlListCarouselStyles {
	root: ViewStyle;
	gridContentContainerStyle: ViewStyle;
}

export interface GraphqlListCarouselProps<T = any>
	extends Partial<GraphqlListProps<T>>,
		Omit<GraphqlListCarouselToolbarProps, 'styles' | 'moveBack' | 'moveNext'> {
	/**
	 * A component that uses GraphqlList. Example: ThingGrid, PlaceGrid, etc
	 */
	GraphqlListComponent: React.ComponentType<Partial<GraphqlListProps>>;

	/**
	 * Base FlatList component. Used to extract ref from
	 */
	BaseListComponent?: React.ComponentType<FlatListProps<T>>;

	hideIfEmpty?: boolean;

	style?: ViewStyle;
	styles?: Partial<GraphqlListCarouselStyles>;
	trigger?: boolean;
	setRefreshing?: any;
}

export const GraphqlListCarousel = (props: GraphqlListCarouselProps) => {
	const {
		title,
		description,
		left,
		right,
		loading,
		style,
		hideIfEmpty,
		styles: _styles,
		ListEmptyComponent,
		BaseListComponent: _BaseListComponent,
		GraphqlListComponent,
		trigger,
		setRefreshing,
		...rest
	} = props;

	const styles = _styles!;
	const BaseListComponent = _BaseListComponent!;

	const list = useRef<FlatList<any>>(null);
	const ListWithRef = useCallback((p: any) => <BaseListComponent {...p} ref={list} />, []);

	let numColumns = 6;
	let index = 0;

	const data = get(list, 'current.props.data', []);
	const loadingData = get(list, 'current.props.loading');
	const refreshingData = get(list, 'current.props.refreshing', false);

	const shouldHide = hideIfEmpty === true
		&& loadingData === false
		&& refreshingData === false
		&& data.length === 0;

	/**
	 * Set index next to viewed items
	 */
	function moveNext() {
		if (!list.current) {
			return;
		}

		const listSize = get(list, 'current.props.data', []).length;
		const newIndex = index + numColumns;

		list.current.scrollToIndex({ animated: true, index: newIndex - 1 });
		return newIndex > listSize - 1 ? listSize - 1 : newIndex;
	}

	/**
	 * Set index back to viewed items
	 */
	function moveBack() {
		if (!list.current) {
			return;
		}

		index = index - numColumns > 0 ? index - numColumns : 0;

		if (index > 0) {
			list.current.scrollToIndex({ animated: true, index });
		} else {
			list.current.scrollToOffset({ animated: true, offset: 0 });
		}
		return index;
	}

	/**
	 * Set index if manually scrolling
	 */
	const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
		numColumns = viewableItems.length;
		if (viewableItems.length > 0) {
			index = viewableItems[0].index;
		}

		return index;
	}, []);

	// console.log(`shouldHide ${title}`, shouldHide);
	return (
		<View style={{ ...styles.root, ...style }}>
			{
				shouldHide ? null : (
					<GraphqlListCarouselToolbar
						title={title}
						description={description}
						left={left}
						right={right}
						loading={loading}
						moveBack={moveBack}
						moveNext={moveNext}
					/>
				)
			}
			<GraphqlListComponent
				horizontal
				loading={loading}
				scrollEnabled={!loading}
				contentContainerStyle={styles.gridContentContainerStyle}
				onViewableItemsChanged={onViewableItemsChanged}
				ListComponent={ListWithRef}
				// placeholderItems={numColumns}
				{...rest}
				trigger={trigger}
				setRefreshing={setRefreshing}
				ListEmptyComponent={shouldHide ? Noop : ListEmptyComponent}
			/>
		</View>
	);
};

GraphqlListCarousel.defaultProps = {
	BaseListComponent: FlatList,
};

GraphqlListCarousel.defaultStyles = (theme: Theme): GraphqlListCarouselStyles => ({
	root: {},

	gridContentContainerStyle: {
		padding: 0,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit,
	},
});
