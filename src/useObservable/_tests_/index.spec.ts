import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { Subject } from 'rxjs';
import useObservable, { Observable } from '../index';

const setUpObservable = (observable: Observable<any>) =>
  renderHook(() => useObservable(observable));

describe('useObservable', () => {
  test('import useObservable from "hookdafish/useObservable"', () => {
    expect(typeof useObservable).toBe('function');
  });

  test('Should useLayoutEffect to subscribe synchronously', () => {
    const stream$ = new Subject();
    const fn = jest.spyOn(React, 'useLayoutEffect');
    expect(fn).toHaveBeenCalledTimes(0);
    setUpObservable(stream$);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('Should subscribe to observable only once', () => {
    const stream$ = new Subject();
    const subscribeFn = jest.spyOn(stream$, 'subscribe');
    expect(subscribeFn).not.toHaveBeenCalled();

    setUpObservable(stream$);
    expect(subscribeFn).toHaveBeenCalledTimes(1);

    act(() => stream$.next(10));
    act(() => stream$.next(20));
    act(() => stream$.next(30));

    expect(subscribeFn).toHaveBeenCalledTimes(1);
  });

  test('Should return the latest value from the stream', () => {
    const stream$ = new Subject();
    const { result } = setUpObservable(stream$);

    expect(result.current).toBeUndefined();

    act(() => stream$.next(10));
    expect(result.current).toEqual(10);

    act(() => stream$.next(12));
    expect(result.current).toEqual(12);
  });

  test('Should unsubscribe', () => {
    const stream$ = new Subject();

    const unsubscribeFn = jest.fn();
    stream$.subscribe = jest.fn().mockReturnValue({
      unsubscribe: unsubscribeFn,
    });

    const { unmount } = setUpObservable(stream$);

    act(() => stream$.next(10));
    expect(unsubscribeFn).not.toBeCalled();

    unmount();
    expect(unsubscribeFn).toBeCalledTimes(1);
  });
});
