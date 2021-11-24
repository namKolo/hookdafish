import { useEffect, useMemo, useRef } from 'react';

type AttachOptions = Pick<
  AddEventListenerOptions,
  'capture' | 'passive' | 'once'
>;

type EventHandler = (event: Event) => void;

type HookProps = {
  eventName: keyof WindowEventMap | string;
  handler: EventHandler;
  element?: HTMLElement;
  options?: AttachOptions;
};

function useEventListener({ eventName, handler, element, options }: HookProps) {
  const cachedHandler = useRef<EventHandler>();

  useEffect(() => {
    cachedHandler.current = handler;
  }, [handler]);

  const memorizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const targetedElement = element;
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
