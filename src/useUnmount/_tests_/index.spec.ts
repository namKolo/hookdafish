import { renderHook } from '@testing-library/react-hooks';

import useUnmount from '../index';

describe('useUnmount', () => {
  test('import useUnmount from "hookdafish/useUnmount"', () => {
    expect(typeof useUnmount).toBe('function');
  });

  test('Should trigger FN when unmount', () => {
    const fn = jest.fn<void, any>();
    const res = renderHook(() => {
      useUnmount(fn);
    });

    res.unmount();
    expect(fn).toBeCalledTimes(1);
  });

  test('Should call exactly FN when unmount', () => {
    const fn1 = jest.fn<void, any>();
    const fn2 = jest.fn<void, any>();

    let count = 0;
    const res = renderHook(() => {
      count++;
      useUnmount(count === 1 ? fn1 : fn2);
    });

    res.rerender();

    res.unmount();
    expect(fn1).not.toBeCalled();
    expect(fn2).toBeCalledTimes(1);
  });
});
