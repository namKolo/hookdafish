import { RefObject } from 'react';

type TargetValue<T> = T | undefined | null;
export type ElementTarget = HTMLElement | RefObject<TargetValue<HTMLElement>>;

export type RenderFunc<T> = (
  item: T,
  index: number,
  props: { style?: React.CSSProperties }
) => React.ReactNode;

export function getElementTarget(e: ElementTarget) {
  if ('current' in e) {
    return e.current;
  }

  return e;
}
