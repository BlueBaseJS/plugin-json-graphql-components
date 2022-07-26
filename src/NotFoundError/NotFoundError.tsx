// tslint:disable: max-line-length
import { ComponentState, ErrorStateProps } from '@bluebase/components';
import React from 'react';

export const NotFoundError = ({ retry }: ErrorStateProps) => (
	<ComponentState
		title="Not Found"
		description="This record does not seem to exist."
		actionOnPress={retry}
		actionTitle="Retry"
		actionProps={{ size: 'small' }}
		imageSource="Error404"
	/>
);
