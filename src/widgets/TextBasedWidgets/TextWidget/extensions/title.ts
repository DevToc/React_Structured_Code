import { Node, mergeAttributes } from '@tiptap/core';
export interface TitleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    title: {
      /**
       * Set a node to title
       */
      setTitle: () => ReturnType;
      /**
       * Toggle between title and paragraph
       */
      toggleTitle: () => ReturnType;
    };
  }
}

export const Title = Node.create<TitleOptions>({
  name: 'title',
  priority: 1000,
  group: 'block',
  content: 'inline*',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'p',
        attrs: { 'data-title': 1 },
        priority: 1000,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-title': 1 }), 0];
  },

  addCommands() {
    return {
      setTitle:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
      toggleTitle:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph');
        },
    };
  },
});
