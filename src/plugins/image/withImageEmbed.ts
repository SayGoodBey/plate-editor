import { PlateEditor, Value, WithPlatePlugin } from '@udecode/plate-common';
import type { CustomImagePlugin } from './type';
import { insertImage } from './transforms/insertImage';
import { isImageUrl } from './utils/isImageUrl';

export const withImageEmbed = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(
  editor: E,
  plugin: WithPlatePlugin<CustomImagePlugin, V, E>,
) => {
  const {
    options: { insertNodesOptions },
  } = plugin;
  const { insertData } = editor;

  editor.insertData = (dataTransfer: DataTransfer) => {
    const text = dataTransfer.getData('text/plain');
    if (isImageUrl(text)) {
      insertImage(editor, text, insertNodesOptions);
      return;
    }

    insertData(dataTransfer);
  };

  return editor;
};
