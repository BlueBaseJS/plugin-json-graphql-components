import { MockedProvider } from '@apollo/client/testing';
import { BlueBaseApp } from '@bluebase/core';
import storiesOf from '@bluebase/storybook-addon';
import React, { useState } from 'react';
import { MemoryRouter } from 'react-router';

import bootOptions from '../../../../boot';
import { ProductListQueryMocks } from '../__artifacts__/mocks';
import { ProductGrid } from '../__artifacts__/ProductGrid';

storiesOf('GraphqlList', module)
	.add('Basic Example', () => (
		<BlueBaseApp {...bootOptions}>
			<MemoryRouter>
				<MockedProvider
					mocks={[...ProductListQueryMocks.success(142), ...ProductListQueryMocks.success(172)]}
					addTypename={false}
				>
					<ProductGrid />
				</MockedProvider>
			</MemoryRouter>
		</BlueBaseApp>
	))

	.add('Numbered Pagination', () => {
		const Component = () => {
			const [page, onPageChange] = useState(1);
			return (
				<BlueBaseApp {...bootOptions}>
					<MemoryRouter>
						<MockedProvider
							mocks={[...ProductListQueryMocks.success(142), ...ProductListQueryMocks.success(172)]}
							addTypename={false}
						>
							<ProductGrid pagination="numbered" page={page} onPageChange={onPageChange} />
						</MockedProvider>
					</MemoryRouter>
				</BlueBaseApp>
			);
		};

		return <Component />;
	})

	.add('With Network Error', () => (
		<BlueBaseApp {...bootOptions}>
			<MemoryRouter>
				<ProductGrid />
			</MemoryRouter>
		</BlueBaseApp>
	))

	.add('With Unauthenticated Error', () => (
		<BlueBaseApp {...bootOptions}>
			<MemoryRouter>
				<MockedProvider
					mocks={[ProductListQueryMocks.graphQLErrorsUnAuthenticated as any]}
					addTypename={false}
				>
					<ProductGrid />
				</MockedProvider>
			</MemoryRouter>
		</BlueBaseApp>
	))
	.add('With Unauthenticated Error in urdu', () => (
		<BlueBaseApp {...bootOptions} configs={{ locale: 'ur' }}>
			<MemoryRouter>
				<MockedProvider
					mocks={[ProductListQueryMocks.graphQLErrorsUnAuthenticated as any]}
					addTypename={false}
				>
					<ProductGrid />
				</MockedProvider>
			</MemoryRouter>
		</BlueBaseApp>
	))

	.add('With Forbidden Error', () => (
		<BlueBaseApp {...bootOptions}>
			<MemoryRouter>
				<MockedProvider
					mocks={[ProductListQueryMocks.graphQLErrorsForbidden as any]}
					addTypename={false}
				>
					<ProductGrid />
				</MockedProvider>
			</MemoryRouter>
		</BlueBaseApp>
	));
