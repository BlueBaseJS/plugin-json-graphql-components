import { ApolloError } from '@apollo/client';
import { getComponent } from '@bluebase/core';
import get from 'lodash.get';
import React from 'react';

const BadUserInputError = getComponent('BadUserInputError');
const ForbiddenError = getComponent('ForbiddenError');
const NetworkError = getComponent('NetworkError');
const NotFoundError = getComponent('NotFoundError');
const UnauthenticatedError = getComponent('UnauthenticatedError');

export interface ApolloErrorComponentProps {
	[key: string]: any;
	error?: any;
	retry?: () => void;
	children: React.ReactNode;
}

export const ApolloErrorComponent = (props: ApolloErrorComponentProps) => {
	const { children, ...rest } = props;
	const error = props.error as ApolloError;

	if (error) {
		if (error.networkError) {
			return <NetworkError {...rest} />;
		}

		if (error.graphQLErrors && error.graphQLErrors.length > 0) {
			// Unauthenticated
			const unauthenticated = error.graphQLErrors.find(
				(e) => get(e, 'extensions.code') === 'UNAUTHENTICATED'
			);

			if (unauthenticated) {
				return <UnauthenticatedError {...rest} />;
			}

			// Forbidden
			const forbidden = error.graphQLErrors.find((e) => get(e, 'extensions.code') === 'FORBIDDEN');

			if (forbidden) {
				return <ForbiddenError {...rest} />;
			}

			// 404
			const notFound = error.graphQLErrors.find((e) => get(e, 'extensions.code') === 'NOT_FOUND');

			if (notFound) {
				return <NotFoundError {...rest} />;
			}

			// 404
			const badUserInput = error.graphQLErrors.find((e) => get(e, 'extensions.code') === 'BAD_USER_INPUT');

			if (notFound) {
				return <BadUserInputError {...rest} />;
			}
		}
	}

	return children as any;
};
