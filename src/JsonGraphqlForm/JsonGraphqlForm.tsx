import { ApolloError, FetchResult, useMutation, useQuery } from '@apollo/client';
import { MutationComponentOptions, QueryComponentOptions } from '@apollo/client/react/components';
import { StatefulComponent } from '@bluebase/components';
import { getComponent, Omit, useBlueBase } from '@bluebase/core';
import { JsonFormProps, JsonFormSchema } from '@bluebase/plugin-json-schema-components';
import { FormikContextType, FormikHelpers, FormikValues } from 'formik';
import React, { useCallback } from 'react';

import { graphqlToFormErrors, noop } from './helpers';

const JsonForm = getComponent<JsonFormProps<any>>('JsonForm');

export type mapFormValuesToMutationVariablesFn<Values extends FormikValues> = (
	values: Values
) => any;
export type mapQueryDataToInitialValuesFn<Values extends FormikValues> = (data: any) => Values;

export type JsonGraphqlFormOnErrorFn<Values extends FormikValues> = (
	error: ApolloError,
	values: Values,
	actions: FormikHelpers<Values>
) => void;
export type JsonGraphqlFormOnSuccessFn<Values extends FormikValues> = (
	result: void | FetchResult,
	values: Values,
	actions: FormikHelpers<Values>
) => void;

export type JsonGraphqlFormProps<Values extends FormikValues> = Omit<
	JsonFormProps<Values>,
	'schema'
> & {
	/** JSON Schema. */
	schema: Partial<JsonFormSchema<Values>>;

	/**
	 * GraphqlMutation component props. This mutation will be executed when
	 * a form is submitted.
	 */
	mutation: Omit<MutationComponentOptions<any, Values>, 'children'>;

	/**
	 * A function that converts form values to mutation variables.
	 * By default values are sent as is to the mutation.
	 */
	mapFormValuesToMutationVariables?: mapFormValuesToMutationVariablesFn<Values>;

	/**
	 * GraphqlQuery component props. The result of this query will be used
	 * as initial values of the form.
	 */
	query?: Omit<QueryComponentOptions<any, Values>, 'children'>;

	/**
	 * A function that converts query result to initial form values.
	 * By detault the result is assumed to be initial values, as is.
	 */
	mapQueryDataToInitialValues?: (data: any) => Values;

	onError?: JsonGraphqlFormOnErrorFn<Values>;

	onSuccess?: JsonGraphqlFormOnSuccessFn<Values>;
};

/**
 * A JsonForm that is compatible with GraphQL APIs. This means it will
 * fetch initial data from a GraphQL query and execute a mutation on form
 * submission.
 */
export function JsonGraphqlForm<Values extends FormikValues>(props: JsonGraphqlFormProps<Values>) {

	const BB = useBlueBase();

	const {
		mutation: mutationObj,
		mapFormValuesToMutationVariables,
		mapQueryDataToInitialValues,
		query: queryObj,
		schema,
		onError: onErrorFn,
		onSuccess: onSuccessFn,
		...rest
	} = props;

	const onChangeFn = schema.onChange || noop;

	const { mutation, ...mutationOpts } = mutationObj;
	const [mutate] = useMutation(mutation, mutationOpts);

	/**
	 * Returns the onChange event handler (this function is not the handler itself).
	 * @param mutate
	 */
	function onChange(current: FormikContextType<Values>, prev: FormikContextType<Values>) {
		onChangeFn(current, prev, mutate);
	}

	/**
	 * Returns the onSubmit event handler (this function is not the handler itself).
	 * @param mutate
	 */
	async function onSubmit(values: Values, actions: FormikHelpers<Values>) {
		const { setSubmitting, setErrors } = actions;

		// map values
		const variables = await mapFormValuesToMutationVariables!(values);

		try {
			const mutationResult = await mutate({ variables });

			// Mutation was successful
			setSubmitting(false);

			// If there was an onSuccess param, call it
			onSuccessFn!(mutationResult, values, actions);
		} catch (error: any) {

			// Bummer! Mutation was not successful
			setSubmitting(false);

			// Set form errors
			setErrors(graphqlToFormErrors(error) as any);

			// If there was a networkError, tell BlueBase, so other plugins
			// can catch and report it.
			if (error.networkError) {
				BB.Logger.error('JsonGraphQLForm Network Error', { error, values });
			}

			// If there was an onError param, call it
			onErrorFn!(error, values, actions);
		}
	}

	/**
	 * Renders the main form that executes a mutation on submit
	 * @param initialValues
	 */
	function renderForm(initialValues: JsonFormSchema<Values>['initialValues'] = {} as any) {
		return (
			<JsonForm
				{...rest}
				schema={{
					...schema,
					fields: schema.fields || [],
					initialValues,
					onChange,
					onSubmit,
				}}
			/>
		);
	}

	// If there is now query, we don't need to fetch initial data
	if (!queryObj) {
		// Just render the form as is
		return renderForm();
	}

	const { query, ...queryOpts } = queryObj;
	const queryResult = useQuery(query, queryOpts);

	// If mapQueryDataToInitialValues function returns data,
	// then obviously isEmpty should return false.
	const isEmpty = useCallback(() => !mapQueryDataToInitialValues!(queryResult.data), [queryResult]);

	return (
		<StatefulComponent {...queryResult} isEmpty={isEmpty}>
			{renderForm(mapQueryDataToInitialValues!(queryResult.data))}
		</StatefulComponent>
	);
}

JsonGraphqlForm.displayName = 'JsonGraphqlForm';
JsonGraphqlForm.defaultProps = {
	mapFormValuesToMutationVariables: noop,
	mapQueryDataToInitialValues: noop,
	onError: noop,
	onSuccess: noop,
};
