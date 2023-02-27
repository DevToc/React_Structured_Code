const MS_FONT_ENDPOINT = process.env.REACT_APP_MS_FONT_ENDPOINT || 'https://cdn.venngage.beer/media/ms_fonts/woff2';

/**
 * Microsoft fonts resources
 */
const MS_FONTS = [
  {
    family: 'Arial',
    descriptors: [
      {
        url: `${MS_FONT_ENDPOINT}/Arial/arial.woff2`,
        style: 'normal',
        weight: 400,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Arial/arialbd.woff2`,
        style: 'normal',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Arial/arialbi.woff2`,
        style: 'italic',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Arial/ariali.woff2`,
        style: 'italic',
        weight: 400,
      },
    ],
  },
  {
    family: 'Comic Sans Ms',
    descriptors: [
      {
        url: `${MS_FONT_ENDPOINT}/Comic Sans MS/comic.woff2`,
        style: 'normal',
        weight: 400,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Comic Sans MS/comicbd.woff2`,
        style: 'normal',
        weight: 700,
      },
      // TODO: add missing italic and bold-italic fonts
    ],
  },
  {
    family: 'Courier New',
    descriptors: [
      {
        url: `${MS_FONT_ENDPOINT}/Courier New/cour.woff2`,
        style: 'normal',
        weight: 400,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Courier New/courbd.woff2`,
        style: 'normal',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Courier New/courbi.woff2`,
        style: 'italic',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Courier New/couri.woff2`,
        style: 'italic',
        weight: 400,
      },
    ],
  },
  {
    family: 'Times New Roman',
    descriptors: [
      {
        url: `${MS_FONT_ENDPOINT}/Times New Roman/times.woff2`,
        style: 'normal',
        weight: 400,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Times New Roman/timesbd.woff2`,
        style: 'normal',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Times New Roman/timesbi.woff2`,
        style: 'italic',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Times New Roman/timesi.woff2`,
        style: 'italic',
        weight: 400,
      },
    ],
  },
  {
    family: 'Trebuchet MS',
    descriptors: [
      {
        url: `${MS_FONT_ENDPOINT}/Trebuchet MS/trebuc.woff2`,
        style: 'normal',
        weight: 400,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Trebuchet MS/trebucbd.woff2`,
        style: 'normal',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Trebuchet MS/trebucbi.woff2`,
        style: 'italic',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Trebuchet MS/trebucit.woff2`,
        style: 'italic',
        weight: 400,
      },
    ],
  },
  {
    family: 'Verdana',
    descriptors: [
      {
        url: `${MS_FONT_ENDPOINT}/Verdana/verdana.woff2`,
        style: 'normal',
        weight: 400,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Verdana/verdanab.woff2`,
        style: 'normal',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Verdana/verdanaz.woff2`,
        style: 'italic',
        weight: 700,
      },
      {
        url: `${MS_FONT_ENDPOINT}/Verdana/verdanai.woff2`,
        style: 'italic',
        weight: 400,
      },
    ],
  },
];

// Store ms font config into map
const msFontMap = new Map<string, typeof MS_FONTS[0]>();
MS_FONTS.forEach((font) => msFontMap.set(font.family, font));

/**
 * Filter non ms fonts
 * @param families - Array of font family
 * @returns
 */
const filterMsFonts = (families: string[]) => families.filter((family) => msFontMap.has(family));

/**
 * Use FontFace API load ms font asynchronously
 * @param families
 */
const loadMsFonts = async (families: string[]): Promise<string[]> => {
  const fontFaces: FontFace[] = [];

  filterMsFonts(families).forEach((family) => {
    const font = msFontMap.get(family);
    font?.descriptors.forEach((descriptor) => {
      const url = new URL(descriptor.url).toString();
      fontFaces.push(
        new FontFace(font.family, `url(${url})`, {
          style: descriptor.style,
          weight: descriptor.weight.toString(),
        }),
      );
    });
  });

  const result = await Promise.all(fontFaces.map((fontFace) => fontFace.load()));
  const loadedFonts = new Set<string>();

  result.forEach((fontFace) => {
    try {
      if (fontFace instanceof FontFace) {
        document.fonts.add(fontFace);
        loadedFonts.add(fontFace.family);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return [...loadedFonts];
};

export { loadMsFonts, filterMsFonts };
