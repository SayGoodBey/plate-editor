import { PlateEditor, Value, WithPlatePlugin } from '@udecode/plate-common';
import type { CustomImagePlugin } from './type';
import { withImageUpload } from './withImageUpload';
import { withImageEmbed } from './withImageEmbed';

/**
 * @see withImageUpload
 * @see withImageEmbed
 */
export const withImage = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(
  editor: E,
  plugin: WithPlatePlugin<CustomImagePlugin, V, E>,
) => {
  const {
    options: { disableUploadInsert, disableEmbedInsert },
  } = plugin;
  if (!disableUploadInsert) {
    editor = withImageUpload(editor, plugin);
  }

  if (!disableEmbedInsert) {
    editor = withImageEmbed(editor, plugin);
  }

  return editor;
};
