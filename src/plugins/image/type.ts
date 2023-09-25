import { InsertNodesOptions, TElement } from '@udecode/plate-common';

export interface TImageElement extends TElement {
  url: string;
  align?: 'left' | 'center' | 'right';
}

export interface MediaPlugin {
  isUrl?: (text: string) => boolean;
  /**
   * Transforms the url.
   */
  transformUrl?: (url: string) => string;
}

export interface ImagePlugin extends MediaPlugin {
  /**
   * An optional method that will upload the image to a server.
   * The method receives the base64 dataUrl of the uploaded image, and should return the URL of the uploaded image.
   */
  uploadImage?: (
    dataUrl: string | ArrayBuffer,
    files: FileList,
  ) => Promise<string | ArrayBuffer> | string | ArrayBuffer;
  /**
   * Disable file upload on insert data.
   */
  disableUploadInsert?: boolean;
  /**
   * Disable url embed on insert data.
   */
  disableEmbedInsert?: boolean;
}

export type CustomImagePlugin = ImagePlugin & { insertNodesOptions?: InsertNodesOptions };
