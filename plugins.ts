import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import BlueBasePluginJsonSchemaComponents from '@bluebase/plugin-json-schema-components';
import BlueBasePluginMaterialUI from '@bluebase/plugin-material-ui';
import { MaterialCommunityIcons } from '@bluebase/plugin-vector-icons';

import Plugin from './src';

export const plugins = [
	BlueBasePluginApollo,
	BlueBasePluginJsonSchemaComponents,
	BlueBasePluginMaterialUI,
	MaterialCommunityIcons,
	Plugin,
];
