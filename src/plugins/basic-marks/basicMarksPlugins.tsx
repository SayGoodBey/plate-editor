import {
  createBoldPlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { createPlugins } from '@udecode/plate-core';

export const basicMarksPlugins = createPlugins([
  createBoldPlugin(),
  createItalicPlugin(),
  createStrikethroughPlugin(),
  createUnderlinePlugin(),
]);
