import { mergeAttributes } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import { isValidUrl, withProtocol } from '../../../../utils/url';

export const CustomLink = Link.extend({
  name: 'link',
  priority: 1000,

  addOptions() {
    return {
      openOnClick: false,
      linkOnPaste: true,
      autolink: false,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      },
      protocols: [],
    };
  },

  addAttributes() {
    return {
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      // TODO: add style and class attributes later on
    };
  },

  parseHTML() {
    return [{ tag: `a[href]:not([href *= "javascript:" i])` }];
  },

  renderHTML({ HTMLAttributes }) {
    // Note: we may need to intercept to validate HTMLAttributes.href here on export view
    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        const link = this.editor.getAttributes('link')?.href || '';
        const url = window.prompt('URL', link);
        if (url === null) return false;

        // Clear link
        if (url === '') return this.editor.chain().focus().extendMarkRange('link').unsetLink().run();

        // Set link with protocol
        const fullUrl = withProtocol(url);
        if (!isValidUrl(fullUrl)) return false;

        return this.editor.chain().focus().extendMarkRange('link').setLink({ href: fullUrl }).run();
      },
    };
  },
});
