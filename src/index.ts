import { BlueBase, BootOptions, createPlugin } from '@bluebase/core';

import { withApolloError } from './ApolloError';
import { ForbiddenError } from './ForbiddenError';
import { GraphqlList } from './GraphqlList';
import { GraphqlListCarousel } from './GraphqlListCarousel';
import { GraphqlTable } from './GraphqlTable';
import { JsonGraphqlForm } from './JsonGraphqlForm';
import { NetworkError } from './NetworkError';
import { NotFoundError } from './NotFoundError';
import { UnauthenticatedError } from './UnauthenticatedError';
import { VERSION } from './version';

export * from './exports';

export default createPlugin({
	categories: ['ui'],
	description: 'A utility to build pluggable components based on JSON schema!',
	key: 'plugin-json-graphql-components',
	name: 'Json GraphQL Components',
	version: VERSION,

	assets: {
		// Errors
		ForbiddenError: require('../assets/forbidden-error.png'),
		NetworkError: require('../assets/network-error.png'),
		NotFoundError: require('../assets/404-error.png'),
	},

	components: {
		ForbiddenError,
		GraphqlList,
		GraphqlListCarousel,
		GraphqlTable,
		JsonGraphqlForm,
		NetworkError,
		NotFoundError,
		UnauthenticatedError,
	},

	filters: {
		'bluebase.boot.end': (bootOptions: BootOptions, _ctx: any, BB: BlueBase) => {
			BB.Components.addHocs('ErrorState', withApolloError);
			return bootOptions;
		},
	},
});
