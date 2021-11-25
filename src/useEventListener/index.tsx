import { useEffect, useMemo, useRef } from 'react';
import { ElementTarget, getElementTarget } from '../utils/dom';

type AttachOptions = Pick<
  AddEventListenerOptions,
  'capture' | 'passive' | 'once'
>;
type EventHandler = (event: Event) => void;

function useEventListener(
  element: ElementTarget,
  eventName: string,
  handler: EventHandler,
  options?: AttachOptions
) {
  const cachedHandler = useRef<EventHandler>();

  useEffect(() => {
    cachedHandler.current = handler;
  }, [handler]);

  const memorizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const targetedElement = getElementTarget(element);
    if (!targetedElement || !targetedElement.addEventListener) {
      return;
    }

    const eventListener = (e: Event) => {
      if (!!cachedHandler?.current) {
        cachedHandler.current(e);
      }
    };

    targetedElement.addEventListener(
      eventName,
      eventListener,
      memorizedOptions
    );

    return () => {
      targetedElement.removeEventListener(
        eventName,
        eventListener,
        memorizedOptions
      );
    };
  }, [eventName, element, memorizedOptions]);
}

export default useEventListener;
