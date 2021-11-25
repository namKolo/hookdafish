import { RefObject } from 'react';

type TargetValue<T> = T | undefined | null;
export type ElementTarget = RefObject<TargetValue<HTMLElement>>;

export type RenderFunc<T> = (
  item: T,
  index: number,
  props: { style?: React.CSSProperties }
) => React.ReactNode;
