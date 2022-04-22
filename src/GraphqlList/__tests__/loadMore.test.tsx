import 'cross-fetch/polyfill';

import { loadMore } from '../loadMore';

describe('GraphqlList', () => {
	describe('loadMore method', () => {
		it('should return false if there is no result', async () => {
			const result = await loadMore(
				null as any,
				{
					itemsPerPage: 10,
					mapQueryResultToConnection: jest.fn().mockReturnValue({}),
					queryOptions: { variables: {} },
					updateQuery: jest.fn(),
				} as any
			);
			expect(result).toBe(false);
		});

		it('should return false if there is no pageInfo', async () => {
			const result = await loadMore(
				{
					networkStatus: 5,
				} as any,
				{
					itemsPerPage: 10,
					mapQueryResultToConnection: jest.fn().mockReturnValue({}),
					queryOptions: { variables: {} },
					updateQuery: jest.fn(),
				} as any
			);
			expect(result).toBe(false);
		});

		it('should return false if hasNextPage is false', async () => {
			const result = await loadMore(
				{
					networkStatus: 5,
				} as any,
				{
					itemsPerPage: 10,
					mapQueryResultToConnection: jest
						.fn()
						.mockReturnValue({ pageInfo: { hasNextPage: false } }),
					queryOptions: { variables: {} },
					updateQuery: jest.fn(),
				} as any
			);
			expect(result).toBe(false);
		});

		it('should return false if networkStatus < 7', async () => {
			const result = await loadMore(
				{
					networkStatus: 5,
				} as any,
				{
					itemsPerPage: 10,
					mapQueryResultToConnection: jest
						.fn()
						.mockReturnValue({ pageInfo: { hasNextPage: true } }),
					queryOptions: { variables: {} },
					updateQuery: jest.fn(),
				} as any
			);
			expect(result).toBe(false);
		});

		it('should return ftrue and fetch first 10 items', async () => {
			const result: any = {
				fetchMore: jest.fn().mockResolvedValue(true),
				networkStatus: 7,
			};

			const res = await loadMore(result, {
				itemsPerPage: 10,
				mapQueryResultToConnection: jest
					.fn()
					.mockReturnValue({ edges: [], pageInfo: { hasNextPage: true } }),
				queryOptions: { variables: {} },
				updateQuery: jest.fn(),
			} as any);

			expect(res).toBe(true);
			expect(result.fetchMore).toHaveBeenCalledTimes(1);
			expect(result.fetchMore.mock.calls[0][0].variables).toMatchObject({ filter: { first: 10 } });
		});

		it('should not create custom filter when after is provided', async () => {
			const result: any = {
				fetchMore: jest.fn().mockResolvedValue(true),
				networkStatus: 7,
			};

			const res = await loadMore(result, {
				filter: { after: 3 },
				itemsPerPage: 10,
				mapQueryResultToConnection: jest
					.fn()
					.mockReturnValue({ edges: [], pageInfo: { hasNextPage: true } }),
				queryOptions: { variables: {} },
				updateQuery: jest.fn(),
			} as any);

			expect(res).toBe(true);
			expect(result.fetchMore).toHaveBeenCalledTimes(1);
			expect(result.fetchMore.mock.calls[0][0].variables).toMatchObject({ filter: { first: 10 } });
		});

		it('should return true and fetch 10 items after abc', async () => {
			const result: any = {
				fetchMore: jest.fn().mockResolvedValue(true),
				networkStatus: 7,
			};

			const res = await loadMore(result, {
				itemsPerPage: 10,
				mapQueryResultToConnection: jest.fn().mockReturnValue({
					edges: [{}, {}, {}],
					pageInfo: { hasNextPage: true, endCursor: 'abc' },
				}),
				queryOptions: { variables: {} },
				updateQuery: jest.fn(),
			} as any);

			expect(res).toBe(true);
			expect(result.fetchMore).toHaveBeenCalledTimes(1);
			expect(result.fetchMore.mock.calls[0][0].variables).toMatchObject({
				filter: { after: 'abc', first: 10 },
			});
		});

		it('should return false if fetchMore throws', async () => {
			const result: any = {
				fetchMore: jest.fn().mockRejectedValue(false),
				networkStatus: 7,
			};

			const res = await loadMore(result, {
				itemsPerPage: 10,
				mapQueryResultToConnection: jest
					.fn()
					.mockReturnValue({ edges: [{}, {}, { cursor: 'abc' }], pageInfo: { hasNextPage: true } }),
				queryOptions: { variables: {} },
				updateQuery: jest.fn(),
			} as any);

			expect(res).toBe(false);
			expect(result.fetchMore).toHaveBeenCalledTimes(1);
		});

		// it('should return false if there is no pageInfo', async () => {
		// 	const fetchMore = jest.fn();

		// 	const wrapper = mount(
		// 		<BlueBaseApp plugins={[BlueBasePluginApollo, Plugin]}>
		// 			<MockedProvider mocks={mocks.success} addTypename={false}>
		// 				<List />
		// 			</MockedProvider>
		// 		</BlueBaseApp>
		// 	);

		// 	await waitForElement(wrapper, 'Text[testID="list-item"]');

		// 	const instance = wrapper
		// 		.find('GraphqlList')
		// 		.last()
		// 		.instance() as any;

		// 	instance.result = { networkStatus: 7, fetchMore } as any;
		// 	instance.connection = null as any;

		// 	const result = await instance.loadMore();
		// 	expect(result).toBe(false);

		// 	wrapper.unmount();
		// });

		// it('should return false if there is no result', async () => {
		// 	const wrapper = mount(
		// 		<BlueBaseApp plugins={[BlueBasePluginApollo, Plugin]}>
		// 			<MockedProvider mocks={mocks.success} addTypename={false}>
		// 				<List />
		// 			</MockedProvider>
		// 		</BlueBaseApp>
		// 	);

		// 	await waitForElement(wrapper, 'Text[testID="list-item"]');

		// 	const instance = wrapper
		// 		.find('GraphqlList')
		// 		.last()
		// 		.instance() as any;

		// 	instance.result = null as any;

		// 	const result = await instance.loadMore();
		// 	expect(result).toBe(false);

		// 	wrapper.unmount();
		// });

		// it('should execute fetchMore successfully', async () => {
		// 	const fetchMore = jest.fn();
		// 	fetchMore.mockResolvedValue(true);

		// 	const wrapper = mount(
		// 		<BlueBaseApp plugins={[BlueBasePluginApollo, Plugin]}>
		// 			<MockedProvider mocks={mocks.success} addTypename={false}>
		// 				<List />
		// 			</MockedProvider>
		// 		</BlueBaseApp>
		// 	);

		// 	await waitForElement(wrapper, 'Text[testID="list-item"]');

		// 	const instance = wrapper
		// 		.find('GraphqlList')
		// 		.last()
		// 		.instance() as any;

		// 	instance.result = { networkStatus: 7, fetchMore } as any;

		// 	const result = await instance.loadMore();

		// 	expect(result).toBe(true);
		// 	expect(fetchMore.mock.calls[0][0].variables).toMatchObject({
		// 		filter: { after: 9, first: 10 },
		// 	});

		// 	wrapper.unmount();
		// });

		// it('should start from beginning if there are no edges', async () => {
		// 	const fetchMore = jest.fn();
		// 	fetchMore.mockResolvedValue(true);

		// 	const wrapper = mount(
		// 		<BlueBaseApp plugins={[BlueBasePluginApollo, Plugin]}>
		// 			<MockedProvider mocks={mocks.success} addTypename={false}>
		// 				<List />
		// 			</MockedProvider>
		// 		</BlueBaseApp>
		// 	);

		// 	await waitForElement(wrapper, 'Text[testID="list-item"]');

		// 	const instance = wrapper
		// 		.find('GraphqlList')
		// 		.last()
		// 		.instance() as any;

		// 	instance.result = { networkStatus: 7, fetchMore } as any;
		// 	instance.connection = {
		// 		...instance.connection,
		// 		edges: undefined,
		// 	} as any;

		// 	const result = await instance.loadMore();

		// 	expect(result).toBe(true);
		// 	expect(fetchMore.mock.calls[0][0].variables).toMatchObject({
		// 		filter: { first: 10 },
		// 	});

		// 	wrapper.unmount();
		// });

		// it('should catch fetchMore error', async () => {
		// 	const fetchMore = jest.fn();
		// 	fetchMore.mockRejectedValue(Error('Boom'));

		// 	const wrapper = mount(
		// 		<BlueBaseApp plugins={[BlueBasePluginApollo, Plugin]}>
		// 			<MockedProvider mocks={mocks.success} addTypename={false}>
		// 				<List />
		// 			</MockedProvider>
		// 		</BlueBaseApp>
		// 	);

		// 	await waitForElement(wrapper, 'Text[testID="list-item"]');

		// 	const instance = wrapper
		// 		.find('GraphqlList')
		// 		.last()
		// 		.instance() as any;

		// 	instance.result = { networkStatus: 7, fetchMore } as any;

		// 	const result = await instance.loadMore();

		// 	expect(result).toBe(false);
		// 	expect(fetchMore.mock.calls[0][0].variables).toMatchObject({
		// 		filter: { after: 9, first: 10 },
		// 	});
		// 	expect((instance.state.fetchMoreError as any).message).toBe('Boom');

		// 	wrapper.unmount();
		// });
	});
});
