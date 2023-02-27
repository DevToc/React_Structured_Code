import { WIDGETBASE_CLASS, BOUNDING_BOX_CLASS } from '../../../../constants/bounding-box';
import { PAGE_CONTAINER_CLASSNAME } from '../../Editor.config';

// CONSTANTS DATAS
const TYPES = ['h', 'v'];
const POSITIONS = ['left', 'top'];
const TYPE_TO_POSITION = {
  h: 'left',
  v: 'top',
};
const TYPE_TO_DIRECTION = {
  h: 'width',
  v: 'height',
};

/**
 * This class manages each custom slide that Page Manager Helper creates.
 * When it is created, it continuously monitors the change through MutationObserver and automatically synchronizes with the targetElement if there is a change.
 *
 * Mode details about the rules is available here:
 * https://uxdesign.cc/helping-people-design-faster-a-ux-case-study-on-alignment-fe31d84de857?gi=53c914a640b9
 *
 * TODO: Check this article to solve resizing issue with rotated widget.
 * https://shihn.ca/posts/2020/resizing-rotated-elements/
 * @class CustomSlide
 */
class SmartGuideHelper {
  /**
   *  private variables
   */
  // Element
  #rootElm;
  #pageContainerElm;
  #editorContainerElm;
  #hGuideLineElm;
  #vGuideLineElm;

  // Element Rect
  #draggingElmRect;

  // For the widget resizing indicator
  #interactionType;
  #resizeDirectionList = []; // e.g.) ['top','left'];

  // For drag
  #dragSpacingTargets = {};
  #prevDragSpacingTargets = {};

  // For resize
  #resizeSpacingTargets = [];

  #pageOffset;
  #snapOffset;
  #scrollOffset;
  #originalOffset;

  #computedTargetsDatas;
  #computedTargetsValues;
  #targetOriginalOffset;

  #chosenGuides;
  #options = {
    tolerance: 1,
    snapTolerance: 2, // Please use the even number
    zoom: 100,
    enableSnap: false,
    zIndex: null,
  };
  #borderStyles = {
    defaultLineStyle: '1px solid rgb(253, 83, 252)',
    canvasLineStyle: '1px solid rgb(137, 255, 0)',
    guideBoxStyle: '1px solid rgb(253, 83, 252)',
  };
  #classNames = {
    guideLineClass: 'v-guide-line',
    pageClass: 'page-container',
  };

  constructor(rootElm, options) {
    if (!rootElm) {
      throw new Error('Invalid root element');
    }

    this.#options = { ...this.#options, ...options };
    this.#rootElm = rootElm;
    this.#pageContainerElm = document.querySelector(`.${PAGE_CONTAINER_CLASSNAME}`);
    this.#editorContainerElm = document.getElementById('page-scroll-container');

    this.init();
  }

  init() {
    // Append the default v-guide-line and h-guide-line.
    let hGuideLine = document.createElement('div');
    let vGuideLine = document.createElement('div');

    hGuideLine.style.display = 'none';
    hGuideLine.style.position = 'absolute';
    hGuideLine.style.width = '100%';
    hGuideLine.style.height = '0px';
    hGuideLine.style.pointerEvents = 'none';
    hGuideLine.style.borderTop = this.#borderStyles.defaultLineStyle;
    hGuideLine.classList.add(this.#classNames.guideLineClass);
    hGuideLine.classList.add(this.#classNames.guideLineClass + '-h');

    vGuideLine.style.display = 'none';
    vGuideLine.style.position = 'absolute';
    vGuideLine.style.width = '0px';
    vGuideLine.style.height = '100%';
    vGuideLine.style.pointerEvents = 'none';
    vGuideLine.style.borderTop = this.#borderStyles.defaultLineStyle;
    vGuideLine.classList.add(this.#classNames.guideLineClass);
    vGuideLine.classList.add(this.#classNames.guideLineClass + '-v');

    // Set zIndex
    if (Number.isInteger(this.#options?.zIndex)) {
      hGuideLine.style.zIndex = this.#options.zIndex;
      vGuideLine.style.zIndex = this.#options.zIndex;
    }

    this.#hGuideLineElm = hGuideLine;
    this.#vGuideLineElm = vGuideLine;

    this.#rootElm.appendChild(this.#hGuideLineElm);
    this.#rootElm.appendChild(this.#vGuideLineElm);
  }

  /**
   * Returns the elements of all widgets to be used as targets for SmartGuide.
   * Import and merge legacy widgets and smart widgets
   *
   * @return {*}
   * @memberof SmartGuideHelper
   */
  getTargetElementList() {
    const legacyWidgetElementList = this.#pageContainerElm.querySelectorAll(`.${WIDGETBASE_CLASS}`);
    const boundingBoxEl = this.#pageContainerElm.querySelectorAll(`.${BOUNDING_BOX_CLASS}`);

    return [this.#pageContainerElm, ...legacyWidgetElementList, ...boundingBoxEl];
  }

  getPageOffset() {
    return this.#pageOffset;
  }

  /**
   * Update setting values ​​that may occur during mouse events
   * zoomPercent: Get the current zoom ratio in percentage
   * enableSnap: This is a value that determines whether snap is activated.
   *
   * @param {*} { zoomPercent = 100, enableSnap = true }
   * @memberof SmartGuideHelper
   */
  setOptions({ zoomPercent = 100, enableSnap = true }) {
    if (zoomPercent !== undefined && zoomPercent != null && typeof zoomPercent === 'number') {
      this.#options.zoom = Number.parseFloat(zoomPercent);
    }
    if (enableSnap !== undefined && zoomPercent != null && typeof enableSnap === 'boolean') {
      this.#options.enableSnap = enableSnap;
    }
  }

  getOption(key) {
    return this.#options?.[key];
  }

  /**
   * Calculates the target value before the dragging or resizing event starts.
   *
   *
   * @param {Object} targetData
   * @param {Event} event
   * @param {Object} ui
   * @param {String} [interactionType='drag']
   * @param {Node[]} [ignoreTargetElementList=[]]
   * @return {*}
   * @memberof SmartGuideHelper
   */
  compute(targetData, ui, interactionType = 'drag', ignoreTargetElementList = []) {
    if (targetData instanceof HTMLElement) {
      this.#draggingElmRect = targetData.getBoundingClientRect();
    } else {
      this.#draggingElmRect = targetData;
    }

    this.#interactionType = interactionType;
    this.#pageOffset = this.getBoundingBoxRectOffset(this.getElementRect(this.#pageContainerElm));
    this.#scrollOffset = this.getScrollOffset();

    // sort this guides or save as hash map will be better performance
    const pageRect = this.#pageContainerElm.getBoundingClientRect();
    const targetElementList = this.getTargetElementList()
      .filter((element) => !ignoreTargetElementList.includes(element))
      // Active target filter for the custom handler
      .filter(
        (element) =>
          element === this.#pageContainerElm ||
          !ignoreTargetElementList.some((ignoreElement) => element.contains(ignoreElement)),
      );

    this.guides = targetElementList.reduce((prev, elm) => {
      const offset = this.getBoundingBoxRectOffset(this.getElementRect(elm));
      const height = this.parseDecimalNumber(elm.style.height);
      const width = this.parseDecimalNumber(elm.style.width);

      // Filter off screen widgets at start, performance boost
      // Catcha: smart guide only applies to those on screen widgets before any movement
      if (
        offset.top + height - this.#pageOffset.top < this.#scrollOffset.top ||
        offset.top > window.innerHeight + this.#scrollOffset.top ||
        offset.left + width < this.#pageOffset.left ||
        offset.left > pageRect.width + this.#pageOffset.left
      ) {
        return prev;
      }

      return prev.concat(this.computeGuide(elm));
    }, []);

    // Compute target list Initialize
    this.#computedTargetsDatas = {
      v: {},
      h: {},
    };
    this.#computedTargetsValues = {
      v: [],
      h: [],
    };

    this.guides.forEach((guide) => {
      const value = this.parseDecimalNumber(guide.type === 'v' ? guide.left : guide.top);

      if (!this.#computedTargetsDatas[guide.type][value]) {
        this.#computedTargetsDatas[guide.type][value] = [];
      }

      this.#computedTargetsDatas[guide.type][value].push({
        pos: guide.pos,
        type: guide.type,
        left: value,
        top: value,
        element: guide.element,
        rect: guide.rect,
      });

      if (this.#computedTargetsValues[guide.type].indexOf(value) === -1) {
        this.#computedTargetsValues[guide.type].push(value);
      }
    }, this);

    TYPES.forEach((type) => {
      this.#computedTargetsValues[type].sort((a, b) => a - b);
    });

    // Set original offset
    const elemGuides = this.computeGuide(null, this.#draggingElmRect);

    if (this.#interactionType === 'resize') {
      this.#originalOffset = {
        top: elemGuides.find((guide) => guide.pos === 'top' && guide.type === 'h')?.top,
        left: elemGuides.find((guide) => guide.pos === 'left' && guide.type === 'v')?.left,
        bottom: elemGuides.find((guide) => guide.pos === 'bottom' && guide.type === 'h')?.top,
        right: elemGuides.find((guide) => guide.pos === 'right' && guide.type === 'v')?.left,
      };
      this.#targetOriginalOffset = {
        top: this.#draggingElmRect.top,
        left: this.#draggingElmRect.left,
      };
    } else if (this.#interactionType === 'drag') {
      this.#originalOffset = {
        top: ui.position.top,
        left: ui.position.left,
      };
      this.#targetOriginalOffset = {
        top: this.#draggingElmRect.top,
        left: this.#draggingElmRect.left,
      };
    }
  }

  /**
   * Compare targetData with all computedData to see if there is a snap target
   *
   * @param {Object} targetData
   * @param {Event} event
   * @param {Object} ui
   * @return {*}
   * @memberof SmartGuideHelper
   */
  match(targetData, ui) {
    if (targetData instanceof HTMLElement) {
      this.#draggingElmRect = targetData.getBoundingClientRect();
    } else {
      this.#draggingElmRect = targetData;
    }

    let elemGuides = this.computeGuide(null, this.#draggingElmRect);

    // reset chosen guide
    this.#chosenGuides = {
      top: { d: 1 },
      left: { d: 1 },
    };

    // Reset widget offset aand size for smooth gestures
    if (this.#interactionType === 'resize') {
      // Initialize resizeDirectionList
      if (this.#resizeDirectionList.length === 0) {
        this.#resizeDirectionList = this.getResizeDirectionList(ui?.axis, ui?.keepAspectRatio);
      }

      const topOffsetDiff = this.parseDecimalNumber(this.#originalOffset.top - ui.position.top);
      const leftOffsetDiff = this.parseDecimalNumber(this.#originalOffset.left - ui.position.left);
      const top = this.parseDecimalNumber(this.#targetOriginalOffset.top - topOffsetDiff) + this.#scrollOffset.top;
      const left = this.parseDecimalNumber(this.#targetOriginalOffset.left - leftOffsetDiff) + this.#scrollOffset.left;

      // 1. Use the calculated offset to the match at every time
      // Because when the offset is changed during resize, It returns the wrong offset
      // 2. If resizing top or left direction, don't change right and bottom offset
      elemGuides.forEach((guide, idx) => {
        if (guide.pos === 'top' && guide.type === 'h' && this.#resizeDirectionList.includes('top')) {
          elemGuides[idx].top = top + this.#scrollOffset.top;
        } else if (guide.pos === 'left' && guide.type === 'v' && this.#resizeDirectionList.includes('left')) {
          elemGuides[idx].left = left + this.#scrollOffset.left;
        } else if (guide.pos === 'bottom' && guide.type === 'h' && this.#resizeDirectionList.includes('bottom')) {
          elemGuides[idx].top =
            this.parseDecimalNumber(top + ui.size.height * (this.#options.zoom / 100)) + this.#scrollOffset.top;
        } else if (guide.pos === 'right' && guide.type === 'v' && this.#resizeDirectionList.includes('right')) {
          elemGuides[idx].left =
            this.parseDecimalNumber(left + ui.size.width * (this.#options.zoom / 100)) + this.#scrollOffset.left;
        }
      });
    } else if (this.#interactionType === 'drag') {
      elemGuides.forEach((guide, idx) => {
        const topOffsetDiff = this.parseDecimalNumber(this.#originalOffset.top - ui.position.top);
        const leftOffsetDiff = this.parseDecimalNumber(this.#originalOffset.left - ui.position.left);
        const top = this.parseDecimalNumber(this.#targetOriginalOffset.top - topOffsetDiff) + this.#scrollOffset.top;
        const left =
          this.parseDecimalNumber(this.#targetOriginalOffset.left - leftOffsetDiff) + this.#scrollOffset.left;

        if (guide.pos === 'top' && guide.type === 'h') {
          elemGuides[idx].top = top;
        } else if (guide.pos === 'left' && guide.type === 'v') {
          elemGuides[idx].left = left;
        } else if (guide.pos === 'bottom' && guide.type === 'h') {
          elemGuides[idx].top = this.parseDecimalNumber(top + elemGuides[idx].rect['height']);
        } else if (guide.pos === 'right' && guide.type === 'v') {
          elemGuides[idx].left = this.parseDecimalNumber(left + elemGuides[idx].rect['width']);
        } else if (guide.pos === 'mid' && guide.type === 'h') {
          elemGuides[idx].top = this.parseDecimalNumber((top * 2 + elemGuides[idx].rect['height']) / 2);
        } else if (guide.pos === 'mid' && guide.type === 'v') {
          elemGuides[idx].left = this.parseDecimalNumber((left * 2 + elemGuides[idx].rect['width']) / 2);
        }
      });
    }

    elemGuides.forEach((elemGuide) => {
      const type = elemGuide.type;
      const pos = type === 'h' ? 'top' : 'left';
      const snapTolerance = 3;

      const target = elemGuide[pos];
      const computedTargetsValues = this.#computedTargetsValues[type];

      // Prevent TypeError thrown from undefined value of 'closestTarget'
      // when computedTargetsValues are empty array due to the scrollOffsetY is off page offsetHeight
      // especially when long text(more than 2 paragraphs) copy and pasted into text box
      if (!computedTargetsValues.length) return;

      const closestTarget = this.closestBinarySearch(computedTargetsValues, target);

      // If interactionType is resize, Only the dragged direction will snap.
      if (this.#interactionType === 'resize' && this.#resizeDirectionList.indexOf(elemGuide.pos) === -1) {
        return;
      }

      const d = Math.ceil(Math.abs(elemGuide[pos] - closestTarget));

      if (d <= snapTolerance) {
        // If it's undefined, set empty array
        this.#chosenGuides[pos].guides = this.#chosenGuides[pos].guides || [];

        // Skip align mid with edge
        const guides = this.#computedTargetsDatas[type][closestTarget].filter((data) => {
          return !(
            (elemGuide.pos === 'mid' && data.pos !== elemGuide.pos) ||
            (data.pos === 'mid' && elemGuide.pos !== data.pos)
          );
        });

        if (!guides.length) return;

        // Do not use this guide if the difference is less than the previous guide
        if (this.#chosenGuides[pos].guides.length && this.#chosenGuides[pos].guides[0].d < d) {
          return;
        }

        // If there is something closer, change it at all.
        if (this.#chosenGuides[pos].guides.length && this.#chosenGuides[pos].guides[0].d > d) {
          this.#chosenGuides[pos].guides = [];
        }

        guides.forEach((guide) => {
          const match = Object.assign({ match: elemGuide, d: d }, guide);
          this.#chosenGuides[pos].guides.push(match);
        });
      }
    });

    // For resize match
    // Finding snap target faster to use computedTargetsDatas
    this.#resizeSpacingTargets = [];
    this.#dragSpacingTargets = {};
    let types = TYPES;

    if (this.#resizeDirectionList.length === 1) {
      types = ['left', 'right'].indexOf(this.#resizeDirectionList[0]) !== -1 ? ['h'] : ['v']; // h(Horizontal) or v(vertical)
    }

    // [Resize Spacing]
    if (this.#interactionType === 'resize') {
      types.forEach((type) => {
        const pos = POSITIONS[type === 'v' ? 0 : 1]; // ['left', 'top]
        const direction = TYPE_TO_DIRECTION[type]; // {'h': 'width', 'v': 'height'}
        let computedTargetMap = this.#computedTargetsDatas[type]; // It returns v list or h list depends on type
        let resizeSpacingTargets = [];

        elemGuides.forEach((elemGuide) => {
          const value = this.parseDecimalNumber(elemGuide[pos]);
          if (elemGuide.type === type && computedTargetMap[value] && value === computedTargetMap[value][0][pos]) {
            const searchDistance = this.#options.snapTolerance / 2;

            computedTargetMap[value].forEach((targetGuide) => {
              const d = this.parseDecimalNumber(
                this.minimizeToZoom(Math.abs(elemGuide.rect[direction] - targetGuide.rect[direction])),
              );
              const targetWidth = targetGuide.rect[direction];

              if (d > searchDistance) {
                return;
              }

              if (resizeSpacingTargets.length) {
                // Do not use this targetGuide if the difference is less than the previous targetGuide
                if (resizeSpacingTargets[0].d < d) {
                  return;
                }

                // If It has two widths with the same d value, Don't use it
                if (
                  resizeSpacingTargets[0].d === d &&
                  this.parseDecimalNumber(resizeSpacingTargets[0].rect[direction]) !==
                    this.parseDecimalNumber(targetWidth)
                ) {
                  return;
                }

                // If there is something closer, change it at all.
                if (resizeSpacingTargets[0].d > d) {
                  resizeSpacingTargets = [];
                }
              }

              // Prevent the addition of duplicate elements
              if (
                !resizeSpacingTargets.some((x) => {
                  return x.element === targetGuide.element && x.type === type;
                })
              ) {
                const match = Object.assign({ match: elemGuide, d: d }, targetGuide);
                resizeSpacingTargets.push(match);
              }
            });
          }
        });

        this.#resizeSpacingTargets = this.#resizeSpacingTargets.concat(resizeSpacingTargets);
      });
    }

    // [Drag Spacing]
    if (this.#interactionType === 'drag') {
      types.forEach((type) => {
        const pos = POSITIONS[type === 'v' ? 0 : 1]; // ['left', 'top]
        const computedTargetMap = this.#computedTargetsDatas[type]; // It returns v list or h list depends on type

        let dragSpacingTargets = {
          sDistances: {},
          eDistances: {},
        };

        if (
          this.#chosenGuides.top.guides !== undefined &&
          this.#chosenGuides.left.guides !== undefined &&
          this.#chosenGuides.top.guides.length &&
          this.#chosenGuides.left.guides.length
        ) {
          return;
        }

        const _type = type === 'h' ? 'v' : 'h';
        const _pos = pos === 'left' ? 'top' : 'left';
        const _oppositePos = _pos === 'left' ? 'right' : 'bottom';

        if (this.#chosenGuides[pos].guides === undefined || !this.#chosenGuides[pos].guides.length) {
          return;
        }

        for (let i = 0; i < this.#chosenGuides[pos].guides.length; i += 1) {
          const value = this.#chosenGuides[pos].guides[i][pos];

          if (computedTargetMap[value] && value === computedTargetMap[value][0][pos]) {
            const startElemGuide =
              elemGuides.filter((guide) => {
                return guide.type === _type && guide.pos === _pos;
              })[0] || null;
            const endElemGuide =
              elemGuides.filter((guide) => {
                return guide.type === _type && guide.pos === _oppositePos;
              })[0] || null;

            if (startElemGuide === null || endElemGuide === null) {
              return;
            }

            const sPos = this.parseDecimalNumber(startElemGuide[_pos] - this.#scrollOffset[_pos]);
            const ePos = this.parseDecimalNumber(endElemGuide[_pos] - this.#scrollOffset[_pos]);

            computedTargetMap[value].forEach((targetGuide) => {
              // Calculate the spacing between widgets
              if (targetGuide.rect[_oppositePos] < sPos) {
                // Left or Top targets from drag widget
                const distance = this.parseDecimalNumber(sPos - targetGuide.rect[_oppositePos]);
                dragSpacingTargets['sDistances'][distance] = Object.assign({ match: startElemGuide }, targetGuide);
              } else if (targetGuide.rect[_pos] > ePos) {
                // right or bottom targets from drag widget
                const distance = this.parseDecimalNumber(targetGuide.rect[_pos] - ePos);
                dragSpacingTargets['eDistances'][distance] = Object.assign({ match: endElemGuide }, targetGuide);
              }
            });
          }
        }

        const sDistances = Object.keys(dragSpacingTargets['sDistances']).map((key) => {
          return this.parseDecimalNumber(key);
        });
        const eDistances = Object.keys(dragSpacingTargets['eDistances']).map((key) => {
          return this.parseDecimalNumber(key);
        });
        const searchDistance = this.#options.snapTolerance / 2;
        let resultTargets = {
          diff: null,
          sTarget: null,
          mTarget: null,
          eTarget: null,
        };

        // Find the 2 of widgets that has same distance
        if (sDistances.length > 0 && eDistances.length > 0) {
          // Case 1: Have an 1 of widgets on both sides
          resultTargets = sDistances.reduce((prev, curr) => {
            for (let i = 0; i < eDistances.length; i += 1) {
              if (dragSpacingTargets['sDistances'][curr.toString()] === undefined) {
                return prev;
              }

              const diff = Math.floor((curr - eDistances[i]) / 2);

              if (Math.abs(diff) > searchDistance) {
                continue;
              }

              if (prev.diff !== null && Math.abs(prev.diff) <= Math.abs(diff)) {
                continue;
              }

              // Update target
              prev['diff'] = diff;
              prev['sTarget'] = dragSpacingTargets['sDistances'][curr.toString()];
              prev['mTarget'] = Object.assign(
                {
                  match: dragSpacingTargets['sDistances'][curr.toString()].match,
                },
                dragSpacingTargets['sDistances'][curr.toString()].match,
              );
              prev['eTarget'] = dragSpacingTargets['eDistances'][eDistances[i]];
            }

            return prev;
          }, resultTargets);

          // Store data to dragSpacingTargets
          if (resultTargets.diff !== null) {
            resultTargets['location'] = 'mid';
          }
        }

        if (sDistances.length > 0) {
          let isUpdated = false;
          resultTargets = sDistances.reduce((prev, curr, idx, arr) => {
            for (let i = idx; i < arr.length - 1; i += 1) {
              if (
                dragSpacingTargets['sDistances'][curr.toString()] === undefined ||
                dragSpacingTargets['sDistances'][arr[i + 1].toString()] === undefined
              ) {
                return prev;
              }

              const distance =
                dragSpacingTargets['sDistances'][curr.toString()].rect[_pos] -
                dragSpacingTargets['sDistances'][arr[i + 1].toString()].rect[_oppositePos];
              const diff = Math.floor(curr - distance);

              if (Math.abs(diff) > searchDistance) {
                continue;
              }

              if (prev.diff !== null && Math.abs(prev.diff) <= Math.abs(diff)) {
                continue;
              }

              // Update target
              prev['diff'] = diff;
              prev['sTarget'] = dragSpacingTargets['sDistances'][arr[i + 1]];
              prev['mTarget'] = dragSpacingTargets['sDistances'][curr.toString()];
              prev['eTarget'] = Object.assign(
                {
                  match: dragSpacingTargets['sDistances'][curr.toString()].match,
                },
                dragSpacingTargets['sDistances'][curr.toString()].match,
              );
              isUpdated = true;
            }

            return prev;
          }, resultTargets);

          // Store data to dragSpacingTargets
          if (isUpdated) {
            resultTargets['location'] = 'end';
          }
        }
        if (eDistances.length > 0) {
          let isUpdated = false;
          resultTargets = eDistances.reduce((prev, curr, idx, arr) => {
            for (let i = idx; i < arr.length - 1; i += 1) {
              if (
                dragSpacingTargets['eDistances'][curr.toString()] === undefined ||
                dragSpacingTargets['eDistances'][arr[i + 1].toString()] === undefined
              ) {
                return prev;
              }

              const distance =
                dragSpacingTargets['eDistances'][arr[i + 1].toString()].rect[_pos] -
                dragSpacingTargets['eDistances'][curr.toString()].rect[_oppositePos];
              const diff = this.parseDecimalNumber(distance - curr);

              if (Math.abs(diff) > searchDistance) {
                continue;
              }

              if (prev.diff !== null && Math.abs(prev.diff) <= Math.abs(diff)) {
                continue;
              }

              // Update target
              prev['diff'] = diff;
              prev['sTarget'] = Object.assign(
                {
                  match: dragSpacingTargets['eDistances'][curr.toString()].match,
                },
                dragSpacingTargets['eDistances'][curr.toString()].match,
              );
              prev['mTarget'] = dragSpacingTargets['eDistances'][curr.toString()];
              prev['eTarget'] = dragSpacingTargets['eDistances'][arr[i + 1]];
              isUpdated = true;
            }

            return prev;
          }, resultTargets);

          // Store data to dragSpacingTargets
          if (isUpdated) {
            resultTargets['location'] = 'start';
          }
        }

        if (resultTargets.diff !== null) {
          this.#dragSpacingTargets[type] = resultTargets;
        }
      });
    }

    // Find closest element
    const findClosest = (lastGuide, currentGuide) => {
      if (!lastGuide) return currentGuide;
      if (
        this.getDistance(lastGuide.match.rect, lastGuide.rect) <=
        this.getDistance(currentGuide.match.rect, currentGuide.rect)
      ) {
        return lastGuide;
      }
      return currentGuide;
    };

    // Assign priority guide
    POSITIONS.forEach((pos) => {
      // For drag
      const guides = this.#chosenGuides[pos].guides;

      if (!guides || guides.length === 0) {
        return;
      }

      const closestGuide = guides.reduce(findClosest, null);
      this.#chosenGuides[pos].guide = closestGuide;
      this.#chosenGuides[pos].guides = guides;

      // For resize
      // Compare the resize spacing target and drag target for using the closest one
      // If two types of guides are matched, use the closest guide
      if (!this.#chosenGuides[pos].guide || this.#resizeSpacingTargets.length === 0) {
        return;
      }

      const type = pos === 'left' ? 'h' : 'v';
      const filteredSpacingTargets = this.#resizeSpacingTargets.filter((target) => {
        return target.type === type;
      });

      if (filteredSpacingTargets.length) {
        //If the two d values(Absolute value) ​​are equal, the actual d value is obtained and compared exactly
        if (this.#chosenGuides[pos].guide.d === filteredSpacingTargets[0].d) {
          const direction = TYPE_TO_DIRECTION[type]; // {'h': 'width', 'v': 'height'}
          const chosenGuidesDiff = this.#chosenGuides[pos].guide[pos] - this.#chosenGuides[pos].guide.match[pos];
          let spacingDiff = filteredSpacingTargets[0].rect[direction] - filteredSpacingTargets[0].match.rect[direction];

          // If it changes top or left offset, Change - to + or reverse.
          if (this.#resizeDirectionList.indexOf(pos) !== -1) {
            spacingDiff = -spacingDiff;
          }

          // Don't remove both types of guides when the actual d values ​​are the same.
          if (chosenGuidesDiff === spacingDiff) {
            return;
          }
        }
        if (this.#chosenGuides[pos].guide.d > filteredSpacingTargets[0].d) {
          // remove the guide
          delete this.#chosenGuides[pos].guide;
          delete this.#chosenGuides[pos].guides;
        } else if (this.#chosenGuides[pos].guide.d <= filteredSpacingTargets[0].d) {
          // remove the resize spacing targets
          this.#resizeSpacingTargets = this.#resizeSpacingTargets.filter((target) => {
            return target.type !== type;
          });
        }
      }
    });
  }

  /**
   * @param event jquery event
   * @param ui jquery UI
   */
  snap(event, ui) {
    // Reset #snapOffset
    this.#snapOffset = null;

    if (!this.#options.enableSnap) {
      return;
    }

    let newPosition = {
      left: null,
      top: null,
    };
    let newSize = {
      width: null,
      height: null,
    };

    const updateDragUI = (pos, guide) => {
      const diff = guide[pos] - guide.match[pos];
      if (guide.d === Math.abs(diff)) {
        newPosition[pos] = this.parseDecimalNumber(ui.position[pos] + diff);
      } else {
        // remove the guide
        delete this.#chosenGuides[pos].guide;
        delete this.#chosenGuides[pos].guides;
      }
    };
    const updateDragSpacingUI = (pos, guide) => {
      newPosition[pos] = ui.position[pos] - guide.diff;
    };
    const updateResizeUI = (pos, guide, dir, interactionType) => {
      const snapTolerance = 3;
      const direction = pos === 'left' ? 'width' : 'height';

      if (interactionType === 'line') {
        const diff = guide[pos] - guide.match[pos];

        if (['top', 'left'].indexOf(dir) !== -1 && Math.ceil(Math.abs(diff)) <= snapTolerance) {
          // case 1: snap to top or left side
          newPosition[pos] = this.parseDecimalNumber(ui.position[pos] + diff);
          newSize[direction] = this.parseDecimalNumber(ui.size[direction] - this.minimizeToZoom(diff));
        } else if (['bottom', 'right'].indexOf(dir) !== -1 && Math.ceil(Math.abs(diff)) <= snapTolerance) {
          // case 2: snap bottom or right side
          newSize[direction] = this.parseDecimalNumber(ui.size[direction] + this.minimizeToZoom(diff));
        }
      } else if (interactionType === 'spacing') {
        const diff = guide.rect[direction] - ui.size[direction];
        if (Math.ceil(Math.abs(diff)) <= snapTolerance) {
          if (['top', 'left'].indexOf(dir) !== -1) {
            // case 1: snap to top or left side
            newPosition[pos] = ui.position[pos] + diff;
          } else if (['bottom', 'right'].indexOf(dir) !== -1 && Math.ceil(Math.abs(diff)) <= snapTolerance) {
            // case 2: snap bottom or right side
            newSize[direction] = this.parseDecimalNumber(ui.size[direction] + this.minimizeToZoom(diff));
          }
        }
      }
    };

    if (this.#interactionType === 'drag') {
      TYPES.forEach((type) => {
        const pos = TYPE_TO_POSITION[type];
        if (this.#chosenGuides[pos].guide !== undefined) {
          updateDragUI(pos, this.#chosenGuides[pos].guide);
        }
        if (this.#dragSpacingTargets[type] !== undefined) {
          updateDragSpacingUI(pos, this.#dragSpacingTargets[type]);
        }
      });
    } else if (this.#interactionType === 'resize') {
      for (let i = 0; i < this.#resizeDirectionList.length; i++) {
        const key = this.#resizeDirectionList[i];
        const pos = ['top', 'bottom'].indexOf(key) !== -1 ? 'top' : 'left';
        let choosenGuide =
          ['top', 'bottom'].indexOf(key) !== -1 ? this.#chosenGuides.top.guide : this.#chosenGuides.left.guide;
        if (choosenGuide !== undefined) {
          updateResizeUI(pos, choosenGuide, key, 'line');
        }

        if (this.#resizeSpacingTargets.length) {
          choosenGuide = this.#resizeSpacingTargets[0];
          updateResizeUI(pos, choosenGuide, key, 'spacing');
        }
      }
    }

    this.#snapOffset = {
      ...ui.position,
      ...ui.size,
      ...newPosition,
      ...newSize,
    };

    this.showGuide();

    return this.#snapOffset;
  }

  /**
   * Render the guides and boxes using the calculated data
   */
  showGuide() {
    let guideBoxTargetList = [];
    const canvasLineStyle = this.#borderStyles.canvasLineStyle;
    const defaultLineStyle = this.#borderStyles.defaultLineStyle;
    const guidedableClassName = this.#classNames.pageClass;

    // This part is same as v2
    if (this.#chosenGuides.top.guide !== undefined && this.#chosenGuides.top.guides.length > 0) {
      const hasSpacingIndicator = this.#prevDragSpacingTargets.h !== undefined;
      const top = this.minimizeToZoom(this.#chosenGuides.top.guide.top - this.#pageOffset.top);
      const targetLeftPosition =
        typeof this.#snapOffset?.left === 'number'
          ? this.#snapOffset.left - this.#pageOffset.left + this.#scrollOffset.left
          : this.getBoundingBoxRectPosition(this.#draggingElmRect, this.#pageOffset).left;
      const targetRect = this.#draggingElmRect;
      let startPos = targetLeftPosition;
      let distance = 0;
      let lineStyle = defaultLineStyle;

      this.#chosenGuides.top.guides.forEach((guide) => {
        if (hasSpacingIndicator && !guide.element.classList.contains(guidedableClassName)) {
          guideBoxTargetList.push(guide);
        }

        // chosenGuides[pos].guides filter
        if (
          this.#chosenGuides.top.guide !== guide &&
          Math.floor(Math.abs(guide.top - this.#chosenGuides.top.guide.top)) > 0
        ) {
          return;
        }

        // Canvas guide line color is green and It don't use the guide box
        if (guide.element.classList.contains(guidedableClassName)) {
          lineStyle = canvasLineStyle;
        } else {
          lineStyle = lineStyle === canvasLineStyle ? canvasLineStyle : defaultLineStyle;
          guideBoxTargetList.push(guide);
        }

        const pos = this.getBoundingBoxRectPosition(this.getElementRect(guide.element), this.#pageOffset);
        startPos = Math.min(startPos, pos.left);
        distance = Math.max(distance, targetLeftPosition + targetRect.width, pos.left + guide.rect.width);
      });

      // Render
      this.#hGuideLineElm.style.top = top - 1 + 'px';
      this.#hGuideLineElm.style.left = this.minimizeToZoom(startPos) + 'px';
      this.#hGuideLineElm.style.width = this.minimizeToZoom(distance - startPos) + 'px';
      this.#hGuideLineElm.style.borderTop = lineStyle;
      this.#hGuideLineElm.style.display = 'block';
    } else {
      this.#hGuideLineElm.style.display = 'none';
    }

    // This part is same as v2
    if (this.#chosenGuides.left.guide !== undefined && this.#chosenGuides.left.guides.length > 0) {
      const hasSpacingIndicator = this.#prevDragSpacingTargets.v !== undefined;
      const left = this.minimizeToZoom(this.#chosenGuides.left.guide.left - this.#pageOffset.left);
      const targetTopPosition =
        typeof this.#snapOffset?.top === 'number'
          ? this.#snapOffset.top - this.#pageOffset.top + this.#scrollOffset.top
          : this.getBoundingBoxRectPosition(this.#draggingElmRect, this.#pageOffset).top;
      const targetRect = this.#draggingElmRect;
      let startPos = targetTopPosition;
      let distance = 0;
      let lineStyle = defaultLineStyle;

      this.#chosenGuides.left.guides.forEach((guide) => {
        if (hasSpacingIndicator && !guide.element.classList.contains(guidedableClassName)) {
          guideBoxTargetList.push(guide);
        }
        // chosenGuides[pos].guides filter
        if (
          this.#chosenGuides.left.guide !== guide &&
          Math.floor(Math.abs(guide.left - this.#chosenGuides.left.guide.left)) > 0
        ) {
          return;
        }

        // Canvas guide line color is green and don't use the guide box
        if (guide.element.classList.contains(guidedableClassName)) {
          lineStyle = canvasLineStyle;
        } else {
          lineStyle = lineStyle === canvasLineStyle ? canvasLineStyle : defaultLineStyle;
          guideBoxTargetList.push(guide);
        }

        const pos = this.getBoundingBoxRectPosition(this.getElementRect(guide.element), this.#pageOffset);
        startPos = Math.min(startPos, pos.top);
        distance = Math.max(distance, targetTopPosition + targetRect.height, pos.top + guide.rect.height);
      });

      // Render
      this.#vGuideLineElm.style.top = this.minimizeToZoom(startPos) + 'px';
      this.#vGuideLineElm.style.left = left - 1 + 'px';
      this.#vGuideLineElm.style.height = this.minimizeToZoom(distance - startPos) + 'px';
      this.#vGuideLineElm.style.borderRight = lineStyle;
      this.#vGuideLineElm.style.display = 'block';
    } else {
      this.#vGuideLineElm.style.display = 'none';
    }

    // [Drag snap and spacing]
    // Clean all guideBox elements before creating a new elements.
    this.cleanupGuideBoxElements();

    // [Drag Snap]
    this.generateGuideBoxElements.call(this, guideBoxTargetList);

    // [Drag Spacing]
    // Create target guide box when dragging
    if (this.#snapOffset !== null) {
      Object.keys(this.#dragSpacingTargets).forEach((type) => {
        let dragSpacingTargets = [];
        const sTarget = this.#dragSpacingTargets[type].sTarget;
        const mTarget = this.#dragSpacingTargets[type].mTarget;
        const eTarget = this.#dragSpacingTargets[type].eTarget;
        const parsedSnapOffset = {
          top: this.#snapOffset.top - this.#pageOffset.top + this.#scrollOffset.top,
          left: this.#snapOffset.left - this.#pageOffset.left + this.#scrollOffset.left,
        };

        const sTargetPosition =
          this.#dragSpacingTargets[type].location === 'start'
            ? parsedSnapOffset
            : this.getBoundingBoxRectPosition(this.getElementRect(sTarget.element), this.#pageOffset);
        const mTargetPosition =
          this.#dragSpacingTargets[type].location === 'mid'
            ? parsedSnapOffset
            : this.getBoundingBoxRectPosition(this.getElementRect(mTarget.element), this.#pageOffset);
        const eTargetPosition =
          this.#dragSpacingTargets[type].location === 'end'
            ? parsedSnapOffset
            : this.getBoundingBoxRectPosition(this.getElementRect(eTarget.element), this.#pageOffset);

        const sTargetBottom = sTargetPosition.top + sTarget.rect.height;
        const mTargetBottom = mTargetPosition.top + mTarget.rect.height;
        const eTargetBottom = eTargetPosition.top + eTarget.rect.height;
        const sTargetRight = sTargetPosition.left + sTarget.rect.width;
        const mTargetRight = mTargetPosition.left + mTarget.rect.width;
        const eTargetRight = eTargetPosition.left + eTarget.rect.width;

        let sCustomPosition, eCustomPosition;

        if (type === 'h') {
          sCustomPosition = {
            sTop: this.minimizeToZoom(sTargetBottom > mTargetBottom ? sTargetBottom : mTargetBottom),
            sLeft: this.minimizeToZoom(sTargetRight) - 1,
            sWidth: this.minimizeToZoom(mTargetPosition.left - sTargetRight),
            sDistance: 0,
            eTop: this.minimizeToZoom(mTargetBottom > sTargetBottom ? mTargetBottom : sTargetBottom),
            eLeft: this.minimizeToZoom(sTargetRight) - 1,
            eDistance: 0,
          };
          eCustomPosition = {
            sTop: this.minimizeToZoom(mTargetBottom > eTargetBottom ? mTargetBottom : eTargetBottom),
            sLeft: this.minimizeToZoom(mTargetRight) - 1,
            sWidth: this.minimizeToZoom(eTargetPosition.left - mTargetRight),
            sDistance: 0,
            eTop: this.minimizeToZoom(eTargetBottom > mTargetBottom ? eTargetBottom : mTargetBottom),
            eLeft: this.minimizeToZoom(mTargetRight) - 1,
            eDistance: 0,
          };
        } else {
          sCustomPosition = {
            sTop: this.minimizeToZoom(sTargetBottom) - 1,
            sLeft: this.minimizeToZoom(sTargetRight > mTargetRight ? sTargetRight : mTargetRight),
            sHeight: this.minimizeToZoom(mTargetPosition.top - sTargetBottom),
            sDistance: 0,
            eTop: this.minimizeToZoom(sTargetBottom) - 1,
            eLeft: this.minimizeToZoom(mTargetRight > sTargetRight ? mTargetRight : sTargetRight),
            eDistance: 0,
          };
          eCustomPosition = {
            sTop: this.minimizeToZoom(mTargetBottom) - 1,
            sLeft: this.minimizeToZoom(mTargetRight > eTargetRight ? mTargetRight : eTargetRight),
            sHeight: this.minimizeToZoom(eTargetPosition.top - mTargetBottom),
            sDistance: 0,
            eTop: this.minimizeToZoom(mTargetBottom) - 1,
            eLeft: this.minimizeToZoom(eTargetRight > mTargetRight ? eTargetRight : mTargetRight),
            eDistance: 0,
          };
        }
        dragSpacingTargets.push(
          Object.assign({}, this.#dragSpacingTargets[type].sTarget, {
            element: null,
            type: type,
            position: {
              top: sTargetPosition.top,
              left: sTargetRight,
            },
            customPosition: sCustomPosition,
          }),
        );
        dragSpacingTargets.push(
          Object.assign({}, this.#dragSpacingTargets[type].sTarget, {
            element: null,
            type: type,
            position: {
              top: sTargetPosition.top,
              left: mTargetRight,
            },
            customPosition: eCustomPosition,
          }),
        );

        this.generateGuideIndicatorElements.call(this, dragSpacingTargets);
      });
    }

    // [Resize Snap & Spacing]
    // Create size comparison target guide box when resizing
    if (this.#resizeSpacingTargets.length) {
      // [Resize Snap]
      this.generateGuideBoxElements.call(this, this.#resizeSpacingTargets);

      // If resizeSpacingTargets exists, it also adds the resizing widget
      TYPES.forEach((type, idx) => {
        const pos = TYPE_TO_POSITION[type]; // {'h': 'left', 'v': 'top'}
        const filteredSpacingTargets = this.#resizeSpacingTargets.filter((target) => {
          return target.type === type;
        });

        if (filteredSpacingTargets.length) {
          const matchClone = filteredSpacingTargets[0].match;
          const value = filteredSpacingTargets[0].match[pos];
          const originalPosition = this.getBoundingBoxRectPosition(
            filteredSpacingTargets[0].match.rect,
            this.#pageOffset,
          );
          const position = {
            top:
              this.#snapOffset.top !== null ? this.#snapOffset.top * (this.#options.zoom / 100) : originalPosition.top,
            left:
              this.#snapOffset.left !== null
                ? this.#snapOffset.left * (this.#options.zoom / 100)
                : originalPosition.left,
          };

          matchClone.rect.width =
            this.#snapOffset.width !== null
              ? this.#snapOffset.width * (this.#options.zoom / 100)
              : matchClone.rect['width'];
          matchClone.rect.height =
            this.#snapOffset.height !== null
              ? this.#snapOffset.height * (this.#options.zoom / 100)
              : matchClone.rect['height'];

          const match = Object.assign(
            {
              match: matchClone,
              value: value,
              position: position,
            },
            matchClone,
          );
          this.#resizeSpacingTargets.push(match);
        }
      });

      // [Resize Spacing]
      this.generateGuideIndicatorElements.call(this, this.#resizeSpacingTargets);
    }

    // Store to previous lists for comparison
    this.#prevDragSpacingTargets = this.#dragSpacingTargets;
  }

  hide() {
    this.#chosenGuides = {};

    // Resize
    this.#resizeDirectionList = [];
    this.#resizeSpacingTargets = [];

    this.#hGuideLineElm.style.display = 'none';
    this.#vGuideLineElm.style.display = 'none';

    this.cleanupGuideBoxElements();
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * Calculates and returns 6 data that is the target of the element.
   */
  computeGuide(elm, customRect) {
    const rect = customRect ? customRect : elm.getBoundingClientRect();
    const scrollOffset = this.getScrollOffset();

    const top = this.parseDecimalNumber(rect.top + scrollOffset.top);
    const bottom = this.parseDecimalNumber(rect.bottom + scrollOffset.top);
    const left = this.parseDecimalNumber(rect.left + scrollOffset.left);
    const right = this.parseDecimalNumber(rect.right + scrollOffset.left);
    const x_mid = this.parseDecimalNumber((rect.left + scrollOffset.left + (rect.right + scrollOffset.left)) / 2);
    const y_mid = this.parseDecimalNumber((rect.top + scrollOffset.top + (rect.bottom + scrollOffset.top)) / 2);

    return [
      {
        type: 'h',
        pos: 'mid',
        left: left,
        top: y_mid,
        element: elm,
        rect: rect,
      },
      {
        type: 'v',
        pos: 'mid',
        left: x_mid,
        top: top,
        element: elm,
        rect: rect,
      },
      {
        type: 'h',
        pos: 'top',
        left: left,
        top: top,
        element: elm,
        rect: rect,
      },
      {
        type: 'h',
        pos: 'bottom',
        left: left,
        top: bottom,
        element: elm,
        rect: rect,
      },
      {
        type: 'v',
        pos: 'left',
        left: left,
        top: top,
        element: elm,
        rect: rect,
      },
      {
        type: 'v',
        pos: 'right',
        left: right,
        top: top,
        element: elm,
        rect: rect,
      },
    ];
  }

  getElementRect(elm) {
    return elm.getBoundingClientRect();
  }

  /**
   * Return the element offset
   * Use this function instead of JQuery offset()
   *
   * @param {*} rect
   * @returns
   */
  getBoundingBoxRectOffset(rect) {
    const scrollOffset = this.getScrollOffset();

    return {
      top: rect.top + scrollOffset.top,
      left: rect.left + scrollOffset.left,
    };
  }

  /**
   * Return the element position
   * Use this function instead of JQuery position()
   *
   * @param {*} rect
   * @returns
   */
  getBoundingBoxRectPosition(rect, pageOffset) {
    const result = this.getBoundingBoxRectOffset(rect);

    return {
      top: this.parseDecimalNumber(result.top - pageOffset.top),
      left: this.parseDecimalNumber(result.left - pageOffset.left),
    };
  }

  /**
   * Returns the exact scroll offset value
   *
   * @returns
   */
  getScrollOffset() {
    return {
      top: this.#editorContainerElm.scrollTop + document.body.scrollTop + document.documentElement.scrollTop || 0,
      left: this.#editorContainerElm.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft || 0,
    };
  }

  /**
   * Return the specific decimal point that converted
   * Use round to parse and Default decimal point is the zero
   *
   * @param {*} number
   * @returns
   */
  parseDecimalNumber(number, decimalPoint) {
    // Check decimalPoint is integer
    if (Number.isInteger(decimalPoint) && decimalPoint < 0) {
      decimalPoint = 0;
    }

    // Parsing number value to avoid errors
    // e.g.) 123.12px -> 123.12
    number = parseFloat(number);

    if (isNaN(number)) return;

    return parseFloat(number.toFixed(decimalPoint));
  }

  /**
   * Return the current resizing direction List
   * Need to modify it to use ui axis value later
   *
   * @param {*} ui Jquery resizable's ui value Ref: http://api.jqueryui.com/resizable/#event-resize
   * @returns Return the new resizeDirectionList
   * e.g. ['left', 'top']
   */
  getResizeDirectionList(axis, keepAspectRatio) {
    let resizeDirectionList = [];
    const resizeHandleStart = axis || null;

    if (resizeHandleStart === null) {
      return resizeDirectionList;
    }

    for (let i = 0; i < resizeHandleStart.length; i += 1) {
      switch (resizeHandleStart[i]) {
        case 'e':
          resizeDirectionList.push('right');
          break;
        case 'w':
          resizeDirectionList.push('left');
          break;
        case 's':
          resizeDirectionList.push('bottom');
          break;
        case 'n':
          resizeDirectionList.push('top');
          break;
        default:
          break;
      }
    }

    // If ui['keepAspectRatio'] is true and resizeHandleStart is 'n' or 's', Add the right direction to resizeDirectionList
    // Because the axis changes rely on the direction
    if (keepAspectRatio) {
      if (resizeHandleStart === 'n' || resizeHandleStart === 's') {
        resizeDirectionList.push('right');
      } else if (resizeHandleStart === 'w' || resizeHandleStart === 'e') {
        resizeDirectionList.push('bottom');
      }
    }

    // 'left' is always first
    resizeDirectionList.sort((a) => {
      if (a === 'left') return -1;
      return 0;
    });

    return resizeDirectionList;
  }

  /**
   * Return closest target using binary search.
   *
   * @param Int[] arr
   * @param Int target
   * @param Int lo [optional]
   * @param Int hi [optional]
   * @returns
   */
  closestBinarySearch(arr, target, lo, hi) {
    if (lo === undefined) lo = 0;
    if (hi === undefined) hi = arr.length - 1;

    if (target < arr[lo]) return arr[0];
    if (target > arr[hi]) return arr[hi];

    const mid = Math.floor((hi + lo) / 2);

    if (hi - lo < 2) {
      return target - arr[lo] <= arr[hi] - target ? arr[lo] : arr[hi];
    } else {
      if (target < arr[mid]) {
        return this.closestBinarySearch(arr, target, lo, mid);
      } else if (target > arr[mid]) {
        return this.closestBinarySearch(arr, target, mid, hi);
      } else {
        return arr[mid];
      }
    }
  }

  /**
   * Calculate the value using the zoom option
   *
   * @param Int[] arr
   * @param Int target
   * @param Int lo [optional]
   * @param Int hi [optional]
   * @returns
   */
  minimizeToZoom(num = 0) {
    return num / (this.#options.zoom / 100);
  }

  /**
   * Return the closest widget
   *
   * @param {*} rect1
   * @param {*} rect2
   * @returns
   */
  getDistance(rect1, rect2) {
    return Math.sqrt(Math.pow(rect1.left - rect2.left, 2) + Math.pow(rect1.top - rect2.top, 2));
  }

  /**
   * Remove all guide box elements
   *
   * @returns
   */
  cleanupGuideBoxElements() {
    Array.prototype.forEach.call(document.querySelectorAll('.v-guide-line-box'), function (elm) {
      elm.parentNode.removeChild(elm);
    });
  }

  /**
   * Generate Guide Box Elements
   * If same layout exists in same location, Do not change any guideBox elements.
   *
   * @param {*} targetList
   * @returns
   */
  generateGuideBoxElements(targetList) {
    // Use DocumentFragment for DOM render optimization
    const guideLineClassName = this.#classNames.guideLineClass;
    const borderStyle = this.#borderStyles.guideBoxStyle;
    const guideBoxFragment = document.createDocumentFragment();

    targetList.forEach((target) => {
      const pos = this.getBoundingBoxRectPosition(this.getElementRect(target.element), this.#pageOffset);
      const customStyle = { border: borderStyle };
      const elementPosition = {
        top: this.parseDecimalNumber(this.minimizeToZoom(pos.top)) - 1,
        left: this.parseDecimalNumber(this.minimizeToZoom(pos.left)) - 1,
        width: this.parseDecimalNumber(this.minimizeToZoom(target.rect.width)) + 1,
        height: this.parseDecimalNumber(this.minimizeToZoom(target.rect.height)) + 1,
      };
      const guideBoxElement = this.getCreatedElement(customStyle, elementPosition, guideLineClassName);

      // Append to document fragment
      guideBoxFragment.appendChild(guideBoxElement);
    });

    // Render
    this.#rootElm.appendChild(guideBoxFragment.cloneNode(true));
  }

  /**
   * Generate Guide Box Elements
   * If same layout exists in same location, Do not change any guideBox elements.
   *
   * @param {*} targetList
   * @returns
   */
  getCreatedElement(customStyle, elementPosition, className) {
    // validation
    if (!(customStyle instanceof Object) || !Object.keys(customStyle).length) {
      customStyle = {};
    }

    if (
      !elementPosition.hasOwnProperty('top') ||
      !elementPosition.hasOwnProperty('left') ||
      !elementPosition.hasOwnProperty('width') ||
      !elementPosition.hasOwnProperty('height')
    ) {
      return;
    }

    // Create the default guide box
    const guideBoxElement = document.createElement('div');
    guideBoxElement.style.position = 'absolute';
    guideBoxElement.style.display = 'block';
    guideBoxElement.style.pointerEvents = 'none';
    guideBoxElement.classList.add(className);
    guideBoxElement.classList.add(className + '-box');
    guideBoxElement.style.zIndex = this.#options.zIndex;

    // Update guide box position
    guideBoxElement.style.top = elementPosition.top + 'px';
    guideBoxElement.style.left = elementPosition.left + 'px';
    guideBoxElement.style.width = elementPosition.width + 'px';
    guideBoxElement.style.height = elementPosition.height + 'px';

    for (let key in customStyle) {
      guideBoxElement.style[key] = customStyle[key];
    }

    return guideBoxElement;
  }

  generateGuideIndicatorElements(targetList) {
    // Use DocumentFragment for DOM render optimization
    const guideLineClassName = this.#classNames.guideLineClass;
    const borderStyle = this.#borderStyles.guideBoxStyle;
    const guideSpacingFragment = document.createDocumentFragment();

    targetList.forEach((target) => {
      const pos = !target.position
        ? this.getBoundingBoxRectPosition(this.getElementRect(target.element), this.#pageOffset)
        : target.position;
      let posTop = this.parseDecimalNumber(this.minimizeToZoom(pos.top));
      let posLeft = this.parseDecimalNumber(this.minimizeToZoom(pos.left));
      let width = this.parseDecimalNumber(this.minimizeToZoom(!!target.size ? target.size.width : target.rect.width));
      let height = this.parseDecimalNumber(
        this.minimizeToZoom(!!target.size ? target.size.height : target.rect.height),
      );
      let createdOuterStartElement, createdOuterEndElement, createdInnerElement;
      let outerStartCustomStyle, outerEndCustomStyle, innerCustomStyle;

      if (target.type === 'h') {
        outerStartCustomStyle = {
          borderLeft: borderStyle,
          marginTop: '4px',
        };
        outerEndCustomStyle = {
          borderRight: borderStyle,
          marginTop: '4px',
        };
        innerCustomStyle = {
          borderBottom: borderStyle,
          marginTop: '4px',
        };

        posTop += height;
        posLeft -= 1;
        width = target.customPosition !== undefined ? target.customPosition.sWidth : width + 1;
        height = 9;
      } else {
        outerStartCustomStyle = {
          borderTop: borderStyle,
          marginLeft: '4px',
        };
        outerEndCustomStyle = {
          borderBottom: borderStyle,
          marginLeft: '4px',
        };
        innerCustomStyle = {
          borderRight: borderStyle,
          marginLeft: '4px',
        };

        posTop -= 1;
        posLeft += width;
        width = 9;
        height = target.customPosition !== undefined ? target.customPosition.sHeight : height + 1;
      }

      let outerStartElmPos = {
        top: posTop,
        left: posLeft,
        width: width,
        height: height,
      };
      let outerEndElmPos = {
        top: posTop,
        left: posLeft,
        width: width,
        height: height,
      };
      let innerElmPos = {
        top: posTop,
        left: posLeft,
        width: width,
        height: height,
      };

      if (target.type === 'h') {
        // Create the Spacing outer indicator
        if (target.customPosition !== undefined) {
          outerStartElmPos.top = target.customPosition.sTop;
          outerStartElmPos.left = target.customPosition.sLeft;
          outerStartElmPos.height = height + target.customPosition.sDistance;
          outerEndElmPos.top = target.customPosition.eTop;
          outerEndElmPos.left = target.customPosition.eLeft;
          outerEndElmPos.height = height + target.customPosition.eDistance;
        }
        createdOuterStartElement = this.getCreatedElement(outerStartCustomStyle, outerStartElmPos, guideLineClassName);
        createdOuterEndElement = this.getCreatedElement(outerEndCustomStyle, outerEndElmPos, guideLineClassName);

        // Create the Spacing inner indicator
        if (target.customPosition !== undefined) {
          innerElmPos.top = Math.max(target.customPosition.sTop, target.customPosition.eTop);
        }
        innerElmPos.height -= 4;
        createdInnerElement = this.getCreatedElement(innerCustomStyle, innerElmPos, guideLineClassName);
      } else {
        // Create the Spacing outer indicator
        if (target.customPosition !== undefined) {
          outerStartElmPos.top = target.customPosition.sTop;
          outerStartElmPos.left = target.customPosition.sLeft;
          outerStartElmPos.width = width + target.customPosition.sDistance;
          outerEndElmPos.top = target.customPosition.eTop;
          outerEndElmPos.left = target.customPosition.eLeft;
          outerEndElmPos.width = width + target.customPosition.eDistance;
        }
        createdOuterStartElement = this.getCreatedElement(outerStartCustomStyle, outerStartElmPos, guideLineClassName);
        createdOuterEndElement = this.getCreatedElement(outerEndCustomStyle, outerEndElmPos, guideLineClassName);

        // Create the Spacing inner indicator
        if (target.customPosition !== undefined) {
          innerElmPos.top = Math.max(target.customPosition.sTop, target.customPosition.eTop);
          innerElmPos.left = Math.max(target.customPosition.sLeft, target.customPosition.eLeft);
        }
        innerElmPos.width -= 4;
        createdInnerElement = this.getCreatedElement(innerCustomStyle, innerElmPos, guideLineClassName);
      }

      // Append to document fragment
      guideSpacingFragment.appendChild(createdOuterStartElement);
      guideSpacingFragment.appendChild(createdOuterEndElement);
      guideSpacingFragment.appendChild(createdInnerElement);
    });

    // Render
    this.#rootElm.appendChild(guideSpacingFragment.cloneNode(true));
  }
}
export default SmartGuideHelper;
