import { QueryResult } from '@apollo/client';
import React from 'react';
import { ViewStyle } from 'react-native';

import { FooterNextPrevious } from './FooterNextPrevious';
import { FooterNumbered } from './FooterNumbered';
import { GraphqlListProps } from './types';

export interface GraphqlListFooterStyles {
	root: ViewStyle;
}

export interface GraphqlListFooterProps extends GraphqlListProps {
	result: QueryResult<any, Record<string, any>>;

	style?: ViewStyle;
	styles?: Partial<GraphqlListFooterStyles>;
}

export const GraphqlListFooter = (props: GraphqlListFooterProps) => {
	const { pagination } = props;

	if (pagination === 'numbered') {
		return <FooterNumbered {...props} />;
	}

	if (pagination === 'next-previous') {
		return <FooterNextPrevious {...props} />;
	}

	return null;
};
