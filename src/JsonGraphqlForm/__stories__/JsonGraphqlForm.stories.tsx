import { MockedProvider } from '@apollo/client/testing';
import { Card } from '@bluebase/components';
import storiesOf from '@bluebase/storybook-addon';
import React from 'react';

import { mocks } from '.';
import { EditProfileProfileForm } from './EditProfileProfileForm';
import { SignupForm } from './SignupForm';

const onSuccess = (_res: any, _vals: any, { setStatus }: any) => setStatus({ success: ['Done!'] });

storiesOf('JsonGraphqlForm', module)

	.add('With Network Error', () => (
		<Card style={{ width: 400, margin: 40 }}>
			<SignupForm />
		</Card>
	))

	.add('With Authentication Error', () => (
		<Card style={{ width: 400, margin: 40 }}>
			<MockedProvider mocks={[mocks.graphQLErrorsUnAuthenticated as any]} addTypename={false}>
				<SignupForm />
			</MockedProvider>
		</Card>
	))

	.add('With Bad User Input', () => (
		<Card style={{ width: 400, margin: 40 }}>
			<MockedProvider mocks={[mocks.graphQLErrorsBadUserInput as any]} addTypename={false}>
				<SignupForm />
			</MockedProvider>
		</Card>
	))

	.add('Success', () => (
		<Card style={{ width: 400, margin: 40 }}>
			<MockedProvider mocks={[mocks.success]} addTypename={false}>
				<SignupForm onSuccess={onSuccess} />
			</MockedProvider>
		</Card>
	))

	.add('Initial Data from Query', () => (
		<Card style={{ width: 400, margin: 40 }}>
			<MockedProvider mocks={[mocks.viewerQuery]} addTypename={false}>
				<EditProfileProfileForm />
			</MockedProvider>
		</Card>
	))
;
