import { getComponentWithFallback } from '@bluebase/components';
import { PlaceholderListItemProps } from '@bluebase/plugin-rn-placeholder';

export const PlaceholderListItem = getComponentWithFallback<PlaceholderListItemProps>({
	moduleName: '@bluebase/plugin-rn-placeholder',
	name: 'PlaceholderListItem',
})('PlaceholderListItem', 'LoadingState');
PlaceholderListItem.displayName = 'PlaceholderListItem';
