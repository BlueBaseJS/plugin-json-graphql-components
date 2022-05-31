import BlueBasePluginMaterialUI from '@bluebase/plugin-material-ui';

import bootOptions from '../../../boot';

export const plugins = [BlueBasePluginMaterialUI, ...bootOptions.plugins];
