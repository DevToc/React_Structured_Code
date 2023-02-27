import { RefObject, useEffect, useRef } from 'react';
import { EditorCustomEventMap } from 'types/event.types';

export const useEventListener = <
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KE extends keyof EditorCustomEventMap,
  T extends HTMLElement | void = void,
>(
  eventName: KW | KH | KE,
  handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | EditorCustomEventMap[KE] | Event) => void,
  element?: RefObject<T>,
) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: T | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) return;

    const eventListener: typeof handler = (event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};
