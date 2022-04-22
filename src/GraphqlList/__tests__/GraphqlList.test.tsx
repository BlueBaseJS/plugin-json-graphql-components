import 'cross-fetch/polyfill';

import { MockedProvider } from '@apollo/client/testing';
import { FlatList } from '@bluebase/components';
import { BlueBase, BlueBaseApp } from '@bluebase/core';
import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import BlueBasePluginMaterialUI from '@bluebase/plugin-material-ui';
import { mount } from 'enzyme';
import { waitForElement } from 'enzyme-async-helpers';
import React from 'react';
import { View } from 'react-native';

import Plugin from '../../../index';
import { ProductListQueryMocks } from '../__artifacts__/mocks';
import { ProductGrid } from '../__artifacts__/ProductGrid';

async function waitForLayout(wrapper: any, selector: any) {
	await waitForElement(wrapper, selector);

	const onLayout: any = wrapper.find('[testID="product-grid-root"]').first().prop('onLayout');
	onLayout({
		nativeEvent: {
			layout: {
				height: 800,
				width: 300,
			},
		},
	});
	wrapper.update();
}

describe('GraphqlList', () => {
	it('should render a FlatList', async () => {
		const wrapper = mount(
			<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
				<MockedProvider
					mocks={[
						...ProductListQueryMocks.successOffset(142),
						...ProductListQueryMocks.successOffset(160),
						...ProductListQueryMocks.successOffset(172),
					]}
					addTypename={false}
				>
					<ProductGrid page={1} />
				</MockedProvider>
			</BlueBaseApp>
		);

		await waitForLayout(wrapper, ProductGrid);

		// expect(wrapper.find(List)).toMatchSnapshot();
		const onEndReached: any = wrapper.find(FlatList).first().prop('onEndReached');

		onEndReached();

		expect(wrapper.find(FlatList).exists()).toBe(true);

		wrapper.unmount();
	});

	it('onEndReached should not do anything when pagination is not infinite', async () => {
		const wrapper = mount(
			<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
				<MockedProvider
					mocks={[
						...ProductListQueryMocks.successOffset(142),
						...ProductListQueryMocks.successOffset(160),
						...ProductListQueryMocks.successOffset(172),
					]}
					addTypename={false}
				>
					<ProductGrid pagination="numbered" page={1} subscribeToMoreOptions={{} as any} />
				</MockedProvider>
			</BlueBaseApp>
		);

		await waitForLayout(wrapper, ProductGrid);

		const onEndReached: any = wrapper.find(FlatList).first().prop('onEndReached');
		onEndReached();

		expect(wrapper.find(FlatList).exists()).toBe(true);

		wrapper.unmount();
	});

	it('should render a loading state FlatList', async () => {
		const wrapper = mount(
			<BlueBaseApp
				plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}
				filters={{
					'bluebase.boot.end': (_bo: any, _ctx: any, BB: BlueBase) => {
						BB.Components.register('SkeletonCard', View);
					},
				}}
			>
				<ProductGrid loading />
			</BlueBaseApp>
		);

		await waitForLayout(wrapper, ProductGrid);

		expect(wrapper.find(FlatList).first().prop('data')).toMatchObject([
			{ loading: true },
			{ loading: true },
			{ loading: true },
			{ loading: true },
			{ loading: true },
			{ loading: true },
			{ loading: true },
			{ loading: true },
			{ loading: true },
			{ loading: true },
		]);

		wrapper.unmount();
	});
});
