import React, { useRef } from 'react';
import { RenderFunc } from '../utils/dom';

import useVirtualList from './useVirtualList';

interface IVirtualList<T> {
  items: T[];
  renderItem: RenderFunc<T>;
  containerStyle: React.CSSProperties;
  itemHeight: number;
  overscan: number;
}

function VirtualList<T>(props: IVirtualList<T>) {
  const { items, renderItem, containerStyle } = props;
  const { overscan, itemHeight } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { isItemVisible } = useVirtualList({
    containerRef: containerRef,
    listRef: listRef,
    itemHeight,
    overscan,
    numOfItems: items.length,
  });

  return (
    <div ref={containerRef} style={containerStyle}>
      <div ref={listRef}>
        {items
          .filter((_, index) => isItemVisible(index))
          .map((item, index) => renderItem(item, index, {}))}
      </div>
    </div>
  );
}

export default VirtualList;
