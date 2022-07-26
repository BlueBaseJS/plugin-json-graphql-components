import { ComponentState, WaitObserver } from '@bluebase/components';
import { useNavigation } from '@bluebase/core';
import React, { useCallback, useEffect } from 'react';

export const UnauthenticatedError = () => {
	const { navigate } = useNavigation();

	const goToLogoutPage = useCallback(() => {
		navigate('Logout');
	}, []);

	// Automatically redirect to Logout page
	useEffect(() => {
		goToLogoutPage();
	}, []);

	return (
		<WaitObserver>
			<ComponentState
				title="Not Authenticated"
				description="You need to login to access this resource."
				actionOnPress={goToLogoutPage}
				actionTitle="Login"
				actionProps={{ size: 'small' }}
				imageSource="Error403"
			/>
		</WaitObserver>
	);
};
