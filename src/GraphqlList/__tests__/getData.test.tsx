/* eslint-disable max-len */
// tslint:disable: max-line-length

import get from 'lodash.get';

import { ProductListQueryMocks } from '../__artifacts__/mocks';
import { getData } from '../getData';

function mapQueryResultToListData(result: any) {
	// Extract Data
	const edges: any[] = get(result, 'data.products.edges', []);
	return edges.map((edge) => ({
		...edge.node,

		avatar: get(edge, 'node.avatar') ? { uri: get(edge, 'node.avatar') } : undefined,
		thumbnail: get(edge, 'node.thumbnail') ? { uri: get(edge, 'node.thumbnail') } : undefined,
	}));
}

describe('GraphqlList', () => {
	describe('getData method', () => {
		it('should return data filled with loading items when props.loading is true', async () => {
			const data = getData(
				{ loading: true, itemsPerPage: 10, mapQueryResultToListData } as any,
				{ networkStatus: 1, data: ProductListQueryMocks.success()[0].result.data } as any
			);

			expect(data).toMatchObject([
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
		});

		it('should return data filled with loading items when fetchMore is state is set and pagination is not infinite', async () => {
			const data = getData(
				{
					itemsPerPage: 10,
					loading: false,
					mapQueryResultToListData,
					pagination: 'numbered',
				} as any,
				{ networkStatus: 3, data: ProductListQueryMocks.success()[0].result.data } as any
			);

			expect(data).toMatchObject([
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
		});

		it('should return data appended with loading items when fetchMore is state is set and pagination is infinite', async () => {
			const data = getData(
				{
					itemsPerPage: 10,
					loading: false,
					mapQueryResultToListData,
					pagination: 'infinite',
				} as any,
				{ networkStatus: 3, data: ProductListQueryMocks.success()[0].result.data } as any
			);

			expect(data).toHaveLength(11);
			expect(data[0].id).toBeDefined();
			expect(data[1].id).toBeDefined();
			expect(data[2].id).toBeDefined();
			expect(data[3].id).toBeDefined();
			expect(data[4].id).toBeDefined();
			expect(data[5].id).toBeDefined();
			expect(data[6].id).toBeDefined();
			expect(data[7].id).toBeDefined();
			expect(data[8].id).toBeDefined();
			expect(data[9].id).toBeDefined();
			expect(data[10]).toMatchObject({ loading: true });
		});

		it('should return data', async () => {
			const data = getData(
				{
					itemsPerPage: 10,
					loading: false,
					mapQueryResultToListData,
					pagination: 'infinite',
				} as any,
				{ networkStatus: 7, data: ProductListQueryMocks.success()[0].result.data } as any
			);

			expect(data).toHaveLength(10);
			expect(data[0].id).toBeDefined();
			expect(data[1].id).toBeDefined();
			expect(data[2].id).toBeDefined();
			expect(data[3].id).toBeDefined();
			expect(data[4].id).toBeDefined();
			expect(data[5].id).toBeDefined();
			expect(data[6].id).toBeDefined();
			expect(data[7].id).toBeDefined();
			expect(data[8].id).toBeDefined();
			expect(data[9].id).toBeDefined();
		});
	});
});
