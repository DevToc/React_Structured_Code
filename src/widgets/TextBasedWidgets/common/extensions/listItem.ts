import ListItem from '@tiptap/extension-list-item';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    listItem: {
      splitListItemKeepMarks: () => ReturnType;
    };
  }
}

export const CustomListItem = ListItem.extend({
  addCommands() {
    return {
      splitListItemKeepMarks:
        () =>
        ({ chain }) => {
          return chain()
            .splitListItem(this.name)
            .command(({ tr }) => {
              const marks =
                this.editor.view.state.storedMarks ||
                (this.editor.view.state.selection.$to.parentOffset && this.editor.view.state.selection.$from.marks());

              if (marks) tr.ensureMarks(marks);

              return true;
            })
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItemKeepMarks(),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      'Shift-Tab': () => this.editor.commands.liftListItem(this.name),
    };
  },
});
