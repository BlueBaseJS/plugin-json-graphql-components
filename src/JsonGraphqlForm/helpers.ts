import { ApolloError } from '@apollo/client';

export const noop = (foo?: any) => foo;

type FormErrors = { form: string[] } & { [key: string]: string };

export const graphqlToFormErrors = (error: ApolloError): FormErrors => {
	let errors: any = {
		form: [],
	};

	error.graphQLErrors.forEach((e: any) => {
		if (e.extensions && e.extensions.code === 'BAD_USER_INPUT') {
			const fieldErrors = e.extensions.exception.validationErrors;

			errors = {
				...errors,
				...fieldErrors,
			};
		} else {
			errors.form.push(e.message);
		}
	});

	if (error.networkError) {
		errors.form.push(
			// eslint-disable-next-line max-len
			'A network error occurred. This may be because of your network connection, or a server error. Please try again later.'
		);
	}

	return errors;
};
