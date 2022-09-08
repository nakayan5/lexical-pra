import { EditorThemeClasses } from 'lexical'

/**
 * css in js のthemeとは異なる
 * LexicalComposerにclassNameを渡してる
 *
 * themeなくてもstyleは変わるがthemeを渡すことでstyleをカスタムできる
 */

export const theme: EditorThemeClasses = {
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image', // custom
  youtube: 'editor-youtube', // custom
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
  },
}
