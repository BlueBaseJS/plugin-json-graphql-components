// tslint:disable: max-line-length
import { ComponentState, ErrorStateProps } from '@bluebase/components';
import React from 'react';

export const BadUserInputError = (_props: ErrorStateProps) => (
	<ComponentState
		title="Bad User Input"
		description="The user input is invalid. Please try again."
		imageSource="Error400"
	/>
);
