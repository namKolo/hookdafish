import { useLayoutEffect, useState } from 'react';

type IValue<T> = T | undefined;
type UnsubscribeFn = () => void;
type Listener<T> = (value: T) => void;

export interface Observable<IValue> {
  subscribe: (
    listener: Listener<IValue>
  ) => {
    unsubscribe: UnsubscribeFn;
  };
}

function useObservable<T>(stream$: Observable<IValue<T>>): IValue<T> {
  const [value, update] = useState<T>();

  useLayoutEffect(() => {
    const s = stream$.subscribe(update);
    return () => s.unsubscribe();
  }, [stream$]);

  return value;
}

export default useObservable;
