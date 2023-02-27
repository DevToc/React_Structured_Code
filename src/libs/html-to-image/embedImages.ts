import { Options } from './html-to-image.config';
import { getBlobFromURL } from './getBlobFromURL';
import { embedResources } from './embedResources';
import { isDataUrl, toArray, makeDataUrl, getMimeType } from './html-to-image.helpers';

async function embedBackground<T extends HTMLElement>(clonedNode: T, options: Options): Promise<T> {
  const background = clonedNode.style?.getPropertyValue('background');
  if (!background) {
    return Promise.resolve(clonedNode);
  }

  return Promise.resolve(background)
    .then((cssString) => embedResources(cssString, null, options))
    .then((cssString) => {
      clonedNode.style.setProperty('background', cssString, clonedNode.style.getPropertyPriority('background'));

      return clonedNode;
    });
}

async function embedImageNode<T extends HTMLElement | SVGImageElement>(clonedNode: T, options: Options): Promise<T> {
  if (
    !(clonedNode instanceof HTMLImageElement && !isDataUrl(clonedNode.src)) &&
    !(clonedNode instanceof SVGImageElement && !isDataUrl(clonedNode.href.baseVal))
  ) {
    return Promise.resolve(clonedNode);
  }

  const src = clonedNode instanceof HTMLImageElement ? clonedNode.src : clonedNode.href.baseVal;

  return Promise.resolve(src)
    .then((url) => getBlobFromURL(url, options))
    .then((data) => makeDataUrl(data.blob, getMimeType(src) || data.contentType))
    .then(
      (dataURL) =>
        new Promise((resolve, reject) => {
          clonedNode.onload = resolve;
          clonedNode.onerror = reject;
          if (clonedNode instanceof HTMLImageElement) {
            clonedNode.srcset = '';
            clonedNode.src = dataURL;
          } else {
            clonedNode.href.baseVal = dataURL;
          }
        }),
    )
    .then(
      () => clonedNode,
      () => clonedNode,
    );
}

async function embedChildren<T extends HTMLElement>(clonedNode: T, options: Options): Promise<T> {
  const children = toArray<HTMLElement>(clonedNode.childNodes);
  // eslint-disable-next-line no-use-before-define
  const deferreds = children.map((child: any) => embedImages(child, options));
  return Promise.all(deferreds).then(() => clonedNode);
}

export async function embedImages<T extends HTMLElement>(clonedNode: T, options: Options): Promise<T> {
  if (!(clonedNode instanceof Element)) {
    return Promise.resolve(clonedNode);
  }

  return Promise.resolve(clonedNode)
    .then((node) => embedBackground(node, options))
    .then((node) => embedImageNode(node, options))
    .then((node) => embedChildren(node, options));
}
