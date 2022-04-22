import { isLoading } from '../isLoading';

describe('GraphqlList', () => {
	describe('isLoading method', () => {
		it('should return loading "false" and fetchMore "false" when no params are given', async () => {
			const result = isLoading();
			expect(result).toMatchObject({ loading: false, fetchMore: false });
		});

		it('should return loading "false" and fetchMore "false" when loading param is "true"', async () => {
			const result = isLoading(true);
			expect(result).toMatchObject({ loading: true, fetchMore: false });
		});

		it('should return loading "true" and fetchMore "false" when networkStatus is 1', async () => {
			const result = isLoading(false, { networkStatus: 1 } as any);
			expect(result).toMatchObject({ loading: true, fetchMore: false });
		});

		it('should return loading "true" and fetchMore "true" when networkStatus is 3', async () => {
			const result = isLoading(false, { networkStatus: 3 } as any);
			expect(result).toMatchObject({ loading: true, fetchMore: true });
		});
	});
});
