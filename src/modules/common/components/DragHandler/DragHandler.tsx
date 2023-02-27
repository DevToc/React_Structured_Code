import { useEffect, useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import styled from '@emotion/styled';
import Moveable from 'react-moveable';
import { OnDragStart as OnDragStartEvent, OnDrag as OnDragEvent, OnDragEnd as OnDragEndEvent } from 'react-moveable';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { useSmartGuide } from '../../../../hooks/useSmartGuide';
import { Snap } from '../../../Editor/components/BoundingBox/BoundingBox.types';
import { DEFAULT_SNAP_DATA } from '../../../Editor/components/BoundingBox/BoundingBox.config';
import { getRotatDegFromStyle } from '../../../Editor/components/BoundingBox/BoundingBox.helpers';

// Set transform: scale(1) because this component will be rendered in the scaled element
const Handler = styled.div`
  pointer-events: auto;
  cursor: move;
  display: none;
`;

interface DragHandlerProps {
  targetRef?: React.RefObject<HTMLDivElement>;
  onDragStart?: Function;
  onDrag?: Function;
  onDragEnd?: Function;
  zoom?: number;
  enableSmartGuide?: boolean;
}

export const DragHandler = ({
  targetRef,
  onDragStart = () => {},
  onDrag = (e: OnDragEvent) => {},
  onDragEnd = (e: OnDragEndEvent) => {},
  zoom = 1,
  enableSmartGuide = true,
}: DragHandlerProps) => {
  const [frame, setFrame] = useState({
    translate: [0, 0],
    rotate: 0,
  });

  const moveableRef: any = useRef(null);
  const windowSize = useWindowSize();
  const lastSnapPosition = useRef<Snap | null>();
  const [setSmartGuideConfig, compute, match, hide] = useSmartGuide(
    document.getElementById('smartguide-container') as HTMLElement,
    {
      zIndex: 1003,
      enableSnap: true,
      zoomPercent: zoom * 100,
      useCenter: true,
    },
  );

  const setStartFrame = useCallback((e: OnDragStartEvent) => {
    const target = e.target;
    const rotateDeg = getRotatDegFromStyle(target.style);
    setFrame({
      translate: [0, 0],
      rotate: rotateDeg,
    });
  }, []);

  const handleDragStart = useCallback(
    (e: OnDragStartEvent) => {
      e.inputEvent.stopPropagation();
      setStartFrame(e);

      // SmartGuide
      if (enableSmartGuide) {
        lastSnapPosition.current = DEFAULT_SNAP_DATA;
        compute(e, 'drag');
      }

      document.body.style.cursor = 'move';

      // Callback
      onDragStart(e);
    },
    [enableSmartGuide, onDragStart, compute, setStartFrame],
  );

  const handleDrag = useCallback(
    (e: OnDragEvent) => {
      e.inputEvent.stopPropagation();
      const target = e.target;
      e.beforeTranslate[0] = e.beforeTranslate[0] * zoom;
      e.beforeTranslate[1] = e.beforeTranslate[1] * zoom;
      frame.translate = [e.beforeTranslate[0], e.beforeTranslate[1]];

      // SmartGuide
      if (enableSmartGuide) {
        // SmartGuide
        lastSnapPosition.current = match({ e });
      }

      const lastTranslate = {
        x: lastSnapPosition.current?.x ?? frame.translate[0],
        y: lastSnapPosition.current?.y ?? frame.translate[1],
      };

      // Update handler position
      target.style.transform = `translate(${lastTranslate.x}px, ${lastTranslate.y}px)`;
      const translate = [lastTranslate.x, lastTranslate.y];

      // Callback
      onDrag(e, translate);
    },
    [enableSmartGuide, onDrag, frame, match, zoom],
  );

  const handleDragEnd = useCallback(
    (e: OnDragEndEvent) => {
      e.inputEvent.stopPropagation();
      const target = e.target;

      // SmartGuide
      hide();

      // Reset
      frame.translate = [0, 0];
      target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;
      document.body.style.cursor = 'unset';

      // Callback
      onDragEnd(e);
    },
    [onDragEnd, frame, hide],
  );

  useEffect(() => {
    if (!moveableRef || !moveableRef.current) return;
    moveableRef.current.updateRect();

    setSmartGuideConfig({
      zoomPercent: zoom * 100,
    });
  }, [zoom, windowSize, setSmartGuideConfig]);

  useEffect(() => {
    if (!targetRef?.current) return;

    const element = targetRef.current;
    element.style.cursor = 'move';
    element.style.pointerEvents = 'auto';
    return () => {
      if (!element) return;

      element.style.cursor = 'unset';
      element.style.pointerEvents = 'unset';
    };
  }, [targetRef]);

  return (
    <Handler>
      {
        <Moveable
          // see https://github.com/daybrush/moveable/tree/master/packages/react-moveable#react-18-concurrent-mode
          flushSync={flushSync}
          ref={moveableRef}
          target={targetRef}
          origin={false}
          hideDefaultLines={true}
          draggable={true}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        ></Moveable>
      }
    </Handler>
  );
};
