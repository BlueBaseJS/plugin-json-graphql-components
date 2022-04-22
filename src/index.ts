import { createPlugin } from '@bluebase/core';

import { GraphqlList } from './GraphqlList';
import { GraphqlTable } from './GraphqlTable';
import { JsonGraphqlForm } from './JsonGraphqlForm';

export * from './exports';

export default createPlugin({
	categories: ['ui'],
	description: 'A utility to build pluggable components based on JSON schema!',
	key: 'plugin-json-graphql-components',
	name: 'Json GraphQL Components',
	version: '0.0.1',

	components: {
		GraphqlList,
		GraphqlTable,
		JsonGraphqlForm,
	},
});
