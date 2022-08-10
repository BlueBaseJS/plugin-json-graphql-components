import { QueryResult } from '@apollo/client';
import { PaginationProps } from '@bluebase/components';
import { getComponent, Theme, useStyles } from '@bluebase/core';
import React from 'react';
import { View, ViewStyle } from 'react-native';

import { GraphqlListProps } from './types';

const Pagination = getComponent<PaginationProps>('Pagination', 'Noop');
Pagination.displayName = 'Pagination';

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
		justifyContent: 'center',
		padding: theme.spacing.unit,
	},
});

export const FooterNumbered = (props: GraphqlListFooterProps) => {
	const { itemsPerPage, result, mapQueryResultToConnection, onPageChange, loading, style } =
		props;
	const styles = useStyles('GraphqlListFooter', props, defaultProps);

	const page = props.page && typeof props.page === 'string'
		? parseInt(props.page as string)
		: props.page;

	const connection = mapQueryResultToConnection(result);
	const totalCount = connection?.totalCount !== undefined ? connection.totalCount : 0;
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	return (
		<View style={[styles.root, style]}>
			<Pagination count={totalPages} page={page} onChange={onPageChange} disabled={loading} />
		</View>
	);
};
FooterNumbered.displayName = 'FooterNumbered';
