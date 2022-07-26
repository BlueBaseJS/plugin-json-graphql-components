import { ComponentState, ErrorStateProps } from '@bluebase/components';
import React from 'react';

export const NetworkError = ({ retry }: ErrorStateProps) => (
	<ComponentState
		title="Network Error"
		// eslint-disable-next-line max-len
		description="A network error occurred. This may be because of your network connection, or a server error. Please try again later."
		actionOnPress={retry}
		actionTitle="Retry"
		actionProps={{ size: 'small' }}
		imageSource="Error503"
	/>
);
