/* eslint-disable max-len */
// tslint:disable: max-line-length

import { FetchMoreOptions } from '@apollo/client';

import { getUpdateQuery } from '../getUpdateQuery';

describe('GraphqlList', () => {
	describe('getUpdateQuery method', () => {
		it('should return default method when no inputs are given', async () => {
			const updateQuery: FetchMoreOptions['updateQuery'] = getUpdateQuery({} as any);

			// Return previousResult
			expect(updateQuery!('foo', {})).toBe('foo');

			// Return fetchMoreResult
			expect(updateQuery!('foo', { fetchMoreResult: 'bar' })).toBe('bar');
		});

		it('should return updateQuery method when no inputs are given', async () => {
			const updateQuery = () => 'updateQuery';
			const updateQueryMethod: FetchMoreOptions['updateQuery'] = getUpdateQuery({
				updateQuery,
			} as any);

			expect(updateQueryMethod!({}, {})).toBe('updateQuery');
		});

		it('should return updateQuery method when pagination is infinite and updateQueryInfinitePagination method is not given', async () => {
			const updateQuery = () => 'updateQuery';

			const updateQueryMethod: FetchMoreOptions['updateQuery'] = getUpdateQuery({
				pagination: 'infinite',
				updateQuery,
			} as any);

			expect(updateQueryMethod!({}, {})).toBe('updateQuery');
		});

		it('should return updateQueryInfinitePagination method when pagination is infinite and updateQueryInfinitePagination method is given', async () => {
			const updateQuery = () => 'updateQuery';
			const updateQueryInfinitePagination = () => 'updateQueryInfinitePagination';

			const updateQueryMethod = getUpdateQuery({
				pagination: 'infinite',
				updateQuery,
				updateQueryInfinitePagination,
			} as any);

			expect(updateQueryMethod!({}, {})).toBe('updateQueryInfinitePagination');
		});

		it('should return updateQuery method when pagination is numbered and updateQueryNumberedPagination method is not given', async () => {
			const updateQuery = () => 'updateQuery';

			const updateQueryMethod: FetchMoreOptions['updateQuery'] = getUpdateQuery({
				pagination: 'numbered',
				updateQuery,
			} as any);

			expect(updateQueryMethod!({}, {})).toBe('updateQuery');
		});

		it('should return updateQueryNumberedPagination method when pagination is numbered and updateQueryNumberedPagination method is given', async () => {
			const updateQuery = () => 'updateQuery';
			const updateQueryNumberedPagination = () => 'updateQueryNumberedPagination';

			const updateQueryMethod: FetchMoreOptions['updateQuery'] = getUpdateQuery({
				pagination: 'numbered',
				updateQuery,
				updateQueryNumberedPagination,
			} as any);

			expect(updateQueryMethod!({}, {})).toBe('updateQueryNumberedPagination');
		});

		it('should return updateQuery method when pagination is next-previous and updateQueryNextPreviousPagination method is not given', async () => {
			const updateQuery = () => 'updateQuery';

			const updateQueryMethod: FetchMoreOptions['updateQuery'] = getUpdateQuery({
				pagination: 'next-previous',
				updateQuery,
			} as any);

			expect(updateQueryMethod!({}, {})).toBe('updateQuery');
		});

		it('should return updateQueryNextPreviousPagination method when pagination is next-previous and updateQueryNumberedPagination method is given', async () => {
			const updateQuery = () => 'updateQuery';
			const updateQueryNextPreviousPagination = () => 'updateQueryNextPreviousPagination';

			const updateQueryMethod: FetchMoreOptions['updateQuery'] = getUpdateQuery({
				pagination: 'next-previous',
				updateQuery,
				updateQueryNextPreviousPagination,
			} as any);

			expect(updateQueryMethod!({}, {})).toBe('updateQueryNextPreviousPagination');
		});
	});
});
