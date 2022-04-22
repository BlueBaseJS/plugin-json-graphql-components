import 'cross-fetch/polyfill';

import { keyExtractor } from '../keyExtractor';

describe('GraphqlList', () => {
	describe('keyExtractor method', () => {
		it('should return item.id', async () => {
			expect(keyExtractor({ id: 'abc' }, 5)).toBe('abc');
		});
		it('should return index if there is no item.id', async () => {
			expect(keyExtractor({}, 5)).toBe('5');
		});
	});
});
