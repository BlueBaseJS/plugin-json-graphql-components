// tslint:disable: max-line-length
import { ComponentState, ErrorStateProps } from '@bluebase/components';
import React from 'react';

export const ForbiddenError = ({ retry }: ErrorStateProps) => (
	<ComponentState
		title="Forbidden"
		description="You do not have the permission to access this resource"
		actionOnPress={retry}
		actionTitle="Retry"
		actionProps={{ size: 'small' }}
		imageSource="ForbiddenError"
	/>
);
