import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import useEventListener from './index';

describe('usEventListener', () => {
  test('import useEventListener from "rockitto/useEventListener"', () => {
    expect(typeof useEventListener).toBe('function');
  });

  test('Should call the handler as expected', async () => {
    const childEventListener = jest.fn<void, [Event]>();
    const childElement = document.createElement('div');

    renderHook(() => {
      useEventListener({
        element: childElement,
        eventName: 'click',
        handler: childEventListener,
      });
    });

    fireEvent.click(childElement);
    expect(childEventListener).toHaveBeenCalledTimes(1);
  });

  test('Should not re-attach handler when re-render', async () => {
    const childEventListener = jest.fn<void, [Event]>();
    const childElement = document.createElement('div');

    jest.spyOn(childElement, 'addEventListener');

    const { rerender } = renderHook(() => {
      useEventListener({
        element: childElement,
        eventName: 'click',
        handler: childEventListener,
      });
    });

    fireEvent.click(childElement);
    rerender();
    expect(childElement.addEventListener).toHaveBeenCalledTimes(1);
    expect(childEventListener).toHaveBeenCalledTimes(1);
  });

  test('Should update event listener without rebinding', async () => {
    const event1 = jest.fn<void, [Event]>();
    const event2 = jest.fn<void, [Event]>();
    const childElement = document.createElement('div');

    jest.spyOn(childElement, 'addEventListener');

    let count = 0;
    const { rerender } = renderHook(() => {
      count++;
      useEventListener({
        element: childElement,
        eventName: 'click',
        handler: count === 1 ? event1 : event2,
      });
    });

    fireEvent.click(childElement);
    rerender();
    fireEvent.click(childElement);

    //  binding  only once
    expect(childElement.addEventListener).toHaveBeenCalledTimes(1);
    // call event 1 for first time
    expect(event1).toHaveBeenCalledTimes(1);
    // call event 2 as expected
    expect(event2).toHaveBeenCalledTimes(1);
  });
});
