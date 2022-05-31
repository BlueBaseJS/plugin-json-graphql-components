import 'cross-fetch/polyfill';

import { MockedProvider } from '@apollo/client/testing';
import { ErrorObserver, Redirect } from '@bluebase/components';
import { BlueBaseApp, getComponent } from '@bluebase/core';
import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import BlueBasePluginMaterialUI from '@bluebase/plugin-material-ui';
import { mount } from 'enzyme';
import { waitForElement } from 'enzyme-async-helpers';
import React from 'react';
import { Text } from 'react-native';

import Plugin from '../../index';
import * as mocks from '../__stories__/mocks';
import { HelloWorldQuery } from '../__stories__/Query';

const Query = getComponent('GraphqlQuery');

const Hello = () => <Text>World</Text>;

describe('ApolloError', () => {
	// it('should show a network error', async () => {
	// 	const wrapper = mount(
	// 		<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
	// 			<MockedProvider mocks={[mocks.networkError as any]} addTypename={false}>
	// 				<Query query={HelloWorldQuery}>
	// 					{(result: any) => (
	// 						<ErrorObserver error={result.error}>
	// 							<Hello />
	// 						</ErrorObserver>
	// 					)}
	// 				</Query>
	// 			</MockedProvider>
	// 		</BlueBaseApp>
	// 	);

	// 	await waitForElement(wrapper, 'NetworkError');

	// 	expect(wrapper.find('NetworkError').exists()).toBe(true);
	// });

	it('should show an unauthenticated error', async () => {
		const wrapper = mount(
			<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
				<MockedProvider mocks={[mocks.graphQLErrorsUnAuthenticated as any]} addTypename={false}>
					<Query query={HelloWorldQuery}>
						{(result: any) => (
							<ErrorObserver error={result.error}>
								<Hello />
							</ErrorObserver>
						)}
					</Query>
				</MockedProvider>
			</BlueBaseApp>
		);

		await waitForElement(wrapper, 'Redirect');
		expect(wrapper.find(Redirect).prop('routeName')).toBe('Logout');
	});

	it('should show an forbidden error', async () => {
		const wrapper = mount(
			<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
				<MockedProvider mocks={[mocks.graphQLErrorsForbidden as any]} addTypename={false}>
					<Query query={HelloWorldQuery}>
						{(result: any) => (
							<ErrorObserver error={result.error}>
								<Hello />
							</ErrorObserver>
						)}
					</Query>
				</MockedProvider>
			</BlueBaseApp>
		);

		await waitForElement(wrapper, 'ForbiddenError');

		expect(wrapper.find('ForbiddenError').exists()).toBe(true);
	});

	it('should show an not found error', async () => {
		const wrapper = mount(
			<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
				<MockedProvider mocks={[mocks.graphQLErrorsNotFound as any]} addTypename={false}>
					<Query query={HelloWorldQuery}>
						{(result: any) => (
							<ErrorObserver error={result.error}>
								<Hello />
							</ErrorObserver>
						)}
					</Query>
				</MockedProvider>
			</BlueBaseApp>
		);

		await waitForElement(wrapper, 'NotFoundError');

		expect(wrapper.find('NotFoundError').exists()).toBe(true);
	});

	it('should generic error with other graphql errors', async () => {
		const wrapper = mount(
			<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
				<MockedProvider mocks={[mocks.graphQLErrorsBadUserInput as any]} addTypename={false}>
					<Query query={HelloWorldQuery}>
						{(result: any) => (
							<ErrorObserver error={result.error}>
								<Hello />
							</ErrorObserver>
						)}
					</Query>
				</MockedProvider>
			</BlueBaseApp>
		);

		await waitForElement(wrapper, 'ErrorState');

		const props: any = wrapper.find('ErrorState ComponentState').first().props();

		expect(props.title).toBe('Error');
		expect(props.description).toBe('Failed to get events due to validation errors');
	});

	it('should show generic error', async () => {
		const wrapper = mount(
			<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
				<ErrorObserver error={Error('Boom!')}>
					<Hello />
				</ErrorObserver>
			</BlueBaseApp>
		);

		await waitForElement(wrapper, 'ErrorState');

		const props: any = wrapper.find('ErrorState ComponentState').first().props();

		expect(props.title).toBe('Error');
		expect(props.description).toBe('Boom!');
	});
});
