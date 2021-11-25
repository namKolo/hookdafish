import { useEffect, useMemo, useState } from 'react';
import useEventListener from '../useEventListener';
import { ElementTarget, getElementTarget } from '../utils/dom';

interface IUseVirtualList {
  containerRef: ElementTarget;
  listRef: ElementTarget;
  numOfItems: number;
  itemHeight: number;
  overscan?: number;
}

function useVirtualList(params: IUseVirtualList) {
  const {
    containerRef,
    listRef,
    numOfItems,
    itemHeight,
    overscan = 5,
  } = params;
  // TrIcK - forceUpdate to trigger re-render the list
  const [, forceUpdate] = useState(0);

  // the maximum height of the wrapper list
  const totalHeight = useMemo(() => numOfItems * itemHeight, [
    numOfItems,
    itemHeight,
  ]);

  // Make sure the container is scrollable
  useEffect(() => {
    const container = getElementTarget(containerRef);
    if (container) {
      container.style.overflow = 'auto';
    }
  }, [containerRef]);

  /**
   * | --------------------- |
   * |                       |
   * |                       | -> buffer items (overscan) (offset - overscan) (START)
   * |                       |
   * | ---- Our Container ---|  -> offset
   * |                       |
   * |                       |
   * | -----End Container ---| => visible count
   * |                       |
   * |                       | -> buffer items (overscan) (offset + visible count + overscan) (END)
   * |                       |
   * |-----------------------|
   */
  const getVisibleRange = () => {
    // Resolve the HtmlElement
    const container = getElementTarget(containerRef);
    const wrapper = getElementTarget(listRef);

    if (!container || !wrapper) {
      return { start: 0, end: overscan };
    }

    const { scrollTop, clientHeight } = container;

    // get the current offset - the item index
    const offset = Math.floor(scrollTop / itemHeight) + 1;

    // the minimum of items should be rendered to fill the container height;
    const visibleCount = Math.ceil(clientHeight / itemHeight);

    const start = Math.max(offset - overscan, 0);
    const end = Math.min(offset + visibleCount + overscan, numOfItems);

    return { start, end };
  };

  const updateWrapperPosition = () => {
    const container = getElementTarget(containerRef);
    const wrapper = getElementTarget(listRef);

    if (container && wrapper) {
      const { start } = getVisibleRange();
      const offsetTop = start * itemHeight;

      // TRICK - updating the list wrapper to maintain the correct scroll position
      wrapper.style.height = totalHeight - offsetTop + 'px';
      wrapper.style.marginTop = offsetTop + 'px';

      // trigger re-render the list
      forceUpdate(start);
    }
  };

  const isItemVisible = (index: number) => {
    const { start, end } = getVisibleRange();
    return index >= start && index < end;
  };

  // attach scroll handler
  useEventListener(containerRef, 'scroll', (e: Event) => {
    e.preventDefault();
    updateWrapperPosition();
  });

  return { isItemVisible };
}

export default useVirtualList;
