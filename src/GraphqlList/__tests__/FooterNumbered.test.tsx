import { BlueBaseApp } from '@bluebase/core';
import BlueBasePluginMaterialUI from '@bluebase/plugin-material-ui';
import { mount } from 'enzyme';
import { waitForElement } from 'enzyme-async-helpers';
import get from 'lodash.get';
import React from 'react';

import { ProductListQueryMocks } from '../__artifacts__/mocks';
import { GraphqlListFooter } from '../GraphqlListFooter';

function mapQueryResultToConnection(result: any) {
	return get(result, 'data.products');
}

describe('GraphqlList', () => {
	describe('GraphqlListFooter', () => {
		it('should render Pagination', async () => {
			const props: any = {
				itemsPerPage: 10,
				loading: false,
				mapQueryResultToConnection,
				onPageChange: undefined,
				page: 1,
				pagination: 'numbered',
				result: {
					data: ProductListQueryMocks.success()[0].result.data,
				},
			};

			const wrapper = mount(
				<BlueBaseApp plugins={[BlueBasePluginMaterialUI]}>
					<GraphqlListFooter {...props} />
				</BlueBaseApp>
			);

			await waitForElement(wrapper, GraphqlListFooter);

			expect(wrapper.find('Pagination').first().prop('count')).toBe(4);
			expect(wrapper.find('Pagination').first().prop('page')).toBe(1);
			expect(wrapper.find('Pagination').first().prop('disabled')).toBe(false);

			wrapper.unmount();
		});

		it('should render Pagination', async () => {
			const onPageChange = jest.fn();

			const props: any = {
				itemsPerPage: 10,
				loading: false,
				mapQueryResultToConnection,
				onPageChange,
				page: 1,
				pagination: 'numbered',
				result: {
					data: ProductListQueryMocks.success()[0].result.data,
				},
			};

			const wrapper = mount(
				<BlueBaseApp plugins={[BlueBasePluginMaterialUI]}>
					<GraphqlListFooter {...props} />
				</BlueBaseApp>
			);

			await waitForElement(wrapper, GraphqlListFooter);

			expect(wrapper.find('Pagination').first().prop('count')).toBe(4);
			expect(wrapper.find('Pagination').first().prop('page')).toBe(1);
			expect(wrapper.find('Pagination').first().prop('disabled')).toBe(false);

			const onChange: any = wrapper.find('Pagination').first().prop('onChange');
			onChange(2);

			expect(onPageChange).toHaveBeenCalledTimes(1);
			expect(onPageChange).toHaveBeenLastCalledWith(2);

			wrapper.unmount();
		});
	});
});
