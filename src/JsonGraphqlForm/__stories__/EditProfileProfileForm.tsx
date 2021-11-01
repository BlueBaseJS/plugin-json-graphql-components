import { gql } from '@apollo/client';
import { getComponent } from '@bluebase/core';
import React from 'react';

import { JsonGraphqlFormProps } from '..';

export const ViewerQuery = gql`
	{
		viewer {
			me {
				id
				firstName
				lastName
			}
		}
	}
`;

export const EditProfileMutation = gql`
	mutation EditProfileMutation($data: JSON) {
		signup(input: { data: $data }) {
			id
			firstName
			lastName
		}
	}
`;

export interface EditProfileProfileFormValues {
	firstName: string;
	lastName: string;
}

const JsonGraphqlForm = getComponent<JsonGraphqlFormProps<EditProfileProfileFormValues>>(
	'JsonGraphqlForm'
);

const mapQueryDataToInitialValues = (data: any) => {
	try {
		return data.viewer.me;
	} catch (_e) {
		return null;
	}
};

// const onSuccess = (_res: any, _vals: any, { setStatus }: any) => setStatus({ success: ['Done!'] });

export const EditProfileProfileForm = (props: Partial<JsonGraphqlFormProps<any>>) => (
	<JsonGraphqlForm
		query={{ query: ViewerQuery }}
		mutation={{ mutation: EditProfileMutation }}
		mapQueryDataToInitialValues={mapQueryDataToInitialValues}
		// onSuccess={onSuccess}

		schema={{
			title: 'Edit Profile',

			description: 'This initial values of this form were loaded through a GraphQL query!',

			// onChange: (formik: any, _prev: any, mutate: any) => console.log(formik.values, mutate),

			validateOnBlur: false,
			validateOnChange: false,

			fields: [
				{
					label: 'First Name',
					name: 'firstName',
					required: true,
					type: 'text',
				},
				{
					label: 'Last Name',
					name: 'lastName',
					required: true,
					type: 'text',
				},
				{
					name: 'status',
					type: 'status',
				},
				{
					fullWidth: true,
					name: 'submit',
					title: 'Save',
					type: 'submit',
				},
			],
		}}
		{...props}
	/>
);
