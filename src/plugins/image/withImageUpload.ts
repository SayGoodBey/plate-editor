import { getInjectedPlugins, pipeInsertDataQuery, PlateEditor, Value, WithPlatePlugin } from '@udecode/plate-common';

import { insertImage } from './transforms/insertImage';
import type { CustomImagePlugin } from './index';

export const withImageUpload = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(
  editor: E,
  plugin: WithPlatePlugin<CustomImagePlugin, V, E>,
) => {
  const {
    options: { uploadImage, insertNodesOptions },
  } = plugin;
  const { insertData } = editor;

  editor.insertData = (dataTransfer: DataTransfer) => {
    const text = dataTransfer.getData('text/plain');
    const { files } = dataTransfer;

    if (!text && files && files.length > 0) {
      const injectedPlugins = getInjectedPlugins<{}, V, E>(editor, plugin);
      if (
        !pipeInsertDataQuery<{}, V, E>(injectedPlugins, {
          data: text,
          dataTransfer,
        })
      ) {
        return insertData(dataTransfer);
      }

      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', async () => {
            if (!reader.result) {
              return;
            }
            const uploadedUrl = uploadImage ? await uploadImage(reader.result) : reader.result;

            insertImage(editor, uploadedUrl, insertNodesOptions);
          });

          reader.readAsDataURL(file);
        }
      }
    } else {
      insertData(dataTransfer);
    }
  };

  return editor;
};
