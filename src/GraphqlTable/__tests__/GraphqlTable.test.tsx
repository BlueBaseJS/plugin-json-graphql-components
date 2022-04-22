import 'cross-fetch/polyfill';

import { MockedProvider } from '@apollo/client/testing';
import { ActivityIndicator } from '@bluebase/components';
import { BlueBaseApp } from '@bluebase/core';
import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import BlueBasePluginMaterialUI from '@bluebase/plugin-material-ui';
import { mount } from 'enzyme';
import { waitForElement } from 'enzyme-async-helpers';
import React, { useState } from 'react';

import Plugin from '../../../index';
import { ProductListQueryMocks } from '../../GraphqlList/__artifacts__/mocks';
import { ProductTable } from '../__artifacts__/ProductTable';
import { GraphqlTableProps } from '../GraphqlTable';

const TableComponent = (props: Partial<GraphqlTableProps>) => {
	const [page, setPage] = useState(props.page || 1);

	function onPageChange(pageNum: number) {
		setPage(pageNum);

		if (props.onPageChange) {
			props.onPageChange(pageNum);
		}
	}

	return (
		<BlueBaseApp plugins={[BlueBasePluginApollo, BlueBasePluginMaterialUI, Plugin]}>
			<MockedProvider mocks={ProductListQueryMocks.successOffset(142)} addTypename={false}>
				<ProductTable page={page} onPageChange={props.onPageChange && onPageChange} {...props} />
			</MockedProvider>
		</BlueBaseApp>
	);
};

describe('GraphqlTable', () => {
	it('should render a Table', async () => {
		const onPageChangeMock = jest.fn();

		const wrapper = mount(<TableComponent page={1} onPageChange={onPageChangeMock} />);

		await waitForElement(wrapper, 'Table');

		const onPageChange: any = wrapper.find('TablePagination').first().prop('onPageChange');

		await onPageChange(2);

		expect(wrapper.find('TableBody').find('TableRow')).toBeDefined();

		wrapper.unmount();
	});

	it('should revert to previous page when a query fails', async () => {
		const onPageChangeMock = jest.fn();

		const wrapper = mount(<TableComponent page={1} onPageChange={onPageChangeMock} />);

		await waitForElement(wrapper, 'Table');

		const onPageChange: any = wrapper.find('TablePagination').first().prop('onPageChange');

		await onPageChange(20);

		expect(onPageChangeMock).toHaveBeenCalledTimes(2);
		expect(onPageChangeMock).toHaveBeenLastCalledWith(1);

		wrapper.unmount();
	});

	it('should render a Table but not call onPageChange', async () => {
		const onPageChangeMock = jest.fn();

		const wrapper = mount(<TableComponent page={1} />);

		await waitForElement(wrapper, 'Table');

		const onPageChange: any = wrapper.find('TablePagination').first().prop('onPageChange');

		await onPageChange(2);

		expect(onPageChangeMock).toHaveBeenCalledTimes(0);

		wrapper.unmount();
	});

	it('should render loading state', async () => {
		const wrapper = mount(<TableComponent page={1} loading />);

		await waitForElement(wrapper, 'Table');

		expect(wrapper.find(ActivityIndicator)).toHaveLength(10);

		wrapper.unmount();
	});
});
