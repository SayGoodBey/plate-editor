import { createPlugins } from '@udecode/plate-core';
import { basicElementsPlugins } from '../basic-elements/basicElementsPlugins';
import { basicMarksPlugins } from '../basic-marks/basicMarksPlugins';

export const basicNodesPlugins = createPlugins(
  [...basicElementsPlugins]
);