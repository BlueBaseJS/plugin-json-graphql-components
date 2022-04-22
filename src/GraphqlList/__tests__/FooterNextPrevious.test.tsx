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
		it('should render next and previouss buttons', async () => {
			const props: any = {
				itemsPerPage: 10,
				loading: false,
				mapQueryResultToConnection,
				onPageChange: undefined,
				page: 1,
				pagination: 'next-previous',
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

			expect(wrapper.find('Button[title="Previous"]').first().prop('disabled')).toBe(true);
			expect(wrapper.find('Button[title="Next"]').first().prop('disabled')).toBe(false);

			const goToPreviousPage: any = wrapper
				.find('Button[title="Previous"]')
				.first()
				.prop('onPress');

			const goToNextPage: any = wrapper.find('Button[title="Next"]').first().prop('onPress');

			goToPreviousPage();
			goToNextPage();

			wrapper.unmount();
		});
	});
});
