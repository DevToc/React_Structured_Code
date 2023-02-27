import { Extension } from '@tiptap/core';
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../../../constants/fonts';

export type FontSizeOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (fontSize: string) => ReturnType;
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType;
      incrementFontSize: () => ReturnType;
      decrementFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
        },
      incrementFontSize:
        () =>
        ({ chain }) => {
          const textStyle = this.editor.getAttributes('textStyle');
          const fontSize = parseInt(textStyle.fontSize);
          const newFontSize = Number.isNaN(fontSize) ? 15 : fontSize + 1;

          if (newFontSize > MAX_FONT_SIZE) return false;

          return chain()
            .setMark('textStyle', { fontSize: newFontSize + 'px' })
            .run();
        },
      decrementFontSize:
        () =>
        ({ chain }) => {
          const textStyle = this.editor.getAttributes('textStyle');
          const fontSize = parseInt(textStyle.fontSize);
          const newFontSize = Number.isNaN(fontSize) ? 15 : fontSize - 1;

          if (newFontSize < MIN_FONT_SIZE) return false;

          return chain()
            .setMark('textStyle', { fontSize: newFontSize + 'px' })
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod->': () => this.editor.chain().focus().incrementFontSize().run(),
      'Mod-<': () => this.editor.chain().focus().decrementFontSize().run(),
    };
  },
});
