import { QueryResult } from '@apollo/client';
import { Button } from '@bluebase/components';
import { Theme, useStyles } from '@bluebase/core';
import get from 'lodash.get';
import React from 'react';
import { View, ViewStyle } from 'react-native';

import { loadMore } from './loadMore';
import { GraphqlListProps } from './types';

export interface GraphqlListFooterStyles {
	root: ViewStyle;
}

export interface GraphqlListFooterProps extends GraphqlListProps {
	result: QueryResult<any, Record<string, any>>;

	style?: ViewStyle;
	styles?: Partial<GraphqlListFooterStyles>;
}

const defaultProps = (theme: Theme): GraphqlListFooterStyles => ({
	root: {
		borderTopColor: theme.palette.divider,
		borderTopWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: theme.spacing.unit,
	},
});

export const FooterNextPrevious = (props: GraphqlListFooterProps) => {
	const { result, mapQueryResultToConnection, loading, style } = props;
	const styles = useStyles('GraphqlListFooter', props, defaultProps);

	const connection = mapQueryResultToConnection(result);
	const hasNextPage = get(connection, 'pageInfo.hasNextPage');
	const hasPreviousPage = get(connection, 'pageInfo.hasPreviousPage');
	const startCursor = get(connection, 'pageInfo.startCursor');

	function goToNextPage() {
		loadMore(result, props);
	}

	function goToPreviousPage() {
		loadMore(result, {
			...props,
			filter: {
				...props.filter,
				after: undefined,
				before: startCursor,
			},
		});
	}

	return (
		<View style={[styles.root, style]}>
			<Button
				title="Previous"
				variant="text"
				onPress={goToPreviousPage}
				disabled={loading || !hasPreviousPage}
			/>
			<Button
				title="Next"
				variant="text"
				onPress={goToNextPage}
				disabled={loading || !hasNextPage}
			/>
		</View>
	);
};
