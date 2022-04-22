import { getQueryVariables } from '../getQueryVariables';

describe('GraphqlList', () => {
	describe('getQueryVariables method', () => {
		it('should return filter for first 5 items', async () => {
			const result = getQueryVariables({}, {}, { itemsPerPage: 5 });
			expect(result).toMatchObject({
				filter: {
					first: 5,
				},
			});
		});

		it('should return filter for first 7 items', async () => {
			const result = getQueryVariables({}, { filter: { first: 7 } }, { itemsPerPage: 10 });
			expect(result).toMatchObject({
				filter: {
					first: 7,
				},
			});
		});

		it('should return limit/offset filter when pagination method is numbered', async () => {
			const result = getQueryVariables(
				{},
				{},
				{ itemsPerPage: 5, pagination: 'numbered', page: 3 }
			);
			expect(result).toMatchObject({
				filter: {
					limit: 5,
					offset: 10,
				},
			});
		});
	});
});
