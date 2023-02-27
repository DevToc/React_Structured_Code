import { useCallback, useRef, useState } from 'react';
import { colord } from 'colord';
import * as htmlToImage from '../../libs/html-to-image/html-to-image';
import { getAllCanvasRGB, calculateRatio, parseRatioToScore, quantization } from './useColorContrastChecker.helpers';
import { Config, ScoreType, Options, UseColorContrastCheckerProps } from './useColorContrastChecker.types';

// TODO: This preset can move to a specific reset css helper
const createPresetCssStyle = () => {
  const cssText = `
    .ProseMirror table .selectedCell:after {
      background: transparent !important;
    }
  `;

  const style = document.createElement('style');
  style.textContent = cssText;

  return style;
};

// TODO: update the ts type checker
export const useColorContrastChecker = (): UseColorContrastCheckerProps => {
  const [score, setScore] = useState<ScoreType[]>([]);
  const options = useRef<Options[]>([]);

  // This ref value prevents triggering multiple calculating at the same time.
  const isCalculating = useRef<boolean>(false);

  // TODO: add comment
  const calculateScore = async () => {
    if (isCalculating.current) return;
    isCalculating.current = true;

    let canvasCache: any = {};

    // TODO: add comment
    const runPromiseSerial = (tasks: Array<() => Promise<string>>) => {
      let result: Promise<string | void> = Promise.resolve();
      tasks.forEach((task) => {
        result = result.then(() => task());
      });
      return result;
    };

    if (!options?.current) return;

    const resultScoreList: any = [];
    const allTargetWidget = options?.current.reduce(
      (map, current) => map.set(current.widgetId, current),
      new Map<string, Options>(),
    );
    const promiseList: Array<() => Promise<string>> = options?.current?.map((option, index) => {
      return () =>
        new Promise(async (resolve, reject) => {
          const _pageId = option.pageId;
          const _widgetId = option.widgetId;
          const _targetPageRef = option.targetPageRef;
          const _rect = option.rect;
          const _fontSize = option?.fontSize ? Number.parseInt(option?.fontSize.toString()) : null;
          const _fontWeight = option?.fontWeight ?? null;
          const _color = option.color;
          const _pageWidthPx = option.pageWidthPx;
          const _pageHeightPx = option.pageHeightPx;

          if (!_targetPageRef || !_rect || !_color) return;

          if (!canvasCache.hasOwnProperty(_pageId)) {
            canvasCache[_pageId] = await htmlToImage.toCanvas(_targetPageRef, {
              filter: (node) => !allTargetWidget.get(node.id)?.enabledFilter,
              filterText: (node) => !allTargetWidget.get(node.id)?.enabledTextFilter,
              presetCssStyle: createPresetCssStyle(),
              canvasWidth: _pageWidthPx / devicePixelRatio,
              canvasHeight: _pageHeightPx / devicePixelRatio,
            });
          }

          /**
           * TODO: Add more detail
           */
          const rgbArray = getAllCanvasRGB(canvasCache[_pageId], _rect);

          /**
           * Color quantization
           * A process that reduces the number of colors used in an image
           * while trying to visually maintin the original image as much as possible
           */
          const quantColors = quantization(rgbArray, 1);

          /**
           * TODO: Add more detail
           */
          const ratioList = calculateRatio(_color.rgba, quantColors);

          /**
           * TODO: Add more detail
           */
          const resultScore = parseRatioToScore(ratioList, _fontSize, _fontWeight);
          const resultData = resultScore.sort((a: any, b: any) => b?.accuracy - a?.accuracy)?.[0];

          resultScoreList.push({
            pageId: _pageId,
            widgetId: _widgetId,
            score: resultData.score,
            ratio: resultData.ratio,
            accuracy: resultData.accuracy,
          });

          // TODO: add comment
          if (options.current.length === resultScoreList.length) {
            options.current = [];
            setScore(resultScoreList);
            isCalculating.current = false;
          }

          resolve('success');
        });
    });

    if (!promiseList.length) {
      setScore([]);
      isCalculating.current = false;
      return;
    }

    runPromiseSerial(promiseList);
  };

  const setOptions = ({
    pageId,
    widgetId,
    targetPage,
    targetColor,
    targetRect,
    targetFontSize,
    targetFontWeight,
    pageWidthPx,
    pageHeightPx,
    enabledFilter = true,
    enabledTextFilter = false,
  }: Config): void => {
    if (isCalculating.current) return;

    const newOptions: Options = {
      pageId,
      widgetId,
      targetPageRef: targetPage,
      color: colord(targetColor),
      rect: targetRect,
      fontSize: targetFontSize ?? null,
      fontWeight: targetFontWeight ?? null,
      pageWidthPx,
      pageHeightPx,
      enabledFilter,
      enabledTextFilter,
    };

    options.current.push(newOptions);
  };

  const resetScore = useCallback(() => {
    setScore([]);
  }, []);

  return [score, calculateScore, setOptions, resetScore];
};
