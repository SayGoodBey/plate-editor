import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_IMAGE } from '@udecode/plate-media';
import ParagraphElement from '../components/ParagraphElement/Index';
import ImageElement from '../components/ImageElement';
export const plateUI = {
  [ELEMENT_PARAGRAPH]: ParagraphElement,
  [ELEMENT_IMAGE]: ImageElement,
};
