import 'cross-fetch/polyfill';

import { MockedProvider } from '@apollo/client/testing';
import { BlueBaseApp } from '@bluebase/core';
import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import BlueBasePluginJsonSchemaComponents from '@bluebase/plugin-json-schema-components';
import { mount } from 'enzyme';
import { waitForElement } from 'enzyme-async-helpers';
import { FormikContextType } from 'formik';
import React from 'react';
import wait from 'waait';

import Plugin from '../../index';
import { EditProfileProfileForm, mocks, SignupForm } from '../__stories__';

describe('JsonGraphqlForm', () => {
	describe('GraphQL', () => {
		// it('should show a network error', async () => {
		// 	const onError = jest.fn();

		// 	const initialValues = {
		// 		email: 'asd@as.cd',
		// 		firstName: 'im only',
		// 		lastName: 'testing',
		// 		password: 'abc',
		// 	};
		// 	const wrapper = mount(
		// 		<BlueBaseApp
		// 			plugins={[BlueBasePluginJsonSchemaComponents, BlueBasePluginApollo, Plugin]}
		// 			configs={{ 'plugin.apollo.httpLinkOptions': { uri: 'http://graphql' } }}
		// 		>
		// 			<SignupForm onError={onError} schema={{ initialValues } as any} />
		// 		</BlueBaseApp>
		// 	);
		// 	await waitForElement(wrapper, SignupForm);
		// 	const actions: any = { setSubmitting: jest.fn(), setErrors: jest.fn() };
		// 	const onPress: any = wrapper
		// 		.find('Formik')
		// 		.last()
		// 		.prop('onSubmit');
		// 	onPress({}, actions); // fires the mutation
		// 	await wait(500);
		// 	wrapper.update();
		// 	expect(
		// 		wrapper
		// 			.find('FormStatus')
		// 			.last()
		// 			.find('Text')
		// 			.exists()
		// 	).toBe(false);

		// 	expect(onError).toBeCalled();
		// });

		it('should show field errors', async () => {
			const wrapper = mount(
				<BlueBaseApp plugins={[BlueBasePluginJsonSchemaComponents, BlueBasePluginApollo, Plugin]}>
					<MockedProvider mocks={[mocks.graphQLErrorsBadUserInput] as any} addTypename={false}>
						<SignupForm />
					</MockedProvider>
				</BlueBaseApp>
			);
			await waitForElement(wrapper, SignupForm);
			// fires the mutation
			const onPress: () => void = wrapper
				.find('Button')
				.first()
				.prop('onPress');
			onPress();
			const onError: any = wrapper
				.find('JsonGraphqlForm')
				.last()
				.prop('onError');
			onError();
			const actions: any = { setSubmitting: jest.fn(), setErrors: jest.fn() };
			const onPress1: any = wrapper
				.find('Formik')
				.last()
				.prop('onSubmit');
			onPress1(
				{ email: 'asd@as.cd', firstName: 'im only', lastName: 'testing', password: 'abc' },
				actions
			);
			// wait for response
			wrapper.update();
			expect(
				wrapper
					.find('FormStatus')
					.last()
					.find('Text')
					.exists()
			).toBe(false);
			// Pre Validation
			let firstName: any = wrapper.find('TextInput[name="firstName"]').first();
			expect(firstName.prop('error')).toBe(undefined);
			expect(firstName.prop('helperText')).toBe(undefined);
			let password: any = wrapper.find('TextInput[name="password"]').first();
			expect(password.prop('error')).toBe(undefined);
			expect(password.prop('helperText')).toBe(undefined);
			// wait for response
			await wait(100);
			wrapper.update();
			// Post Validation
			firstName = wrapper.find('TextInput[name="firstName"]').first();
			expect(firstName.prop('error')).toBe(true);
			expect(firstName.prop('helperText')).toBe('This field is required');
			password = wrapper.find('TextInput[name="password"]').first();
			expect(password.prop('error')).toBe(true);
			expect(password.prop('helperText')).toBe('This field is required');
		});

		it('should show a success state', async () => {
			const onSuccess: any = jest.fn();
			const actions: any = {
				setErrors: jest.fn(),
				setSubmitting: jest.fn(),
			};
			const initialValues = {
				email: 'asd@as.cd',
				firstName: 'im only',
				lastName: 'testing',
				password: 'abc',
			};
			const wrapper = mount(
				<BlueBaseApp plugins={[BlueBasePluginJsonSchemaComponents, BlueBasePluginApollo, Plugin]}>
					<MockedProvider mocks={[mocks.success] as any} addTypename={false}>
						<SignupForm onSuccess={onSuccess} />
					</MockedProvider>
				</BlueBaseApp>
			);
			await waitForElement(wrapper, SignupForm);

			const onPress: () => void = wrapper
				.find('Button')
				.first()
				.prop('onPress');
			onPress(); // fires the mutation
			const onPress1: any = wrapper
				.find('Formik')
				.first()
				.prop('onSubmit');
			onPress1(initialValues, actions);
			await wait(500);
			// wrapper.update();
			expect(
				wrapper
					.find('FormStatus')
					.last()
					.find('Text')
					.exists()
			).toBe(false);

			expect(onSuccess).toBeCalled();
		});

		it('should not crash without a custom onSuccess handler', async () => {
			const wrapper = mount(
				<BlueBaseApp plugins={[BlueBasePluginJsonSchemaComponents, BlueBasePluginApollo, Plugin]}>
					<MockedProvider mocks={[mocks.success] as any} addTypename={false}>
						<SignupForm />
					</MockedProvider>
				</BlueBaseApp>
			);
			await waitForElement(wrapper, SignupForm);
			const onPress: () => void = wrapper
				.find('Button')
				.first()
				.prop('onPress');
			onPress(); // fires the mutation
			const onSuccess: any = wrapper
				.find('JsonGraphqlForm')
				.last()
				.prop('onSuccess');
			onSuccess();
			wrapper.update();
			expect(
				wrapper
					.find('FormStatus')
					.last()
					.find('Text')
					.exists()
			).toBe(false);
			await wait(100); // wait for response
			wrapper.update();
			// expect(wrapper).toMatchSnapshot();
			expect(
				wrapper
					.find('FormStatus')
					.last()
					.find('Text')
					.exists()
			).toBe(false);
		});

		// it('should fetch initialValues from a graphql query', async () => {
		// 	const wrapper = mount(
		// 		<BlueBaseApp plugins={[BlueBasePluginJsonSchemaComponents, BlueBasePluginApollo, Plugin]}>
		// 			<MockedProvider mocks={[mocks.viewerQuery, mocks.success] as any} addTypename={false}>
		// 				<EditProfileProfileForm onError={null as any} onSuccess={null as any} />
		// 			</MockedProvider>
		// 		</BlueBaseApp>
		// 	);
		// 	await waitForElement(wrapper, EditProfileProfileForm);
		// 	//  expect(wrapper).toMatchSnapshot();
		// 	await wait(500); // wait for response
		// 	wrapper.update();
		// 	expect(
		// 		wrapper
		// 			.find('TextInput[name="firstName"]')
		// 			.first()
		// 			.prop('value')
		// 	).toBe('Abdul Rehman');
		// 	expect(
		// 		wrapper
		// 			.find('TextInput[name="lastName"]')
		// 			.first()
		// 			.prop('value')
		// 	).toBe('Talat');
		// 	// fires the mutation
		// 	const onPress: () => void = wrapper
		// 		.find('Button')
		// 		.first()
		// 		.prop('onPress');
		// 	onPress();
		// });
		// 	it(' initialV', async () => {
		// 		const wrapper = mount(
		// 			<BlueBaseApp plugins={[BlueBasePluginJsonSchemaComponents, BlueBasePluginApollo, Plugin]}>
		// 				<MockedProvider mocks={[mocks.viewerQuery1]} addTypename={false}>
		// 					<EditProfileProfileForm onError={null as any} onSuccess={null as any} />
		// 				</MockedProvider>
		// 			</BlueBaseApp>
		// 		);
		// 		await waitForElement(wrapper, EditProfileProfileForm);
		// 		expect(wrapper).toEqual({});
		// 	});
		// });

		describe('FormikEffect', () => {
			it('should render execute onChange callback when values change', async () => {
				const onChange = jest.fn();
				const wrapper = mount(
					<BlueBaseApp plugins={[BlueBasePluginJsonSchemaComponents, BlueBasePluginApollo, Plugin]}>
						<MockedProvider mocks={[mocks.viewerQuery, mocks.success] as any} addTypename={false}>
							<EditProfileProfileForm
								onError={null as any}
								onSuccess={null as any}
								schema={{ onChange } as any}
							/>
						</MockedProvider>
					</BlueBaseApp>
				);
				await waitForElement(wrapper, 'FormikEffect');
				//  expect(wrapper).toMatchSnapshot();
				// await wait(500); // wait for response
				// wrapper.update();
				const formik: FormikContextType<any> = wrapper
					.find('FormikEffect')
					.first()
					.prop('formik');
				// Change values, should trigger callback
				formik.setValues({ firstName: 'foo' });
				// Check fields
				expect(onChange).toHaveBeenCalledTimes(1);
				expect(onChange.mock.calls[0][0].values).toMatchObject({ firstName: 'foo' });
				expect(onChange.mock.calls[0][1].values).toMatchObject({});
				// Keep values same, should not trigger callback
				formik.setValues({ firstName: 'foo' });
				// Check fields
				expect(onChange).toHaveBeenCalledTimes(1);
			});
		});
	});
});
