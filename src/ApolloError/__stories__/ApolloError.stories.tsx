import { useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { ErrorObserver } from '@bluebase/components';
import { BlueBaseApp } from '@bluebase/core';
import storiesOf from '@bluebase/storybook-addon';
import React from 'react';
import { Text } from 'react-native';

import bootOptions from '../../../boot';
import * as mocks from './mocks';
import { plugins } from './plugins';
import { HelloWorldQuery } from './Query';

export const Hello = () => {
	const { loading, error } = useQuery(HelloWorldQuery);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error</p>;
	return (
		<ErrorObserver error={error}>
			<Text>World</Text>
		</ErrorObserver>
	);
};

storiesOf('ApolloError', module)
	.add('With Network Error', () => (
		<BlueBaseApp {...bootOptions} plugins={plugins}>
			<Hello />
		</BlueBaseApp>
	))
	.add('With Network Error in urdu', () => (
		<BlueBaseApp {...bootOptions} plugins={plugins} configs={{ locale: 'ur' }}>
			<Hello />
		</BlueBaseApp>
	))
	.add('With UnAuthenticated Error', () => (
		<BlueBaseApp {...bootOptions} plugins={plugins}>
			<MockedProvider mocks={[mocks.graphQLErrorsUnAuthenticated as any]} addTypename={false}>
				<Hello />
			</MockedProvider>
		</BlueBaseApp>
	))
	.add('With UnAuthenticated Error in urdu', () => (
		<BlueBaseApp {...bootOptions} plugins={plugins} configs={{ locale: 'ur' }}>
			<MockedProvider mocks={[mocks.graphQLErrorsUnAuthenticated as any]} addTypename={false}>
				<Hello />
			</MockedProvider>
		</BlueBaseApp>
	))
	.add('With Other GraphQL Errors', () => (
		<BlueBaseApp {...bootOptions} plugins={plugins}>
			<MockedProvider mocks={[mocks.graphQLErrorsBadUserInput as any]} addTypename={false}>
				<Hello />
			</MockedProvider>
		</BlueBaseApp>
	))
	.add('With Forbidden Error', () => (
		<BlueBaseApp {...bootOptions} plugins={plugins}>
			<MockedProvider mocks={[mocks.graphQLErrorsForbidden as any]} addTypename={false}>
				<Hello />
			</MockedProvider>
		</BlueBaseApp>
	))
	.add('With Forbidden Error in urdu', () => (
		<BlueBaseApp {...bootOptions} plugins={plugins} configs={{ locale: 'ur' }}>
			<MockedProvider mocks={[mocks.graphQLErrorsForbidden as any]} addTypename={false}>
				<Hello />
			</MockedProvider>
		</BlueBaseApp>
	))
	.add('With Generic Error', () => (
		<BlueBaseApp {...bootOptions} plugins={plugins}>
			<ErrorObserver error={Error('Boom!')}>
				<Hello />
			</ErrorObserver>
		</BlueBaseApp>
	));
