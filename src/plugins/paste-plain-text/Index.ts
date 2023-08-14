import { createPluginFactory } from '@udecode/plate-common';
import { Path, Transforms } from 'slate/dist';

export const KEY_PASTE_PLAIN_TEXT = 'paste_plain_text';

const getValueChild = (value: any, path?: Path) => {
  if (!path) {
    return null;
  }
  let child = value[path[0]];
  for (let i = 1; i < path.length; i++) {
    child = child.children[path[i]];
  }
  return child;
};

const createPastePlainTextPlugin = createPluginFactory({
  key: KEY_PASTE_PLAIN_TEXT,
  handlers: {
    onPaste: (editor) => (event: any) => {
      let child = getValueChild(editor.children, editor.selection?.anchor.path);
      const pastedText = event.clipboardData.getData('text/plain');
      event.preventDefault();
      event.stopPropagation();
      Transforms.insertNodes(
        editor as any,
        {
          ...child,
          text: pastedText,
        } as any,
      );
    },
  },
});

export { createPastePlainTextPlugin };
