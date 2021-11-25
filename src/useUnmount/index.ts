import { useEffect, useRef } from 'react';

type UnmountHandler = () => void;

const useUnmount = (fn: UnmountHandler) => {
  const cachedFn = useRef<UnmountHandler>();

  useEffect(() => {
    cachedFn.current = fn;
  }, [fn]);

  useEffect(() => () => cachedFn.current && cachedFn.current(), []);
};

export default useUnmount;
