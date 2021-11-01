import { gql } from '@apollo/client';
import { getComponent } from '@bluebase/core';
import { FormikValues } from 'formik';
import React from 'react';

import { JsonGraphqlFormProps } from '../';

export const SignupMutation = gql`
	mutation SignupMutation($data: JSON) {
		signup(input: { data: $data }) {
			id
			firstName
			lastName
			email
			accessToken
		}
	}
`;

export interface SignupFormValues extends FormikValues {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const JsonGraphqlForm = getComponent<JsonGraphqlFormProps<SignupFormValues>>('JsonGraphqlForm');

// const onSuccess = (_res: any, _vals: any, { setStatus }: any) => setStatus({ success: ['Done!'] });

export const SignupForm = (props: Partial<JsonGraphqlFormProps<any>>) => (
	<JsonGraphqlForm
		mutation={{ mutation: SignupMutation }}
		// onSuccess={onSuccess}

		schema={{
			title: 'Sign up',

			description: 'Press "Sign Up" button to see the result.',

			validateOnBlur: false,
			validateOnChange: false,

			fields: [
				{
					name: 'fullName',
					type: 'inline',

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
					],
				},
				{
					label: 'Email',
					name: 'email',
					required: true,
					type: 'email',
				},
				{
					label: 'Password',
					name: 'password',
					required: true,
					type: 'password',
				},
				{
					name: 'status',
					type: 'status',
				},
				{
					fullWidth: true,
					name: 'submit',
					title: 'Sign up',
					type: 'submit',
				},
			],

			initialValues: {
				email: 'asd@as.cd',
				firstName: 'im only',
				lastName: 'testing',
				password: 'abc',
			},
		}}
		{...props}
	/>
);
