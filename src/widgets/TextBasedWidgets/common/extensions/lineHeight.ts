import { Extension } from '@tiptap/core';

export type LineHeightOptions = {
  types: string[];
  defaultLineHeight: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set the line height
       */
      setLineHeight: (lineHeight: string) => ReturnType;
      /**
       * Unset the line height
       */
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: [],
      defaultLineHeight: '1.2',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) => element.style.lineHeight?.replace(/['"]+/g, '') || this.options.defaultLineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};

              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }) => {
          if (!lineHeight) return false;
          return this.options.types.every((type) => commands.updateAttributes(type, { lineHeight }));
        },

      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) => commands.resetAttributes(type, 'lineHeight'));
        },
    };
  },
});
