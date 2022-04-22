import { createPlugin } from '@bluebase/core';

import { GraphqlList } from './GraphqlList';
import { GraphqlTable } from './GraphqlTable';
import { JsonGraphqlForm } from './JsonGraphqlForm';
import { VERSION } from './version';

export * from './exports';

export default createPlugin({
	categories: ['ui'],
	description: 'A utility to build pluggable components based on JSON schema!',
	key: 'plugin-json-graphql-components',
	name: 'Json GraphQL Components',
	version: VERSION,

	components: {
		GraphqlList,
		GraphqlTable,
		JsonGraphqlForm,
	},
});
