import { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import { isTest } from '../../utils/environment';
import { createGoogleFontsUrl } from './createGoogleFontsUrl';
import { filterMsFonts, loadMsFonts } from './msFontLoader';

const resolvedFonts = new Set();

export const filterUnloadedFamilies = (families: string[]) => families.filter((family) => !resolvedFonts.has(family));

export const loadFonts = (families: string[]) =>
  new Promise((resolve, reject) => {
    const unloadedFamilies = filterUnloadedFamilies(families);
    const unloadedMsFamilies = filterMsFonts(unloadedFamilies);
    const unloadedGoogleFamilies = unloadedFamilies.filter((family) => family && !unloadedMsFamilies.includes(family));

    if (unloadedFamilies.length === 0) {
      resolve(true);
      return;
    }

    // skip loading fonts in test environment
    if (isTest) return resolve(true);

    // Note: if FontFace API not work well, we can fallback to @font-face css loading method
    loadMsFonts(unloadedMsFamilies).then((msFamilies) => {
      msFamilies.forEach(resolvedFonts.add, resolvedFonts);
    });

    if (unloadedGoogleFamilies.length === 0) {
      resolve(true);
      return;
    }

    // Google fonts
    WebFont.load({
      custom: {
        families,
        urls: [createGoogleFontsUrl(unloadedGoogleFamilies)],
      },
      active() {
        // Add resolved font into cache
        unloadedGoogleFamilies.forEach(resolvedFonts.add, resolvedFonts);
        resolve(true);
      },
      inactive() {
        const message = `Fail to load fonts: ${JSON.stringify(unloadedFamilies)}`;
        reject(new Error(message));
      },
    });
  });

export const useFontLoader = (families: string[]) => {
  const [state, setState] = useState(false);

  useEffect(() => {
    const unloadedFamilies = filterUnloadedFamilies(families);
    if (unloadedFamilies.length === 0) return;

    loadFonts(unloadedFamilies)
      .then(() => {
        setState(true);
      })
      .catch((e) => {
        console.debug(e);
        // TODO: need to retry if fonts fail to fetch?
      });
  }, [families]);

  return state;
};
