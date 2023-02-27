import { Options } from './html-to-image.config';
import { embedImages } from './embedImages';
import { applyStyleWithOptions } from './applyStyleWithOptions';
import { getNodeWidth, getNodeHeight, nodeToDataURL, createImage, getPixelRatio } from './html-to-image.helpers';
import { cloneNode } from './cloneNode';

function getImageSize(node: HTMLElement, options: Options = {}) {
  const width = options.width || getNodeWidth(node);
  const height = options.height || getNodeHeight(node);

  return { width, height };
}

export async function toSvg<T extends HTMLElement>(node: T, options: Options = {}): Promise<string> {
  const { width, height } = getImageSize(node, options);

  return Promise.resolve(node)
    .then((nativeNode) => cloneNode(nativeNode, options, true))
    .then((clonedNode) => embedImages(clonedNode as HTMLElement, options))
    .then((clonedNode) => applyStyleWithOptions(clonedNode, options))
    .then((clonedNode) => nodeToDataURL(clonedNode, width, height, options.presetCssStyle));
}

const dimensionCanvasLimit = 16384; // as per https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size

function checkCanvasDimensions(canvas: HTMLCanvasElement) {
  if (canvas.width > dimensionCanvasLimit || canvas.height > dimensionCanvasLimit) {
    if (canvas.width > dimensionCanvasLimit && canvas.height > dimensionCanvasLimit) {
      if (canvas.width > canvas.height) {
        canvas.height *= dimensionCanvasLimit / canvas.width;
        canvas.width = dimensionCanvasLimit;
      } else {
        canvas.width *= dimensionCanvasLimit / canvas.height;
        canvas.height = dimensionCanvasLimit;
      }
    } else if (canvas.width > dimensionCanvasLimit) {
      canvas.height *= dimensionCanvasLimit / canvas.width;
      canvas.width = dimensionCanvasLimit;
    } else {
      canvas.width *= dimensionCanvasLimit / canvas.height;
      canvas.height = dimensionCanvasLimit;
    }
  }
}

export async function toCanvas<T extends HTMLElement>(node: T, options: Options = {}): Promise<HTMLCanvasElement> {
  return toSvg(node, options)
    .then(createImage)
    .then((img) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      const ratio = options.pixelRatio || getPixelRatio();
      const { width, height } = getImageSize(node, options);

      const canvasWidth = options.canvasWidth || width;
      const canvasHeight = options.canvasHeight || height;

      canvas.width = canvasWidth * ratio;
      canvas.height = canvasHeight * ratio;

      if (!options.skipAutoScale) {
        checkCanvasDimensions(canvas);
      }
      canvas.style.width = `${canvasWidth}`;
      canvas.style.height = `${canvasHeight}`;

      if (options.backgroundColor) {
        context.fillStyle = options.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      return canvas;
    });
}
