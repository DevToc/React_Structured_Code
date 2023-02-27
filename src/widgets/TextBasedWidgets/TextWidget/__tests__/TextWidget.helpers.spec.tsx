import { modifyAllFontSizes } from '../../common/TextBasedWidgets.helpers';
import { getFirstCharacterTextMarks, getFontStyleFromTextMarks } from '../TextWidget.helpers';

import { convertStyleToProseMirrorMark } from '../../common/TextBasedWidgets.helpers';

const generateFontSizeData = (fontSizes: number[]) => {
  return {
    content: fontSizes.map((size) => ({
      content: [{ marks: [{ type: 'textStyle', attrs: { fontSize: `${size}px` } }] }],
    })),
  };
};

describe('widgets/TextWidget.helpers', () => {
  it('should convert style config correctly', () => {
    const style = {
      fontFamily: 'Font Fam',
      isBold: true,
      isItalic: true,
      fontSize: 10,
      color: 'black',
    };

    const expectedMarkData = [
      {
        type: 'textStyle',
        attrs: {
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          color: style.color,
        },
      },
      { type: 'bold' },
      { type: 'italic' },
    ];

    const mark = convertStyleToProseMirrorMark(style);
    expect(mark).toEqual(expectedMarkData);
  });

  it('should return the text marks array of the first character', () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'text',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'foo',
                  },
                },
              ],
            },
            {
              type: 'text',
              text: 'text',
            },
          ],
        },
      ],
    };

    const textMarks = getFirstCharacterTextMarks(content);
    expect(textMarks).toHaveLength(1);
  });

  it('should return the font style using the textMarks array', () => {
    const textMarks = [
      {
        type: 'bold',
      },
      {
        type: 'textStyle',
        attrs: {
          fontFamily: 'Inter',
          fontSize: '21px',
          color: 'rgba(100, 95, 95, 1)',
        },
      },
    ];

    const expectedFontStyle = { fontColor: 'rgba(100, 95, 95, 1)', fontSize: '21px', isBold: true };
    const fontStyle = getFontStyleFromTextMarks(textMarks);

    expect(fontStyle).toEqual(expectedFontStyle);
  });

  describe('modifyAllFontSizes', () => {
    it('should double all font sizes', () => {
      const fontSize1 = 10;
      const fontSize2 = 30;
      const ratio = 2;

      const node = generateFontSizeData([fontSize1, fontSize2]);
      const expectedNodeData = generateFontSizeData([fontSize1 * ratio, fontSize2 * ratio]);

      const newNode = modifyAllFontSizes(node, ratio);
      expect(newNode).toEqual(expectedNodeData);
    });

    it('should round the font sizes', () => {
      const fontSize1 = 10;
      const fontSize2 = 30;
      const ratio = 1.15;

      const node = generateFontSizeData([fontSize1, fontSize2]);
      const expectedNodeData = generateFontSizeData([Math.round(ratio * fontSize1), Math.round(ratio * fontSize2)]);

      const newNode = modifyAllFontSizes(node, ratio, { round: true });
      expect(newNode).toEqual(expectedNodeData);
    });

    it('should not round the font sizes', () => {
      const fontSize1 = 10;
      const fontSize2 = 30;
      const ratio = 1.15;

      const node = generateFontSizeData([fontSize1, fontSize2]);
      const expectedNodeData = generateFontSizeData([ratio * fontSize1, ratio * fontSize2]);

      const newNode = modifyAllFontSizes(node, ratio);
      expect(newNode).toEqual(expectedNodeData);
    });
  });
});
