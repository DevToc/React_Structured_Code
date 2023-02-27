import { Extension } from '@tiptap/core';

export const CustomKeyboardShortcuts = Extension.create({
  name: 'customKeyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      // Use line breaks instead of creating new paragraphs on new line for title and heading nodes
      Enter: ({ editor }) => (editor.isActive('title') || editor.isActive('heading')) && editor.commands.setHardBreak(),
    };
  },
});
