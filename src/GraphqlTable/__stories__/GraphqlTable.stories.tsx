import { MockedProvider } from '@apollo/client/testing';
import { BlueBaseApp } from '@bluebase/core';
import storiesOf from '@bluebase/storybook-addon';
import React, { useState } from 'react';
import { MemoryRouter } from 'react-router';

import bootOptions from '../../../../boot';
import { ProductListQueryMocks } from '../../GraphqlList/__artifacts__/mocks';
import { ProductTable } from '../__artifacts__/ProductTable';

storiesOf('GraphqlTable', module).add('Basic Example', () => {
	const Comp = () => {
		const [page, setPage] = useState(1);

		return (
			<BlueBaseApp {...bootOptions}>
				<MemoryRouter>
					<MockedProvider mocks={ProductListQueryMocks.successOffset(142)} addTypename={false}>
						<ProductTable page={page} onPageChange={setPage} />
					</MockedProvider>
				</MemoryRouter>
			</BlueBaseApp>
		);
	};

	return <Comp />;
});
