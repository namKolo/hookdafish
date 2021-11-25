import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import useEventListener from './index';

const createDumpTarget = () => {
  const childElement = document.createElement('div');
  jest.spyOn(childElement, 'addEventListener');
  const ref = React.useRef(childElement);
  return ref;
};

describe('usEventListener', () => {
  test('import useEventListener from "hookdafish/useEventListener"', () => {
    expect(typeof useEventListener).toBe('function');
  });

  test('Should call the handler as expected', async () => {
    const childEventListener = jest.fn<void, [Event]>();
    const childElement = createDumpTarget();
    renderHook(() => {
      useEventListener(childElement, 'click', childEventListener);
    });

    fireEvent.click(childElement.current);
    expect(childEventListener).toHaveBeenCalledTimes(1);
  });

  test('Should not re-attach handler when re-render', async () => {
    const childEventListener = jest.fn<void, [Event]>();
    const childElement = createDumpTarget();

    const { rerender } = renderHook(() => {
      useEventListener(childElement, 'click', childEventListener);
    });

    fireEvent.click(childElement.current);
    rerender();
    expect(childElement.current.addEventListener).toHaveBeenCalledTimes(1);
    expect(childEventListener).toHaveBeenCalledTimes(1);
  });

  test('Should update event listener without rebinding (change event listener)', async () => {
    const event1 = jest.fn<void, [Event]>();
    const event2 = jest.fn<void, [Event]>();
    const childElement = createDumpTarget();
    let count = 0;
    const { rerender } = renderHook(() => {
      count++;
      useEventListener(childElement, 'click', event1);
    });

    fireEvent.click(childElement.current);
    rerender();
    fireEvent.click(childElement.current);

    //  binding  only once
    expect(childElement.current.addEventListener).toHaveBeenCalledTimes(1);
    // call event 1 for first time
    expect(event1).toHaveBeenCalledTimes(1);
    // call event 2 as expected
    expect(event2).toHaveBeenCalledTimes(1);
  });
});
